import React, { useState } from "react";
import Sidebar from "../../components/layout/Sidebar";
import { Clock, Menu } from "lucide-react";
import Header from "../../components/layout/Header";

const DashboardPage = ({ stats = [], dashboardData = {} }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const documents = dashboardData?.recentActivity?.documents || [];
  const quizzes = dashboardData?.recentActivity?.quizzes || [];

  const activities = [
    ...documents.map((doc) => ({
      id: doc._id,
      description: doc.title,
      timestamp: doc.lastAccessed,
      link: `/documents/${doc._id}`,
    })),
    ...quizzes.map((quiz) => ({
      id: quiz._id,
      description: quiz.title,
      timestamp: quiz.completedAt,
      link: `/quizzes/${quiz._id}`,
    })),
  ].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/* Main Content */}
        <div className="flex-1 md:ml-64 flex flex-col">
          {/* Top Bar (Mobile Toggle Button Added Here) */}
          <div className="md:hidden p-4 bg-white shadow flex items-center">
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <Menu size={22} />
            </button>
            <h1 className="ml-4 text-lg font-semibold">Dashboard</h1>
          </div>

          {/* Page Content */}
          <div className="p-8">
            {/* Title */}
            <div className="mb-6 hidden md:block">
              <h1 className="text-3xl font-semibold text-gray-900">
                Dashboard
              </h1>
              <p className="text-gray-500">
                Track your learning progress and activity
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white shadow rounded-xl p-6 border border-gray-100"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-gray-500 text-sm font-medium">
                      {stat.label}
                    </span>

                    <div
                      className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-md ${stat.gradient}`}
                    >
                      <stat.icon className="text-white" strokeWidth={2} />
                    </div>
                  </div>

                  <div className="mt-4 text-3xl font-semibold text-gray-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-xl shadow border border-gray-100">
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-full bg-gray-100">
                  <Clock className="text-gray-600" strokeWidth={2} />
                </div>
                <h3 className="text-xl font-semibold text-gray-900">
                  Recent Activity
                </h3>
              </div>

              {activities.length > 0 ? (
                <div className="space-y-4">
                  {activities.map((activity, index) => (
                    <div
                      key={activity.id || index}
                      className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:bg-gray-50 transition"
                    >
                      <div>
                        <p className="font-medium text-gray-900">
                          {activity.description}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(activity.timestamp).toLocaleString()}
                        </p>
                      </div>

                      <a
                        href={activity.link}
                        className="text-blue-600 font-medium hover:underline"
                      >
                        View
                      </a>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-900 font-medium">
                    No recent activity yet.
                  </p>
                  <p className="text-gray-500 text-sm">
                    Start learning to see your progress here
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DashboardPage;
