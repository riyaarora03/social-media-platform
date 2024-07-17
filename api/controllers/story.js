import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";


export const getStories = (req,res) => {


   const token = req.cookies.accessToken;
   if (!token) return res.status(401).json("Not logged in");
  
   jwt.verify(token,"secretkey",(err,userInfo)=>{
       if (err) return res.status(403).json("Invalid Token");  // invalid token


       const q = `SELECT s.*, u.id AS userId, name FROM stories AS s JOIN users AS u ON (u.id = s.userId)
       LEFT JOIN relationships AS r ON (s.userId = r.followedUserId) WHERE r.followerUserId = ? OR s.userId = ? ORDER BY s.createdAt DESC`;


       db.query(q, [userInfo.id,userInfo.id] , (err,data)=>{
           if (err) return res.status(500).json(err);
           return res.status(200).json(data);
       });
   });


};


export const addStory = (req,res) => {


   const token = req.cookies.accessToken;
   if (!token) return res.status(401).json("Not logged in");
  
   jwt.verify(token,"secretkey",(err,userInfo)=>{
       if (err) return res.status(403).json("Invalid Token");  // invalid token


       const q = "INSERT INTO stories (`img`,`createdAt`,`userId`) VALUES (?)";


       const values = [
           req.body.img,
           moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
           userInfo.id,
       ]
  
       db.query(q, [values] , (err,data)=>{
           if (err) return res.status(500).json(err);
           return res.status(200).json("Story has been added");
       });
   });


};


export const deleteStory = (req,res) => {


   const token = req.cookies.accessToken;
   if (!token) return res.status(401).json("Not logged in");
  
   jwt.verify(token,"secretkey",(err,userInfo)=>{
       if (err) return res.status(403).json("Invalid Token");  // invalid token


       const q = "DELETE FROM stories WHERE `id`=? AND `userId`=?";
  
       db.query(q, [req.params.id,userInfo.id] , (err,data)=>{
           if (err) return res.status(500).json(err);
           if (data.affectedRows>0) return res.status(200).json("Story Deleted");
           return res.status(403).json("You can delete only your stories");
       });
   });


};
