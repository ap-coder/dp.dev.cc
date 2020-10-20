import {CACHE_USER_PERMISSION} from "@/utils/Constant";

const moment = require('moment');
const NodeRSA = require('node-rsa');

function getNowDate() {
    return formatDate(new Date());
}

function getNowTime() {
    return formatDateTime(new Date());
}

function formatDate(date) {
    return moment(date).format('YYYY-MM-DD');
}

function formatDateTime(date) {
    return moment(date).format('YYYY-MM-DD HH:mm:ss');
}

function isLogin() {
    const token = localStorage.getItem('CCH_USER_TOKEN');
    if (token && token !== '') {
        return true;
    }
    return false;
}

function RSAEncrypted(keyData, text) {
    console.log(`RSAEncrypted == ${keyData}`);
    const key = new NodeRSA(keyData);
    const encrypted = key.encrypt(text, 'base64');
    console.log(encrypted);
    return encrypted;
}

function getUserPermission(key){
    const cacheMenu = localStorage.getItem(CACHE_USER_PERMISSION);
    const userMenuItems = JSON.parse(cacheMenu);
    if (userMenuItems && userMenuItems.length){
        return userMenuItems.find(menu=>menu.name === key);
    }
    console.log(`cache === ${JSON.stringify(userMenuItems)}`);
    return null;
}

function downloadTxtFile(fileName, content){
    const a = document.createElement("a");
    document.body.appendChild(a);
    a.style = "display: none";
    const blob = new Blob([content], {type: "octet/stream"});
    const url = window.URL.createObjectURL(blob);
    a.href = url;
    a.download = fileName;
    a.click();
    window.URL.revokeObjectURL(url);
}

/*
*   { key: 3, text: 'Gemalto License Key' }
    { key: 4 , text: 'Soraco License Key' }
* */
function showCopyButton(item){
    console.log(`item == ${JSON.stringify(item)}`);
    return (item.type === 3 || item.type === 4);
}

export {
    getNowDate,
    getNowTime,
    formatDate,
    formatDateTime,
    isLogin,
    RSAEncrypted,
    getUserPermission,
    downloadTxtFile,
    showCopyButton
};
