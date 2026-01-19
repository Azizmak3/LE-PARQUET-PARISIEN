export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  location: string;
  beforeImage: string;
  afterImage: string;
  description: string;
  tags: string[];
}

export interface CalculatorState {
  step: number;
  type: string;
  surface: number;
  condition: string;
  finish: string;
  timing: string;
  isCalculating: boolean;
  result: CalculationResult | null;
}

export interface CalculationResult {
  minPrice: number;
  maxPrice: number;
  duration: string;
  materials: string[];
  recommendation: string;
  confidence: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface RenovationState {
  image: string | null;
  editedImage: string | null;
  isProcessing: boolean;
  prompt: string;
}

export interface InspirationState {
  generatedImage: string | null;
  isGenerating: boolean;
  prompt: string;
  size: '1K' | '2K' | '4K';
}
