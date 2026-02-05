import mongoose from "mongoose";

const gallerySchema = mongoose.Schema({
    img : {type : String},
} , {timestamps : true});

const Gallery = mongoose.model("gallery" , gallerySchema);
export default Gallery;