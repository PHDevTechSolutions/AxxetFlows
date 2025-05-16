import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ProductSKU: string;
    ProductName: string;
    ProductQuantity: string;
    ReorderLevel: string;
    SupplierName: string;
    LastOrderDate: string;
    LeadTime: string;
    ReorderQTY: string;
    Status: string;
}

interface TableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
}

const getStatusBadgeColor = (Status: string) => {
    const normalized = Status.toLowerCase();
    if (normalized === "active") return "bg-green-500 text-white";
    if (normalized === "acknowledged") return "bg-yellow-600 text-black";
    if (normalized === "ordered") return "bg-blue-500 text-white";
    return "bg-gray-100 text-gray-800";
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
    const [currentPage, setCurrentPage] = useState(1);

    // Filter states
    const [filterStatus, setFilterStatus] = useState("");

    const resetFilters = () => {
        setFilterStatus("");
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            return (
                (filterStatus ? post.Status === filterStatus : true)
            );
        });
    }, [posts, filterStatus]);

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
        const worksheet = workbook.addWorksheet("Reorder Report");

        // ✅ Columns to be exported based on your specified fields
        worksheet.columns = [
            { header: "#", key: "index", width: 5 },
            { header: "Reference Number", key: "ReferenceNumber", width: 20 },
            { header: "Product SKU", key: "ProductSKU", width: 20 },
            { header: "Product Name", key: "ProductName", width: 25 },
            { header: "Current Stock", key: "ProductQuantity", width: 15 },
            { header: "Reorder Level", key: "ReorderLevel", width: 15 },
            { header: "Supplier Name", key: "SupplierName", width: 25 },
            { header: "Last Order Date", key: "LastOrderDate", width: 20 },
            { header: "Lead Time", key: "LeadTime", width: 15 },
            { header: "Reorder QTY", key: "ReorderQTY", width: 15 },
            { header: "Status", key: "Status", width: 15 },
        ];

        // ✅ Add only the relevant data from filteredPosts
        filteredPosts.forEach((post, index) => {
            worksheet.addRow({
                index: index + 1,
                ReferenceNumber: post.ReferenceNumber,
                ProductSKU: post.ProductSKU,
                ProductName: post.ProductName,
                ProductQuantity: post.ProductQuantity,
                ReorderLevel: post.ReorderLevel,
                SupplierName: post.SupplierName,
                LastOrderDate: post.LastOrderDate,
                LeadTime: post.LeadTime,
                ReorderQTY: post.ReorderQTY,
                Status: post.Status,
            });
        });

        // ✅ Download as Excel
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "Reorder_Report.xlsx");
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
                                "Reorder ID", "SKU", "Product Name", "Current Stock", "Reorder Level", "Supplier Name", "Last Order Date",
                                "Lead Time", "Reorder QTY", "Status", "Actions"
                            ].map((header) => (
                                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="whitespace-nowrap">
                        {paginatedPosts.map((post) => (
                            <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                                <td className="px-3 py-6 uppercase">{post.ProductSKU}</td>
                                <td className="px-3 py-6 capitalize">{post.ProductName}</td>
                                <td className="px-3 py-6 capitalize">{post.ProductQuantity}</td>
                                <td className="px-3 py-6 capitalize">{post.ReorderLevel}</td>
                                <td className="px-3 py-6 uppercase">{post.SupplierName}</td>
                                <td className="px-3 py-6 capitalize">{post.LastOrderDate}</td>
                                <td className="px-3 py-6">{post.LeadTime}</td>
                                <td className="px-3 py-6">{post.ReorderQTY}</td>
                                <td className="px-3 py-6">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.Status)}`}>
                                        {post.Status}
                                    </span>
                                </td>
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
