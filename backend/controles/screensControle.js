
import { screenService } from '../ServiçosBackEnd/screenService.js';

const screensControle = {
    /**
     * BFF Endpoint: My Business Screen (Criador - Acesso Comum)
     * Agrega dados de várias fontes para construir a tela "Meu Negócio" do criador.
     */
    getMyBusinessScreen: async (req, res) => {
        try {
            const { userId } = req.query;
            const screenData = await screenService.getMyBusinessScreen(userId, req.traceId);
            res.json(screenData);
        } catch (e) {
            // O serviço já logou o erro, apenas retornamos a resposta apropriada.
            res.status(e.statusCode || 500).json({ error: e.message || 'Failed to build business dashboard' });
        }
    }
};

export default screensControle;
