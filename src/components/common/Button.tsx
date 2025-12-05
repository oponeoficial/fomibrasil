import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'outline';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    isLoading?: boolean;
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
    children,
    variant = 'primary',
    size = 'md',
    fullWidth = false,
    isLoading = false,
    leftIcon,
    rightIcon,
    disabled,
    style,
    ...props
}) => {
    const baseStyles: React.CSSProperties = {
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        fontFamily: 'var(--font-sans)',
        fontWeight: 600,
        borderRadius: 'var(--radius-md)',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease',
        border: 'none',
        width: fullWidth ? '100%' : 'auto',
        opacity: disabled || isLoading ? 0.6 : 1,
    };

    const sizeStyles: Record<string, React.CSSProperties> = {
        sm: { padding: '8px 16px', fontSize: '0.85rem' },
        md: { padding: '12px 24px', fontSize: '1rem' },
        lg: { padding: '16px 32px', fontSize: '1.1rem' },
    };

    const variantStyles: Record<string, React.CSSProperties> = {
        primary: {
            backgroundColor: 'var(--color-red)',
            color: '#fff',
            boxShadow: '0 4px 15px rgba(255, 59, 48, 0.3)',
        },
        secondary: {
            backgroundColor: 'var(--color-dark)',
            color: '#fff',
        },
        ghost: {
            backgroundColor: 'transparent',
            color: 'var(--color-dark)',
        },
        outline: {
            backgroundColor: 'transparent',
            color: 'var(--color-red)',
            border: '2px solid var(--color-red)',
        },
    };

    return (
        <button
            disabled={disabled || isLoading}
            style={{
                ...baseStyles,
                ...sizeStyles[size],
                ...variantStyles[variant],
                ...style,
            }}
            {...props}
        >
            {isLoading ? (
                <span style={{ display: 'inline-block', animation: 'spin 1s linear infinite' }}>⟳</span>
            ) : (
                <>
                    {leftIcon && <span>{leftIcon}</span>}
                    {children}
                    {rightIcon && <span>{rightIcon}</span>}
                </>
            )}
        </button>
    );
};
