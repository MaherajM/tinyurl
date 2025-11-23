import express from 'express';
import linkController from '../controllers/linkController';

const router = express.Router();

router.get('/healthz', (req, res) => {
  res.send({ status: 'OK', timestamp: new Date().toISOString() });
});

// Create a new short link
router.post('/', linkController.createShortLink);

// Get all links (optional - admin)
router.get('/', linkController.getAllLinks);

// Get link statistics
router.get('/:code', linkController.getLinkStats);

// Redirect to target URL (this should be one of the last routes)
router.get('/redirect/:code', linkController.redirectToTarget);

// Delete a link
router.delete('/:code', linkController.deleteLink);

export default router;
