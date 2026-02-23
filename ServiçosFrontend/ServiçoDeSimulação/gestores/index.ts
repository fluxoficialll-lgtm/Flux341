
import { GestorDeUtilizadores } from './GestorDeUtilizadores';
import { GestorDePosts } from './GestorDePosts';
import { GestorDeGrupos } from './GestorDeGrupos';
import { GestorDeChats } from './GestorDeChats';
import { GestorDeNotificacoes } from './GestorDeNotificacoes';
import { GestorDeRelacionamentos } from './GestorDeRelacionamentos';
import { GestorFinanceiro } from './GestorFinanceiro';

export const userManager = new GestorDeUtilizadores();
export const postManager = new GestorDePosts();
export const groupManager = new GestorDeGrupos();
export const chatManager = new GestorDeChats();
export const notificationManager = new GestorDeNotificacoes();
export const relationshipManager = new GestorDeRelacionamentos();
export const financialManager = new GestorFinanceiro();
