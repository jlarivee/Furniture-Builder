import { WoodSpecies } from '../types';

export const woodSpeciesDatabase: WoodSpecies[] = [
  {
    name: 'White Oak',
    hardness: 1360,
    workability: 'moderate',
    cost: 'high',
    sustainability: 'medium',
    characteristics: ['Durable', 'Water-resistant', 'Beautiful grain', 'Takes stain well'],
    bestUses: ['Furniture', 'Flooring', 'Outdoor projects', 'Cabinets']
  },
  {
    name: 'Red Oak',
    hardness: 1290,
    workability: 'easy',
    cost: 'medium',
    sustainability: 'high',
    characteristics: ['Open grain', 'Strong', 'Widely available', 'Affordable'],
    bestUses: ['Furniture', 'Flooring', 'Trim', 'General woodworking']
  },
  {
    name: 'Hard Maple',
    hardness: 1450,
    workability: 'difficult',
    cost: 'high',
    sustainability: 'medium',
    characteristics: ['Very hard', 'Fine grain', 'Light color', 'Dense'],
    bestUses: ['Cutting boards', 'Workbenches', 'Flooring', 'Fine furniture']
  },
  {
    name: 'Black Walnut',
    hardness: 1010,
    workability: 'easy',
    cost: 'high',
    sustainability: 'low',
    characteristics: ['Rich color', 'Beautiful grain', 'Stable', 'Premium wood'],
    bestUses: ['Fine furniture', 'Gunstocks', 'Musical instruments', 'Decorative pieces']
  },
  {
    name: 'Cherry',
    hardness: 995,
    workability: 'easy',
    cost: 'high',
    sustainability: 'medium',
    characteristics: ['Ages beautifully', 'Fine grain', 'Smooth finish', 'Darkens with age'],
    bestUses: ['Fine furniture', 'Cabinets', 'Turned objects', 'Interior trim']
  },
  {
    name: 'Pine (Eastern White)',
    hardness: 380,
    workability: 'easy',
    cost: 'low',
    sustainability: 'high',
    characteristics: ['Soft', 'Easy to work', 'Affordable', 'Lightweight'],
    bestUses: ['Beginner projects', 'Indoor furniture', 'Shelving', 'Painted pieces']
  },
  {
    name: 'Poplar',
    hardness: 540,
    workability: 'easy',
    cost: 'low',
    sustainability: 'high',
    characteristics: ['Straight grain', 'Inexpensive', 'Paints well', 'Light weight'],
    bestUses: ['Painted furniture', 'Utility projects', 'Practice pieces', 'Interior trim']
  },
  {
    name: 'Ash',
    hardness: 1320,
    workability: 'moderate',
    cost: 'medium',
    sustainability: 'low',
    characteristics: ['Strong', 'Flexible', 'Shock resistant', 'Open grain'],
    bestUses: ['Tool handles', 'Baseball bats', 'Furniture', 'Cabinets']
  },
  {
    name: 'Mahogany',
    hardness: 800,
    workability: 'easy',
    cost: 'high',
    sustainability: 'low',
    characteristics: ['Rich color', 'Stable', 'Fine grain', 'Traditional'],
    bestUses: ['Fine furniture', 'Boat building', 'Musical instruments', 'Luxury items']
  },
  {
    name: 'Birch',
    hardness: 1260,
    workability: 'moderate',
    cost: 'medium',
    sustainability: 'high',
    characteristics: ['Hard', 'Affordable alternative to maple', 'Fine grain', 'Light color'],
    bestUses: ['Plywood', 'Furniture', 'Turned objects', 'Painted projects']
  }
];

export const getWoodByName = (name: string): WoodSpecies | undefined => {
  return woodSpeciesDatabase.find(w => w.name.toLowerCase() === name.toLowerCase());
};

export const getWoodsByWorkability = (workability: 'easy' | 'moderate' | 'difficult'): WoodSpecies[] => {
  return woodSpeciesDatabase.filter(w => w.workability === workability);
};

export const getWoodsByCost = (cost: 'low' | 'medium' | 'high'): WoodSpecies[] => {
  return woodSpeciesDatabase.filter(w => w.cost === cost);
};
