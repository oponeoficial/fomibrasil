/**
 * FOMÍ - Email Confirm Step (Tela 8)
 * Tela de sucesso com animação de celebração
 */

import { motion } from 'framer-motion';
import { PartyPopper, Mail, ArrowRight } from 'lucide-react';
import { STEP_CONTENT } from '../constants';
import { CTAButton } from '../components/UI';

interface EmailConfirmStepProps {
  email: string;
  onFinish: () => void;
}

export function EmailConfirmStep({ email, onFinish }: EmailConfirmStepProps) {
  const content = STEP_CONTENT.emailConfirm;

  return (
    <div className="min-h-screen bg-gradient-to-b from-cream to-white flex flex-col">
      {/* Content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        {/* Animated icon */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ 
            type: 'spring', 
            stiffness: 200, 
            damping: 15,
            delay: 0.2 
          }}
          className="relative mb-8"
        >
          {/* Background glow */}
          <motion.div
            className="absolute inset-0 bg-red/20 rounded-full blur-2xl"
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
          
          {/* Icon container */}
          <div className="relative w-24 h-24 bg-gradient-to-br from-red to-orange-400 rounded-3xl flex items-center justify-center shadow-xl shadow-red/30">
            <PartyPopper size={48} className="text-white" />
          </div>

          {/* Floating particles */}
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 rounded-full bg-red"
              style={{
                top: '50%',
                left: '50%',
              }}
              animate={{
                x: [0, (i % 2 ? 1 : -1) * (30 + i * 10)],
                y: [0, -40 - i * 10],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 1,
                delay: 0.5 + i * 0.1,
                repeat: Infinity,
                repeatDelay: 2,
              }}
            />
          ))}
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-3xl font-display font-bold text-dark text-center mb-4"
        >
          {content.title}
        </motion.h1>

        {/* Email info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center max-w-sm"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gray/10 mb-4">
            <Mail size={16} className="text-gray" />
            <span className="text-sm font-medium text-dark">{email}</span>
          </div>
          
          <p className="text-gray leading-relaxed">
            {content.subtitle}
          </p>
        </motion.div>

        {/* Features preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="mt-12 grid grid-cols-3 gap-4 w-full max-w-sm"
        >
          {[
            { icon: '🍽️', label: 'Descobrir' },
            { icon: '❤️', label: 'Salvar' },
            { icon: '👥', label: 'Compartilhar' },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white shadow-sm border border-gray/10"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.7 + i * 0.1 }}
            >
              <span className="text-2xl">{item.icon}</span>
              <span className="text-xs font-medium text-gray">{item.label}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* CTA */}
      <motion.div
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ delay: 0.8 }}
        className="p-6 bg-gradient-to-t from-white via-white to-transparent pt-12"
      >
        <CTAButton onClick={onFinish}>
          <span>Começar a explorar</span>
          <ArrowRight size={20} />
        </CTAButton>
      </motion.div>
    </div>
  );
}