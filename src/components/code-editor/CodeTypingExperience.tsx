import React, { useState, useEffect, useRef, useCallback } from 'react';
import Keyboard from 'react-simple-keyboard';
import 'react-simple-keyboard/build/css/index.css';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { 
  ArrowLeft, 
  ArrowRight, 
  Check, 
  AlertCircle, 
  Keyboard as KeyboardIcon,
  Clock,
  Terminal
} from 'lucide-react';

interface CodeTypingExperienceProps {
  code: {
    id: string;
    content: string;
    file_name: string;
    description?: string;
    language: string;
  };
  project: {
    id: string;
    code_ids: string[];
  };
  progress?: {
    current_token_index: number;
    is_completed: boolean;
  };
  onNavigatePrevious: () => void;
  onNavigateNext: () => void;
}

// Helper function to decode HTML entities (moved outside component to avoid initialization issues)
const decodeHtmlEntities = (html: string) => {
  if (!html) return '';
  
  // Define entity map for common HTML entities
  const entityMap: { [key: string]: string } = {
    '&quot;': '"',
    '&#039;': "'",
    '&apos;': "'",
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&nbsp;': ' ',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#x60;': '`',
    '&#x3D;': '='
  };
  
  // Replace all HTML entities using the map
  return html.replace(/&[#\w]+;/g, (entity) => {
    return entityMap[entity] || entity;
  });
};

const CodeTypingExperience: React.FC<CodeTypingExperienceProps> = ({
  code: rawCode,
  progress,
  onNavigatePrevious,
  onNavigateNext,
}) => {
  // Create a decoded version of the code prop
  const code = React.useMemo(() => {
    if (!rawCode) return rawCode;
    
    // Decode HTML entities in the code content
    const decodedContent = decodeHtmlEntities(rawCode.content);
    console.log('Original content:', rawCode.content.substring(0, 100));
    console.log('Decoded content:', decodedContent.substring(0, 100));
    
    return {
      ...rawCode,
      content: decodedContent
    };
  }, [rawCode]);
  // State for code typing experience
  const [tokens, setTokens] = useState<string[]>([]);
  const [currentTokenIndex, setCurrentTokenIndex] = useState(progress?.current_token_index || 0);
  const [userInput, setUserInput] = useState('');
  const [errorPosition, setErrorPosition] = useState<number | null>(null);
  const [isCompleted, setIsCompleted] = useState(progress?.is_completed || false);
  const [showHint, setShowHint] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [syncNeeded, setSyncNeeded] = useState(false);
  const [incorrectChar, setIncorrectChar] = useState<string | null>(null);
  const [expectedChar, setExpectedChar] = useState<string | null>(null);
  
  // References
  const editorRef = useRef<HTMLDivElement>(null);
  const keyboardRef = useRef<unknown>(null);
  const lastKeyPressTime = useRef<number>(0);
  const totalCharactersTyped = useRef<number>(0);
  
  // Parse code content into tokens for validation - each character is a token
  const parseCodeIntoTokens = useCallback((content: string) => {
    if (!content) return [];
    
    // Handle tabs specially - replace with actual tab character
    const contentWithTabs = content.replace(/\t/g, '\t');
    
    // Each character is a token
    return contentWithTabs.split('');
  }, []);
  
  // Initialize tokens and highlighting
  useEffect(() => {
    if (code?.content) {
      // Parse the already decoded content into tokens
      const parsedTokens = parseCodeIntoTokens(code.content);
      setTokens(parsedTokens);
      console.log('Parsed tokens (first 50):', parsedTokens.slice(0, 50).join(''));
      
      // Initialize the timer if not completed
      if (!isCompleted && !startTime) {
        setStartTime(Date.now());
      }
    }
  }, [code, parseCodeIntoTokens, isCompleted, startTime]);
  
  // Update timer
  useEffect(() => {
    if (!isCompleted && startTime) {
      const timerInterval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      
      return () => clearInterval(timerInterval);
    }
  }, [startTime, isCompleted]);
  
  // Sync progress with server - use a debounce to prevent too many requests
  useEffect(() => {
    if (!syncNeeded) return;
    
    // Create a debounced function to sync progress
    const syncTimeout = setTimeout(async () => {
      try {
        console.log('Syncing progress with server...');
        const response = await fetch(`/api/code/${code.id}/progress`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            current_token_index: currentTokenIndex,
            is_completed: isCompleted,
          }),
        });
        
        if (!response.ok) {
          console.warn('Sync progress response not OK:', response.status);
          throw new Error(`Failed to sync progress: ${response.status}`);
        }
        
        setSyncNeeded(false);
      } catch (error) {
        console.error('Error syncing progress:', error);
        // We'll still clear the sync flag to avoid endless retries
        setSyncNeeded(false);
      }
    }, 1000); // Debounce for 1 second
    
    // Clean up the timeout if the component unmounts or syncNeeded changes
    return () => clearTimeout(syncTimeout);
  }, [syncNeeded, code.id, currentTokenIndex, isCompleted]);
  
  // Auto-focus editor on mount
  useEffect(() => {
    focusEditor();
  }, []);
  
  // Handle direct typing in the editor
  const handleEditorKeyDown = (e: React.KeyboardEvent) => {
    if (isCompleted) return;
    
    // Prevent default browser behavior for most keys to avoid navigation issues
    if (e.key !== 'Tab' && e.key !== 'Escape') {
      e.preventDefault();
    }
    
    // For debugging
    console.log('Key pressed:', e.key);
    console.log('Current token index:', currentTokenIndex);
    console.log('User input:', userInput);
    console.log('Expected next token:', tokens[currentTokenIndex + userInput.length]);
    console.log('Expected char code:', tokens[currentTokenIndex + userInput.length]?.charCodeAt(0));
    console.log('Next 10 tokens:', tokens.slice(currentTokenIndex + userInput.length, currentTokenIndex + userInput.length + 10).join(''));
    
    console.log(`=== Character Comparison ===`);
    console.log(`Typed: "${e.key}" (length: ${e.key.length}, charCode: ${e.key.charCodeAt(0)})`);
    console.log(`Expected: "${tokens[currentTokenIndex + userInput.length]}" (length: ${tokens[currentTokenIndex + userInput.length] ? tokens[currentTokenIndex + userInput.length].length : 'undefined'}, charCode: ${tokens[currentTokenIndex + userInput.length] ? tokens[currentTokenIndex + userInput.length].charCodeAt(0) : 'undefined'})`);
    console.log(`Match: ${e.key === tokens[currentTokenIndex + userInput.length]}`);
    console.log(`Current position: ${currentTokenIndex + userInput.length} / ${tokens.length}`);
    
    if (e.key === 'Tab') {
      e.preventDefault();
      
      // Check if the next expected character is a tab
      const nextExpectedChar = tokens[currentTokenIndex + userInput.length];
      
      if (nextExpectedChar === '\t' || nextExpectedChar?.charCodeAt(0) === 9) {
        // Add the tab to user input
        const newInput = userInput + '\t';
        setUserInput(newInput);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
        lastKeyPressTime.current = Date.now();
        
        // Clear any previous errors
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
        
        // Advance the token index
        setCurrentTokenIndex(prev => prev + newInput.length);
        setUserInput('');
        setSyncNeeded(true);
      } else {
        // Show hint when Tab is pressed but not expected
        setShowHint(true);
        setTimeout(() => setShowHint(false), 3000); // Hide hint after 3 seconds
      }
    } else if (e.key === 'Escape') {
      // Toggle virtual keyboard
      setShowKeyboard(prev => !prev);
    } else if (e.key === 'Backspace') {
      // Handle backspace - remove the last character from user input
      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
      }
    } else if (e.key === 'Enter') {
      // Special handling for Enter key
      const nextExpectedChar = tokens[currentTokenIndex + userInput.length];
      
      if (nextExpectedChar === '\n') {
        // Add the newline to user input
        const newInput = userInput + '\n';
        setUserInput(newInput);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
        lastKeyPressTime.current = Date.now();
        
        // Clear any previous errors
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
        
        // Always advance on newline
        setCurrentTokenIndex(prev => prev + newInput.length);
        setUserInput('');
        setSyncNeeded(true);
        
        // Check if completed
        if (currentTokenIndex + newInput.length >= tokens.length) {
          setIsCompleted(true);
        }
        
        // Auto-advance past any leading whitespace on the new line
        let additionalSpaces = 0;
        let nextIndex = currentTokenIndex + newInput.length;
        
        // Count consecutive space characters
        while (nextIndex < tokens.length && tokens[nextIndex] === ' ') {
          additionalSpaces++;
          nextIndex++;
        }
        
        // If there are additional spaces, auto-advance past them
        if (additionalSpaces > 0) {
          setCurrentTokenIndex(prev => prev + additionalSpaces);
          setSyncNeeded(true);
        }
      } else {
        // Character doesn't match - show error
        setErrorPosition(userInput.length);
        setIncorrectChar('\n');
        setExpectedChar(nextExpectedChar);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
      }
    } else if (e.key.length === 1) { // Process all single character keys
      const nextExpectedChar = tokens[currentTokenIndex + userInput.length];
      const char = e.key;
      
      // If the character matches what we expect
      if (char === nextExpectedChar) {
        // Add the character to user input
        const newInput = userInput + char;
        setUserInput(newInput);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
        lastKeyPressTime.current = Date.now();
        
        // Clear any previous errors
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
        
        // Special handling for certain characters that should trigger immediate advancement
        const isAdvanceCharacter = char === ' ' || char === '.' || char === ';' || char === ',';
        
        if (isAdvanceCharacter || newInput.length >= 10) {
          // Advance the token index by the length of the validated input
          setCurrentTokenIndex(prev => prev + newInput.length);
          setUserInput('');
          setSyncNeeded(true);
          
          // Check if completed
          if (currentTokenIndex + newInput.length >= tokens.length) {
            setIsCompleted(true);
          }
          
          // Special handling for space - auto-advance past whitespace
          if (char === ' ') {
            // Auto-advance past any additional spaces
            let additionalSpaces = 0;
            let nextIndex = currentTokenIndex + newInput.length;
            
            // Count consecutive space characters
            while (nextIndex < tokens.length && tokens[nextIndex] === ' ') {
              additionalSpaces++;
              nextIndex++;
            }
            
            // If there are additional spaces, auto-advance past them
            if (additionalSpaces > 0) {
              setCurrentTokenIndex(prev => prev + additionalSpaces);
              setSyncNeeded(true);
            }
          }
        }
      } else {
        // Character doesn't match - show error
        setErrorPosition(userInput.length);
        setIncorrectChar(char);
        setExpectedChar(nextExpectedChar);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
      }
    }
  };
  
  // Focus the editor when component mounts or when needed
  const focusEditor = () => {
    if (editorRef.current) {
      editorRef.current.focus();
    }
  };
  
  // Handle virtual keyboard input
  const handleKeyboardInput = (input: string) => {
    if (input === '{tab}') {
      setShowHint(true);
      setTimeout(() => setShowHint(false), 3000);
    } else if (input === '{bksp}') {
      // Handle backspace
      if (userInput.length > 0) {
        setUserInput(prev => prev.slice(0, -1));
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
      }
    } else {
      // Process keyboard input
      const nextExpectedChar = tokens[currentTokenIndex + userInput.length];
      let char = input;
      
      // Convert special keys
      if (input === '{enter}') {
        char = '\n';
      }
      
      // If the character matches what we expect
      if (char === nextExpectedChar) {
        // Add the character to user input
        const newInput = userInput + char;
        setUserInput(newInput);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
        lastKeyPressTime.current = Date.now();
        
        // Clear any previous errors
        setErrorPosition(null);
        setIncorrectChar(null);
        setExpectedChar(null);
        
        // Special handling for certain characters that should trigger immediate advancement
        const isAdvanceCharacter = char === ' ' || char === '\n' || char === '.' || char === ';' || char === ',';
        
        if (isAdvanceCharacter || newInput.length >= 10) {
          // Advance the token index by the length of the validated input
          setCurrentTokenIndex(prev => prev + newInput.length);
          setUserInput('');
          setSyncNeeded(true);
          
          // Check if completed
          if (currentTokenIndex + newInput.length >= tokens.length) {
            setIsCompleted(true);
          }
          
          // Special handling for space and newline - auto-advance past whitespace
          if (char === ' ' || char === '\n') {
            // Auto-advance past any additional spaces
            let additionalSpaces = 0;
            let nextIndex = currentTokenIndex + newInput.length;
            
            // Count consecutive space characters
            while (nextIndex < tokens.length && tokens[nextIndex] === ' ') {
              additionalSpaces++;
              nextIndex++;
            }
            
            // If there are additional spaces, auto-advance past them
            if (additionalSpaces > 0) {
              setCurrentTokenIndex(prev => prev + additionalSpaces);
              setSyncNeeded(true);
            }
          }
        }
      } else {
        // Character doesn't match - show error
        setErrorPosition(userInput.length);
        setIncorrectChar(char);
        setExpectedChar(nextExpectedChar);
        
        // Update typing metrics
        totalCharactersTyped.current += 1;
      }
    }
  };
  
  // Get hint for the next few characters
  const getCurrentHint = () => {
    if (!tokens.length || currentTokenIndex + userInput.length >= tokens.length) return '';
    
    // Get the next 5 characters as a hint
    const hintStart = currentTokenIndex + userInput.length;
    const hintEnd = Math.min(hintStart + 5, tokens.length);
    
    return tokens.slice(hintStart, hintEnd).join('').replace(/ /g, '␣').replace(/\n/g, '↵');
  };
  
  // Format time display
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Render code with current position highlighted - VSCode style
  const renderCodeWithHighlight = () => {
    if (!tokens.length) return <div className="p-4 text-gray-400">Loading...</div>;
    
    // Use the decoded content from tokens directly
    const content = tokens.join('');
    const lines = content.split('\n');
    const currentPosition = currentTokenIndex + (errorPosition !== null ? errorPosition : userInput.length);
    
    // Calculate which line and column the cursor is at
    let currentLineIndex = 0;
    let currentColumn = 0;
    let charCount = 0;
    
    for (let i = 0; i < lines.length; i++) {
      const lineLength = lines[i].length + 1; // +1 for newline
      if (charCount + lineLength > currentPosition) {
        currentLineIndex = i;
        currentColumn = currentPosition - charCount;
        break;
      }
      charCount += lineLength;
    }
    
    // Render each line with proper highlighting
    const renderedLines = lines.map((line, lineIndex) => {
      const lineChars = [];
      
      // Calculate the starting position for this line
      let lineStartPosition = 0;
      for (let i = 0; i < lineIndex; i++) {
        lineStartPosition += lines[i].length + 1; // +1 for newline
      }
      
      // Render each character in the line
      for (let charIndex = 0; charIndex < line.length; charIndex++) {
        const globalCharIndex = lineStartPosition + charIndex;
        const char = line[charIndex];
        let className = 'inline';
        
        // Determine the styling based on position
        if (globalCharIndex < currentTokenIndex) {
          // Already typed correctly
          className = 'inline text-green-400 bg-green-900/20';
        } else if (globalCharIndex === currentPosition && lineIndex === currentLineIndex) {
          // Current cursor position
          className = 'inline bg-blue-500/50 text-white';
        } else if (globalCharIndex < currentPosition) {
          // Currently being typed
          className = 'inline text-yellow-400 bg-yellow-900/20';
        } else {
          // Not yet typed
          className = 'inline text-gray-500';
        }
        
        // Handle error highlighting
        if (errorPosition !== null && globalCharIndex === currentTokenIndex + errorPosition) {
          className = 'inline text-red-400 bg-red-900/30 animate-pulse';
        }
        
        lineChars.push(
          <span key={`char-${charIndex}`} className={className}>
            {char === ' ' ? '\u00A0' : char === '\t' || char.charCodeAt(0) === 9 ? '\u00A0\u00A0\u00A0\u00A0' : char}
          </span>
        );
      }
      
      // Add cursor at end of line if needed
      if (lineIndex === currentLineIndex && currentColumn === line.length && currentPosition === currentTokenIndex + userInput.length) {
        lineChars.push(
          <span key="cursor" className="inline-block w-0.5 h-[1.2em] bg-blue-500 animate-pulse mx-px"></span>
        );
      }

      // Render the line with line number
      return (
        <div key={`line-${lineIndex}`} className="flex group hover:bg-slate-800/30">
          <div className="select-none w-[3rem] text-right pr-2 text-gray-500 border-r border-gray-700 mr-3 group-hover:text-gray-400">
            {lineIndex + 1}
          </div>
          <div className="flex-1 whitespace-pre font-mono">{lineChars}</div>
        </div>
      );
    });

    return (
      <div 
        ref={editorRef}
        tabIndex={0}
        onKeyDown={handleEditorKeyDown}
        onClick={focusEditor}
        className="font-mono text-sm p-1 bg-slate-900 rounded-md overflow-auto max-h-[400px] shadow-inner"
      >
        {renderedLines}
      </div>
    );
  };

  return (
    <div>
      <Card className="overflow-hidden">
        <CardContent className="p-0">
          {/* Code display area */}
          <div className="relative">
            {/* Progress bar */}
            <div className="absolute top-0 left-0 right-0 z-10">
              <Progress 
                value={tokens.length ? (currentTokenIndex / tokens.length) * 100 : 0} 
                className="h-1 rounded-none bg-slate-700"
              />
            </div>
            
            {/* VSCode-like editor header */}
            <div className="flex justify-between items-center p-2 text-xs text-gray-300 bg-slate-800 border-b border-slate-700">
              <div className="flex items-center gap-2">
                <Terminal className="h-3.5 w-3.5 text-blue-400" />
                <span className="font-medium">{code.file_name}</span>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-3 w-3 text-blue-400" />
                  <span>{formatTime(elapsedTime)}</span>
                </div>

                <div className="flex items-center gap-2">
                  <Check className="h-3 w-3 text-blue-400" />
                  <span>{Math.round((currentTokenIndex / tokens.length) * 100)}%</span>
                </div>
              </div>
            </div>
            
            {/* Code editor with improved styling */}
            <div className="pt-2 pb-1 px-1 bg-slate-900">
              {renderCodeWithHighlight()}
            </div>
            
            {/* Completion screen */}
            {isCompleted ? (
              <div className="p-8 bg-slate-900 border-t border-slate-800 text-center">
                <div className="mb-4 inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-600 text-white">
                  <Check className="h-8 w-8" />
                </div>
                <h4 className="text-lg font-medium mb-2 text-white">Completed!</h4>
                <p className="text-gray-300 mb-4">
                  You&apos;ve successfully completed this code file.
                </p>
                <div className="grid grid-cols-1 max-w-1/6 mx-auto mb-6">
                  <div className="bg-slate-800 p-3 rounded-md">
                    <p className="text-gray-400 text-xs mb-1">Time</p>
                    <p className="text-lg font-mono text-white">{formatTime(elapsedTime)}</p>
                  </div>
                </div>
                <Button onClick={onNavigateNext} className="bg-blue-600 hover:bg-blue-700">
                  Continue to Next File
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="p-4 bg-slate-900 border-t border-slate-800">
                {/* VSCode-style hint tooltip */}
                {showHint && (
                  <div className="mt-4 bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border-b border-slate-600">
                      <AlertCircle className="h-4 w-4 text-blue-400" />
                      <span className="text-sm font-medium text-blue-100">Hint</span>
                    </div>
                    <div className="p-3 text-sm">
                      Next characters: <code className="px-1.5 py-0.5 bg-slate-700 rounded text-blue-200 font-mono text-xs">{getCurrentHint()}</code>
                    </div>
                  </div>
                )}
                
                {/* VSCode-style error message */}
                {errorPosition !== null && (
                  <div className="mt-4 bg-slate-800 border border-slate-700 rounded-md overflow-hidden">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-700/50 border-b border-slate-600">
                      <AlertCircle className="h-4 w-4 text-red-400" />
                      <span className="text-sm font-medium text-red-200">Error</span>
                    </div>
                    <div className="p-3 text-sm text-gray-300">
                      Expected <code className="px-1.5 py-0.5 bg-slate-700 rounded text-red-300 font-mono text-xs">
                        {expectedChar === ' ' ? 'Space' : 
                         expectedChar === '\n' ? 'Enter' : 
                         expectedChar === '\t' || expectedChar?.charCodeAt(0) === 9 ? 'Tab' :
                         expectedChar}
                      </code> but got <code className="px-1.5 py-0.5 bg-slate-700 rounded text-red-300 font-mono text-xs">
                        {incorrectChar === ' ' ? 'Space' : 
                         incorrectChar === '\n' ? 'Enter' : 
                         incorrectChar === '\t' || incorrectChar?.charCodeAt(0) === 9 ? 'Tab' :
                         incorrectChar}
                      </code>
                    </div>
                  </div>
                )}
                  
                {/* Virtual keyboard with improved styling */}
                {showKeyboard && (
                  <div className="mt-4 border border-slate-700 rounded-md p-2 bg-slate-800/80 shadow-inner">
                    <div className="text-xs text-gray-400 mb-2 flex items-center">
                      <KeyboardIcon className="h-3 w-3 mr-1" /> Virtual Keyboard
                    </div>
                    <Keyboard
                      keyboardRef={r => (keyboardRef.current = r)}
                      layoutName="default"
                      onChange={() => {}} // Not needed as we handle input in onKeyPress
                      onKeyPress={handleKeyboardInput}
                      theme={"hg-theme-default hg-layout-default vscode-theme"}
                      buttonTheme={[
                        {
                          class: "hg-blue",
                          buttons: "{enter} {bksp} {tab}"
                        }
                      ]}
                    />
                    <style jsx global>{`
                      .vscode-theme {
                        background-color: #1e293b;
                        border-radius: 4px;
                      }
                      .vscode-theme .hg-button {
                        background-color: #334155;
                        color: #e2e8f0;
                        border-radius: 4px;
                        border: 1px solid #475569;
                        box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
                      }
                      .vscode-theme .hg-button:hover {
                        background-color: #475569;
                      }
                      .vscode-theme .hg-button.hg-blue {
                        background-color: #3b82f6;
                        border-color: #2563eb;
                      }
                      .vscode-theme .hg-button.hg-blue:hover {
                        background-color: #2563eb;
                      }
                    `}</style>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Navigation buttons */}
      <div className="flex justify-between mt-4">
        <Button 
          variant="outline" 
          onClick={onNavigatePrevious}
          className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous
        </Button>
        <Button 
          variant="outline" 
          onClick={onNavigateNext}
          className="bg-slate-800 hover:bg-slate-700 border-slate-700 text-white"
        >
          Next
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CodeTypingExperience;