// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    GET_CURRENT_USER: '/auth/me',
  },
  // Chat endpoints
  CHAT: {
    GET_CONVERSATIONS: '/messages/conversations',
    MESSAGES: '/messages',  // (GET, POST)
  },
  // User endpoints
  USER: {
    GET_PROFILE: '/user/profile',
    UPDATE_PROFILE: '/user/profile',
    GET_USERS: '/auth/users',
  },
};

export default ENDPOINTS;
