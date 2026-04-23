import mongoose from "mongoose";

import make from "@/utils/make";
import generate from "@/utils/generate";
import validate from "@/utils/validate";
import { IBaseDocument } from "@/core/types/db-types";
import TDocument from "@/core/types/TDocument";
import hashPassword from "@/utils/hashPassword";
import ENV from "@/core/ENV";

interface IEmployeeSchema {
  name: string;
  phoneNumber: string;
  password: string;
  address: string;
  level: string;
}

export interface IEmployeeDocument extends IBaseDocument, IEmployeeSchema {
  toResponse: () => {
    defaultObject: () => unknown;
  };
}

export type TEmployeeDocument = TDocument<IEmployeeDocument>;

export interface IEmployeeModel extends mongoose.Model<IEmployeeDocument> {
  isValidId: (_id: string | mongoose.Types.ObjectId) => boolean;
}

const EmployeeSchema = new mongoose.Schema<IEmployeeDocument, IEmployeeModel>(
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
    password: {
      type: String,
      default: hashPassword(ENV.DEFAULT_PASSWORD),
      required: true
    },
    level: {
      type: String,
      required: true
    },
    ...generate.schemaDefaultDefinition()
  },
  {
    timestamps: true
  }
);

EmployeeSchema.index(
  { phoneNumber: 1 },
  {
    unique: true,
    partialFilterExpression: {
      phoneNumber: { $type: "string", $ne: "" }
    }
  }
);
export default make.schema(EmployeeSchema);
