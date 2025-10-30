import mongoose from "mongoose";

const adminConfigSchema = new mongoose.Schema({
  admins: {
    type: [String],
    default: []
  }
});

const adminConfigModel = mongoose.models.adminConfig || mongoose.model("adminConfig", adminConfigSchema);
export default adminConfigModel;
