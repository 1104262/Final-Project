import CreateForm from "../components/CreateForm";
import { useState } from "react";

const Create = ({ userId }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  return (
    <div className="flex flex-col w-full px-3 items-center bg-neutral-500 flex-grow">
      <div className="flex flex-col w-full max-w-5xl ">
        <CreateForm
          userId={userId}
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          imageUrl={imageUrl}
          setImageUrl={setImageUrl}
        />
      </div>
    </div>
  );
};

export default Create;
