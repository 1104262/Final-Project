import { Link, useNavigate, useParams } from "react-router-dom";
import supabase from "../config/supabaseClient";
import { parseDate } from "../utils/Utils";

const PostCard = ({
  userId,
  postId,
  author,
  title,
  createdAt,
  upvotes,
  flags,
  index,
  image,
}) => {
  console.log("flags: ", flags);
  const navigate = useNavigate();
  const { id } = useParams();

  const handleDelete = async () => {
    const { data, error } = await supabase
      .from("posts")
      .delete()
      .eq("id", postId);

    if (error) {
      console.log("error: ", error);
      navigate("/");
    }
    if (data) {
      navigate("/");
    }
  };

  console.log(index);
  return (
    <div
      className={` bg-neutral-200 h-full rounded p-3 flex flex-col justify-between transition-all duration-500`}
    >
      <div>
        <div
          className={`flex flex-row justify-between text-sm pb-2 border-b border-b-gray-700 w-full`}
        >
          <div>Posted by: {author === userId ? "You" : "@" + userId}</div>
          <div>{parseDate(createdAt)}</div>
        </div>
        <h3 className={`text-neutral-600 font-semibold text-xl my-1 mb-4`}>
          {title}
        </h3>
        {index === 0 &&
          (image ? (
            <img
              src={image}
              alt="img"
              className="mx-auto rounded object-cover"
            />
          ) : (
            <img
              src="https://images2.alphacoders.com/659/659390.jpg"
              alt="img"
              className="mx-auto rounded object-cover"
            />
          ))}
      </div>
      <div>
        <div className="flex flex-row flex-wrap gap-2 my-1">
          {flags && flags.length > 0
            ? flags.map((flag) => (
                <span
                  className="bg-neutral-600 text-white text-xs py-px px-3 rounded"
                  key={flag}
                >
                  {flag}
                </span>
              ))
            : null}
        </div>
        <div className="flex flex-row w-full justify-between gap-2 pt-1 border-t border-t-gray-700">
          <div className="text-sm font-medium">
            <span className="text-sky-700">
              {upvotes === 1 ? upvotes + " upvote" : upvotes + " upvotes"}{" "}
            </span>
          </div>
          <div>
            {author === userId ? (
              <div className="flex flex-row gap-3">
                <Link
                  className="text-gray-500 border-b-2 border-b-transparent transition-all duration-500 hover:border-b-gray-500 font-medium uppercase"
                  to={"/update/" + postId}
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
            {id === postId ? (
              <Link to={"/repost/" + postId}>
                <i className="material-icons" title="repost">
                  reply
                </i>
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
