import { motion } from "framer-motion";

export default function HabitCard({ habit, onToggle, onDelete }) {
  const today = new Date().toDateString();
  const completedToday = habit.lastCompletedDate === today;
  const goalLabel =
    habit.frequency === "three_per_week" ? "3x / week" : "Daily";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="relative flex justify-between items-center 
                 bg-[color:var(--ff-card)] backdrop-blur-md 
                 border border-[color:var(--ff-border)] 
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
        <div className="flex items-center gap-2">
          <p
            className={`font-medium transition-all duration-300 ${
              completedToday
                ? "line-through text-[color:var(--ff-muted)]"
                : "text-[color:var(--ff-text)]"
            }`}
          >
            {habit.name}
          </p>
          <span className="inline-flex items-center rounded-full bg-[color:var(--ff-input-bg)] px-2 py-0.5 text-[10px] text-[color:var(--ff-muted)] uppercase tracking-wide">
            {goalLabel}
          </span>
        </div>

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
          className="bg-purple-500 hover:bg-purple-400 
                     px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          {completedToday ? "Completed" : "Mark done"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(habit.id)}
          className="bg-red-500 hover:bg-red-400 
                     px-3 py-1 rounded-lg text-sm font-medium transition-colors"
        >
          Delete habit
        </motion.button>
      </div>
    </motion.div>
  );
}