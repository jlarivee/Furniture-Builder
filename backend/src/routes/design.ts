import express, { Request, Response } from 'express';
import { upload } from '../server';
import claudeService, { ConversationMessage } from '../services/claudeService';
import dalleService from '../services/dalleService';

const router = express.Router();

// Store active design sessions in memory (in production, use Redis or database)
const designSessions = new Map<string, any>();

// Generate initial design from description
router.post('/generate', upload.single('image'), async (req: Request, res: Response) => {
  try {
    const { description } = req.body;
    let imageBase64: string | undefined;

    if (req.file) {
      imageBase64 = req.file.buffer.toString('base64');
    }

    if (!description) {
      return res.status(400).json({ error: 'Description is required' });
    }

    // Generate furniture specifications using Claude
    const specs = await claudeService.interpretDesign(description, imageBase64);

    // Generate initial preview image using DALL-E
    const previewImage = await dalleService.generateFurnitureImage(specs);

    // Create session
    const sessionId = Date.now().toString();
    designSessions.set(sessionId, {
      specs,
      conversationHistory: [
        { role: 'user', content: description },
        { role: 'assistant', content: JSON.stringify(specs) }
      ],
      locked: false
    });

    res.json({
      sessionId,
      specs,
      previewImage,
      message: 'Design generated successfully'
    });
  } catch (error: any) {
    console.error('Error generating design:', error);
    res.status(500).json({ error: error.message || 'Failed to generate design' });
  }
});

// Modify existing design based on conversation
router.post('/modify/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userMessage } = req.body;

    const session = designSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Design session not found' });
    }

    if (session.locked) {
      return res.status(400).json({ error: 'Design is locked. Cannot modify.' });
    }

    // Get modified specifications
    const updatedSpecs = await claudeService.modifyDesign(
      session.specs,
      session.conversationHistory,
      userMessage
    );

    // Generate new preview image
    const previewImage = await dalleService.generateFurnitureImage(updatedSpecs);

    // Get chat response
    const chatResponse = await claudeService.chatResponse(
      session.conversationHistory,
      userMessage
    );

    // Update session
    session.specs = updatedSpecs;
    session.conversationHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: chatResponse }
    );

    res.json({
      specs: updatedSpecs,
      previewImage,
      chatResponse,
      message: 'Design updated successfully'
    });
  } catch (error: any) {
    console.error('Error modifying design:', error);
    res.status(500).json({ error: error.message || 'Failed to modify design' });
  }
});

// Chat without modifying design
router.post('/chat/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const { userMessage } = req.body;

    const session = designSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Design session not found' });
    }

    const chatResponse = await claudeService.chatResponse(
      session.conversationHistory,
      userMessage
    );

    session.conversationHistory.push(
      { role: 'user', content: userMessage },
      { role: 'assistant', content: chatResponse }
    );

    res.json({
      chatResponse,
      message: 'Chat response generated'
    });
  } catch (error: any) {
    console.error('Error in chat:', error);
    res.status(500).json({ error: error.message || 'Failed to get chat response' });
  }
});

// Lock design and prepare for documentation
router.post('/lock/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = designSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Design session not found' });
    }

    session.locked = true;

    res.json({
      message: 'Design locked successfully',
      specs: session.specs
    });
  } catch (error: any) {
    console.error('Error locking design:', error);
    res.status(500).json({ error: error.message || 'Failed to lock design' });
  }
});

// Get current design state
router.get('/:sessionId', async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;

    const session = designSessions.get(sessionId);
    if (!session) {
      return res.status(404).json({ error: 'Design session not found' });
    }

    res.json({
      specs: session.specs,
      conversationHistory: session.conversationHistory,
      locked: session.locked
    });
  } catch (error: any) {
    console.error('Error retrieving design:', error);
    res.status(500).json({ error: error.message || 'Failed to retrieve design' });
  }
});

export default router;
