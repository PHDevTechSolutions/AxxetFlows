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
    ItemName: string; setItemName: (value: string) => void;
    Quantity: string; setQuantity: (value: string) => void;
    UnitPrice: string; setUnitPrice: (value: string) => void;
    PaymentTerms: string; setPaymentTerms: (value: string) => void;
    DeliveryAddress: string; setDeliveryAddress: (value: string) => void;
    DeliveryDate: string; setDeliveryDate: (value: string) => void;
    DeliveryStatus: string; setDeliveryStatus: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    PONumber, setPONumber,
    PODate, setPODate,
    BuyerName, setBuyerName,
    SupplierName, setSupplierName,
    ItemName, setItemName,
    Quantity, setQuantity,
    UnitPrice, setUnitPrice,
    PaymentTerms, setPaymentTerms,
    DeliveryAddress, setDeliveryAddress,
    DeliveryDate, setDeliveryDate,
    DeliveryStatus, setDeliveryStatus,
    editData,
}) => {

    const [companies, setCompanies] = useState<{ id: string; SupplierName: string; value: string; label: string }[]>([]);
    const [isInput, setIsInput] = useState(false); // toggle state

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
            setPONumber(editData.PONumber || "");
            setPODate(editData.PODate || "");
            setBuyerName(editData.BuyerName || "");
            setItemName(editData.ItemName || "");
            setQuantity(editData.Quantity || "");
            setUnitPrice(editData.UnitPrice || "");
            setPaymentTerms(editData.PaymentTerms || "");
            setDeliveryAddress(editData.DeliveryAddress || "");
            setDeliveryDate(editData.DeliveryDate || "");
            setDeliveryStatus(editData.DeliveryStatus || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `REF-${randomString}-${randomNumber}`;
    };

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const response = await fetch('/api/PurchaseOrder/FetchSupplier');
                const data = await response.json();
                setCompanies(data);
            } catch (error) {
                console.error('Error fetching companies:', error);
            }
        };
        fetchCompanies();
    }, []);

    const CompanyOptions = companies.map((company) => ({
        value: company.SupplierName,
        label: company.SupplierName,
    }));

    const handleCompanyChange = async (selectedOption: any) => {
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
                    console.error(`Company not found: ${selected}`);
                }
            } catch (error) {
                console.error('Error fetching company details:', error);
            }
        }
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* PO Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">PO Number</label>
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
                <input type="text" value={BuyerName} onChange={(e) => setBuyerName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Supplier Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Supplier Name</label>
                {editData ? (
                    <input type="text" id="CompanyName" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" placeholder="Enter Company Name"/>
                ) : (
                    <Select id="CompanyName" options={CompanyOptions} onChange={handleCompanyChange} className="w-full text-xs" placeholder="Select Company" isClearable />
                )}
            </div>

            {/* Item / Product Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Item / Product Name</label>
                <input type="text" value={ItemName} onChange={(e) => setItemName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Quantity */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Quantity</label>
                <input type="number" value={Quantity} onChange={(e) => setQuantity(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Unit Price*/}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Unit Price</label>
                <input type="number" value={UnitPrice} onChange={(e) => setUnitPrice(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
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
                    <option value="Returned">Returned</option>
                </select>
            </div>
        </div>
    );
};

export default FormFields;
