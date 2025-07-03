import { useState } from "react";
import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";

function Layout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const user = JSON.parse(localStorage.getItem("currentUser"));

  const navItems = [
    { path: "/", label: "Dashboard", icon: "📊" },
    { path: "/courses", label: "Courses", icon: "📚" },
    { path: "/certificates", label: "My Certificates", icon: "🎓" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  if (!user) return null;

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="flex justify-between items-center px-4 h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="text-xl text-gray-600 hover:text-gray-800"
              title="Toggle sidebar"
            >
              ≡
            </button>
            <Link to="/" className="text-2xl font-bold text-blue-600">
              🎓 LearnHub
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <button className="p-2 text-gray-400 hover:text-gray-600" title="Notifications">
              🔔
            </button>
            <Link
              to="/profile"
              className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center hover:shadow transition"
              title="Go to Profile"
            >
              <span className="text-blue-600 font-medium">
                {user?.name?.charAt(0) || "?"}
              </span>
            </Link>
            <button
              onClick={handleLogout}
              className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800 border rounded"
              title="Logout"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Body */}
      <div className="flex flex-1">
        {/* Sidebar */}
        <aside
          className={`${
            collapsed ? "w-20" : "w-64"
          } bg-white shadow-sm transition-all duration-300 min-h-full`}
        >
          <nav className="p-4">
            <ul className="space-y-2">
              {navItems.map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-blue-50 text-blue-700 border-r-2 border-blue-700"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`}
                  >
                    <span className="text-lg mr-3">{item.icon}</span>
                    {!collapsed && <span>{item.label}</span>}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default Layout;