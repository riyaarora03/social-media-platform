import { db } from "../connect.js";
import jwt from "jsonwebtoken";

export const searchUsers = (req, res) => {
  const token = req.cookies.accessToken;
  if (!token) return res.status(401).json("Not logged in");

  jwt.verify(token, "secretkey", (err, userInfo) => {
    if (err) return res.status(403).json("Invalid Token");

    const q = `SELECT id AS userId, name, profilePic FROM users WHERE name LIKE ? LIMIT 10`;
    const searchQuery = `%${req.query.q}%`;

    db.query(q, [searchQuery], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json(data);
    });
  });
};
