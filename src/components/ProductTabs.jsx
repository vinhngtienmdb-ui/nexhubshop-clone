import React from 'react';

export default function ProductTabs({ activeTab, onTabChange }) {
  const tabs = [
    { label: "Tất cả", filter: "all" },
    { label: "Sản phẩm Lix", filter: "Lix" },
    { label: "Sản phẩm On1", filter: "On1" },
    { label: "Thực phẩm Ông Chà Và", filter: "Ông Chà Và" },
    { label: "Snack & Rong Biển", filter: "Rong biển Okenki" },
    { label: "Son Colorkey", filter: "Colorkey" }
  ];

  return (
    <div className="tabs-container">
      {tabs.map((tab, index) => (
        <button
          key={index}
          className={`tab-btn ${activeTab === tab.filter ? 'active' : ''}`}
          onClick={() => onTabChange(tab.filter)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
