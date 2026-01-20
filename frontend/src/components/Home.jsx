import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteModel from "./NoteModel";
import NoteCard from "./NoteCard";
import SkeletonCard from "./SkeletonCard";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";
  const tagFilter = queryParams.get("tag") || "";

  const showAlert = (message, type = "success") => setAlert({ message, type });

  const fetchNotes = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("You are not logged in", "error");
        setTimeout(() => navigate("/login", { replace: true }), 1000);
        return;
      }

      const { data } = await axios.get(`${API_URL}/api/notes`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      let filteredData = data;
      if (search)
        filteredData = filteredData.filter((note) =>
          note.title.toLowerCase().includes(search.toLowerCase())
        );
      if (tagFilter)
        filteredData = filteredData.filter((note) =>
          note.tags?.includes(tagFilter)
        );

      setNotes(filteredData);
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || "Failed to fetch notes", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotes();
    // eslint-disable-next-line
  }, [search, tagFilter]);

  const handleSave = async (note) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return showAlert("You are not logged in", "error");

      if (note._id) {
        await axios.put(`${API_URL}/api/notes/${note._id}`, note, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Note updated successfully", "success");
      } else {
        await axios.post(`${API_URL}/api/notes`, note, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Note created successfully", "success");
      }

      fetchNotes();
      setIsModelOpen(false);
      setEditNote(null);
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || "Failed to save note", "error");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return showAlert("You are not logged in", "error");

      await axios.delete(`${API_URL}/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert("Note deleted successfully", "success");
      fetchNotes();
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || "Failed to delete note", "error");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 sm:p-8 flex flex-col items-center">
      {/* Floating Add Note Button */}
      <button
        onClick={() => {
          setEditNote(null);
          setIsModelOpen(true);
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600 flex justify-center items-center select-none leading-none transition-transform transform hover:scale-110 z-50"
      >
        +
      </button>

      {/* Notes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mt-6">
          {Array.from({ length: 8 }).map((_, idx) => (
            <SkeletonCard key={idx} />
          ))}
        </div>
      ) : notes.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 w-full max-w-7xl mt-6">
          {notes.map((note) => (
            <NoteCard
              key={note._id}
              note={note}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center mt-20 space-y-6">
          <svg
            className="w-40 h-40 text-green-400 animate-bounce"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 64 64"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M32 4v56M4 32h56" />
          </svg>
          <h2 className="text-3xl font-semibold text-gray-700 text-center">
            No notes yet!
          </h2>
          <p className="text-gray-500 text-center max-w-sm">
            Click the <span className="font-bold text-green-500">+</span> button to add your first note.
          </p>
        </div>
      )}

      {/* Modal */}
      <NoteModel
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditNote(null);
        }}
        onSave={handleSave}
        note={editNote}
      />

      {/* Alert */}
      {alert && (
        <div
          className={`fixed top-4 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-lg text-white ${
            alert.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {alert.message}
        </div>
      )}
    </div>
  );
};

export default Home;
