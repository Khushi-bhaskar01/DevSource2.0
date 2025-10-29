import mongoose from "mongoose";
const userTaskSchema = new mongoose.Schema({
    email:{type:String,required:true},
    taskid:{type:String,required:true},
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' }
});
const userTaskModel=mongoose.models.userTask|| mongoose.model('userTask',userTaskSchema);
export default userTaskModel;