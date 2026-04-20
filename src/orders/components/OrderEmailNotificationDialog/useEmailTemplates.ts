import useLocalStorage from "@dashboard/hooks/useLocalStorage";
import { useCallback } from "react";

import { EmailTemplate } from "./emailTemplates";

const STORAGE_KEY = "saleor-email-template-overrides";

export interface TemplateOverride extends EmailTemplate {
  lastModified: number;
}

export interface TemplateOverrides {
  [key: string]: TemplateOverride;
}

/**
 * Create a storage key for a template override.
 * Format: "{reason}:{lang}"
 */
const getOverrideKey = (reason: string, lang: string): string => `${reason}:${lang}`;

/**
 * Custom hook for managing email template overrides with localStorage persistence.
 */
export const useEmailTemplates = () => {
  const [overrides, setOverrides] = useLocalStorage<TemplateOverrides>(STORAGE_KEY, {});

  /**
   * Save a template override for a specific reason and language.
   */
  const saveOverride = useCallback(
    (reason: string, lang: string, template: EmailTemplate) => {
      const key = getOverrideKey(reason, lang);
      const override: TemplateOverride = {
        ...template,
        lastModified: Date.now(),
      };

      setOverrides(prev => ({
        ...prev,
        [key]: override,
      }));
    },
    [setOverrides],
  );

  /**
   * Delete a template override for a specific reason and language.
   */
  const deleteOverride = useCallback(
    (reason: string, lang: string) => {
      const key = getOverrideKey(reason, lang);

      setOverrides(prev => {
        const newOverrides = { ...prev };

        delete newOverrides[key];

        return newOverrides;
      });
    },
    [setOverrides],
  );

  /**
   * Check if a template override exists for a specific reason and language.
   */
  const hasOverride = useCallback(
    (reason: string, lang: string): boolean => {
      const key = getOverrideKey(reason, lang);

      return key in overrides;
    },
    [overrides],
  );

  /**
   * Get a template override for a specific reason and language.
   * Returns null if no override exists.
   */
  const getOverride = useCallback(
    (reason: string, lang: string): TemplateOverride | null => {
      const key = getOverrideKey(reason, lang);

      return overrides[key] || null;
    },
    [overrides],
  );

  /**
   * Get all overrides for a specific reason across all languages.
   */
  const getReasonOverrides = useCallback(
    (reason: string): Record<string, TemplateOverride> => {
      const prefix = `${reason}:`;
      const result: Record<string, TemplateOverride> = {};

      for (const [key, override] of Object.entries(overrides)) {
        if (key.startsWith(prefix)) {
          const lang = key.substring(prefix.length);

          result[lang] = override;
        }
      }

      return result;
    },
    [overrides],
  );

  return {
    overrides,
    saveOverride,
    deleteOverride,
    hasOverride,
    getOverride,
    getReasonOverrides,
  };
};
