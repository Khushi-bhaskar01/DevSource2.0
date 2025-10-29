import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    verifyOtp:{type:String,default:''},
    verifyOtpExpireAt:{type:Number,default:0},
    resetOtp:{type:String,default:''},
    resetOtpExpireAt:{type:Number,default:0},
    badges:{type:Number,default:0},
    aboutMe:{type:String,default:''},
    linkedin:{type:String,default:''}, 
    github:{type:String,default:''}, 
    domain:{type:String,default:''},
    loaction:{type:String,default:''},
    branch:{type:String,default:''}, 
    year:{type:String,default:''}, 
    profilePicture:{type:Number,default:''}, 
    admin:{type:Boolean,default:false}
});
const userModel=mongoose.models.user|| mongoose.model('users',userSchema);
export default userModel;