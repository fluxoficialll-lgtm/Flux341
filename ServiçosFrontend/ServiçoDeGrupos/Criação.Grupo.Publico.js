
import { groupService } from './groupService.js';
import { fileService } from '../ServiçoDeArquivos/fileService.js';
import { authService } from '../ServiçoDeAutenticação/authService.js';

/**
 * Serviço para orquestrar a criação de grupos públicos.
 */
export const ServiçoCriaçãoGrupoPublico = {

    /**
     * Cria um novo grupo público.
     * @param {object} payload - Os dados do grupo vindos do hook/componente.
     * @param {string} payload.groupName - O nome do grupo.
     * @param {string} payload.description - A descrição do grupo.
     * @param {string | undefined} payload.coverImage - A URL da imagem de capa (se já houver).
     * @param {File | null} payload.selectedCoverFile - O arquivo da imagem de capa para upload.
     * @returns {Promise<object>} - O objeto do grupo recém-criado.
     */
    async criar(payload) {
        const {
            groupName,
            description,
            coverImage,
            selectedCoverFile
        } = payload;

        let finalCoverUrl = coverImage;

        // Se um novo arquivo foi selecionado, faz o upload.
        if (selectedCoverFile) {
            finalCoverUrl = await fileService.uploadFile(selectedCoverFile);
        }

        const currentUserId = authService.getCurrentUserId();
        const currentUserEmail = authService.getCurrentUserEmail();

        const newGroup = {
            id: Date.now().toString(), // ID provisório
            name: groupName,
            description: description,
            coverImage: finalCoverUrl,
            isVip: false,
            price: '0',
            currency: 'BRL',
            accessType: 'lifetime',
            lastMessage: "Bem-vindo ao novo grupo!",
            time: "Agora",
            creatorId: currentUserId || '',
            creatorEmail: currentUserEmail || undefined,
            memberIds: currentUserId ? [currentUserId] : [],
            adminIds: currentUserId ? [currentUserId] : [],
            status: 'active',
        };

        // Chama o serviço principal de grupos para criar o registro.
        return await groupService.createGroup(newGroup);
    }
};
