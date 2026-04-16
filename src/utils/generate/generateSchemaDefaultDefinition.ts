import mongoose from "mongoose";

const generateSchemaDefaultDefinition = () => {
  return {
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      immutable: true
    },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      immutable: true
    },
    isDelete: {
      type: Boolean,
      default: false
    },
    deletedAt: {
      type: Date
    }
  };
};

export default generateSchemaDefaultDefinition;
