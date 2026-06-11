import React, { useState } from 'react';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';

export default function QuickViewModal({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}) {
  const [qty, setQty] = useState(1);

  if (!isOpen || !product) return null;

  const { title, price, old_price, discount, image } = product;

  // Generate dynamic product descriptions based on the item type
  const getDescription = () => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes("bột giặt") || titleLower.includes("nước giặt")) {
      return "Bột giặt / Nước giặt cao cấp công nghệ đậm đặc mới giúp giặt sạch sâu mọi vết bẩn cứng đầu trên quần áo, mang lại hương hoa thơm ngát suốt cả ngày dài. Sản phẩm an toàn, thân thiện với da tay và giữ bền màu sợi vải vượt trội.";
    }
    if (titleLower.includes("chén") || titleLower.includes("rửa chén")) {
      return "Nước rửa chén thế hệ mới đánh bay nhanh chóng mọi vết dầu mỡ cứng đầu, khử mùi tanh hiệu quả với tinh dầu tự nhiên. Công thức dịu nhẹ giúp bảo vệ đôi bàn tay mềm mại của bạn.";
    }
    if (titleLower.includes("sàn") || titleLower.includes("lau sàn")) {
      return "Nước lau sàn đậm đặc giúp bề mặt gạch men, gỗ sáng bóng như mới, diệt vi khuẩn có hại và đuổi côn trùng hiệu quả. Hương thơm nhẹ dịu cho không gian sống trong lành.";
    }
    if (titleLower.includes("chân gà")) {
      return "Snack chân gà ăn liền siêu ngon Gu Trội dai giòn sần sật được tẩm ướp đậm đà theo công thức đặc biệt. Món ăn vặt thơm ngon lý tưởng cho các buổi tụ họp bạn bè, xem phim hoặc dã ngoại.";
    }
    if (titleLower.includes("son") || titleLower.includes("mascara")) {
      return "Mỹ phẩm trang điểm Colorkey cao cấp với chất lượng vượt trội. Lên màu chuẩn sắc nét, chất son mịn mượt che phủ rãnh môi hiệu quả, giữ tone bền đẹp lâu trôi suốt cả ngày.";
    }
    if (titleLower.includes("gia vị") || titleLower.includes("sa tế")) {
      return "Gia vị thượng hạng Ông Chà Và mang lại vị ngon đậm đà truyền thống cho mọi bữa ăn gia đình. Nguyên liệu tuyển chọn tự nhiên, an toàn cho sức khỏe người tiêu dùng.";
    }
    return "Sản phẩm tiêu dùng chất lượng cao cung cấp bởi Nexhub Shop. Cam kết hàng chính hãng 100%, nguồn gốc rõ ràng, giao hàng toàn quốc nhanh chóng và bảo đảm.";
  };

  const handleAddClick = () => {
    onAddToCart(product, qty);
    setQty(1); // reset to 1 after adding
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'open' : ''}`} onClick={onClose}>
      <div className="modal-content fade-in" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close-btn" onClick={onClose} aria-label="Đóng">
          <X size={18} />
        </button>
        
        <div className="modal-left">
          <img 
            src={image} 
            alt={title} 
            className="modal-img" 
            onError={(e) => {
              e.target.src = "https://cdn.hstatic.net/products/200001108779/no_image.jpg";
            }}
          />
        </div>
        
        <div className="modal-right">
          <h2 className="modal-title">{title}</h2>
          <div className="modal-price-row">
            <span className="modal-price-current">{price}</span>
            {old_price && <span className="modal-price-old">{old_price}</span>}
            {discount && <span className="modal-discount">{discount}</span>}
          </div>
          
          <div className="modal-description">
            <p style={{ fontWeight: '600', marginBottom: '8px' }}>Mô tả sản phẩm:</p>
            <p>{getDescription()}</p>
          </div>
          
          <div className="modal-actions">
            <div className="quantity-control">
              <button 
                className="qty-btn" 
                onClick={() => setQty(Math.max(1, qty - 1))}
                aria-label="Giảm"
              >
                <Minus size={14} />
              </button>
              <input 
                type="text" 
                className="qty-input" 
                value={qty} 
                readOnly 
              />
              <button 
                className="qty-btn" 
                onClick={() => setQty(qty + 1)}
                aria-label="Tăng"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button className="btn-add-cart" onClick={handleAddClick}>
              <ShoppingCart size={16} style={{ marginRight: '8px', verticalAlign: 'middle' }} />
              Thêm vào giỏ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
