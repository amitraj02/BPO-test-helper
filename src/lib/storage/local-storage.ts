import { TestResult } from '@/types/results';

const STORAGE_KEYS = {
  HISTORY: 'bpo_prep_test_history_v1',
  THEME: 'bpo_prep_theme',
  SETTINGS: 'bpo_prep_settings_v1',
  ACTIVE_DRAFT: 'bpo_prep_draft_session_v1',
};

export interface UserSettings {
  preferredDifficulty: 'easy' | 'intermediate' | 'advanced';
  autoSubmitOnTimer: boolean;
  soundEffects: boolean;
  userCustomApiKey?: string; // Optional user-provided OpenAI key in memory/session
}

const DEFAULT_SETTINGS: UserSettings = {
  preferredDifficulty: 'intermediate',
  autoSubmitOnTimer: true,
  soundEffects: true,
};

export function getSavedTestHistory(): TestResult[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.HISTORY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (error) {
    console.error('Failed to parse test history from localStorage:', error);
    return [];
  }
}

export function saveTestResult(result: TestResult): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getSavedTestHistory();
    // Prepend latest test result, keep maximum 50 most recent attempts
    const updated = [result, ...history.filter(h => h.id !== result.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to save test result to localStorage:', error);
  }
}

export function getTestResultById(id: string): TestResult | null {
  const history = getSavedTestHistory();
  return history.find(r => r.id === id) || null;
}

export function deleteTestResult(id: string): void {
  if (typeof window === 'undefined') return;
  try {
    const history = getSavedTestHistory();
    const updated = history.filter(r => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.HISTORY, JSON.stringify(updated));
  } catch (error) {
    console.error('Failed to delete test result from localStorage:', error);
  }
}

export function clearAllTestHistory(): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(STORAGE_KEYS.HISTORY);
  } catch (error) {
    console.error('Failed to clear test history:', error);
  }
}

export function getUserSettings(): UserSettings {
  if (typeof window === 'undefined') return DEFAULT_SETTINGS;
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch (error) {
    return DEFAULT_SETTINGS;
  }
}

export function saveUserSettings(settings: Partial<UserSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = getUserSettings();
    const merged = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(merged));
  } catch (error) {
    console.error('Failed to save settings to localStorage:', error);
  }
}
