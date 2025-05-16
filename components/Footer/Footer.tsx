// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="bg-green-600 text-white font-bold py-4 w-full">
      <div className="container mx-auto text-center text-xs">
        <p>&copy; {new Date().getFullYear()} PH-Devtech Solutions | Inventory Management System </p>
      </div>
    </footer>
  );
};

export default Footer;
