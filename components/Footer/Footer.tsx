// Footer.tsx
import React from "react";

const Footer: React.FC = () => {
  return (
    <footer className="fixed bottom-0 left-0 w-full bg-green-700 text-white font-bold py-4">
      <div className="container mx-auto text-center text-xs">
        <p>&copy; {new Date().getFullYear()} PH-Devtech Solutions | Inventory Management System </p>
      </div>
    </footer>
  );
};

export default Footer;
