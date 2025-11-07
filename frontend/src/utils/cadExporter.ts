import makerjs from 'makerjs';
import { FurnitureSpecs, CutListItem } from '../types';

export interface CADExportOptions {
  format: 'dxf' | 'svg' | 'pdf';
  view: 'top' | 'front' | 'side' | 'isometric';
  includeDimensions: boolean;
  includeLabels: boolean;
}

/**
 * Generate DXF file from furniture specifications
 */
export function generateDXF(specs: FurnitureSpecs, cutList: CutListItem[]): string {
  const models: any = {};
  let yOffset = 0;

  // Generate a simple rectangular representation for each part
  cutList.forEach((item, index) => {
    const rect = new makerjs.models.Rectangle(item.length, item.width);

    // Position parts in a grid layout
    const xOffset = (index % 3) * (item.length + 10);
    yOffset = Math.floor(index / 3) * 50;

    models[`part_${index}`] = makerjs.model.move(rect, [xOffset, yOffset]);

    // Add text label
    models[`label_${index}`] = {
      paths: {},
      caption: {
        text: `${item.partName} (${item.quantity}x)`,
        anchor: [xOffset + item.length / 2, yOffset - 5]
      }
    };
  });

  const drawing = {
    models
  };

  return makerjs.exporter.toDXF(drawing);
}

/**
 * Generate SVG file from furniture specifications
 */
export function generateSVG(specs: FurnitureSpecs, cutList: CutListItem[], options: CADExportOptions): string {
  const models: any = {};
  const scale = 10; // pixels per inch
  let yOffset = 0;

  cutList.forEach((item, index) => {
    const rect = new makerjs.models.Rectangle(item.length * scale, item.width * scale);

    const xOffset = (index % 3) * (item.length * scale + 100);
    yOffset = Math.floor(index / 3) * (Math.max(...cutList.map(c => c.width)) * scale + 80);

    models[`part_${index}`] = makerjs.model.move(rect, [xOffset, yOffset]);
  });

  const drawing = {
    models,
    units: makerjs.unitType.Inch
  };

  const svgOptions = {
    fontSize: '14px',
    strokeWidth: '2px',
    fill: 'none',
    stroke: '#000000',
    ...( options.includeDimensions && {
      annotate: true
    })
  };

  let svg = makerjs.exporter.toSVG(drawing, svgOptions);

  // Add title and metadata
  const title = `<title>${specs.name} - Cut Layout</title>`;
  const desc = `<desc>Generated cut layout for ${specs.name}. Dimensions: ${specs.dimensions.length}" × ${specs.dimensions.width}" × ${specs.dimensions.height}"</desc>`;

  svg = svg.replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg">${title}${desc}<svg`);

  return svg;
}

/**
 * Generate technical drawing SVG with dimensions and annotations
 */
export function generateTechnicalDrawing(specs: FurnitureSpecs, view: 'top' | 'front' | 'side'): string {
  const { length, width, height } = specs.dimensions;
  const scale = 5; // pixels per inch
  const padding = 100;

  let drawingWidth: number, drawingHeight: number, mainRect: any;

  switch (view) {
    case 'top':
      drawingWidth = length * scale;
      drawingHeight = width * scale;
      mainRect = new makerjs.models.Rectangle(drawingWidth, drawingHeight);
      break;
    case 'front':
      drawingWidth = length * scale;
      drawingHeight = height * scale;
      mainRect = new makerjs.models.Rectangle(drawingWidth, drawingHeight);
      break;
    case 'side':
      drawingWidth = width * scale;
      drawingHeight = height * scale;
      mainRect = new makerjs.models.Rectangle(drawingWidth, drawingHeight);
      break;
  }

  const drawing = {
    models: {
      main: makerjs.model.move(mainRect, [padding, padding])
    }
  };

  const svgOptions = {
    fontSize: '12px',
    strokeWidth: '1.5px',
    fill: 'none',
    stroke: '#000000',
    annotate: true,
    viewBox: true
  };

  let svg = makerjs.exporter.toSVG(drawing, svgOptions);

  // Add dimension lines and text manually
  const dimensionsSVG = generateDimensionLines(view, length, width, height, scale, padding);
  svg = svg.replace('</svg>', `${dimensionsSVG}</svg>`);

  // Add title
  svg = svg.replace('<svg', `<svg xmlns="http://www.w3.org/2000/svg"><title>${specs.name} - ${view.charAt(0).toUpperCase() + view.slice(1)} View</title><svg`);

  return svg;
}

function generateDimensionLines(
  view: string,
  length: number,
  width: number,
  height: number,
  scale: number,
  padding: number
): string {
  let dimensions = '';
  const offset = 30;

  if (view === 'top') {
    // Horizontal dimension (length)
    dimensions += `
      <line x1="${padding}" y1="${padding + width * scale + offset}"
            x2="${padding + length * scale}" y2="${padding + width * scale + offset}"
            stroke="#FF0000" stroke-width="1" marker-end="url(#arrow)" />
      <text x="${padding + (length * scale) / 2}" y="${padding + width * scale + offset + 20}"
            text-anchor="middle" font-size="14" fill="#FF0000">${length}"</text>

      <line x1="${padding + length * scale + offset}" y1="${padding}"
            x2="${padding + length * scale + offset}" y2="${padding + width * scale}"
            stroke="#FF0000" stroke-width="1" marker-end="url(#arrow)" />
      <text x="${padding + length * scale + offset + 20}" y="${padding + (width * scale) / 2}"
            text-anchor="middle" font-size="14" fill="#FF0000" transform="rotate(90 ${padding + length * scale + offset + 20} ${padding + (width * scale) / 2})">${width}"</text>
    `;
  } else if (view === 'front') {
    // Horizontal (length) and vertical (height)
    dimensions += `
      <line x1="${padding}" y1="${padding + height * scale + offset}"
            x2="${padding + length * scale}" y2="${padding + height * scale + offset}"
            stroke="#FF0000" stroke-width="1" />
      <text x="${padding + (length * scale) / 2}" y="${padding + height * scale + offset + 20}"
            text-anchor="middle" font-size="14" fill="#FF0000">${length}"</text>

      <line x1="${padding + length * scale + offset}" y1="${padding}"
            x2="${padding + length * scale + offset}" y2="${padding + height * scale}"
            stroke="#FF0000" stroke-width="1" />
      <text x="${padding + length * scale + offset + 20}" y="${padding + (height * scale) / 2}"
            text-anchor="middle" font-size="14" fill="#FF0000" transform="rotate(90 ${padding + length * scale + offset + 20} ${padding + (height * scale) / 2})">${height}"</text>
    `;
  } else if (view === 'side') {
    dimensions += `
      <line x1="${padding}" y1="${padding + height * scale + offset}"
            x2="${padding + width * scale}" y2="${padding + height * scale + offset}"
            stroke="#FF0000" stroke-width="1" />
      <text x="${padding + (width * scale) / 2}" y="${padding + height * scale + offset + 20}"
            text-anchor="middle" font-size="14" fill="#FF0000">${width}"</text>

      <line x1="${padding + width * scale + offset}" y1="${padding}"
            x2="${padding + width * scale + offset}" y2="${padding + height * scale}"
            stroke="#FF0000" stroke-width="1" />
      <text x="${padding + width * scale + offset + 20}" y="${padding + (height * scale) / 2}"
            text-anchor="middle" font-size="14" fill="#FF0000" transform="rotate(90 ${padding + width * scale + offset + 20} ${padding + (height * scale) / 2})">${height}"</text>
    `;
  }

  return dimensions;
}

/**
 * Download file to user's computer
 */
export function downloadFile(content: string, filename: string, mimeType: string) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Export CAD file based on format
 */
export function exportCAD(
  format: 'dxf' | 'svg',
  specs: FurnitureSpecs,
  cutList: CutListItem[],
  view: 'top' | 'front' | 'side' = 'top'
) {
  const filename = `${specs.name.replace(/\s+/g, '-').toLowerCase()}-${view}`;

  let content: string;
  let mimeType: string;
  let fileExtension: string;

  switch (format) {
    case 'dxf':
      content = generateDXF(specs, cutList);
      mimeType = 'application/dxf';
      fileExtension = 'dxf';
      break;
    case 'svg':
      content = generateTechnicalDrawing(specs, view);
      mimeType = 'image/svg+xml';
      fileExtension = 'svg';
      break;
    default:
      throw new Error(`Unsupported format: ${format}`);
  }

  downloadFile(content, `${filename}.${fileExtension}`, mimeType);
}
