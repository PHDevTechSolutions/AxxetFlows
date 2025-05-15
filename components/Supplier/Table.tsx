import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
  _id: string;
  ReferenceNumber: string;
  SupplierName: string;
  ContactPerson: string;
  EmailAddress: string;
  PhoneNumber: string;
  Address: string;
  Categories: string;
  ProductOffered: string;
  BusinessNumber: string;
  PaymentTerms: string;
  BankDetails: string;
  Remarks: string;
  createdAt: string;
  Status: string;
}

interface TableProps {
  posts: Post[];
  handleEdit: (post: Post) => void;
  handleDelete: (postId: string) => void;
}

const getStatusBadgeColor = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized === "active") return "bg-emerald-500 text-white";
  if (normalized === "inactive") return "bg-red-600 text-white";
  if (normalized === "blacklisted") return "bg-yellow-500 text-white";
  return "bg-gray-100 text-gray-800";
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete }) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Filter states
  const [filterStatus, setFilterStatus] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterPaymentTerms, setFilterPaymentTerms] = useState("");
  const [filterBankDetails, setFilterBankDetails] = useState("");

  const resetFilters = () => {
    setFilterStatus("");
    setFilterCategory("");
    setFilterPaymentTerms("");
    setFilterBankDetails("");
  };

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      return (
        (filterStatus ? post.Status === filterStatus : true) &&
        (filterCategory ? post.Categories === filterCategory : true) &&
        (filterPaymentTerms ? post.PaymentTerms === filterPaymentTerms : true) &&
        (filterBankDetails ? post.BankDetails === filterBankDetails : true)
      );
    });
  }, [posts, filterStatus, filterCategory, filterPaymentTerms, filterBankDetails]);

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

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Filtered Data");

    worksheet.columns = [
      { header: "#", key: "ReferenceNumber", width: 15 },
      { header: "Supplier Name", key: "SupplierName", width: 20 },
      { header: "Contact Person", key: "ContactPerson", width: 20 },
      { header: "Phone Number", key: "PhoneNumber", width: 15 },
      { header: "Email Address", key: "EmailAddress", width: 25 },
      { header: "Address", key: "Address", width: 30 },
      { header: "Categories", key: "Categories", width: 15 },
      { header: "Product Offered", key: "ProductOffered", width: 20 },
      { header: "Business Number", key: "BusinessNumber", width: 15 },
      { header: "Payment Terms", key: "PaymentTerms", width: 15 },
      { header: "Bank Details", key: "BankDetails", width: 20 },
      { header: "Remarks", key: "Remarks", width: 20 },
      { header: "Status", key: "Status", width: 10 },
    ];

    filteredPosts.forEach((post) => {
      worksheet.addRow(post);
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), "Filtered_Suppliers.xlsx");
  };

  return (
    <>
      {/* Filter Section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-2 mb-4 text-xs">
        <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Status</option>
          {uniqueOptions("Status").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Category</option>
          {uniqueOptions("Categories").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select value={filterPaymentTerms} onChange={(e) => setFilterPaymentTerms(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Payment Terms</option>
          {uniqueOptions("PaymentTerms").map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        <select value={filterBankDetails} onChange={(e) => setFilterBankDetails(e.target.value)} className="border rounded p-2">
          <option value="">Filter by Bank Details</option>
          {uniqueOptions("BankDetails").map((opt) => (
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
                "#", "Supplier Name / Company Name", "Contact Person", "Contact / Phone Number", "Email Address", "Address",
                "Categories", "Product Offered", "Business Number", "Payment terms", "Bank Details", "Remarks", "Status", "Actions"
              ].map((header) => (
                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
              ))}
            </tr>
          </thead>
          <tbody className="whitespace-nowrap">
            {paginatedPosts.map((post) => (
              <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                <td className="px-3 py-6 capitalize">{post.SupplierName}</td>
                <td className="px-3 py-6 capitalize">{post.ContactPerson}</td>
                <td className="px-3 py-6">{post.PhoneNumber}</td>
                <td className="px-3 py-6">{post.EmailAddress}</td>
                <td className="px-3 py-6 capitalize">{post.Address}</td>
                <td className="px-3 py-6 uppercase">{post.Categories}</td>
                <td className="px-3 py-6 capitalize">{post.ProductOffered}</td>
                <td className="px-3 py-6 uppercase">{post.BusinessNumber}</td>
                <td className="px-3 py-6">{post.PaymentTerms}</td>
                <td className="px-3 py-6">{post.BankDetails}</td>
                <td className="px-3 py-6 capitalize">{post.Remarks}</td>
                <td className="px-3 py-6">
                  <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.Status)}`}>
                    {post.Status}
                  </span>
                </td>
                <td className="px-3 py-6" onClick={(e) => e.stopPropagation()}>
                  <div className="flex space-x-2">
                    <button onClick={() => handleEdit(post)} className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center">
                      <FaEdit size={15} className="mr-1" /> Edit
                    </button>
                    <button onClick={() => handleDelete(post._id)} className="text-xs py-2 px-4 rounded bg-red-600 hover:bg-red-800 text-white flex items-center">
                      <FaTrash size={15} className="mr-1" /> Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
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
