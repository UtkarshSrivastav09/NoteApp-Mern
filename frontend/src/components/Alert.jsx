// src/components/Alert.jsx
import React, { useEffect, useState } from "react";

const Alert = ({ message, type = "success", onClose }) => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Slide-in animation
    setShow(true);

    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300); // wait for animation to finish
    }, 3000); // auto close after 3 seconds

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-lg font-medium text-white transform transition-all duration-300 ${
        show ? "opacity-100 translate-x-0" : "opacity-0 translate-x-10"
      } ${type === "success" ? "bg-green-500" : "bg-red-500"}`}
    >
      {message}
    </div>
  );
};

export default Alert;
