import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit, FaPlusCircle } from "react-icons/fa";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";

interface Post {
    _id: string;
    ReferenceNumber: string;
    DateReceived: string;
    PONumber: string;
    ReceivedBy: string;
    SupplierName: string;
    WarehouseLocation: string;
    ProductSKU: string;
    ProductName: string;
    ProductDescription: string;
    ProductQuantity: string;
    ProductBoxes: string;
    ProductMeasure: string;
    BatchNumber: string;
    ExpirationDate: string;
    Remarks: string;
    ReceivedStatus: string;
}

interface TableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
}

const getStatusBadgeColor = (ReceivedStatus: string) => {
    const normalized = ReceivedStatus.toLowerCase();
    switch (normalized) {
        case "pending inspection":
            return "bg-yellow-500 text-white";
        case "approved":
            return "bg-green-600 text-white";
        case "rejected":
            return "bg-red-600 text-white";
        case "posted":
            return "bg-gray-600 text-white";    
        default:
            return "bg-gray-200 text-gray-800";
    }
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete, Role }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [filterStatus, setFilterStatus] = useState("");
    const [filterLocation, setFilterLocation] = useState("");

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetFilters = () => {
        setFilterStatus("");
        setFilterLocation("");
        setStartDate("");
        setEndDate("");
    };

    const filteredPosts = useMemo(() => {
        return posts.filter((post) => {
            const postDate = new Date(post.DateReceived);
            const start = startDate ? new Date(startDate) : null;
            const end = endDate ? new Date(endDate) : null;

            const isInRange =
                (!start || postDate >= start) &&
                (!end || postDate <= end);

            return (
                (filterStatus ? post.ReceivedStatus === filterStatus : true) &&
                (filterLocation ? post.WarehouseLocation === filterLocation : true) &&
                isInRange
            );
        });
    }, [posts, filterStatus, filterLocation, startDate, endDate]);

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
        const worksheet = workbook.addWorksheet("Received Products");

        worksheet.columns = [
            { header: "Reference Number", key: "ReferenceNumber", width: 20 },
            { header: "Date Received", key: "DateReceived", width: 20 },
            { header: "PO Number", key: "PONumber", width: 20 },
            { header: "Received By", key: "ReceivedBy", width: 20 },
            { header: "Supplier Name", key: "SupplierName", width: 20 },
            { header: "Warehouse Location", key: "WarehouseLocation", width: 20 },
            { header: "Product SKU", key: "ProductSKU", width: 20 },
            { header: "Product Name", key: "ProductName", width: 25 },
            { header: "Product Description", key: "ProductDescription", width: 30 },
            { header: "Product Quantity", key: "ProductQuantity", width: 15 },
            { header: "Product Boxes", key: "ProductBoxes", width: 15 },
            { header: "Product Measure", key: "ProductMeasure", width: 15 },
            { header: "Batch Number", key: "BatchNumber", width: 20 },
            { header: "Expiration Date", key: "ExpirationDate", width: 20 },
            { header: "Remarks", key: "Remarks", width: 25 },
            { header: "Received Status", key: "ReceivedStatus", width: 20 },
        ];

        filteredPosts.forEach((post) => {
            worksheet.addRow(post);
        });

        const buffer = await workbook.xlsx.writeBuffer();
        saveAs(new Blob([buffer]), "Received_Report.xlsx");
    };

    const handleAddToInventory = async (post: Post) => {
        if (isSubmitting) return;

        setIsSubmitting(true);
        try {
            // 1. Post inventory data
            const response = await fetch("/api/Received/PostInventoryData", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    ReferenceNumber: post.ReferenceNumber,
                    ProductName: post.ProductName,
                    ProductSKU: post.ProductSKU,
                    ProductDescription: post.ProductDescription,
                    ProductQuantity: post.ProductQuantity,
                    ProductCostPrice: 0,
                    ProductSellingPrice: 0,
                    ProductStatus: "Available",
                }),
            });

            if (!response.ok) throw new Error("Failed to post inventory data.");

            // 2. Update status
            const updateResponse = await fetch("/api/Received/UpdateStatus", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    id: post._id, // _id is from MongoDB
                    ReceivedStatus: "Posted",
                }),
            });

            if (!updateResponse.ok) throw new Error("Failed to update status.");

            toast.success("Successfully posted and status updated.");
        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong.");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            {/* Filters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 mb-4 text-xs">
                <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="border rounded p-2">
                    <option value="">Filter by Status</option>
                    {uniqueOptions("ReceivedStatus").map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>
                
                <select value={filterLocation} onChange={(e) => setFilterLocation(e.target.value)} className="border rounded p-2">
                    <option value="">Filter by Warehouse</option>
                    {uniqueOptions("WarehouseLocation").map((opt) => (
                        <option key={opt} value={opt}>{opt}</option>
                    ))}
                </select>

                <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="border rounded p-2"
                    placeholder="Start Date"
                />

                <input
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="border rounded p-2"
                    placeholder="End Date"
                />
                
                <div className="flex gap-2">
                    <button onClick={resetFilters} className="bg-gray-200 hover:bg-gray-300 px-3 py-2 rounded">Reset</button>
                    <button onClick={exportToExcel} className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded">Export Excel</button>
                </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto w-full">
                <table className="w-full bg-white text-xs">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            {[
                                "Reference #", "Date Received", "PO #", "Received By", "Supplier",
                                "Warehouse", "SKU", "Product Name", "Qty", "Boxes", "Measure",
                                "Batch #", "Expiry", "Remarks", "Status", "Actions"
                            ].map((header) => (
                                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="whitespace-nowrap">
                        {paginatedPosts.map((post) => (
                            <tr key={post._id} className="border-b hover:bg-gray-50">
                                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                                <td className="px-3 py-6">{post.DateReceived}</td>
                                <td className="px-3 py-6 uppercase">{post.PONumber}</td>
                                <td className="px-3 py-6 capitalize">{post.ReceivedBy}</td>
                                <td className="px-3 py-6 capitalize">{post.SupplierName}</td>
                                <td className="px-3 py-6">{post.WarehouseLocation}</td>
                                <td className="px-3 py-6 uppercase">{post.ProductSKU}</td>
                                <td className="px-3 py-6 capitalize">{post.ProductName}</td>
                                <td className="px-3 py-6">{post.ProductQuantity}</td>
                                <td className="px-3 py-6">{post.ProductBoxes}</td>
                                <td className="px-3 py-6">{post.ProductMeasure}</td>
                                <td className="px-3 py-6 uppercase">{post.BatchNumber}</td>
                                <td className="px-3 py-6">{post.ExpirationDate}</td>
                                <td className="px-3 py-6 capitalize">{post.Remarks}</td>
                                <td className="px-3 py-6">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.ReceivedStatus)}`}>
                                        {post.ReceivedStatus}
                                    </span>
                                </td>
                                <td className="px-3 py-6">
                                    <div className="flex space-x-2">
                                        {(post.ReceivedStatus.toLowerCase() !== "approved" && Role !== "Auditor" && Role !== "Support Staff") && (
                                            <button onClick={() => handleEdit(post)} className="text-xs py-1 px-3 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center">
                                                <FaEdit size={12} className="mr-1" /> Edit
                                            </button>
                                        )}
                                        {(post.ReceivedStatus.toLowerCase() === "approved" && Role !== "Auditor" && Role !== "Support Staff") && (
                                            <button
                                                onClick={() => handleAddToInventory(post)} disabled={isSubmitting}
                                                className="text-xs py-1 px-3 rounded bg-blue-600 hover:bg-green-800 text-white flex items-center"
                                            >
                                                <FaPlusCircle size={12} className="mr-1" /> {isSubmitting ? 'Submitting...' : 'Add'}
                                            </button>
                                        )}
                                        {(Role !== "Warehouse Staff" && Role !== "Auditor" && Role !== "Support Staff") && (
                                        <button onClick={() => handleDelete(post._id)} className="text-xs py-1 px-3 rounded bg-red-600 hover:bg-red-800 text-white flex items-center">
                                            <FaTrash size={12} className="mr-1" /> Delete
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
                <div className="flex space-x-2">
                    <button onClick={() => changePage(currentPage - 1)} disabled={currentPage === 1} className="px-3 py-1 border rounded">Prev</button>
                    <button onClick={() => changePage(currentPage + 1)} disabled={currentPage === totalPages} className="px-3 py-1 border rounded">Next</button>
                </div>
            </div>
        </>
    );
};

export default Table;
