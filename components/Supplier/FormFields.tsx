import React, { useEffect } from "react";

interface FormFieldsProps {
    ReferenceNumber: string; setReferenceNumber: (value: string) => void;
    SupplierName: string; setSupplierName: (value: string) => void;
    ContactPerson: string; setContactPerson: (value: string) => void;
    EmailAddress: string; setEmailAddress: (value: string) => void;
    PhoneNumber: string; setPhoneNumber: (value: string) => void;
    Address: string; setAddress: (value: string) => void;
    Categories: string; setCategories: (value: string) => void;
    ProductOffered: string; setProductOffered: (value: string) => void;
    BusinessNumber: string; setBusinessNumber: (value: string) => void;
    PaymentTerms: string; setPaymentTerms: (value: string) => void;
    BankDetails: string; setBankDetails: (value: string) => void;
    Remarks: string; setRemarks: (value: string) => void;
    Status: string; setStatus: (value: string) => void;
    editData?: any;
}

const FormFields: React.FC<FormFieldsProps> = ({
    ReferenceNumber, setReferenceNumber,
    SupplierName, setSupplierName,
    ContactPerson, setContactPerson,
    EmailAddress, setEmailAddress,
    PhoneNumber, setPhoneNumber,
    Address, setAddress,
    Categories, setCategories,
    ProductOffered, setProductOffered,
    BusinessNumber, setBusinessNumber,
    PaymentTerms, setPaymentTerms,
    BankDetails, setBankDetails,
    Remarks, setRemarks,
    Status, setStatus,
    editData,
}) => {

    // Generate Reference Number only when not editing
    useEffect(() => {
        if (editData) {
            // Populate form fields for edit
            setReferenceNumber(editData.ReferenceNumber || "");
            setSupplierName(editData.SupplierName || "");
            setContactPerson(editData.ContactPerson || "");
            setEmailAddress(editData.EmailAddress || "");
            setPhoneNumber(editData.PhoneNumber || "");
            setAddress(editData.Address || "");
            setCategories(editData.Categories || "");
            setProductOffered(editData.ProductOffered || "");
            setBusinessNumber(editData.BusinessNumber || "");
            setPaymentTerms(editData.PaymentTerms || "");
            setBankDetails(editData.BankDetails || "");
            setRemarks(editData.Remarks || "");
            setStatus(editData.Status || "");
        } else {
            setReferenceNumber(generateReferenceNumber());
        }
    }, [editData]);

    const generateReferenceNumber = () => {
        const randomString = Math.random().toString(36).substring(2, 8).toUpperCase();
        const randomNumber = Math.floor(Math.random() * 1000);
        return `SUP-${randomString}-${randomNumber}`;
    };

    return (
        <div className="flex flex-wrap -mx-4">
            <input type="hidden" id="ReferenceNumber" value={ReferenceNumber} readOnly className="w-full px-3 py-2 border rounded text-xs" />

            {/* Supplier Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Supplier Name / Company Name</label>
                <input type="text" value={SupplierName} onChange={(e) => setSupplierName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Contact Person */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Contact Person</label>
                <input type="text" value={ContactPerson} onChange={(e) => setContactPerson(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Email Address */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Email Address</label>
                <input type="text" value={EmailAddress} onChange={(e) => setEmailAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Phone Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Phone Number</label>
                <input type="text" value={PhoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
            </div>

            {/* Address */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Address</label>
                <textarea value={Address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Business Type */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Business Type / Category</label>
                <input type="text" value={Categories} onChange={(e) => setCategories(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
            </div>

            {/* Products Offered */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Products or Services Offered</label>
                <textarea value={ProductOffered} onChange={(e) => setProductOffered(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Business Number */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Tin / Business Registration Number</label>
                <input type="text" value={BusinessNumber} onChange={(e) => setBusinessNumber(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
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

            {/* Bank Name */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Bank Name</label>
                <select value={BankDetails} onChange={(e) => setBankDetails(e.target.value)} className="w-full px-3 py-2 border rounded text-xs">
                    <option value="">Select Bank</option>
                    <option value="Metrobank">Metrobank</option>
                    <option value="Lanbank">Lanbank</option>
                    <option value="BDO">BDO</option>
                </select>
            </div>

            {/* Remarks */}
            <div className="w-full sm:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Remarks / Notes</label>
                <textarea value={Remarks} onChange={(e) => setRemarks(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" rows={3}></textarea>
            </div>

            {/* Status */}
            <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                <label className="block text-xs font-bold mb-2">Status</label>
                <select value={Status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required>
                    <option value="">Select Status</option>
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blacklisted">Blacklisted</option>
                </select>
            </div>
        </div>
    );
};

export default FormFields;
