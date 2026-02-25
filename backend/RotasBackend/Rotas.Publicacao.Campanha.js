
import express from 'express';
import campanhaControle from '../controles/Controles.Campanha.js';

const router = express.Router();

// @route   POST /campaigns
// @desc    Criar uma nova campanha
// @access  Private
router.post('/', campanhaControle.createCampaign);

// @route   GET /campaigns
// @desc    Obter todas as campanhas
// @access  Public
router.get('/', campanhaControle.getCampaigns);

// @route   GET /campaigns/:campaignId
// @desc    Obter uma campanha específica
// @access  Public
router.get('/:campaignId', campanhaControle.getCampaignById);

// @route   PUT /campaigns/:campaignId
// @desc    Atualizar uma campanha
// @access  Private
router.put('/:campaignId', campanhaControle.updateCampaign);

// @route   DELETE /campaigns/:campaignId
// @desc    Deletar uma campanha
// @access  Private
router.delete('/:campaignId', campanhaControle.deleteCampaign);

export default router;
