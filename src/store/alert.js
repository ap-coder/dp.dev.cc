import * as types from './mutations_type.js'
import store from './store.js'

const state = {
    alertInfo: {
        visible: false,
        title: 'Tip',
        content: '',
        showCancel: true,
        confirmEvent: () => {},
        cancelEvent: () => {
            store.dispatch('hideAlert');
        }
    }
}

const actions = {
    showAlert({ commit }, payload) {
        commit(types.SET_ALERT, { ...payload, visible: true });
    },
    hideAlert({ commit }) {
        commit(types.SET_ALERT, {
            visible: false,
            title: 'Tip',
            content: '',
            showCancel: true,
            confirmEvent: () => {},
            cancelEvent: () => {
                store.dispatch('hideAlert');
            }
        });
    }
}

const mutations = {
    [types.SET_ALERT](state, payload) {
        Object.assign(state.alertInfo, payload);
        // state.alertInfo = payload;
    }
}

const getters = {
    alertInfo: state => state.alertInfo
}

export default {
  state,
  mutations,
  actions,
  getters,
}
