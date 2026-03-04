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
  const todayIndex = new Date().getDay();
  const today = new Date().toDateString();

  const completedTasks = tasks.filter((t) => t.completed).length;
  const completedHabitsToday = habits.filter(
    (h) => h.lastCompletedDate === today
  ).length;

  const totalActivityToday = completedTasks + completedHabitsToday;

  const data = days.map((day, index) => {
    const decay =
      index === todayIndex
        ? 0
        : Math.min(2, Math.abs(todayIndex - index));

    return {
      name: day,
      activity: Math.max(totalActivityToday - decay, 0),
    };
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-[color:var(--ff-card)] backdrop-blur-md 
                 border border-[color:var(--ff-border)] 
                 p-6 rounded-2xl shadow-xl"
    >
      <h2 className="text-xl font-semibold mb-4 text-[color:var(--ff-text)]">
        📊 Weekly Activity
      </h2>

      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={data}>
          <XAxis dataKey="name" stroke="var(--ff-muted)" />
          <YAxis stroke="var(--ff-muted)" />
          <Tooltip
            contentStyle={{
              backgroundColor: "var(--ff-card-strong)",
              borderColor: "var(--ff-border)",
              borderRadius: 12,
            }}
          />
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