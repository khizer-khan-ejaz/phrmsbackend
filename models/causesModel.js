import mongoose from "mongoose";

const causesSchema = mongoose.Schema({
    title : {type : String , required : true },
    desc : {type : String , required : true },
    img : {type : String , required : true }
} , {timestamps : true} )

const Cause = mongoose.model("cause" , causesSchema);
export default Cause