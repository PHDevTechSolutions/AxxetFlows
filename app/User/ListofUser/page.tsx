"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/Session/SessionChecker";
import UserFetcher from "../../../components/UserFetcher/UserFetcher";

// Components
import AddUserForm from "../../../components/User/AddUserForm";
import UsersTable from "../../../components/User/UsersTable";
import SearchFilters from "../../../components/User/SearchFilters";

// Toast Notifications
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { HiMiniPlus } from "react-icons/hi2";

const ListofUser: React.FC = () => {
  const [showForm, setShowForm] = useState(false);
  const [editPost, setEditPost] = useState<any>(null);
  const [posts, setPosts] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [postsPerPage, setPostsPerPage] = useState(5);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [postToDelete, setPostToDelete] = useState<string | null>(null);

  // Fetch users data from API
  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/User/FetchUser");
      const data = await response.json();
      setPosts(data);
    } catch (error) {
      toast.error("Error fetching users.");
      console.error("Error Fetching", error);
    }
  };

  // Filter users by search term
  const filteredAccounts = posts.filter((post) =>
    [post?.Firstname, post?.Lastname]
      .some((field) => field?.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredAccounts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredAccounts.length / postsPerPage);

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEdit = (post: any) => {
    setEditPost(post);
    setShowForm(true);
  };

  const confirmDelete = (postId: string) => {
    setPostToDelete(postId);
    setShowDeleteModal(true);
  };

  const handleDelete = async () => {
    if (!postToDelete) return;

    try {
      const response = await fetch(`/api/User/DeleteUser`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: postToDelete }),
      });

      if (response.ok) {
        setPosts(posts.filter((post) => post._id !== postToDelete));
        toast.success("Account deleted successfully.");
      } else {
        toast.error("Failed to delete account.");
      }
    } catch (error) {
      toast.error("Failed to delete account.");
      console.error("Error deleting account:", error);
    } finally {
      setShowDeleteModal(false);
      setPostToDelete(null);
    }
  };

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4">
              <ToastContainer />
              <div className="grid grid-cols-1">
                {showForm ? (
                  <AddUserForm
                    onCancel={() => {
                      setShowForm(false);
                      setEditPost(null);
                    }}
                    refreshUser={fetchUsers}
                    userName={user ? user.userName : ""}
                    editPost={editPost}
                  />
                ) : (
                  <>
                    <div className="flex justify-between items-center mb-4">
                      {user && user.Role !== "Auditor" && (
                      <button
                        className="hover:bg-blue-900 bg-[#2563EB] text-white px-4 text-xs py-2 rounded flex gap-1"
                        onClick={() => setShowForm(true)}
                      >
                        <HiMiniPlus size={15}/>Create User
                      </button>
                      )}
                    </div>

                    <div className="mb-4 p-4 bg-white shadow-md rounded-lg">
                      <h2 className="text-lg font-bold mb-2">List of Users</h2>
                      <SearchFilters
                        searchTerm={searchTerm}
                        setSearchTerm={setSearchTerm}
                        postsPerPage={postsPerPage}
                        setPostsPerPage={setPostsPerPage}
                      />
                      <UsersTable
                        posts={currentPosts}
                        handleEdit={handleEdit}
                        handleDelete={confirmDelete}
                        Role={user ? user.Role : ""}
                        Location={user ? user.Location : ""}
                      />
                      <div className="text-xs mt-2">
                        Showing {indexOfFirstPost + 1} to{" "}
                        {Math.min(indexOfLastPost, filteredAccounts.length)} of{" "}
                        {filteredAccounts.length} entries
                      </div>
                    </div>
                  </>
                )}

                {showDeleteModal && (
                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                    <div className="bg-white p-4 rounded shadow-lg">
                      <h2 className="text-xs font-bold mb-4">
                        Confirm Deletion
                      </h2>
                      <p className="text-xs">
                        Are you sure you want to delete this account?
                      </p>
                      <div className="mt-4 flex justify-end">
                        <button
                          className="bg-red-500 text-white text-xs px-4 py-2 rounded mr-2"
                          onClick={handleDelete}
                        >
                          Delete
                        </button>
                        <button
                          className="bg-gray-300 text-xs px-4 py-2 rounded"
                          onClick={() => setShowDeleteModal(false)}
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default ListofUser;
