import React from "react";

interface UserFieldsProps {
    Firstname: string;
    setFirstname: (value: string) => void;
    Lastname: string;
    setLastname: (value: string) => void;
    Email: string;
    setEmail: (value: string) => void;
    Location: string;
    setLocation: (value: string) => void;
    userName: string;
    setuserName: (value: string) => void;
    Password: string;
    setPassword: (value: string) => void;
    Role: string;
    setRole: (value: string) => void;
    editPost?: any;
}

const UserFields: React.FC<UserFieldsProps> = ({
    Firstname, setFirstname,
    Lastname, setLastname,
    Email, setEmail,
    Location, setLocation,
    userName, setuserName,
    Password, setPassword,
    Role, setRole,
    editPost,
}) => {

    return (
        <>
            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Firstname">Firstname</label>
                    <input type="text" id="Firstname" value={Firstname} onChange={(e) => setFirstname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Lastname">Lastname</label>
                    <input type="text" id="Lastname" value={Lastname} onChange={(e) => setLastname(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="email">Email</label>
                    <input type="email" id="Email" value={Email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="userName">Username</label>
                    <input type="text" id="userName" value={userName} onChange={(e) => setuserName(e.target.value)} className="w-full px-3 py-2 border rounded text-xs capitalize" required />
                </div>
            </div>

            <div className="flex flex-wrap -mx-4">
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Password">Password</label>
                    <input type="password" id="Password" value={Password} onChange={(e) => setPassword(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required />
                </div>
                <div className="w-full sm:w-1/2 md:w-1/2 px-4 mb-4">
                    <label className="block text-xs font-bold mb-2" htmlFor="Role">Role</label>
                    <select id="Role" value={Role || ""} onChange={(e) => setRole(e.target.value)} className="w-full px-3 py-2 border rounded text-xs" required >
                        <option>Select Role</option>
                        <option value="Admin">Admin</option>
                        <option value="Inventory Manager">Inventory Manager</option>
                        <option value="Sales Staff">Sales Staff</option>
                        <option value="Warehouse Staff">Warehouse Staff</option>
                        <option value="Auditor">Auditor</option>
                        <option value="Purchasing Officer">Purchasing Officer</option>
                        <option value="Support Staff">Support Staff</option>
                    </select>
                </div>
            </div>
        </>
    )

}

export default UserFields;