import React from 'react';

interface LogoProps {
    size?: 'sm' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ size = 'lg' }) => {
    const fontSize = size === 'lg' ? '3.5rem' : '1.8rem';

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative',
                userSelect: 'none',
            }}
        >
            <h1
                style={{
                    fontSize,
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-red)',
                    letterSpacing: '-0.02em',
                    lineHeight: 1,
                    margin: 0,
                    position: 'relative',
                }}
            >
                fomí
                <span
                    style={{
                        position: 'absolute',
                        top: 0,
                        right: size === 'lg' ? '-12px' : '-6px',
                        fontSize: size === 'lg' ? '0.5rem' : '0.35rem',
                        color: 'var(--color-red)',
                    }}
                >
                    ●
                </span>
            </h1>

            {/* Bite effect on the O */}
            <div
                style={{
                    position: 'absolute',
                    backgroundColor: 'var(--color-cream)',
                    borderRadius: '50%',
                    width: size === 'lg' ? '18px' : '9px',
                    height: size === 'lg' ? '18px' : '9px',
                    top: size === 'lg' ? '16px' : '8px',
                    left: size === 'lg' ? '52px' : '26px',
                }}
            />
        </div>
    );
};

export const LogoIllustration: React.FC = () => {
    return (
        <div
            style={{
                position: 'relative',
                width: '192px',
                height: '192px',
                margin: '24px auto',
                opacity: 0.9,
            }}
        >
            <img
                src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"
                alt="Food Illustration"
                style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    borderRadius: '50%',
                    border: '4px solid var(--color-red)',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
                    transform: 'rotate(3deg)',
                }}
            />
            <div
                style={{
                    position: 'absolute',
                    bottom: '-8px',
                    right: '-8px',
                    backgroundColor: 'var(--color-red)',
                    color: '#fff',
                    padding: '8px',
                    borderRadius: '50%',
                    boxShadow: '0 4px 15px rgba(255, 59, 48, 0.4)',
                }}
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
                    <path d="M7 2v20" />
                    <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
                </svg>
            </div>
        </div>
    );
};
