import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import FormFields from "./FormFields";
import { FaCheckCircle, FaEdit, FaTimes } from "react-icons/fa";

interface FormProps {
  onCancel: () => void;
  refreshPosts: () => void;
  Email: string;
  editData?: any;
}

const Form: React.FC<FormProps> = ({ onCancel, refreshPosts, editData }) => {
  const [ReferenceNumber, setReferenceNumber] = useState(editData?.ReferenceNumber || "");
  const [SupplierName, setSupplierName] = useState(editData?.SupplierName || "");
  const [ContactPerson, setContactPerson] = useState(editData?.ContactPerson || "");
  const [EmailAddress, setEmailAddress] = useState(editData?.EmailAddress || "");
  const [PhoneNumber, setPhoneNumber] = useState(editData?.PhoneNumber || "");
  const [Address, setAddress] = useState(editData?.Address || "");
  const [Categories, setCategories] = useState(editData?.Categories || "");
  const [ProductOffered, setProductOffered] = useState(editData?.ProductOffered || "");
  const [BusinessNumber, setBusinessNumber] = useState(editData?.BusinessNumber || "");
  const [PaymentTerms, setPaymentTerms] = useState(editData?.PaymentTerms || "");
  const [BankDetails, setBankDetails] = useState(editData?.BankDetails || "");
  const [Remarks, setRemarks] = useState(editData?.Remarks || "");
  const [Status, setStatus] = useState(editData?.Status || "");

  // Update and Create Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/Supplier/EditData` : `/api/Supplier/CreateData`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, SupplierName, ContactPerson, EmailAddress, PhoneNumber, Address, Categories, ProductOffered, BusinessNumber,
        PaymentTerms, BankDetails, Remarks, Status, id: editData?._id,
      }),
    });

    if (response.ok) {
      toast.success(editData ? "Data Updated Successfully" : "Data Added Successfully", {
        autoClose: 1000,
        onClose: () => {
          onCancel();
          refreshPosts();
        },
      });
    } else {
      toast.error(editData ? "Failed to Update Data" : "Failed to Add Data", {
        autoClose: 1000,
      });
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-4 text-xs">
        <h2 className="text-xs font-bold mb-4">{editData ? "Update Information" : "Information"}</h2>
        <FormFields
          ReferenceNumber={ReferenceNumber} setReferenceNumber={setReferenceNumber}
          SupplierName={SupplierName} setSupplierName={setSupplierName}
          ContactPerson={ContactPerson} setContactPerson={setContactPerson}
          EmailAddress={EmailAddress} setEmailAddress={setEmailAddress}
          PhoneNumber={PhoneNumber} setPhoneNumber={setPhoneNumber}
          Address={Address} setAddress={setAddress}
          Categories={Categories} setCategories={setCategories}
          ProductOffered={ProductOffered} setProductOffered={setProductOffered}
          BusinessNumber={BusinessNumber} setBusinessNumber={setBusinessNumber}
          PaymentTerms={PaymentTerms} setPaymentTerms={setPaymentTerms}
          BankDetails={BankDetails} setBankDetails={setBankDetails}
          Remarks={Remarks} setRemarks={setRemarks}
          Status={Status} setStatus={setStatus}
          editData={editData}
        />
        <div className="flex justify-between">
          <button type="submit" className="bg-[#2563EB] hover:bg-blue-900 text-white px-4 py-2 rounded text-xs flex gap-1">
            {editData ? (
              <><FaEdit size={14} /> Update</>
            ) : (
              <><FaCheckCircle size={14} /> Submit</>
            )}
          </button>

          <button type="button" className="hover:bg-gray-100 bg-white border px-4 py-2 rounded text-xs flex gap-1" onClick={onCancel}>
            <FaTimes size={15} />Cancel
          </button>
        </div>
      </form>
      <ToastContainer className="text-xs" autoClose={1000} />
    </>
  );
};

export default Form;
