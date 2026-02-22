
import { randomUUID } from 'crypto';
import { eventProcessor } from '../ServiçosBackEnd/eventProcessor.js';

// Cache simples de idempotência (Em prod usaria Redis EX)
const idempotencyCache = new Set();

const eventsControle = {
    /**
     * POST /api/events/ingest
     * O Coletor "Fan-In" Profissional.
     */
    ingestEvent: async (req, res) => {
        try {
            const originalEvent = req.body;
            const trackingId = originalEvent.event_id; // O ID original, ex: "trc_..."

            // 1. Checagem de Idempotência com o ID de Rastreamento Original
            if (idempotencyCache.has(trackingId)) {
                return res.status(202).json({ status: "ACCEPTED", duplicate: true });
            }
            idempotencyCache.add(trackingId);
            if (idempotencyCache.size > 5000) {
                const first = idempotencyCache.values().next().value;
                idempotencyCache.delete(first);
            }

            // 2. Criação de um Novo Evento Canônico para o Sistema Interno
            const internalEvent = {
                ...originalEvent,
                event_id: randomUUID(), // ✨ GERA UM UUID VÁLIDO AQUI
                tracking_id: trackingId, // Guarda o ID de rastreamento original
            };

            // 3. DESACOPLAMENTO
            // Dispara o evento com o formato interno correto
            eventProcessor.emit('ingested_event', internalEvent);

            // 4. Resposta Imediata
            // Responde com o NOVO event_id interno, mas confirma o trackingId recebido
            res.status(202).json({ 
                status: "ACCEPTED", 
                event_id: internalEvent.event_id, // O novo ID
                tracking_id: trackingId, // O ID que o cliente enviou
                timestamp: Date.now()
            });

        } catch (e) {
            res.status(500).json({ error: "COLLECTOR_BUSY" });
        }
    },

    // Endpoint de status interno
    getHealth: (req, res) => {
        res.json({
            collector: 'ONLINE',
            processor: eventProcessor.getStats(),
            cache_size: idempotencyCache.size
        });
    }
};

export default eventsControle;
