
import { useState } from 'react';
import { ClaudeApiService } from '@/services/claudeApi';

export const useClaudeApi = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateCode = async (query: string): Promise<string> => {
    setIsGenerating(true);
    setError(null);

    try {
      const apiKey = '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';
      const claudeService = new ClaudeApiService(apiKey);
      const generatedCode = await claudeService.generateCode(query);
      return generatedCode;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setIsGenerating(false);
    }
  };

  return {
    generateCode,
    isGenerating,
    error
  };
};
