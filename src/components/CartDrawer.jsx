import React from 'react';
import { X, Trash2, ShoppingBag } from 'lucide-react';

export default function CartDrawer({ 
  isOpen, 
  onClose, 
  cartItems, 
  onUpdateQty, 
  onRemoveItem,
  onCheckout
}) {

  // Parse raw price string like "378,250₫" to float number 378250
  const parsePrice = (priceStr) => {
    if (!priceStr) return 0;
    const cleanStr = priceStr.replace(/[^\d]/g, '');
    return parseInt(cleanStr, 10) || 0;
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => {
      const priceNum = parsePrice(item.product.price);
      return total + (priceNum * item.qty);
    }, 0);
  };

  const formatPrice = (value) => {
    return value.toLocaleString('vi-VN') + '₫';
  };

  const handleCheckout = () => {
    if (onCheckout) {
      onCheckout();
    } else {
      alert("Cảm ơn bạn đã đặt hàng! Trực quan hóa việc đặt hàng thành công tại Nexhub Shop.");
    }
  };

  return (
    <>
      {/* Background Overlay */}
      <div 
        className={`cart-overlay ${isOpen ? 'open' : ''}`} 
        onClick={onClose}
      />

      {/* Cart Drawer Container */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>
        <div className="cart-header">
          <h3>Giỏ hàng của bạn</h3>
          <button className="close-btn" onClick={onClose} aria-label="Đóng giỏ hàng">
            <X size={20} />
          </button>
        </div>

        <div className="cart-items">
          {cartItems.length === 0 ? (
            <div className="empty-cart">
              <ShoppingBag size={48} />
              <p>Giỏ hàng đang trống</p>
              <button 
                className="btn-add-cart" 
                style={{ width: 'auto', padding: '10px 20px' }}
                onClick={onClose}
              >
                Tiếp tục mua sắm
              </button>
            </div>
          ) : (
            cartItems.map((item, index) => {
              const priceVal = parsePrice(item.product.price);
              
              return (
                <div key={index} className="cart-item">
                  <img 
                    src={item.product.image} 
                    alt={item.product.title} 
                    className="cart-item-img" 
                    onError={(e) => {
                      e.target.src = "https://cdn.hstatic.net/products/200001108779/no_image.jpg";
                    }}
                  />
                  <div className="cart-item-detail">
                    <h4 className="cart-item-title">{item.product.title}</h4>
                    <p className="cart-item-price">{item.product.price}</p>
                    
                    <div className="cart-item-actions">
                      <div className="cart-item-qty">
                        <button 
                          className="cart-qty-btn"
                          onClick={() => onUpdateQty(item.product.title, item.qty - 1)}
                        >
                          -
                        </button>
                        <input 
                          type="text" 
                          className="cart-qty-input" 
                          value={item.qty} 
                          readOnly 
                        />
                        <button 
                          className="cart-qty-btn"
                          onClick={() => onUpdateQty(item.product.title, item.qty + 1)}
                        >
                          +
                        </button>
                      </div>
                      
                      <button 
                        className="cart-item-remove"
                        onClick={() => onRemoveItem(item.product.title)}
                        aria-label="Xóa sản phẩm"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {cartItems.length > 0 && (
          <div className="cart-footer">
            <div className="cart-total-row">
              <span>Tạm tính:</span>
              <span className="cart-total-price">
                {formatPrice(calculateSubtotal())}
              </span>
            </div>
            <button className="btn-checkout" onClick={handleCheckout}>
              Tiến hành thanh toán
            </button>
          </div>
        )}
      </div>
    </>
  );
}
