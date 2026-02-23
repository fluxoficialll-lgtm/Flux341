
// --- MOCK DO SERVIÇO DE RELACIONAMENTO ---

class RelationshipService {
    /**
     * Simula a verificação se um usuário está seguindo outro.
     * @param {string} followerId - O ID de quem segue.
     * @param {string} followingId - O ID de quem está sendo seguido.
     * @returns {Promise<boolean>}
     */
    isFollowing(followerId, followingId) {
        console.log(`[Relationship Mock] Verificando se ${followerId} segue ${followingId}`);
        // Mock: O usuário nunca segue ninguém inicialmente.
        return Promise.resolve(false);
    }

    /**
     * Simula a ação de seguir ou deixar de seguir um usuário.
     * @param {string} followerId - O ID de quem segue.
     * @param {string} followingId - O ID de quem está sendo seguido.
     * @returns {Promise<void>}
     */
    toggleFollow(followerId, followingId) {
        console.log(`[Relationship Mock] ${followerId} está seguindo/deixando de seguir ${followingId}`);
        // A lógica de estado real seria gerenciada no banco de dados ou estado da aplicação.
        return Promise.resolve();
    }
}

export const relationshipService = new RelationshipService();
