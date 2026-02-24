
import { postService as realPostService } from './postService';
import { mockPostService } from '../ServiçoDeSimulação/simulacoes/SimulacaoDeFeed'; 
import { ControleDeSimulacao } from '../ServiçoDeSimulação/ControleDeSimulacao';

const getPostService = () => {
  return ControleDeSimulacao.isMockMode() ? mockPostService : realPostService;
};

export const postService = getPostService();
