import * as Constants from '../utils/Constant';

export const getLoading = state => state.loading;

export const getUserInfo = (state) => {
    if (Object.keys(state.userInfo).length) {
        return state.userInfo;
    }
    return JSON.parse(localStorage.getItem(Constants.CACHE_USER_INFO));
};

export const getStoreList = state => state.storeList;

export const getProductStockList = state => state.productStockList;

export const getShoppingCart = state => state.shoppingCart;

export const getQuery = state => state.query;

export const getMenuList = state => state.menuList;

export const getMessageList = state => state.messageList;

export const getUserPermission = state => state.permission;

export const getRoleList = state => state.roleList;

export const getRoleItem = (state) => (id) => {
    return state.roleList.find(item => item.roleId === id);
}

export const getSelectUser = state => state.selectUser;

export const getSelectFile = state => state.selectFile;

export const getPlatformList = state => state.platformList;

export const getContractAccept = state => state.contractAccept;

export const getUserDetails = state => state.userDetails;
