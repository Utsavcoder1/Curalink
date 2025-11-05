import express, { Request, Response } from 'express';
import { ExternalAPIService } from '../services/externalApis';

const router = express.Router();

// Generate AI summary for content
router.post('/summarize', async (req: Request, res: Response): Promise<Response> => {
  try {
    const { text, type } = req.body;

    if (!text) {
      return res.status(400).json({
        success: false,
        message: 'Text content is required'
      });
    }

    // Pass both title and abstract as text (since your method expects two params)
    const aiSummary = ExternalAPIService.generateAISummary(text, text, type);

    return res.json({
      success: true,
      data: { summary: aiSummary }
    });
  } catch (error) {
    console.error('AI summary error:', error);
    return res.status(500).json({
      success: false,
      message: 'Error generating AI summary'
    });
  }
});

export default router;
