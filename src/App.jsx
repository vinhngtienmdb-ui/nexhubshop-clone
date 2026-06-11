import React, { useState } from 'react';
import Header from './components/Header';
import HeroSlider from './components/HeroSlider';
import CategoryGrid from './components/CategoryGrid';
import ProductTabs from './components/ProductTabs';
import ProductCard from './components/ProductCard';
import QuickViewModal from './components/QuickViewModal';
import CartDrawer from './components/CartDrawer';
import Footer from './components/Footer';
import extractedData from './data/extracted_products.json';

export default function App() {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [quickViewProduct, setQuickViewProduct] = useState(null);

  const products = extractedData.products || [];

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
