import React from 'react';
import Navbar from '../navbar/Navbar';

export default function MainLayout({ children }) {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Navbar />
      <main className=" bg-gray-900">
        {children}
      </main>
    </div>
  );
}
