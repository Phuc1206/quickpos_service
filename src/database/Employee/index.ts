import EmployeeSchema, {
  IEmployeeDocument,
  IEmployeeModel,
  TEmployeeDocument
} from "@/database/Employee/EmployeeSchema";
import mongoose from "mongoose";

EmployeeSchema.methods.toResponse = function (this: TEmployeeDocument) {
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

EmployeeSchema.statics.isValidId = function (_id: string | mongoose.Types.ObjectId): boolean {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return false;
  }

  return true;
};

const Employee = mongoose.model<IEmployeeDocument, IEmployeeModel>("Employee", EmployeeSchema);

export default Employee;
