import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Sidebar from "../components/Sidebar";
import TaskCard from "../components/TaskCard";
import HabitCard from "../components/HabitCard";
import ProgressBar from "../components/ProgressBar";
import AnalyticsCard from "../components/AnalyticsCard";
import WeeklyChart from "../components/WeeklyChart";
import ParticleBackground from "../components/ParticleBackground";

export default function Dashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [theme, setTheme] = useState("dark");

  const [taskInput, setTaskInput] = useState("");
  const [habitInput, setHabitInput] = useState("");

  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem("tasks");
    return saved ? JSON.parse(saved) : [];
  });

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  // ================= TASK LOGIC =================
  const addTask = () => {
    if (!taskInput.trim()) return;
    setTasks(prev => [
      ...prev,
      { id: Date.now(), name: taskInput, completed: false }
    ]);
    setTaskInput("");
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
    localStorage.clear();
    setTasks([]);
    setHabits([]);
  };

  return (
    <div className="min-h-screen flex text-white">
      <ParticleBackground theme={theme} />

      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />

      <div className="flex-1 flex justify-center 
                      bg-gradient-to-br 
                      from-slate-950 via-slate-900 to-black 
                      p-8">

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
                <h1 className="text-4xl font-bold text-center 
                               bg-gradient-to-r from-purple-400 to-green-400 
                               bg-clip-text text-transparent">
                  🚀 FocusFlow
                </h1>

                <ProgressBar progress={progress} />

                {/* TASK SECTION */}
                <div className="bg-white/5 backdrop-blur-md 
                                p-6 rounded-2xl border border-white/10">
                  <h2 className="text-xl mb-4">📋 Tasks</h2>

                  <div className="flex gap-3 mb-4">
                    <input
                      value={taskInput}
                      onChange={(e) => setTaskInput(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-slate-800"
                      placeholder="Add new task..."
                    />
                    <button
                      onClick={addTask}
                      className="bg-blue-500 px-4 rounded-lg"
                    >
                      Add
                    </button>
                  </div>

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
                <div className="bg-white/5 backdrop-blur-md 
                                p-6 rounded-2xl border border-white/10">
                  <h2 className="text-xl mb-4">🔥 Habits</h2>

                  <div className="flex gap-3 mb-4">
                    <input
                      value={habitInput}
                      onChange={(e) => setHabitInput(e.target.value)}
                      className="flex-1 p-2 rounded-lg bg-slate-800"
                      placeholder="Add new habit..."
                    />
                    <button
                      onClick={addHabit}
                      className="bg-purple-500 px-4 rounded-lg"
                    >
                      Add
                    </button>
                  </div>

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
                <h1 className="text-3xl font-bold text-center">
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
                <h1 className="text-3xl font-bold text-center">
                  ⚙ Settings
                </h1>

                <div className="bg-white/5 p-6 rounded-2xl border border-white/10 space-y-6">

                  {/* Theme Toggle */}
                  <div className="flex justify-between items-center">
                    <span>Theme Mode</span>
                    <button
                      onClick={() =>
                        setTheme(theme === "dark" ? "neon" : "dark")
                      }
                      className="bg-purple-500 px-4 py-2 rounded-lg"
                    >
                      Switch Theme
                    </button>
                  </div>

                  {/* Reset Data */}
                  <div className="flex justify-between items-center">
                    <span>Reset All Data</span>
                    <button
                      onClick={resetAllData}
                      className="bg-red-500 px-4 py-2 rounded-lg"
                    >
                      Reset
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