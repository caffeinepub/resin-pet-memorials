import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Storage "blob-storage/Storage";

module {
  type UserProfile = {
    name : Text;
    email : Text;
  };

  type Animal = {
    name : Text;
    birthDate : Nat;
    passingDate : ?Nat;
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

  type PaymentMethod = {
    #stripe;
    #paypal;
    #crypto;
  };

  type Address = {
    streetAddress : Text;
    addressLine2 : ?Text;
    city : Text;
    stateOrProvince : Text;
    postalCode : Text;
    country : Text;
    phoneNumber : Text;
  };

  type ContactInfo = {
    email : Text;
    phoneNumber : Text;
  };

  type BuyerInfo = {
    firstName : Text;
    lastName : Text;
  };

  type AstCloudOrder = {
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
    nextOrderId : Nat;
    orders : Map.Map<Nat, AstCloudOrder>;
    userProfiles : Map.Map<Principal, UserProfile>;
  };

  type BlobSlot = {
    key : Text;
    blob : Storage.ExternalBlob;
    name : Text;
  };

  type NewActor = {
    nextOrderId : Nat;
    orders : Map.Map<Nat, AstCloudOrder>;
    userProfiles : Map.Map<Principal, UserProfile>;
    blobSlots : Map.Map<Text, BlobSlot>;
  };

  public func run(old : OldActor) : NewActor {
    { old with blobSlots = Map.empty<Text, BlobSlot>() };
  };
};
