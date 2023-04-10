import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../components/Loader";

import PostCard from "../components/PostCard";

import supabase from "../config/supabaseClient";

const Home = ({
  userId,
  orderBy,
  setOrderBy,
  filterBy,
  setFilterBy,
  searchQuery,
}) => {
  const [fetchError, setFetchError] = useState(null);
  const [posts, setPosts] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("posts")
        .select()
        .order(orderBy, { ascending: false });

      if (error) {
        setFetchError("Could not fetch the posts");
        setPosts(null);
      }
      if (data) {
        setPosts(data);
        setFetchError(null);
      }
      setLoading(false);
    };

    fetchPosts();
  }, [orderBy]);

  const toggleFlag = (flag) => {
    if (filterBy === flag) {
      setFilterBy("");
    } else {
      setFilterBy(flag);
    }
  };

  if (loading) {
    return <Loader />;
  } else {
    return (
      <div className="flex flex-col w-full items-center px-3">
        <div className="flex flex-col w-full max-w-5xl">
          <div className="flex flex-col lg:flex-row w-full justify-between my-4 gap-2 ">
            <div className="flex flex-row gap-2 items-center">
              <span>Order by:</span>
              <button
                className={`p-1 rounded text-white text-sm px-2 ${
                  orderBy === "created_at" ? "bg-neutral-700" : "bg-neutral-400"
                }`}
                onClick={() => setOrderBy("created_at")}
              >
                Newest
              </button>
              <button
                className={`p-1 rounded text-white text-sm px-2 ${
                  orderBy === "upvotes" ? "bg-neutral-700" : "bg-neutral-400"
                }`}
                onClick={() => setOrderBy("upvotes")}
              >
                Most Popular
              </button>
            </div>
            <div className="flex flex-row gap-2 items-center">
              <span>Filter by:</span>
              <button
                className={`p-1 rounded text-white text-sm px-2 ${
                  filterBy === "Opinion" ? "bg-neutral-700" : "bg-neutral-400"
                }`}
                onClick={() => toggleFlag("Opinion")}
              >
                Opinion
              </button>
              <button
                className={`p-1 rounded text-white text-sm px-2 ${
                  filterBy === "Question" ? "bg-neutral-700" : "bg-neutral-400"
                }`}
                onClick={() => toggleFlag("Question")}
              >
                Question
              </button>
              <button
                className={`p-1 rounded text-white text-sm px-2 ${
                  filterBy === "Off-Topic" ? "bg-neutral-700" : "bg-neutral-400"
                }`}
                onClick={() => toggleFlag("Off-Topic")}
              >
                Off-Topic
              </button>
            </div>
          </div>
          {fetchError && <p>{fetchError}</p>}
          {posts && (
            <div className="posts">
              <div className="grid gird-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 py-3">
                {posts
                  .filter((post) =>
                    post.title.toLowerCase().includes(searchQuery)
                  )
                  .filter((post) => {
                    if (!filterBy) {
                      return true;
                    } else if (
                      post.flags.length > 0 &&
                      post.flags.includes(filterBy)
                    ) {
                      return true;
                    } else {
                      return false;
                    }
                  })
                  .map((post, index) => (
                    <Link
                      to={"/" + post.id}
                      key={post.id}
                      className={`${index === 0 ? "row-span-2" : "row-span-1"}`}
                    >
                      <PostCard
                        index={index}
                        postId={post.id}
                        userId={userId}
                        author={post.user_id}
                        title={
                          post.referenced_post
                            ? "Re: " + post.title
                            : post.title
                        }
                        createdAt={post.created_at}
                        upvotes={post.upvotes}
                        flags={post.flags}
                        image={post.image_url}
                      />
                    </Link>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
};

export default Home;
