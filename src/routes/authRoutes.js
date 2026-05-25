import express from 'express';
import { gerarUrlLogin, callbackGoogle } from '../controllers/authController.js';

const router = express.Router();

router.get('/', gerarUrlLogin); 
router.get('/oauth2callback', callbackGoogle); 

export default router;