import * as types from './mutations_type';

export const state = {
  loading: false,
  userInfo: {},
  storeList: [],
  productStockList: {},
  shoppingCart: {},
  query: {},
  menuList: [],
  messageList: [],
  permission: [],
  roleList: [],
  selectUser: {},
  selectFile: {},
  platformList: [],
  contractAccept: 0,
  userDetails: {}
};

export const mutations = {
  [types.SET_LOADING](state, value) {
    state.loading = value;
  },
  [types.SET_USER_INFO](state, value) {
    state.userInfo = value;
    state.loading = false;
  },
  [types.SET_PRODUCT_STOCK_LIST](state, res) {
    state.productStockList = res;
    state.loading = false;
  },
  [types.SET_STORE_LIST](state, res) {
    state.storeList = res;
    state.loading = false;
  },
  [types.SET_SHOPPING_CART](state, value) {
    state.shoppingCart = value;
  },
  [types.SET_QUERY](state, value) {
    state.query = value;
  },
  [types.SET_MENU_LIST](state, value) {
    state.loading = value;
    state.menuList = value;
  },
  [types.SET_MESSAGE_LIST](state, value) {
    state.loading = value;
    state.messageList = value;
  },
  [types.SET_PERMISSION](state, value) {
    state.loading = value;
    state.permission = value;
  },
  [types.SET_ROLE_LIST](state, value) {
    state.loading = value;
    state.roleList = value;
  },
  [types.SET_USER_PROFILE](state, value) {
    state.selectUser = value;
  },
  [types.SET_FILE_ITEM](state, value) {
    state.selectFile = value;
  },
  [types.SET_PLATFORM_LIST](state, value) {
    state.platformList = value;
  },
  [types.SET_CONTRACT_ACCEPT](state, value) {
    state.contractAccept = value;
  },
  [types.SET_USER_DETAILS](state, value) {
    state.userDetails = value;
  }
};
