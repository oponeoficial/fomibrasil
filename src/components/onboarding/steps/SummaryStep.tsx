/**
 * FOMÍ - Summary Step (Tela 7)
 * Resumo do perfil + consentimentos
 */

import { motion } from 'framer-motion';
import { Info, Bell, FlaskConical, MapPin, XCircle, Sparkles, Check } from 'lucide-react';
import type { OnboardingData } from '../types';
import { STEP_CONTENT, CUISINE_OPTIONS, OCCASION_OPTIONS } from '../constants';
import { StepHeader } from '../components/UI';

interface SummaryStepProps {
  data: OnboardingData;
  updateData: (partial: Partial<OnboardingData>) => void;
  stepIndex: number;
  totalSteps: number;
  onBack?: () => void;
  error: string | null;
}

export function SummaryStep({
  data,
  updateData,
  stepIndex,
  totalSteps,
  onBack,
  error,
}: SummaryStepProps) {
  const content = STEP_CONTENT.summary;

  // Mapear IDs para labels
  const dislikedLabels = data.dislikedCuisines
    .map((id) => CUISINE_OPTIONS.find((c) => c.id === id)?.label)
    .filter(Boolean);

  const occasionLabels = data.occasions
    .map((id) => OCCASION_OPTIONS.find((o) => o.id === id)?.label)
    .filter(Boolean);

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
        {/* Profile Summary Card */}
        <motion.div 
          variants={itemVariants}
          className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-6 border border-gray/10 shadow-sm"
        >
          <h4 className="font-semibold text-dark mb-4 flex items-center gap-2">
            <Sparkles size={18} className="text-red" />
            Seu perfil
          </h4>

          <div className="space-y-4">
            {/* Location */}
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center flex-shrink-0">
                <MapPin size={16} className="text-red" />
              </div>
              <div>
                <p className="text-xs text-gray">Cidade / Bairro</p>
                <p className="font-medium text-dark">
                  {data.city}, {data.neighborhood}
                </p>
              </div>
            </div>

            {/* Disliked cuisines */}
            {dislikedLabels.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center flex-shrink-0">
                  <XCircle size={16} className="text-red" />
                </div>
                <div>
                  <p className="text-xs text-gray">Não curte</p>
                  <p className="font-medium text-dark">
                    {dislikedLabels.slice(0, 3).join(', ')}
                    {dislikedLabels.length > 3 && ` +${dislikedLabels.length - 3}`}
                  </p>
                </div>
              </div>
            )}

            {/* Occasions */}
            {occasionLabels.length > 0 && (
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-red/10 flex items-center justify-center flex-shrink-0">
                  <Sparkles size={16} className="text-red" />
                </div>
                <div>
                  <p className="text-xs text-gray">Ocasiões</p>
                  <p className="font-medium text-dark">
                    {occasionLabels.slice(0, 3).join(', ')}
                    {occasionLabels.length > 3 && ` +${occasionLabels.length - 3}`}
                  </p>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Consents */}
        <motion.div variants={itemVariants} className="space-y-3">
          {/* Notifications */}
          <motion.button
            type="button"
            onClick={() => updateData({ notificationsEnabled: !data.notificationsEnabled })}
            className={`
              w-full p-4 rounded-2xl border-2 flex items-start gap-4 text-left transition-all
              ${data.notificationsEnabled 
                ? 'border-red bg-red/5' 
                : 'border-gray/20 bg-white'
              }
            `}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${data.notificationsEnabled ? 'bg-red' : 'bg-gray/10'}
            `}>
              <Bell size={20} className={data.notificationsEnabled ? 'text-white' : 'text-gray'} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-dark">
                Quero receber avisos sobre lugares com a minha cara
              </p>
              <p className="text-xs text-gray mt-1">
                Poucas notificações, só o que for relevante.
              </p>
            </div>
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${data.notificationsEnabled 
                ? 'border-red bg-red' 
                : 'border-gray/30'
              }
            `}>
              {data.notificationsEnabled && <Check size={14} className="text-white" />}
            </div>
          </motion.button>

          {/* Beta Tester */}
          <motion.button
            type="button"
            onClick={() => updateData({ betaTesterEnabled: !data.betaTesterEnabled })}
            className={`
              w-full p-4 rounded-2xl border-2 flex items-start gap-4 text-left transition-all
              ${data.betaTesterEnabled 
                ? 'border-red bg-red/5' 
                : 'border-gray/20 bg-white'
              }
            `}
            whileTap={{ scale: 0.99 }}
          >
            <div className={`
              w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
              ${data.betaTesterEnabled ? 'bg-red' : 'bg-gray/10'}
            `}>
              <FlaskConical size={20} className={data.betaTesterEnabled ? 'text-white' : 'text-gray'} />
            </div>
            <div className="flex-1">
              <p className="font-medium text-dark">
                Topa participar de testes da comunidade FOMÍ?
              </p>
              <p className="text-xs text-gray mt-1">
                Ajude a moldar o futuro do app.
              </p>
            </div>
            <div className={`
              w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0
              ${data.betaTesterEnabled 
                ? 'border-red bg-red' 
                : 'border-gray/30'
              }
            `}>
              {data.betaTesterEnabled && <Check size={14} className="text-white" />}
            </div>
          </motion.button>
        </motion.div>

        {/* Info about email */}
        <motion.div
          variants={itemVariants}
          className="flex items-center gap-3 p-4 rounded-xl bg-blue-50 border border-blue-200"
        >
          <Info size={20} className="text-blue-600 flex-shrink-0" />
          <p className="text-sm text-blue-800">
            Na próxima etapa vamos te pedir pra confirmar seu e-mail.
          </p>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-4 rounded-xl bg-red/10 border border-red/20"
          >
            <p className="text-sm text-red text-center">{error}</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}