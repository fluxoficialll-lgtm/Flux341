class RankingServiceController {
    getRankedList(category) {
        console.log(`[RankingService] Solicitada lista para a categoria: ${category}`);
        return [];
    }
}

export const RankingService = new RankingServiceController();
