import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  User,
  LogOut,
  BrainCircuit,
  BookOpen,
  X,
} from "lucide-react";

// Colors taken directly from your screenshot
const ACTIVE_GREEN = "#10B981";

const navLinks = [
  { to: "/dashboard", icon: LayoutDashboard, text: "Dashboard" },
  { to: "/documents", icon: FileText, text: "Documents" },
  { to: "/flashcards", icon: BookOpen, text: "Flashcards" },
  { to: "/profile", icon: User, text: "Profile" },
];

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Failed to log out", error);
    }
  };

  const closeOnMobile = () => {
    if (window.innerWidth < 768) toggleSidebar();
  };

  return (
    <>
      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/20 z-40 md:hidden transition-opacity duration-300 ${
          isSidebarOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={toggleSidebar}
        aria-hidden="true"
      />

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r z-50 transition-transform duration-300 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0`}
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo + Button */}
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-2">
              <div
                className="p-2 rounded-xl"
                style={{ backgroundColor: ACTIVE_GREEN }}
              >
                <BrainCircuit
                  className="text-white"
                  size={20}
                  strokeWidth={2.5}
                />
              </div>

              <h1 className="text-[15px] font-bold text-gray-900">
                AI Learning Assistant
              </h1>
            </div>

            <button
              onClick={toggleSidebar}
              className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
            >
              <X size={20} />
            </button>
          </div>

          {/* Menu Items */}
          <nav className="flex-1 space-y-1">
            {navLinks.map(({ to, icon: Icon, text }) => (
              <NavLink
                key={to}
                to={to}
                onClick={closeOnMobile}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2 rounded-xl transition-all ${
                    isActive
                      ? "text-white shadow-md"
                      : "text-gray-700 hover:bg-gray-100"
                  }`
                }
                style={({ isActive }) =>
                  isActive ? { backgroundColor: ACTIVE_GREEN } : {}
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      strokeWidth={2.2}
                      className={isActive ? "text-white" : "text-gray-700"}
                    />
                    <span className="font-medium">{text}</span>
                  </>
                )}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="mt-auto pt-4 border-t">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <LogOut size={18} />
              <span className="font-medium">Logout</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
