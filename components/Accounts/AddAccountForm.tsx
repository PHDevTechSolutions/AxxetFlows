"use client";

import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./AccountFormFields";

interface AddAccountFormProps { 
  onCancel: () => void; 
  refreshPosts: () => void;  // Add a refreshPosts callback
  userName: string; 
  editPost?: any; // Optional prop for the post being edited
}

const AddAccountForm: React.FC<AddAccountFormProps> = ({ onCancel, refreshPosts, userName, editPost }) => {
  const [companyName, setCompanyName] = useState(editPost ? editPost.companyName : "");
  const [customerName, setCustomerName] = useState(editPost ? editPost.customerName : "");
  const [gender, setGender] = useState(editPost ? editPost.gender : "");
  const [contactNumber, setContactNumber] = useState(editPost ? editPost.contactNumber : "");
  const [cityAddress, setCityAddress] = useState(editPost ? editPost.cityAddress : "");
  const [author, setAuthor] = useState(userName);
  const [featureImage, setFeatureImage] = useState<File | null>(null);

  useEffect(() => {
    setAuthor(userName);
  }, [userName]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editPost ? `/api/account/editAccount` : `/api/account/posts`; // API endpoint changes based on edit or add
    const method = editPost ? "PUT" : "POST"; // HTTP method changes based on edit or add

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        companyName,
        customerName,
        gender,
        contactNumber,
        cityAddress,
        id: editPost ? editPost._id : undefined, // Send post ID if editing
      }),
    });

    if (response.ok) {
      toast.success(editPost ? "Account updated successfully" : "Account added successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel(); // Hide the form after submission
          refreshPosts(); // Refresh accounts after successful submission
        }
      });
    } else {
      toast.error(editPost ? "Failed to update account" : "Failed to add account", {
        autoClose: 1000
      });
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFeatureImage(e.target.files[0]);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editPost ? "Edit Account" : "Add New Account"}</h2>
        <FormFields
          companyName={companyName}
          setCompanyName={setCompanyName}
          customerName={customerName}
          setCustomerName={setCustomerName}
          gender={gender}
          setGender={setGender}
          contactNumber={contactNumber}
          setContactNumber={setContactNumber}
          cityAddress={cityAddress}
          setCityAddress={setCityAddress}
          handleFileChange={handleFileChange}
          editPost={editPost}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded text-xs">{editPost ? "Update" : "Submit"}</button>
          <button type="button" className="bg-gray-500 text-white px-4 py-2 rounded text-xs" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default AddAccountForm;
