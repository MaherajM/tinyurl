import { Request, Response } from 'express';
import linkService from '../services/linkService';

class LinkController {
  async createShortLink(req: Request, res: Response): Promise<void> {
    try {
      const { code, target } = req.body;
      console.log('Received createShortLink request with body:', req.body);

      if (!target) {
        res.status(400).json({ error: 'Target URL is required' });
        return;
      }

      if (!linkService.isValidUrl(target)) {
        res.status(400).json({ error: 'Invalid target URL format' });
        return;
      }

      const link = await linkService.createLink(code, target);

      res.status(201).json({
        code: link.code,
        target: link.target,
        shortUrl: `${process.env.BASE_URL || 'http://localhost:3000'}/${link.code}`,
        createdAt: link.createdAt
      });
    } catch (error: any) {
      if (error.message === 'CODE_EXISTS') {
        res.status(409).json({ error: 'Code already exists' });
        return;
      }
      if (error.name === 'ValidationError') {
        res.status(400).json({ error: error.message });
        return;
      }
      console.error('Error creating link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async redirectToTarget(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      const link = await linkService.incrementClicks(code);

      if (!link) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      res.status(200).json({
        success: true,
        target: link.target,
        code: link.code
      });
    } catch (error) {
      console.error('Error redirecting:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getLinkStats(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      const link = await linkService.getLinkStats(code);

      if (!link) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      res.json({
        code: link.code,
        target: link.target,
        clicks: link.clicks,
        createdAt: link.createdAt,
        lastClickedAt: link.lastClickedAt
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async updateLink(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;
      const { target } = req.body;

      if (!target) {
        res.status(400).json({ error: 'Target URL is required' });
        return;
      }

      if (!linkService.isValidUrl(target)) {
        res.status(400).json({ error: 'Invalid target URL format' });
        return;
      }

      const link = await linkService.updateLink(code, target);

      if (!link) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      res.json({
        code: link.code,
        target: link.target,
        clicks: link.clicks,
        createdAt: link.createdAt,
        lastClickedAt: link.lastClickedAt,
        message: 'Link updated successfully'
      });
    } catch (error) {
      console.error('Error updating link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async deleteLink(req: Request, res: Response): Promise<void> {
    try {
      const { code } = req.params;

      const deleted = await linkService.deleteLink(code);

      if (!deleted) {
        res.status(404).json({ error: 'Link not found' });
        return;
      }

      res.json({ message: 'Link deleted successfully' });
    } catch (error) {
      console.error('Error deleting link:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }

  async getAllLinks(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 100;
      const skip = parseInt(req.query.skip as string) || 0;

      const links = await linkService.getAllLinks(limit, skip);

      res.json({
        count: links.length,
        links: links.map(link => ({
          code: link.code,
          target: link.target,
          clicks: link.clicks,
          createdAt: link.createdAt,
          lastClickedAt: link.lastClickedAt
        }))
      });
    } catch (error) {
      console.error('Error fetching links:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
}

export default new LinkController();
