import mongoose from "mongoose";

import make from "@/utils/make";
import generate from "@/utils/generate";
import validate from "@/utils/validate";
import { IBaseDocument } from "@/core/types/db-types";
import TDocument from "@/core/types/TDocument";

interface ICustomerSchema {
  name: string;
  phoneNumber: string;
  address: string;
}

export interface ICustomerDocument extends IBaseDocument, ICustomerSchema {
  toResponse: () => {
    defaultObject: () => unknown;
  };
}

export type TCustomerDocument = TDocument<ICustomerDocument>;

export interface ICustomerModel extends mongoose.Model<TCustomerDocument> {
  isValidId: (_id: string | mongoose.Types.ObjectId) => boolean;
}

const CustomerSchema = new mongoose.Schema<ICustomerDocument, ICustomerModel>(
  {
    name: {
      type: String,
      default: "",
      required: true
    },
    phoneNumber: {
      type: String,
      validate: {
        validator: (v: string) => {
          if (!v) return true;
          return validate.phoneNumber(v);
        },
        message: () => {
          return "Invalid phoneNumber";
        }
      },
      unique: true,
      sparse: true
    },
    address: {
      type: String,
      default: ""
    },
    ...generate.schemaDefaultDefinition()
  },
  {
    timestamps: true
  }
);

CustomerSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $type: "string", $ne: "" }
    }
  }
);
export default make.schema(CustomerSchema);
