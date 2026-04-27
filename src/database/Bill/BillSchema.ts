import mongoose from "mongoose";

import make from "@/utils/make";
import generate from "@/utils/generate";
import validate from "@/utils/validate";
import { IBaseDocument } from "@/core/types/db-types";
import TDocument from "@/core/types/TDocument";
import { EPaymentMethod } from "@/types/enum";

interface IBillSchema {
  code: string;
  customer: {
    customerId: mongoose.Types.ObjectId | null;
    name: string;
    phoneNumber: string;
    address: string;
  };

  employeeId: mongoose.Types.ObjectId;

  items: {
    menuItemId: mongoose.Types.ObjectId;
    name: string;
    quantity: number;
    price: number;
    discount: number;
    total: number;
  }[];

  totalQuantity: number;
  totalAmount: number;
  discount: number;
  finalAmount: number;

  paymentMethod: EPaymentMethod;
  cashReceived: number;
}

export interface IBillDocument extends IBaseDocument, IBillSchema {
  toResponse: () => {
    defaultObject: () => unknown;
  };
}

export type TBillDocument = TDocument<IBillDocument>;

export interface IBillModel extends mongoose.Model<IBillDocument> {
  isValidId: (_id: string | mongoose.Types.ObjectId) => boolean;
}

const BillSchema = new mongoose.Schema<IBillDocument, IBillModel>(
  {
    code: {
      type: String,
      default: "",
      required: true
    },
    customer: {
      customerId: {
        type: mongoose.Schema.Types.ObjectId,
        default: null,
        ref: "Customer"
      },
      name: {
        type: String,
        default: ""
        // required: true
      },
      phoneNumber: {
        type: String,
        validate: {
          validator: (v: string) => {
            return validate.phoneNumber(v);
          }
        }
      },
      address: {
        type: String,
        default: ""
      }
    },
    employeeId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
      ref: "Employee"
    },
    items: [
      {
        menuItemId: {
          type: mongoose.Types.ObjectId,
          default: null,
          ref: "MenuItem"
        },
        name: {
          type: String,
          default: "",
          required: true
        },
        quantity: {
          type: Number,
          default: 0,
          required: true
        },
        price: {
          type: Number,
          default: 0,
          required: true
        },
        discount: {
          type: Number,
          default: 0,
          required: true
        },
        total: {
          type: Number,
          default: 0,
          required: true
        }
      }
    ],
    totalQuantity: {
      type: Number,
      default: 0,
      required: true
    },
    totalAmount: {
      type: Number,
      default: 0,
      required: true
    },
    discount: {
      type: Number,
      default: 0
    },
    finalAmount: {
      type: Number,
      default: 0,
      required: true
    },
    paymentMethod: {
      type: String,
      enum: Object.values(EPaymentMethod),
      default: EPaymentMethod.CASH,
      required: true
    },
    cashReceived: {
      type: Number,
      default: 0,
      required: true
    },

    ...generate.schemaDefaultDefinition()
  },
  {
    timestamps: true
  }
);

export default make.schema(BillSchema);
