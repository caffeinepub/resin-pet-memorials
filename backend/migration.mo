import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type OldAstCloudOrder = {
    id : Nat;
    owner : Principal;
    animal : Animal;
    headstoneDesign : HeadstoneDesign;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
    shippingAddress : Address;
    contactInfo : ContactInfo;
  };

  type NewAstCloudOrder = {
    id : Nat;
    owner : Principal;
    animal : Animal;
    headstoneDesign : HeadstoneDesign;
    paymentMethod : PaymentMethod;
    paymentStatus : PaymentStatus;
    shippingAddress : Address;
    buyerInfo : BuyerInfo;
    contactInfo : ContactInfo;
  };

  type OldActor = {
    orders : Map.Map<Nat, OldAstCloudOrder>;
  };

  type NewActor = {
    orders : Map.Map<Nat, NewAstCloudOrder>;
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

  public type PaymentStatus = {
    #pending;
    #completed : Text;
    #failed : Text;
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

  let defaultBuyerInfo = {
    firstName = "unknown";
    lastName = "unknown";
  };

  public func run(old : OldActor) : NewActor {
    let newOrders = old.orders.map<Nat, OldAstCloudOrder, NewAstCloudOrder>(
      func(_id, oldOrder) {
        {
          oldOrder with
          buyerInfo = defaultBuyerInfo;
        };
      }
    );
    { orders = newOrders };
  };
};
