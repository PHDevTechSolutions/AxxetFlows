import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";

interface Post {
    _id: string;
    ReferenceNumber: string;
    DateIssuance: string;
    IssuedBy: string;
    Recipient: string;
    Purpose: string;
    ProductSKU: string;
    ProductName: string;
    ProductQuantity: string;
    UnitMeasure: string;
    ReferenceDocumentNumber: string;
    Remarks: string;
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
    if (normalized === "pending") return "bg-red-500 text-white";
    if (normalized === "approval") return "bg-green-600 text-white";
    if (normalized === "completed") return "bg-blue-500 text-white";
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
        const worksheet = workbook.addWorksheet("Issued Items");

        // Set the column headers and keys
        worksheet.columns = [
            { header: "#", key: "index", width: 5 },
            { header: "Reference Number", key: "ReferenceNumber", width: 20 },
            { header: "Date Issuance", key: "DateIssuance", width: 20 },
            { header: "Issued By", key: "IssuedBy", width: 20 },
            { header: "Recipient", key: "Recipient", width: 20 },
            { header: "Purpose", key: "Purpose", width: 20 },
            { header: "Product SKU", key: "ProductSKU", width: 20 },
            { header: "Product Name", key: "ProductName", width: 25 },
            { header: "Product Quantity", key: "ProductQuantity", width: 20 },
            { header: "Unit Measure", key: "UnitMeasure", width: 20 },
            { header: "Reference Doc No.", key: "ReferenceDocumentNumber", width: 25 },
            { header: "Remarks", key: "Remarks", width: 25 },
            { header: "Status", key: "Status", width: 15 },
        ];

        // Add rows from filteredPosts
        filteredPosts.forEach((post, index) => {
            worksheet.addRow({
                index: index + 1,
                ReferenceNumber: post.ReferenceNumber,
                DateIssuance: post.DateIssuance,
                IssuedBy: post.IssuedBy,
                Recipient: post.Recipient,
                Purpose: post.Purpose,
                ProductSKU: post.ProductSKU,
                ProductName: post.ProductName,
                ProductQuantity: post.ProductQuantity,
                UnitMeasure: post.UnitMeasure,
                ReferenceDocumentNumber: post.ReferenceDocumentNumber,
                Remarks: post.Remarks,
                Status: post.Status,
            });
        });

        // Generate Excel file and trigger download
        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "Issued_Items.xlsx");
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
                                "Stock Out ID", "Date Issuance", "Issued By", "Recipient / Department", "Purpose / Reason for Issuance", "SKU", "Product Name",
                                "Quantity", "Unit of Measure", "Reference Document Number", "Remarks", "Status", "Actions"
                            ].map((header) => (
                                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="whitespace-nowrap">
                        {paginatedPosts.map((post) => (
                            <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                                <td className="px-3 py-6">{post.DateIssuance}</td>
                                <td className="px-3 py-6 capitalize">{post.IssuedBy}</td>
                                <td className="px-3 py-6 capitalize">{post.Recipient}</td>
                                <td className="px-3 py-6 capitalize">{post.Purpose}</td>
                                <td className="px-3 py-6 uppercase">{post.ProductSKU}</td>
                                <td className="px-3 py-6 capitalize">{post.ProductName}</td>
                                <td className="px-3 py-6">{post.ProductQuantity}</td>
                                <td className="px-3 py-6">{post.UnitMeasure}</td>
                                <td className="px-3 py-6 uppercase">{post.ReferenceDocumentNumber}</td>
                                <td className="px-3 py-6 capitalize">{post.Remarks}</td>
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
                                        {(Role !== "Sales Staff" && Role !== "Warehouse Staff" && Role !== "Auditor" && Role !== "Support Staff") && (
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
