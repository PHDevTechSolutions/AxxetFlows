import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import { FaBars, FaBell, FaSignOutAlt } from "react-icons/fa";

const Navbar: React.FC<{ onToggleSidebar: () => void }> = ({ onToggleSidebar }) => {
  const [userName, setUserName] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const userId = params.get("id");

    if (userId) {
      fetch(`/api/user?id=${encodeURIComponent(userId)}`)
        .then(response => response.json())
        .then(data => {
          setUserName(data.userName);
          setUserEmail(data.Email);
        })
        .catch(error => console.error("Error fetching user data:", error));
    }
  }, []);

  useEffect(() => {
    if (!userEmail) return;

    const fetchNotifications = async () => {
      try {
        const [approvedRes] = await Promise.all([
          fetch(`/api/Notification/ReportItems/FetchRecord?email=${encodeURIComponent(userEmail)}`)
        ]);

        const approvedData = await approvedRes.json();

        const approvedNotifications = approvedData.filter(
          (item: any) => item.ItemProgress?.toLowerCase() === "approve"
        ).map((item: any) => ({
          type: "approved",
          message: "Your post has been approved and posted into the website."
        }));

        setNotifications([...approvedNotifications]);
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      }
    };

    fetchNotifications();
  }, [userEmail]);

  const handleLogout = async () => {
    await fetch("/api/logout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });

    sessionStorage.clear();
    router.push("/login");
  };

  return (
    <div className="flex justify-between items-center p-4 bg-[#F1F5F9] text-[#334155] shadow-md relative">
      <div className="flex items-center">
        <button onClick={onToggleSidebar} className="p-2">
          <FaBars size={15} />
        </button>
      </div>

      <div className="flex items-center gap-4 text-xs relative">
        <div className="relative">
          <button onClick={() => setShowNotifications(!showNotifications)} className="relative">
            <FaBell size={15} />
            {notifications.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] px-1 rounded-full">
                {notifications.length}
              </span>
            )}
          </button>
          {showNotifications && (
            <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded text-gray-800 text-xs z-50 max-h-64 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-3 text-center text-gray-500">No new notifications</div>
              ) : (
                notifications.map((notif, index) => (
                  <div key={index} className="p-3 border-b hover:bg-gray-100">
                    {notif.message}
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <span className="capitalize">Hello, {userName}</span>
        <button className="bg-red-700 px-2 py-2 text-white rounded flex gap-1" onClick={() => setShowLogoutModal(true)}>
          <FaSignOutAlt size={15} />Logout
        </button>
      </div>

      {showLogoutModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center text-gray-800">
            <p className="mb-4 text-xs">Are you sure you want to logout?</p>
            <div className="flex justify-center space-x-4">
              <button className="bg-gray-300 px-4 py-2 rounded text-gray-800 text-xs" onClick={() => setShowLogoutModal(false)}>
                Cancel
              </button>
              <button className="bg-red-500 px-4 py-2 text-white rounded text-xs" onClick={handleLogout}>
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
