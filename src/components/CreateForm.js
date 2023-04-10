import { useState } from "react";
import { useNavigate } from "react-router-dom";

import supabase from "../config/supabaseClient";

const CreateForm = ({
  userId,
  title,
  setTitle,
  content,
  setContent,
  imageUrl,
  setImageUrl,
}) => {
  console.log("content: ", content);
  console.log("setTitle: ", setTitle);
  const navigate = useNavigate();

  const [formError, setFormError] = useState("");
  const [flags, setFlags] = useState([]);

  const toggleAddFlag = (flag) => {
    if (flags.includes(flag)) {
      setFlags((flags) =>
        flags.filter((currentFlag) => {
          return currentFlag !== flag;
        })
      );
    } else {
      setFlags((flags) => [...flags, flag]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title) {
      setFormError("Please ensure that your post has a title.");
      return;
    }

    if (!setTitle && !content) {
      setFormError("Please ensure that your repost has content.");
      return;
    }

    const { data, error } = await supabase.from("posts").insert([
      {
        user_id: userId,
        title,
        content,
        image_url: imageUrl,
        comments: [],
        flags,
      },
    ]);

    if (error) {
      console.log(error);
      setFormError("Please fill in all the fields correctly.");
    }
    if (data) {
      console.log(data);
      setFormError(null);
      navigate("/");
    }
  };
  return (
    <div className="flex flex-col gap-2 py-3">
      <h1 className="text-white font-semibold text-2xl">Create New Post</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <div className="flex flex-row gap-1 text-sm pb-3">
          <span>Set Flags:</span>
          <button
            className={`${
              flags.includes("Opinion") ? "bg-white" : "bg-[#fff8]"
            } px-2 rounded`}
            type="button"
            onClick={() => toggleAddFlag("Opinion")}
          >
            Opinion
          </button>
          <button
            type="button"
            className={`${
              flags.includes("Question") ? "bg-white" : "bg-[#fff8]"
            } px-2 rounded`}
            onClick={() => toggleAddFlag("Question")}
          >
            Question
          </button>
          <button
            type="button"
            className={`${
              flags.includes("Off-Topic") ? "bg-white" : "bg-[#fff8]"
            } px-2 rounded`}
            onClick={() => toggleAddFlag("Off-Topic")}
          >
            Off-Topic
          </button>
        </div>
        <input
          className="p-2 rounded bg-white bg-opacity-80 focus:bg-opacity-100 outline-none"
          type="text"
          id="title"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={setTitle ? false : true}
        />
        <textarea
          className="p-2 h-48 rounded bg-white bg-opacity-80 focus:bg-opacity-100 outline-none"
          id="content"
          type="text"
          placeholder={setTitle ? "Content (Optional)" : "Content"}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
        <input
          className="p-2 rounded bg-white bg-opacity-80 focus:bg-opacity-100 outline-none"
          type="text"
          id="image-url"
          placeholder="Image URL (Optional)"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
        />

        <button className="p-2 rounded bg-white outline-none">
          Create Post
        </button>

        {formError && <p className="error">{formError}</p>}
      </form>
    </div>
  );
};

export default CreateForm;
