import express, { Request, Response } from 'express';
import claudeService from '../services/claudeService';
import dalleService from '../services/dalleService';
import documentGenerator from '../utils/documentGenerator';

const router = express.Router();

// Store generated documents (in production, use proper storage)
const documentCache = new Map<string, any>();

// Generate all documentation for a locked design
router.post('/generate/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { specs } = req.body;

    if (!specs) {
      return res.status(400).json({ error: 'Design specifications are required' });
    }

    // Generate cut list
    console.log('Generating cut list...');
    const cutList = await claudeService.generateCutList(specs);

    // Generate materials list
    console.log('Generating materials list...');
    const materialsList = await claudeService.generateMaterialsList(specs, cutList);

    // Generate build instructions
    console.log('Generating build instructions...');
    const buildInstructions = await claudeService.generateBuildInstructions(specs, cutList);

    // Generate multiple views
    console.log('Generating multiple views...');
    const multipleViews = await dalleService.generateMultipleViews(specs);

    // Generate assembly step images (first 3 steps only to save API calls)
    console.log('Generating assembly images...');
    const assemblyImages: { [key: number]: string } = {};
    for (let i = 0; i < Math.min(3, buildInstructions.length); i++) {
      const step = buildInstructions[i];
      assemblyImages[step.stepNumber] = await dalleService.generateAssemblyStepImage(
        specs,
        step.visualDescription
      );
      // Delay to avoid rate limiting
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    // Cache the generated documents
    const documents = {
      specs,
      cutList,
      materialsList,
      buildInstructions,
      multipleViews,
      assemblyImages,
      generatedAt: new Date().toISOString()
    };

    documentCache.set(sessionId, documents);

    res.json({
      message: 'Documents generated successfully',
      documents
    });
  } catch (error: any) {
    console.error('Error generating documents:', error);
    res.status(500).json({ error: error.message || 'Failed to generate documents' });
  }
});

// Get generated documents
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const documents = documentCache.get(sessionId);
    if (!documents) {
      return res.status(404).json({ error: 'Documents not found. Please generate them first.' });
    }

    res.json({ documents });
  } catch (error: any) {
    console.error('Error retrieving documents:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve documents' });
  }
});

// Export documents as ZIP
router.get('/export/:sessionId/zip', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const documents = documentCache.get(sessionId);
    if (!documents) {
      return res.status(404).json({ error: 'Documents not found' });
    }

    const zipBuffer = await documentGenerator.createZipExport(documents);

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename="furniture-plan-${sessionId}.zip"`);
    res.send(zipBuffer);
  } catch (error: any) {
    console.error('Error exporting ZIP:', error);
    res.status(500).json({ error: error.message || 'Failed to export ZIP' });
  }
});

// Export individual document as PDF
router.get('/export/:sessionId/pdf/:docType', async (req: Request, res: Response) => {
  try {
    const { sessionId, docType } = req.params;

    const documents = documentCache.get(sessionId);
    if (!documents) {
      return res.status(404).json({ error: 'Documents not found' });
    }

    const pdfBuffer = await documentGenerator.createPdfExport(documents, docType);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${docType}-${sessionId}.pdf"`);
    res.send(pdfBuffer);
  } catch (error: any) {
    console.error('Error exporting PDF:', error);
    res.status(500).json({ error: error.message || 'Failed to export PDF' });
  }
});

export default router;
