import axios from 'axios';
import NoteModel from './NoteModel';
import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const Home = () => {
  const [notes, setNotes] = useState([]);
  const [error, setError] = useState("");
  const [isModelOpen, setIsModelOpen] = useState(false);
  const [editNote, setEditNote] = useState(null);
  const location = useLocation();

  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Log In");
        return;
      }
      const searchParams = new URLSearchParams(location.search);
      const search = searchParams.get("search") || "";

      const { data } = await axios.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` }
      });

      const filteredNotes = search
        ? data.filter((note) =>
            note.title.toLowerCase().includes(search.toLowerCase()) ||
            note.description.toLowerCase().includes(search.toLowerCase())
          )
        : data;

      setNotes(filteredNotes);
    } catch (err) {
      setError("Failed to fetch notes.");
    }
  };

  const handleEdit = (note) => {
    setEditNote(note);
    setIsModelOpen(true);
  };

  useEffect(() => {
    fetchNotes();
  }, [location.search]);

  const handleSaveNote = (newNote) => {
    if (editNote) {
      setNotes(notes.map((note) => (note._id === newNote._id ? newNote : note)));
    } else {
      setNotes([...notes, newNote]);
    }
    setEditNote(null);
    setIsModelOpen(false);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please Log In");
        return;
      }
      await axios.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (err) {
      setError("Failed to Delete");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 min-h-screen bg-blue-500">
      {error && <p className="text-red-400 mb-4">{error}</p>}
      <NoteModel
        isOpen={isModelOpen}
        onClose={() => {
          setIsModelOpen(false);
          setEditNote(null);
        }}
        note={editNote}
        onSave={handleSaveNote}
      />
      <button
        onClick={() => setIsModelOpen(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-gray-800 text-white text-3xl rounded-full shadow-lg hover:bg-gray-900 flex items-center justify-center"
      >
        <span className="mb-1 text-center">+</span>
      </button>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {notes.map((note) => (
          <div className="bg-gray-700 p-4 rounded-lg shadow-md" key={note._id}>
            <h3 className="text-lg font-medium text-white mb-2">{note.title}</h3>
            <p className="text-gray-300 mb-4">{note.description}</p>
            <p className="text-sm text-gray-400 mb-4">
              {new Date(note.updatedAt).toLocaleString()}
            </p>
            <div className="flex space-x-4">
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
    </div>
  );
};

export default Home;
