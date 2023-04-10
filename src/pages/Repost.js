import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CreateForm from "../components/CreateForm";

import PostCard from "../components/PostCard";
import supabase from "../config/supabaseClient";

const Repost = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [newContent, setNewContent] = useState("");
  const [newImageUrl, setNewImageUrl] = useState("");
  const [referencedPost, setReferencedPost] = useState("");

  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase.from("posts").select().eq("id", id).single();

      if (error) {
        navigate("/", { replace: true });
      }
      if (data) {
        setReferencedPost(data);
      }
    };

    fetchPost();
  }, [id, navigate]);

  return (
    <div className="page">
      <CreateForm
        userId={userId}
        title={"Re: " + referencedPost.title}
        content={newContent}
        setContent={setNewContent}
        imageUrl={newImageUrl}
        setImageUrl={setNewImageUrl}
      />
      <div className="referenced-post">
        <h3>Replying to...</h3>
        <Link to={"/" + referencedPost.id}>
          <PostCard
            postId={referencedPost.id}
            userId={userId}
            author={referencedPost.user_id}
            title={referencedPost.referenced_post ? "Re: " + referencedPost.title : referencedPost.title}
            content={referencedPost.content}
            imageUrl={referencedPost.image_url}
            createdAt={referencedPost.created_at}
            upvotes={referencedPost.upvotes}
            flags={referencedPost.flags}
          />
        </Link>
      </div>
    </div>
  );
};

export default Repost;
