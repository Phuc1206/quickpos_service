import mongoose from "mongoose";

import make from "@/utils/make";
import generate from "@/utils/generate";
import { IBaseDocument } from "@/core/types/db-types";
import TDocument from "@/core/types/TDocument";

interface IMenuItemSchema {
  name: string;
  price: number;
  image: string;
  publicId: string;
}

export interface IMenuItemDocument extends IBaseDocument, IMenuItemSchema {
  toResponse: () => {
    defaultObject: () => unknown;
  };
}

export type TMenuItemDocument = TDocument<IMenuItemDocument>;

export interface IMenuItemModel extends mongoose.Model<IMenuItemDocument> {
  isValidId: (_id: string | mongoose.Types.ObjectId) => boolean;
}

const MenuItemSchema = new mongoose.Schema<IMenuItemDocument, IMenuItemModel>(
  {
    name: {
      type: String,
      default: "",
      required: true
    },
    price: {
      type: Number,
      default: 0,
      required: true
    },
    image: {
      type: String,
      default: ""
    },
    publicId: {
      type: String,
      default: ""
    },
    ...generate.schemaDefaultDefinition()
  },
  {
    timestamps: true
  }
);

export default make.schema(MenuItemSchema);
