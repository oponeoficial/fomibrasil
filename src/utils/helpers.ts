/**
 * Get greeting based on time of day
 */
export const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
};

/**
 * Get contextual message based on time of day
 */
export const getContextualMessage = (): string => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 11) return 'Que tal um brunch especial?';
    if (hour >= 11 && hour < 14) return 'Hora do almoço! Encontre o lugar perfeito.';
    if (hour >= 14 && hour < 18) return 'Um lanche da tarde?';
    if (hour >= 18 && hour < 22) return 'Pronto para descobrir onde jantar hoje?';
    return 'Fome de madrugada? Temos opções!';
};

/**
 * Color mappings for tags
 */
export const tagColors: Record<string, string> = {
    red: 'rgba(255, 59, 48, 0.15)',
    green: 'rgba(52, 199, 89, 0.15)',
    purple: 'rgba(175, 82, 222, 0.15)',
    orange: 'rgba(255, 149, 0, 0.15)',
    blue: 'rgba(0, 122, 255, 0.15)',
};

export const tagTextColors: Record<string, string> = {
    red: '#FF3B30',
    green: '#34C759',
    purple: '#AF52DE',
    orange: '#FF9500',
    blue: '#007AFF',
};

/**
 * Format distance for display
 */
export const formatDistance = (meters: number): string => {
    if (meters < 1000) return `${meters} m`;
    return `${(meters / 1000).toFixed(1)} km`;
};

/**
 * Truncate text with ellipsis
 */
export const truncateText = (text: string, maxLength: number): string => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength - 3) + '...';
};
