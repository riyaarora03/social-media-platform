import "../comments/comments.scss";
import MoreHorizIcon from '@mui/icons-material/MoreHoriz';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/authContext";
import { useContext, useState } from "react";
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId }) => {
    const [desc, setDesc] = useState("");
    const [commentMenuOpen, setCommentMenuOpen] = useState(null);

    const { currentUser } = useContext(AuthContext);

    const { isLoading, error, data } = useQuery({
        queryKey: ['comments', postId],
        queryFn: () =>
            makeRequest.get("/comments?postId=" + postId).then(res => {
                return res.data;
            }),
    });
    console.log(data);

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (newComment) => {
            return makeRequest.post("/comments", newComment);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });

    const handleClick = async (e) => {
        e.preventDefault();
        mutation.mutate({ desc, postId });
        setDesc("");
    };

    const deleteCommentMutation = useMutation({
        mutationFn: (commentId) => {
            return makeRequest.delete("/comments/" + commentId);
        },
        onSuccess: () => {
            // Invalidate and refetch
            queryClient.invalidateQueries({ queryKey: ['comments', postId] });
        },
    });

    const handleDeleteComment = (commentId) => {
        deleteCommentMutation.mutate(commentId);
    };

    return (
        <div className="comments">
            <div className="write">
                <img src={"/upload/"+currentUser.profilePic} />
                <input
                    type="text"
                    placeholder="Add a comment"
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                />
                <button onClick={handleClick}>Post</button>
            </div>
            {isLoading ? "Loading" : data.map(comment => (
                <div className="comment" key={comment.id}>
                    <div className="left">
                        <img src={"/upload/"+comment.profilePic} />
                        <div className="info">
                            <Link to={`/profile/${comment.userId}`} style={{ textDecoration: "none", color: "inherit" }}>
                                <span>{comment.name}</span>
                            </Link>
                            <div className="interact">
                                <span className="date">{moment(comment.createdAt).fromNow()}</span>
                            </div>
                        </div>
                        <p>{comment.desc}</p>
                    </div>
                    {comment.userId === currentUser.id && (
                    <div className="right">
                        <MoreHorizIcon
                            onClick={() => setCommentMenuOpen(commentMenuOpen === comment.id ? null : comment.id)}
                        />
                        {(comment.userId===currentUser.id && commentMenuOpen === comment.id) && (
                            <button onClick={() => handleDeleteComment(comment.id)}>Delete</button>
                        )}
                    </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Comments;
