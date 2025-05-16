import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
  _id: string;
  ReferenceNumber: string;
  PONumber: string;
  PODate: string;
  BuyerName: string;
  SupplierName: string;
  ProductName: string;
  Quantity: string;
  ProductCostPrice: string;
  TotalAmount: string;
  PaymentTerms: string;
  DeliveryAddress: string;
  DeliveryDate: string;
  DeliveryStatus: string;
  DeliveryRemarks: string;
  createdAt: string;
}

interface TableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
  Role: string;
}

const getStatusBadgeColor = (status: string) => {
  const normalized = status.toLowerCase();

  switch (normalized) {
    case "pending":
      return "bg-yellow-400 text-black";            // Pending 
    case "processing":
      return "bg-blue-400 text-white";              // Processing 
    case "shipped":
      return "bg-indigo-500 text-white";            // Shipped
    case "in transit":
      return "bg-purple-500 text-white";            // In Transit
    case "out for delivery":
      return "bg-orange-400 text-white";            // Out for Delivery
    case "delivered":
      return "bg-green-600 text-white";             // Delivered
    case "partially delivered":
      return "bg-green-300 text-black";             // Partially Delivered
    case "failed delivery":
      return "bg-red-600 text-white";               // Failed Delivery
    case "returned":
      return "bg-gray-600 text-white";              // Returned
    default:
      return "bg-gray-200 text-gray-800";           // Default / unknown
  }
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterPaymentTerms, setFilterPaymentTerms] = useState("");

  const resetFilters = () => {
    setFilterStatus("");
    setFilterPaymentTerms("");
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        (filterStatus ? post.DeliveryStatus === filterStatus : true) &&
        (filterPaymentTerms ? post.PaymentTerms === filterPaymentTerms : true)
      );
    });
  }, [posts, filterStatus, filterPaymentTerms]);

  const paginatedPosts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredPosts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredPosts, currentPage]);

  const totalPages = Math.ceil(filteredPosts.length / ITEMS_PER_PAGE);

  const changePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setCurrentPage(page);
  };

  const uniqueOptions = (field: keyof Post) => {
    return Array.from(new Set(posts.map((post) => post[field]))).filter(Boolean);
  };

  // Export filteredPosts to Excel with correct columns and computed TotalAmount
  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    worksheet.columns = [
      { header: "Reference Number", key: "ReferenceNumber", width: 20 },
      { header: "PO Number", key: "PONumber", width: 15 },
      { header: "PO Date", key: "PODate", width: 15 },
      { header: "Buyer Name", key: "BuyerName", width: 20 },
      { header: "Supplier Name", key: "SupplierName", width: 20 },
      { header: "Product Name", key: "ProductName", width: 20 },
      { header: "Quantity", key: "Quantity", width: 10 },
      { header: "Unit Price", key: "ProductCostPrice", width: 15 },
      { header: "Total Amount", key: "TotalAmount", width: 15 },
      { header: "Payment Terms", key: "PaymentTerms", width: 20 },
      { header: "Delivery Address", key: "DeliveryAddress", width: 25 },
      { header: "Delivery Date", key: "DeliveryDate", width: 15 },
      { header: "Delivery Status", key: "DeliveryStatus", width: 15 },
    ];

    filteredPosts.forEach((post) => {
      worksheet.addRow({
        ReferenceNumber: post.ReferenceNumber,
        PONumber: post.PONumber,
        PODate: post.PODate,
        BuyerName: post.BuyerName,
        SupplierName: post.SupplierName,
        ProductName: post.ProductName,
        Quantity: post.Quantity,
        ProductCostPrice: parseFloat(post.ProductCostPrice).toFixed(2),
        TotalAmount: computeTotalAmount(post.Quantity, post.ProductCostPrice),
        PaymentTerms: post.PaymentTerms,
        DeliveryAddress: post.DeliveryAddress,
        DeliveryDate: post.DeliveryDate,
        DeliveryStatus: post.DeliveryStatus,
      });
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Purchase_Order_Report.xlsx");
  };

  // Compute TotalAmount from Quantity and UnitPrice (parse as float)
  const computeTotalAmount = (quantityStr: string, unitPriceStr: string) => {
    const quantity = parseFloat(quantityStr);
    const unitPrice = parseFloat(unitPriceStr);
    if (isNaN(quantity) || isNaN(unitPrice)) return "-";
    return (quantity * unitPrice).toFixed(2);
  };

  return (
    <>
      {/* Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4 text-xs">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Status</option>
          {uniqueOptions("DeliveryStatus").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select value={filterPaymentTerms} onChange={(e) => setFilterPaymentTerms(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Payment Terms</option>
          {uniqueOptions("PaymentTerms").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <div className="flex gap-2">
          <button onClick={resetFilters} className="bg-gray-200 hover:bg-gray-300 text-xs px-3 py-2 rounded">Reset</button>
          <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white text-xs px-3 py-2 rounded">Export Excel</button>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto w-full">
        <table className="w-full bg-white text-xs">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              {[
                "#", "PO Number", "PO Date", "Buyer Name", "Supplier Name", "Name of Item",
                "Quantity", "Unit Price", "Total Amount", "Payment terms", "Delivery Address", "Delivery Date", "Status"
              ].map((header) => (
                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
              ))}
              {/* Conditional header for Delivery Remarks */}
              {(paginatedPosts.some(post => post.DeliveryStatus === "Failed Delivery" || post.DeliveryStatus === "Returned")) && (
                <th className="px-3 py-6 text-left whitespace-nowrap">Delivery Remarks</th>
              )}
              <th className="px-3 py-6 text-left whitespace-nowrap">Actions</th>
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {paginatedPosts.map((post) => {
              const showRemarks = post.DeliveryStatus === "Failed Delivery" || post.DeliveryStatus === "Returned";
              return (
                <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                  <td className="px-3 py-6">{post.ReferenceNumber}</td>
                  <td className="px-3 py-6 uppercase">{post.PONumber}</td>
                  <td className="px-3 py-6">{post.PODate}</td>
                  <td className="px-3 py-6 capitalize">{post.BuyerName}</td>
                  <td className="px-3 py-6 capitalize">{post.SupplierName}</td>
                  <td className="px-3 py-6 capitalize">{post.ProductName}</td>
                  <td className="px-3 py-6">{post.Quantity}</td>
                  <td className="px-3 py-6">{parseFloat(post.ProductCostPrice).toFixed(2)}</td>
                  <td className="px-3 py-6">{computeTotalAmount(post.Quantity, post.ProductCostPrice)}</td>
                  <td className="px-3 py-6">{post.PaymentTerms}</td>
                  <td className="px-3 py-6 capitalize">{post.DeliveryAddress}</td>
                  <td className="px-3 py-6">{post.DeliveryDate}</td>
                  <td className="px-3 py-6">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.DeliveryStatus)}`}>
                      {post.DeliveryStatus}
                    </span>
                  </td>

                  {/* Conditional Delivery Remarks cell */}
                  {showRemarks && (
                    <td className="px-3 py-6 capitalize">{post.DeliveryRemarks || '-'}</td>
                  )}

                  <td className="px-3 py-6" onClick={(e) => e.stopPropagation()}>
                    <div className="flex space-x-2">
                      {(Role !== "Auditor" && Role !== "Support Staff") && (
                      <button onClick={() => handleEdit(post)} className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center">
                        <FaEdit size={15} className="mr-1" /> Edit
                      </button>
                      )}
                      {(Role !== "Auditor" && Role !== "Purchasing Officer" && Role !== "Support Staff") && (
                      <button onClick={() => handleDelete(post._id)} className="text-xs py-2 px-4 rounded bg-red-600 hover:bg-red-800 text-white flex items-center">
                        <FaTrash size={15} className="mr-1" /> Delete
                      </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

      </div>

      {/* Pagination */}
      <div className="flex justify-between items-center mt-4 text-xs">
        <span>Page {currentPage} of {totalPages}</span>
        <div className="space-x-2">
          <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Prev</button>
          <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50">Next</button>
        </div>
      </div>
    </>
  );
};

export default Table;
