import "../post/post.scss";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import { Link } from "react-router-dom";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CommentIcon from '@mui/icons-material/Comment';
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined';
import FavoriteOutlinedIcon from '@mui/icons-material/FavoriteOutlined';
import Comments from "../comments/Comments";
import { useState, useContext } from "react";
import moment from "moment";
import { useQuery,useQueryClient,useMutation } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({post}) => {

    const [commentOpen,setCommentOpen]=useState(false);
    const [menuOpen,setMenuOpen]=useState(false);

    const {currentUser}=useContext(AuthContext);

    //fetch data of comments
    const {isLoading: commentsLoading,data: commentsData}=useQuery({
        queryKey: ['comments',post.id],
        queryFn: ()=>
          makeRequest.get("comments?postId="+post.id).then(res=> res.data),  
    })

    //fetch data of likes
    const { isLoading, error, data } = useQuery({
        queryKey: ['likes',post.id],
        queryFn: () =>
          makeRequest.get("/likes?postId="+post.id).then(res => {
            return res.data;
        }),
    });

    // For 'liking a post' Functionality
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (liked) => {
            if (liked) return makeRequest.delete("/likes?postId="+post.id);
            return makeRequest.post("/likes", {postId: post.id}); 
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['likes'] }); 
        },
    });

    const handleLike = () =>{
        mutation.mutate(data.includes(currentUser.id))
    }
    //ends here

    const deleteMutation = useMutation({
        mutationFn: (postId) => {
            return makeRequest.delete("/posts/"+postId); 
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['posts'] }); 
        },
    });

    const handleDelete = () =>{
        deleteMutation.mutate(post.id)
    }

  return (
    <div className="post">
        <div className="container">
            <div className="user">
                <div className="userInfo">
                    <img src={"/upload/"+post.profilePic}/>
                    <div className="details">
                        <Link to={`/profile/${post.userId}`} style={{textDecoration:"none", color:"inherit"}}>
                            <span className="name">{post.name}</span>
                        </Link>
                        <span className="date">{moment(post.createdAt).fromNow()}</span>
                    </div>
                </div>
                {post.userId === currentUser.id && (
                     <div className="icon">
                        <MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
                        {menuOpen && <button onClick={handleDelete}>Delete</button>}
                    </div>
                )}
            </div>
            <div className="content">
                {post.img && (
                <img src={`/upload/${post.img}`}/>
                )}
                <p>{post.desc}</p>
            </div>
            <div className="interaction">
                <div className="combined">
                    <div className="item">
                        {isLoading ? "Loading..." : data.includes(currentUser.id) ? <FavoriteOutlinedIcon style={{color: "red"}} onClick={handleLike}/> : <FavoriteBorderIcon onClick={handleLike}  />}
                        {isLoading ? "Loading..." : data ? <span>{data.length} Likes</span> : "No Likes"}
                    </div>
                    <div className="item" onClick={()=>setCommentOpen(!commentOpen)}>
                        <CommentIcon/>
                        <span>{commentsLoading?"Loading...":`${commentsData.length} Comments`}</span>
                    </div>
                </div>
                <div className="single">
                    <div className="item">
                        <ShareOutlinedIcon/>
                        <span>Share</span>
                    </div>
                </div>
            </div>
            {commentOpen && <Comments postId={post.id}/>}
        </div>
    </div>
  )
}

export default Post
