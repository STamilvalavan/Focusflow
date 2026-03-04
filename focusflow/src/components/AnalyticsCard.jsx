import { motion } from "framer-motion";

export default function AnalyticsCard({ title, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.03 }}
      transition={{ duration: 0.35 }}
      className="bg-[color:var(--ff-card)] backdrop-blur-md 
                 border border-[color:var(--ff-border)] 
                 p-6 rounded-2xl shadow-xl"
    >
      <h3 className="text-sm text-[color:var(--ff-muted)] mb-2">{title}</h3>
      <motion.p
        key={value}
        initial={{ scale: 0.9, opacity: 0.8 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 18 }}
        className={`text-3xl font-bold ${color}`}
      >
        {value}
      </motion.p>
    </motion.div>
  );
}