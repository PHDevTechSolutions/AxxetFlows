import React, { useState, useEffect } from "react";
import Select from 'react-select';

type OptionType = {
    value: string;
    label: string;
};

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    PONumber: string; setPONumber: (value: string) => void;
    PODate: string; setPODate: (value: string) => void;
    BuyerName: string; setBuyerName: (value: string) => void;
    SupplierName: string; setSupplierName: (value: string) => void;
    ProductName: string; setProductName: (value: string) => void;
    Quantity: string; setQuantity: (value: string) => void;
    ProductCostPrice: string; setProductCostPrice: (value: string) => void;
    PaymentTerms: string; setPaymentTerms: (value: string) => void;
    DeliveryAddress: string; setDeliveryAddress: (value: string) => void;
    DeliveryDate: string; setDeliveryDate: (value: string) => void;
    DeliveryStatus: string; setDeliveryStatus: (value: string) => void;
    DeliveryRemarks: string; setDeliveryRemarks: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    PONumber, setPONumber,
    PODate, setPODate,
    BuyerName, setBuyerName,
    SupplierName, setSupplierName,
    ProductName, setProductName,
    Quantity, setQuantity,
    ProductCostPrice, setProductCostPrice,
    PaymentTerms, setPaymentTerms,
    DeliveryAddress, setDeliveryAddress,
    DeliveryDate, setDeliveryDate,
    DeliveryStatus, setDeliveryStatus,
    DeliveryRemarks, setDeliveryRemarks,
    editData,
}) => {

    const [supplier, setSupplier] = useState<{ id: string; SupplierName: string; value: string; label: string }[]>([]);
    const [productname, setproductname] = useState<{ id: string; ProductName: string; value: string; label: string }[]>([]);
    const [isInput, setIsInput] = useState(false); // toggle state

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
            setPONumber(editData.PONumber || "");
            setPODate(editData.PODate || "");
            setBuyerName(editData.BuyerName || "");
            setProductName(editData.ProductName || "");
            setQuantity(editData.Quantity || "");
            setProductCostPrice(editData.ProductCostPrice || "");
            setPaymentTerms(editData.PaymentTerms || "");
            setDeliveryAddress(editData.DeliveryAddress || "");
            setDeliveryDate(editData.DeliveryDate || "");
            setDeliveryStatus(editData.DeliveryStatus || "");
            setDeliveryRemarks(editData.DeliveryRemarks || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `REF-${randomString}-${randomNumber}`;
    };

    // Fetch Suppliers
    useEffect(() => {
        const fetchSupplier = async () => {
            try {
                const response = await fetch('/api/PurchaseOrder/FetchSupplier');
                const data = await response.json();
                setSupplier(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
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

    // Fetch Products
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('/api/PurchaseOrder/FetchProduct');
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
                const response = await fetch(`/api/PurchaseOrder/FetchProduct?ProductName=${encodeURIComponent(selected)}`);
                if (response.ok) {
                    const details = await response.json();
                    console.log('Fetched Product Details:', details);
                    setProductCostPrice(details.ProductCostPrice || '');
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
        setProductCostPrice('');
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} className="w-full px-3 py-2 border rounded text-xs" />

            {/* PO Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Purchase Order Number</label>
                <input type="text" value={PONumber} onChange={(e) => setPONumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs uppercase" required />
            </div>

            {/* PO Date */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">PO Date</label>
                <input type="date" value={PODate} onChange={(e) => setPODate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Buyer Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Buyer Name</label>
                <input type="text" value={BuyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Supplier Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Supplier Name</label>
                {editData ? (
                    <input type="text" id="SupplierName" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="SupplierName" options={SupplierOptions} onChange={handleSupplierChange} className="w-full text-xs capitalize" placeholder="Select Company" isClearable />
                )}
            </div>

            {/* Item / Product Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Item / Product Name</label>
                {editData ? (
                    <input type="text" id="ProductName" value={ProductName} onChange={(e) => setProductName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name" />
                ) : (
                    <Select id="CompanyName" options={ProductOptions} onChange={handleProductChange} className="w-full text-xs capitalize" isClearable />
                )}
            </div>

            {/* Quantity */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity</label>
                <input type="number" value={Quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Unit Price*/}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Unit Price</label>
                <input type="number" value={ProductCostPrice} onChange={(e) => setProductCostPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Payment Terms */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Payment Terms</label>
                <select value={PaymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                    <option value="">Select Payment Terms</option>
                    <option value="30 Days Credit">30 Days Credit</option>
                    <option value="COD">COD</option>
                    <option value="NET 15">NET 15</option>
                </select>
            </div>

            {/* Delivery Address */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Delivery Address</label>
                <textarea value={DeliveryAddress} onChange={(e) => setDeliveryAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Delivery Date */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Delivery Date</label>
                <input type="date" value={DeliveryDate} onChange={(e) => setDeliveryDate(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={DeliveryStatus} onChange={(e) => setDeliveryStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="In Transit">In Transit</option>
                    <option value="Out for Delivery">Out for Delivery</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Partially Delivered">Partially Delivered</option>
                    <option value="Failed Delivery">Failed Delivery</option>
                    <option value="Returned">Returned</option>
                </select>
            </div>

            {/* Delivery Remarks */}
            {(DeliveryStatus === "Failed Delivery" || DeliveryStatus === "Returned") && (
                <div className="w-full sm:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2">Reason / Remarks</label>
                    <textarea
                        value={DeliveryRemarks}
                        onChange={(e) => setDeliveryRemarks(e.target.value)}
                        className="w-full px-3 py-2 border rounded text-xs capitalize"
                        rows={3}
                    ></textarea>
                </div>
            )}
        </div>
    );
};

export default FormFields;
