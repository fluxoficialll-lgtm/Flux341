
import express from 'express';
import adsControle from '../controles/adsControle.js';

const router = express.Router();

// Criar nova campanha
router.post('/create', adsControle.createCampaign);

// Obter todas as campanhas do usuário logado
router.get('/', adsControle.getCampaigns);

// Obter detalhes de uma campanha
router.get('/:id', adsControle.getCampaignById);

// Atualizar campanha
router.put('/:id', adsControle.updateCampaign);

// Adicionar orçamento (top-up)
router.post('/:id/top-up', adsControle.addBudgetToCampaign);

// Deletar campanha
router.delete('/:id', adsControle.deleteCampaign);

// Endpoint de Performance
router.get('/:id/performance', adsControle.getCampaignPerformance);

// Registrar evento (View/Click)
router.post('/track', adsControle.trackAdEvent);

export default router;
