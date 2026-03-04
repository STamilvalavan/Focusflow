import { motion } from "framer-motion";
import { LayoutDashboard, BarChart3, Settings, LogOut } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";

const menuItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ activePage, setActivePage }) {
  const [collapsed, setCollapsed] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const initials =
    currentUser?.name
      ?.split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase() || "?";

  const formattedDob = currentUser?.dob
    ? new Date(currentUser.dob).toLocaleDateString()
    : null;

  return (
    <motion.div
      animate={{ width: collapsed ? 90 : 260 }}
      transition={{ duration: 0.4 }}
      className="h-screen 
                 bg-[color:var(--ff-sidebar-bg)] backdrop-blur-xl 
                 border-r border-[color:var(--ff-border)] 
                 p-5 flex flex-col justify-between"
    >
      {/* Top Section */}
      <div>
        {/* Collapse Button */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="mb-8 text-sm px-3 py-2 
                     bg-[color:var(--ff-card)] hover:bg-[color:var(--ff-card-strong)] text-[color:var(--ff-text)]
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
                                ? "bg-purple-500/15 text-purple-500"
                                : "text-[color:var(--ff-muted)] hover:bg-[color:var(--ff-card)]"
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

      {/* Bottom Section – Profile */}
      <div className="mt-6">
        {currentUser && !collapsed && (
          <div className="flex items-center justify-between gap-3 bg-[color:var(--ff-card)] border border-[color:var(--ff-border)] rounded-xl px-3 py-3">
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-sky-400 flex items-center justify-center text-xs font-semibold text-slate-950">
                {initials}
              </div>
              <div className="space-y-0.5">
                <p className="text-sm font-semibold text-[color:var(--ff-text)]">
                  {currentUser.name}
                </p>
                <p className="text-[11px] text-[color:var(--ff-muted)] truncate max-w-[130px]">
                  {currentUser.email}
                </p>
                {formattedDob && (
                  <p className="text-[11px] text-[color:var(--ff-muted)]">
                    DOB: {formattedDob}
                  </p>
                )}
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate("/signin", { replace: true });
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              title="Logout"
            >
              <LogOut size={16} className="text-slate-200" />
            </button>
          </div>
        )}

        {currentUser && collapsed && (
          <div className="flex flex-col items-center gap-2">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-purple-500 to-sky-400 flex items-center justify-center text-xs font-semibold text-slate-950">
              {initials}
            </div>
            <button
              onClick={() => {
                logout();
                navigate("/signin", { replace: true });
              }}
              className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 transition"
              title="Logout"
            >
              <LogOut size={16} className="text-slate-200" />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
}