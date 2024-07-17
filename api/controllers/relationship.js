import {db} from "../connect.js";
import jwt from "jsonwebtoken";
import moment from "moment";

export const getRelationships = (req,res)=>{

    const q = `SELECT followerUserId FROM relationships WHERE followedUserID=? `;
    
        db.query(q, [req.query.followedUserId] , (err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json(data.map(relationship=>relationship.followerUserId));
        });
};

export const addRelationship = (req,res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Invalid Token");  // invalid token

        const q = "INSERT INTO relationships (`followerUserId`,`followedUserId`) VALUES (?)";

        const values = [
            userInfo.id,
            req.body.userId,
        ]
    
        db.query(q, [values] , (err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("Following");
        });
    });
};

export const deleteRelationship= (req,res) => {

    const token = req.cookies.accessToken;
    if (!token) return res.status(401).json("Not logged in");
    
    jwt.verify(token,"secretkey",(err,userInfo)=>{
        if (err) return res.status(403).json("Invalid Token");  // invalid token

        const q = "DELETE FROM relationships WHERE `followerUserId`=? AND `followedUserId`=?";
    
        db.query(q, [userInfo.id,req.query.userId] , (err,data)=>{
            if (err) return res.status(500).json(err);
            return res.status(200).json("Unfollow");
        });
    });
};

// export const addRelationship = (req,res) => {

//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in");
    
//     jwt.verify(token,"secretkey",(err,userInfo)=>{
//         if (err) return res.status(403).json("Invalid Token");  // invalid token

//         const q = "INSERT INTO likes (`userId`,`postId`) VALUES (?)";

//         const values = [
//             userInfo.id,
//             req.body.postId,
//         ]
    
//         db.query(q, [values] , (err,data)=>{
//             if (err) return res.status(500).json(err);
//             return res.status(200).json("Post has been liked");
//         });
//     });
// };

// export const deleteRelationship= (req,res) => {

//     const token = req.cookies.accessToken;
//     if (!token) return res.status(401).json("Not logged in");
    
//     jwt.verify(token,"secretkey",(err,userInfo)=>{
//         if (err) return res.status(403).json("Invalid Token");  // invalid token

//         const q = "DELETE FROM likes WHERE `userId`=? AND `postId`=?";
    
//         db.query(q, [userInfo.id,req.query.postId] , (err,data)=>{
//             if (err) return res.status(500).json(err);
//             return res.status(200).json("Post has been unliked");
//         });
//     });
// };
        
