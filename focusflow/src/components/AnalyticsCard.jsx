import { motion } from "framer-motion";

export default function AnalyticsCard({ title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.4 }}
      className="bg-slate-800/60 backdrop-blur-md 
                 border border-slate-700 
                 p-6 rounded-2xl shadow-xl"
    >
      <h3 className="text-gray-400 mb-2">{title}</h3>
      <motion.p
        key={value}
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className={`text-3xl font-bold ${color}`}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}