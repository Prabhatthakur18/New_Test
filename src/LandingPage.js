import React, { useState, useEffect } from 'react';
import './Landing.css';
import { useNavigate } from 'react-router-dom';
import { Sparkles, CheckCircle, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';

const slidesData = [
  {
    id: 1,
    title: "Transform Your Drive",
    // heroHeading: "TRANSFORM YOUR SUV THE WAY YOU LIKE!",
    content: [
      "Elevate your journey with custom Accessories tailored to your style. Premium stitching, personalized initials — crafted for comfort and elegance.",
      "Whether you're heading to the office or on a weekend getaway, our accessories provide unmatched luxury, ergonomic support, and a personal touch that sets your SUV interior apart.",
      "Every Accessory is made with Automotive Grade materials, precision-finished by skilled Manpower to ensure long-lasting quality."
    ],
    tags: ["Premium Comfort", "Custom Embroidery", "Luxury Finish"],
    media: {
      type: 'image',
      src: "/models/thar.png",
      alt: "Custom Headrest"
    },
    layout: 'text-left',
    showCTA: true
  },
  {
    id: 2,
    title: "Craftsmanship You Can Feel",
    // heroHeading: "PRECISION IN EVERY STITCH",
    content: [
      "From raw materials to finished luxury — our accessories go through expert detailing and precision cuts to meet the highest standards.",
      "Each product is shaped by skilled hands, ensuring perfection in every stitch and seam. We don't just build accessories — we sculpt experiences meant to last.",
      "What you get isn't just a product — it's a masterpiece made to elevate your drive, every single day."
    ],
    tags: ["Premium Embroidery", "Attention to Detail", "Luxury in Every Thread"],
    media: {
      type: 'video',
      src: "/models/WhatsApp Video 2025-06-30 at 18.56.02_d3df19a1.mp4"
    },
    layout: 'text-left',
    showCTA: true
  }
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const nextSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev + 1) % slidesData.length);
  };

  const prevSlide = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setCurrentSlide((prev) => (prev - 1 + slidesData.length) % slidesData.length);
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimating(false), 800);
    return () => clearTimeout(timer);
  }, [currentSlide]);

  // Auto-slide every 4s unless hovered
  useEffect(() => {
    if (isHovered) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slidesData.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isHovered]);

  const currentSlideData = slidesData[currentSlide];

  return (
    <div className="landing-page">
      <div className="carousel-container">

        {/* === Top Bar with Logo + Hero Heading === */}
        <div className="slide-topbar">
          <img src="/Mahindra Twin Peaks Logo JPG.png" alt="Logo" className="slide-logo-top" />
          <h1 className="slide-hero-top-heading">{currentSlideData.heroHeading}</h1>
        </div>

        <div className="slide-wrapper">
          {/* === Media Content === */}
          <div className={`media-section ${currentSlideData.layout === 'text-left' ? 'media-right' : 'media-left'}`}>
            {currentSlideData.media.type === 'image' ? (
              <img
                src={currentSlideData.media.src}
                alt={currentSlideData.media.alt}
                className="fullscreen-media"
                key={`img-${currentSlide}`}
              />
            ) : (
              <video
                src={currentSlideData.media.src}
                className="fullscreen-media"
                autoPlay
                loop
                muted
                playsInline
                key={`video-${currentSlide}`}
              />
            )}
          </div>

          {/* === Text Overlay === */}
          <div className={`text-overlay ${currentSlideData.layout}`}>
            <div className="text-content-inner">
              <h2 className="slide-title">
                <Sparkles size={30} className="title-icon" />
                <span className="typewriter-text" key={`title-${currentSlide}`}>
                  {currentSlideData.title}
                </span>
              </h2>

              <div className="slide-content">
                {currentSlideData.content.map((paragraph, index) => (
                  <p
                    key={`p-${currentSlide}-${index}`}
                    className="typewriter-paragraph"
                    style={{ animationDelay: `${0.5 + index * 0.3}s`, textAlign: 'justify' }}
                  >
                    {paragraph}
                  </p>
                ))}
              </div>

              {/* === Tags (Pause on Hover) === */}
              <div
                className="slide-tags"
                key={`tags-${currentSlide}`}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
              >
                {currentSlideData.tags.map((tag, index) => (
                  <span
                    key={tag}
                    className="tag-item"
                    style={{ animationDelay: `${1.5 + index * 0.1}s` }}
                  >
                    <CheckCircle size={14} />
                    {tag}
                  </span>
                ))}
              </div>

              {/* === CTA Button (Pause on Hover) === */}
              {currentSlideData.showCTA && (
                <div
                  className="slide-cta-container"
                  key={`cta-${currentSlide}`}
                  onMouseEnter={() => setIsHovered(true)}
                  onMouseLeave={() => setIsHovered(false)}
                >
                  <button
                    className="slide-cta-button"
                    onClick={() => navigate('/personalise')}
                  >
                    GO PERSONALISE <ArrowRight size={16} className="slide-cta-arrow" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* === Navigation Arrows === */}
        <div className="carousel-navigation">
          <button
            className="nav-arrow nav-prev"
            onClick={prevSlide}
            disabled={isAnimating}
            aria-label="Previous Slide"
          >
            <ChevronLeft />
          </button>
          <button
            className="nav-arrow nav-next"
            onClick={nextSlide}
            disabled={isAnimating}
            aria-label="Next Slide"
          >
            <ChevronRight />
          </button>
        </div>

      </div>
    </div>
  );
}
