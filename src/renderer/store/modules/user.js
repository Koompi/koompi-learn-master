
import secureStorage from '@/secureStorage';

const state = {
  token: secureStorage.get('x-token') || null,
  id: secureStorage.get('x-user-id') || null,
  isResetPassword: false,
};

const mutations = {
  setToken(state, payload) {
    secureStorage.set('x-token', payload.token);
    secureStorage.set('x-user-id', payload.userId);

    state.token = payload.token;
    state.id = payload.userId;
    state.isResetPassword = payload.isResetPassword;
  },

  clearToken(state) {
    secureStorage.remove('x-token');
    secureStorage.remove('x-user-id');
    state.token = null;
    state.id = null;
    state.isResetPassword = false;
  },
};

const actions = {
};

export default {
  state,
  mutations,
  actions,
};
