import mongoose from "mongoose";

const blogSchema = new mongoose.Schema({
    date: {
        day: { type: Number, required: true },
        month: { 
            type: String, 
            enum: ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], 
            required: true
        },
        year: { type: Number, required: true }
    },
    img : {type : String , required : true},
    title: { type: String, required: true },
    desc: { type: String, required: true }
}, { timestamps: true });

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
