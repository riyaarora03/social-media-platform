import { useState } from "react";
import { makeRequest } from "../../axios";
import "../update/update.scss";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const Update = ({setOpenUpdate,user}) => {

    const [cover,setCover]=useState(null)
    const [profile,setProfile]=useState(null)
    const [texts,setTexts]=useState({
        name: user.name,
        city: user.city,
        language: user.language,
        facebook: user.facebook,
        instagram: user.instagram,
        twitter: user.twitter,
        pinterest: user.pinterest,
        linkedin: user.linkedin,
        email: user.email,
        //password: user.password
    });

    const upload = async (file) => {
        console.log(file)
        try {
          const formData = new FormData();
          formData.append("file", file);
          const res = await makeRequest.post("/upload", formData);
          return res.data;
        } catch (err) {
          console.log(err);
        }
    };

    const handleChange = (e) => {
        setTexts((prev)=>({...prev,[e.target.name]:[e.target.value]}));
    };

    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (user) => {
        return makeRequest.put("/users", user); 
        },
        onSuccess: () => {
        // Invalidate and refetch
        queryClient.invalidateQueries({ queryKey: ['user'] }); 
        },
    });

    const handleClick = async (e) => {
        e.preventDefault();

        let coverUrl;
        let profileUrl;
        coverUrl = cover ? await upload(cover) : user.coverPic;
        profileUrl= profile ? await upload(profile) : user.profilePic;

        mutation.mutate({ ...texts, coverPic: coverUrl, profilePic: profileUrl});
        setOpenUpdate(false);
        setCover(null);
        setProfile(null);
    };


    return (
        <div className="update">
          <div className="wrapper">
            <h1>Update Your Profile</h1>
            <form>
              <div className="files">
                <label htmlFor="cover">
                  <span>Cover Picture</span>
                  <div className="imgContainer">
                    <img
                      src={
                        cover
                          ? URL.createObjectURL(cover)
                          : "/upload/" + user.coverPic
                      }
                      alt=""
                    />
                    <CloudUploadIcon className="icon" />
                  </div>
                </label>
                <input
                  type="file"
                  id="cover"
                  style={{ display: "none" }}
                  onChange={(e) => setCover(e.target.files[0])}
                />
                <label htmlFor="profile">
                  <span>Profile Picture</span>
                  <div className="imgContainer">
                    <img
                      src={
                        profile
                          ? URL.createObjectURL(profile)
                          : "/upload/" + user.profilePic
                      }
                      alt=""
                    />
                    <CloudUploadIcon className="icon" />
                  </div>
                </label>
                <input
                  type="file"
                  id="profile"
                  style={{ display: "none" }}
                  onChange={(e) => setProfile(e.target.files[0])}
                />
              </div>
              <label>Name</label>
              <input
                type="text"
                value={texts.name}
                name="name"
                onChange={handleChange}
              />
              <label>City</label>
              <input
                type="text"
                value={texts.city}
                name="city"
                onChange={handleChange}
              />
              <label>Language</label>
              <input
                type="text"
                value={texts.language}
                name="language"
                onChange={handleChange}
              />
              <label>Facebook</label>
              <input
                type="text"
                name="facebook"
                value={texts.facebook}
                onChange={handleChange}
              />
              <label>Instagram</label>
              <input
                type="text"
                name="instagram"
                value={texts.instagram}
                onChange={handleChange}
              />
              <label>Linkedin</label>
              <input
                type="text"
                name="linkedin"
                value={texts.linkedin}
                onChange={handleChange}
              />
              <label>Pinterest</label>
              <input
                type="text"
                name="pinterest"
                value={texts.pinterest}
                onChange={handleChange}
              />
              <label>Twitter</label>
              <input
                type="text"
                name="twitter"
                value={texts.twitter}
                onChange={handleChange}
              />
              <label>Email</label>
              <input
                type="text"
                name="email"
                value={texts.email}
                onChange={handleChange}
              />
              <button onClick={handleClick}>Update</button>
            </form>
            <button className="close" onClick={() => setOpenUpdate(false)}>
              close
            </button>
          </div>
        </div>
      );
    };
    
    export default Update;
