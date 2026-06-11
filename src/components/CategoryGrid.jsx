import React from 'react';
import extractedData from '../data/extracted_products.json';

export default function CategoryGrid({ onSelectCategory, activeTab }) {
  const categories = extractedData.categories || [];

  return (
    <section className="category-section">
      <div className="container">
        <h2 className="section-title">Danh mục sản phẩm</h2>
        <div className="categories-container">
          {categories.map((cat, index) => {
            // Normalize matching name for tabs
            const filterName = cat.title === "Ông Chà Và" ? "Ông Chà Và" : cat.title;
            const isActive = activeTab === filterName;
            
            return (
              <button 
                key={index} 
                className={`category-card ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(filterName)}
              >
                <div className="category-img-wrapper" style={{ borderColor: isActive ? 'var(--shop-color-hover)' : '' }}>
                  <img src={cat.image} alt={cat.title} onError={(e) => {
                    // Fallback to absolute remote url if local image is missing
                    e.target.src = `https://cdn.hstatic.net/themes/200001108779/1001433049/14/img_item_category_home_${index + 3}.png?v=499`;
                  }} />
                </div>
                <span className="category-name" style={{ color: isActive ? 'var(--shop-color-hover)' : '' }}>{cat.title}</span>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}
