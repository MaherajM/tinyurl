import { Router } from 'express';
const router = Router();

router.get('/health', (req, res) => {
  res.send({ status: 'OK', timestamp: new Date().toISOString() });
});

export default router;
