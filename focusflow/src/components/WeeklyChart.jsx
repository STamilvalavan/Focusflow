import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function WeeklyChart({ tasks, habits }) {
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const data = days.map((day, index) => {
    const countTasks = tasks.filter((t) => t.completed).length;
    const countHabits = habits.filter(
      (h) => h.lastCompletedDate
    ).length;

    return {
      name: day,
      activity: index === new Date().getDay()
        ? countTasks + countHabits
        : Math.floor(Math.random() * 3),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-slate-800/60 backdrop-blur-md 
                 border border-slate-700 
                 p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4">
        📊 Weekly Activity
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="#94a3b8" />
          <YAxis stroke="#94a3b8" />
          <Tooltip />
          <Bar
            dataKey="activity"
            fill="#a855f7"
            radius={[8, 8, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}