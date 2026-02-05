import jwt from "jsonwebtoken";

const auth = async(req,res,next)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader.split(' ')[1];
        if(token == null) return res.status(402).json({error : "user not authorize"});

        const isVerify = jwt.verify(token , process.env.JWT_SECRET_KEY);
        if(!isVerify) return res.status(401).json({error : "user not authorize"});

        req.user = isVerify.user;
        next();

    }catch(err){
        return res.status(401).json({error : err.message});
        console.log(err.message);
    }

}

export default auth;