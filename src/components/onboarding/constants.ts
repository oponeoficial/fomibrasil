/**
 * FOMÍ - Onboarding v2 Constants
 * Baseado na spec Onboarding_2.pdf
 */

import type { ChipOption, ChipValidation } from './types';

// ============================================================================
// TELA 2 - GÊNERO
// ============================================================================

export const GENDER_OPTIONS: ChipOption[] = [
  { id: 'male', label: 'Masculino', emoji: '👨' },
  { id: 'female', label: 'Feminino', emoji: '👩' },
  { id: 'non-binary', label: 'Não-binário', emoji: '🧑' },
  { id: 'other', label: 'Outro', emoji: '✨' },
  { id: 'prefer-not', label: 'Prefiro não dizer', emoji: '🤐' },
];

export const CITIES: string[] = [
  'Recife',
  'Olinda',
  'Jaboatão dos Guararapes',
  'Paulista',
  'Cabo de Santo Agostinho',
  'Camaragibe',
];

// ============================================================================
// TELA 3 - COZINHAS (FILTRO NEGATIVO)
// ============================================================================

export const CUISINE_OPTIONS: ChipOption[] = [
  // Brasileiras
  { id: 'brasileira', label: 'Brasileira', emoji: '🇧🇷', group: 'brasileira' },
  { id: 'nordestina', label: 'Nordestina', emoji: '🌵', group: 'brasileira' },
  { id: 'baiana', label: 'Baiana', emoji: '🥥', group: 'brasileira' },
  { id: 'mineira', label: 'Mineira', emoji: '🫘', group: 'brasileira' },
  // Internacionais
  { id: 'peruana', label: 'Peruana', emoji: '🇵🇪', group: 'internacional' },
  { id: 'mexicana', label: 'Mexicana', emoji: '🌮', group: 'internacional' },
  { id: 'americana', label: 'Americana', emoji: '🇺🇸', group: 'internacional' },
  { id: 'italiana', label: 'Italiana', emoji: '🇮🇹', group: 'internacional' },
  { id: 'francesa', label: 'Francesa', emoji: '🇫🇷', group: 'internacional' },
  { id: 'japonesa', label: 'Japonesa', emoji: '🇯🇵', group: 'internacional' },
  // Asiáticas
  { id: 'arabe', label: 'Árabe', emoji: '🧆', group: 'asiatica' },
  { id: 'asiatica', label: 'Asiática', emoji: '🥢', group: 'asiatica' },
  { id: 'chinesa', label: 'Chinesa', emoji: '🇨🇳', group: 'asiatica' },
  // Por tipo
  { id: 'hamburgueria', label: 'Hamburgueria / Lanche', emoji: '🍔', group: 'tipo' },
  { id: 'pizzaria', label: 'Pizzaria', emoji: '🍕', group: 'tipo' },
  { id: 'frutos-mar', label: 'Peixes e frutos do mar', emoji: '🦐', group: 'tipo' },
  { id: 'carnes', label: 'Carnes', emoji: '🥩', group: 'tipo' },
  // Dietas
  { id: 'vegetariana', label: 'Vegetariana', emoji: '🥗', group: 'dieta' },
  { id: 'vegana', label: 'Vegana', emoji: '🌱', group: 'dieta' },
  // Outros
  { id: 'sanduiches', label: 'Sanduíches', emoji: '🥪', group: 'outros' },
  { id: 'cafes-doces', label: 'Cafés e doces', emoji: '☕', group: 'outros' },
  { id: 'padaria', label: 'Padaria', emoji: '🥐', group: 'outros' },
];

// ============================================================================
// TELA 4 - OCASIÕES
// ============================================================================

export const OCCASION_OPTIONS: ChipOption[] = [
  // Social / Vibe Noturna
  { id: 'cervejinha', label: 'Cervejinha com amigos', emoji: '🍺', group: 'social' },
  { id: 'musica-ao-vivo', label: 'Música ao vivo', emoji: '🎵', group: 'social' },
  { id: 'bons-drinks', label: 'Bons drinks / coquetelaria', emoji: '🍸', group: 'social' },
  { id: 'happy-hour', label: 'Happy hour', emoji: '🥂', group: 'social' },
  { id: 'lugares-hypados', label: 'Lugares hypados', emoji: '🔥', group: 'social' },
  { id: 'fome-madruga', label: 'Fome na madruga', emoji: '🌙', group: 'social' },
  // Trabalho / Negócio
  { id: 'almoco-negocios', label: 'Almoço de negócios', emoji: '💼', group: 'trabalho' },
  { id: 'almoco-trabalho', label: 'Almoço do trabalho', emoji: '🍽️', group: 'trabalho' },
  { id: 'cafe-trabalhar', label: 'Café para trabalhar', emoji: '💻', group: 'trabalho' },
  // Ação do Amor
  { id: 'date', label: 'Bom pra date', emoji: '❤️', group: 'amor' },
  { id: 'aniversario', label: 'Comemorar aniversário', emoji: '🎂', group: 'amor' },
  { id: 'levar-gringo', label: 'Levar um gringo', emoji: '🌍', group: 'amor' },
  // Família / Conforto
  { id: 'em-familia', label: 'Em família', emoji: '👨‍👩‍👧‍👦', group: 'familia' },
  { id: 'domingao', label: 'Domingão à noite', emoji: '🌅', group: 'familia' },
  { id: 'comida-afetiva', label: 'Comida afetiva / caseira', emoji: '🏠', group: 'familia' },
  { id: 'family-friendly', label: 'Family-friendly', emoji: '👶', group: 'familia' },
  // Outras Vibes
  { id: 'lanche-rapido', label: 'Comida / lanche rápido', emoji: '⚡', group: 'outras' },
  { id: 'adocar-boca', label: 'Adoçar a boca', emoji: '🍰', group: 'outras' },
  { id: 'visual-foda', label: 'Visual foda', emoji: '📸', group: 'outras' },
  { id: 'brunch', label: 'Brunch', emoji: '🥞', group: 'outras' },
  { id: 'delivery', label: 'Em casa (delivery)', emoji: '🛵', group: 'outras' },
];

export const OCCASION_VALIDATION: ChipValidation = {
  min: 2,
  max: 5,
  message: 'Escolha de 2 a 5 opções',
};

export const OCCASION_GROUPS = [
  { id: 'social', label: '🥂 Social / Vibe Noturna' },
  { id: 'trabalho', label: '💼 Trabalho / Negócio' },
  { id: 'amor', label: '❤️ Ação do Amor' },
  { id: 'familia', label: '👨‍👩‍👧‍👦 Família / Conforto' },
  { id: 'outras', label: '⚡ Outras Vibes' },
];

// ============================================================================
// TELA 5 - SEU JEITO
// ============================================================================

export const FREQUENCY_OPTIONS: ChipOption[] = [
  { id: '1x-mes', label: '1x por mês ou menos', emoji: '📅' },
  { id: 'algumas-mes', label: 'Algumas vezes por mês', emoji: '📆' },
  { id: '1x-semana', label: '1x por semana', emoji: '🗓️' },
  { id: 'algumas-semana', label: 'Algumas vezes por semana', emoji: '📋' },
  { id: 'todo-dia', label: 'Quase todo dia / todo dia', emoji: '🔥' },
];

export const PLACE_TYPE_OPTIONS: ChipOption[] = [
  { id: 'raiz', label: 'Raiz / Comida de verdade', emoji: '🍲' },
  { id: 'tradicional', label: 'Tradicional / Clássicos bem feitos', emoji: '👨‍🍳' },
  { id: 'sofisticado', label: 'Sofisticado / Alta coquetelaria', emoji: '✨' },
  { id: 'visual-foda', label: 'Visual foda / Instagramável', emoji: '📸' },
  { id: 'fora-obvio', label: 'Fora do óbvio / Escondido', emoji: '🔍' },
  { id: 'hypado', label: 'Hypado / Disputado', emoji: '🔥' },
  { id: 'pequeno', label: 'Pequeno e intimista', emoji: '🕯️' },
  { id: 'cafe-rapido', label: 'Café rápido / No balcão', emoji: '☕' },
  { id: 'family-friendly', label: 'Family-friendly', emoji: '👶' },
];

export const PLACE_TYPE_VALIDATION: ChipValidation = {
  min: 2,
  max: 5,
  message: 'Escolha de 2 a 5 opções',
};

export const DECISION_STYLE_OPTIONS: ChipOption[] = [
  { id: 'planejar', label: 'De planejar com antecedência', emoji: '📝' },
  { id: 'cima-hora', label: 'De decidir em cima da hora', emoji: '⚡' },
  { id: 'repetir', label: 'De repetir lugar que gostou', emoji: '🔄' },
  { id: 'testar-novos', label: 'De testar lugares novos', emoji: '🆕' },
];

export const DECISION_STYLE_VALIDATION: ChipValidation = {
  min: 1,
  max: 2,
  message: 'Escolha 1 ou 2 opções',
};

// ============================================================================
// TELA 6 - RESTRIÇÕES
// ============================================================================

export const RESTRICTION_OPTIONS: ChipOption[] = [
  { id: 'none', label: 'Não tenho restrições', emoji: '✅' },
  { id: 'vegetariano', label: 'Vegetariano', emoji: '🥗' },
  { id: 'vegano', label: 'Vegano', emoji: '🌱' },
  { id: 'sem-lactose', label: 'Sem lactose', emoji: '🥛' },
  { id: 'sem-gluten', label: 'Sem glúten', emoji: '🌾' },
  { id: 'sem-frutos-mar', label: 'Sem frutos do mar', emoji: '🦐' },
  { id: 'sem-amendoim', label: 'Sem amendoim', emoji: '🥜' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
];

// ============================================================================
// TEXTOS DAS TELAS
// ============================================================================

export const STEP_CONTENT = {
  welcome: {
    title: 'Pra quem tem fomí de comer bem',
    subtitle: 'Descubra os melhores lugares da cidade com recomendações da comunidade.',
    cta: 'Começar',
    secondaryCta: 'Já tenho conta',
  },
  signup: {
    title: 'Criar conta',
    subtitle: 'Crie seu perfil pra salvar seus lugares favoritos e receber recomendações da comunidade de quem come bem.',
    cta: 'Criar conta e continuar',
  },
  profile: {
    title: 'Vamos te conhecer mais um pouco, bem rapidinho!',
    subtitle: 'Isso ajuda a personalizar suas recomendações.',
    cta: 'Continuar',
    locationTitle: 'Quer que a gente use sua localização?',
    locationText: 'A gente usa isso só pra te sugerir lugares perto de você. Você pode mudar isso nas configurações depois.',
  },
  cuisines: {
    title: 'O que você não curte comer?',
    subtitle: 'Vamos evitar recomendar o que não combina com você.',
    cta: 'Continuar',
    helper: 'Opcional - pule se curte tudo!',
  },
  occasions: {
    title: 'O que "ativa" você a sair para comer?',
    subtitle: 'Escolha de 2 a 5 ocasiões que mais combinam com sua rotina.',
    cta: 'Continuar',
  },
  style: {
    title: 'Agora, vamos afinar o radar',
    subtitle: 'Entenda melhor seu jeito de escolher lugares.',
    frequencyQuestion: 'Com que frequência você costuma sair pra comer fora?',
    placeTypeQuestion: 'Qual o tipo de lugar que mais combina com você?',
    placeTypeHelper: 'Pode escolher mais de um! Misturar é que conta 😉',
    decisionQuestion: 'Quando você sai pra comer, você é mais...',
    cta: 'Continuar',
  },
  restrictions: {
    title: 'Alguma restrição alimentar?',
    subtitle: 'Isso nos ajuda a evitar recomendações que não funcionam pra você.',
    cta: 'Continuar',
  },
  summary: {
    title: 'Tudo pronto pra comer bem com a FOMÍ',
    subtitle: 'Confira o resumo do seu perfil.',
    notificationLabel: 'Quero receber avisos sobre lugares com a minha cara',
    notificationHelper: 'Poucas notificações, só o que for relevante.',
    betaLabel: 'Topa participar de testes da comunidade FOMÍ?',
    emailWarning: 'Na próxima etapa vamos te pedir pra confirmar seu e-mail. É rapidinho e ajuda a manter a comunidade segura.',
    cta: 'Continuar',
  },
  emailConfirm: {
    title: 'Confirme seu e-mail pra liberar tudo',
    cta: 'Abrir meu e-mail',
    resendCta: 'Reenviar e-mail',
    skipCta: 'Pular por enquanto',
  },
} as const;

// ============================================================================
// VALIDAÇÃO DE USERNAME
// ============================================================================

export const USERNAME_REGEX = /^[a-zA-Z0-9._]{3,}$/;
export const USERNAME_HELP = 'Esse será o seu @ na comunidade. Ex.: @joaosouza';
export const PASSWORD_MIN_LENGTH = 8;