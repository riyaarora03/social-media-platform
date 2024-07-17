import { useContext, useState } from "react";
import "../stories/stories.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery,useMutation,useQueryClient } from '@tanstack/react-query';
import { makeRequest } from "../../axios";
import MoreVertIcon from '@mui/icons-material/MoreVert';


const Stories = () => {


 const [storyFile, setStoryFile] = useState(null);
 const [storyMenuOpen, setStoryMenuOpen] = useState(null);


 const {currentUser}=useContext(AuthContext);


 const { isLoading, error, data } = useQuery({
   queryKey: ['stories'],
   queryFn: () =>
     makeRequest.get("/stories").then(res => {
       return res.data;
     }),
 });


 const upload = async (file) => {
   try {
     const formData = new FormData();
     formData.append("file", file);
     const res = await makeRequest.post("/upload", formData);
     return res.data;
   } catch (err) {
     console.log(err);
   }
 };


 const queryClient = useQueryClient();


 const mutation = useMutation({
   mutationFn: (newStory) => {
     return makeRequest.post("/stories", newStory);
   },
   onSuccess: () => {
     // Invalidate and refetch
     queryClient.invalidateQueries({ queryKey: ['stories'] });
   },
 });


 const handleFileInputClick = () =>{
   document.getElementById("story").click();
 };


 const handleFileChange = async (e) =>{
   const file = e.target.files[0];
   if (file) {
     setStoryFile(file);
     const uploadedImageUrl = await upload(file);
     mutation.mutate({img: uploadedImageUrl, userId: currentUser.id});
   }
 };


 const deleteStoryMutation = useMutation({
   mutationFn: (storyId) => {
       return makeRequest.delete("/stories/" + storyId);
   },
   onSuccess: () => {
       // Invalidate and refetch
       queryClient.invalidateQueries({ queryKey: ['stories'] });
   }, 
 });


 const handleDeleteStory = (storyId) => {
   deleteStoryMutation.mutate(storyId);
 };


 if (error) return <div>Error loading stories...</div>;
  if (!data) {
   return <div>Loading...</div>;
 }


 const userUploadedStory = data.find(story => story.userId === currentUser.id);


 return (
   <div className="stories">
     <div className="story">
         {userUploadedStory ? (
         <img src={"/upload/"+userUploadedStory.img} alt="Story" />
       ) : (
         <img src={"/upload/" + currentUser.profilePic} alt="Profile" />
       )}
         <span>{currentUser.name}</span>
         <input
             type="file"
             id="story"
             style={{ display: "none" }} onChange={handleFileChange}
         />
         {userUploadedStory && (
 <>
   <MoreVertIcon
     className="moreverticon"
     onClick={() => setStoryMenuOpen(storyMenuOpen === userUploadedStory.id ? null : userUploadedStory.id)}
   />
   {(userUploadedStory.userId === currentUser.id && storyMenuOpen === userUploadedStory.id) && (
     <button style={{position: "absolute", top:"30px", right:"2px",left:"120px", border:"none", backgroundColor:"transparent", padding:"2px",cursor:"pointer",color:"white",fontSize:"12px", fontWeight:"lighter", borderRadius:"0%", width:"35px",height:"20px"}} onClick={() => handleDeleteStory(userUploadedStory.id)}>Delete</button>
   )}
 </>
)}
         <button onClick={handleFileInputClick}>+</button>
     </div>
     {isLoading ? "Loading..." : (
       <>
         {data.map(story => (
           // Render other users' stories
           (story.userId !== currentUser.id) && (
             <div className="story" key={story.id}>
               <img src={"/upload/"+story.img} alt="Story" />
               <span>{story.name}</span>
             </div>
           )
         ))}
       </>
     )}
   </div>
 )
}


export default Stories