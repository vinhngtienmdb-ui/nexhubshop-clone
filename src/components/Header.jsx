import React from 'react';
import { Phone, Mail, Search, User, ShoppingBag } from 'lucide-react';

export default function Header({ 
  cartCount, 
  onOpenCart, 
  searchTerm, 
  onSearchChange,
  activeTab,
  onTabChange
}) {
  const menuItems = [
    { text: "Trang chủ", filter: "all" },
    { text: "Lix", filter: "Lix" },
    { text: "On1", filter: "On1" },
    { text: "Lof", filter: "Lof" },
    { text: "Colorkey", filter: "Colorkey" },
    { text: "Ông Chà Và", filter: "Ông Chà Và" },
    { text: "Rong biển Okenki", filter: "Rong biển Okenki" },
    { text: "Mì Spaghetti Pavoni", filter: "Mì Spaghetti Pavoni" }
  ];

  return (
    <header className="header-wrapper">
      {/* Topbar */}
      <div className="topbar">
        <div className="container topbar-content">
          <div className="topbar-left">
            <a href="tel:0914385050" className="topbar-item">
              <Phone size={14} />
              <span>0914.385.050</span>
            </a>
            <a href="mailto:commerce@nexhub.vn" className="topbar-item">
              <Mail size={14} />
              <span>commerce@nexhub.vn</span>
            </a>
          </div>
          <div className="topbar-right">
            <span>Mua sắm thông minh, càng ghép càng lời!</span>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="main-header">
        <div className="container header-container">
          {/* Logo */}
          <a href="/" className="logo" onClick={(e) => { e.preventDefault(); onTabChange("all"); }}>
            <img src="/images/categories/logo.png" alt="Nexhub Shop Logo" onError={(e) => {
              // fallback if logo download fails or path is different
              e.target.src = "https://cdn.hstatic.net/themes/200001108779/1001433049/14/logo.png?v=499";
            }} />
          </a>

          {/* Search */}
          <div className="search-box">
            <input 
              type="text" 
              className="search-input" 
              placeholder="Tìm kiếm sản phẩm..." 
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
            />
            <button className="search-btn" aria-label="Tìm kiếm">
              <Search size={18} />
            </button>
          </div>

          {/* Actions */}
          <div className="header-actions">
            <a href="#account" className="header-action-btn" onClick={(e) => e.preventDefault()}>
              <User size={20} />
              <span className="d-none d-lg-block">Tài khoản</span>
            </a>
            <button className="header-action-btn" onClick={onOpenCart} aria-label="Giỏ hàng">
              <ShoppingBag size={20} />
              <span className="d-none d-lg-block">Giỏ hàng</span>
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="main-nav d-none d-lg-block">
        <div className="container">
          <ul className="nav-list">
            {menuItems.map((item, index) => (
              <li key={index}>
                <a 
                  href={`#${item.filter}`} 
                  className={`nav-link ${activeTab === item.filter ? 'active' : ''}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onTabChange(item.filter);
                  }}
                >
                  {item.text}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </nav>
    </header>
  );
}
