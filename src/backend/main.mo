import Map "mo:core/Map";
import Text "mo:core/Text";


import MixinStorage "blob-storage/Mixin";
import Storage "blob-storage/Storage";


actor {
  include MixinStorage();

  let uploads = Map.empty<Text, Storage.ExternalBlob>();

  public shared ({ caller }) func storePhoto(name : Text, blob : Storage.ExternalBlob) : async () {
    uploads.add(name, blob);
  };
};

