import PDFDocument from 'pdfkit';
import archiver from 'archiver';
import { Readable } from 'stream';
import axios from 'axios';

class DocumentGenerator {
  async createZipExport(documents: any): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const archive = archiver('zip', { zlib: { level: 9 } });
      const chunks: Buffer[] = [];

      archive.on('data', (chunk) => chunks.push(chunk));
      archive.on('end', () => resolve(Buffer.concat(chunks)));
      archive.on('error', reject);

      // Add JSON data files
      archive.append(JSON.stringify(documents.specs, null, 2), { name: 'specifications.json' });
      archive.append(JSON.stringify(documents.cutList, null, 2), { name: 'cut-list.json' });
      archive.append(JSON.stringify(documents.materialsList, null, 2), { name: 'materials-list.json' });
      archive.append(JSON.stringify(documents.buildInstructions, null, 2), { name: 'build-instructions.json' });

      // Add PDFs
      const specsPdf = await this.createPdfExport(documents, 'specifications');
      archive.append(specsPdf, { name: 'specifications.pdf' });

      const cutListPdf = await this.createPdfExport(documents, 'cutlist');
      archive.append(cutListPdf, { name: 'cut-list.pdf' });

      const materialsPdf = await this.createPdfExport(documents, 'materials');
      archive.append(materialsPdf, { name: 'materials-list.pdf' });

      const buildPdf = await this.createPdfExport(documents, 'build');
      archive.append(buildPdf, { name: 'build-instructions.pdf' });

      // Add images
      try {
        for (const [angle, url] of Object.entries(documents.multipleViews)) {
          if (url) {
            const imageBuffer = await this.downloadImage(url as string);
            archive.append(imageBuffer, { name: `views/${angle}.png` });
          }
        }

        for (const [stepNum, url] of Object.entries(documents.assemblyImages)) {
          if (url) {
            const imageBuffer = await this.downloadImage(url as string);
            archive.append(imageBuffer, { name: `assembly/step-${stepNum}.png` });
          }
        }
      } catch (error) {
        console.error('Error downloading images:', error);
      }

      archive.finalize();
    });
  }

  async createPdfExport(documents: any, docType: string): Promise<Buffer> {
    return new Promise(async (resolve, reject) => {
      const doc = new PDFDocument({ margin: 50 });
      const chunks: Buffer[] = [];

      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Add title and header
      doc.fontSize(24).text(`Furniture Build Plan`, { align: 'center' });
      doc.fontSize(18).text(documents.specs.name, { align: 'center' });
      doc.moveDown();

      switch (docType) {
        case 'specifications':
          this.addSpecificationsSection(doc, documents.specs);
          break;
        case 'cutlist':
          this.addCutListSection(doc, documents.cutList);
          break;
        case 'materials':
          this.addMaterialsSection(doc, documents.materialsList);
          break;
        case 'build':
          this.addBuildInstructionsSection(doc, documents.buildInstructions);
          break;
        default:
          // Full document
          this.addSpecificationsSection(doc, documents.specs);
          doc.addPage();
          this.addCutListSection(doc, documents.cutList);
          doc.addPage();
          this.addMaterialsSection(doc, documents.materialsList);
          doc.addPage();
          this.addBuildInstructionsSection(doc, documents.buildInstructions);
      }

      doc.end();
    });
  }

  private addSpecificationsSection(doc: any, specs: any) {
    doc.fontSize(16).text('Specifications', { underline: true });
    doc.moveDown();

    doc.fontSize(12);
    doc.text(`Description: ${specs.description}`);
    doc.moveDown();

    doc.text('Dimensions:');
    doc.text(`  Length: ${specs.dimensions.length} ${specs.dimensions.unit}`);
    doc.text(`  Width: ${specs.dimensions.width} ${specs.dimensions.unit}`);
    doc.text(`  Height: ${specs.dimensions.height} ${specs.dimensions.unit}`);
    doc.moveDown();

    doc.text(`Style: ${specs.style}`);
    doc.moveDown();

    doc.text('Materials:');
    specs.materials.forEach((material: string) => {
      doc.text(`  • ${material}`);
    });
    doc.moveDown();

    doc.text('Features:');
    specs.features.forEach((feature: string) => {
      doc.text(`  • ${feature}`);
    });
  }

  private addCutListSection(doc: any, cutList: any[]) {
    doc.fontSize(16).text('Cut List', { underline: true });
    doc.moveDown();

    doc.fontSize(10);
    cutList.forEach((item, index) => {
      doc.text(`${index + 1}. ${item.partName}`);
      doc.text(`   Quantity: ${item.quantity}`);
      doc.text(`   Dimensions: ${item.length}" L × ${item.width}" W × ${item.thickness}" T`);
      doc.text(`   Material: ${item.material}`);
      if (item.notes) {
        doc.text(`   Notes: ${item.notes}`);
      }
      doc.moveDown(0.5);
    });
  }

  private addMaterialsSection(doc: any, materialsList: any) {
    doc.fontSize(16).text('Materials List', { underline: true });
    doc.moveDown();

    doc.fontSize(12);

    doc.text('Lumber:', { underline: true });
    materialsList.lumber?.forEach((item: any) => {
      doc.fontSize(10).text(`  • ${item.item} - Qty: ${item.quantity} - ${item.estimatedCost}`);
    });
    doc.moveDown();

    doc.fontSize(12).text('Hardware:', { underline: true });
    materialsList.hardware?.forEach((item: any) => {
      doc.fontSize(10).text(`  • ${item.item} - Qty: ${item.quantity} - ${item.estimatedCost}`);
    });
    doc.moveDown();

    doc.fontSize(12).text('Finishing:', { underline: true });
    materialsList.finishing?.forEach((item: any) => {
      doc.fontSize(10).text(`  • ${item.item} - Qty: ${item.quantity} - ${item.estimatedCost}`);
    });
    doc.moveDown();

    doc.fontSize(12).text('Tools Required:', { underline: true });
    materialsList.tools?.forEach((tool: string) => {
      doc.fontSize(10).text(`  • ${tool}`);
    });
    doc.moveDown();

    doc.fontSize(12).text(`Total Estimated Cost: ${materialsList.totalEstimatedCost}`, { bold: true });
  }

  private addBuildInstructionsSection(doc: any, buildInstructions: any[]) {
    doc.fontSize(16).text('Build Instructions', { underline: true });
    doc.moveDown();

    buildInstructions.forEach((step) => {
      doc.fontSize(14).text(`Step ${step.stepNumber}: ${step.title}`, { bold: true });
      doc.moveDown(0.5);
      doc.fontSize(11).text(step.instruction);

      if (step.safetyNotes && step.safetyNotes.length > 0) {
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('red').text('⚠ Safety Notes:', { bold: true });
        step.safetyNotes.forEach((note: string) => {
          doc.text(`  • ${note}`);
        });
        doc.fillColor('black');
      }

      doc.moveDown(1);

      // Add page break if needed
      if (doc.y > 650) {
        doc.addPage();
      }
    });
  }

  private async downloadImage(url: string): Promise<Buffer> {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    return Buffer.from(response.data);
  }
}

export default new DocumentGenerator();
