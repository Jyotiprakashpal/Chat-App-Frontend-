// API Endpoints
export const ENDPOINTS = {
  // Auth endpoints
  AUTH: {
    REGISTER: '/api/auth/register',
    LOGIN: '/api/auth/login',
    GET_CURRENT_USER: '/api/auth/me',
  },
  // Chat endpoints
  CHAT: {
    GET_CONVERSATIONS: '/api/messages/conversations',
    MESSAGES: '/api/messages',  // (GET, POST)
  },
  // User endpoints
  USER: {
    GET_PROFILE: '/api/user/profile',
    UPDATE_PROFILE: '/api/user/profile',
    GET_USERS: '/api/auth/users',
  },
};

export default ENDPOINTS;
