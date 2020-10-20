import Vue from 'vue';
import Vuex from 'vuex';
import { state, mutations } from './mutations';
import * as actions from './actions';
import * as getters from './getters';
import Alert from './alert.js';
import Dialog from './dialog.js';

Vue.use(Vuex);

const store = new Vuex.Store({
  state,
  mutations,
  actions,
  getters,
  modules: {
    Alert,
    Dialog
  },
  strict: process.env.NODE_ENV !== 'production', // 是否开启严格模式
});

export default store;
