import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

import PostCard from "../components/PostCard";
import CommentSection from "../components/CommentSection";

import supabase from "../config/supabaseClient";
import { IoMdThumbsUp } from "react-icons/io";
import Loader from "../components/Loader";

const Post = ({ userId }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [referencedPost, setReferencedPost] = useState("");
  console.log("referencedPost: ", referencedPost);

  useEffect(() => {
    const fetchPost = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select()
        .eq("id", id)
        .single();

      if (error) {
        navigate("/", { replace: true });
      }

      // Current post data
      if (data) {
        setPost(data);

        // Referenced post data
        if (data.referenced_post) {
          const { data: referencedData, error } = await supabase
            .from("posts")
            .select()
            .eq("id", data.referenced_post)
            .single();

          if (error) {
            navigate("/");
          }

          if (referencedData) {
            setReferencedPost(referencedData);
          }
        } else {
          setReferencedPost("");
        }
      }
      setLoading(false);
    };

    fetchPost();
  }, [id, navigate]);

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", post.id);

    if (error) {
      console.log("error: ", error);
      navigate("/");
    }
    if (data) {
      navigate("/");
    }
  };

  const handleUpvote = async () => {
    setPost((post) => ({
      ...post,
      upvotes: post.upvotes + 1,
    }));

    const { error } = await supabase
      .from("posts")
      .update({ upvotes: post.upvotes + 1 })
      .eq("id", post.id);

    if (error) {
      console.log("error: ", error);
      navigate("/");
    }
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="flex flex-col w-full items-center px-3">
        <div className="flex flex-col w-full max-w-5xl">
          <div className={`h-full rounded flex flex-col justify-between mb-5`}>
            <div>
              <p className={`text-sm py-2 border-b border-b-gray-700 w-full`}>
                Author: {post.user_id === userId ? "You" : "@" + post.user_id}
                <br />
                Posted on: {new Date(post.created_at).toLocaleDateString()}
              </p>
              <h3
                className={`text-neutral-800 font-semibold text-4xl my-1 mb-4`}
              >
                {post.title}
              </h3>
            </div>
            <div>
              {post.image_url ? (
                <img
                  src={post.image_url}
                  alt="img"
                  className="mx-auto object-cover"
                />
              ) : null}
              {post.content ? (
                <p className="font-serif my-2">{post.content}</p>
              ) : null}
              <div className="flex flex-row flex-wrap gap-2 my-1">
                {post.flags && post.flags.length > 0
                  ? post.flags.map((flag) => (
                      <span
                        className="bg-yellow-600 bg-opacity-70 text-xs p-1 px-3 rounded"
                        key={flag}
                      >
                        {flag}
                      </span>
                    ))
                  : null}
              </div>
              <div className="flex flex-row w-full justify-between gap-2 pt-1">
                <div className="flex flex-row items-center gap-2 text-sky-700">
                  {
                    <IoMdThumbsUp
                      className="text-xl cursor-pointer"
                      onClick={() => handleUpvote(post.id)}
                    />
                  }
                  <span>
                    {post.upvotes === 1
                      ? post.upvotes + " upvote"
                      : post.upvotes + " upvotes"}{" "}
                  </span>
                </div>
                <div>
                  {post.user_id === userId ? (
                    <div className="flex flex-row gap-3">
                      <Link
                        className="text-gray-500 border-b-2 border-b-transparent transition-all duration-500 hover:border-b-gray-500 font-medium uppercase"
                        to={"/update/" + post.id}
                      >
                        Edit
                      </Link>
                      <button
                        className="text-red-500 border-b-2 border-b-transparent transition-all duration-500 hover:border-b-red-500 font-medium uppercase"
                        onClick={handleDelete}
                      >
                        Delete
                      </button>
                    </div>
                  ) : null}
                  {id === post.id ? (
                    <Link to={"/repost/" + post.id}>
                      <i className="material-icons" title="repost">
                        reply
                      </i>
                    </Link>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
          <CommentSection
            userId={userId}
            comments={post.comments}
            setPost={setPost}
            postId={post.id}
          />
          {referencedPost && (
            <>
              <h3>Replying to...</h3>
              <Link to={"/" + referencedPost.id}>
                <PostCard
                  postId={referencedPost.id}
                  userId={userId}
                  author={referencedPost.user_id}
                  title={
                    referencedPost.referenced_post
                      ? "Re: " + referencedPost.title
                      : referencedPost.title
                  }
                  content={referencedPost.content}
                  imageUrl={referencedPost.image_url}
                  createdAt={referencedPost.created_at}
                  upvotes={referencedPost.upvotes}
                  flags={referencedPost.flags}
                />
              </Link>
            </>
          )}
        </div>
      </div>
    );
  }
};

export default Post;
