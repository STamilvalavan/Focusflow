import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Navigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import HabitCard from "../components/HabitCard";
import ProgressBar from "../components/ProgressBar";
import AnalyticsCard from "../components/AnalyticsCard";
import WeeklyChart from "../components/WeeklyChart";
import ParticleBackground from "../components/ParticleBackground";
import { useAuth } from "../context/AuthContext.jsx";
import { useTheme } from "../context/ThemeContext.jsx";

export default function Dashboard() {
  const { currentUser, currentUserId, updateProfile } = useAuth();
  const { theme, setTheme } = useTheme();
  const [activePage, setActivePage] = useState(
    () => localStorage.getItem("ff_active_page") || "dashboard"
  );

  const [taskInput, setTaskInput] = useState("");
  const [taskPriority, setTaskPriority] = useState("medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [taskTags, setTaskTags] = useState("");
  const [habitInput, setHabitInput] = useState("");
  const [habitFrequency, setHabitFrequency] = useState("daily");

  const [tasks, setTasks] = useState([]);
  const [habits, setHabits] = useState([]);
  const [now, setNow] = useState(() => new Date());
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [profileName, setProfileName] = useState(currentUser?.name || "");
  const [profileEmail, setProfileEmail] = useState(currentUser?.email || "");
  const [profileDob, setProfileDob] = useState(currentUser?.dob || "");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [profileMessage, setProfileMessage] = useState("");

  // Load per-user data when user changes
  useEffect(() => {
    if (!currentUserId) {
      setTasks([]);
      setHabits([]);
      return;
    }
    const tasksKey = `tasks_${currentUserId}`;
    const habitsKey = `habits_${currentUserId}`;

    try {
      const savedTasks = localStorage.getItem(tasksKey);
      const savedHabits = localStorage.getItem(habitsKey);
      setTasks(savedTasks ? JSON.parse(savedTasks) : []);
      setHabits(savedHabits ? JSON.parse(savedHabits) : []);
    } catch {
      setTasks([]);
      setHabits([]);
    }
  }, [currentUserId]);

  // Persist per-user data
  useEffect(() => {
    if (!currentUserId) return;
    const tasksKey = `tasks_${currentUserId}`;
    localStorage.setItem(tasksKey, JSON.stringify(tasks));
  }, [tasks, currentUserId]);

  useEffect(() => {
    if (!currentUserId) return;
    const habitsKey = `habits_${currentUserId}`;
    localStorage.setItem(habitsKey, JSON.stringify(habits));
  }, [habits, currentUserId]);

  // Live clock
  useEffect(() => {
    const id = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    setProfileName(currentUser?.name || "");
    setProfileEmail(currentUser?.email || "");
    setProfileDob(currentUser?.dob || "");
  }, [currentUser]);

  // Persist last active page
  useEffect(() => {
    localStorage.setItem("ff_active_page", activePage);
  }, [activePage]);

  // ================= TASK LOGIC =================
  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks(prev => [
      ...prev,
      {
        id: Date.now(),
        name: taskInput,
        completed: false,
        priority: taskPriority,
        dueDate: taskDueDate || null,
        tags: taskTags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      }
    ]);
    setTaskInput("");
    setTaskDueDate("");
    setTaskTags("");
  };

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id
          ? { ...task, completed: !task.completed }
          : task
      )
    );
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  };

  // ================= HABIT LOGIC =================
  const addHabit = () => {
    if (!habitInput.trim()) return;
    setHabits(prev => [
      ...prev,
      {
        id: Date.now(),
        name: habitInput,
        frequency: habitFrequency,
        targetPerWeek: habitFrequency === "three_per_week" ? 3 : 7,
        streak: 0,
        lastCompletedDate: null
      }
    ]);
    setHabitInput("");
  };

  const toggleHabit = (id) => {
    const today = new Date().toDateString();

    setHabits(prev =>
      prev.map(habit => {
        if (habit.id !== id) return habit;
        if (habit.lastCompletedDate === today) return habit;

        let newStreak = habit.streak;

        if (!habit.lastCompletedDate) {
          newStreak = 1;
        } else {
          const yesterday = new Date();
          yesterday.setDate(yesterday.getDate() - 1);

          if (
            new Date(habit.lastCompletedDate).toDateString() ===
            yesterday.toDateString()
          ) {
            newStreak += 1;
          } else {
            newStreak = 1;
          }
        }

        return {
          ...habit,
          streak: newStreak,
          lastCompletedDate: today
        };
      })
    );
  };

  const deleteHabit = (id) => {
    setHabits(prev => prev.filter(habit => habit.id !== id));
  };

  if (!currentUser) {
    return <Navigate to="/signup" replace />;
  }

  // ================= ANALYTICS =================
  const totalItems = tasks.length + habits.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const completedHabits = habits.filter(
    h => h.lastCompletedDate === new Date().toDateString()
  ).length;

  const progress =
    totalItems === 0
      ? 0
      : Math.round(((completedTasks + completedHabits) / totalItems) * 100);

  const resetAllData = () => {
    if (currentUserId) {
      localStorage.removeItem(`tasks_${currentUserId}`);
      localStorage.removeItem(`habits_${currentUserId}`);
    }
    setTasks([]);
    setHabits([]);
  };

  const timeString = now.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  const handleProfileSave = () => {
    setProfileMessage("");
    if (!profileEmail.trim()) {
      setProfileMessage("Email is required.");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileEmail)) {
      setProfileMessage("Enter a valid email address.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setProfileMessage("Password must be at least 6 characters.");
      return;
    }
    if (newPassword && newPassword !== confirmPassword) {
      setProfileMessage("Passwords do not match.");
      return;
    }

    try {
      updateProfile({
        name: profileName,
        email: profileEmail,
        dob: profileDob || null,
        password: newPassword || undefined,
      });
      setProfileMessage("Profile updated.");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setProfileMessage(err.message || "Unable to update profile.");
    }
  };

  return (
    <div className="min-h-screen w-full flex text-[color:var(--ff-text)]">
      <ParticleBackground theme={theme} />

      {/* Desktop sidebar */}
      <div className="hidden md:block">
        <Sidebar
          activePage={activePage}
          setActivePage={setActivePage}
        />
      </div>

      {/* Mobile sidebar overlay */}
      {isSidebarOpen && (
        <>
          <div
            className="fixed inset-0 bg-black/60 z-30 md:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 z-40 md:hidden w-64">
            <Sidebar
              activePage={activePage}
              setActivePage={(page) => {
                setActivePage(page);
                setIsSidebarOpen(false);
              }}
            />
          </div>
        </>
      )}

      <div
        className="flex-1 flex justify-center px-4 py-6 md:px-8 md:py-10"
        style={{ backgroundImage: "var(--ff-app-gradient)" }}
      >

        <div className="w-full max-w-6xl space-y-10">

          <AnimatePresence mode="wait">

            {/* ================= DASHBOARD PAGE ================= */}
            {activePage === "dashboard" && (
              <motion.div
                key="dashboard"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <div className="flex items-center justify-between md:hidden">
                  <button
                    onClick={() => setIsSidebarOpen(true)}
                    className="inline-flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 px-3 py-2 text-sm font-medium transition-colors"
                  >
                    ☰ Menu
                  </button>
                </div>

                <div className="bg-[color:var(--ff-card)] backdrop-blur-md p-5 rounded-2xl border border-[color:var(--ff-border)] space-y-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="space-y-2 text-center md:text-left">
                    <h1 className="text-4xl font-bold 
                                   bg-gradient-to-r from-purple-400 to-green-400 
                                   bg-clip-text text-transparent">
                      🚀 FocusFlow
                    </h1>
                    <p className="text-sm text-[color:var(--ff-muted)]">
                      Welcome back,{" "}
                      <span className="font-semibold text-[color:var(--ff-text)]">
                        {currentUser?.name || "creator"}
                      </span>
                      .
                    </p>
                    <p className="text-xs text-[color:var(--ff-muted)]">
                      Plan for today: protect your focus, complete your key tasks, and keep your streak alive.
                    </p>
                  </div>

                  <div className="text-center md:text-right space-y-1">
                    <p className="text-xs uppercase tracking-wide text-[color:var(--ff-muted)]">
                      Current focus time
                    </p>
                    <p className="font-mono text-lg text-[color:var(--ff-text)]">
                      {timeString}
                    </p>
                  </div>
                  </div>

                  <ProgressBar progress={progress} />
                </div>

                {/* TASK SECTION */}
                <div className="bg-[color:var(--ff-card)] backdrop-blur-md 
                                p-6 rounded-2xl border border-[color:var(--ff-border)]">
                  <h2 className="text-xl mb-4">📋 Tasks</h2>

                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors"
                      placeholder="Add new task..."
                    />
                    <div className="flex flex-col md:flex-row gap-2">
                      <select
                        value={taskPriority}
                        onChange={(e) => setTaskPriority(e.target.value)}
                        className="rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      >
                        <option value="low">Low priority</option>
                        <option value="medium">Medium priority</option>
                        <option value="high">High priority</option>
                      </select>
                      <input
                        type="date"
                        value={taskDueDate}
                        onChange={(e) => setTaskDueDate(e.target.value)}
                        className="rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/60"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                      value={taskTags}
                      onChange={(e) => setTaskTags(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] hover:border-blue-400/50 focus:outline-none focus:ring-2 focus:ring-blue-500/60 transition-colors text-sm"
                      placeholder="Tags (comma separated, e.g. deep work, health)"
                    />
                    <button
                      onClick={addTask}
                      className="bg-blue-500 hover:bg-blue-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add task
                    </button>
                  </div>

                  {tasks.length === 0 && (
                  <div className="mt-2 rounded-xl border border-dashed border-[color:var(--ff-border)] bg-[color:var(--ff-card-strong)] p-4 text-sm text-[color:var(--ff-muted)] space-y-2">
                      <p className="font-medium text-[color:var(--ff-text)]">
                        You have no tasks yet.
                      </p>
                      <p>
                        Start by adding 1–3 important tasks you must complete today.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["Plan tomorrow", "Deep work block", "Review habits"].map(
                          (label) => (
                            <button
                              key={label}
                              onClick={() =>
                                setTasks((prev) => [
                                  ...prev,
                                  {
                                    id: Date.now() + Math.random(),
                                    name: label,
                                    completed: false,
                                    priority: "medium",
                                    dueDate: null,
                                    tags: [],
                                  },
                                ])
                              }
                              className="px-3 py-1 rounded-full bg-[color:var(--ff-input-bg)] hover:brightness-105 text-xs text-[color:var(--ff-text)] transition"
                            >
                              Quick add: {label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onToggle={toggleTask}
                      onDelete={deleteTask}
                    />
                  ))}
                </div>

                {/* HABIT SECTION */}
                <div className="bg-[color:var(--ff-card)] backdrop-blur-md 
                                p-6 rounded-2xl border border-[color:var(--ff-border)]">
                  <h2 className="text-xl mb-4">🔥 Habits</h2>

                  <div className="flex flex-col md:flex-row gap-3 mb-4">
                    <input
                      value={habitInput}
                      onChange={(e) => setHabitInput(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] hover:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/60 transition-colors"
                      placeholder="Add new habit..."
                    />
                    <select
                      value={habitFrequency}
                      onChange={(e) => setHabitFrequency(e.target.value)}
                      className="rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                    >
                      <option value="daily">Daily</option>
                      <option value="three_per_week">3x per week</option>
                    </select>
                    <button
                      onClick={addHabit}
                      className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Add habit
                    </button>
                  </div>

                  {habits.length === 0 && (
                  <div className="mt-2 rounded-xl border border-dashed border-[color:var(--ff-border)] bg-[color:var(--ff-card-strong)] p-4 text-sm text-[color:var(--ff-muted)] space-y-2">
                      <p className="font-medium text-[color:var(--ff-text)]">
                        You have no habits yet.
                      </p>
                      <p>
                        Create simple, repeatable habits to keep your momentum.
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {["Read 10 minutes", "Walk 5 minutes", "Plan tomorrow"].map(
                          (label) => (
                            <button
                              key={label}
                              onClick={() =>
                                setHabits((prev) => [
                                  ...prev,
                                  {
                                    id: Date.now() + Math.random(),
                                    name: label,
                                    frequency: "daily",
                                    targetPerWeek: 7,
                                    streak: 0,
                                    lastCompletedDate: null,
                                  },
                                ])
                              }
                              className="px-3 py-1 rounded-full bg-[color:var(--ff-input-bg)] hover:brightness-105 text-xs text-[color:var(--ff-text)] transition"
                            >
                              Quick add: {label}
                            </button>
                          )
                        )}
                      </div>
                    </div>
                  )}

                  {habits.map(habit => (
                    <HabitCard
                      key={habit.id}
                      habit={habit}
                      onToggle={toggleHabit}
                      onDelete={deleteHabit}
                    />
                  ))}
                </div>
              </motion.div>
            )}

            {/* ================= ANALYTICS PAGE ================= */}
            {activePage === "analytics" && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-10"
              >
                <h1 className="text-3xl font-bold text-center text-[color:var(--ff-text)]">
                  📊 Analytics Overview
                </h1>

                <div className="grid md:grid-cols-3 gap-6">
                  <AnalyticsCard
                    title="Completed Tasks"
                    value={completedTasks}
                    color="text-blue-400"
                  />
                  <AnalyticsCard
                    title="Completed Habits"
                    value={completedHabits}
                    color="text-purple-400"
                  />
                  <AnalyticsCard
                    title="Overall Progress"
                    value={`${progress}%`}
                    color="text-green-400"
                  />
                </div>

                <WeeklyChart tasks={tasks} habits={habits} />
              </motion.div>
            )}

            {/* ================= SETTINGS PAGE ================= */}
            {activePage === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.4 }}
                className="space-y-8"
              >
                <h1 className="text-3xl font-bold text-center text-[color:var(--ff-text)]">
                  ⚙ Settings
                </h1>

                <div className="bg-[color:var(--ff-card)] p-6 rounded-2xl border border-[color:var(--ff-border)] space-y-6">

                  {/* Profile settings */}
                  <div className="space-y-3 border-b border-white/10 pb-4 mb-2">
                    <h2 className="text-lg font-semibold text-[color:var(--ff-text)]">
                      Profile
                    </h2>
                    <div className="grid md:grid-cols-2 gap-3 text-sm">
                      <div className="space-y-1">
                        <label className="text-[color:var(--ff-muted)]">Name</label>
                        <input
                          type="text"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          className="w-full rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[color:var(--ff-muted)]">Email</label>
                        <input
                          type="email"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          className="w-full rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[color:var(--ff-muted)]">Date of birth</label>
                        <input
                          type="date"
                          value={profileDob || ""}
                          onChange={(e) => setProfileDob(e.target.value)}
                          className="w-full rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[color:var(--ff-muted)]">New password</label>
                        <input
                          type="password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="w-full rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                        <input
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          placeholder="Confirm password"
                          className="w-full mt-1 rounded-lg bg-[color:var(--ff-input-bg)] border border-[color:var(--ff-border)] px-3 py-2 text-xs focus:outline-none focus:ring-2 focus:ring-purple-500/60"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-xs text-[color:var(--ff-muted)]">
                      <button
                        onClick={handleProfileSave}
                        className="bg-slate-100 text-slate-900 hover:bg-white px-4 py-1.5 rounded-lg text-xs font-semibold transition-colors"
                      >
                        Save profile
                      </button>
                      {profileMessage && (
                        <span>{profileMessage}</span>
                      )}
                    </div>
                  </div>

                  {/* Theme Toggle */}
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm">Theme mode</p>
                      <p className="text-xs text-[color:var(--ff-muted)]">
                        Current: {theme === "light" ? "Light" : "Dark"}
                      </p>
                    </div>
                    <button
                      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                      className="bg-purple-500 hover:bg-purple-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Switch theme
                    </button>
                  </div>

                  {/* Reset Data */}
                  <div className="flex justify-between items-center">
                    <span>Reset all data</span>
                    <button
                      onClick={resetAllData}
                      className="bg-red-500 hover:bg-red-400 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    >
                      Reset data
                    </button>
                  </div>

                  {/* Future Setting */}
                  <div className="flex justify-between items-center">
                    <span>Notifications</span>
                    <button className="bg-slate-700 px-4 py-2 rounded-lg">
                      Coming Soon
                    </button>
                  </div>

                </div>
              </motion.div>
            )}

          </AnimatePresence>

        </div>
      </div>
    </div>
  );
}