import express from 'express';
import { sugerirRotina } from '../controllers/rotinaController.js';

const router = express.Router();

router.post('/sugerir-rotina', sugerirRotina);

export default router;