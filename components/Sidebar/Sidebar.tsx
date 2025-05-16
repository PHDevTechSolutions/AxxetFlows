"use client";

import React, { useState, useEffect } from "react";
import { FaChevronDown, FaChevronLeft, FaRegCircle, FaTachometerAlt, FaBox, FaShoppingCart, FaTruck, FaArrowCircleDown, FaExchangeAlt, FaExclamationTriangle, FaChartBar, FaTags, FaTruckLoading, FaUsersCog, FaCog } from 'react-icons/fa';

import Link from "next/link";
import { useRouter } from "next/navigation";

const Sidebar: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose, }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({});
  const [userId, setUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState({ Firstname: "", Lastname: "", Location: "", Role: "", });
  const router = useRouter();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setUserId(params.get("id"));
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!userId) return;

      try {
        const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
        if (!response.ok) throw new Error("Failed to fetch user details");

        const data = await response.json();
        setUserDetails({
          Firstname: data.Firstname || "Leroux",
          Lastname: data.Lastname || "Xchire",
          Location: data.Location || "Metro Manila, Philippines",
          Role: data.Role || "Super Admin",
        });
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const handleToggle = (section: string) => {
    setOpenSections((prevSections: any) => ({
      ...prevSections,
      [section]: !prevSections[section],
    }));
  };

  const menuItems = [
    {
      title: "Products",
      icon: FaBox,
      subItems: [
        { title: "Available Products", href: `/Inventory/AvailableProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "No-Stock", href: `/Inventory/NoStockProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Draft", href: `/Inventory/DraftProducts${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Purchase Orders",
      icon: FaShoppingCart,
      subItems: [
        { title: "Track Purchase Orders", href: `/Purchase/PurchaseOrder${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Delivered Orders", href: `/Purchase/DeliveredOrder${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Return Orders", href: `/Purchase/ReturnOrder${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Failed Orders", href: `/Purchase/FailedOrder${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Receiving",
      icon: FaTruck,
      subItems: [
        { title: "Pending Inspection", href: `/Receiving/PendingInspection${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Approved Items", href: `/Receiving/ApproveItems${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Rejected", href: `/Receiving/RejectedItems${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Stock Out / Issuance",
      icon: FaArrowCircleDown,
      subItems: [
        { title: "Sales and Stocks Records", href: `/StockOut/StockoutIssuance${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Transfers",
      icon: FaExchangeAlt,
      subItems: [
        { title: "List of Item Transfers", href: `/Transfer/TransferItem${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Reorder Alerts",
      icon: FaExclamationTriangle,
      subItems: [
        { title: "Reorder Items", href: `/Reorder/ReorderItems${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Reports",
      icon: FaChartBar,
      subItems: [
        { title: "Inventory and Sales Reports", href: `/Report/InventoryReport${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Categories",
      icon: FaTags,
      subItems: [
        { title: "Product Categories", href: `/Report/ReportFound${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Suppliers",
      icon: FaTruckLoading,
      subItems: [
        { title: "List of Suppliers", href: `/Supplier/ListofSupplier${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Inactive", href: `/Supplier/Inactive${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
        { title: "Blacklisted", href: `/Supplier/Blacklisted${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Users & Roles",
      icon: FaUsersCog,
      subItems: [
        { title: "Manage Access Control Users", href: `/Report/ReportFound${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
    {
      title: "Profile",
      icon: FaCog,
      subItems: [
        { title: "Update Profile", href: `/Setting/Profile${userId ? `?id=${encodeURIComponent(userId)}` : ""}`, },
      ],
    },
  ];

  // Filter menu items based on the user's role
  const filteredMenuItems = menuItems.filter((item) => {

    if (userDetails.Role === "Admin") {
      return item.title === "Products" ||
        item.title === "Purchase Orders" ||
        item.title === "Receiving" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Transfers" ||
        item.title === "Reorder Alerts" ||
        item.title === "Reports" ||
        item.title === "Categories" ||
        item.title === "Suppliers" ||
        item.title === "Users & Roles" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Inventory Manager") {
      return item.title === "Products" ||
        item.title === "Purchase Orders" ||
        item.title === "Receiving" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Transfers" ||
        item.title === "Reorder Alerts" ||
        item.title === "Reports" ||
        item.title === "Categories" ||
        item.title === "Suppliers" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Sales Staff") {
      return item.title === "Products" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Reports" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Warehouse Staff") {
      return item.title === "Products" ||
        item.title === "Receiving" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Transfers" ||
        item.title === "Reports" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Auditor") { //Read Only Access
      return item.title === "Products" ||
        item.title === "Purchase Orders" ||
        item.title === "Receiving" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Transfers" ||
        item.title === "Reorder Alerts" ||
        item.title === "Reports" ||
        item.title === "Categories" ||
        item.title === "Suppliers" ||
        item.title === "Users & Roles" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Purchasing Officer") {
      return item.title === "Products" ||
        item.title === "Purchase Orders" ||
        item.title === "Transfers" ||
        item.title === "Reorder Alerts" ||
        item.title === "Reports" ||
        item.title === "Suppliers" ||
        item.title === "Profile";
    }

    if (userDetails.Role === "Support Staff") {
      return item.title === "Inventory" ||
        item.title === "Purchase Orders" ||
        item.title === "Receiving" ||
        item.title === "Stock Out / Issuance" ||
        item.title === "Transfers" ||
        item.title === "Reorder Alerts" ||
        item.title === "Reports" ||
        item.title === "Categories" ||
        item.title === "Suppliers" ||
        item.title === "Profile";
    }

    return true;
  });

  return (
    <div className="relative">

      {/* Sidebar Overlay */}
      <div
        className={`fixed inset-y-0 left-0 z-50 h-screen bg-[#F1F5F9] text-[#334155] border-1  transition-all duration-300 flex flex-col ${collapsed ? "w-16" : "w-64"
          } ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}>

        {/* Logo Section */}
        <div className="flex items-center justify-between p-4 w-full">
          <div className="flex items-center">
            <img src="/assetflow.png" alt="Logo" className="w-full h-16" />
            <Link href={`/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ""}`}>
              {/* Link content here */}
            </Link>
          </div>
        </div>

        {/* User Details Section */}
        {!collapsed && (
          <div className="p-6 pt-0 text-xs text-left">
            <p className="font-bold uppercase">
              {userDetails.Lastname}, {userDetails.Firstname}
            </p>
            <p className="text-gray-600">( {userDetails.Role} )</p>
          </div>
        )}

        {/* Menu Section */}
        <div className="flex flex-col items-center rounded-md flex-grow overflow-y-auto text-xs p-2">
          <div className="w-full">
            {userDetails.Role !== "Subscribers" && (
              <Link href={`/Dashboard${userId ? `?id=${encodeURIComponent(userId)}` : ''}`} className="flex w-full p-4 text-white mb-1 bg-green-700 rounded hover: rounded-md hover:text-white transition-all">
                <FaTachometerAlt size={15} className="mr-1" />Dashboard
              </Link>
            )}
          </div>
          {filteredMenuItems.map((item, index) => (
            <div key={index} className="w-full">
              <button
                onClick={() => handleToggle(item.title)}
                className={`flex items-center w-full p-4 rounded-md transition-all hover:bg-green-700 hover:text-white ${collapsed ? "justify-center" : ""}`}
              >
                <item.icon size={15} />
                {!collapsed && <span className="ml-2">{item.title}</span>}
                {!collapsed && (
                  <span className="ml-auto">
                    {openSections[item.title] ? <FaChevronDown size={10} /> : <FaChevronLeft size={10} />}
                  </span>
                )}
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${openSections[item.title] ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  }`}
              >
                {openSections[item.title] && !collapsed && (
                  <div> {/* Added margin-left for submenu spacing */}
                    {item.subItems.map((subItem, subIndex) => (
                      <Link
                        key={subIndex}
                        href={subItem.href}
                        prefetch={true}
                        className="flex items-center w-full p-4 hover:rounded-md hover:bg-green-700 hover:text-white transition-all"
                      >
                        {/* Adding small circle icon for each submenu item */}
                        <FaRegCircle size={10} className="mr-2 ml-2" />
                        {subItem.title}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};

export default Sidebar;
