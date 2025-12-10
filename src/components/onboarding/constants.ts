/**
 * FOMÍ - Onboarding v3 Constants
 * Todas as opções com ícones Lucide
 */

import {
  // Gender
  User,
  Users,
  Sparkles,
  EyeOff,
  // Cuisines
  Flag,
  Sun,
  TreePalm,
  Mountain,
  MapPin,
  Flame,
  Star,
  UtensilsCrossed,
  Wine,
  Fish,
  Landmark,
  Soup,
  Pizza,
  Beef,
  Salad,
  Leaf,
  Sandwich,
  Coffee,
  Croissant,
  // Occasions
  Beer,
  Music,
  Martini,
  PartyPopper,
  TrendingUp,
  Moon,
  Briefcase,
  Laptop,
  Heart,
  Cake,
  Globe,
  Home,
  Sunrise,
  Baby,
  Zap,
  Camera,
  // Frequency
  Calendar,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  // Place types
  ChefHat,
  GlassWater,
  Search,
  Flame as FireIcon,
  CandlestickChart,
  // Decision
  ClipboardList,
  Clock,
  RotateCcw,
  PlusCircle,
  // Restrictions
  Check,
  MilkOff,
  WheatOff,
  Shell,
  Nut,
  // UI
  type LucideIcon,
} from 'lucide-react';

import type { ChipOption, ChipValidation } from './types';

// ============================================================================
// TELA 2 - GÊNERO
// ============================================================================

export const GENDER_OPTIONS: ChipOption[] = [
  {
    id: 'male', label: 'Masculino', icon: User,
    emoji: ''
  },
  {
    id: 'female', label: 'Feminino', icon: User,
    emoji: ''
  },
  {
    id: 'prefer-not', label: 'Prefiro não dizer', icon: EyeOff,
    emoji: ''
  },
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
  {
    id: 'brasileira', label: 'Brasileira', icon: Flag, group: 'brasileira',
    emoji: ''
  },
  {
    id: 'nordestina', label: 'Nordestina', icon: Sun, group: 'brasileira',
    emoji: ''
  },
  {
    id: 'baiana', label: 'Baiana', icon: TreePalm, group: 'brasileira',
    emoji: ''
  },
  {
    id: 'mineira', label: 'Mineira', icon: Mountain, group: 'brasileira',
    emoji: ''
  },
  // Internacionais
  {
    id: 'peruana', label: 'Peruana', icon: MapPin, group: 'internacional',
    emoji: ''
  },
  {
    id: 'mexicana', label: 'Mexicana', icon: Flame, group: 'internacional',
    emoji: ''
  },
  {
    id: 'americana', label: 'Americana', icon: Star, group: 'internacional',
    emoji: ''
  },
  {
    id: 'italiana', label: 'Italiana', icon: Pizza, group: 'internacional',
    emoji: ''
  },
  {
    id: 'francesa', label: 'Francesa', icon: Wine, group: 'internacional',
    emoji: ''
  },
  {
    id: 'japonesa', label: 'Japonesa', icon: Fish, group: 'internacional',
    emoji: ''
  },
  // Asiáticas
  {
    id: 'arabe', label: 'Árabe', icon: Landmark, group: 'asiatica',
    emoji: ''
  },
  {
    id: 'asiatica', label: 'Asiática', icon: Soup, group: 'asiatica',
    emoji: ''
  },
  {
    id: 'chinesa', label: 'Chinesa', icon: UtensilsCrossed, group: 'asiatica',
    emoji: ''
  },
  // Por tipo
  {
    id: 'hamburgueria', label: 'Hamburgueria / Lanche', icon: Sandwich, group: 'tipo',
    emoji: ''
  },
  {
    id: 'pizzaria', label: 'Pizzaria', icon: Pizza, group: 'tipo',
    emoji: ''
  },
  {
    id: 'frutos-mar', label: 'Peixes e frutos do mar', icon: Shell, group: 'tipo',
    emoji: ''
  },
  {
    id: 'carnes', label: 'Carnes', icon: Beef, group: 'tipo',
    emoji: ''
  },
  // Dietas
  {
    id: 'vegetariana', label: 'Vegetariana', icon: Salad, group: 'dieta',
    emoji: ''
  },
  {
    id: 'vegana', label: 'Vegana', icon: Leaf, group: 'dieta',
    emoji: ''
  },
  // Outros
  {
    id: 'sanduiches', label: 'Sanduíches', icon: Sandwich, group: 'outros',
    emoji: ''
  },
  {
    id: 'cafes-doces', label: 'Cafés e doces', icon: Coffee, group: 'outros',
    emoji: ''
  },
  {
    id: 'padaria', label: 'Padaria', icon: Croissant, group: 'outros',
    emoji: ''
  },
];

// ============================================================================
// TELA 4 - OCASIÕES
// ============================================================================

export const OCCASION_OPTIONS: ChipOption[] = [
  // Social / Vibe Noturna
  {
    id: 'cervejinha', label: 'Cervejinha com amigos', icon: Beer, group: 'social',
    emoji: ''
  },
  {
    id: 'musica-ao-vivo', label: 'Música ao vivo', icon: Music, group: 'social',
    emoji: ''
  },
  {
    id: 'bons-drinks', label: 'Bons drinks / coquetelaria', icon: Martini, group: 'social',
    emoji: ''
  },
  {
    id: 'happy-hour', label: 'Happy hour', icon: PartyPopper, group: 'social',
    emoji: ''
  },
  {
    id: 'lugares-hypados', label: 'Lugares hypados', icon: TrendingUp, group: 'social',
    emoji: ''
  },
  {
    id: 'fome-madruga', label: 'Fome na madruga', icon: Moon, group: 'social',
    emoji: ''
  },
  // Trabalho / Negócio
  {
    id: 'almoco-negocios', label: 'Almoço de negócios', icon: Briefcase, group: 'trabalho',
    emoji: ''
  },
  {
    id: 'almoco-trabalho', label: 'Almoço do trabalho', icon: UtensilsCrossed, group: 'trabalho',
    emoji: ''
  },
  {
    id: 'cafe-trabalhar', label: 'Café para trabalhar', icon: Laptop, group: 'trabalho',
    emoji: ''
  },
  // Ação do Amor
  {
    id: 'date', label: 'Bom pra date', icon: Heart, group: 'amor',
    emoji: ''
  },
  {
    id: 'aniversario', label: 'Comemorar aniversário', icon: Cake, group: 'amor',
    emoji: ''
  },
  {
    id: 'levar-gringo', label: 'Levar um gringo', icon: Globe, group: 'amor',
    emoji: ''
  },
  // Família / Conforto
  {
    id: 'em-familia', label: 'Em família', icon: Users, group: 'familia',
    emoji: ''
  },
  {
    id: 'domingao', label: 'Domingão à noite', icon: Sunrise, group: 'familia',
    emoji: ''
  },
  {
    id: 'comida-afetiva', label: 'Comida afetiva / caseira', icon: Home, group: 'familia',
    emoji: ''
  },
  {
    id: 'family-friendly', label: 'Family-friendly', icon: Baby, group: 'familia',
    emoji: ''
  },
  // Outras Vibes
  {
    id: 'lanche-rapido', label: 'Comida / lanche rápido', icon: Zap, group: 'outras',
    emoji: ''
  },
  {
    id: 'adocar-boca', label: 'Adoçar a boca', icon: Cake, group: 'outras',
    emoji: ''
  },
  {
    id: 'visual-foda', label: 'Visual foda', icon: Camera, group: 'outras',
    emoji: ''
  },
  {
    id: 'brunch', label: 'Brunch', icon: Coffee, group: 'outras',
    emoji: ''
  },
  {
    id: 'delivery', label: 'Em casa (delivery)', icon: Home, group: 'outras',
    emoji: ''
  },
];

export const OCCASION_VALIDATION: ChipValidation = {
  min: 2,
  max: 5,
  message: 'Escolha de 2 a 5 opções',
};

export const OCCASION_GROUPS = [
  { id: 'social', label: 'Social / Vibe Noturna', icon: PartyPopper },
  { id: 'trabalho', label: 'Trabalho / Negócio', icon: Briefcase },
  { id: 'amor', label: 'Ação do Amor', icon: Heart },
  { id: 'familia', label: 'Família / Conforto', icon: Users },
  { id: 'outras', label: 'Outras Vibes', icon: Zap },
];

// ============================================================================
// TELA 5 - SEU JEITO
// ============================================================================

export const FREQUENCY_OPTIONS: ChipOption[] = [
  {
    id: '1x-mes', label: '1x por mês ou menos', icon: Calendar,
    emoji: ''
  },
  {
    id: 'algumas-mes', label: 'Algumas vezes por mês', icon: CalendarDays,
    emoji: ''
  },
  {
    id: '1x-semana', label: '1x por semana', icon: CalendarCheck,
    emoji: ''
  },
  {
    id: 'algumas-semana', label: 'Algumas vezes por semana', icon: CalendarClock,
    emoji: ''
  },
  {
    id: 'todo-dia', label: 'Quase todo dia', icon: Flame,
    emoji: ''
  },
];

export const PLACE_TYPE_OPTIONS: ChipOption[] = [
  {
    id: 'raiz', label: 'Raiz / Comida de verdade', icon: Soup,
    emoji: ''
  },
  {
    id: 'tradicional', label: 'Tradicional / Clássicos', icon: ChefHat,
    emoji: ''
  },
  {
    id: 'sofisticado', label: 'Sofisticado / Alta coquetelaria', icon: GlassWater,
    emoji: ''
  },
  {
    id: 'visual-foda', label: 'Visual foda / Instagramável', icon: Camera,
    emoji: ''
  },
  {
    id: 'fora-obvio', label: 'Fora do óbvio / Escondido', icon: Search,
    emoji: ''
  },
  {
    id: 'hypado', label: 'Hypado / Disputado', icon: TrendingUp,
    emoji: ''
  },
  {
    id: 'pequeno', label: 'Pequeno e intimista', icon: CandlestickChart,
    emoji: ''
  },
  {
    id: 'cafe-rapido', label: 'Café rápido / No balcão', icon: Coffee,
    emoji: ''
  },
  {
    id: 'family-friendly', label: 'Family-friendly', icon: Baby,
    emoji: ''
  },
];

export const PLACE_TYPE_VALIDATION: ChipValidation = {
  min: 2,
  max: 5,
  message: 'Escolha de 2 a 5 opções',
};

export const DECISION_STYLE_OPTIONS: ChipOption[] = [
  {
    id: 'planejar', label: 'De planejar com antecedência', icon: ClipboardList,
    emoji: ''
  },
  {
    id: 'cima-hora', label: 'De decidir em cima da hora', icon: Zap,
    emoji: ''
  },
  {
    id: 'repetir', label: 'De repetir lugar que gostou', icon: RotateCcw,
    emoji: ''
  },
  {
    id: 'testar-novos', label: 'De testar lugares novos', icon: PlusCircle,
    emoji: ''
  },
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
  {
    id: 'none', label: 'Não tenho restrições', icon: Check,
    emoji: ''
  },
  {
    id: 'vegetariano', label: 'Vegetariano', icon: Salad,
    emoji: ''
  },
  {
    id: 'vegano', label: 'Vegano', icon: Leaf,
    emoji: ''
  },
  {
    id: 'sem-lactose', label: 'Sem lactose', icon: MilkOff,
    emoji: ''
  },
  {
    id: 'sem-gluten', label: 'Sem glúten', icon: WheatOff,
    emoji: ''
  },
  {
    id: 'sem-frutos-mar', label: 'Sem frutos do mar', icon: Shell,
    emoji: ''
  },
  {
    id: 'sem-amendoim', label: 'Sem amendoim', icon: Nut,
    emoji: ''
  },
  {
    id: 'kosher', label: 'Kosher', icon: Star,
    emoji: ''
  },
  {
    id: 'halal', label: 'Halal', icon: Moon,
    emoji: ''
  },
];

// ============================================================================
// TEXTOS DAS TELAS
// ============================================================================

export const STEP_CONTENT = {
  signup: {
    title: 'Criar conta',
    subtitle: 'Crie seu perfil pra salvar seus lugares favoritos e receber recomendações da comunidade.',
    cta: 'Criar conta e continuar',
  },
  profile: {
    title: 'Vamos te conhecer melhor',
    subtitle: 'Isso ajuda a personalizar suas recomendações.',
    cta: 'Continuar',
    locationTitle: 'Quer usar sua localização?',
    locationText: 'Usamos só pra sugerir lugares perto de você.',
  },
  cuisines: {
    title: 'O que você não curte?',
    subtitle: 'Vamos evitar recomendar o que não combina com você.',
    cta: 'Continuar',
    helper: 'Opcional - pule se curte tudo!',
  },
  occasions: {
    title: 'O que te ativa a sair pra comer?',
    subtitle: 'Escolha de 2 a 5 ocasiões que mais combinam com você.',
    cta: 'Continuar',
  },
  style: {
    title: 'Vamos afinar o radar',
    subtitle: 'Entenda melhor seu jeito de escolher lugares.',
    cta: 'Continuar',
    frequencyQuestion: 'Quantas vezes você come fora?',
    placeTypeQuestion: 'Que tipo de lugar você curte?',
    placeTypeHelper: 'Escolha de 2 a 5 opções',
    decisionQuestion: 'Você é mais...',
  },
  restrictions: {
    title: 'Alguma restrição alimentar?',
    subtitle: 'Vamos garantir que as sugestões funcionem pra você.',
    cta: 'Continuar',
  },
  summary: {
    title: 'Tudo pronto!',
    subtitle: 'Confira o resumo do seu perfil.',
    cta: 'Finalizar',
  },
  emailConfirm: {
    title: 'Conta criada!',
    subtitle: 'Agora é só fazer login e começar a explorar.',
    cta: 'Ir para login',
  },
};

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

export const USERNAME_REGEX = /^[a-z0-9._]{3,20}$/;
export const USERNAME_HELP = 'Esse será o seu @ na comunidade. Ex.: @joaosouza';
export const PASSWORD_MIN_LENGTH = 8;