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
    images: [{
      url: {
        type: String,
        required: true,
      },
      publicId: {
        type: String,
        required: true,
      },
      width: Number,
      height: Number,
      isMain: {
        type: Boolean,
        default: false,
      }
    }],
    colors: [{
      type: String,
      required: true,
    }],
    sizes: [{
      name: {
        type: String,
        required: true,
      },
      measurements: {
        busto: String,
        bajoBusto: String,
        cintura: String,
        cadera: String,
        largo: String,
      }
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
    isOnSale: {
      type: Boolean,
      default: false,
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