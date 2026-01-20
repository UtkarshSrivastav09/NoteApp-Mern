import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Navbar = ({ user, setUser }) => {
  const [search, setSearch] = useState("");
  const [menuOpen, setMenuOpen] = useState(false); // for mobile menu toggle
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    const delay = setTimeout(() => {
      navigate(search.trim() ? `/?search=${encodeURIComponent(search)}` : "/");
    }, 500);
    return () => clearTimeout(delay);
  }, [search, navigate, user]);

  useEffect(() => {
    setSearch("");
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setUser(null);
    setSearch("");
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="bg-violet-500 p-4 text-white shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <Link
          to="/"
          className="text-2xl md:text-3xl font-sans font-bold tracking-tight"
        >
          Notes App
        </Link>

        {/* Hamburger Menu Button for Mobile */}
        {user && (
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="focus:outline-none"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                {menuOpen ? (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                ) : (
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                )}
              </svg>
            </button>
          </div>
        )}

        {/* Desktop Menu */}
        {user && (
          <div className="hidden md:flex items-center space-x-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search notes..."
              aria-label="Search notes"
              className="w-64 px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-gray-300 font-medium">{user.username}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu */}
      {user && menuOpen && (
        <div className="md:hidden mt-4 space-y-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notes..."
            aria-label="Search notes"
            className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
          />
          <span className="block text-gray-300 font-medium">{user.username}</span>
          <button
            onClick={handleLogout}
            className="w-full bg-red-600 text-white px-3 py-2 rounded-md hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
