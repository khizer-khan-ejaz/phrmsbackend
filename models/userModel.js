import mongoose, { Schema } from "mongoose";

const userSchema = new Schema({
    email : {type : String , required : true},
    password : {type : String , required : true},
    token : {type : String},
} , {timestamps : true});

const User = mongoose.model("user" , userSchema);

export default User;