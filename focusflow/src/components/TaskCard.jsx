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
                 bg-slate-800/70 backdrop-blur-md 
                 border border-slate-700 
                 p-4 rounded-xl mb-3 shadow-lg"
    >
      {/* Glow effect when completed */}
      {task.completed && (
        <motion.div
          layoutId="glow"
          className="absolute inset-0 rounded-xl bg-green-500/10"
        />
      )}

      <span
        className={`relative z-10 font-medium transition-all duration-300 ${
          task.completed
            ? "line-through text-gray-400"
            : "text-white"
        }`}
      >
        {task.name}
      </span>

      <div className="relative z-10 flex gap-2">
        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onToggle(task.id)}
          className="bg-green-500 hover:bg-green-600 
                     px-3 py-1 rounded-lg text-sm 
                     transition"
        >
          {task.completed ? "Undo" : "Complete"}
        </motion.button>

        <motion.button
          whileTap={{ scale: 0.9 }}
          onClick={() => onDelete(task.id)}
          className="bg-red-500 hover:bg-red-600 
                     px-3 py-1 rounded-lg text-sm 
                     transition"
        >
          Delete
        </motion.button>
      </div>
    </motion.div>
  );
}