import mongoose from "mongoose";
const taskSchema = new mongoose.Schema({
    domain:{type:String,required:true},
    taskid:{type:String,required:true},
    title:{type:String,required:true},
    description:{type:String,default:''},
    users:{type:String,default:''},
    points:{type:Number,default:0}
});
const taskModel=mongoose.models.task|| mongoose.model('tasks',taskSchema);
export default taskModel;