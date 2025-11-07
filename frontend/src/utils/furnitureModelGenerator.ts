import * as THREE from 'three';
import { FurnitureSpecs } from '../types';

export interface FurniturePart {
  name: string;
  position: [number, number, number];
  dimensions: [number, number, number];
  material: string;
  color?: string;
}

export interface FurnitureModel {
  parts: FurniturePart[];
  boundingBox: {
    width: number;
    depth: number;
    height: number;
  };
}

/**
 * Generate a 3D model representation from furniture specifications
 */
export function generateFurnitureModel(specs: FurnitureSpecs): FurnitureModel {
  const { dimensions, style, features } = specs;
  const { length, width, height } = dimensions;

  // Convert inches to meters for Three.js (1 inch = 0.0254 meters)
  const toMeters = (inches: number) => inches * 0.0254;

  const parts: FurniturePart[] = [];

  // Determine furniture type from name
  const name = specs.name.toLowerCase();
  const isTable = name.includes('table') || name.includes('desk');
  const isChair = name.includes('chair') || name.includes('stool');
  const isShelf = name.includes('shelf') || name.includes('bookcase');
  const isCabinet = name.includes('cabinet') || name.includes('dresser');

  if (isTable) {
    parts.push(...generateTableModel(length, width, height, features));
  } else if (isChair) {
    parts.push(...generateChairModel(length, width, height, features));
  } else if (isShelf) {
    parts.push(...generateShelfModel(length, width, height, features));
  } else if (isCabinet) {
    parts.push(...generateCabinetModel(length, width, height, features));
  } else {
    // Generic box furniture
    parts.push(...generateGenericModel(length, width, height));
  }

  return {
    parts,
    boundingBox: {
      width: toMeters(length),
      depth: toMeters(width),
      height: toMeters(height)
    }
  };
}

function generateTableModel(length: number, width: number, height: number, features: string[]): FurniturePart[] {
  const parts: FurniturePart[] = [];
  const topThickness = 1.5; // inches
  const legThickness = 3; // inches
  const apronHeight = 4; // inches

  // Table top
  parts.push({
    name: 'Table Top',
    position: [0, height - topThickness / 2, 0],
    dimensions: [length, topThickness, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Check for shelf feature
  const hasShelf = features.some(f => f.toLowerCase().includes('shelf'));

  // Legs
  const legPositions: [number, number, number][] = [
    [(length / 2) - legThickness, (height - topThickness) / 2, (width / 2) - legThickness],
    [-(length / 2) + legThickness, (height - topThickness) / 2, (width / 2) - legThickness],
    [(length / 2) - legThickness, (height - topThickness) / 2, -(width / 2) + legThickness],
    [-(length / 2) + legThickness, (height - topThickness) / 2, -(width / 2) + legThickness]
  ];

  legPositions.forEach((pos, i) => {
    parts.push({
      name: `Leg ${i + 1}`,
      position: pos,
      dimensions: [legThickness, height - topThickness - (hasShelf ? 8 : 0), legThickness],
      material: 'wood',
      color: '#654321'
    });
  });

  // Aprons
  parts.push({
    name: 'Front Apron',
    position: [0, height - topThickness - apronHeight / 2, (width / 2) - 1],
    dimensions: [length - (legThickness * 2), apronHeight, 0.75],
    material: 'wood',
    color: '#654321'
  });

  parts.push({
    name: 'Back Apron',
    position: [0, height - topThickness - apronHeight / 2, -(width / 2) + 1],
    dimensions: [length - (legThickness * 2), apronHeight, 0.75],
    material: 'wood',
    color: '#654321'
  });

  // Lower shelf if specified
  if (hasShelf) {
    const shelfHeight = 8;
    parts.push({
      name: 'Lower Shelf',
      position: [0, shelfHeight, 0],
      dimensions: [length - 4, 0.75, width - 4],
      material: 'wood',
      color: '#8B4513'
    });
  }

  return parts;
}

function generateChairModel(length: number, width: number, height: number, features: string[]): FurniturePart[] {
  const parts: FurniturePart[] = [];
  const seatThickness = 1.5;
  const legThickness = 2;
  const seatHeight = 18;

  // Seat
  parts.push({
    name: 'Seat',
    position: [0, seatHeight, 0],
    dimensions: [length, seatThickness, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Legs
  const legPositions: [number, number, number][] = [
    [(length / 2) - 2, seatHeight / 2, (width / 2) - 2],
    [-(length / 2) + 2, seatHeight / 2, (width / 2) - 2],
    [(length / 2) - 2, seatHeight / 2, -(width / 2) + 2],
    [-(length / 2) + 2, seatHeight / 2, -(width / 2) + 2]
  ];

  legPositions.forEach((pos, i) => {
    parts.push({
      name: `Leg ${i + 1}`,
      position: pos,
      dimensions: [legThickness, seatHeight, legThickness],
      material: 'wood',
      color: '#654321'
    });
  });

  // Backrest
  const backHeight = height - seatHeight - seatThickness;
  if (backHeight > 0) {
    parts.push({
      name: 'Backrest',
      position: [0, seatHeight + seatThickness + backHeight / 2, -(width / 2) + 1.5],
      dimensions: [length - 4, backHeight, 1.5],
      material: 'wood',
      color: '#8B4513'
    });
  }

  return parts;
}

function generateShelfModel(length: number, width: number, height: number, features: string[]): FurniturePart[] {
  const parts: FurniturePart[] = [];
  const shelfThickness = 0.75;
  const sideThickness = 0.75;

  // Determine number of shelves
  const numShelves = Math.min(Math.floor(height / 12), 6);

  // Sides
  parts.push({
    name: 'Left Side',
    position: [-(length / 2) + sideThickness / 2, height / 2, 0],
    dimensions: [sideThickness, height, width],
    material: 'wood',
    color: '#8B4513'
  });

  parts.push({
    name: 'Right Side',
    position: [(length / 2) - sideThickness / 2, height / 2, 0],
    dimensions: [sideThickness, height, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Shelves
  for (let i = 0; i <= numShelves; i++) {
    const shelfY = (height / numShelves) * i;
    parts.push({
      name: i === 0 ? 'Bottom' : i === numShelves ? 'Top' : `Shelf ${i}`,
      position: [0, shelfY, 0],
      dimensions: [length - sideThickness * 2, shelfThickness, width],
      material: 'wood',
      color: '#A0826D'
    });
  }

  return parts;
}

function generateCabinetModel(length: number, width: number, height: number, features: string[]): FurniturePart[] {
  const parts: FurniturePart[] = [];
  const panelThickness = 0.75;

  // Box structure
  // Top
  parts.push({
    name: 'Top',
    position: [0, height - panelThickness / 2, 0],
    dimensions: [length, panelThickness, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Bottom
  parts.push({
    name: 'Bottom',
    position: [0, panelThickness / 2, 0],
    dimensions: [length, panelThickness, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Sides
  parts.push({
    name: 'Left Side',
    position: [-(length / 2) + panelThickness / 2, height / 2, 0],
    dimensions: [panelThickness, height, width],
    material: 'wood',
    color: '#8B4513'
  });

  parts.push({
    name: 'Right Side',
    position: [(length / 2) - panelThickness / 2, height / 2, 0],
    dimensions: [panelThickness, height, width],
    material: 'wood',
    color: '#8B4513'
  });

  // Back
  parts.push({
    name: 'Back Panel',
    position: [0, height / 2, -(width / 2) + panelThickness / 2],
    dimensions: [length - panelThickness * 2, height - panelThickness * 2, panelThickness],
    material: 'wood',
    color: '#A0826D'
  });

  // Doors
  const doorWidth = (length - panelThickness * 2 - 2) / 2;
  parts.push({
    name: 'Left Door',
    position: [-(doorWidth / 2) - 1, height / 2, (width / 2) + 0.5],
    dimensions: [doorWidth, height - panelThickness * 2 - 2, panelThickness],
    material: 'wood',
    color: '#654321'
  });

  parts.push({
    name: 'Right Door',
    position: [(doorWidth / 2) + 1, height / 2, (width / 2) + 0.5],
    dimensions: [doorWidth, height - panelThickness * 2 - 2, panelThickness],
    material: 'wood',
    color: '#654321'
  });

  return parts;
}

function generateGenericModel(length: number, width: number, height: number): FurniturePart[] {
  return [{
    name: 'Main Body',
    position: [0, height / 2, 0],
    dimensions: [length, height, width],
    material: 'wood',
    color: '#8B4513'
  }];
}

/**
 * Convert hex color to Three.js color
 */
export function hexToThreeColor(hex: string): THREE.Color {
  return new THREE.Color(hex);
}
