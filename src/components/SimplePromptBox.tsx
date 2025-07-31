import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SimplePromptBoxProps {
  onPromptSubmit?: (prompt: string) => void;
}

const SimplePromptBox = ({ onPromptSubmit }: SimplePromptBoxProps) => {
  const [prompt, setPrompt] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim() && onPromptSubmit) {
      onPromptSubmit(prompt.trim());
      setPrompt('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      handleSubmit(e);
    }
  };

  return (
    <div className="h-12 bg-gradient-to-r from-background via-background to-muted/20 border-b border-border/50 backdrop-blur-sm">
      <form onSubmit={handleSubmit} className="h-full flex items-center px-4 space-x-3">
        <div className="flex items-center space-x-2 text-muted-foreground">
          <Sparkles className="w-4 h-4" />
          <span className="text-sm font-medium">Ask AI</span>
        </div>
        
        <div className="flex-1 relative">
          <input
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask AI to modify your code... (⌘+Enter to send)"
            className="w-full h-8 px-3 text-sm bg-muted/50 border border-border/30 rounded-md 
                     focus:outline-none focus:ring-1 focus:ring-primary/20 focus:border-primary/30 
                     placeholder:text-muted-foreground/60 transition-all duration-200
                     hover:bg-muted/70 hover:border-border/50 text-white"
          />
        </div>
        
        <Button
          type="submit"
          size="sm"
          variant="ghost"
          disabled={!prompt.trim()}
          className="h-8 px-3 text-muted-foreground hover:text-foreground disabled:opacity-30
                   hover:bg-muted/70 transition-all duration-200"
        >
          <Send className="w-3.5 h-3.5" />
        </Button>
      </form>
    </div>
  );
};

export default SimplePromptBox;