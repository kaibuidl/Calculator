
export type Operator = '+' | '-' | '*' | '/' | null;

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export interface CalculatorState {
  currentValue: string;
  previousValue: string | null;
  operator: Operator;
  waitingForNewValue: boolean;
  history: HistoryItem[];
  isHistoryVisible: boolean;
}

export enum ButtonType {
  NUMBER = 'number',
  OPERATOR = 'operator',
  FUNCTION = 'function',
  DELETE = 'delete'
}
