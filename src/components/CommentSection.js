import { useState } from "react";
import { parseDate } from "../utils/Utils";

import supabase from "../config/supabaseClient";

const CommentSection = ({ comments, setPost, userId, postId }) => {
  const [newComment, setNewComment] = useState("");

  const handleAddComment = async (e) => {
    e.preventDefault();

    if (!newComment) {
      return;
    }

    const { data, error } = await supabase
      .from("posts")
      .update({
        comments: [
          ...comments,
          { author: userId, text: newComment, createdAt: new Date() },
        ],
      })
      .eq("id", postId);

    setPost((post) => ({
      ...post,
      comments: [
        ...comments,
        { author: userId, text: newComment, createdAt: new Date() },
      ],
    }));

    if (error) {
      console.log("error: ", error);
    }

    if (data) {
      console.log("data: ", data);
      setNewComment("");
    }
  };

  if (comments) {
    return (
      <div className="flex flex-col gap-1 py-1 pb-4 border-t border-t-black">
        <div className="font-medium">Comments</div>
        <form onSubmit={handleAddComment}>
          <input
            className="bg-neutral-100 w-full max-w-xl p-2 outline-none border-2 transition-all border-transparent focus:border-neutral-600"
            type="text"
            placeholder="Leave a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
          />
        </form>
        {comments.length > 0 &&
          comments.sort().map((comment) => (
            <div
              className="p-2 bg-neutral-200 w-full max-w-xl"
              key={comment.text}
            >
              <p className="text-neutral-800">
                <span className="font-medium text-sm italic">
                  {comment.author === userId ? "You" : "@" + comment.author}
                </span>
                {" - "}
                <span className="text-sm">{parseDate(comment.createdAt)}</span>
              </p>
              <p>{comment.text}</p>
              <p></p>
            </div>
          ))}
      </div>
    );
  }
};

export default CommentSection;
