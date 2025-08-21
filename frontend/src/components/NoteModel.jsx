import React, { useState, useEffect } from "react";

const NoteModel = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState(note?.title || "");
  const [description, setDescription] = useState(note?.description || "");
  const [tags, setTags] = useState(note?.tags?.join(", ") || "");
  const [date, setDate] = useState(note?.date || ""); // New date field

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setDescription(note.description);
      setTags(note.tags?.join(", ") || "");
      setDate(note.date || "");
    } else {
      setTitle("");
      setDescription("");
      setTags("");
      setDate("");
    }
  }, [note]);

  // Helper to get day of week
  const getDayOfWeek = (dateString) => {
    if (!dateString) return "";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(dateString);
    return days[d.getDay()];
  };

  const handleSubmit = () => {
    const tagsArray = tags.split(",").map((tag) => tag.trim()).filter(Boolean);
    onSave({ ...note, title, description, tags: tagsArray, date });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-lg p-6 sm:p-8">
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-gray-800">
          {note ? "Edit Note" : "New Note"}
        </h2>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-3 mb-4 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          rows={4}
          className="w-full p-3 mb-4 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none transition"
        />

        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
          placeholder="Tags (comma separated, e.g. work, study)"
          className="w-full p-3 mb-4 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        {/* Date picker */}
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Select Date:</label>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full p-3 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
          />
          {date && (
            <p className="mt-1 text-gray-500 text-sm">
              Day: <span className="font-medium">{getDayOfWeek(date)}</span>
            </p>
          )}
        </div>

        <div className="flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition"
          >
            {note ? "Update" : "Add"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteModel;
