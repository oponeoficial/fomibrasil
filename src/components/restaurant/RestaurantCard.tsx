import React from 'react';
import { Heart, Star, MapPin } from 'lucide-react';
import { Restaurant } from '../../types';

interface RestaurantCardProps {
  restaurant: Restaurant;
  onSelect: (restaurant: Restaurant) => void;
  onSave: (id: string | number) => void;
  isSaved: boolean;
}

const tagBgColors: Record<string, string> = {
  red: 'bg-red/15',
  green: 'bg-green-500/15',
  purple: 'bg-purple-500/15',
  orange: 'bg-orange/15',
  blue: 'bg-blue-500/15',
};

const tagTextColors: Record<string, string> = {
  red: 'text-red',
  green: 'text-green-500',
  purple: 'text-purple-500',
  orange: 'text-orange',
  blue: 'text-blue-500',
};

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect, onSave, isSaved }) => {
  // Usar cover_image do Google, fallback para image local
  const coverImage = restaurant.cover_image || restaurant.image || '/placeholder-restaurant.jpg';

  return (
    <div
      onClick={() => onSelect(restaurant)}
      className="relative mb-4 rounded-lg overflow-hidden shadow-card bg-white cursor-pointer"
    >
      {/* Image */}
      <div className="relative h-[200px]">
        <img
          src={coverImage}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          onError={(e) => {
            // Fallback se a imagem falhar
            (e.target as HTMLImageElement).src = '/placeholder-restaurant.jpg';
          }}
        />

        {/* Gradient Overlay */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />

        {/* Save Button */}
        <button
          onClick={(e) => { e.stopPropagation(); onSave(restaurant.id); }}
          className="absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border-none flex items-center justify-center cursor-pointer shadow-md transition-transform duration-200 hover:scale-110"
        >
          <Heart
            size={18}
            fill={isSaved ? '#FF3B30' : 'none'}
            className={isSaved ? 'text-red' : 'text-dark'}
          />
        </button>

        {/* Rating Badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-sm font-semibold">
          <Star size={14} fill="#FFD60A" className="text-yellow-400" />
          <span>{restaurant.rating}</span>
          <span className="opacity-70 text-xs">({restaurant.reviewCount})</span>
        </div>

        {/* Distance */}
        {restaurant.distance && (
          <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/70 backdrop-blur-sm px-2.5 py-1.5 rounded-full text-white text-xs">
            <MapPin size={12} />
            <span>{restaurant.distance}</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-3.5">
        <h3 className="text-lg font-bold text-dark mb-2 font-display">
          {restaurant.name}
        </h3>

        {/* Tags */}
        {restaurant.tags && restaurant.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {restaurant.tags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className={`px-2.5 py-1 rounded-full text-xs font-medium ${tagBgColors[tag.color] || 'bg-blue-500/15'} ${tagTextColors[tag.color] || 'text-blue-500'}`}
              >
                {tag.text}
              </span>
            ))}
          </div>
        )}

        {/* Description */}
        {restaurant.description && (
          <p className="text-sm text-gray leading-snug line-clamp-2">
            {restaurant.description}
          </p>
        )}
      </div>
    </div>
  );
};