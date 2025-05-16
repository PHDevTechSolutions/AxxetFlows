import React, { useState, useEffect } from "react";
import Select from 'react-select';

type OptionType = {
    value: string;
    label: string;
};

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    DateReceived: string; setDateReceived: (value: string) => void;
    PONumber: string; setPONumber: (value: string) => void;
    ReceivedBy: string; setReceivedBy: (value: string) => void;
    SupplierName: string; setSupplierName: (value: string) => void;
    WarehouseLocation: string; setWarehouseLocation: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    ProductDescription: string; setProductDescription: (value: string) => void;
    ProductQuantity: string; setProductQuantity: (value: string) => void;
    ProductBoxes: string; setProductBoxes: (value: string) => void;
    ProductMeasure: string; setProductMeasure: (value: string) => void;
    BatchNumber: string; setBatchNumber: (value: string) => void;
    ExpirationDate: string; setExpirationDate: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    ReceivedStatus: string; setReceivedStatus: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    DateReceived, setDateReceived,
    PONumber, setPONumber,
    ReceivedBy, setReceivedBy,
    SupplierName, setSupplierName,
    WarehouseLocation, setWarehouseLocation,
    ProductSKU, setProductSKU,
    ProductName, setProductName,
    ProductDescription, setProductDescription,
    ProductQuantity, setProductQuantity,
    ProductBoxes, setProductBoxes,
    ProductMeasure, setProductMeasure,
    BatchNumber, setBatchNumber,
    ExpirationDate, setExpirationDate,
    Remarks, setRemarks,
    ReceivedStatus, setReceivedStatus,
    editData,
}) => {

    const [supplier, setSupplier] = useState<{ id: string; SupplierName: string; value: string; label: string }[]>([]);
    const [ponumber, setponumber] = useState<{ id: string; PONumber: string; value: string; label: string }[]>([]);
    const [isInput, setIsInput] = useState(false); // toggle state

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
            setDateReceived(editData.DateReceived || "");
            setPONumber(editData.PONumber || "");
            setReceivedBy(editData.ReceivedBy || "");
            setWarehouseLocation(editData.WarehouseLocation || "");
            setProductSKU(editData.ProductSKU || "");
            setProductName(editData.ProductName || "");
            setProductDescription(editData.ProductDescription || "");
            setProductQuantity(editData.ProductQuantity || "");
            setProductBoxes(editData.ProductBoxes || "");
            setProductMeasure(editData.ProductMeasure || "");
            setBatchNumber(editData.BatchNumber || "");
            setExpirationDate(editData.ExpirationDate || "");
            setRemarks(editData.Remarks || "");
            setReceivedStatus(editData.ReceivedStatus || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);
    
    // Auto Generate Number
    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `REC-${randomString}-${randomNumber}`;
    };

    // Fetch Supplier
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await fetch('/api/PurchaseOrder/FetchSupplier');
                const data = await response.json();
                setSupplier(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchSupplier();
    }, []);

    const SupplierOptions = supplier.map((supplier) => ({
        value: supplier.SupplierName,
        label: supplier.SupplierName,
    }));
    
    // Handle Data after Fetching Supplier
    const handleSupplierChange = async (selectedOption: any) => {
        const selected = selectedOption ? selectedOption.value : '';
        setSupplierName(selected);

        if (selected) {
            try {
                const response = await fetch(`/api/PurchaseOrder/FetchSupplier?SupplierName=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Supplier Details:', details);
                    // Set other supplier details here if needed
                } else {
                    console.error(`data not found: ${selected}`);
                }
            } catch (error) {
                console.error('Error fetching data details:', error);
            }
        }
    };

    // Fetch PO Number
    useEffect(() => {
        const fetchPurchaseOrder = async () => {
            try {
                const response = await fetch('/api/Received/FetchPO');
                const data = await response.json();
                setponumber(data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchPurchaseOrder();
    }, []);

    const POOptions = ponumber.map((po) => ({
        value: po.PONumber,
        label: po.PONumber,
    }));

    // Handle Data after Fetching PO
    const handlePOChange = async (selectedOption: any) => {
        const selected = selectedOption ? selectedOption.value : '';
        setPONumber(selected);

        if (selected) {
            try {
                const response = await fetch(`/api/Received/FetchPO?PONumber=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Data Details:', details);
                    // Set other supplier details here if needed
                } else {
                    console.error(`data not found: ${selected}`);
                }
            } catch (error) {
                console.error('Error fetching data details:', error);
            }
        }
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Date Received */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Date Received</label>
                <input type="date" value={DateReceived} onChange={(e) => setDateReceived(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Supplier Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Supplier Name</label>
                {editData ? (
                    <input type="text" id="SupplierName" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="SupplierName" options={SupplierOptions} onChange={handleSupplierChange} className="w-full text-xs" placeholder="Select Supplier" isClearable />
                )}
            </div>

            {/* PO Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Purchase Order Number</label>
                {editData ? (
                    <input type="text" id="PONumber" value={PONumber} onChange={(e) => setPONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="PONumber" options={POOptions} onChange={handlePOChange} className="w-full text-xs" placeholder="Select Purchase Order Number" isClearable />
                )}
            </div>

            {/* Received By */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Received By</label>
                <input type="text" value={ReceivedBy} onChange={(e) => setReceivedBy(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Warehouse / Location */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Warehouse / Location</label>
                <select value={WarehouseLocation} onChange={(e) => setWarehouseLocation(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
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

            {/* Description */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Description</label>
                <input type="text" value={ProductDescription} onChange={(e) => setProductDescription(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Quantity Received */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity Received</label>
                <input type="number" value={ProductQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Boxes */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Boxes</label>
                <input type="text" value={ProductBoxes} onChange={(e) => setProductBoxes(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* KG / Weight */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">KG / Weight</label>
                <input type="text" value={ProductMeasure} onChange={(e) => setProductMeasure(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Batch Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Batch Number</label>
                <input type="text" value={BatchNumber} onChange={(e) => setBatchNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* Expiration Date (If Applicable) */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Expiration Date (If Applicable)</label>
                <input type="date" value={ExpirationDate} onChange={(e) => setExpirationDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Remarks */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reason / Remarks</label>
                <textarea
                    value={Remarks}
                    onChange={(e) => setRemarks(e.target.value)}
                    className="w-full px-3 py-2 border rounded text-xs capitalize"
                    rows={3}
                ></textarea>
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={ReceivedStatus} onChange={(e) => setReceivedStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Pending Inspection">Pending Inspection</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                </select>
            </div>

        </div>
    );
};

export default FormFields;
