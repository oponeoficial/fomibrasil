import React, { useState } from 'react';
import { X, Heart, Share2, Star, MapPin, Clock, Phone, Globe, ChevronLeft, ChevronRight } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantDetailsProps {
  restaurant: Restaurant;
  onClose: () => void;
  onSave: (id: number) => void;
  isSaved: boolean;
}

export const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant, onClose, onSave, isSaved }) => {
  const [galleryIndex, setGalleryIndex] = useState(0);
  const gallery = restaurant.gallery.length > 0 ? restaurant.gallery : [restaurant.image];

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 200,
        backgroundColor: 'var(--color-cream)',
        overflowY: 'auto',
        animation: 'slideUp 0.3s ease-out',
      }}
    >
      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>

      {/* Gallery */}
      <div style={{ position: 'relative', height: '280px' }}>
        <img
          src={gallery[galleryIndex]}
          alt={restaurant.name}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />

        {/* Gradient */}
        <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100px', background: 'linear-gradient(to top, rgba(0,0,0,0.5), transparent)' }} />

        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            left: '16px',
            width: '40px',
            height: '40px',
            borderRadius: '50%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            border: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            color: '#fff',
          }}
        >
          <X size={24} />
        </button>

        {/* Gallery Navigation */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)}
              style={{ position: 'absolute', left: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)}
              style={{ position: 'absolute', right: '16px', top: '50%', transform: 'translateY(-50%)', width: '36px', height: '36px', borderRadius: '50%', backgroundColor: 'rgba(255,255,255,0.9)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div style={{ position: 'absolute', bottom: '16px', left: '50%', transform: 'translateX(-50%)', display: 'flex', gap: '6px' }}>
              {gallery.map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: '8px',
                    height: '8px',
                    borderRadius: '50%',
                    backgroundColor: i === galleryIndex ? '#fff' : 'rgba(255,255,255,0.5)',
                    transition: 'background-color 0.2s',
                  }}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div style={{ padding: '16px', backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--color-dark)' }}>{restaurant.name}</h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => onSave(restaurant.id)}
              style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-light-gray)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Heart size={20} fill={isSaved ? 'var(--color-red)' : 'none'} color={isSaved ? 'var(--color-red)' : 'var(--color-dark)'} />
            </button>
            <button
              style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--color-light-gray)', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
            >
              <Share2 size={20} color="var(--color-dark)" />
            </button>
          </div>
        </div>

        {/* Ratings */}
        <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Star size={14} fill="#FFD60A" color="#FFD60A" />
            <span style={{ fontWeight: 600 }}>{restaurant.rating}</span>
            <span style={{ color: 'var(--color-gray)' }}>({restaurant.reviewCount})</span>
          </div>
          <span style={{ color: 'var(--color-gray)' }}>•</span>
          <span style={{ color: 'var(--color-dark)' }}>{restaurant.price}</span>
          <span style={{ color: 'var(--color-gray)' }}>•</span>
          <span style={{ color: 'var(--color-dark)' }}>{restaurant.distance}</span>
        </div>
      </div>

      {/* Info */}
      <div style={{ padding: '16px', paddingBottom: '120px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
          <InfoItem icon={<MapPin size={18} />} text={restaurant.address} />
          <InfoItem icon={<Clock size={18} />} text={restaurant.hours} />
          <InfoItem icon={<Phone size={18} />} text={restaurant.phone} />
          {restaurant.website && <InfoItem icon={<Globe size={18} />} text={restaurant.website} />}
        </div>

        {/* Features */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
          {restaurant.features.map((feature, i) => (
            <span
              key={i}
              style={{
                padding: '8px 12px',
                backgroundColor: 'var(--color-light-gray)',
                borderRadius: 'var(--radius-full)',
                fontSize: '0.8rem',
                color: 'var(--color-dark)',
              }}
            >
              {feature}
            </span>
          ))}
        </div>

        {/* Description */}
        <div style={{ marginBottom: '20px' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-dark)' }}>Sobre</h3>
          <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-gray)' }}>{restaurant.longDescription}</p>
        </div>
      </div>

      {/* Sticky Action Button */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          padding: '16px',
          backgroundColor: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(12px)',
          borderTop: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <button
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            border: 'none',
            borderRadius: 'var(--radius-md)',
            fontSize: '1rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
          }}
        >
          <MapPin size={20} />
          Ver Rota e Reservar
        </button>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: 'var(--color-dark)', fontSize: '0.9rem' }}>
    <span style={{ color: 'var(--color-gray)' }}>{icon}</span>
    <span>{text}</span>
  </div>
);