import { motion } from "framer-motion";

export default function ProgressBar({ progress }) {
  return (
    <div className="p-1">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-slate-300">Daily progress</span>
        <motion.span
          key={progress}
          initial={{ scale: 0.9, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="text-sm font-semibold text-slate-100"
        >
          {progress}%
        </motion.span>
      </div>

      <div className="w-full bg-slate-700 h-3 rounded-full">
        <div
          className="bg-green-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
}