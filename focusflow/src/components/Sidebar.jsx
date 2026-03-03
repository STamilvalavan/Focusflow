import { motion } from "framer-motion";
import { LayoutDashboard, BarChart3, Settings } from "lucide-react";
import { useState } from "react";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.div
      animate={{ width: collapsed ? 90 : 260 }}
      transition={{ duration: 0.4 }}
      className="h-screen 
                 bg-white/5 backdrop-blur-xl 
                 border-r border-white/10 
                 p-5 flex flex-col justify-between"
    >
      {/* Top Section */}
      <div>
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-8 text-sm px-3 py-2 
                     bg-white/10 hover:bg-white/20 
                     rounded-lg transition"
        >
          {collapsed ? "→" : "←"}
        </button>

        {/* Menu */}
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-4"
        >
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activePage === item.id;

            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
                whileHover={{ scale: 1.05 }}
                onClick={() => setActivePage(item.id)}
                className={`flex items-center gap-3 
                            cursor-pointer p-3 rounded-xl
                            transition relative
                            ${
                              isActive
                                ? "bg-purple-500/20 text-purple-400"
                                : "hover:bg-white/10"
                            }`}
              >
                <Icon size={20} />

                {!collapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    {item.label}
                  </motion.span>
                )}

                {/* Active Indicator */}
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-0 bottom-0 
                               w-1 bg-purple-400 rounded-r-full"
                  />
                )}
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Bottom Section */}
      {!collapsed && (
        <div className="text-xs text-gray-400">
          FocusFlow Pro ✨
        </div>
      )}
    </motion.div>
  );
}