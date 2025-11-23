import express from 'express';
import linkController from '../controllers/linkController';

const router = express.Router();

router.get('/healthz', (req, res) => {
  res.send({ status: 'OK', timestamp: new Date().toISOString() });
});

router.post('/', linkController.createShortLink);

router.get('/', linkController.getAllLinks);

router.get('/:code', linkController.getLinkStats);

router.put('/:code', linkController.updateLink);

router.get('/redirect/:code', linkController.redirectToTarget);

router.delete('/:code', linkController.deleteLink);

export default router;
