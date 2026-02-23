
// --- MOCK DO SERVIÇO DE ARQUIVOS ---

class FileService {
    /**
     * Simula o upload de um arquivo.
     * @param {File} file - O arquivo para fazer upload.
     * @returns {Promise<string>} Uma promessa que resolve com a URL do arquivo.
     */
    async uploadFile(file) {
        console.log(`[File Mock] Fazendo upload do arquivo: ${file.name}`);
        // Simula uma URL de arquivo
        return Promise.resolve(`https://example.com/uploads/${file.name}`);
    }
}

export const fileService = new FileService();
