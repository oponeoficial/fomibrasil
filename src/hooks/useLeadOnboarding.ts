import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

export interface LeadPreferences {
  company: string[];
  mood: string[];
  restrictions: string[];
  budget: string | null;
}

export interface LeadLocation {
  latitude: number;
  longitude: number;
  city?: string;
}

export interface LeadData {
  id?: string;
  sessionId: string;
  location: LeadLocation | null;
  preferences: LeadPreferences;
  onboardingStep: string;
  onboardingCompleted: boolean;
}

const SESSION_KEY = 'fomi_session_id';

// Gerar ID único para sessão
const generateSessionId = (): string => {
  return 'lead_' + Date.now() + '_' + Math.random().toString(36).substring(2, 15);
};

// Obter ou criar session ID
const getSessionId = (): string => {
  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateSessionId();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
};

export function useLeadOnboarding() {
  const [sessionId] = useState<string>(getSessionId);
  const [leadData, setLeadData] = useState<LeadData>({
    sessionId,
    location: null,
    preferences: {
      company: [],
      mood: [],
      restrictions: [],
      budget: null,
    },
    onboardingStep: 'welcome',
    onboardingCompleted: false,
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  // Carregar lead existente do Supabase ao iniciar
  useEffect(() => {
    const loadExistingLead = async () => {
      try {
        const { data, error: fetchError } = await supabase
          .rpc('get_lead' as never, { p_session_id: sessionId } as never) as { 
            data: Array<{
              id: string;
              session_id: string;
              latitude: number | null;
              longitude: number | null;
              city: string | null;
              preferences: LeadPreferences | null;
              onboarding_step: string | null;
              onboarding_completed: boolean;
              created_at: string;
            }> | null;
            error: Error | null;
          };

        if (fetchError) {
          console.error('Erro ao buscar lead:', fetchError);
          setInitialized(true);
          return;
        }

        if (data && data.length > 0) {
          const lead = data[0];
          setLeadData({
            id: lead.id,
            sessionId: lead.session_id,
            location: lead.latitude && lead.longitude ? {
              latitude: lead.latitude,
              longitude: lead.longitude,
              city: lead.city || undefined,
            } : null,
            preferences: lead.preferences || {
              company: [],
              mood: [],
              restrictions: [],
              budget: null,
            },
            onboardingStep: lead.onboarding_step || 'welcome',
            onboardingCompleted: lead.onboarding_completed || false,
          });
        }
      } catch (e) {
        console.error('Erro ao carregar lead:', e);
      } finally {
        setInitialized(true);
      }
    };

    loadExistingLead();
  }, [sessionId]);

  // Criar lead inicial no Supabase
  const initLead = useCallback(async () => {
    setSaving(true);
    setError(null);

    try {
      const { data, error: rpcError } = await supabase.rpc('upsert_lead' as never, {
        p_session_id: sessionId,
        p_onboarding_step: 'started',
      } as never);

      if (rpcError) throw new Error(rpcError.message);

      setLeadData(prev => ({
        ...prev,
        id: data,
        onboardingStep: 'started',
      }));

      return { success: true, leadId: data };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao iniciar lead:', e);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [sessionId]);

  // Salvar localização
  const saveLocation = useCallback(async (location: LeadLocation) => {
    setSaving(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc('update_lead_location' as never, {
        p_session_id: sessionId,
        p_latitude: location.latitude,
        p_longitude: location.longitude,
        p_city: location.city || null,
      } as never);

      if (rpcError) throw new Error(rpcError.message);

      setLeadData(prev => ({
        ...prev,
        location,
        onboardingStep: 'location_done',
      }));

      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao salvar localização:', e);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [sessionId]);

  // Salvar preferências (atualiza a cada passo)
  const savePreferences = useCallback(async (
    preferences: LeadPreferences,
    step: string = 'preferences_in_progress'
  ) => {
    setSaving(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc('update_lead_preferences' as never, {
        p_session_id: sessionId,
        p_preferences: preferences,
        p_step: step,
      } as never);

      if (rpcError) throw new Error(rpcError.message);

      setLeadData(prev => ({
        ...prev,
        preferences,
        onboardingStep: step,
        onboardingCompleted: step === 'completed',
      }));

      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao salvar preferências:', e);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [sessionId]);

  // Converter lead para usuário (após cadastro)
  const convertToUser = useCallback(async (userId: string) => {
    setSaving(true);
    setError(null);

    try {
      const { error: rpcError } = await supabase.rpc('convert_lead_to_user' as never, {
        p_session_id: sessionId,
        p_user_id: userId,
      } as never);

      if (rpcError) throw new Error(rpcError.message);

      // Limpar session do localStorage após conversão
      localStorage.removeItem(SESSION_KEY);

      return { success: true };
    } catch (e) {
      const message = e instanceof Error ? e.message : 'Erro desconhecido';
      setError(message);
      console.error('Erro ao converter lead:', e);
      return { success: false, error: message };
    } finally {
      setSaving(false);
    }
  }, [sessionId]);

  return {
    sessionId,
    leadData,
    saving,
    error,
    initialized,
    initLead,
    saveLocation,
    savePreferences,
    convertToUser,
  };
}