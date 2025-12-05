import React, { useState } from 'react';
import { X, Heart, Share2, Star, MapPin, Clock, Phone, Globe, ChevronLeft, ChevronRight, ThumbsUp, ExternalLink } from 'lucide-react';
import { Restaurant, Review } from '../../types';

type DetailTabId = 'about' | 'photos' | 'reviews' | 'menu';

interface RestaurantDetailsProps {
    restaurant: Restaurant;
    onClose: () => void;
    onSave: (id: number) => void;
    isSaved: boolean;
}

export const RestaurantDetails: React.FC<RestaurantDetailsProps> = ({ restaurant, onClose, onSave, isSaved }) => {
    const [activeTab, setActiveTab] = useState<DetailTabId>('about');
    const [galleryIndex, setGalleryIndex] = useState(0);

    const tabs: { id: DetailTabId; label: string }[] = [
        { id: 'about', label: 'Sobre' },
        { id: 'photos', label: 'Fotos' },
        { id: 'reviews', label: 'Avaliações' },
        { id: 'menu', label: 'Menu' },
    ];

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

                {/* Ratings Breakdown */}
                <div style={{ display: 'flex', gap: '16px', fontSize: '0.85rem' }}>
                    <RatingItem label="Comida" value={restaurant.ratingsBreakdown.food} />
                    <RatingItem label="Serviço" value={restaurant.ratingsBreakdown.service} />
                    <RatingItem label="Ambiente" value={restaurant.ratingsBreakdown.ambiance} />
                </div>
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', backgroundColor: '#fff', borderBottom: '1px solid rgba(0,0,0,0.05)' }}>
                {tabs.map(tab => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        style={{
                            flex: 1,
                            padding: '14px',
                            background: 'none',
                            border: 'none',
                            borderBottom: activeTab === tab.id ? '2px solid var(--color-red)' : '2px solid transparent',
                            color: activeTab === tab.id ? 'var(--color-red)' : 'var(--color-gray)',
                            fontWeight: activeTab === tab.id ? 600 : 400,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <div style={{ padding: '16px', paddingBottom: '100px' }}>
                {activeTab === 'about' && <AboutTab restaurant={restaurant} />}
                {activeTab === 'photos' && <PhotosTab gallery={gallery} />}
                {activeTab === 'reviews' && <ReviewsTab reviews={restaurant.reviews} />}
                {activeTab === 'menu' && <MenuTab />}
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

// Sub-components
const RatingItem: React.FC<{ label: string; value: number }> = ({ label, value }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
        <span style={{ color: 'var(--color-gray)' }}>{label}:</span>
        <Star size={14} fill="#FFD60A" color="#FFD60A" />
        <span style={{ fontWeight: 600, color: 'var(--color-dark)' }}>{value}</span>
    </div>
);

const AboutTab: React.FC<{ restaurant: Restaurant }> = ({ restaurant }) => (
    <div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
            <InfoItem icon={<MapPin size={18} />} text={restaurant.address} isLink />
            <InfoItem icon={<Clock size={18} />} text={restaurant.hours} />
            <InfoItem icon={<span style={{ fontSize: '1rem' }}>💰</span>} text={`Faixa de preço: ${restaurant.price}`} />
            <InfoItem icon={<Phone size={18} />} text={restaurant.phone} isLink />
            {restaurant.website && <InfoItem icon={<Globe size={18} />} text={restaurant.website} isLink />}
        </div>

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

        <div style={{ marginBottom: '20px' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '8px', color: 'var(--color-dark)' }}>Sobre</h3>
            <p style={{ fontSize: '0.9rem', lineHeight: 1.6, color: 'var(--color-gray)' }}>{restaurant.longDescription}</p>
        </div>

        <div
            style={{
                height: '150px',
                backgroundColor: 'var(--color-light-gray)',
                borderRadius: 'var(--radius-md)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
            }}
        >
            <div style={{ textAlign: 'center', color: 'var(--color-gray)' }}>
                <MapPin size={32} style={{ marginBottom: '8px' }} />
                <p style={{ fontSize: '0.85rem' }}>Toque para abrir no Maps</p>
            </div>
        </div>
    </div>
);

const InfoItem: React.FC<{ icon: React.ReactNode; text: string; isLink?: boolean }> = ({ icon, text, isLink }) => (
    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', color: isLink ? 'var(--color-red)' : 'var(--color-dark)', fontSize: '0.9rem' }}>
        <span style={{ color: 'var(--color-gray)' }}>{icon}</span>
        <span>{text}</span>
        {isLink && <ExternalLink size={14} style={{ marginLeft: 'auto', opacity: 0.5 }} />}
    </div>
);

const PhotosTab: React.FC<{ gallery: string[] }> = ({ gallery }) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '4px' }}>
        {gallery.map((photo, i) => (
            <div key={i} style={{ aspectRatio: '1', overflow: 'hidden', borderRadius: 'var(--radius-sm)' }}>
                <img src={photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
        ))}
    </div>
);

const ReviewsTab: React.FC<{ reviews: Review[] }> = ({ reviews }) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {reviews.length === 0 ? (
            <p style={{ textAlign: 'center', color: 'var(--color-gray)', padding: '40px 0' }}>Nenhuma avaliação ainda.</p>
        ) : (
            reviews.map(review => (
                <div key={review.id} style={{ padding: '16px', backgroundColor: '#fff', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-soft)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '10px' }}>
                        <img src={review.userImage} alt={review.user} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                        <div style={{ flex: 1 }}>
                            <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{review.user}</p>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} size={12} fill={i < review.rating ? '#FFD60A' : 'transparent'} color={i < review.rating ? '#FFD60A' : '#ccc'} />
                                ))}
                                <span style={{ fontSize: '0.75rem', color: 'var(--color-gray)', marginLeft: '6px' }}>{review.date}</span>
                            </div>
                        </div>
                    </div>
                    <p style={{ fontSize: '0.85rem', lineHeight: 1.5, color: 'var(--color-dark)', marginBottom: '10px' }}>{review.text}</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '10px' }}>
                        {review.tags.map((tag, i) => (
                            <span key={i} style={{ padding: '4px 8px', backgroundColor: 'var(--color-light-gray)', borderRadius: 'var(--radius-full)', fontSize: '0.7rem', color: 'var(--color-gray)' }}>{tag}</span>
                        ))}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--color-gray)' }}>
                        <button style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray)' }}>
                            <ThumbsUp size={14} /> {review.likes}
                        </button>
                        <button style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--color-gray)' }}>Marcar como útil</button>
                    </div>
                </div>
            ))
        )}
    </div>
);

const MenuTab: React.FC = () => (
    <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--color-gray)' }}>
        <p>Menu não disponível.</p>
        <p style={{ fontSize: '0.85rem', marginTop: '8px' }}>Entre em contato com o restaurante para mais informações.</p>
    </div>
);
