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
  const [DateIssuance, setDateIssuance] = useState(editData?.DateIssuance || "");
  const [IssuedBy, setIssuedBy] = useState(editData?.IssuedBy || "");
  const [Recipient, setRecipient] = useState(editData?.Recipient || "");
  const [Purpose, setPurpose] = useState(editData?.Purpose || "");
  const [ProductSKU, setProductSKU] = useState(editData?.ProductSKU || "");
  const [ProductName, setProductName] = useState(editData?.ProductName || "");
  const [ProductQuantity, setProductQuantity] = useState(editData?.ProductQuantity || "");
  const [UnitMeasure, setUnitMeasure] = useState(editData?.UnitMeasure || "");
  const [ReferenceDocumentNumber, setReferenceDocumentNumber] = useState(editData?.ReferenceDocumentNumber || "");
  const [Remarks, setRemarks] = useState(editData?.Remarks || "");
  const [Status, setStatus] = useState(editData?.Status || "");
  
  // Update and Create Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/StockOut/EditData` : `/api/StockOut/CreateData`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, DateIssuance, IssuedBy, Recipient, Purpose, ProductSKU, ProductName, ProductQuantity, UnitMeasure, 
        ReferenceDocumentNumber, Remarks, Status, id: editData?._id,
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
          DateIssuance={DateIssuance} setDateIssuance={setDateIssuance}
          IssuedBy={IssuedBy} setIssuedBy={setIssuedBy}
          Recipient={Recipient} setRecipient={setRecipient}
          Purpose={Purpose} setPurpose={setPurpose}
          ProductSKU={ProductSKU} setProductSKU={setProductSKU}
          ProductName={ProductName} setProductName={setProductName}
          ProductQuantity={ProductQuantity} setProductQuantity={setProductQuantity}
          UnitMeasure={UnitMeasure} setUnitMeasure={setUnitMeasure}
          ReferenceDocumentNumber={ReferenceDocumentNumber} setReferenceDocumentNumber={setReferenceDocumentNumber}
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
