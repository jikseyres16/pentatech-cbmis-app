import React from 'react';

const Sidebar = () => {
  return (
    <div className=" min-h-full bg-base-200 text-base-content">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl">CBMIS</a>
      </div>
      <ul className="menu p-4 w-80 min-h-full bg-base-200 text-base-content">
        {/* Sidebar content here */}
        <li><a href="/dashboard">Dashboard</a></li>
        <li className="menu-title">Input Details</li>
        <li><a href="/blotter">Blotter</a></li>
        <li><a href="/constituents">Constituents Details</a></li>
        <li className="menu-title">Print Documents</li>
        <li><a href="/barangay-clearance">Barangay Clearance</a></li>
        <li><a href="/certificate-of-indigency">Certificate of Indigency</a></li>
      </ul>
    </div>

  );
};

export default Sidebar;