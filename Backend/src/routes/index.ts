import { Router } from 'express';
import LinkRoutes from './linkRoutes';
const router = Router();

router.get('/healthz', (req, res) => {
  res.send({ status: 'OK', timestamp: new Date().toISOString() });
});

router.use('/links', LinkRoutes);

export default router;
