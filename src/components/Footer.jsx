import React from 'react';
import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="main-footer">
      {/* Upper Footer */}
      <div className="footer-top">
        <div className="container footer-grid">
          {/* Column 1: Contact info */}
          <div className="footer-col">
            <h3>Công ty Cổ phần Nexhub</h3>
            <p><strong>Mã số doanh nghiệp:</strong> 0317823456 do Sở KH&ĐT TP.HCM cấp ngày 15/05/2023</p>
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', marginTop: '15px' }}>
              <MapPin size={18} style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>
                <strong>Trụ sở chính:</strong> C14 Đường Phú Thuận, KDC Nam Long, Phường Phú Thuận, Quận 7, Thành phố Hồ Chí Minh, Việt Nam.
              </span>
            </p>
            <p style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
              <MapPin size={18} style={{ flexShrink: 0, marginTop: '3px' }} />
              <span>
                <strong>Văn phòng đại diện:</strong> 602/45E Điện Biên Phủ, Phường 22, Quận Bình Thạnh, TP. Hồ Chí Minh.
              </span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Phone size={16} />
              <span><strong>Hotline:</strong> 0914.385.050 (8:00 - 17:00)</span>
            </p>
            <p style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Mail size={16} />
              <span><strong>Email:</strong> commerce@nexhub.vn</span>
            </p>
          </div>

          {/* Column 2: Support Links */}
          <div className="footer-col">
            <h3>Hỗ trợ khách hàng</h3>
            <ul className="footer-links">
              <li><a href="#rules" onClick={(e) => e.preventDefault()}>Quy chế hoạt động</a></li>
              <li><a href="#delivery" onClick={(e) => e.preventDefault()}>Chính sách giao hàng</a></li>
              <li><a href="#payment" onClick={(e) => e.preventDefault()}>Phương thức thanh toán</a></li>
              <li><a href="#returns" onClick={(e) => e.preventDefault()}>Chính sách đổi trả & hoàn tiền</a></li>
              <li><a href="#privacy" onClick={(e) => e.preventDefault()}>Chính sách bảo mật thông tin</a></li>
            </ul>
          </div>

          {/* Column 3: Corporate Info */}
          <div className="footer-col">
            <h3>Về chúng tôi</h3>
            <ul className="footer-links">
              <li><a href="#intro" onClick={(e) => e.preventDefault()}>Giới thiệu Nexhub Shop</a></li>
              <li><a href="#stores" onClick={(e) => e.preventDefault()}>Hệ thống cửa hàng liên kết</a></li>
              <li><a href="#contact" onClick={(e) => e.preventDefault()}>Liên hệ hợp tác</a></li>
              <li><a href="#career" onClick={(e) => e.preventDefault()}>Cơ hội nghề nghiệp</a></li>
            </ul>
            <div style={{ marginTop: '20px' }}>
              <img 
                src="https://file.hstatic.net/1000308580/file/bocongthuong_5a59330a473144a1936a2df8af361e6c.png" 
                alt="Đã thông báo Bộ Công Thương" 
                style={{ height: '40px', objectFit: 'contain' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="footer-bottom">
        <div className="container">
          <p>© 2026 Nexhub Shop. Thiết kế và nhân bản bởi Antigravity. Bản quyền thuộc về Công ty Cổ phần Nexhub.</p>
        </div>
      </div>
    </footer>
  );
}
