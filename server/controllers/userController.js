import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

export const getUserData=async (req,res)=>{
    try{
        const {id}=req.user;
        const user = await userModel.findById(id);
        if(!user){
            return res.json({success:false,message:'User not found!'});
        }
        res.json({success:true,userData:{
            name:user.name,
            isAccountVerified:user.isAccountVerified
        }});
    }catch(error){
        res.json({success:false,message:error.message});
    }
}

export const getUserProfile = async (req, res) => {
  try {
    const user = await userModel.findById(req.params.id).populate("badges");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateUserProfile = async (req, res) => {
  try {
    // If password is being updated, hash it first
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 10);
    }

    const updated = await userModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


export const getLeaderboard = async (req, res) => {
  try {
    const users = await userModel.find().sort({ points: -1 }).limit(20);
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
