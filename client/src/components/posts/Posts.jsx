import "../posts/posts.scss";
import Post from "../post/Post";
import { useQuery } from '@tanstack/react-query';
import { makeRequest } from "../../axios";

const Posts = ({ userId }) => {
  const { isLoading, error, data } = useQuery({
    queryKey: userId ? ['posts', userId] : ['posts'],
    queryFn: () =>
      makeRequest.get(userId ? `/posts?userId=${userId}` : "/posts").then(res => res.data),
  });

  // Deduplicate posts based on unique identifiers
  const deduplicatedData = data ? [...new Map(data.map(post => [post.id, post])).values()] : [];

  console.log(deduplicatedData);

  return (
    <div className="posts">
      {error ? "something went wrong" : isLoading ? "loading" : deduplicatedData.map((post) => (
        <Post post={post} key={`${post.id}-${post.createdAt}`} />
      ))}
    </div>
  );
};

export default Posts;