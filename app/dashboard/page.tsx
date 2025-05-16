'use client';

import React, { useState, useEffect } from 'react';
import ParentLayout from '../../components/Layouts/ParentLayout';
import SessionChecker from '../../components/Session/SessionChecker';
import UserFetcher from '../../components/UserFetcher/UserFetcher';

const DashboardPage: React.FC = () => {
  const [totalItemsCount, setTotalItemsCount] = useState(0);
  const [lowStockCount, setLowStockCount] = useState(0);
  const [outOfStockCount, setOutOfStockCount] = useState(0);
  
  // Fetch Count Stocks
  useEffect(() => {
    const fetchInventoryData = async () => {
      try {
        const response = await fetch('/api/Inventory/FetchData');
        const data = await response.json();

        if (Array.isArray(data)) {
          let totalCount = 0;
          let lowStockCount = 0;
          let outOfStockCount = 0;

          data.forEach((item: any) => {
            const status = item.ProductStatus;
            // Convert ProductQuantity from string to number safely
            const quantity = Number(item.ProductQuantity) || 0;

            if (status === 'Available') totalCount += quantity;
            else if (status === 'Low-Stock') lowStockCount += quantity;
            else if (status === 'No-Stock') outOfStockCount += quantity;
          });

          setTotalItemsCount(totalCount);
          setLowStockCount(lowStockCount);
          setOutOfStockCount(outOfStockCount);
        }
      } catch (error) {
        console.error('Failed to fetch inventory data:', error);
      }
    };

    fetchInventoryData();
  }, []);

  // Maximum height of the chart container in pixels (h-48 = 12rem = 192px)
  const maxHeightPx = 192;
  // Get max count to scale bars proportionally
  const maxCount = Math.max(totalItemsCount, lowStockCount, outOfStockCount, 1);
  // Scale factor: pixels per unit count
  const scaleFactor = maxHeightPx / maxCount;

  return (
    <SessionChecker>
      <ParentLayout>
        <UserFetcher>
          {(user) => (
            <div className="container mx-auto p-4">
              {/* Inventory Summary */}
              <div className="mb-4">
                <h3 className="text-md font-semibold mb-6">📊 Inventory Summary</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mb-8">
                  <div className="bg-white shadow-md rounded-md p-4">
                    <h4 className="text-xs text-gray-500">Total Items in Stock</h4>
                    <p className="text-3xl font-bold text-green-600">{totalItemsCount}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-md p-4">
                    <h4 className="text-xs text-gray-500">Low-Stock Items</h4>
                    <p className="text-3xl font-bold text-yellow-500">{lowStockCount}</p>
                  </div>

                  <div className="bg-white shadow-md rounded-md p-4">
                    <h4 className="text-xs text-gray-500">Out-of-Stock Items</h4>
                    <p className="text-3xl font-bold text-red-500">{outOfStockCount}</p>
                  </div>
                </div>

                {/* Bar Chart */}
                <div>
                  <h4 className="text-md font-semibold mb-4">📉 Stock Overview Chart</h4>
                  <div className="flex items-end justify-center space-x-8 h-auto shadow-lg rounded-md p-4">
                    {/* Total */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-green-700 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${totalItemsCount * scaleFactor}px`, minHeight: '10px', maxHeight: '500px' }}
                        title={`Total Items: ${totalItemsCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-green-700">Total</span>
                      <span className="text-sm font-bold text-green-700">{totalItemsCount}</span>
                    </div>

                    {/* Low Stock */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-yellow-400 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${lowStockCount * scaleFactor}px`, minHeight: '30px', maxHeight: '500px' }}
                        title={`Low-Stock Items: ${lowStockCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-yellow-600">Low</span>
                      <span className="text-sm font-bold text-yellow-600">{lowStockCount}</span>
                    </div>

                    {/* Out of Stock */}
                    <div className="flex flex-col items-center justify-end">
                      <div
                        className="bg-red-500 w-12 rounded-t-md transition-all duration-500"
                        style={{ height: `${outOfStockCount * scaleFactor}px`, minHeight: '2px', maxHeight: '500px' }}
                        title={`Out-of-Stock Items: ${outOfStockCount}`}
                      />
                      <span className="text-xs mt-2 font-medium text-red-700">Out</span>
                      <span className="text-sm font-bold text-red-700">{outOfStockCount}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          )}
        </UserFetcher>
      </ParentLayout>
    </SessionChecker>
  );
};

export default DashboardPage;