import axios from "axios";
import React, { useEffect, useState } from "react";
import userimg from "../IMG/user.png";


const AllBlog = () => {
  const [userData, setUserData] = useState([]);
  const [newPost, setNewPost] = useState({
    userName: "",
    tital: "",
    photo: "",
    Content: "",
  });
  const [editingPost, setEditingPost] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    axios
      .get("http://localhost:3001/users")
      .then((response) => {
        setUserData(response.data);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewPost({ ...newPost, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formattedPost = {
      userName: newPost.userName,
      tital: [
        {
          tital: newPost.tital,
          photo: newPost.photo,
          Content: newPost.Content,
        },
      ],
    };

    if (!editingPost) {
      // Add new post
      axios
        .post("http://localhost:3001/users", formattedPost)
        .then((response) => {
          setUserData([...userData, response.data]);
          setNewPost({ userName: "", tital: "", photo: "", Content: "" });
        })
        .catch((error) => {
          console.error("Error submitting post:", error);
        });
    } else {
      // Update existing post
      axios
        .put(`http://localhost:3001/users/${editingPost.id}`, formattedPost)
        .then((response) => {
          const updatedUserData = userData.map((user) =>
            user.id === editingPost.id ? response.data : user
          );
          setUserData(updatedUserData);
          setEditingPost(null);
          setNewPost({ userName: "", tital: "", photo: "", Content: "" });
        })
        .catch((error) => {
          console.error("Error updating post:", error);
        });
    }
  };

  const handleEdit = (userId) => {
    const postToEdit = userData.find((user) => user.id === userId);
    if (postToEdit) {
      setEditingPost(postToEdit);
      setNewPost({
        userName: postToEdit.userName,
        tital: postToEdit.tital[0].tital,
        photo: postToEdit.tital[0].photo,
        Content: postToEdit.tital[0].Content,
      });
    }
  };

  const handleDelete = (userId) => {
    axios
      .delete(`http://localhost:3001/users/${userId}`)
      .then(() => {
        setUserData(userData.filter((user) => user.id !== userId));
      })
      .catch((error) => {
        console.error("Error deleting post:", error);
      });
  };

  return (
    <div className="container mx-auto px-4">
      <form onSubmit={handleSubmit} className="mb-10">
        <h2 className="text-2xl font-bold mb-4">
          {editingPost ? "Edit Post" : "Add New Post"}
        </h2>
        <div className="mb-4">
          <input
            type="text"
            name="userName"
            value={newPost.userName}
            onChange={handleInputChange}
            placeholder="Enter user name"
            className="border px-4 py-2 w-full rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="tital"
            value={newPost.tital}
            onChange={handleInputChange}
            placeholder="Enter title"
            className="border px-4 py-2 w-full rounded-lg"
            required
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="photo"
            value={newPost.photo}
            onChange={handleInputChange}
            placeholder="Enter photo URL"
            className="border px-4 py-2 w-full rounded-lg"
          />
        </div>
        <div className="mb-4">
          <textarea
            name="Content"
            value={newPost.Content}
            onChange={handleInputChange}
            placeholder="Enter post content"
            className="border px-4 py-2 w-full rounded-lg"
            rows="4"
            required
          ></textarea>
        </div>
        <button
          type="submit"
          className="px-5 py-2 border duration-300 font-semibold text-white bg-green-500 hover:bg-green-400 rounded-lg"
        >
          {editingPost ? "Update Post" : "Submit Post"}
        </button>
      </form>

      {/* Display all posts */}
      <div className="grid grid-cols-3">
        {userData.map((user) => (
          <div className="p-5 border border-2 rounded-lg mx-3" key={user.id}>
            <div className="flex items-center">
              <img className="h-[55px] w-[65px]" src={userimg} alt="userimg" />
              <div>
                <strong>{user.userName}'s Post</strong>
              </div>
            </div>
            {user.tital.map((item, index) => (
              <div key={index}>
                <h3 className="text-2xl mt-5">Title: {item.tital}</h3>
                <img className="px-5 my-5" src={item.photo} alt={item.tital} />
                <p className="break-all mb-4">{item.Content}</p>
                <button
                  className="px-5 py-2 border duration-300 font-semibold text-white bg-yellow-500 hover:bg-yellow-400 rounded-lg mx-2"
                  onClick={() => handleEdit(user.id)}
                >
                  Edit
                </button>
                <button
                  className="px-5 py-2 border duration-300 font-semibold text-white bg-red-600 hover:bg-red-500 rounded-lg mx-2"
                  onClick={() => handleDelete(user.id)}
                >
                  Delete
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllBlog;
