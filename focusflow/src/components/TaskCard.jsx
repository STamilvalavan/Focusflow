import { motion } from "framer-motion";

export default function TaskCard({ task, onToggle, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, x: -50 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="relative flex justify-between items-center 
                 bg-[color:var(--ff-card)] backdrop-blur-md 
                 border border-[color:var(--ff-border)] 
                 p-4 rounded-xl mb-3 shadow-lg"
    >
      {/* Glow effect when completed */}
      {task.completed && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 rounded-xl bg-green-500/10"
        />
      )}

      <div className="relative z-10 flex-1">
        <div className="flex items-center gap-2 mb-1">
          <span
            className={`font-medium transition-all duration-300 ${
              task.completed
                ? "line-through text-[color:var(--ff-muted)]"
                : "text-[color:var(--ff-text)]"
            }`}
          >
            {task.name}
          </span>
          {task.priority && (
            <span
              className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide ${
                task.priority === "high"
                  ? "bg-red-500/20 text-red-300 border border-red-500/40"
                  : task.priority === "medium"
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                  : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
              }`}
            >
              {task.priority}
            </span>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-2 text-[11px] text-[color:var(--ff-muted)]">
          {task.dueDate && (
            <span className="inline-flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-sky-400" />
              Due {new Date(task.dueDate).toLocaleDateString()}
            </span>
          )}
          {Array.isArray(task.tags) &&
            task.tags.map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-full bg-[color:var(--ff-input-bg)] px-2 py-0.5 text-[10px]"
              >
                #{tag}
              </span>
            ))}
        </div>
      </div>

      <div className="relative z-10 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className="bg-green-500 hover:bg-green-400 
                     px-3 py-1 rounded-lg text-sm font-medium
                     transition-colors"
        >
          {task.completed ? "Mark as active" : "Mark complete"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-400 
                     px-3 py-1 rounded-lg text-sm font-medium
                     transition-colors"
        >
          Delete task
        </motion.button>
      </div>
    </motion.div>
  );
}