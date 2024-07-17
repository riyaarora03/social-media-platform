import React, { useEffect, useState } from 'react';
import "../explore/explore.scss";

function Explore() {
  
  const [posts, setPosts] = useState([]);
  let limit = 4;
  let pageCount = 1;
  let postCount = 1;
  let isFetching = false; // Add a flag to prevent multiple fetches

  const getPost = async () => {
    if (isFetching) return; // Exit if a fetch is already in progress
    isFetching = true; // Set fetching flag

    try {
      const response = await fetch(`https://my-json-server.typicode.com/riyaarora03/api/posts?_page=${pageCount}&_limit=${limit}`);
      if (!response.ok) {
        throw new Error('Network response was not ok ' + response.statusText);
      }
      
      const data = await response.json();
      setPosts(prevPosts => [...prevPosts, ...data]);
      
    } catch (error) {
      console.error('Fetch error:', error);
    } finally {
      isFetching = false; // Reset fetching flag
    }
  };

  useEffect(() => {
    getPost();
    
    const handleScroll = () => {
      const { scrollHeight, scrollTop, clientHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight - 5) { // Small buffer to trigger before reaching exact bottom
        console.log("I am at bottom");
        showData();
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => window.removeEventListener('scroll', handleScroll); // Clean up event listener
  }, []);

  const showData = () => {
    setTimeout(() => {
      pageCount++;
      getPost();
    }, 300); // Increase delay to 1000ms (1 second)
  };

  return (
    <div className='explore'>
      <h1>ConnectSphere News Feed</h1>
      {posts.map((curElm, index) => (
        <div className="posts" key={index}>
          <p className="post-id">{postCount++}</p>
          <h2 className="title">{curElm.title}</h2>
          <div className="content">
            <div className="left">
              <img src={curElm.image} alt="image"/>
            </div>
            <div className="right">
              <p className="post-info">{curElm.body}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default Explore;
