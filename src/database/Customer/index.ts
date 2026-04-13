import CustomerSchema, {
  ICustomerDocument,
  ICustomerModel,
  TCustomerDocument
} from "@/database/Customer/CustomerSchema";

import mongoose from "mongoose";

CustomerSchema.methods.toResponse = function (this: TCustomerDocument) {
  return {
    defaultObject: () => {
      return {
        _id: this._id.toString(),
        name: this.name,
        phoneNumber: this.phoneNumber,
        address: this.address,
        createdAt: this.createdAt
      } as unknown;
    }
  };
};

CustomerSchema.statics.isValidId = function (_id: string | mongoose.Types.ObjectId): boolean {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return false;
  }

  return true;
};

const Customer = mongoose.model<ICustomerDocument, ICustomerModel>("Customer", CustomerSchema);

export default Customer;
