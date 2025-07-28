import React, { useState, useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, X, Minus, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface TerminalProps {
  isVisible: boolean;
  onToggle: () => void;
}

const Terminal = ({ isVisible, onToggle }: TerminalProps) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ type: 'command' | 'output' | 'error'; content: string }>>([
    { type: 'output', content: 'Earth Engine Code Editor Terminal v1.0.0' },
    { type: 'output', content: 'Type "help" for available commands.' },
    { type: 'output', content: '' }
  ]);
  const [currentPath] = useState('earth-engine-scripts');
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isVisible && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isVisible]);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [history]);

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim();
    
    setHistory(prev => [...prev, { type: 'command', content: `${currentPath}> ${trimmedCmd}` }]);

    if (!trimmedCmd) {
      setHistory(prev => [...prev, { type: 'output', content: '' }]);
      return;
    }

    const [command, ...args] = trimmedCmd.split(' ');

    switch (command.toLowerCase()) {
      case 'help':
        setHistory(prev => [...prev, 
          { type: 'output', content: 'Available commands:' },
          { type: 'output', content: '  help          - Show this help message' },
          { type: 'output', content: '  ls            - List files and directories' },
          { type: 'output', content: '  run [file]    - Execute Earth Engine script' },
          { type: 'output', content: '  export [type] - Export current analysis' },
          { type: 'output', content: '  clear         - Clear terminal' },
          { type: 'output', content: '  ee.status     - Check Earth Engine status' },
          { type: 'output', content: '' }
        ]);
        break;

      case 'ls':
        setHistory(prev => [...prev,
          { type: 'output', content: 'crop-classification/' },
          { type: 'output', content: 'flood-risk/' },
          { type: 'output', content: 'utils/' },
          { type: 'output', content: 'assets/' },
          { type: 'output', content: 'README.md' },
          { type: 'output', content: 'package.json' },
          { type: 'output', content: '' }
        ]);
        break;

      case 'run':
        if (args.length === 0) {
          setHistory(prev => [...prev, { type: 'error', content: 'Error: Please specify a script to run' }]);
        } else {
          const filename = args[0];
          setHistory(prev => [...prev,
            { type: 'output', content: `Running ${filename}...` },
            { type: 'output', content: 'Initializing Earth Engine...' },
            { type: 'output', content: 'Loading satellite imagery...' },
            { type: 'output', content: 'Processing data...' },
            { type: 'output', content: `✓ Script executed successfully` },
            { type: 'output', content: `Results displayed in map viewer` },
            { type: 'output', content: '' }
          ]);
        }
        break;

      case 'export':
        const exportType = args[0] || 'image';
        setHistory(prev => [...prev,
          { type: 'output', content: `Exporting as ${exportType}...` },
          { type: 'output', content: 'Creating export task...' },
          { type: 'output', content: '✓ Export task created successfully' },
          { type: 'output', content: 'Check Google Drive for results' },
          { type: 'output', content: '' }
        ]);
        break;

      case 'clear':
        setHistory([]);
        break;

      case 'ee.status':
      case 'ee':
        if (args[0] === 'status' || command === 'ee.status') {
          setHistory(prev => [...prev,
            { type: 'output', content: 'Earth Engine Status:' },
            { type: 'output', content: '✓ Authentication: Connected' },
            { type: 'output', content: '✓ API Access: Available' },
            { type: 'output', content: '✓ Compute Credits: 1,247 remaining' },
            { type: 'output', content: '✓ Assets: 12/100 used' },
            { type: 'output', content: '' }
          ]);
        } else {
          setHistory(prev => [...prev, { type: 'error', content: `Unknown Earth Engine command: ${args[0]}` }]);
        }
        break;

      default:
        setHistory(prev => [...prev, 
          { type: 'error', content: `Command not found: ${command}` },
          { type: 'output', content: 'Type "help" for available commands.' },
          { type: 'output', content: '' }
        ]);
        break;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeCommand(input);
    setInput('');
  };

  if (!isVisible) return null;

  return (
    <div className="h-64 bg-[hsl(var(--editor-bg))] border-t border-[hsl(var(--editor-border))] flex flex-col">
      {/* Terminal Header */}
      <div className="h-8 bg-[hsl(var(--editor-panel))] border-b border-[hsl(var(--editor-border))] flex items-center justify-between px-3">
        <div className="flex items-center space-x-2">
          <TerminalIcon className="w-4 h-4 text-[hsl(var(--editor-text-muted))]" />
          <span className="text-xs font-medium text-[hsl(var(--editor-text))]">Terminal</span>
        </div>
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0 text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))]"
          >
            <Minus className="w-3 h-3" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggle}
            className="h-6 w-6 p-0 text-[hsl(var(--editor-text-muted))] hover:text-[hsl(var(--editor-text))] hover:bg-[hsl(var(--editor-sidebar))]"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      </div>

      {/* Terminal Content */}
      <div 
        ref={terminalRef}
        className="flex-1 overflow-y-auto p-3 font-mono text-sm"
      >
        {history.map((entry, index) => (
          <div key={index} className={`whitespace-pre-wrap ${
            entry.type === 'command' 
              ? 'text-[hsl(var(--editor-text))]' 
              : entry.type === 'error'
              ? 'text-red-400'
              : 'text-[hsl(var(--editor-text-muted))]'
          }`}>
            {entry.content}
          </div>
        ))}
      </div>

      {/* Input Line */}
      <form onSubmit={handleSubmit} className="border-t border-[hsl(var(--editor-border))] p-3">
        <div className="flex items-center space-x-2">
          <span className="text-[hsl(var(--editor-accent))] font-mono text-sm">
            {currentPath}{'>'}
          </span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent text-[hsl(var(--editor-text))] font-mono text-sm outline-none placeholder-[hsl(var(--editor-text-muted))]"
            placeholder="Type a command..."
            autoComplete="off"
          />
        </div>
      </form>
    </div>
  );
};

export default Terminal;