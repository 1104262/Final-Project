import React from "react";
import { GiQuillInk } from "react-icons/gi";

const Loader = () => {
  return (
    <div className="flex flex-col flex-grow items-center justify-center">
      <GiQuillInk className="text-neutral-600 text-6xl animate-bounce" />
    </div>
  );
};

export default Loader;
