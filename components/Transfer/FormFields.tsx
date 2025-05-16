import React, { useEffect } from "react";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    DateTransfer: string; setDateTransfer: (value: string) => void;
    RequestedBy: string; setRequestedBy: (value: string) => void;
    FromLocation: string; setFromLocation: (value: string) => void;
    ToLocation: string; setToLocation: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    ProductQuantity: string; setProductQuantity: (value: string) => void;
    UnitMeasure: string; setUnitMeasure: (value: string) => void;
    ReasonTransfer: string; setReasonTransfer: (value: string) => void;
    Status: string; setStatus: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    Approver: string; setApprover: (value: string) => void;
    
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    DateTransfer, setDateTransfer,
    RequestedBy, setRequestedBy,
    FromLocation, setFromLocation,
    ToLocation, setToLocation,
    ProductSKU, setProductSKU,
    ProductName, setProductName,
    ProductQuantity, setProductQuantity,
    UnitMeasure, setUnitMeasure,
    ReasonTransfer, setReasonTransfer,
    Status, setStatus,
    Remarks, setRemarks,
    Approver, setApprover,
    
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
        return `TRANSFER-ID-${randomString}-${randomNumber}`;
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Date of Transfer */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Date of Transfer</label>
                <input type="date" value={DateTransfer} onChange={(e) => setDateTransfer(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Requested By */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Requested By</label>
                <input type="text" value={RequestedBy} onChange={(e) => setRequestedBy(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* From Location / Warehouse */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">From Location / Warehouse</label>
                <select value={FromLocation} onChange={(e) => setFromLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                    <option value="">Select Warehouse</option>
                    <option value="QC Main Branch">QC Main Branch</option>
                    <option value="Paranaque Branch">Paranaque Branch</option>
                    <option value="Pasay Branch">Pasay Branch</option>
                </select>
            </div>

            {/* To Location / Warehouse */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">To Location / Warehouse</label>
                <select value={ToLocation} onChange={(e) => setToLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                    <option value="">Select Warehouse</option>
                    <option value="QC Main Branch">QC Main Branch</option>
                    <option value="Paranaque Branch">Paranaque Branch</option>
                    <option value="Pasay Branch">Pasay Branch</option>
                </select>
            </div>

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


            {/* Quantity Transfer */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity Transfer</label>
                <input type="number" value={ProductQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>


            {/* Unit of Measure */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Unit of Measure</label>
                <input type="text" value={UnitMeasure} onChange={(e) => setUnitMeasure(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Reason for Transfer */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reason for Transfer</label>
                <select value={ReasonTransfer} onChange={(e) => setReasonTransfer(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Stock Rebalancing">Stock Rebalancing</option>
                    <option value="Urgent Demand">Urgent Demand</option>
                </select>
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={Status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Approved">Approved</option>
                    <option value="Completed">Completed</option>
                    <option value="Cancelled">Cancelled</option>
                </select>
            </div>

            {/* Remarks / Notes */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Remarks / Notes</label>
                <textarea value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Approver */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Approver</label>
                <input type="text" value={Approver} onChange={(e) => setApprover(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>
        </div>
    );
};

export default FormFields;
