import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CategoryGrid from './components/CategoryGrid';
import ProductTabs from './components/ProductTabs';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import extractedData from './data/extracted_products.json';
import { supabase } from './lib/supabase';

// B2B Supplier Hub Component (Upgraded Phase 6)
function B2bSupplierHub() {
  const [activeTab, setActiveTab] = useState('rfqs'); // 'rfqs', 'negotiation', 'scorecard'
  const [rfqs, setRfqs] = useState([]);
  const [quotes, setQuotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedRfq, setSelectedRfq] = useState(null);
  
  // Form states
  const [supplierName, setSupplierName] = useState('Công ty Dược Mỹ Phẩm Lix');
  const [priceOffer, setPriceOffer] = useState('');
  const [quantityOffer, setQuantityOffer] = useState('');
  const [deliveryDate, setDeliveryDate] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Negotiation states
  const [selectedChatRfq, setSelectedChatRfq] = useState(null);
  const [chatMessages, setChatMessages] = useState({
    "RFQ-2026-001": [
      { id: 1, sender: 'procurement', text: 'Chào quý đối tác Lix, chúng tôi đang cần gấp mặt hàng Combo 2 Túi 5,5Kg Bột Giặt Lix Đậm Đặc với số lượng 500 túi. Mức giá mục tiêu tối đa của chúng tôi là 350.000₫.', time: '09:00' },
      { id: 2, sender: 'supplier', text: 'Chào ban mua hàng VComm, chúng tôi có thể cung cấp đủ số lượng này nhưng với đơn giá đề xuất 360.000₫/túi vì chi phí vận chuyển tăng.', time: '09:30' },
      { id: 3, sender: 'procurement', text: 'Mức giá 360.000₫ hơi vượt ngân sách dự kiến của chúng tôi. Nếu đối tác đồng ý giảm xuống 352.000₫, chúng tôi sẽ duyệt ngay lập tức.', time: '10:00' },
    ],
    "RFQ-2026-002": [
      { id: 1, sender: 'procurement', text: 'Chào đối tác, chúng tôi cần nhập 1.000 gói Chân Gà Ăn Liền Gu Trội để kịp bán lẻ tuần tới. Mức giá trần là 95.000₫/cái.', time: '08:30' },
      { id: 2, sender: 'supplier', text: 'Chào ban mua hàng, chúng tôi có sẵn hàng và có thể đáp ứng giao hàng trước ngày 25/06/2026.', time: '08:45' }
    ]
  });
  const [newMessageText, setNewMessageText] = useState('');
  const [proposedPrice, setProposedPrice] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const fetchRfqs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/b2b/rfqs');
      const data = await res.json();
      if (data.success) {
        setRfqs(data.rfqs);
        
        // Auto-select first RFQ for chat if none is selected
        if (data.rfqs.length > 0 && !selectedChatRfq) {
          setSelectedChatRfq(data.rfqs[0]);
        }

        // Initialize chat history for any RFQs missing it
        data.rfqs.forEach(rfq => {
          if (!chatMessages[rfq.id]) {
            setChatMessages(prev => ({
              ...prev,
              [rfq.id]: [
                {
                  id: Date.now(),
                  sender: 'procurement',
                  text: `Chào đối tác, hệ thống SCM ERP vừa gửi yêu cầu báo giá tự động cho sản phẩm: ${rfq.productName}. Số lượng cần: ${rfq.quantityNeeded.toLocaleString()} sản phẩm. Hạn chót: ${rfq.deadline}. Vui lòng đàm phán hoặc gửi báo giá chính thức.`,
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                }
              ]
            }));
          }
        });
      }
    } catch (e) {
      console.error("Error loading RFQs:", e);
    } finally {
      setLoading(false);
    }
  };

  const fetchQuotes = async () => {
    try {
      const res = await fetch('/api/b2b/quotes');
      const data = await res.json();
      if (data.success) {
        setQuotes(data.quotes);
      }
    } catch (e) {
      console.error("Error loading quotes:", e);
    }
  };

  useEffect(() => {
    fetchRfqs();
    fetchQuotes();
  }, []);

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!selectedRfq) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/b2b/quotes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rfqId: selectedRfq.id,
          supplierName,
          priceOffer: Number(priceOffer),
          quantityOffer: Number(quantityOffer),
          deliveryDate
        })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
        setSelectedRfq(null);
        setPriceOffer('');
        setQuantityOffer('');
        setDeliveryDate('');
        fetchQuotes();
      } else {
        alert(data.error || "Gửi báo giá thất bại.");
      }
    } catch (err) {
      console.error(err);
      alert("Đã xảy ra lỗi khi gửi báo giá.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleSendMessage = () => {
    if (!selectedChatRfq) return;
    if (!newMessageText.trim() && !proposedPrice) return;

    const rfqId = selectedChatRfq.id;
    const timeNow = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    let text = newMessageText.trim();
    if (proposedPrice) {
      text += ` [Đề xuất giá mới: ${Number(proposedPrice).toLocaleString('vi-VN')}₫/cái]`;
    }

    const supplierMsg = {
      id: Date.now(),
      sender: 'supplier',
      text: text,
      time: timeNow
    };

    setChatMessages(prev => ({
      ...prev,
      [rfqId]: [...(prev[rfqId] || []), supplierMsg]
    }));

    setNewMessageText('');
    setProposedPrice('');

    // Trigger AI response simulation
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      
      let aiText = `Đại diện VComm Procurement: Chúng tôi đã nhận được phản hồi từ quý đối tác Lix.`;
      if (proposedPrice) {
        const priceNum = Number(proposedPrice);
        if (priceNum <= selectedChatRfq.targetPrice) {
          aiText += ` Tuyệt vời! Mức đề xuất ${priceNum.toLocaleString('vi-VN')}₫/cái nằm trong ngân sách cho phép (Dưới giá mục tiêu tối đa ${selectedChatRfq.targetPrice.toLocaleString('vi-VN')}₫). Quý đối tác hãy nộp báo giá chính thức trên tab 'Báo giá RFQ' để hệ thống tự động ghi nhận và ký số HSM khóa sổ giao dịch.`;
        } else {
          const discountPct = Math.round(((priceNum - selectedChatRfq.targetPrice) / selectedChatRfq.targetPrice) * 100);
          aiText += ` Mức giá đề xuất ${priceNum.toLocaleString('vi-VN')}₫/cái vẫn cao hơn giá trần mục tiêu ${selectedChatRfq.targetPrice.toLocaleString('vi-VN')}₫ khoảng ${discountPct}%. Quý đối tác có thể xem xét giảm thêm hoặc hỗ trợ miễn phí vận chuyển cho đơn hàng này không?`;
        }
      } else {
        aiText += ` Chúng tôi sẽ thảo luận nội bộ với bộ phận SCM và phản hồi sớm nhất về đề xuất này.`;
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: 'procurement',
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setChatMessages(prev => ({
        ...prev,
        [rfqId]: [...(prev[rfqId] || []), aiMsg]
      }));
    }, 1500);
  };

  return (
    <section className="supplier-hub-section" style={{ padding: '50px 0', background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)', borderBottom: '1px solid #e2e8f0' }}>
      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
      `}</style>
      <div className="container" style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 15px' }}>
        {/* Header Title with premium badge */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px', flexWrap: 'wrap', gap: '15px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '28px', background: 'linear-gradient(135deg, #ee4d2d 0%, #ff7337 100%)', padding: '8px', borderRadius: '12px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 10px rgb(238 77 45 / 0.3)' }}>🤝</span>
            <div>
              <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', margin: 0 }}>
                Cổng thông tin Đối tác B2B (Supplier Hub)
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '4px 0 0 0' }}>Tự động hóa chuỗi cung ứng SCM & Đàm phán trực tuyến</p>
            </div>
          </div>

          {/* Premium tabs */}
          <div style={{ display: 'flex', background: '#e2e8f0', padding: '4px', borderRadius: '10px' }}>
            <button
              onClick={() => setActiveTab('rfqs')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'rfqs' ? 'white' : 'transparent',
                color: activeTab === 'rfqs' ? '#0f172a' : '#475569',
                fontWeight: activeTab === 'rfqs' ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'rfqs' ? '0 2px 4px rgb(0 0 0 / 0.05)' : 'none'
              }}
            >
              📋 Báo giá RFQ
            </button>
            <button
              onClick={() => setActiveTab('negotiation')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'negotiation' ? 'white' : 'transparent',
                color: activeTab === 'negotiation' ? '#0f172a' : '#475569',
                fontWeight: activeTab === 'negotiation' ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'negotiation' ? '0 2px 4px rgb(0 0 0 / 0.05)' : 'none'
              }}
            >
              💬 Đàm phán B2B
            </button>
            <button
              onClick={() => setActiveTab('scorecard')}
              style={{
                padding: '8px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === 'scorecard' ? 'white' : 'transparent',
                color: activeTab === 'scorecard' ? '#0f172a' : '#475569',
                fontWeight: activeTab === 'scorecard' ? '700' : '500',
                fontSize: '13px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                boxShadow: activeTab === 'scorecard' ? '0 2px 4px rgb(0 0 0 / 0.05)' : 'none'
              }}
            >
              📊 Bảng điểm KPI
            </button>
          </div>
        </div>

        {/* Tab content area */}
        <div style={{ background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.05)', padding: '24px', minHeight: '400px' }}>
          
          {/* TAB 1: RFQ LIST & SUBMISSION */}
          {activeTab === 'rfqs' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Yêu cầu báo giá đang chờ</h3>
                <span className="badge" style={{ background: '#fef3c7', color: '#d97706', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                  Auto-SCM Sync: Active
                </span>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#64748b' }}>
                  <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #ee4d2d', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', marginBottom: '10px' }} />
                  <div>Đang tải yêu cầu báo giá...</div>
                </div>
              ) : rfqs.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8', fontStyle: 'italic' }}>Không có yêu cầu báo giá nào đang chờ.</div>
              ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '20px' }}>
                  {rfqs.map((rfq) => {
                    const submittedQuote = quotes.find(q => q.rfqId === rfq.id);
                    return (
                      <div key={rfq.id} style={{ background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '20px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', transition: 'transform 0.2s', cursor: 'pointer' }} onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'} onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ fontWeight: '700', color: '#ee4d2d', fontSize: '14px' }}>{rfq.id}</span>
                            <span style={{
                              background: rfq.status === 'Chờ báo giá' ? '#fef3c7' : '#dcfce7',
                              color: rfq.status === 'Chờ báo giá' ? '#b45309' : '#15803d',
                              fontSize: '11px', padding: '2px 8px', borderRadius: '4px', fontWeight: '600'
                            }}>
                              {rfq.status}
                            </span>
                          </div>
                          <h4 style={{ fontSize: '15px', fontWeight: '600', color: '#0f172a', marginBottom: '14px', lineHeight: '1.4' }}>
                            {rfq.productName}
                          </h4>
                          <div style={{ fontSize: '13px', color: '#475569', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Mã sản phẩm (SKU):</span>
                              <strong style={{ color: '#334155' }}>{rfq.sku}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Số lượng yêu cầu:</span>
                              <strong style={{ color: '#334155' }}>{rfq.quantityNeeded.toLocaleString('vi-VN')}</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Giá mục tiêu tối đa:</span>
                              <strong style={{ color: '#16a34a' }}>{rfq.targetPrice.toLocaleString('vi-VN')}₫/cái</strong>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                              <span>Hạn nộp báo giá:</span>
                              <strong style={{ color: '#dc2626' }}>{rfq.deadline}</strong>
                            </div>
                          </div>
                        </div>

                        {submittedQuote ? (
                          <div style={{ marginTop: '20px', padding: '12px', background: '#dcfce7', borderRadius: '8px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                            <span style={{ fontSize: '13px', fontWeight: '700', color: '#15803d', display: 'block' }}>✓ Đã báo giá</span>
                            <span style={{ fontSize: '11px', color: '#166534', display: 'block', marginTop: '2px' }}>
                              {submittedQuote.priceOffer.toLocaleString('vi-VN')}₫ - {submittedQuote.status}
                            </span>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => setSelectedRfq(rfq)}
                            style={{
                              marginTop: '20px',
                              width: '100%',
                              background: '#1e293b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '8px',
                              padding: '10px 0',
                              fontSize: '14px',
                              fontWeight: '600',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                          >
                            Nộp Báo Giá B2B
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 2: LIVE NEGOTIATION CHAT */}
          {activeTab === 'negotiation' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '20px', height: '480px' }}>
                {/* Left panel: RFQ selector */}
                <div style={{ borderRight: '1px solid #e2e8f0', paddingRight: '20px', display: 'flex', flexDirection: 'column', gap: '10px', overflowY: 'auto' }}>
                  <h4 style={{ fontSize: '14px', fontWeight: '700', color: '#475569', marginBottom: '8px', textTransform: 'uppercase' }}>Danh sách đàm phán</h4>
                  {rfqs.map(rfq => (
                    <div
                      key={rfq.id}
                      onClick={() => setSelectedChatRfq(rfq)}
                      style={{
                        padding: '12px',
                        borderRadius: '8px',
                        border: selectedChatRfq?.id === rfq.id ? '2px solid #ee4d2d' : '1px solid #cbd5e1',
                        background: selectedChatRfq?.id === rfq.id ? '#fff5f2' : 'white',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                        <span style={{ fontWeight: '700', fontSize: '13px', color: '#1e293b' }}>{rfq.id}</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Trần: {rfq.targetPrice.toLocaleString('vi-VN')}₫</span>
                      </div>
                      <div style={{ fontSize: '12px', fontWeight: '500', color: '#475569', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {rfq.productName}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right panel: Chat messages */}
                {selectedChatRfq ? (
                  <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                    {/* Chat Header */}
                    <div style={{ paddingBottom: '12px', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Đàm phán cho {selectedChatRfq.id}</h4>
                        <span style={{ fontSize: '12px', color: '#64748b' }}>{selectedChatRfq.productName}</span>
                      </div>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '11px', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>
                        ERP Buyer: Online
                      </span>
                    </div>

                    {/* Chat History */}
                    <div style={{ flexGrow: 1, overflowY: 'auto', padding: '16px 0', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {(chatMessages[selectedChatRfq.id] || []).map(msg => (
                        <div key={msg.id} style={{
                          display: 'flex',
                          justifyContent: msg.sender === 'supplier' ? 'flex-end' : 'flex-start',
                          width: '100%'
                        }}>
                          <div style={{
                            maxWidth: '70%',
                            background: msg.sender === 'supplier' ? '#ee4d2d' : '#f1f5f9',
                            color: msg.sender === 'supplier' ? 'white' : '#0f172a',
                            padding: '12px 16px',
                            borderRadius: msg.sender === 'supplier' ? '16px 16px 2px 16px' : '16px 16px 16px 2px',
                            boxShadow: '0 1px 2px rgb(0 0 0 / 0.05)'
                          }}>
                            <div style={{ fontSize: '13px', lineHeight: '1.4', wordBreak: 'break-word' }}>
                              {msg.text}
                            </div>
                            <span style={{ fontSize: '9px', opacity: 0.7, float: 'right', marginTop: '6px' }}>{msg.time}</span>
                          </div>
                        </div>
                      ))}
                      {isTyping && (
                        <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                          <div style={{ background: '#f1f5f9', padding: '12px 16px', borderRadius: '16px', display: 'flex', gap: '4px', alignItems: 'center' }}>
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out' }} />
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.2s' }} />
                            <span style={{ width: '6px', height: '6px', background: '#94a3b8', borderRadius: '50%', animation: 'bounce 1.4s infinite ease-in-out 0.4s' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Chat Input panel */}
                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <div style={{ flexGrow: 1, display: 'flex', border: '1px solid #cbd5e1', borderRadius: '8px', padding: '4px 8px', background: '#f8fafc', alignItems: 'center' }}>
                          <span style={{ fontSize: '12px', color: '#64748b', fontWeight: 'bold', marginRight: '6px' }}>Đơn giá mới:</span>
                          <input
                            type="number"
                            placeholder="₫/cái"
                            value={proposedPrice}
                            onChange={(e) => setProposedPrice(e.target.value)}
                            style={{ border: 'none', background: 'transparent', width: '120px', outline: 'none', fontSize: '13px', color: '#0f172a' }}
                          />
                        </div>
                        <span style={{ alignSelf: 'center', fontSize: '12px', color: '#94a3b8' }}>(Tùy chọn đính kèm giá mới)</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          placeholder="Nhập tin nhắn đàm phán giá hoặc giao vận..."
                          value={newMessageText}
                          onChange={(e) => setNewMessageText(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                          style={{ flexGrow: 1, padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', outline: 'none' }}
                        />
                        <button
                          onClick={handleSendMessage}
                          style={{
                            background: '#ee4d2d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            padding: '0 20px',
                            fontWeight: 'bold',
                            fontSize: '13px',
                            cursor: 'pointer'
                          }}
                        >
                          Gửi
                        </button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#94a3b8', fontStyle: 'italic' }}>
                    Chọn một yêu cầu báo giá để bắt đầu đàm phán thương lượng.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: KPI SCORECARD */}
          {activeTab === 'scorecard' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '350px 1fr', gap: '30px' }}>
                {/* Left card: General Info */}
                <div style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', borderRadius: '16px', padding: '30px', color: 'white', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <span style={{ fontSize: '12px', background: '#ee4d2d', padding: '4px 10px', borderRadius: '12px', fontWeight: 'bold' }}>NHÀ CUNG CẤP VÀNG</span>
                      <span style={{ fontSize: '20px' }}>🌟</span>
                    </div>
                    <h4 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '4px' }}>Công ty Dược Mỹ Phẩm Lix</h4>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>Mã đối tác: SUP-001</p>
                  </div>

                  <div style={{ margin: '40px 0', textAlign: 'center' }}>
                    <div style={{ fontSize: '48px', fontWeight: '800', color: '#ee4d2d', lineHeight: 1 }}>96.8</div>
                    <div style={{ fontSize: '13px', color: '#94a3b8', marginTop: '6px' }}>Điểm Hiệu Suất Tổng Hợp (Q2/2026)</div>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '12px', fontSize: '12px', lineHeight: '1.4', color: '#cbd5e1' }}>
                    <strong>Đánh giá AI SCM:</strong> Đối tác có năng lực cung ứng cao. Tỷ lệ lỗi cực thấp đạt 0.35%. Khuyến nghị tự động giao quyền ưu tiên nhận RFQ tự động của hệ thống ERP.
                  </div>
                </div>

                {/* Right: Detail KPIs */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Chỉ số Hiệu suất Chi tiết (KPIs)</h3>
                  
                  {/* KPI 1 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <strong style={{ color: '#334155' }}>Tỷ lệ giao hàng đúng hạn (On-Time Delivery Rate)</strong>
                      <span style={{ fontWeight: 'bold', color: '#16a34a' }}>97.8% <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Mục tiêu: &gt;95%)</span></span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '97.8%', height: '100%', background: '#16a34a', borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <strong style={{ color: '#334155' }}>Tỷ lệ sản phẩm lỗi (Quality Defect Rate)</strong>
                      <span style={{ fontWeight: 'bold', color: '#16a34a' }}>0.35% <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Mục tiêu: &lt;1.0%)</span></span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '96.5%', height: '100%', background: '#16a34a', borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <strong style={{ color: '#334155' }}>Tính cạnh tranh về giá (Price Index Competitiveness)</strong>
                      <span style={{ fontWeight: 'bold', color: '#0284c7' }}>94.2% <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Mục tiêu: &gt;90%)</span></span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '94.2%', height: '100%', background: '#0284c7', borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '13px' }}>
                      <strong style={{ color: '#334155' }}>Thời gian phản hồi RFQ (RFQ Response Speed)</strong>
                      <span style={{ fontWeight: 'bold', color: '#16a34a' }}>96.0% <span style={{ fontWeight: 'normal', color: '#64748b' }}>(Mục tiêu: &gt;90%)</span></span>
                    </div>
                    <div style={{ height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                      <div style={{ width: '96.0%', height: '100%', background: '#16a34a', borderRadius: '4px' }} />
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span style={{ fontSize: '18px' }}>🚀</span>
                      <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#166534' }}>Ưu đãi đối tác Vàng:</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#14532d', margin: '6px 0 0 0', lineHeight: '1.5' }}>
                      Lix đang có quyền truy cập sớm vào các đơn hàng lớn. Giảm 50% thời gian khóa thanh toán kế toán trên ERP nhờ tích hợp luồng ký số tự động hóa. Hãy duy trì hiệu năng tốt để tiếp tục nhận các lợi thế từ chuỗi liên kết.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Quote Submission Modal */}
      {selectedRfq && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '15px' }}>
          <div style={{ background: 'white', borderRadius: '16px', maxWidth: '500px', width: '100%', padding: '30px', boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)', position: 'relative' }}>
            <button
              type="button"
              onClick={() => setSelectedRfq(null)}
              style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748b' }}
            >
              ✕
            </button>
            <h3 style={{ fontSize: '18px', fontWeight: '700', color: '#0f172a', marginBottom: '8px' }}>
              Nộp báo giá cho {selectedRfq.id}
            </h3>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '20px' }}>
              {selectedRfq.productName}
            </p>

            <form onSubmit={handleSubmitQuote} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Tên nhà cung cấp (B2B Supplier)</label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Công ty Dược Mỹ Phẩm Lix"
                  value={supplierName}
                  onChange={(e) => setSupplierName(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Đơn giá báo (VND)</label>
                  <input
                    type="number"
                    required
                    placeholder={`Max: ${selectedRfq.targetPrice}`}
                    value={priceOffer}
                    onChange={(e) => setPriceOffer(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Số lượng cung ứng</label>
                  <input
                    type="number"
                    required
                    placeholder={`Yêu cầu: ${selectedRfq.quantityNeeded}`}
                    value={quantityOffer}
                    onChange={(e) => setQuantityOffer(e.target.value)}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>Ngày giao hàng dự kiến</label>
                <input
                  type="date"
                  required
                  value={deliveryDate}
                  onChange={(e) => setDeliveryDate(e.target.value)}
                  style={{ width: '100%', padding: '10px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  background: '#ee4d2d',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 0',
                  fontSize: '14px',
                  fontWeight: '700',
                  cursor: submitting ? 'not-allowed' : 'pointer',
                  opacity: submitting ? 0.7 : 1,
                  marginTop: '10px',
                  boxShadow: '0 4px 6px -1px rgb(238 77 45 / 0.2)'
                }}
              >
                {submitting ? "Đang gửi báo giá..." : "Gửi Báo Giá B2B"}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);
  
  const [products, setProducts] = useState([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*');
        
        if (error) throw error;
        
        if (data && data.length > 0) {
          const mapped = data.map(p => {
            let metadata = { old_price: '', discount: '' };
            try {
              if (p.description) {
                metadata = JSON.parse(p.description);
              }
            } catch (e) {
              // fallback if description is not JSON
            }
            
            return {
              id: p.id,
              title: p.name,
              price: `${Number(p.price).toLocaleString('vi-VN')}₫`,
              old_price: metadata.old_price || '',
              discount: metadata.discount || '',
              image: p.image_url || 'https://cdn.hstatic.net/products/200001108779/no_image.jpg',
              link: `/products/${p.id}`,
              sku: p.sku,
              category: p.category
            };
          });
          setProducts(mapped);
        } else {
          setProducts(extractedData.products || []);
        }
      } catch (err) {
        console.error('Error fetching products from Supabase, using mock fallback:', err);
        setProducts(extractedData.products || []);
      } finally {
        setLoadingProducts(false);
      }
    }
    fetchProducts();
  }, []);

  // Filter products based on search term AND active category tab
  const filteredProducts = products.filter(product => {
    const titleLower = product.title.toLowerCase();
    
    // 1. Search term filter
    if (searchTerm && !titleLower.includes(searchTerm.toLowerCase())) {
      return false;
    }

    // 2. Active Tab filter
    if (activeTab !== 'all') {
      const tabLower = activeTab.toLowerCase();
      if (tabLower === 'lix') {
        return titleLower.includes('lix');
      } else if (tabLower === 'on1') {
        return titleLower.includes('on1');
      } else if (tabLower === 'lof') {
        return titleLower.includes('lof');
      } else if (tabLower === 'colorkey') {
        return titleLower.includes('colorkey');
      } else if (tabLower === 'ông chà và') {
        return titleLower.includes('ông chà và');
      } else if (tabLower === 'rong biển okenki') {
        return titleLower.includes('okenki') || titleLower.includes('rong biển');
      } else if (tabLower === 'mì spaghetti pavoni') {
        return titleLower.includes('spaghetti') || titleLower.includes('pavoni') || titleLower.includes('mì');
      }
    }
    
    return true;
  });

  // Cart operations
  const handleAddToCart = (product, quantityToAdd = 1) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.product.title === product.title);
      if (existingItem) {
        return prevItems.map(item => 
          item.product.title === product.title 
            ? { ...item, qty: item.qty + quantityToAdd }
            : item
        );
      }
      return [...prevItems, { product, qty: quantityToAdd }];
    });
  };

  const handleUpdateCartQty = (title, newQty) => {
    if (newQty <= 0) {
      handleRemoveCartItem(title);
      return;
    }
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.product.title === title ? { ...item, qty: newQty } : item
      )
    );
  };

  const handleRemoveCartItem = (title) => {
    setCartItems(prevItems => prevItems.filter(item => item.product.title !== title));
  };

  const getCartCount = () => {
    return cartItems.reduce((total, item) => total + item.qty, 0);
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    const parsePrice = (priceStr) => {
      if (!priceStr) return 0;
      const cleanStr = priceStr.replace(/[^\d]/g, '');
      return parseInt(cleanStr, 10) || 0;
    };

    const total = cartItems.reduce((sum, item) => sum + (parsePrice(item.product.price) * item.qty), 0);

    const dbItems = cartItems.map(item => ({
      productId: item.product.id || 'p_nex_1',
      sku: item.product.sku || 'p_nex_1',
      name: item.product.title,
      price: parsePrice(item.product.price),
      quantity: item.qty
    }));

    const orderId = `NEX-${Date.now()}`;
    const orderPayload = {
      id: orderId,
      tenant_id: 'tenant-vcomm-prod-01',
      customer_id: 'USR-NEXTHUB',
      customer_name: 'Khách hàng NextHub',
      total: total,
      status: 'paid', // paid status triggers the stock deduction and accounting trigger
      items: dbItems,
      created_at: new Date().toISOString()
    };

    try {
      const { error } = await supabase
        .from('orders')
        .insert(orderPayload);

      if (error) throw error;

      alert(`Đặt hàng thành công! Mã đơn hàng: ${orderId}. Số lượng tồn kho và kế toán đã được tự động hạch toán trên ERP.`);
      setCartItems([]);
      setIsCartOpen(false);
    } catch (err) {
      console.error('Lỗi khi thanh toán đơn hàng:', err);
      alert('Không thể thanh toán đơn hàng. Vui lòng thử lại sau.');
    }
  };

  return (
    <div className="app-container">
      {/* Header section */}
      <Header 
        cartCount={getCartCount()} 
        onOpenCart={() => setIsCartOpen(true)}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          // Scroll down to products section smoothly
          const el = document.getElementById('products-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      {/* Main Promo Banners and Slider */}
      <HeroSlider />

      {/* Categories Horizontal circular links */}
      <CategoryGrid 
        activeTab={activeTab}
        onSelectCategory={(catName) => {
          setActiveTab(catName);
          const el = document.getElementById('products-section');
          if (el) {
            el.scrollIntoView({ behavior: 'smooth' });
          }
        }}
      />

      <B2bSupplierHub />

      {/* Products Tab-filtering and listing Grid */}
      <main className="products-section" id="products-section">
        <div className="container">
          <h2 className="section-title">Combo Ghép Cực Hời</h2>
          
          <ProductTabs 
            activeTab={activeTab} 
            onTabChange={setActiveTab} 
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center" style={{ padding: '60px 0', color: '#94a3b8' }}>
              <p style={{ fontSize: '16px', fontWeight: '500' }}>Không tìm thấy sản phẩm nào khớp với bộ lọc.</p>
            </div>
          ) : (
            <div className="grid grid-cols-4 fade-in">
              {filteredProducts.map((product, index) => {
                const cartItem = cartItems.find(item => item.product.title === product.title);
                return (
                  <ProductCard 
                    key={index} 
                    product={product}
                    cartItem={cartItem}
                    onAddToCart={handleAddToCart}
                    onUpdateCartQty={handleUpdateCartQty}
                    onOpenQuickView={setQuickViewProduct}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Cart drawer slide-out */}
      <CartDrawer 
        isOpen={isCartOpen} 
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQty={handleUpdateCartQty}
        onRemoveItem={handleRemoveCartItem}
        onCheckout={handleCheckout}
      />

      {/* Quick view details modal */}
      <QuickViewModal 
        isOpen={quickViewProduct !== null} 
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onAddToCart={handleAddToCart}
      />
    </div>
  );
}
