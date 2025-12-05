import React, { useState, useRef } from 'react';
import { Heart, Star, MapPin, Share2 } from 'lucide-react';
import { Restaurant } from '../../types';
import { tagColors, tagTextColors } from '../../utils/helpers';

interface RestaurantCardProps {
    restaurant: Restaurant;
    onSelect: (restaurant: Restaurant) => void;
    onSave: (id: number) => void;
    isSaved: boolean;
}

export const RestaurantCard: React.FC<RestaurantCardProps> = ({ restaurant, onSelect, onSave, isSaved }) => {
    const [swipeOffset, setSwipeOffset] = useState(0);
    const [isSwiping, setIsSwiping] = useState(false);
    const startX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        startX.current = e.touches[0].clientX;
        setIsSwiping(true);
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        if (!isSwiping) return;
        const diff = startX.current - e.touches[0].clientX;
        if (diff > 0) {
            setSwipeOffset(Math.min(diff, 120));
        }
    };

    const handleTouchEnd = () => {
        setIsSwiping(false);
        if (swipeOffset < 60) {
            setSwipeOffset(0);
        }
    };

    return (
        <div
            style={{
                position: 'relative',
                marginBottom: '16px',
                borderRadius: 'var(--radius-lg)',
                overflow: 'hidden',
                boxShadow: 'var(--shadow-card)',
                backgroundColor: '#fff',
            }}
        >
            {/* Swipe Actions */}
            <div
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    bottom: 0,
                    width: '120px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-around',
                    backgroundColor: 'var(--color-red)',
                    zIndex: 0,
                }}
            >
                <button style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <MapPin size={20} />
                    <span style={{ fontSize: '0.7rem' }}>Rota</span>
                </button>
                <button style={{ background: 'none', border: 'none', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                    <Share2 size={20} />
                    <span style={{ fontSize: '0.7rem' }}>Compartilhar</span>
                </button>
            </div>

            {/* Card Content */}
            <div
                onClick={() => swipeOffset === 0 && onSelect(restaurant)}
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
                style={{
                    position: 'relative',
                    zIndex: 1,
                    backgroundColor: '#fff',
                    transform: `translateX(-${swipeOffset}px)`,
                    transition: isSwiping ? 'none' : 'transform 0.3s ease',
                    cursor: 'pointer',
                }}
            >
                {/* Image */}
                <div style={{ position: 'relative', height: '200px' }}>
                    <img
                        src={restaurant.image}
                        alt={restaurant.name}
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                        }}
                    />

                    {/* Gradient Overlay */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '80px',
                            background: 'linear-gradient(to top, rgba(0,0,0,0.6), transparent)',
                        }}
                    />

                    {/* Save Button */}
                    <button
                        onClick={(e) => { e.stopPropagation(); onSave(restaurant.id); }}
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            backgroundColor: 'rgba(255,255,255,0.9)',
                            border: 'none',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                            transition: 'transform 0.2s ease',
                        }}
                    >
                        <Heart
                            size={18}
                            fill={isSaved ? 'var(--color-red)' : 'none'}
                            color={isSaved ? 'var(--color-red)' : 'var(--color-dark)'}
                        />
                    </button>

                    {/* Rating Badge */}
                    <div
                        style={{
                            position: 'absolute',
                            bottom: '12px',
                            left: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            backgroundColor: 'rgba(0,0,0,0.7)',
                            backdropFilter: 'blur(4px)',
                            padding: '6px 10px',
                            borderRadius: 'var(--radius-full)',
                            color: '#fff',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                        }}
                    >
                        <Star size={14} fill="#FFD60A" color="#FFD60A" />
                        <span>{restaurant.rating}</span>
                        <span style={{ opacity: 0.7, fontSize: '0.75rem' }}>({restaurant.reviewCount})</span>
                    </div>
                </div>

                {/* Content */}
                <div style={{ padding: '14px' }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--color-dark)', marginBottom: '8px', fontFamily: 'var(--font-display)' }}>
                        {restaurant.name}
                    </h3>

                    {/* Tags */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '8px' }}>
                        {restaurant.tags.slice(0, 3).map((tag, index) => (
                            <span
                                key={index}
                                style={{
                                    padding: '4px 10px',
                                    borderRadius: 'var(--radius-full)',
                                    backgroundColor: tagColors[tag.color] || tagColors.blue,
                                    color: tagTextColors[tag.color] || tagTextColors.blue,
                                    fontSize: '0.75rem',
                                    fontWeight: 500,
                                }}
                            >
                                {tag.text}
                            </span>
                        ))}
                    </div>

                    {/* Description */}
                    <p style={{ fontSize: '0.85rem', color: 'var(--color-gray)', lineHeight: 1.4, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {restaurant.description}
                    </p>
                </div>
            </div>
        </div>
    );
};
