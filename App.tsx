
import React, { useState, useCallback, useEffect } from 'react';
import { CalculatorButton } from './components/CalculatorButton';
import { HistorySidebar } from './components/HistorySidebar';
import { ButtonType, Operator, CalculatorState, HistoryItem } from './types';

// Icons as SVG strings
const BackspaceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"></path>
    <line x1="18" y1="9" x2="12" y2="15"></line>
    <line x1="12" y1="9" x2="18" y2="15"></line>
  </svg>
);

const SidebarIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="9" y1="3" x2="9" y2="21"></line>
  </svg>
);

const App: React.FC = () => {
  const [state, setState] = useState<CalculatorState>(() => {
    const saved = localStorage.getItem('calc_history');
    return {
      currentValue: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
      history: saved ? JSON.parse(saved) : [],
      isHistoryVisible: false,
    };
  });

  useEffect(() => {
    localStorage.setItem('calc_history', JSON.stringify(state.history));
  }, [state.history]);

  const formatNumber = (numStr: string) => {
    if (numStr === 'Error' || numStr === 'NaN') return numStr;
    const num = parseFloat(numStr);
    if (isNaN(num)) return '0';

    if (Math.abs(num) > 1e12 || (Math.abs(num) < 1e-7 && num !== 0)) {
      return num.toExponential(4);
    }

    const parts = numStr.split('.');
    const formattedInt = parseInt(parts[0]).toLocaleString('en-US');
    return parts.length > 1 ? `${formattedInt}.${parts[1]}` : formattedInt;
  };

  const handleNumber = (digit: string) => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return {
          ...prev,
          currentValue: digit,
          waitingForNewValue: false,
        };
      }

      const newValue = prev.currentValue === '0' ? digit : prev.currentValue + digit;
      if (newValue.replace('.', '').length > 11) return prev;

      return { ...prev, currentValue: newValue };
    });
  };

  const handleDecimal = () => {
    setState(prev => {
      if (prev.waitingForNewValue) {
        return { ...prev, currentValue: '0.', waitingForNewValue: false };
      }
      if (prev.currentValue.includes('.')) return prev;
      return { ...prev, currentValue: prev.currentValue + '.' };
    });
  };

  const calculate = (a: number, b: number, op: Operator): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '*': return a * b;
      case '/': return b !== 0 ? a / b : NaN;
      default: return b;
    }
  };

  const handleOperator = (nextOp: Operator) => {
    setState(prev => {
      const val = parseFloat(prev.currentValue);

      if (prev.previousValue === null) {
        return {
          ...prev,
          previousValue: prev.currentValue,
          operator: nextOp,
          waitingForNewValue: true,
        };
      }

      if (prev.operator && !prev.waitingForNewValue) {
        const result = calculate(parseFloat(prev.previousValue), val, prev.operator);
        return {
          ...prev,
          currentValue: String(result),
          previousValue: String(result),
          operator: nextOp,
          waitingForNewValue: true,
        };
      }

      return {
        ...prev,
        operator: nextOp,
        waitingForNewValue: true,
      };
    });
  };

  const handleEqual = () => {
    setState(prev => {
      if (!prev.operator || prev.previousValue === null) return prev;

      const val1 = parseFloat(prev.previousValue);
      const val2 = parseFloat(prev.currentValue);
      const result = calculate(val1, val2, prev.operator);

      const displayOp = prev.operator === '/' ? '÷' : prev.operator === '*' ? '×' : prev.operator === '-' ? '−' : '+';
      const newItem: HistoryItem = {
        id: Date.now().toString(),
        expression: `${formatNumber(String(val1))}${displayOp}${formatNumber(String(val2))}`,
        result: formatNumber(isNaN(result) ? 'Error' : String(result)),
        timestamp: Date.now(),
      };

      return {
        ...prev,
        currentValue: isNaN(result) ? 'Error' : String(result),
        previousValue: null,
        operator: null,
        waitingForNewValue: true,
        history: [newItem, ...prev.history].slice(0, 50), // Keep last 50
      };
    });
  };

  const handleAC = () => {
    setState(prev => ({
      ...prev,
      currentValue: '0',
      previousValue: null,
      operator: null,
      waitingForNewValue: false,
    }));
  };

  const handleToggleSign = () => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue) * -1).toString()
    }));
  };

  const handlePercent = () => {
    setState(prev => ({
      ...prev,
      currentValue: (parseFloat(prev.currentValue) / 100).toString()
    }));
  };

  const handleDelete = () => {
    setState(prev => {
      if (prev.waitingForNewValue) return prev;
      if (prev.currentValue.length === 1) return { ...prev, currentValue: '0' };
      return { ...prev, currentValue: prev.currentValue.slice(0, -1) };
    });
  };

  const toggleHistory = () => {
    setState(prev => ({ ...prev, isHistoryVisible: !prev.isHistoryVisible }));
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '0' && e.key <= '9') handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Backspace') handleDelete();
      if (e.key === 'Escape') handleAC();
      if (e.key === '+') handleOperator('+');
      if (e.key === '-') handleOperator('-');
      if (e.key === '*') handleOperator('*');
      if (e.key === '/') handleOperator('/');
      if (e.key === '%') handlePercent();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [state]);

  return (
    <div className={`bg-[#1c1c1e] ${state.isHistoryVisible ? 'w-[700px]' : 'w-[400px]'} h-[650px] rounded-[30px] shadow-[0_40px_80px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden transition-all duration-300 border border-[#333]`}>
      {/* Top Header Controls */}
      <div className="w-full flex items-center justify-between p-4 bg-[#1c1c1e]">
        <div className="flex gap-2">
          <div className="w-3 h-3 rounded-full bg-[#ff5f56]"></div>
          <div className="w-3 h-3 rounded-full bg-[#ffbd2e]"></div>
          <div className="w-3 h-3 rounded-full bg-[#27c93f]"></div>
        </div>

        <div className="flex gap-2 ml-auto">
          <button
            onClick={toggleHistory}
            className={`p-2 rounded-lg transition-colors ${state.isHistoryVisible ? 'bg-[#3a3a3c] text-white' : 'text-[#9a9a9e] hover:bg-[#3a3a3c]'}`}
          >
            <SidebarIcon />
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* History Pane */}
        {state.isHistoryVisible && (
          <HistorySidebar history={state.history} />
        )}

        {/* Calculator Pane */}
        <div className="flex-1 flex flex-col pt-6 px-8 pb-12">
          {/* Display Area */}
          <div className="w-full flex-1 flex flex-col justify-end items-end mb-8 px-4">
            {state.previousValue && state.operator && (
              <div className="text-[#8e8e93] text-xl mb-1">
                {formatNumber(state.previousValue)} {state.operator === '/' ? '÷' : state.operator === '*' ? '×' : state.operator === '-' ? '−' : '+'}
              </div>
            )}
            <div className="text-white text-7xl font-light tracking-tight truncate w-full text-right overflow-hidden leading-tight">
              {formatNumber(state.currentValue)}
            </div>
          </div>

          {/* Buttons Grid */}
          <div className="grid grid-cols-4 gap-4 w-full justify-items-center mb-4">
            {/* Row 1 */}
            <CalculatorButton
              label={<BackspaceIcon />}
              type={ButtonType.FUNCTION}
              onClick={handleDelete}
            />
            <CalculatorButton
              label={state.currentValue === '0' && !state.previousValue ? 'AC' : 'C'}
              type={ButtonType.FUNCTION}
              onClick={handleAC}
            />
            <CalculatorButton
              label="%"
              type={ButtonType.FUNCTION}
              onClick={handlePercent}
            />
            <CalculatorButton
              label="÷"
              type={ButtonType.OPERATOR}
              isActive={state.operator === '/' && state.waitingForNewValue}
              onClick={() => handleOperator('/')}
            />

            {/* Row 2 */}
            <CalculatorButton label="7" type={ButtonType.NUMBER} onClick={() => handleNumber('7')} />
            <CalculatorButton label="8" type={ButtonType.NUMBER} onClick={() => handleNumber('8')} />
            <CalculatorButton label="9" type={ButtonType.NUMBER} onClick={() => handleNumber('9')} />
            <CalculatorButton
              label="×"
              type={ButtonType.OPERATOR}
              isActive={state.operator === '*' && state.waitingForNewValue}
              onClick={() => handleOperator('*')}
            />

            {/* Row 3 */}
            <CalculatorButton label="4" type={ButtonType.NUMBER} onClick={() => handleNumber('4')} />
            <CalculatorButton label="5" type={ButtonType.NUMBER} onClick={() => handleNumber('5')} />
            <CalculatorButton label="6" type={ButtonType.NUMBER} onClick={() => handleNumber('6')} />
            <CalculatorButton
              label="−"
              type={ButtonType.OPERATOR}
              isActive={state.operator === '-' && state.waitingForNewValue}
              onClick={() => handleOperator('-')}
            />

            {/* Row 4 */}
            <CalculatorButton label="1" type={ButtonType.NUMBER} onClick={() => handleNumber('1')} />
            <CalculatorButton label="2" type={ButtonType.NUMBER} onClick={() => handleNumber('2')} />
            <CalculatorButton label="3" type={ButtonType.NUMBER} onClick={() => handleNumber('3')} />
            <CalculatorButton
              label="+"
              type={ButtonType.OPERATOR}
              isActive={state.operator === '+' && state.waitingForNewValue}
              onClick={() => handleOperator('+')}
            />

            {/* Row 5 */}
            <CalculatorButton label="⁺/₋" type={ButtonType.NUMBER} onClick={handleToggleSign} />
            <CalculatorButton label="0" type={ButtonType.NUMBER} onClick={() => handleNumber('0')} />
            <CalculatorButton label="." type={ButtonType.NUMBER} onClick={handleDecimal} />
            <CalculatorButton label="=" type={ButtonType.OPERATOR} onClick={handleEqual} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
