export type SkillLevel = 'beginner' | 'intermediate' | 'advanced';

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
  skillLevel?: SkillLevel;
  estimatedCost?: number;
  estimatedHours?: number;
  complexity?: number; // 1-10 scale
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
  estimatedTime?: number; // in minutes
  difficulty?: SkillLevel;
  toolsRequired?: string[];
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

export type AppPhase = 'inspiration' | 'input' | 'design' | 'documentation';

export interface DesignPreferences {
  skillLevel: SkillLevel;
  availableTools: string[];
  maxBudget?: number;
  preferredMaterials?: string[];
  sustainabilityPreference?: 'low' | 'medium' | 'high';
}

export interface WoodSpecies {
  name: string;
  hardness: number; // Janka hardness
  workability: 'easy' | 'moderate' | 'difficult';
  cost: 'low' | 'medium' | 'high';
  sustainability: 'low' | 'medium' | 'high';
  characteristics: string[];
  bestUses: string[];
}

export interface JoineryType {
  name: string;
  difficulty: SkillLevel;
  strength: 'low' | 'medium' | 'high';
  toolsRequired: string[];
  description: string;
  whenToUse: string;
}

export interface DesignVersion {
  id: string;
  timestamp: number;
  specs: FurnitureSpecs;
  previewImage: string;
  notes: string;
}

export interface ProjectProgress {
  designId: string;
  completedSteps: number[];
  photos: { [stepNumber: number]: string };
  notes: { [stepNumber: number]: string };
  startedAt: number;
  completedAt?: number;
}
