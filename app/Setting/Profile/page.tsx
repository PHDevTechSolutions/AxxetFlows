"use client";

import React, { useState, useEffect } from "react";
import ParentLayout from "../../../components/Layouts/ParentLayout";
import SessionChecker from "../../../components/SessionChecker";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ProfileForm from "../../../components/Setting/ProfileForm";

const ProfilePage: React.FC = () => {
    const [userDetails, setUserDetails] = useState({
        id: "",
        Firstname: "",
        Lastname: "",
        Email: "",
        Location: "", // Add Location property here
        Role: "",
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

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
                        id: data._id || "",
                        Firstname: data.Firstname || "",
                        Lastname: data.Lastname || "",
                        Email: data.Email || "",
                        Location: data.Location || "", // Ensure Location is fetched
                        Role: data.Role || "",
                    });
                } catch (err: unknown) {
                    console.error("Error fetching user data:", err);
                    setError("Failed to load user data. Please try again later.");
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await fetch("/api/Setting/UpdateProfile", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(userDetails), // Send the updated userDetails object
            });

            if (response.ok) {
                toast.success("Profile updated successfully");
            } else {
                throw new Error("Failed to update profile");
            }
        } catch (err: unknown) {
            toast.error("Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUserDetails((prev) => ({ ...prev, [name]: value }));
    };

    if (loading) return <div>Loading...</div>;

    return (
        <SessionChecker>
            <ParentLayout>
                <div className="max-w-4xl mx-auto p-6">
                    <h1 className="text-lg font-bold mb-4">Update Profile</h1>
                    {error && <div className="text-red-500 mb-4">{error}</div>}
                    <ProfileForm
                        userDetails={userDetails}
                        handleSubmit={handleSubmit}
                        handleChange={handleChange}
                        handleSelectChange={handleSelectChange}
                    />
                </div>
                <ToastContainer />
            </ParentLayout>
        </SessionChecker>
    );
};

export default ProfilePage;
