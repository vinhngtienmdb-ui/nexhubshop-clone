import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeroSlider() {
  const slides = [
    { image: "/images/banners/slide_1_img.jpg", title: "Nexhub Shop", desc: "Mua sắm thông minh, càng ghép càng lời" }
  ];

  const gridBanners = [
    { image: "/images/banners/img_item_four_banner_home_1.jpg", link: "#" },
    { image: "/images/banners/img_item_four_banner_home_2.jpg", link: "#" },
    { image: "/images/banners/img_item_four_banner_home_3.jpg", link: "#" },
    { image: "/images/banners/img_item_four_banner_home_4.jpg", link: "#" }
  ];

  return (
    <div>
      {/* Hero Carousel Banner */}
      <div className="slider-container">
        <div className="slide active">
          <img src={slides[0].image} alt={slides[0].title} />
        </div>
        
        {/* Navigation Buttons for future expansion */}
        <button className="slider-nav slider-prev" aria-label="Slide trước">
          <ChevronLeft size={24} />
        </button>
        <button className="slider-nav slider-next" aria-label="Slide sau">
          <ChevronRight size={24} />
        </button>
      </div>

      {/* Grid of 4 Small Banners below Slider */}
      <div className="banner-grid-section container">
        <div className="banner-grid">
          {gridBanners.map((banner, index) => (
            <a key={index} href={banner.link} className="banner-item">
              <img src={banner.image} alt={`Promotion banner ${index + 1}`} />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
