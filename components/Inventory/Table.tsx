import React, { useMemo, useState } from "react";
import { FaTrash, FaEdit, } from "react-icons/fa";

interface Post {
    _id: string;
    ReferenceNumber: string;
    ProductName: string;
    ProductSKU: string;
    ProductDescription: string;
    ProductCategories: string;
    ProductQuantity: string;
    ProductCostPrice: string;
    ProductSellingPrice: string;
    ProductStatus: string;
    ProductImage: string;
}

interface TableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const getStatusBadgeColor = (status: string) => {
    const normalized = status.toLowerCase();
    if (normalized === "available") return "bg-emerald-500 text-white";
    if (normalized === "no-stock") return "bg-red-600 text-white";
    if (normalized === "draft") return "bg-yellow-500 text-white";
    return "bg-gray-100 text-gray-800";
};

const ITEMS_PER_PAGE = 10;

const Table: React.FC<TableProps> = ({ posts, handleEdit, handleDelete }) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) setCurrentPage(page);
    };

    return (
        <>
            <div className="overflow-x-auto w-full">
                <table className="w-full bg-white text-xs">
                    <thead className="bg-gray-100 text-gray-700">
                        <tr>
                            {[
                                "#", "SKU", "Image", "Product Name", "Description", "Categories",
                                "QTY", "Cost Price", "Selling Price", "Status", "Actions"
                            ].map(header => (
                                <th key={header} className="px-3 py-6 text-left whitespace-nowrap">
                                    {header}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedPosts.map((post) => (
                            <tr key={post._id} className="text-left border-b capitalize">
                                <td className="px-3 py-6">{post.ReferenceNumber}</td>
                                <td className="px-3 py-6">{post.ProductSKU}</td>
                                <td className="px-3 py-6"><img src={post.ProductImage} alt={post.ProductName} className="w-12 h-12 object-cover rounded" /></td>
                                <td className="px-3 py-6">{post.ProductName}</td>
                                <td className="px-3 py-6">{post.ProductDescription}</td>
                                <td className="px-3 py-6">{post.ProductCategories}</td>
                                <td className="px-3 py-6">{post.ProductQuantity}</td>
                                <td className="px-3 py-6">{post.ProductCostPrice}</td>
                                <td className="px-3 py-6">{post.ProductSellingPrice}</td>
                                <td className="px-3 py-6">
                                    <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor(post.ProductStatus)}`}>
                                        {post.ProductStatus}
                                    </span>
                                </td>
                                <td className="px-3 py-6">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleEdit(post)}
                                            className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center"
                                        >
                                            <FaEdit size={15} className="mr-1" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(post._id)}
                                            className="text-xs py-2 px-4 rounded bg-red-600 hover:bg-red-800 text-white flex items-center"
                                        >
                                            <FaTrash size={15} className="mr-1" />
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Pagination Controls */}
            <div className="flex justify-between items-center mt-4 text-xs">
                <span>
                    Page {currentPage} of {totalPages}
                </span>
                <div className="space-x-2">
                    <button
                        onClick={() => changePage(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Prev
                    </button>
                    <button
                        onClick={() => changePage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                        className="px-3 py-2 border rounded bg-gray-200 hover:bg-gray-300 disabled:opacity-50"
                    >
                        Next
                    </button>
                </div>
            </div>
        </>
    );
};

export default Table;
