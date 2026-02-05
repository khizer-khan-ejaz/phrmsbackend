import express from "express";
import userController from "../controllers/userController.js";
import upload from "../utils/imageUpload.js";
import auth from "../middlewares/auth.js";

export const router = express.Router();


// admin routes
router.post("/gallery/upload" ,  auth  , upload.single('file') , userController().galleryImageUpload);   
router.delete("/gallery/delete/:imageId" , auth,  userController().deleteGalleryImage);   
router.post("/blog/upload" , auth , upload.single('file') , userController().blogUpload);   
router.post("/create/event" , auth , upload.single('file') , userController().createEvent);
router.delete("/blog/:blogId" , auth , userController().deleteBlog);
router.post("/create/cause" , auth , upload.single("file") , userController().createCause);
router.delete("/cause/:causeId" , auth , userController().deleteCause);
router.delete("/event/:eventId" , auth , userController().deleteEvent);

// admin login routes
router.post("/admin/login" , userController().login);
router.post("/admin/signup" , userController().signup);
router.post("/admin/forgot/password" , userController().forgotPassword);

// admin logout
// router.post("/logout" , userController().logout);

router.post("/admin/logout" , userController().logout);

// getting data routes
router.get("/gallery" , userController().getGalleryImages);
router.get("/blogs" , userController().getBlogs);
router.get("/events" , userController().getEvents);
router.get("/cause" , userController().getCause);


