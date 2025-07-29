import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

// PRODUCT SCHEMA
const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    originalPrice: {
      type: Number,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: ["Conjuntos", "Brasieres", "Bodies", "Básicos", "Premium"],
    },
    image: {
      type: String,
      default: null,
    },
    colors: [{
      type: String,
      required: true,
    }],
    sizes: [{
      type: String,
      required: true,
    }],
    isNew: {
      type: Boolean,
      default: false,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inStock: {
      type: Boolean,
      default: true,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// add plugin that converts mongoose to json
productSchema.plugin(toJSON);

export default mongoose.models.Product || mongoose.model("Product", productSchema);