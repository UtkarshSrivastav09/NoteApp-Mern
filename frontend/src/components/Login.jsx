import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [shake, setShake] = useState(false);
  const [errors, setErrors] = useState({}); // For real-time error messages

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email cannot be blank";
    if (!password.trim()) newErrors.password = "Password cannot be blank";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setShake(true);
      setTimeout(() => setShake(false), 500);
      return;
    }

    try {
      const { data } = await axios.post(`${API_URL}/api/users/login`, {
        email,
        password,
      });

      console.log("Login Success:", data);

      // ✅ Store token
      localStorage.setItem("token", data.token);

      // ✅ Set user state
      setUser({ id: data.id, name: data.name, email: data.email });

      // ✅ Redirect to home page
      navigate("/", { replace: true });
    } catch (err) {
      const msg =
        err.response?.data?.message || "Login failed. Please try again.";
      setErrors({ form: msg });
      setShake(true);
      setTimeout(() => setShake(false), 500);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      <div
        className={`w-full max-w-md p-10 bg-white/80 backdrop-blur-md rounded-3xl shadow-2xl border border-gray-200/50 transition-transform ${
          shake ? "animate-shake" : ""
        }`}
      >
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Login
        </h2>

        {errors.form && (
          <div className="bg-red-100 text-red-700 p-2 rounded mb-4 text-center">
            {errors.form}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl text-black outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-5 py-3 border border-gray-300 rounded-xl text-black outline-none focus:ring-2 focus:ring-blue-500 transition duration-300 shadow-md"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-blue-500 text-white font-semibold rounded-xl hover:bg-blue-600 transition duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Login
          </button>
        </form>

        <p className="mt-6 text-center text-gray-700">
          Don't have an account?{" "}
          <Link
            className="text-blue-600 font-semibold hover:underline"
            to="/register"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
