import React from "react";
import { PencilIcon, TrashIcon, CalendarIcon, TagIcon } from "@heroicons/react/24/outline";

const NoteCard = ({ note, onEdit, onDelete }) => {
  const getFormattedDate = (isoDate) => {
    if (!isoDate) return "";
    const dateObj = new Date(isoDate);
    const options = { weekday: "short", year: "numeric", month: "short", day: "numeric" };
    return dateObj.toLocaleDateString(undefined, options);
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition transform hover:scale-[1.02] flex flex-col justify-between w-full">
      {/* Title */}
      <h3 className="text-lg font-bold text-gray-900 truncate">{note.title}</h3>

      {/* Description */}
      <p className="text-gray-700 mt-3 text-sm sm:text-base whitespace-pre-wrap break-words line-clamp-4">
        {note.description || "No description available"}
      </p>

      {/* Tags */}
      {note.tags && note.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          <TagIcon className="w-4 h-4 text-gray-400 mt-0.5" />
          {note.tags.map((tag, idx) => (
            <span
              key={idx}
              className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Date */}
      {note.date && (
        <div className="flex items-center text-gray-500 text-sm mt-3 gap-1">
          <CalendarIcon className="w-4 h-4" />
          <span>{getFormattedDate(note.date)}</span>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-5">
        <button
          onClick={() => onEdit(note)}
          className="flex items-center gap-1 px-3 py-1 bg-yellow-400 text-white rounded-lg text-sm hover:bg-yellow-500 transition"
        >
          <PencilIcon className="w-4 h-4" /> Edit
        </button>
        <button
          onClick={() => onDelete(note._id)}
          className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-sm hover:bg-red-600 transition"
        >
          <TrashIcon className="w-4 h-4" /> Delete
        </button>
      </div>
    </div>
  );
};

export default NoteCard;
