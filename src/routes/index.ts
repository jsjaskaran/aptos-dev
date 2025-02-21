import express from 'express';
import configRouter from './config';
import modelsRouter from './models';
import searchRouter from './search';
import discoverRouter from './discover';
import uploadsRouter from './uploads';

const router = express.Router();

router.use('/config', configRouter);
router.use('/models', modelsRouter);
router.use('/search', searchRouter);
router.use('/discover', discoverRouter);
router.use('/uploads', uploadsRouter);

export default router;
