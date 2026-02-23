import { MOCK_USERS } from './usuarios.js';

// Posts Simulados
export const MOCK_POSTS = [
  {
    id: 'mock_101',
    username: 'Alice',
    avatar: MOCK_USERS['1'].avatar,
    timestamp: new Date(Date.now() - 3600000).toISOString(),
    text: 'Um lindo dia no parque!',
    image: 'https://images.unsplash.com/photo-1583147610149-78ac5cb5a303?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2940&q=80',
    likes: 150,
    comments: 23,
    views: 2500,
    liked: false,
    type: 'image',
    isAd: false,
  }
];
