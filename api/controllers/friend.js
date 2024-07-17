import {db} from "../connect.js";
import jwt from "jsonwebtoken";

export const getFriends = (req,res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Invalid Token");  // invalid token

        const q =`SELECT u.id AS userId, name, profilePic FROM users AS u LEFT JOIN relationships AS r ON (u.id = r.followedUserId) WHERE r.followerUserId = ?`;

        db.query(q, [userInfo.id] , (err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

export const getSuggestions = (req,res) => {
    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Invalid Token");  // invalid token

        const q =`SELECT id AS userId, name, profilePic 
        FROM users 
        WHERE id != ? 
        AND id NOT IN (
          SELECT followedUserId 
          FROM relationships 
          WHERE followerUserId = ?
        )`;

        db.query(q, [userInfo.id,userInfo.id] , (err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json(data);
        });
    });
};

