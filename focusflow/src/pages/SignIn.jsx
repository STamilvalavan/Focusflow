import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

export default function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    const nextErrors = {};
    if (!email.trim()) {
      nextErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (!password.trim()) {
      nextErrors.password = "Password is required.";
    } else if (password.length < 6) {
      nextErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    try {
      login({ email, password });
      navigate("/");
    } catch (err) {
      setSubmitError(err.message || "Unable to sign in.");
    }
  };

  return (
    <div className="w-full px-4 py-10 md:py-16 flex justify-center">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-[color:var(--ff-card)] border border-[color:var(--ff-border)] rounded-3xl shadow-2xl backdrop-blur-xl p-8 md:p-10 space-y-6"
      >
        <div className="text-center space-y-3">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            className="text-3xl md:text-4xl font-extrabold bg-gradient-to-r from-purple-400 via-sky-400 to-emerald-400 bg-clip-text text-transparent"
          >
            Welcome back
          </motion.h1>
          <p className="text-sm text-[color:var(--ff-muted)]">
            Sign in to continue your focus and habit streaks.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 hover:border-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent placeholder:text-slate-500 transition-colors"
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="text-xs text-red-400 mt-0.5">{errors.email}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl bg-slate-900/70 border border-slate-700 hover:border-slate-500 px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/80 focus:border-transparent placeholder:text-slate-500 transition-colors"
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-xs text-red-400 mt-0.5">{errors.password}</p>
            )}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            type="submit"
            className="w-full mt-2 rounded-xl bg-gradient-to-r from-purple-500 via-sky-500 to-emerald-400 text-slate-950 font-semibold py-2.5 text-sm shadow-lg shadow-purple-500/30 hover:brightness-110 transition"
          >
            Sign in
          </motion.button>
        </form>

        {submitError && (
          <p className="text-xs text-red-400 text-center">{submitError}</p>
        )}

        <div className="text-center text-xs text-slate-400">
          <span>Don&apos;t have an account? </span>
          <Link
            to="/signup"
            className="text-purple-400 hover:text-purple-300 underline underline-offset-4"
          >
            Sign up
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

