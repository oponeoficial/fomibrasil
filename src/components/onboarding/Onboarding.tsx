/**
 * FOMÍ - Onboarding Unificado
 * 
 * Implementa passos 2-6 do documento de onboarding.
 * Passo 0 (Welcome) e 1 (Signup) são componentes separados.
 * 
 * Steps internos:
 * 0 - Dados básicos (data nascimento, gênero, cidade, bairro)
 * 1 - Cozinhas que NÃO gosta
 * 2 - Ocasiões favoritas  
 * 3 - Preferências finas (preço, vibe, estilo decisão)
 * 4 - Restrições alimentares
 * 5 - Permissões & fechamento
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Loader2, Check, MapPin } from 'lucide-react';
import { supabase } from '../../lib/supabase';

// ============================================================================
// TYPES
// ============================================================================

interface Tag {
  id: string;
  type: string;
  slug: string;
  name: string;
  icon: string;
  category: string;
}

interface OnboardingData {
  // Step 0 - Dados básicos
  data_nascimento: string;
  genero: string;
  cidade: string;
  bairro: string;
  // Step 1 - Cozinhas
  cozinhas_nao_gosta: string[];
  cozinhas_favoritas: string[];
  // Step 2 - Ocasiões
  ocasioes_favoritas: string[];
  // Step 3 - Preferências
  faixa_preco_preferida: string[];
  vibe_preferida: string[];
  estilo_decisao: string;
  // Step 4 - Restrições
  restricoes_alimentares: string[];
  sem_restricoes: boolean;
  // Step 5 - Permissões
  aceita_notificacoes: boolean;
  aceita_experimentos: boolean;
}

type StepId = 'dados' | 'cozinhas' | 'ocasioes' | 'preferencias' | 'restricoes' | 'permissoes';

const STEPS: StepId[] = ['dados', 'cozinhas', 'ocasioes', 'preferencias', 'restricoes', 'permissoes'];

const STEP_CONFIG: Record<StepId, { title: string; subtitle: string }> = {
  dados: {
    title: 'Vamos te conhecer rapidinho',
    subtitle: 'Prometo que é coisa de 1 minutinho.',
  },
  cozinhas: {
    title: 'O que você não curte comer?',
    subtitle: 'Escolha as cozinhas que você costuma evitar.',
  },
  ocasioes: {
    title: 'Em quais momentos você mais sai para comer?',
    subtitle: 'Escolha as ocasiões que mais combinam com sua rotina.',
  },
  preferencias: {
    title: 'Agora, vamos afinar o radar',
    subtitle: 'Fala pra gente o tipo de experiência que mais combina com você.',
  },
  restricoes: {
    title: 'Alguma restrição alimentar?',
    subtitle: 'Isso nos ajuda a evitar ciladas.',
  },
  permissoes: {
    title: 'Tudo pronto pra comer bem com a FOMÍ',
    subtitle: 'Usamos o que você contou pra te sugerir lugares com a sua cara.',
  },
};

const GENERO_OPTIONS = [
  { id: 'feminino', label: 'Feminino' },
  { id: 'masculino', label: 'Masculino' },
  { id: 'nao-binario', label: 'Não-binário' },
  { id: 'prefiro-nao-dizer', label: 'Prefiro não dizer' },
  { id: 'outro', label: 'Outro' },
];

const PRECO_OPTIONS = [
  { id: '$', label: 'Mais em conta', icon: '$' },
  { id: '$$$', label: 'Médio', icon: '$$$' },
  { id: '$$$$$', label: 'Caro', icon: '$$$$$' },
];

const ESTILO_DECISAO_OPTIONS = [
  { id: 'planeja', label: 'De planejar com antecedência', icon: '📅' },
  { id: 'improvisa', label: 'De decidir em cima da hora', icon: '⚡' },
  { id: 'repete', label: 'De repetir lugar que gostou', icon: '🔄' },
  { id: 'explora', label: 'De testar sempre lugares novos', icon: '🧭' },
];

// ============================================================================
// COMPONENT
// ============================================================================

export const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  
  // State
  const [currentStep, setCurrentStep] = useState(0);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Tags from DB
  const [cuisineTags, setCuisineTags] = useState<Tag[]>([]);
  const [occasionTags, setOccasionTags] = useState<Tag[]>([]);
  const [vibeTags, setVibeTags] = useState<Tag[]>([]);
  const [restrictionTags, setRestrictionTags] = useState<Tag[]>([]);
  
  // Form data
  const [data, setData] = useState<OnboardingData>({
    data_nascimento: '',
    genero: '',
    cidade: 'Recife',
    bairro: '',
    cozinhas_nao_gosta: [],
    cozinhas_favoritas: [],
    ocasioes_favoritas: [],
    faixa_preco_preferida: [],
    vibe_preferida: [],
    estilo_decisao: '',
    restricoes_alimentares: [],
    sem_restricoes: false,
    aceita_notificacoes: true,
    aceita_experimentos: false,
  });

  const stepId = STEPS[currentStep];
  const config = STEP_CONFIG[stepId];

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Fetch tags on mount
  useEffect(() => {
    const fetchTags = async () => {
      setLoading(true);
      try {
        // Tabela 'tags' existe mas tipos Supabase não estão atualizados
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const supabaseAny = supabase as any;
        const { data: tags, error: tagsError } = await supabaseAny
          .from('tags')
          .select('*')
          .eq('is_active', true)
          .order('sort_order', { ascending: true });

        if (tagsError) throw tagsError;

        const typedTags = (tags || []) as Tag[];
        setCuisineTags(typedTags.filter((t) => t.type === 'cuisine'));
        setOccasionTags(typedTags.filter((t) => t.type === 'occasion'));
        setVibeTags(typedTags.filter((t) => t.type === 'vibe'));
        setRestrictionTags(typedTags.filter((t) => t.type === 'restriction'));
      } catch (err) {
        console.error('Error fetching tags:', err);
        setError('Erro ao carregar opções');
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
  }, []);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const toggleArrayValue = (field: keyof OnboardingData, value: string) => {
    setData((prev) => {
      const current = prev[field] as string[];
      return {
        ...prev,
        [field]: current.includes(value)
          ? current.filter((v) => v !== value)
          : [...current, value],
      };
    });
  };

  const canProceed = (): boolean => {
    switch (stepId) {
      case 'dados':
        return !!(data.data_nascimento && data.cidade);
      case 'cozinhas':
        return true; // Opcional
      case 'ocasioes':
        return data.ocasioes_favoritas.length >= 1;
      case 'preferencias':
        return data.faixa_preco_preferida.length >= 1;
      case 'restricoes':
        return data.sem_restricoes || data.restricoes_alimentares.length >= 1;
      case 'permissoes':
        return true;
      default:
        return false;
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    } else {
      navigate('/signup');
    }
  };

  const handleNext = async () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      await handleComplete();
    }
  };

  const handleSkip = () => {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const getAgeRange = (age: number): string => {
    if (age < 18) return '< 18';
    if (age <= 24) return '18-24';
    if (age <= 34) return '25-34';
    if (age <= 44) return '35-44';
    if (age <= 54) return '45-54';
    return '55+';
  };

  const handleComplete = async () => {
    setSaving(true);
    setError(null);

    try {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        navigate('/login');
        return;
      }

      const age = data.data_nascimento ? calculateAge(data.data_nascimento) : null;

      const updatePayload: Record<string, unknown> = {
        data_nascimento: data.data_nascimento || null,
        idade: age,
        faixa_etaria: age ? getAgeRange(age) : null,
        genero: data.genero || null,
        city: data.cidade,
        bairro: data.bairro || null,
        cozinhas_nao_gosta: data.cozinhas_nao_gosta,
        cozinhas_favoritas: data.cozinhas_favoritas,
        ocasioes_favoritas: data.ocasioes_favoritas,
        faixa_preco_preferida: data.faixa_preco_preferida,
        vibe_preferida: data.vibe_preferida,
        estilo_decisao: data.estilo_decisao || null,
        restricoes_alimentares: data.restricoes_alimentares,
        sem_restricoes: data.sem_restricoes,
        aceita_notificacoes: data.aceita_notificacoes,
        aceita_experimentos: data.aceita_experimentos,
        onboarding_completed: true,
        onboarding_completed_at: new Date().toISOString(),
      };

      const { error: updateError } = await supabase
        .from('profiles')
        .update(updatePayload)
        .eq('id', userData.user.id);

      if (updateError) throw updateError;

      navigate('/feed');
    } catch (err) {
      console.error('Error saving onboarding:', err);
      setError('Erro ao salvar. Tente novamente.');
    } finally {
      setSaving(false);
    }
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================

  const renderChip = (
    tag: Tag,
    selected: boolean,
    onToggle: () => void,
    showIcon = true
  ) => (
    <button
      key={tag.id}
      onClick={onToggle}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-full text-sm whitespace-nowrap cursor-pointer transition-all ${
        selected
          ? 'border-2 border-red bg-red/10 text-red font-semibold'
          : 'border border-gray/30 bg-white text-dark font-normal'
      }`}
    >
      {showIcon && tag.icon && <span>{tag.icon}</span>}
      <span>{tag.name}</span>
      {selected && <Check size={14} className="ml-1" />}
    </button>
  );

  // ============================================================================
  // RENDER STEPS
  // ============================================================================

  const renderDadosStep = () => (
    <div className="space-y-5">
      {/* Data de nascimento */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Data de nascimento
        </label>
        <input
          type="date"
          value={data.data_nascimento}
          onChange={(e) => setData((prev) => ({ ...prev, data_nascimento: e.target.value }))}
          className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
        />
      </div>

      {/* Gênero */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Gênero <span className="text-gray font-normal">(opcional)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {GENERO_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setData((prev) => ({ ...prev, genero: opt.id }))}
              className={`px-4 py-2.5 rounded-full text-sm cursor-pointer transition-all ${
                data.genero === opt.id
                  ? 'border-2 border-red bg-red/10 text-red font-semibold'
                  : 'border border-gray/30 bg-white text-dark'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cidade */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Cidade
        </label>
        <div className="relative">
          <MapPin size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray" />
          <input
            type="text"
            value={data.cidade}
            onChange={(e) => setData((prev) => ({ ...prev, cidade: e.target.value }))}
            placeholder="Ex: Recife"
            className="w-full p-3.5 pl-10 border border-gray/30 rounded-lg text-base bg-white outline-none"
          />
        </div>
      </div>

      {/* Bairro */}
      <div>
        <label className="block text-sm font-medium text-dark mb-2">
          Bairro <span className="text-gray font-normal">(opcional)</span>
        </label>
        <input
          type="text"
          value={data.bairro}
          onChange={(e) => setData((prev) => ({ ...prev, bairro: e.target.value }))}
          placeholder="Ex: Boa Viagem"
          className="w-full p-3.5 border border-gray/30 rounded-lg text-base bg-white outline-none"
        />
      </div>

      <p className="text-xs text-gray text-center mt-4">
        Usamos esses dados só para deixar as recomendações mais certeiras.
      </p>
    </div>
  );

  const renderCozinhasStep = () => (
    <div className="space-y-6">
      <p className="text-sm text-gray text-center">
        Isso ajuda a gente a não te sugerir lugares que não combinam contigo.
      </p>

      <div className="flex flex-wrap gap-2 justify-center">
        {cuisineTags.map((tag) =>
          renderChip(
            tag,
            data.cozinhas_nao_gosta.includes(tag.slug),
            () => toggleArrayValue('cozinhas_nao_gosta', tag.slug)
          )
        )}
      </div>

      {data.cozinhas_nao_gosta.length > 5 && (
        <p className="text-xs text-red text-center">
          Recomendamos marcar no máximo 5 cozinhas
        </p>
      )}
    </div>
  );

  const renderOcasioesStep = () => {
    // Agrupa por categoria
    const grouped = occasionTags.reduce((acc, tag) => {
      const cat = tag.category || 'Outras';
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(tag);
      return acc;
    }, {} as Record<string, Tag[]>);

    return (
      <div className="space-y-6">
        <p className="text-sm text-gray text-center">
          Escolha de 2 a 5 ocasiões.
        </p>

        {Object.entries(grouped).map(([category, tags]) => (
          <div key={category}>
            <p className="text-xs font-semibold text-gray uppercase tracking-wide mb-2">
              {category}
            </p>
            <div className="flex flex-wrap gap-2">
              {tags.map((tag) =>
                renderChip(
                  tag,
                  data.ocasioes_favoritas.includes(tag.slug),
                  () => toggleArrayValue('ocasioes_favoritas', tag.slug)
                )
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPreferenciasStep = () => (
    <div className="space-y-8">
      {/* Faixa de preço */}
      <div>
        <p className="text-sm font-medium text-dark mb-3">
          Qual faixa de preço você costuma buscar?
        </p>
        <div className="flex gap-3">
          {PRECO_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => toggleArrayValue('faixa_preco_preferida', opt.id)}
              className={`flex-1 py-4 rounded-xl text-center cursor-pointer transition-all ${
                data.faixa_preco_preferida.includes(opt.id)
                  ? 'border-2 border-red bg-red/10'
                  : 'border border-gray/30 bg-white'
              }`}
            >
              <p className={`text-lg font-bold ${data.faixa_preco_preferida.includes(opt.id) ? 'text-red' : 'text-dark'}`}>
                {opt.icon}
              </p>
              <p className="text-xs text-gray mt-1">{opt.label}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Vibe */}
      <div>
        <p className="text-sm font-medium text-dark mb-3">
          Que tipo de lugar tem mais a sua cara?
        </p>
        <div className="flex flex-wrap gap-2">
          {vibeTags.map((tag) =>
            renderChip(
              tag,
              data.vibe_preferida.includes(tag.slug),
              () => toggleArrayValue('vibe_preferida', tag.slug)
            )
          )}
        </div>
      </div>

      {/* Estilo de decisão */}
      <div>
        <p className="text-sm font-medium text-dark mb-3">
          Quando sai pra comer, você é mais...
        </p>
        <div className="space-y-2">
          {ESTILO_DECISAO_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setData((prev) => ({ ...prev, estilo_decisao: opt.id }))}
              className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                data.estilo_decisao === opt.id
                  ? 'border-2 border-red bg-red/10'
                  : 'border border-gray/30 bg-white'
              }`}
            >
              <span className="text-xl">{opt.icon}</span>
              <span className={`text-sm ${data.estilo_decisao === opt.id ? 'font-semibold text-red' : 'text-dark'}`}>
                {opt.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );

  const renderRestricoesStep = () => (
    <div className="space-y-4">
      {/* Toggle sem restrições */}
      <button
        onClick={() => setData((prev) => ({
          ...prev,
          sem_restricoes: !prev.sem_restricoes,
          restricoes_alimentares: !prev.sem_restricoes ? [] : prev.restricoes_alimentares,
        }))}
        className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
          data.sem_restricoes
            ? 'border-2 border-green-500 bg-green-50'
            : 'border border-gray/30 bg-white'
        }`}
      >
        <span className="text-xl">✅</span>
        <span className={`text-sm ${data.sem_restricoes ? 'font-semibold text-green-600' : 'text-dark'}`}>
          Não tenho restrições
        </span>
        {data.sem_restricoes && <Check size={18} className="ml-auto text-green-600" />}
      </button>

      {!data.sem_restricoes && (
        <div className="space-y-2">
          {restrictionTags.map((tag) => (
            <button
              key={tag.id}
              onClick={() => toggleArrayValue('restricoes_alimentares', tag.slug)}
              className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
                data.restricoes_alimentares.includes(tag.slug)
                  ? 'border-2 border-red bg-red/10'
                  : 'border border-gray/30 bg-white'
              }`}
            >
              <span className="text-xl">{tag.icon}</span>
              <span className={`text-sm flex-1 text-left ${
                data.restricoes_alimentares.includes(tag.slug) ? 'font-semibold text-red' : 'text-dark'
              }`}>
                {tag.name}
              </span>
              {data.restricoes_alimentares.includes(tag.slug) && <Check size={18} className="text-red" />}
            </button>
          ))}
        </div>
      )}

      <p className="text-xs text-gray text-center mt-4">
        Você pode mudar isso depois nas configurações.
      </p>
    </div>
  );

  const renderPermissoesStep = () => (
    <div className="space-y-6">
      {/* Resumo */}
      <div className="bg-white rounded-xl p-4 space-y-2">
        <p className="text-xs font-semibold text-gray uppercase">Seu perfil</p>
        {data.cidade && (
          <p className="text-sm text-dark">📍 {data.cidade}{data.bairro ? `, ${data.bairro}` : ''}</p>
        )}
        {data.cozinhas_nao_gosta.length > 0 && (
          <p className="text-sm text-dark">
            🚫 Não curte: {data.cozinhas_nao_gosta.slice(0, 3).join(', ')}
            {data.cozinhas_nao_gosta.length > 3 && ` +${data.cozinhas_nao_gosta.length - 3}`}
          </p>
        )}
        {data.ocasioes_favoritas.length > 0 && (
          <p className="text-sm text-dark">
            ✨ Ocasiões: {data.ocasioes_favoritas.slice(0, 3).join(', ')}
            {data.ocasioes_favoritas.length > 3 && ` +${data.ocasioes_favoritas.length - 3}`}
          </p>
        )}
      </div>

      {/* Toggles de permissão */}
      <div className="space-y-3">
        <button
          onClick={() => setData((prev) => ({ ...prev, aceita_notificacoes: !prev.aceita_notificacoes }))}
          className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
            data.aceita_notificacoes
              ? 'border-2 border-red bg-red/10'
              : 'border border-gray/30 bg-white'
          }`}
        >
          <span className="text-xl">🔔</span>
          <div className="flex-1 text-left">
            <p className={`text-sm ${data.aceita_notificacoes ? 'font-semibold text-red' : 'text-dark'}`}>
              Quero receber avisos sobre lugares com a minha cara
            </p>
            <p className="text-xs text-gray">Poucas notificações, só o que for relevante</p>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
            data.aceita_notificacoes ? 'bg-red' : 'bg-gray/30'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              data.aceita_notificacoes ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </button>

        <button
          onClick={() => setData((prev) => ({ ...prev, aceita_experimentos: !prev.aceita_experimentos }))}
          className={`w-full p-4 rounded-xl flex items-center gap-3 cursor-pointer transition-all ${
            data.aceita_experimentos
              ? 'border-2 border-red bg-red/10'
              : 'border border-gray/30 bg-white'
          }`}
        >
          <span className="text-xl">🧪</span>
          <div className="flex-1 text-left">
            <p className={`text-sm ${data.aceita_experimentos ? 'font-semibold text-red' : 'text-dark'}`}>
              Topa participar de testes da comunidade FOMÍ?
            </p>
          </div>
          <div className={`w-12 h-7 rounded-full p-1 transition-colors ${
            data.aceita_experimentos ? 'bg-red' : 'bg-gray/30'
          }`}>
            <div className={`w-5 h-5 rounded-full bg-white shadow transition-transform ${
              data.aceita_experimentos ? 'translate-x-5' : 'translate-x-0'
            }`} />
          </div>
        </button>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (stepId) {
      case 'dados':
        return renderDadosStep();
      case 'cozinhas':
        return renderCozinhasStep();
      case 'ocasioes':
        return renderOcasioesStep();
      case 'preferencias':
        return renderPreferenciasStep();
      case 'restricoes':
        return renderRestricoesStep();
      case 'permissoes':
        return renderPermissoesStep();
      default:
        return null;
    }
  };

  // ============================================================================
  // LOADING STATE
  // ============================================================================

  if (loading) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center">
        <Loader2 size={32} className="text-red animate-spin" />
      </div>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  const isLastStep = currentStep === STEPS.length - 1;
  const showSkip = stepId === 'cozinhas' || stepId === 'preferencias';

  return (
    <div className="min-h-screen bg-cream flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <button
          onClick={handleBack}
          className="w-10 h-10 rounded-full bg-black/5 flex items-center justify-center cursor-pointer border-none"
        >
          <ChevronLeft size={24} className="text-dark" />
        </button>

        {/* Progress */}
        <div className="flex gap-1.5">
          {STEPS.map((_, i) => (
            <div
              key={i}
              className={`h-1.5 rounded-full transition-all ${
                i <= currentStep ? 'w-6 bg-red' : 'w-1.5 bg-black/10'
              }`}
            />
          ))}
        </div>

        <div className="w-10" />
      </div>

      {/* Content */}
      <div className="flex-1 px-6 pb-32 overflow-y-auto">
        <h1 className="text-2xl font-bold font-display text-dark mb-2 text-center">
          {config.title}
        </h1>
        <p className="text-sm text-gray text-center mb-6">
          {config.subtitle}
        </p>

        {renderCurrentStep()}

        {error && (
          <p className="text-red text-sm text-center mt-4">{error}</p>
        )}
      </div>

      {/* Footer */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-cream/95 backdrop-blur-md border-t border-black/5">
        <div className="flex gap-3">
          {showSkip && (
            <button
              onClick={handleSkip}
              className="flex-1 py-4 bg-transparent border border-gray/30 rounded-xl text-gray text-base font-medium cursor-pointer"
            >
              Pular
            </button>
          )}
          
          <button
            onClick={handleNext}
            disabled={!canProceed() || saving}
            className={`${showSkip ? 'flex-[2]' : 'w-full'} py-4 border-none rounded-xl text-base font-semibold cursor-pointer flex items-center justify-center gap-2 ${
              canProceed() && !saving
                ? 'bg-red text-white shadow-[0_4px_15px_rgba(255,59,48,0.3)]'
                : 'bg-light-gray text-gray cursor-not-allowed'
            }`}
          >
            {saving ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Salvando...
              </>
            ) : isLastStep ? (
              'Ir para o meu feed'
            ) : (
              'Continuar'
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Onboarding;