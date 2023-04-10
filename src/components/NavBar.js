import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { IoMdClose } from "react-icons/io";
import { HiOutlinePencilSquare } from "react-icons/hi2";

const NavBar = ({ userId, searchQuery, setSearchQuery }) => {
  return (
    <nav className="flex flex-row bg-neutral-600 w-full items-center justify-center p-3 mb-[48px] md:mb-2">
      <div className="flex flex-row items-center justify-between w-full max-w-5xl">
        <div className="flex flex-row items-center gap-3">
          <h1 className="text-2xl text-white font-medium">
            <Link to="/">
              History<span className="font-bold">HUB</span>
            </Link>
          </h1>
          <div className="absolute top-12 w-full bg-neutral-600 p-2 md:p-0 left-0 md:left-auto md:w-fit md:top-auto md:relative">
            <div className=" flex flex-row gap-2 bg-white w-full rounded-full overflow-hidden p-2 items-center">
              <input
                className="outline-none pl-2 flex-1"
                type="text"
                placeholder="Search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery.trim().length ? (
                <IoMdClose
                  className="text-xl text-neutral-600 cursor-pointer"
                  onClick={() => setSearchQuery("")}
                />
              ) : (
                <FiSearch className="text-xl text-neutral-600" />
              )}
            </div>
          </div>
        </div>
        <div className="flex flex-row gap-4 items-center text-white">
          <span className="hidden md:block">Hello, @{userId}!</span>
          <Link
            className="bg-white text-neutral-600 p-2 rounded hidden md:block"
            to="/create"
          >
            Create New Post
          </Link>
          <Link
            className="bg-white text-neutral-600 p-2 rounded md:hidden"
            to="/create"
          >
            <HiOutlinePencilSquare />
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
