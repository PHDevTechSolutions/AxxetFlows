import React, { useEffect } from "react";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    CurrentStock: string; setCurrentStock: (value: string) => void;
    ReorderLevel: string; setReorderLevel: (value: string) => void;
    SupplierName: string; setSupplierName: (value: string) => void;
    LastOrderDate: string; setLastOrderDate: (value: string) => void;
    LeadTime: string; setLeadTime: (value: string) => void;
    ReorderQTY: string; setReorderQTY: (value: string) => void;
    Status: string; setStatus: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    ProductSKU, setProductSKU,
    ProductName, setProductName,
    CurrentStock, setCurrentStock,
    ReorderLevel, setReorderLevel,
    SupplierName, setSupplierName,
    LastOrderDate, setLastOrderDate,
    LeadTime, setLeadTime,
    ReorderQTY, setReorderQTY,
    Status, setStatus,
    editData,
}) => {

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");  
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `REORDER-ID-${randomString}-${randomNumber}`;
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

             {/* Item Code / SKU */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Item Code / SKU</label>
                <input type="text" value={ProductSKU} onChange={(e) => setProductSKU(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* Product Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Product Name</label>
                <input type="text" value={ProductName} onChange={(e) => setProductName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Current Stock */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Current Stock</label>
                <input type="number" value={CurrentStock} onChange={(e) => setCurrentStock(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Reorder Level */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reorder Level</label>
                <input type="number" value={ReorderLevel} onChange={(e) => setReorderLevel(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Supplier Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Supplier Name</label>
                <input type="text" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Last Order Date */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Last Order Date</label>
                <input type="date" value={LastOrderDate} onChange={(e) => setLastOrderDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Lead Time */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Lead Time</label>
                <input type="text" value={LeadTime} onChange={(e) => setLeadTime(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Suggested Reorder QTY */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Suggested Reorder QTY</label>
                <input type="text" value={ReorderQTY} onChange={(e) => setReorderQTY(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={Status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Acknowledged">Acknowledged</option>
                    <option value="Ordered">Ordered</option>
                </select>
            </div>
        </div>
    );
};

export default FormFields;
