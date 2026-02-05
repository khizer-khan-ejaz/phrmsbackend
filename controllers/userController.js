import { uploadOnCloudinary } from "../utils/cloudinary.js";
import Blog from "../models/BlogModel.js";
import Gallery from "../models/galleryModel.js";
import { monthConverter } from "../utils/dateConverter.js";
import { v2 as cloudinary } from "cloudinary";
import Event from "../models/EventModel.js";
import Cause from "../models/causesModel.js";
import User from "../models/userModel.js";
import bcrypt from "bcrypt";
import generateAndSetJWTtoken from "../utils/generateToken.js";

const userController = () => {
    return {
        galleryImageUpload: async (req, res) => {
            try {

                if (!req.file) return res.json({ error: "image is not uploaded" });
                const result = await uploadOnCloudinary(req.file.path);
                var public_id = result.public_id;
                const imgUrl = result.url;

                const gallery = new Gallery({
                    img: imgUrl
                })

                await gallery.save();

                return res.json({ success: "image stored in gallery", galleryImage: gallery });
            } catch (err) {
                // If an error occurs, delete the uploaded image from Cloudinary

                if (public_id) {
                    await cloudinary.uploader.destroy(public_id, function (error, result) {
                        console.log(result, error);
                    });
                }
                return res.status(401).json({ error: err.message });
            }

        },

        getGalleryImages: async (req, res) => {
            try {

                const galleryImages = await Gallery.find({});
                return res.json({ success: "gallery images", galleryImages });

            } catch (err) {
                return res.status(401).json({ error: err.message });
            }
        },

        deleteGalleryImage: async (req, res) => {
            try {
                const { imageId } = req.params;
                await Gallery.deleteOne({ _id: imageId });
                return res.json({ success: "image deleted" });

            } catch (err) {
                return res.json({ err: err.message });
            }
        },

        blogUpload: async (req, res) => {

            try {

                const { title, desc, year, day, month, img } = req.body;
                const monthText = monthConverter(month);

                if (!req.file) return res.json({ error: "image is mandatory" });

                if (!title || !desc || !year || !day || !month) return res.json({ error: "all fields are required" });

                const result = await uploadOnCloudinary(req.file.path);
                var public_id = result.public_id;

                const blog = new Blog({
                    title, desc, img: result.url,
                    date: {
                        day,
                        month: monthText,
                        year,
                    }
                })

                await blog.save();


                return res.json({ success: "new blog created", blog });

            } catch (err) {

                // If an error occurs, delete the uploaded image from Cloudinary

                if (public_id) {
                    await cloudinary.uploader.destroy(public_id, function (error, result) {
                        console.log(result, error);
                    });
                }
                return res.json({ error: err.message });
            }
        },

        getBlogs: async (req, res) => {
            try {

                const blogs = await Blog.find({});
                return res.json({ success: "blog fetched", blogs });

            } catch (err) {
                return res.json({ error: err.message });
            }
        },

        deleteBlog: async (req, res) => {

            try {

                const { blogId } = req.params;

                const blog = await Blog.findById(blogId);
                if (!blog) return res.json({ error: "blog not found" });

                const public_id = blog.img.split('/').pop().split('.')[0];

                await Blog.deleteOne({ _id: blogId });
                return res.json({ success: "blog deleted" });

            } catch (err) {
                return res.json({ err: err.message });
            }

        },

        createEvent: async (req, res) => {

            try {

                let { title, startTime, endTime, venue, desc, day, month, year } = req.body;

                startTime = JSON.parse(startTime);
                endTime = JSON.parse(endTime);


                if (!title, !startTime, !endTime, !venue, !desc, !day, !month, !year) return res.staus(401).json({ error: "all fields are required" });

                const monthText = monthConverter(month);
                const result = await uploadOnCloudinary(req.file.path);
                var public_id = result.public_id;

                const event = new Event({
                    title,
                    eventDate: {
                        day, month: monthText, year
                    },
                    desc,
                    startTime,
                    endTime,
                    venue,
                    img: result.url,
                })

                await event.save();

                return res.status(200).json({ success: "new event created" , event });

            } catch (err) {

                // if there comes any error , then the image that is uploaded is deleted
                if (public_id) {
                    await cloudinary.uploader.destroy(public_id, function (error, result) {
                        console.log("image deleted successfully");
                    });
                }
                return res.json({ error: err.message });
            }

        },

        getEvents: async (req, res) => {
            try {
                const events = await Event.find({});
                return res.json({ success: "all events", events });

            } catch (err) {
                console.log(err.message);
                return res.json({ error: err.message });
            }
        },

        createCause: async (req, res) => {
            try {

                const { title, desc } = req.body;
                const result = await uploadOnCloudinary(req.file.path);
                var public_id = result.public_id;
                const imgUrl = result.url;

                const cause = new Cause({
                    title, desc,
                    img: imgUrl
                })

                await cause.save();
                return res.json({ success: "new cause created", cause });

            } catch (err) {
                // If an error occurs, delete the uploaded image from Cloudinary

                if (public_id) {
                    await cloudinary.uploader.destroy(public_id, function (error, result) {
                        console.log(result, error);
                    });
                }
                return res.status(400).json({ error: err.message });
            }
        },

        getCause: async (req, res) => {
            try {

                const causes = await Cause.find({});
                return res.status(200).json({ success: "all causes fetched", causes });

            } catch (err) {
                return res.status(400).json({ error: err.message })
            }
        },

        deleteCause: async (req, res) => {
            try {

                const { causeId } = req.params;

                const cause = await Cause.findById(causeId);
                if (!cause) return res.json({ error: "cause not found" });

                const public_id = cause.img.split('/').pop().split('.')[0];
                console.log(public_id);

                // deleting the image from cloudinary's server
                if (public_id) {
                    await cloudinary.uploader.destroy(public_id, function (error, result) {
                        console.log("image deleted successfully");
                    });
                }

                await Cause.deleteOne({ _id: causeId });
                return res.json({ success: "cause deleted" });

            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        },

        login: async (req, res) => {
            try {

                const { email, password } = req.body;
                if (!email || !password) return res.status(401).json({ error: "all fields are required" });

                const user = await User.findOne({ email });
                if (!user) return res.json({ error: "user not stored in db" });

                const isPasswordMatch = await bcrypt.compare(password, user.password);
                if (!isPasswordMatch) return res.status(401).json({ error: "email or password is incorrect" });

                if (user.token.length > 0) {
                    user.token = ''
                }
                const token = await generateAndSetJWTtoken(user, res);
                user.token = token;
                await user.save();
                return res.json({ success: "successfully logged in", user });

            } catch (err) {
                return res.status(400).json({ error: err.message });
            }
        },

        signup: async (req, res) => {
            try {



                const { prevEmail : previousEmail , prevPass : previousPassword , email, password } = req.body;

                const isPrevUser = await User.find({});

                if(isPrevUser.length == 0) {
                    if(!email || !password) return res.status(401).json({error : "all fields are required"});
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password , salt);

                    const user = new User({
                        email , password : hashedPassword
                    })

                    await user.save();
                    const token = await generateAndSetJWTtoken(user, res);
                    user.token = token;
                    await user.save();

                return res.status(200).json({ success: "successfully registered", user });

                }else{
                    if (!previousEmail, !previousPassword , !email, !password) return res.status(401).json({ error: "all fields are required" });

                    const prevUser = await User.findOne({email : previousEmail});
                    if(!previousEmail) return res.status(401).json({error : "you are not an admin"});

                    const isPreviousPassMatch = await bcrypt.compare(previousPassword , prevUser.password);
                    if(!isPreviousPassMatch) return res.status(401).json({error : "not an admin"});

    
                    const salt = await bcrypt.genSalt(10);
                    const hashedPassword = await bcrypt.hash(password, salt);

                    prevUser.email = email;
                    prevUser.password = hashedPassword;

                    await prevUser.save();
                    const token = await generateAndSetJWTtoken(prevUser, res);
                    prevUser.token = token;
                    await prevUser.save();

                    return res.status(200).json({ success: "successfully registered", user : prevUser });
                   
                }


            } catch (error) {
                console.log(error);
                return res.json(error);
            }

        },

        forgotPassword: async (req, res) => {
            try {
                const { email, password } = req.body;

                const user = await User.findOne({ email });
                if (!user) return res.json({ error: "user didn't exsists" });

                const salt = await bcrypt.genSalt(10);
                const hashedPassword = await bcrypt.hash(password, salt);

                user.password = hashedPassword;
                await user.save();

                return res.json({ success: "password change successfully" });


            } catch (err) {
                console.log(err.message);
            }
        },

        logout: async (req, res) => {
            try {
                res.cookie('jwt', '', {
                    expires: new Date(Date.now() + 10), // Set expiry time as desired, e.g., 1 second from now
                    httpOnly: true,
                    secure: true,
                    sameSite: 'None',
                });
                res.json({ success: 'Logout successful' });
            } catch (err) {
                console.log(err.message);
                return res.status(401).json({ error: err.message });
            }
        },

        deleteEvent : async(req,res)=>{
            try{

                const{eventId} = req.params;
                await Event.deleteOne({_id : eventId});
                return res.json({success : "event deleted successfully"});

            }catch(err){
                return res.status(402).json({err : err.message});
            }
        }

    }
}

export default userController;