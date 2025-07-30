import mongoose from "mongoose";
import toJSON from "./plugins/toJSON.js";

// SALE TIMER SCHEMA
const saleTimerSchema = mongoose.Schema(
  {
    endDate: {
      type: Date,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    message: {
      type: String,
      default: "¡Ofertas por tiempo limitado!",
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

// Asegurar que solo haya un timer activo a la vez
saleTimerSchema.pre('save', async function(next) {
  if (this.isActive) {
    await mongoose.model('SaleTimer').updateMany(
      { _id: { $ne: this._id } },
      { isActive: false }
    );
  }
  next();
});

// add plugin that converts mongoose to json
saleTimerSchema.plugin(toJSON);

export default mongoose.models.SaleTimer || mongoose.model("SaleTimer", saleTimerSchema);