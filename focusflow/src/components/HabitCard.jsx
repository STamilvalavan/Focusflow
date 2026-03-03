import { motion } from "framer-motion";

export default function HabitCard({ habit, onToggle, onDelete }) {
  const today = new Date().toDateString();
  const completedToday = habit.lastCompletedDate === today;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="relative flex justify-between items-center 
                 bg-slate-800/70 backdrop-blur-md 
                 border border-slate-700 
                 p-4 rounded-xl mb-3 shadow-lg"
    >
      {/* Streak Glow Effect */}
      {completedToday && (
        <motion.div
          layoutId="streakGlow"
          className="absolute inset-0 rounded-xl bg-purple-500/10"
        />
      )}

      <div className="relative z-10">
        <p
          className={`font-medium transition-all duration-300 ${
            completedToday
              ? "line-through text-gray-400"
              : "text-white"
          }`}
        >
          {habit.name}
        </p>

        <motion.p
          key={habit.streak}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="text-sm text-purple-400"
        >
          🔥 Streak: {habit.streak} days
        </motion.p>
      </div>

      <div className="relative z-10 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(habit.id)}
          className="bg-purple-500 hover:bg-purple-600 
                     px-3 py-1 rounded-lg text-sm transition"
        >
          {completedToday ? "Completed" : "Done"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(habit.id)}
          className="bg-red-500 hover:bg-red-600 
                     px-3 py-1 rounded-lg text-sm transition"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}