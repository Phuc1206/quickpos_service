import mongoose from "mongoose";

import make from "@/utils/make";
import generate from "@/utils/generate";
import validate from "@/utils/validate";
import { IBaseDocument } from "@/core/types/db-types";
import TDocument from "@/core/types/TDocument";

interface IEmployeeSchema {
  name: string;
  phoneNumber: string;
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
          return validate.phoneNumber(v);
        },
        message: () => {
          return "Invalid phoneNumber";
        }
      }
    },
    address: {
      type: String,
      default: ""
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

export default make.schema(EmployeeSchema);
