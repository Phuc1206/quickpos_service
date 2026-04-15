import MenuItemSchema, {
  IMenuItemDocument,
  IMenuItemModel,
  TMenuItemDocument
} from "@/database/MenuItem/MenuItemSchema";
import mongoose from "mongoose";

MenuItemSchema.methods.toResponse = function (this: TMenuItemDocument) {
  return {
    defaultObject: () => {
      return {
        _id: this._id.toString(),
        name: this.name,
        price: this.price,
        image: this.image,

        createdAt: this.createdAt
      } as unknown;
    }
  };
};

MenuItemSchema.statics.isValidId = function (_id: string | mongoose.Types.ObjectId): boolean {
  if (!mongoose.Types.ObjectId.isValid(_id)) {
    return false;
  }

  return true;
};

const MenuItem = mongoose.model<IMenuItemDocument, IMenuItemModel>("MenuItem", MenuItemSchema);

export default MenuItem;
