
import express from 'express';
import eventsControle from '../controles/eventsControle.js';
import { validate, eventSchema } from '../validators.js';

const router = express.Router();

/**
 * POST /api/events/ingest
 * O Coletor "Fan-In" Profissional.
 */
router.post('/ingest', validate(eventSchema), eventsControle.ingestEvent);

// Endpoint de status interno
router.get('/health', eventsControle.getHealth);

export default router;
