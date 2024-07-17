import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getUser = (req,res)=>{
    
    const userId=req.params.userId;
    const q = "SELECT * FROM users where id=?";

    db.query(q,[userId],(err,data)=>{
        if (err) return res.status(500).json(err);
        if (data.length === 0) return res.status(404).json({ message: "User not found" });
        const {password, ...info} = data[0];
        return res.json(info);
    });
};

export const updateUser = (req,res)=>{
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Invalid Token");  // invalid token

        const q= "UPDATE users SET `name`=?,`city`=?,`language`=?,`facebook`=?,`instagram`=?,`twitter`=?,`pinterest`=?,`linkedin`=?,`email`=?,`coverPic`=?,`profilePic`=? WHERE id=?";

        db.query(q,[
            req.body.name,
            req.body.city,
            req.body.language,
            req.body.facebook,
            req.body.instagram,
            req.body.twitter,
            req.body.pinterest,
            req.body.linkedin,
            req.body.email,
            req.body.coverPic,
            req.body.profilePic,
            userInfo.id
        ],(err,data)=>{
            if (err) return res.status(500).json(err);
            if (data.affectedRows>0)  return res.json("Updated")     //updated our user
            return res.status(403).json("You can update only your profile")       //not our id
        })
});
};