import React, { useState, useEffect } from "react";
import Select from 'react-select';

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    ProductSKU: string; setProductSKU: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    ProductQuantity: string; setProductQuantity: (value: string) => void;
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
    ProductQuantity, setProductQuantity,
    ReorderLevel, setReorderLevel,
    SupplierName, setSupplierName,
    LastOrderDate, setLastOrderDate,
    LeadTime, setLeadTime,
    ReorderQTY, setReorderQTY,
    Status, setStatus,
    editData,
}) => {

    const [productname, setproductname] = useState<{ id: string; ProductName: string; value: string; label: string }[]>([]);
    const [supplier, setSupplier] = useState<{ id: string; SupplierName: string; value: string; label: string }[]>([]);

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    // Auto Generate Number
    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `REORDER-ID-${randomString}-${randomNumber}`;
    };

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/Reorder/FetchProduct');
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
                const response = await fetch(`/api/Reorder/FetchProduct?ProductName=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Product Details:', details);
                    setProductSKU(details.ProductSKU || '');
                    setProductQuantity(details.ProductQuantity || '');
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
        setProductQuantity('');
    };

    // Fetch Supplier
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await fetch('/api/Reorder/FetchSupplier');
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
                const response = await fetch(`/api/Reorder/FetchSupplier?SupplierName=${encodeURIComponent(selected)}`);
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

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

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

            {/* Current Stock */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Current Stock</label>
                <input type="number" value={ProductQuantity} onChange={(e) => setProductQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Reorder Level */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Reorder Level</label>
                <input type="number" value={ReorderLevel} onChange={(e) => setReorderLevel(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
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

            {/* Last Order Date */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Last Order Date</label>
                <input type="date" value={LastOrderDate} onChange={(e) => setLastOrderDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" />
            </div>

            {/* Lead Time */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Lead Time</label>
                <input type="date" value={LeadTime} onChange={(e) => setLeadTime(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
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
