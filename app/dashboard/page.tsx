'use client';

import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/Layouts/ParentLayout';
import SessionChecker from '../../components/Session/SessionChecker';
import UserFetcher from '../../components/UserFetcher/UserFetcher';

import { FcLineChart, FcPackage, FcInTransit, FcClock, FcAlarmClock, FcAdvertising, FcDown, FcRefresh, FcNeutralTrading } from "react-icons/fc";

type ReceivedData = {
  PONumber: string;
  ProductSKU: string;
  ProductName: string;
  ProductQuantity: number;
  DateReceived: string;
};

type StockOutData = {
  ReferenceNumber: string;
  ProductSKU: string;
  ProductName: string;
  ProductQuantity: number;
  DateIssuance: string;
};

type TransferData = {
  ProductName: string;
  ProductQuantity: number;
  ProductSKU: string;
  UnitMeasure: string;
  DateTransfer: string;
};

type SupplierData = {
  Status: string;
}

type PurchaseOrder = {
  Status: string;
}

type Reorder = {
  ReferenceNumber: string;
  ProductSKU: string;
  ProductName: string;
  SupplierName: string;
  LastOrderDate: string;
  LeadTime: string;
}

const ITEMS_PER_PAGE = 5;

const DashboardPage: React.FC = () => {
  const [userDetails, setUserDetails] = useState({ UserId: "", Firstname: "", Lastname: "", Email: "", Role: "", Location: "", });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);

  // Reorder data state
  const [totalReorderLevel, setTotalReorderLevel] = useState(0);
  const [topReorderItems, setTopReorderItems] = useState<
    { ProductSKU: string; ProductName: string; ReorderLevel: number }[]
  >([]);

  // === New states for Latest Transactions Summary ===
  const [receivedData, setReceivedData] = useState<ReceivedData[]>([]);
  const [receivedPage, setReceivedPage] = useState(1);

  const [stockOutData, setStockOutData] = useState<StockOutData[]>([]);
  const [stockOutPage, setStockOutPage] = useState(1);

  const [transferData, setTransferData] = useState<TransferData[]>([]);
  const [transferPage, setTransferPage] = useState(1);

  const [activeTab, setActiveTab] = useState("received");

  const [activeSuppliers, setActiveSuppliers] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);
  const [delayedOrders, setDelayedOrders] = useState<Reorder[]>([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const params = new URLSearchParams(window.location.search);
      const userId = params.get("id");

      if (userId) {
        try {
          const response = await fetch(`/api/user?id=${encodeURIComponent(userId)}`);
          if (!response.ok) throw new Error("Failed to fetch user data");
          const data = await response.json();
          setUserDetails({
            UserId: data._id,
            Firstname: data.Firstname || "",
            Lastname: data.Lastname || "",
            Email: data.Email || "",
            Role: data.Role || "",
            Location: data.Location || "",
          });
        } catch (err) {
          console.error("Error fetching user data:", err);
          setError("Failed to load user data.");
        } finally {
          setLoading(false);
        }
      } else {
        setError("User ID is missing.");
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Fetch Count Stocks
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('/api/Inventory/FetchData');
        const data = await response.json();

        if (Array.isArray(data)) {
          let totalCount = 0;
          let lowStockCount = 0;
          let outOfStockCount = 0;

          data.forEach((item: any) => {
            const status = item.ProductStatus;
            // Convert ProductQuantity from string to number safely
            const quantity = Number(item.ProductQuantity) || 0;

            if (status === 'Available') totalCount += quantity;
            else if (status === 'Low-Stock') lowStockCount += quantity;
            else if (status === 'No-Stock') outOfStockCount += quantity;
          });

          setTotalItemsCount(totalCount);
          setLowStockCount(lowStockCount);
          setOutOfStockCount(outOfStockCount);
        }
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  // Fetch Reorder Data
  useEffect(() => {
    const fetchReorderData = async () => {
      try {
        const response = await fetch('/api/Reorder/FetchData');
        const data = await response.json();

        if (Array.isArray(data)) {
          let totalReorder = 0;

          data.forEach((item: any) => {
            totalReorder += Number(item.ReorderLevel) || 0;
          });

          setTotalReorderLevel(totalReorder);

          // Sort descending by ReorderLevel and take top 5
          const top5 = data
            .sort((a: any, b: any) => (Number(b.ReorderLevel) || 0) - (Number(a.ReorderLevel) || 0))
            .slice(0, 5)
            .map((item: any) => ({
              ProductSKU: item.ProductSKU,
              ProductName: item.ProductName,
              ReorderLevel: Number(item.ReorderLevel) || 0,
            }));

          setTopReorderItems(top5);
        }
      } catch (error) {
        console.error('Failed to fetch reorder data:', error);
      }
    };

    fetchReorderData();
  }, []);

  // Maximum height of the chart container in pixels (h-48 = 12rem = 192px)
  const maxHeightPx = 192;
  // Get max count to scale bars proportionally
  const maxCount = Math.max(totalItemsCount, lowStockCount, outOfStockCount, 1);
  // Scale factor: pixels per unit count
  const scaleFactor = maxHeightPx / maxCount;

  // Fetch Received Data
  useEffect(() => {
    const fetchReceived = async () => {
      try {
        const res = await fetch('/api/Received/FetchData');
        const data: ReceivedData[] = await res.json();
        // Sort descending by DateReceived
        data.sort((a, b) => new Date(b.DateReceived).getTime() - new Date(a.DateReceived).getTime());
        setReceivedData(data);
      } catch (err) {
        console.error('Failed to fetch Received data:', err);
      }
    };
    fetchReceived();
  }, []);

  // Fetch StockOut Data
  useEffect(() => {
    const fetchStockOut = async () => {
      try {
        const res = await fetch('/api/StockOut/FetchData');
        const data: StockOutData[] = await res.json();
        // Sort descending by DateIssuance
        data.sort((a, b) => new Date(b.DateIssuance).getTime() - new Date(a.DateIssuance).getTime());
        setStockOutData(data);
      } catch (err) {
        console.error('Failed to fetch StockOut data:', err);
      }
    };
    fetchStockOut();
  }, []);

  // Fetch Transfer Data
  useEffect(() => {
    const fetchTransfer = async () => {
      try {
        const res = await fetch('/api/Transfer/FetchData');
        const data: TransferData[] = await res.json();
        // Sort descending by DateTransfer
        data.sort((a, b) => new Date(b.DateTransfer).getTime() - new Date(a.DateTransfer).getTime());
        setTransferData(data);
      } catch (err) {
        console.error('Failed to fetch Transfer data:', err);
      }
    };
    fetchTransfer();
  }, []);

  // Pagination helpers
  const paginate = <T,>(data: T[], page: number): T[] => {
    const start = (page - 1) * ITEMS_PER_PAGE;
    return data.slice(start, start + ITEMS_PER_PAGE);
  };

  // Pagination controls
  const renderPagination = (currentPage: number, totalItems: number, onPageChange: (page: number) => void) => {
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);
    if (totalPages <= 1) return null;

    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          className={`px-2 py-1 rounded border mx-1 text-sm ${i === currentPage ? 'bg-blue-600 text-white' : 'bg-white text-blue-600 hover:bg-blue-100'
            }`}
          onClick={() => onPageChange(i)}
        >
          {i}
        </button>
      );
    }
    return <div className="mt-2 flex justify-center">{pages}</div>;
  };

  const isLoading = false; // Toggle to true while fetching data

  // Fetch Suppliers, PurchaseOrders, Reorders Data
  useEffect(() => {
    // Fetch suppliers
    const fetchSuppliers = async () => {
      try {
        const response = await fetch('/api/Supplier/FetchData');
        const data = await response.json();
        const activeCount = data.filter((item: any) => item.Status === 'Active').length;
        setActiveSuppliers(activeCount);
      } catch (error) {
        console.error('Error fetching suppliers:', error);
      }
    };

    // Fetch purchase orders
    const fetchPurchaseOrders = async () => {
      try {
        const response = await fetch('/api/PurchaseOrder/FetchData');
        const data = await response.json();
        const pendingCount = data.filter((item: any) => item.DeliveryStatus === 'Pending').length;
        setPendingOrders(pendingCount);
      } catch (error) {
        console.error('Error fetching purchase orders:', error);
      }
    };

    // Fetch reorder data
    const fetchReorder = async () => {
      try {
        const response = await fetch('/api/Reorder/FetchData');
        const data: Reorder[] = await response.json();
        setDelayedOrders(data);
      } catch (error) {
        console.error('Error fetching reorder data:', error);
      }
    };

    fetchSuppliers();
    fetchPurchaseOrders();
    fetchReorder();
  }, []);

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4">
              {/* Inventory Summary */}
              {(user && user.Role !== "Purchasing Officer" && user.Role !== "Auditor") && (
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-6 flex gap-1"><FcPackage size={20} /> Inventory Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-green-50 p-6 rounded-lg shadow-md">
                    <h4 className="text-sm font-semibold text-gray-500">Total Items in Stock</h4>
                    <p className="text-3xl font-bold text-green-500">{totalItemsCount}</p>
                  </div>

                  <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                    <h4 className="text-sm font-semibold text-gray-500">Low-Stock Items</h4>
                    <p className="text-3xl font-bold text-yellow-500">{lowStockCount}</p>
                  </div>

                  <div className="bg-red-50 p-6 rounded-lg shadow-md">
                    <h4 className="text-sm font-semibold text-gray-500">Out-of-Stock Items</h4>
                    <p className="text-3xl font-bold text-red-500">{outOfStockCount}</p>
                  </div>
                </div>

                {/* Bar Chart */}
                <div>
                  <h4 className="text-md font-semibold mb-4 flex gap-1"><FcLineChart size={20} /> Stock Overview Chart</h4>
                  <div className="flex items-end justify-center space-x-8 h-auto shadow-md rounded-md p-4">
                    {/* Total */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-green-700 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${totalItemsCount * scaleFactor}px`, minHeight: '10px', maxHeight: '500px' }}
                        title={`Total Items: ${totalItemsCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-green-700">Total</span>
                      <span className="text-sm font-bold text-green-700">{totalItemsCount}</span>
                    </div>

                    {/* Low Stock */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-yellow-400 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${lowStockCount * scaleFactor}px`, minHeight: '30px', maxHeight: '500px' }}
                        title={`Low-Stock Items: ${lowStockCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-yellow-600">Low</span>
                      <span className="text-sm font-bold text-yellow-600">{lowStockCount}</span>
                    </div>

                    {/* Out of Stock */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-red-500 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${outOfStockCount * scaleFactor}px`, minHeight: '2px', maxHeight: '500px' }}
                        title={`Out-of-Stock Items: ${outOfStockCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-red-700">Out</span>
                      <span className="text-sm font-bold text-red-700">{outOfStockCount}</span>
                    </div>
                  </div>
                </div>
              </div>
              )}

              {/* Reorder Alert Summary */}
              {(user && user.Role !== "Sales Staff" && user.Role !== "Warehouse Staff" && user.Role !== "Auditor") && (
                <div className="mb-4">
                  <h3 className="text-md font-semibold mb-6 flex gap-1"><FcAdvertising size={20} /> Reorder Alert Summary</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Left Card: Total Reorder Level */}
                    <div className="bg-white shadow-md rounded-md p-6 flex flex-col justify-center items-center">
                      <h4 className="text-xl font-semibold mb-2">Total Reorder Level</h4>
                      <p className="text-4xl font-bold text-blue-600">{totalReorderLevel}</p>
                    </div>

                    {/* Right Card: Top 5 Reorder Items Table */}
                    <div className="bg-white shadow-md rounded-md p-2 overflow-x-auto">
                      <h4 className="text-md font-semibold mb-4">Top 5 Products by Reorder Level</h4>
                      <table className="w-full bg-white text-xs">
                        <thead className="bg-gray-100 text-gray-700">
                          <tr className="border-b border-gray-300 px-3 py-6 text-left whitespace-nowrap">
                            <th className='px-3 py-6'>SKU</th>
                            <th className='px-3 py-6'>Product Name</th>
                            <th className='px-3 py-6'>Reorder Level</th>
                          </tr>
                        </thead>
                        <tbody>
                          {topReorderItems.length > 0 ? (
                            topReorderItems.map((item, idx) => (
                              <tr key={idx} className="text-left border-b capitalize cursor-pointer hover:bg-gray-50">
                                <td className="px-3 py-6 text-sm text-gray-800 uppercase">{item.ProductSKU}</td>
                                <td className="px-3 py-6 text-sm text-gray-800 capitalize">{item.ProductName}</td>
                                <td className="px-3 py-6 text-sm font-semibold text-blue-600">{item.ReorderLevel}</td>
                              </tr>
                            ))
                          ) : (
                            <tr>
                              <td colSpan={3} className="py-4 text-center text-gray-500">
                                No data available
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* Latest Transactions Summary */}
              {(user && user.Role !== "Purchasing Officer" && user.Role !== "Support Staff" && user.Role !== "Auditor") && (
              <div className="mt-12">
                <h3 className="text-md font-semibold mb-6 flex gap-1"><FcAlarmClock size={20} /> Latest Transactions Summary</h3>
                {/* Responsive Tabs with Icons, Badges & Mobile-Friendly Layout */}
                <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0 mb-4 text-sm">

                  {(user && user.Role !== "Sales Staff" && user.Role !== "Warehouse Staff") && (
                    <button
                      onClick={() => setActiveTab("received")}
                      className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-md transition duration-300 ${activeTab === "received" ? "bg-blue-100 text-blue-700" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      <FcDown size={20} /> <span className="hidden sm:inline">Received</span>
                      <span className="bg-blue-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {receivedData.length}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => setActiveTab("stockout")}
                    className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-md transition duration-300 ${activeTab === "stockout" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-600"
                      }`}
                  >
                    <FcNeutralTrading size={20} /> <span className="hidden sm:inline">Stock-Out</span>
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full">
                      {stockOutData.length}
                    </span>
                  </button>

                  {(user && user.Role !== "Sales Staff" && user.Role !== "Warehouse Staff") && (
                    <button
                      onClick={() => setActiveTab("transfer")}
                      className={`flex items-center justify-between sm:justify-center gap-2 px-4 py-2 rounded-md transition duration-300 ${activeTab === "transfer" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-600"
                        }`}
                    >
                      <FcRefresh size={20} /><span className="hidden sm:inline">Transfer</span>
                      <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {transferData.length}
                      </span>
                    </button>
                  )}
                </div>

                {/* Tab Panels */}
                <div key={activeTab} className="bg-white shadow-md rounded-md p-2 overflow-x-auto animate-fade-in transition-all duration-300 ease-in-out">
                  {isLoading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                  ) : (
                    <>
                      {activeTab === "received" && (
                        <>
                          <table className="w-full bg-white text-xs">
                            <thead className="bg-gray-100 text-gray-700">
                              <tr className="border-b border-gray-300 px-3 py-6 text-left whitespace-nowrap">
                                <th className='px-3 py-6'>PONumber</th>
                                <th className='px-3 py-6'>SKU</th>
                                <th className='px-3 py-6'>ProductName</th>
                                <th className='px-3 py-6'>ProductQuantity</th>
                                <th className='px-3 py-6'>Date Received</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginate(receivedData, receivedPage).map((item, idx) => (
                                <tr key={idx} className="text-left border-b capitalize cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                                  <td className='px-3 py-6 uppercase'>{item.PONumber}</td>
                                  <td className='px-3 py-6 uppercase'>{item.ProductSKU}</td>
                                  <td className='px-3 py-6 capitalize'>{item.ProductName}</td>
                                  <td className='px-3 py-6'>{item.ProductQuantity}</td>
                                  <td className='px-3 py-6'>{item.DateReceived}</td>
                                </tr>
                              ))}
                              {receivedData.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {renderPagination(receivedPage, receivedData.length, setReceivedPage)}
                        </>
                      )}

                      {activeTab === "stockout" && (
                        <>
                          <table className="w-full bg-white text-xs">
                            <thead className="bg-gray-100 text-gray-700">
                              <tr className="border-b border-gray-300 px-3 py-6 text-left whitespace-nowrap">
                                <th className='px-3 py-6'>Stock-Out ID</th>
                                <th className='px-3 py-6'>SKU</th>
                                <th className='px-3 py-6'>ProductName</th>
                                <th className='px-3 py-6'>ProductQuantity</th>
                                <th className='px-3 py-6'>Date Issuance</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginate(stockOutData, stockOutPage).map((item, idx) => (
                                <tr key={idx} className="text-left border-b capitalize cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                                  <td className='px-3 py-6 uppercase'>{item.ReferenceNumber}</td>
                                  <td className='px-3 py-6 uppercase'>{item.ProductSKU}</td>
                                  <td className='px-3 py-6 capitalize'>{item.ProductName}</td>
                                  <td className='px-3 py-6'>{item.ProductQuantity}</td>
                                  <td className='px-3 py-6'>{item.DateIssuance}</td>
                                </tr>
                              ))}
                              {stockOutData.length === 0 && (
                                <tr>
                                  <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {renderPagination(stockOutPage, stockOutData.length, setStockOutPage)}
                        </>
                      )}

                      {activeTab === "transfer" && (
                        <>
                          <table className="w-full bg-white text-xs">
                            <thead className="bg-gray-100 text-gray-700">
                              <tr className="border-b border-gray-300 px-3 py-6 text-left whitespace-nowrap">
                                <th className='px-3 py-6'>SKU</th>
                                <th className='px-3 py-6'>Product Name</th>
                                <th className='px-3 py-6'>Product Quantity</th>
                                <th className='px-3 py-6'>Unit Measure</th>
                                <th className='px-3 py-6'>Date Transfer</th>
                              </tr>
                            </thead>
                            <tbody>
                              {paginate(transferData, transferPage).map((item, idx) => (
                                <tr key={idx} className="text-left border-b capitalize cursor-pointer hover:bg-gray-50 whitespace-nowrap">
                                  <td className='px-3 py-6 uppercase'>{item.ProductSKU}</td>
                                  <td className='px-3 py-6 capitalize'>{item.ProductName}</td>
                                  <td className='px-3 py-6'>{item.ProductQuantity}</td>
                                  <td className='px-3 py-6'>{item.UnitMeasure}</td>
                                  <td className='px-3 py-6'>{item.DateTransfer}</td>
                                </tr>
                              ))}
                              {transferData.length === 0 && (
                                <tr>
                                  <td colSpan={4} className="text-center py-4 text-gray-500">
                                    No data available
                                  </td>
                                </tr>
                              )}
                            </tbody>
                          </table>
                          {renderPagination(transferPage, transferData.length, setTransferPage)}
                        </>
                      )}
                    </>
                  )}
                </div>

              </div>
              )}

              {/* Supplier Overview */}
              {(user && user.Role !== "Inventory Manager" && user.Role !== "Sales Staff" && user.Role !== "Warehouse Staff" && user.Role !== "Support Staff" && user.Role !== "Auditor") && (
                <div className="mt-12">
                  <h3 className="text-md font-semibold mb-6 flex gap-1"><FcInTransit size={20} />Supplier Overview</h3>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-green-700 font-semibold mb-2">🟢 Active Suppliers</h3>
                      <p className="text-3xl font-bold">{activeSuppliers}</p>
                    </div>

                    <div className="bg-yellow-50 p-6 rounded-lg shadow-md">
                      <h3 className="text-yellow-700 font-semibold mb-2">🟡 Pending Purchase Orders</h3>
                      <p className="text-3xl font-bold">{pendingOrders}</p>
                    </div>
                  </div>

                  {/* Custom Progress Tracker */}
                  <div className="bg-white rounded-2xl shadow mt-12 p-6 w-full">
                    <h2 className="text-md font-semibold mb-4 flex gap-1"><FcClock size={20} />Order Lead Time Tracker</h2>
                    <div className="space-y-6">
                      {delayedOrders.length === 0 ? (
                        <p className="text-center text-gray-500">No orders to track.</p>
                      ) : (
                        delayedOrders.map((item, index) => {
                          const now = new Date();
                          const lastOrder = new Date(item.LastOrderDate);
                          const leadTime = new Date(item.LeadTime);

                          const totalHours = (leadTime.getTime() - lastOrder.getTime()) / (1000 * 60 * 60);
                          const elapsedHours = (now.getTime() - lastOrder.getTime()) / (1000 * 60 * 60);

                          // If totalHours <= 0 (invalid), set progress to 100 to avoid NaN
                          const progress = totalHours > 0 ? Math.min((elapsedHours / totalHours) * 100, 100) : 100;
                          const isDelayed = now > leadTime;

                          const hoursDiff = (leadTime.getTime() - now.getTime()) / (1000 * 60 * 60);
                          const timeStatus = isDelayed
                            ? `${Math.abs(Math.round(hoursDiff))} hours overdue`
                            : `${Math.round(hoursDiff)} hours left`;

                          return (
                            <div key={index} className="border border-gray-200 rounded-lg p-4">
                              <div className="flex justify-between items-center mb-2">
                                <div>
                                  <p className="font-semibold text-xs text-gray-70 capitalize">
                                    {item.ProductName} <span className="uppercase">({item.ProductSKU})</span>
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Ref: {item.ReferenceNumber} • Supplier: {item.SupplierName}
                                  </p>
                                </div>
                                <div>
                                  <span
                                    className={`px-3 py-1 rounded-full text-xs font-medium ${isDelayed ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-600'
                                      }`}
                                  >
                                    {isDelayed ? 'Delayed' : 'On Track'}
                                  </span>
                                </div>
                              </div>

                              <div className="w-full bg-gray-200 rounded-full h-4">
                                <div
                                  className={`h-4 rounded-full ${isDelayed ? 'bg-red-500' : 'bg-blue-500'}`}
                                  style={{ width: `${progress}%` }}
                                ></div>
                              </div>

                              <div className="flex justify-between text-xs text-gray-500 mt-1">
                                <span>Last Order: {new Date(item.LastOrderDate).toLocaleString()}</span>
                                <span>Lead Time: {new Date(item.LeadTime).toLocaleString()}</span>
                                <span>Now: {now.toLocaleString()}</span>
                              </div>

                              <div className={`mt-2 text-xs font-semibold ${isDelayed ? 'text-red-600' : 'text-blue-600'}`}>
                                {timeStatus}
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;
