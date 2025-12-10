/**
 * FOMÍ - Onboarding v2 Types
 */

export type OnboardingStep = 
  | 'signup'
  | 'profile'
  | 'cuisines'
  | 'occasions'
  | 'style'
  | 'restrictions'
  | 'summary'
  | 'email-confirm';

export const STEP_ORDER: OnboardingStep[] = [
  'signup',
  'profile',
  'cuisines',
  'occasions',
  'style',
  'restrictions',
  'summary',
  'email-confirm',
];

export interface ChipOption {
  [x: string]: any;
  id: string;
  label: string;
  emoji: string;
  group?: string;
}

export interface ChipValidation {
  min: number;
  max: number;
  message: string;
}

export interface OnboardingData {
  [x: string]: any;
  // Tela 1 - Signup
  firstName: string; // Nome completo
  username: string;
  email: string;
  password: string;

  // Tela 2 - Profile
  birthDate: string;
  gender: string | null;
  city: string;
  neighborhood: string;
  latitude: number | null;
  longitude: number | null;
  locationPermission: boolean;

  // Tela 3 - Cuisines (filtro negativo)
  dislikedCuisines: string[];

  // Tela 4 - Occasions
  occasions: string[];

  // Tela 5 - Style
  frequency: string | null;
  placeTypes: string[];
  decisionStyle: string[];

  // Tela 6 - Restrictions
  restrictions: string[];

  // Tela 7 - Consents
  notificationsEnabled: boolean;
  betaTesterEnabled: boolean;
}

export const INITIAL_DATA: OnboardingData = {
  firstName: '',
  username: '',
  email: '',
  password: '',
  birthDate: '',
  gender: null,
  city: '',
  neighborhood: '',
  latitude: null,
  longitude: null,
  locationPermission: false,
  dislikedCuisines: [],
  occasions: [],
  frequency: null,
  placeTypes: [],
  decisionStyle: [],
  restrictions: ['none'],
  notificationsEnabled: true,
  betaTesterEnabled: false,
};