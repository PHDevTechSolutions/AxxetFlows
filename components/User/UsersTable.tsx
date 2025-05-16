import React, { useMemo, useState } from "react";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

interface Post {
    _id: string;
    Firstname: string;
    Lastname: string;
    Email: string;
    Role: string;
}

interface ContainerTableProps {
    posts: Post[];
    handleEdit: (post: Post) => void;
    handleDelete: (postId: string) => void;
    Role: string;
    Location: string;
}

const getStatusBadgeColor = (Role: string) => {
    switch (Role.toLowerCase()) {
        case "inventory manager":
            return "bg-blue-600 text-white"; // Blue
        case "sales staff":
            return "bg-green-600 text-white"; // Green
        case "warehouse staff":
            return "bg-yellow-500 text-white"; // Yellow
        case "auditor":
            return "bg-purple-600 text-white"; // Purple
        case "purchasing officer":
            return "bg-pink-600 text-white"; // Pink
        case "support staff":
            return "bg-indigo-600 text-white"; // Indigo
        default:
            return "bg-gray-200 text-gray-800"; // Default
    }
};

const ITEMS_PER_PAGE = 10;

const ReportItemTable: React.FC<ContainerTableProps> = ({
    posts,
    handleEdit,
    handleDelete,
    Role,
    Location,
}) => {
    const [currentPage, setCurrentPage] = useState(1);

    const paginatedPosts = useMemo(() => {
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        return posts.slice(startIndex, startIndex + ITEMS_PER_PAGE);
    }, [posts, currentPage]);

    const totalPages = Math.ceil(posts.length / ITEMS_PER_PAGE);

    const changePage = (page: number) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
        }
    };

    return (
        <div className="overflow-x-auto w-full">
            <table className="w-full bg-white text-xs">
                <thead className="bg-gray-100 text-gray-700">
                    <tr>
                        {[  
                            "Fullname",
                            "Email",
                            "Role",
                            "Actions",
                        ].map((header) => (
                            <th key={header} className="px-3 py-6 text-left whitespace-nowrap">
                                {header}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody className="whitespace-nowrap">
                    {paginatedPosts.map((post) => (
                        <tr key={post._id} className="text-left border-b cursor-pointer hover:bg-gray-50">
                            <td className="px-3 py-6 capitalize">{post.Lastname}, {post.Firstname}</td>
                            <td className="px-3 py-6">{post.Email}</td>
                            <td className="px-3 py-6">
                                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${getStatusBadgeColor( post.Role )}`}>{post.Role}</span>
                            </td>
                            <td className="px-3 py-6">
                                <div className="flex space-x-2">
                                    {(Role !== "Auditor") && (
                                    <button
                                        onClick={() => handleEdit(post)}
                                        className="text-xs py-2 px-4 rounded bg-blue-600 hover:bg-blue-800 text-white flex items-center"
                                    >
                                        <HiOutlinePencil size={15} className="mr-1" /> Edit
                                    </button>
                                    )}
                                    {(Role !== "Auditor") && (
                                    <button
                                        onClick={() => handleDelete(post._id)}
                                        className="text-xs py-2 px-4 rounded bg-red-600 hover:bg-red-800 text-white flex items-center"
                                    >
                                        <HiOutlineTrash size={15} className="mr-1" /> Delete
                                    </button>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

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
        </div>
    );
};

export default ReportItemTable;
