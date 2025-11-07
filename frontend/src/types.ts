export interface FurnitureSpecs {
  name: string;
  description: string;
  dimensions: {
    length: number;
    width: number;
    height: number;
    unit: string;
  };
  materials: string[];
  style: string;
  features: string[];
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
}

export interface CutListItem {
  partName: string;
  quantity: number;
  length: number;
  width: number;
  thickness: number;
  material: string;
  notes?: string;
}

export interface MaterialsListItem {
  item: string;
  quantity: string;
  estimatedCost: string;
}

export interface MaterialsList {
  lumber: MaterialsListItem[];
  hardware: MaterialsListItem[];
  finishing: MaterialsListItem[];
  tools: string[];
  totalEstimatedCost: string;
}

export interface BuildInstruction {
  stepNumber: number;
  title: string;
  instruction: string;
  safetyNotes: string[];
  visualDescription: string;
}

export interface GeneratedDocuments {
  specs: FurnitureSpecs;
  cutList: CutListItem[];
  materialsList: MaterialsList;
  buildInstructions: BuildInstruction[];
  multipleViews: { [key: string]: string };
  assemblyImages: { [key: number]: string };
  generatedAt: string;
}

export type AppPhase = 'input' | 'design' | 'documentation';
