import React, { useState, useEffect } from "react";
import Select from 'react-select';

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    DateIssuance: string; setDateIssuance: (value: string) => void;
    IssuedBy: string; setIssuedBy: (value: string) => void;
    Recipient: string; setRecipient: (value: string) => void;
    Purpose: string; setPurpose: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    ProductQuantity: string; setProductQuantity: (value: string) => void;
    UnitMeasure: string; setUnitMeasure: (value: string) => void;
    ReferenceDocumentNumber: string; setReferenceDocumentNumber: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    Status: string; setStatus: (value: string) => void;

    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    DateIssuance, setDateIssuance,
    IssuedBy, setIssuedBy,
    Recipient, setRecipient,
    Purpose, setPurpose,
    ProductSKU, setProductSKU,
    ProductName, setProductName,
    ProductQuantity, setProductQuantity,
    UnitMeasure, setUnitMeasure,
    ReferenceDocumentNumber, setReferenceDocumentNumber,
    Remarks, setRemarks,
    Status, setStatus,
    editData,
}) => {

    const [productname, setproductname] = useState<{ id: string; ProductName: string; value: string; label: string }[]>([]);

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    // Auto Generate Reference Number
    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `STOCKOUT-ID-${randomString}-${randomNumber}`;
    };

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/StockOut/FetchProduct');
                const data = await response.json();
                setproductname(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchProducts();
    }, []);

    const ProductOptions = productname.map((product) => ({
        value: product.ProductName,
        label: product.ProductName,
    }));

    // Handle Data after Fetching Products
    const handleProductChange = async (selectedOption: any) => {
        const selected = selectedOption ? selectedOption.value : '';
        setProductName(selected);

        if (selected) {
            try {
                const response = await fetch(`/api/StockOut/FetchProduct?ProductName=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Product Details:', details);
                    setProductSKU(details.ProductSKU || '');
                } else {
                    console.error(`data not found: ${selected}`);
                    resetFields();
                }
            } catch (error) {
                console.error('Error fetching data details:', error);
                resetFields();
            }
        } else {
            resetFields();
        }
    };
    
    // Reset Fields When Close or Change Products on Select Option
    const resetFields = () => {
        setProductSKU('');
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Date Issuance */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Date of Issuance</label>
                <input type="date" value={DateIssuance} onChange={(e) => setDateIssuance(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Issued By */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Issued By</label>
                <input type="text" value={IssuedBy} onChange={(e) => setIssuedBy(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Recipient / Department */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Recipient / Department</label>
                <select value={Recipient} onChange={(e) => setRecipient(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Warehouse">Warehouse</option>
                    <option value="Information Technology">Information Technology</option>
                    <option value="Sales">Sales</option>
                    <option value="Marketing">Marketing</option>
                </select>
            </div>

            {/* Purpose / Reason for Issuance */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Purpose / Reason for Issuance</label>
                <textarea value={Purpose} onChange={(e) => setPurpose(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Product Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product Name</label>
                {editData ? (
                    <input type="text" id="ProductName" value={ProductName} onChange={(e) => setProductName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="CompanyName" options={ProductOptions} onChange={handleProductChange} className="w-full text-xs capitalize" isClearable />
                )}
            </div>

            {/* Item Code / SKU */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Item Code / SKU</label>
                <input type="text" value={ProductSKU} onChange={(e) => setProductSKU(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* Quantity Received */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity Issued</label>
                <input type="number" value={ProductQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>


            {/* KG / Weight */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Unit of Measure</label>
                <input type="text" value={UnitMeasure} onChange={(e) => setUnitMeasure(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Reference Document Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reference Document Number</label>
                <input type="text" value={ReferenceDocumentNumber} onChange={(e) => setReferenceDocumentNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* Remarks */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reason / Remarks (Optional)</label>
                <textarea value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={Status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approval">Approval</option>
                    <option value="Completed">Completed</option>
                </select>
            </div>
        </div>
    );
};

export default FormFields;
