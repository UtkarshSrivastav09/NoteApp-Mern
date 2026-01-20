import React, { useState, useEffect, useCallback } from "react";

const NoteModel = ({ isOpen, onClose, onSave, note }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [tagInput, setTagInput] = useState("");
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    if (note) {
      setTitle(note.title || "");
      setDescription(note.description || "");
      setTags(note.tags || []);
      setDate(note.date ? note.date.split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setTags([]);
      setDate("");
    }
    setTagInput("");
  }, [isOpen, note]);

  const getDayOfWeek = (dateString) => {
    if (!dateString) return "";
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const d = new Date(dateString);
    return days[d.getDay()];
  };

  const handleSubmit = () => {
  if (!title.trim()) return alert("Title is required!");
  if (!description.trim()) return alert("Description cannot be empty!");

  // Convert the date to ISO only if it's set
  const formattedDate = date ? new Date(date + "T00:00:00").toISOString() : null;

  onSave({ ...note, title, description, tags, date: formattedDate });
  onClose();
};

  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Enter" && e.target.tagName !== "TEXTAREA" && e.target.id !== "tagInput") {
        e.preventDefault();
        handleSubmit();
      }
    },
    [onClose, handleSubmit]
  );

  useEffect(() => {
    if (isOpen) document.addEventListener("keydown", handleKeyDown);
    else document.removeEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, handleKeyDown]);

  const addTag = () => {
    const newTag = tagInput.trim();
    if (newTag && !tags.includes(newTag)) setTags([...tags, newTag]);
    setTagInput("");
  };

  const removeTag = (tagToRemove) => setTags(tags.filter((t) => t !== tagToRemove));

  const handleTagKeyDown = (e) => {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault();
      addTag();
    }
    if (e.key === "Backspace" && !tagInput && tags.length > 0) removeTag(tags[tags.length - 1]);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50 px-4 sm:px-6">
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-6 sm:p-8 transform transition-all duration-300 scale-100 opacity-100">
        <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-gray-800">
          {note ? "Edit Note" : "New Note"}
        </h2>

        {/* Title */}
        <label htmlFor="title" className="block text-gray-700 mb-1 font-medium">Title</label>
        <input
          id="title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter title"
          className="w-full p-3 mb-4 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition"
        />

        {/* Description */}
        <label htmlFor="description" className="block text-gray-700 mb-1 font-medium">Description</label>
        <textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Enter description"
          rows={4}
          className="w-full p-3 mb-4 border text-gray-800 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 resize-none transition"
        />

        {/* Tags */}
        <label htmlFor="tags" className="block text-gray-700 mb-1 font-medium">Tags</label>
        <div className="w-full p-2 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-green-400 transition flex flex-wrap gap-2 mb-4 min-h-[48px]">
          {tags.map((tag, idx) => (
            <span key={idx} className="flex items-center gap-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
              {tag}
              <button type="button" onClick={() => removeTag(tag)} className="text-green-600 hover:text-green-800 font-bold">×</button>
            </span>
          ))}
          <input
            id="tagInput"
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder={tags.length === 0 ? "Type and press Enter..." : ""}
            className="flex-1 p-1 outline-none text-gray-800 min-w-[120px]"
          />
        </div>

        {/* Date */}
        <label htmlFor="date" className="block text-gray-700 mb-2 font-medium">Select Date</label>
        <input
          id="date"
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

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row justify-end sm:justify-between mt-6 gap-3">
          <button onClick={onClose} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition">Cancel</button>
          <button onClick={handleSubmit} className="w-full sm:w-auto px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white font-medium transition">{note ? "Update" : "Add"}</button>
        </div>
      </div>
    </div>
  );
};

export default NoteModel;
