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
  const [PONumber, setPONumber] = useState(editData?.PONumber || "");
  const [PODate, setPODate] = useState(editData?.PODate || "");
  const [BuyerName, setBuyerName] = useState(editData?.BuyerName || "");
  const [SupplierName, setSupplierName] = useState(editData?.SupplierName || "");
  const [ProductName, setProductName] = useState(editData?.ProductName || "");
  const [Quantity, setQuantity] = useState(editData?.Quantity || "");
  const [ProductCostPrice, setProductCostPrice] = useState(editData?.ProductCostPrice || "");
  const [PaymentTerms, setPaymentTerms] = useState(editData?.PaymentTerms || "");
  const [DeliveryAddress, setDeliveryAddress] = useState(editData?.DeliveryAddress || "");
  const [DeliveryDate, setDeliveryDate] = useState(editData?.DeliveryDate || "");
  const [DeliveryStatus, setDeliveryStatus] = useState(editData?.DeliveryStatus || "");
  const [DeliveryRemarks, setDeliveryRemarks] = useState(editData?.DeliveryRemarks || "");

  // Update and Create Data
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const url = editData ? `/api/PurchaseOrder/EditData` : `/api/PurchaseOrder/CreateData`;
    const method = editData ? "PUT" : "POST";

    const response = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ReferenceNumber, PONumber, PODate, BuyerName, SupplierName, ProductName, Quantity, ProductCostPrice, PaymentTerms, DeliveryAddress,
        DeliveryDate, DeliveryStatus, DeliveryRemarks, id: editData?._id,
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
          PONumber={PONumber} setPONumber={setPONumber}
          PODate={PODate} setPODate={setPODate}
          BuyerName={BuyerName} setBuyerName={setBuyerName}
          SupplierName={SupplierName} setSupplierName={setSupplierName}
          ProductName={ProductName} setProductName={setProductName}
          Quantity={Quantity} setQuantity={setQuantity}
          ProductCostPrice={ProductCostPrice} setProductCostPrice={setProductCostPrice}
          PaymentTerms={PaymentTerms} setPaymentTerms={setPaymentTerms}
          DeliveryAddress={DeliveryAddress} setDeliveryAddress={setDeliveryAddress}
          DeliveryDate={DeliveryDate} setDeliveryDate={setDeliveryDate}
          DeliveryStatus={DeliveryStatus} setDeliveryStatus={setDeliveryStatus}
          DeliveryRemarks={DeliveryRemarks} setDeliveryRemarks={setDeliveryRemarks}
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
