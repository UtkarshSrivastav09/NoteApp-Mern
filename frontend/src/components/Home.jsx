import React, { useState, useEffect } from "react";
import axios from "axios";
import NoteModel from "./NoteModel";
import { useLocation, useNavigate } from "react-router-dom";
import Alert from "./Alert";


const Home = () => {
  const [notes, setNotes] = useState([]);
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const [alert, setAlert] = useState(null); // {message, type}

  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const search = queryParams.get("search") || "";
  const tagFilter = queryParams.get("tag") || "";

  const showAlert = (message, type = "success") => {
    setAlert({ message, type });
  };

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("You are not logged in", "error");
        return;
      }

      const response = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });

      let data = response.data;

      if (search) {
        data = data.filter((note) =>
          note.title.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (tagFilter) {
        data = data.filter((note) => note.tags?.includes(tagFilter));
      }

      setNotes(data);
    } catch (err) {
      console.error(err);
      showAlert(err.response?.data?.message || "Failed to fetch notes", "error");
    }
  };

  useEffect(() => {
    fetchNotes();
  }, [search, tagFilter]);

  const handleSave = async (note) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        showAlert("You are not logged in", "error");
        return;
      }

      if (note._id) {
        await axios.put(`/api/notes/${note._id}`, note, {
          headers: { Authorization: `Bearer ${token}` },
        });
        showAlert("Note updated successfully", "success");
      } else {
        await axios.post("/api/notes", note, {
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
      if (!token) {
        showAlert("You are not logged in", "error");
        return;
      }

      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      showAlert("Note deleted successfully", "error");
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
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 p-4 md:p-8">
      {/* Floating Add Note Button */}
      <button
        onClick={() => {
          setEditNote(null);
          setIsModelOpen(true);
        }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-green-500 text-white text-4xl font-bold rounded-full shadow-xl hover:bg-green-600 flex items-center justify-center select-none leading-none transition-transform transform hover:scale-110"
      >
        +
      </button>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-white p-5 rounded-xl shadow-md border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {note.title}
            </h3>
            <p className="text-gray-600 mb-3">{note.description}</p>

            {note.tags?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-3">
                {note.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    onClick={() => navigate(`/?tag=${tag}`)}
                    className="cursor-pointer bg-gray-100 text-gray-700 text-sm px-2 py-1 rounded-full hover:bg-gray-200"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <p className="text-sm text-gray-400 mb-4">
              {new Date(note.updatedAt).toLocaleString()}
            </p>

            <div className="flex space-x-3">
              <button
                onClick={() => handleEdit(note)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-400"
              >
                Edit
              </button>
              <button
                onClick={() => handleDelete(note._id)}
                className="bg-red-600 text-white px-3 py-1 rounded-md hover:bg-red-400"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

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

      {/* Custom Alert */}
      {alert && (
        <Alert
          message={alert.message}
          type={alert.type}
          onClose={() => setAlert(null)}
        />
      )}
    </div>
  );
};

export default Home;
