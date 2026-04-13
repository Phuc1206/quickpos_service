import BillSchema, { IBillDocument, IBillModel, TBillDocument } from "@/database/Bill/BillSchema";
import mongoose from "mongoose";

BillSchema.methods.toResponse = function (this: TBillDocument) {
  return {
    defaultObject: () => {
      return {
        _id: this._id.toString(),
        code: this.code,
        createdAt: this.createdAt
      } as unknown;
    }
  };
};

BillSchema.statics.isValidId = function (_id: string | mongoose.Types.ObjectId): boolean {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return false;
  }

  return true;
};

const Bill = mongoose.model<IBillDocument, IBillModel>("Bill", BillSchema);

export default Bill;
