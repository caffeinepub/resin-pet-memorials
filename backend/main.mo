import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Iter "mo:core/Iter";
import Runtime "mo:core/Runtime";
import MixinStorage "blob-storage/Mixin";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import Migration "migration";
import Storage "blob-storage/Storage";
import Stripe "stripe/stripe";
import OutCall "http-outcalls/outcall";

(with migration = Migration.run)
actor {
  type UserProfile = {
    name : Text;
    email : Text;
  };

  type Animal = {
    name : Text;
    birthDate : Nat;
    deathDate : Nat;
    photo : ?Storage.ExternalBlob;
  };

  type HeadstoneDesign = {
    peninsulaFrame : Storage.ExternalBlob;
    ovalFrame : Storage.ExternalBlob;
    squareFrame : Storage.ExternalBlob;
    roundFrame : Storage.ExternalBlob;
    headstoneFrame : Storage.ExternalBlob;
  };

  type PaymentStatus = {
    #pending;
    #completed : Text;
    #failed : Text;
  };

  public type PaymentMethod = {
    #stripe;
    #paypal;
    #crypto;
  };

  public type Address = {
    streetAddress : Text;
    addressLine2 : ?Text;
    city : Text;
    stateOrProvince : Text;
    postalCode : Text;
    country : Text;
    phoneNumber : Text;
  };

  public type ContactInfo = {
    email : Text;
    phoneNumber : Text;
  };

  public type BuyerInfo = {
    firstName : Text;
    lastName : Text;
  };

  public type AstCloudOrder = {
    id : Nat;
    owner : Principal;
    animal : Animal;
    headstoneDesign : HeadstoneDesign;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
    shippingAddress : Address;
    buyerInfo : BuyerInfo; // new field
    contactInfo : ContactInfo;
  };

  include MixinStorage();

  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  var nextOrderId = 1;
  let orders = Map.empty<Nat, AstCloudOrder>();
  let userProfiles = Map.empty<Principal, UserProfile>();

  /// Returns the current user's profile if they are a user.
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  /// Returns a specified user's profile if the caller has permission.
  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  /// Saves the current user's profile if they are a user.
  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // The getOrders function returns all orders for admins and only the caller's own orders for non-admin users.
  public query ({ caller }) func getOrders() : async [AstCloudOrder] {
    let allOrders = orders.values().toArray();

    if (AccessControl.isAdmin(accessControlState, caller)) {
      return allOrders;
    };

    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can view orders");
    };

    let userOrders = Array.filter(
      allOrders,
      func(order) { order.owner == caller }
    );
    userOrders;
  };

  // The submitOrder function processes orders, associating them with the caller and including
  // a buyerInfo object within the order.
  public shared ({ caller }) func submitOrder(
    animalName : Text,
    birthDate : Nat,
    deathDate : Nat,
    paymentMethod : PaymentMethod,
    photo : Storage.ExternalBlob,
    peninsulaFrame : Storage.ExternalBlob,
    ovalFrame : Storage.ExternalBlob,
    squareFrame : Storage.ExternalBlob,
    roundFrame : Storage.ExternalBlob,
    headstoneFrame : Storage.ExternalBlob,
    shippingAddress : Address,
    buyerInfo : BuyerInfo,
    contactInfo : ContactInfo,
  ) : async Nat {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can submit orders");
    };

    let animal = {
      name = animalName;
      birthDate;
      deathDate;
      photo = ?photo;
    };

    let headstoneDesign = {
      peninsulaFrame;
      ovalFrame;
      squareFrame;
      roundFrame;
      headstoneFrame;
    };

    let order : AstCloudOrder = {
      id = nextOrderId;
      owner = caller;
      animal;
      headstoneDesign;
      paymentMethod;
      paymentStatus = #pending;
      shippingAddress;
      buyerInfo = buyerInfo;
      contactInfo;
    };

    orders.add(nextOrderId, order);
    nextOrderId += 1;

    order.id;
  };

  /// Retrieves all headstone designs.
  public query func getAllHeadstoneDesigns() : async [HeadstoneDesign] {
    let allOrders = orders.values().toArray();
    allOrders.map(func(order) { order.headstoneDesign });
  };

  // Stripe Integration using the component's core functionalities

  var stripeConfiguration : ?Stripe.StripeConfiguration = null;

  public query func isStripeConfigured() : async Bool {
    stripeConfiguration != null;
  };

  public shared ({ caller }) func setStripeConfiguration(config : Stripe.StripeConfiguration) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #admin))) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    stripeConfiguration := ?config;
  };

  func getStripeConfiguration() : Stripe.StripeConfiguration {
    switch (stripeConfiguration) {
      case (null) { Runtime.trap("Stripe needs to be first configured") };
      case (?value) { value };
    };
  };

  public func getStripeSessionStatus(sessionId : Text) : async Stripe.StripeSessionStatus {
    await Stripe.getSessionStatus(getStripeConfiguration(), sessionId, transform);
  };

  public shared ({ caller }) func createCheckoutSession(items : [Stripe.ShoppingItem], successUrl : Text, cancelUrl : Text) : async Text {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can create checkout sessions");
    };
    await Stripe.createCheckoutSession(getStripeConfiguration(), caller, items, successUrl, cancelUrl, transform);
  };

  public query func transform(input : OutCall.TransformationInput) : async OutCall.TransformationOutput {
    OutCall.transform(input);
  };
};
