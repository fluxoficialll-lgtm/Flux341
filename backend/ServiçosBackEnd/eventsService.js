
import { randomUUID } from 'crypto';
import { eventProcessor } from './eventProcessor.js';

// Cache simples de idempotência (Em prod usaria Redis EX)
const idempotencyCache = new Set();

export const eventsService = {
    /**
     * Processa um evento de entrada, garantindo idempotência e criando um evento canônico.
     */
    ingestEvent: (originalEvent) => {
        const trackingId = originalEvent.event_id;

        if (idempotencyCache.has(trackingId)) {
            return { status: "ACCEPTED", duplicate: true };
        }

        idempotencyCache.add(trackingId);
        if (idempotencyCache.size > 5000) {
            const first = idempotencyCache.values().next().value;
            idempotencyCache.delete(first);
        }

        const internalEvent = {
            ...originalEvent,
            event_id: randomUUID(),
            tracking_id: trackingId,
        };

        eventProcessor.emit('ingested_event', internalEvent);

        return {
            status: "ACCEPTED",
            event_id: internalEvent.event_id,
            tracking_id: trackingId,
            timestamp: Date.now()
        };
    },

    /**
     * Retorna o status de saúde do coletor de eventos.
     */
    getHealth: () => {
        return {
            collector: 'ONLINE',
            processor: eventProcessor.getStats(),
            cache_size: idempotencyCache.size
        };
    }
};
