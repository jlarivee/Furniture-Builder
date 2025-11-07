import { JoineryType } from '../types';

export const joineryDatabase: JoineryType[] = [
  {
    name: 'Pocket Hole Screws',
    difficulty: 'beginner',
    strength: 'medium',
    toolsRequired: ['Pocket hole jig', 'Drill', 'Clamps'],
    description: 'Angled pilot holes that hide screws at a 15-degree angle. Fast and effective for face frames and carcass assembly.',
    whenToUse: 'Quick projects, hidden joints, beginner-friendly assemblies'
  },
  {
    name: 'Butt Joint',
    difficulty: 'beginner',
    strength: 'low',
    toolsRequired: ['Saw', 'Glue', 'Clamps'],
    description: 'Two pieces of wood joined end-to-end or edge-to-edge. Simplest joint but weakest without reinforcement.',
    whenToUse: 'Non-structural applications, when reinforced with screws or dowels'
  },
  {
    name: 'Dowel Joint',
    difficulty: 'beginner',
    strength: 'medium',
    toolsRequired: ['Doweling jig', 'Drill', 'Clamps', 'Dowel centers'],
    description: 'Wooden pegs inserted into aligned holes in both pieces. Good alternative to mortise and tenon.',
    whenToUse: 'Edge-to-edge joints, table aprons, chair rails'
  },
  {
    name: 'Biscuit Joint',
    difficulty: 'intermediate',
    strength: 'medium',
    toolsRequired: ['Biscuit joiner', 'Clamps', 'Glue'],
    description: 'Football-shaped wafers fit into crescent-shaped slots. Excellent for alignment and moderate strength.',
    whenToUse: 'Panel glue-ups, edge-to-edge joints, miter joints'
  },
  {
    name: 'Mortise and Tenon',
    difficulty: 'intermediate',
    strength: 'high',
    toolsRequired: ['Chisel', 'Drill or router', 'Saw', 'Clamps'],
    description: 'A rectangular projection (tenon) fits into a rectangular hole (mortise). Traditional and very strong.',
    whenToUse: 'Table legs and aprons, chair construction, door frames'
  },
  {
    name: 'Dovetail Joint',
    difficulty: 'advanced',
    strength: 'high',
    toolsRequired: ['Dovetail saw', 'Chisels', 'Marking gauge', 'Router (optional)'],
    description: 'Interlocking wedge-shaped pins and tails. Strongest joint and visually striking.',
    whenToUse: 'Drawer construction, box corners, high-end furniture'
  },
  {
    name: 'Box Joint (Finger Joint)',
    difficulty: 'intermediate',
    strength: 'high',
    toolsRequired: ['Table saw or router', 'Box joint jig', 'Glue'],
    description: 'Interlocking rectangular "fingers" create large glue surface. Easier than dovetails.',
    whenToUse: 'Box construction, drawers, decorative boxes'
  },
  {
    name: 'Half-Lap Joint',
    difficulty: 'beginner',
    strength: 'medium',
    toolsRequired: ['Saw', 'Chisel', 'Clamps'],
    description: 'Half the thickness removed from each piece so they overlap flush. Simple and effective.',
    whenToUse: 'Frame construction, crossed braces, shelving'
  },
  {
    name: 'Dado Joint',
    difficulty: 'beginner',
    strength: 'medium',
    toolsRequired: ['Table saw or router', 'Dado blade (optional)', 'Clamps'],
    description: 'A groove cut across the grain to receive another piece. Great for shelving.',
    whenToUse: 'Bookcase shelves, cabinet dividers, drawer bottoms'
  },
  {
    name: 'Rabbet Joint',
    difficulty: 'beginner',
    strength: 'medium',
    toolsRequired: ['Table saw or router', 'Clamps'],
    description: 'L-shaped groove cut along the edge or end of a board. Often used with backs and bottoms.',
    whenToUse: 'Cabinet backs, picture frames, drawer construction'
  },
  {
    name: 'Miter Joint',
    difficulty: 'intermediate',
    strength: 'low',
    toolsRequired: ['Miter saw', 'Clamps', 'Glue'],
    description: 'Two pieces cut at complementary angles (usually 45°) to form a corner. Needs reinforcement.',
    whenToUse: 'Picture frames, crown molding, decorative borders'
  },
  {
    name: 'Bridle Joint',
    difficulty: 'advanced',
    strength: 'high',
    toolsRequired: ['Saw', 'Chisel', 'Marking gauge'],
    description: 'Similar to mortise and tenon but open on one side. Strong and attractive.',
    whenToUse: 'Chair and table legs, frame construction'
  }
];

export const getJoineryByDifficulty = (difficulty: 'beginner' | 'intermediate' | 'advanced'): JoineryType[] => {
  return joineryDatabase.filter(j => j.difficulty === difficulty);
};

export const getJoineryByStrength = (strength: 'low' | 'medium' | 'high'): JoineryType[] => {
  return joineryDatabase.filter(j => j.strength === strength);
};
