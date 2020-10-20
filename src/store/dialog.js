import * as types from './mutations_type.js'
import store from './store.js'

const state = {
    dialogInfo: {
        visible: false,
        title: 'Tip',
        component: '',
        id: '',
        userId:'',
        confirmEvent: () => {},
        cancelEvent: () => {
            store.dispatch('hideDialog');
        }
    }
}

const actions = {
    showDialog({ commit }, payload) {
        commit(types.SET_DIALOG, { ...payload, visible: true });
    },
    hideDialog({ commit }) {
        commit(types.SET_DIALOG, {
            visible: false,
            title: 'Tip',
            component: '',
            id: '',
            userId:'',
            confirmEvent: () => {},
            cancelEvent: () => {
                store.dispatch('hideDialog');
            }
        });
    }
}

const mutations = {
    [types.SET_DIALOG](state, payload) {
        Object.assign(state.dialogInfo, payload);
    }
}

const getters = {
    dialogInfo: state => state.dialogInfo
}

export default {
  state,
  mutations,
  actions,
  getters,
}
