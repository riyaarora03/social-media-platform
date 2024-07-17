import { useContext, useState, useEffect, useRef } from "react";
import { AuthContext } from "../../context/authContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { makeRequest } from "../../axios";
import Image from "../../assets/images/img.png";
import Map from "../../assets/images/map.png";
import Friend from "../../assets/images/friend.png";
import "../share/share.scss";

const Share = () => {
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const [friends, setFriends] = useState([]);
  const [taggedFriends, setTaggedFriends] = useState([]);
  const [showFriends, setShowFriends] = useState(false);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const dropdownRef = useRef();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/friends", {
          withCredentials: true,
        });
        setFriends(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchFriends();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowFriends(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef]);

  const upload = async () => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await makeRequest.post("/upload", formData);
      return res.data;
    } catch (err) {
      console.log(err);
    }
  };

  const mutation = useMutation({
    mutationFn: (newPost) => {
      return makeRequest.post("/posts", newPost);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['posts'] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    let imgUrl = "";
  
    try {
      if (file) {
        imgUrl = await upload();
      }
  
      const newPost = {
        desc,
        img: imgUrl,
        taggedFriends: taggedFriends.map((friend) => friend.userId),
      };
  
      mutation.mutate(newPost, {
        onSuccess: () => {
          setDesc("");
          setFile(null);
          setTaggedFriends([]);
        },
      });
    } catch (error) {
      console.error("Error sharing post:", error);
      // Handle error (e.g., show a message to the user)
    }
  };
  

  const handleRemoveImage = () => {
    setFile(null);
  };

  const handleTagFriend = (friend) => {
    if (taggedFriends.some(f => f.userId === friend.userId)) {
      setTaggedFriends(prev => prev.filter(f => f.userId !== friend.userId));
    } else {
      setTaggedFriends(prev => [...prev, friend]); // Allow multiple tagging
    }
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <div className="left">
            <img src={"/upload/" + currentUser.profilePic} alt="" />
            <input
              type="text"
              placeholder={`What's on your mind ${currentUser.name}?`}
              onChange={e => setDesc(e.target.value)}
              value={desc}
            />
          </div>
          <div className="right">
            {file && (
              <div className="filePreview">
                <img className="file" src={URL.createObjectURL(file)} alt="upload" />
                <button className="removeImage" onClick={handleRemoveImage}>✖</button>
              </div>
            )}
          </div>
        </div>
        <div className="taggedFriends">
          {taggedFriends.map(friend => (
            <div key={friend.userId} className="taggedFriend">
              {friend.name}
            </div>
          ))}
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              style={{ display: "none" }}
              onChange={e => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            {/* <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div> */}
            <div className="item" onClick={() => setShowFriends(!showFriends)}>
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
            {showFriends && (
              <div className="dropdown" ref={dropdownRef}>
                {friends.map((friend) => (
                  <div 
                  key={friend.userId} 
                  className={`friendBox ${taggedFriends.some(f => f.userId === friend.userId) ? 'tagged' : ''}`} 
                  onClick={() => handleTagFriend(friend)}>
                  {friend.name}{taggedFriends.some(f => f.userId === friend.userId) && <span className="removeTag">x</span>}
                </div>                
                ))}
              </div>
            )}
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
