/* eslint-disable no-unused-vars */
import axios from 'axios';
import * as types from './mutations_type';
import * as Constants from '../utils/Constant';
import {SET_MENU_LIST, SET_PLATFORM_LIST} from "./mutations_type";
import Notification from '../utils/notice_manager';

export function logOut({commit}) {
    commit(types.SET_USER_INFO, {});
    localStorage.removeItem(Constants.CACHE_USER_PERMISSION);
    localStorage.removeItem(Constants.CACHE_USER_KEY);
    localStorage.removeItem(Constants.CACHE_USER_INFO);
}

// 暫存登入會員
export function configUserInfo({commit}, data) {
    console.log('configUserInfo', data);
    localStorage.setItem(Constants.CACHE_USER_KEY, data.token);
    commit(types.SET_USER_INFO, data);
    commit(types.SET_PERMISSION, data.permissions);
    // console.log('configUserInfo permissions', JSON.stringify(data.permissions));
    localStorage.setItem(Constants.CACHE_USER_PERMISSION, JSON.stringify(data.permissions));
    localStorage.setItem(Constants.CACHE_USER_INFO, JSON.stringify(data));
}

// User Detail 所選擇的會員
export function configUserDetail({commit}, data) {
    // console.log(`configUserDetail ${JSON.stringify(data)}`);
    commit(types.SET_USER_PROFILE, data);
}

// File Detail 所選擇的檔案
export function configFileDetail({commit}, data) {
    // console.log(`configUserDetail ${JSON.stringify(data)}`);
    commit(types.SET_FILE_ITEM, data);
}


// 註冊
export async function registerUser({ commit },data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/register`,
            headers: {},
            data,
        });
    } catch (e) {
        return e;
    }
}

// 取得RSA Key
export async function getKey({ commit }) {
    try {
        return await axios({
            method: 'get',
            url: `${Constants.API_URL}users/key`,
            headers: {},
        });
    } catch (e) {
        return e;
    }
}

// 登入
export async function login({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/login`,
            headers: {},
            data,
        });
    } catch (e) {
        return e;
    }
}

// 忘記密碼
export async function forgetPassword({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/forgetPassword`,
            headers: {
            },
            data,
        });
    } catch (e) {
        return e;
    }
}

// 會員列表
export async function fetchUserList({ commit },data) {
    try {
        console.log(`req ${JSON.stringify(data)}`)
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.query,
        });
    } catch (e) {
        return e;
    }
}

// 取得用戶資料
export async function fetchUserInfo({ commit },data) {
    try {
        return await axios({
            method: 'get',
            url: `${Constants.API_URL}users/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
        });
    } catch (e) {
        return e;
    }
}

// 檢查Token 是否失效
export async function verifyToken({ commit },data) {
    try {
        return await axios({
            method: 'get',
            url: `${Constants.API_URL}users/verifyToken`,
            headers: {
                token: `Bearer ${data.token}`,
            },
        });
    } catch (e) {
        return e;
    }
}

// 更新會員資料
export async function saveUserInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/save`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
    } catch (e) {
        return e;
    }
}

// 更新Profile
export async function updateProfile({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/updateProfile`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
    } catch (e) {
        return e;
    }
}

// 更新會員密碼
export async function updatePassword({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/updatePassword`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
    } catch (e) {
        return e;
    }
}

// 更新會員Email
export async function changeEmail({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/changeEmail`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
    } catch (e) {
        return e;
    }
}

// Role List
export async function loadRoleList({ commit }, data) {
    try {
        const res = await axios({
            method: 'post',
            url: `${Constants.API_URL}role/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.query
        });
        console.log(`role ${JSON.stringify(res.data)}`);
        if (res.data && res.data.data.list){
            commit(types.SET_ROLE_LIST, res.data.data.list);
        }
        return res;
    } catch (e) {
        console.log(`role error ${JSON.stringify(e)}`);
    }
}

// Role info
export async function getRoleInfo({ commit }, data) {
    try {
        const res = await axios({
            method: 'post',
            url: `${Constants.API_URL}role/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data
        });
        console.log(`getRoleInfo ${JSON.stringify(res)}`);
        return res;
    } catch (e) {
        console.log(`role error ${JSON.stringify(e)}`);
    }
}

// Save Role
export async function saveRoleInfo({ commit }, data) {
    try {
        const res = await axios({
            method: 'post',
            url: `${Constants.API_URL}role/save`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
        console.log(`saveRoleInfo ${JSON.stringify(res)}`);
        return res;
    } catch (e) {
        console.log(`saveRoleInfo error ${JSON.stringify(e)}`);
    }
}

// Menu List
export async function loadMenuList({ commit }) {
    try {
        const res = await axios({
            method: 'get',
            url: `${Constants.API_URL}menu/list`,
        });
        if (res.data && res.data.data){
            const menus = res.data.data;
            console.log(`menus ${JSON.stringify(menus)}`);
            commit(SET_MENU_LIST, menus);
        }
        return res;
    } catch (e) {
        console.log(`menus error ${JSON.stringify(e)}`);
    }
}

// Menu List
export async function loadRoleMenuList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}menu/roleList`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        return e;
    }
}

//save Menu List
export async function saveRoleMenuList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}menu/save`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data
        });
    } catch (e) {
        return e;
    }
}

// 上傳頭像API
export function uploadProfileImage({ commit }, data) {
    return new Promise((resolve, reject) => {
        const api = `${Constants.API_URL}file/profile/upload`;
        // const formData = new FormData();
        // const files = [];
        // data.fileList.forEach((item) => {
        //   files.push(item.image);
        // });
        // formData.append('files[]', files);
        axios.post(api, data.fileList, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${data.token}`,
            },
            transformRequest: [function (data) {
                return data;
            }],
            onUploadProgress(e) {
                const percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    console.log(`${percentage}%`); // 上传进度
                    Notification.notifyObservers('fileProgress', percentage);
                }
            },
        }).then((response) => {
            console.log(response); // {code: 200, description: "", detail: null}
            resolve(response);
        }).catch((error) => {
            console.log(`uploadProfileImage err ${JSON.stringify(error)}`);
            reject(error);
        });
    });
}

// 上傳檔案 API
export function uploadFile({ commit }, data) {
    return new Promise((resolve, reject) => {
        const api = `${Constants.API_URL}s3/upload`;
        axios.post(api, data.fileList, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${data.token}`,
            },
            transformRequest: [function (data) {
                return data;
            }],
            onUploadProgress(e) {
                const percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    console.log(`${percentage}%`); // 上传进度
                    Notification.notifyObservers('fileProgress', percentage);
                }
            },
        }).then((response) => {
            console.log(response); // {code: 200, description: "", detail: null}
            resolve(response);
        }).catch((error) => {
            console.log(`uploadFile err ${JSON.stringify(error)}`);
            reject(error);
        });
    });
}

// delete file
export async function deleteFile({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteFile error ${e}`);
        return e;
    }
}

// 商品資訊
export async function fetchProductInfo(data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}product/info`,
            data,
        });
    } catch (e) {
        return e;
    }
}

// 查詢訂單列表
export async function fetchOrderList(data) {
    try {
        return await axios({
            method: 'get',
            url: `${Constants.API_URL}order/list`,
            headers: {
                token: data.token,
            },
        });
    } catch (e) {
        return e;
    }
}

// Customer List
export async function getCustomerList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}users/customer/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.query
        });
    } catch (e) {
        console.log(`getCustomerList error ${e}`);
        return e;
    }
}

// Sales List
export async function getSalesList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}users/sales/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
        });
    } catch (e) {
        console.log(`getSalesList error ${e}`);
        return e;
    }
}

// Group List
export async function getGroupList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data
        });
    } catch (e) {
        console.log(`getGroupList error ${e}`);
        return e;
    }
}

// get Group optionList
export async function getGroupOptionList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/option/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
        });
    } catch (e) {
        console.log(`getGroupOptionList error ${e}`);
        return e;
    }
}

// Group info
export async function getGroupInfo({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info
        });
    } catch (e) {
        console.log(`getGroupInfo error ${e}`);
        return e;
    }
}


//User Group List
export async function getUserGroupList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/userGroup`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data
        });
    } catch (e) {
        console.log(`getGroupList error ${e}`);
        return e;
    }
}


// Add Group
export async function createGroup({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/create`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.group,
        });
    } catch (e) {
        console.log(`createGroup error ${e}`);
        return e;
    }
}

// update Group
export async function updateGroup({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}group/update`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.group,
        });
    } catch (e) {
        console.log(`updateGroup error ${e}`);
        return e;
    }
}

// update Group
export async function getUserDetail({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}users/detail`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.user,
        });
    } catch (e) {
        console.log(`getUserDetail error ${e}`);
        return e;
    }
}

// File List
export async function getFileList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getFileList error ${e}`);
        return e;
    }
}

// File Info
export async function getFileInfo({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getFileInfo error ${e}`);
        return e;
    }
}

// update file info
export async function saveFileInfo({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/update`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`saveFileInfo error ${e}`);
        return e;
    }
}

// Verify File Key
export async function verifyFileKey({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/verifyFileKey`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`verifyFileKey error ${e}`);
        return e;
    }
}

// delete File
export async function deleteFileItem({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`deleteFile error ${e}`);
        return e;
    }
}

// 上傳 SDK API
export function uploadSDK({ commit }, data) {
    return new Promise((resolve, reject) => {
        const api = `${Constants.API_URL}s3/sdk/upload`;
        axios.post(api, data.fileList, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${data.token}`,
            },
            transformRequest: [function (data) {
                return data;
            }],
            onUploadProgress(e) {
                const percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage <= 100) {
                    console.log(`${percentage}%`); // 上传进度
                    Notification.notifyObservers('sdkProgress', percentage);
                }
            },
        }).then((response) => {
            console.log(response); // {code: 200, description: "", detail: null}
            resolve(response);
        }).catch((error) => {
            console.log(`uploadFile err ${JSON.stringify(error)}`);
            reject(error);
        });
    });
}

// SDK List
export async function getSDKList({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/sdk/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getSDKList error ${e}`);
        return e;
    }
}

// SDK Info
export async function getSDKInfo({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/sdk/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getSDKInfo error ${e}`);
        return e;
    }
}

// delete SDK
export async function deleteSDK({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/sdk/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`deleteFile error ${e}`);
        return e;
    }
}

// add SDK Mapping
export async function saveSDKMap({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}s3/sdk/share`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`saveSDKMap error ${e}`);
        return e;
    }
}

// Platform List
export async function fetchPlatformList({ commit }, data) {
    try {
        const res = await axios({
            method: 'get',
            url: `${Constants.API_URL}doc/platform/list`,
            headers: {
            },
        });
        if (res.data && res.data.data){
            const list = res.data.data;
            console.log(`platform ${JSON.stringify(list)}`);
            localStorage.setItem(Constants.CACHE_PLATFORM, JSON.stringify(list));
            commit(SET_PLATFORM_LIST, list);
        }
        return res;
    } catch (e) {
        console.log(`getPlatformList error ${e}`);
        return e;
    }
}

// Document List
export async function getDocList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getDocList error ${e}`);
        return e;
    }
}

// Document info
export async function getDocInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getDocInfo error ${e}`);
        return e;
    }
}

// Document info
export async function getPlatformDocInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/platform/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getPlatformDocInfo error ${e}`);
        return e;
    }
}


// Document create
export async function createDocInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/create`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`createDocInfo error ${e}`);
        return e;
    }
}

// Document update
export async function updateDocInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/update`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`updateDocInfo error ${e}`);
        return e;
    }
}

// Document delete
export async function deleteDocInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}doc/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteDocInfo error ${e}`);
        return e;
    }
}


// 上傳 contract API
export function uploadContract({ commit }, data) {
    return new Promise((resolve, reject) => {
        const api = `${Constants.API_URL}s3/contract/upload`;
        axios.post(api, data.fileList, {
            method: 'post',
            headers: {
                'Content-Type': 'multipart/form-data',
                token: `Bearer ${data.token}`,
            },
            transformRequest: [function (data) {
                return data;
            }],
            onUploadProgress(e) {
                const percentage = Math.round((e.loaded * 100) / e.total) || 0;
                if (percentage < 100) {
                    console.log(`${percentage}%`); // 上传进度
                    Notification.notifyObservers('contractProgress', percentage);
                }
            },
        }).then((response) => {
            console.log(response); // {code: 200, description: "", detail: null}
            resolve(response);
        }).catch((error) => {
            console.log(`uploadFile err ${JSON.stringify(error)}`);
            reject(error);
        });
    });
}


// Contract List
export async function getContractList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getContractList error ${e}`);
        return e;
    }
}

//Share Contract List
export async function getShareContractList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/share/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getShareContractList error ${e}`);
        return e;
    }
}

// User Contract List
export async function getUserContractList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/user/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getUserContractList error ${e}`);
        return e;
    }
}

// Contract delete
export async function deleteContractInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteDocInfo error ${e}`);
        return e;
    }
}

// accept contract
export async function acceptContractInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/accept`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteDocInfo error ${e}`);
        return e;
    }
}

// Contract Info
export async function getContractInfo({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getContractInfo error ${e}`);
        return e;
    }
}

// Contract Share
export async function shareContract({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/share`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`shareContract error ${e}`);
        return e;
    }
}

// delete
export async function deleteContract({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`shareContract error ${e}`);
        return e;
    }
}

// delete share
export async function removeShareContract({ commit }, data) {
    try {
        return  await axios({
            method: 'post',
            url: `${Constants.API_URL}contract/share/remove`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`shareContract error ${e}`);
        return e;
    }
}


// User Message List
export async function getMessageList({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/list`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getMessageList error ${e}`);
        return e;
    }
}

export async function getMessageInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/info`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data,
        });
    } catch (e) {
        console.log(`getMessageInfo error ${e}`);
        return e;
    }
}

export async function createMessageInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/create`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`createMessageInfo error ${e}`);
        return e;
    }
}

export async function updateMessageInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/update`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`updateMessageInfo error ${e}`);
        return e;
    }
}

export async function deleteMessageInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`updateMessageInfo error ${e}`);
        return e;
    }
}

export async function updateMessageStatus({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/status`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`updateMessageStatus error ${e}`);
        return e;
    }
}

export async function getMessageUnReadCount({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}message/unReadCount`,
            headers: {
                token: `Bearer ${data.token}`,
            },
        });
    } catch (e) {
        console.log(`getMessageUnReadCount error ${e}`);
        return e;
    }
}

/*
* Support
* */
export async function submitSupport({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}support/create`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`submitSupport error ${e}`);
        return e;
    }
}

/*
* Support new Issue (not login)
* */
export async function submitNewIssue({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}support/create/issue`,
            headers: {
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`submitNewIssue error ${e}`);
        return e;
    }
}

/*
* Support new contact (not login)
* */
export async function submitNewContact({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}support/create/contact`,
            headers: {
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`submitNewIssue error ${e}`);
        return e;
    }
}

// Group delete
export async function deleteGroupInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}group/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteGroup error ${e}`);
        return e;
    }
}

// User delete
export async function deleteUserInfo({ commit }, data) {
    try {
        return await axios({
            method: 'post',
            url: `${Constants.API_URL}users/delete`,
            headers: {
                token: `Bearer ${data.token}`,
            },
            data: data.info,
        });
    } catch (e) {
        console.log(`deleteUserInfo error ${e}`);
        return e;
    }
}

export function setUserDetails({ commit }, data) {
    commit(types.SET_USER_DETAILS, data);
}


