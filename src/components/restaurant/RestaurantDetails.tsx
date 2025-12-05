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
    <div className="fixed inset-0 z-[200] bg-cream overflow-y-auto animate-slideUp">
      {/* Gallery */}
      <div className="relative h-[280px]">
        <img
          src={gallery[galleryIndex]}
          alt={restaurant.name}
          className="w-full h-full object-cover"
        />

        {/* Gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-[100px] bg-gradient-to-t from-black/50 to-transparent" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 w-10 h-10 rounded-full bg-black/50 border-none flex items-center justify-center cursor-pointer text-white"
        >
          <X size={24} />
        </button>

        {/* Gallery Navigation */}
        {gallery.length > 1 && (
          <>
            <button
              onClick={() => setGalleryIndex(prev => prev > 0 ? prev - 1 : gallery.length - 1)}
              className="absolute left-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={() => setGalleryIndex(prev => prev < gallery.length - 1 ? prev + 1 : 0)}
              className="absolute right-4 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer"
            >
              <ChevronRight size={20} />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5">
              {gallery.map((_, i) => (
                <div
                  key={i}
                  className={`w-2 h-2 rounded-full transition-colors ${i === galleryIndex ? 'bg-white' : 'bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Header */}
      <div className="p-4 bg-white border-b border-black/5">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl font-bold font-display text-dark">{restaurant.name}</h1>
          <div className="flex gap-2">
            <button
              onClick={() => onSave(restaurant.id)}
              className="w-10 h-10 rounded-full bg-light-gray border-none flex items-center justify-center cursor-pointer"
            >
              <Heart size={20} fill={isSaved ? '#FF3B30' : 'none'} className={isSaved ? 'text-red' : 'text-dark'} />
            </button>
            <button className="w-10 h-10 rounded-full bg-light-gray border-none flex items-center justify-center cursor-pointer">
              <Share2 size={20} className="text-dark" />
            </button>
          </div>
        </div>

        {/* Ratings */}
        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-1">
            <Star size={14} fill="#FFD60A" className="text-yellow-400" />
            <span className="font-semibold">{restaurant.rating}</span>
            <span className="text-gray">({restaurant.reviewCount})</span>
          </div>
          <span className="text-gray">•</span>
          <span className="text-dark">{restaurant.price}</span>
          <span className="text-gray">•</span>
          <span className="text-dark">{restaurant.distance}</span>
        </div>
      </div>

      {/* Info */}
      <div className="p-4 pb-[120px]">
        <div className="flex flex-col gap-3 mb-5">
          <InfoItem icon={<MapPin size={18} />} text={restaurant.address} />
          <InfoItem icon={<Clock size={18} />} text={restaurant.hours} />
          <InfoItem icon={<Phone size={18} />} text={restaurant.phone} />
          {restaurant.website && <InfoItem icon={<Globe size={18} />} text={restaurant.website} />}
        </div>

        {/* Features */}
        <div className="flex flex-wrap gap-2 mb-5">
          {restaurant.features.map((feature, i) => (
            <span key={i} className="px-3 py-2 bg-light-gray rounded-full text-xs text-dark">
              {feature}
            </span>
          ))}
        </div>

        {/* Description */}
        <div className="mb-5">
          <h3 className="text-base font-semibold mb-2 text-dark">Sobre</h3>
          <p className="text-sm leading-relaxed text-gray">{restaurant.longDescription}</p>
        </div>
      </div>

      {/* Sticky Action Button */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-black/5">
        <button className="w-full py-4 bg-red text-white border-none rounded-md text-base font-semibold cursor-pointer flex items-center justify-center gap-2 shadow-[0_4px_15px_rgba(255,59,48,0.3)]">
          <MapPin size={20} />
          Ver Rota e Reservar
        </button>
      </div>
    </div>
  );
};

const InfoItem: React.FC<{ icon: React.ReactNode; text: string }> = ({ icon, text }) => (
  <div className="flex items-center gap-3 text-dark text-sm">
    <span className="text-gray">{icon}</span>
    <span>{text}</span>
  </div>
);