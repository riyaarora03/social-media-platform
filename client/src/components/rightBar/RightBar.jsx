import "./rightBar.scss";
import axios from "axios";
import { useEffect, useState, useContext } from "react";
import { Link } from "react-router-dom";
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { AuthContext } from "../../context/authContext";
import { makeRequest } from "../../axios";

const RightBar = () => {
  const [friends, setFriends] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const { currentUser } = useContext(AuthContext);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/friends", {
          withCredentials: true,
        });
        const uniqueFriends = [...new Map(res.data.map(item => [item.userId, item])).values()];
        setFriends(uniqueFriends);
      } catch (err) {
        console.error(err);
      }
    };

    const fetchSuggestions = async () => {
      try {
        const res = await axios.get("http://localhost:8800/api/friends/suggestions", {
          withCredentials: true,
        });
        const uniqueSuggestions = [...new Map(res.data.map(item => [item.userId, item])).values()];
        setSuggestions(uniqueSuggestions);
      } catch (err) {
        console.error(err);
      }
    };

    fetchFriends();
    fetchSuggestions();
  }, []);

  const mutation = useMutation({
    mutationFn: (userId) => {
      return makeRequest.post("/relationships", { userId });
    },
    onSuccess: (data,userId) => {
      queryClient.invalidateQueries('suggestions');
      queryClient.invalidateQueries('friends');

      setSuggestions((prevSuggestions)=>
      prevSuggestions.map((suggestion)=>
      suggestion.userId===userId ? {...suggestion, isFollowing: true}:suggestion
      )
      );
    },
  });

  const handleFollow = (userId) => {
    if (!suggestions.find((suggestion)=>suggestion.userId===userId).isFollowing){
    mutation.mutate(userId);
    }
  };

  return (
    <div className="rightBar">
      <div className="container">
        <div className="item">
          <span>Your Friends</span>
          {friends.map((friend) => (
            <div className="user" key={friend.userId}>
              <div className="userInfo">
                <Link to={`/profile/${friend.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img src={"/upload/" + friend.profilePic} alt={friend.name} />
                </Link>
                <Link to={`/profile/${friend.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <span>{friend.name}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
        <div className="item">
          <span>Suggestions for you</span>
          {suggestions.map((suggestion) => (
            <div className="user" key={suggestion.userId}>
              <div className="userInfo">
                <Link to={`/profile/${suggestion.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <img src={"/upload/" + suggestion.profilePic} alt={suggestion.name} />
                </Link>
                <Link to={`/profile/${suggestion.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                  <span>{suggestion.name}</span>
                </Link>
              </div>
              <div className="buttons">
                <button onClick={() => handleFollow(suggestion.userId)}
                disabled={suggestion.isFollowing}
                >
                  {suggestion.isFollowing ? "Following" : "Follow"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RightBar;
