import express from 'express';
import { ingest } from './ingest';
import { enrich } from './enrich';

const router = express.Router();

router.post('/ingest', ingest);
router.post('/enrich', enrich);

export default router;