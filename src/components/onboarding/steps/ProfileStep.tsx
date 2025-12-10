/**
 * FOMÍ - Profile Step (Tela 2)
 * Visual redesenhado com animações
 */

import { motion } from 'framer-motion';
import { MapPin, Locate } from 'lucide-react';
import type { OnboardingData } from '../types';
import { STEP_CONTENT, GENDER_OPTIONS, CITIES } from '../constants';
import { StepHeader, SectionTitle } from '../components/UI';
import { ChipSelector } from '../components/ChipSelector';

interface ProfileStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  onRequestLocation: () => Promise<void>;
  error: string | null;
}

export function ProfileStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
  onRequestLocation,
}: ProfileStepProps) {
  const content = STEP_CONTENT.profile;

  const handleGenderChange = (selected: string[]) => {
    updateData({ gender: selected[0] || null });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <div>
      <StepHeader
        title={content.title}
        subtitle={content.subtitle}
        showBack={!!onBack}
        onBack={onBack}
        stepIndex={stepIndex}
        totalSteps={totalSteps}
      />

      <motion.div 
        className="space-y-6"
        variants={containerVariants}
        initial="hidden"
        animate="show"
      >
        {/* Data de nascimento */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Data de nascimento <span className="text-red">*</span>
          </label>
          <input
            type="date"
            value={data.birthDate}
            onChange={(e) => updateData({ birthDate: e.target.value })}
            className="w-full p-4 border-2 border-gray/20 rounded-2xl text-base bg-white outline-none transition-all focus:border-red hover:border-gray/40"
          />
        </motion.div>

        {/* Gênero */}
        <motion.div variants={itemVariants}>
          <SectionTitle subtitle="Opcional">Gênero</SectionTitle>
          <ChipSelector
            options={GENDER_OPTIONS}
            selected={data.gender ? [data.gender] : []}
            onChange={handleGenderChange}
            columns={2}
          />
        </motion.div>

        {/* Cidade */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Em que cidade você mora? <span className="text-red">*</span>
          </label>
          <div className="relative">
            <MapPin size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray" />
            <select
              value={data.city}
              onChange={(e) => updateData({ city: e.target.value })}
              className="w-full p-4 pl-11 border-2 border-gray/20 rounded-2xl text-base bg-white outline-none transition-all focus:border-red hover:border-gray/40 appearance-none cursor-pointer"
            >
              <option value="">Selecione sua cidade</option>
              {CITIES.map((city) => (
                <option key={city} value={city}>{city}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Bairro */}
        <motion.div variants={itemVariants}>
          <label className="block text-sm font-medium text-dark mb-2">
            Qual seu bairro? <span className="text-red">*</span>
          </label>
          <input
            type="text"
            value={data.neighborhood}
            onChange={(e) => updateData({ neighborhood: e.target.value })}
            placeholder="Ex.: Boa Viagem"
            className="w-full p-4 border-2 border-gray/20 rounded-2xl text-base bg-white outline-none transition-all focus:border-red hover:border-gray/40"
          />
        </motion.div>

        {/* Location Request */}
        <motion.div variants={itemVariants}>
          <motion.button
            type="button"
            onClick={onRequestLocation}
            className={`
              w-full p-4 rounded-2xl border-2 flex items-center justify-center gap-3
              transition-all duration-300
              ${data.locationPermission 
                ? 'border-green-500 bg-green-50 text-green-700' 
                : 'border-gray/20 bg-white text-gray hover:border-red/30 hover:text-dark'
              }
            `}
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.99 }}
          >
            <Locate size={20} />
            <span className="font-medium">
              {data.locationPermission 
                ? 'Localização ativada!' 
                : 'Usar minha localização'
              }
            </span>
          </motion.button>
          <p className="text-xs text-gray text-center mt-2">
            {content.locationText}
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}