// Convierte Mongoose documents a JSON con id en lugar de _id
const toJSON = (schema) => {
  schema.set("toJSON", {
    transform: (doc, ret) => {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    },
  });
};

export default toJSON;