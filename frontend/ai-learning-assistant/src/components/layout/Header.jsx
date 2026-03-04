import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Bell, User, Menu } from "lucide-react";

const Header = ({ toggleSidebar }) => {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full border-b bg-white px-4 sm:px-6 lg:px-8 justify-end">
      <div className="flex w-full items-center justify-end gap-6">
        {/* Mobile Menu Button */}
        <button
          onClick={toggleSidebar}
          className="inline-flex items-center justify-center rounded-md p-2 text-gray-500 hover:bg-gray-100 lg:hidden"
          aria-label="Toggle sidebar"
        >
          <Menu size={24} />
        </button>

        {/* Notifications */}
        <button className="relative rounded-full p-1 text-gray-500 hover:text-gray-700">
          <Bell size={22} />
          <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-green-500 ring-2 ring-white"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3">
          {/* Green Icon Box */}
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500 text-white">
            <User size={20} strokeWidth={2.5} />
          </div>

          {/* Text */}
          <div className="flex flex-col leading-tight text-right">
            <p className="text-sm font-semibold text-gray-700">
              {user?.username || "Alex"}
            </p>
            <p className="text-xs text-gray-500 -mt-0.5">
              {user?.email || "alex@example.com"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
