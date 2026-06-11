import React from 'react';
import { Eye, Plus, Minus } from 'lucide-react';

export default function ProductCard({ 
  product, 
  cartItem, 
  onAddToCart, 
  onUpdateCartQty,
  onOpenQuickView 
}) {
  const { title, price, old_price, discount, image, vendor } = product;

  // Extract numeric vendor from title if not provided (e.g. Lix, On1, Colorkey)
  const getVendorName = () => {
    if (vendor) return vendor;
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("lix")) return "Lix";
    if (lowerTitle.includes("on1")) return "On1";
    if (lowerTitle.includes("colorkey")) return "Colorkey";
    if (lowerTitle.includes("ông chà và")) return "Ông Chà Và";
    if (lowerTitle.includes("okenki")) return "Okenki";
    if (lowerTitle.includes("spaghetti") || lowerTitle.includes("pavoni")) return "Pavoni";
    if (lowerTitle.includes("lof")) return "Lof";
    return "Nexhub";
  };

  return (
    <div className="product-card">
      {discount && <div className="product-discount">{discount}</div>}
      
      <div className="product-img-container" onClick={() => onOpenQuickView(product)}>
        <img 
          src={image} 
          alt={title} 
          className="product-img" 
          onError={(e) => {
            e.target.src = "https://cdn.hstatic.net/products/200001108779/no_image.jpg";
          }}
        />
      </div>

      <button 
        className="quickview-overlay-btn" 
        onClick={() => onOpenQuickView(product)}
        title="Xem nhanh"
        aria-label="Xem nhanh"
      >
        <Eye size={16} />
      </button>

      <div className="product-vendor">{getVendorName()}</div>
      
      <h3 className="product-title" onClick={() => onOpenQuickView(product)}>
        <a href="#quickview" onClick={(e) => e.preventDefault()}>
          {title}
        </a>
      </h3>

      <div className="product-price-row">
        <span className="price-current">{price}</span>
        {old_price && <span className="price-old">{old_price}</span>}
      </div>

      <div className="product-actions">
        {cartItem ? (
          <div className="quantity-control">
            <button 
              className="qty-btn" 
              onClick={() => onUpdateCartQty(product.title, cartItem.qty - 1)}
              aria-label="Giảm số lượng"
            >
              <Minus size={14} />
            </button>
            <input 
              type="text" 
              className="qty-input" 
              value={cartItem.qty} 
              readOnly 
            />
            <button 
              className="qty-btn" 
              onClick={() => onUpdateCartQty(product.title, cartItem.qty + 1)}
              aria-label="Tăng số lượng"
            >
              <Plus size={14} />
            </button>
          </div>
        ) : (
          <button 
            className="btn-add-cart" 
            onClick={() => onAddToCart(product)}
          >
            Thêm vào giỏ
          </button>
        )}
      </div>
    </div>
  );
}
