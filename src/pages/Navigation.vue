<template>
    <v-app>
        <div class="wrapper-admin">
            <div id="topNav" class="topNav">
                <a class="mMenuBtn_m mMenuBtn_close" @click.prevent="mobileMenu">
                    <span class="l1"></span>
                    <span class="l2"></span>
                    <span class="l3"></span>
                </a>
                <img src="../assets/images/logo.png" class="img-logo">
                <div class="img-logo-m-box">
                    <img src="../assets/images/logo-m.png" class="img-logo-m">
                </div>
                <img src="../assets/images/title.png" class="img-title">
                <ul class="topIconNav">
                    <li><a href="#" target="_self" :class="unReadCount > 0 ?
                    'topIcon-message topIcon-message-New':'topIcon-message'"
                           @click.prevent="menuEvent({ key: 'message',path: '/home/message'})"><span class="b"></span></a></li>
                    <li><a href="#" target="_self" class="topIcon-profile"
                                       @click.prevent="menuEvent({ key:'profile', path:'/home/profile'})"
                    ><span class="b"></span></a></li>
                </ul>
            </div><!--topNav-->

            <div id="leftNav"  class="leftNav">
                <div class="logoBox">
                    <a class="mMenuBtn mMenuBtn_close" @click.prevent="openMenu">
                        <span class="l1"></span>
                        <span class="l2"></span>
                        <span class="l3"></span>
                    </a>
                    <img src="../assets/images/logo.png" class="img-logo">
                </div>
                <ul class="leftMenu">
                    <li  v-for="item in menuList" :key="item.key"
                         :class="selectedClass(item) ? 'now':''">
                        <a href="#" :class="item.className" @click.prevent="menuEvent(item)">
                            <span class="r"></span><span class="text">{{item.label}}</span></a>
                    </li>
                </ul>
            </div><!--leftNav-->

            <div class="content">
                <div class="bread" v-if="getCurrentItem">
                    <span :class="getCurrentItem.icon"></span>
                    <a href="#" @click.prevent="menuEvent(getCurrentItem)">
                        {{getCurrentItem.label}}</a>
                    <a href="#" @click.prevent="subPathEvent(item)" v-for="item in subPath" :key="item.label">{{` / ${item.label}`}}</a>
                </div>

                <router-view></router-view>
            </div>

            <!-- dialog -->
            <dialog-view>
                <component :is="dialogInfo.component" />
            </dialog-view>

            <!-- System alert -->
            <alert-view />

        </div>
    </v-app>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import Notification from '../utils/notice_manager';
    import {CACHE_USER_KEY, CACHE_USER_PERMISSION} from '@/utils/Constant';
    import { getNowTime } from '@/utils/tools';
    import AlertView from '../components/tools/AlertView';
    import * as types from '../store/mutations_type';
    import common from '@M/common';

    export default {
        name: 'Navigation',
        mixins: [common],
        components: {
            AlertView,
            DialogView: () => import(/* webpackChunkName: 'Dialog' */ '@/components/tools/DialogView'),
            UserDetailPop: () => import(/* webpackChunkName: 'UserDetailPop' */ '@/components/view/UserDetailPop'),
            FileDetailView:() => import(/* webpackChunkName: 'FileDetailView' */ '@/pages/file/FileDetailView'),
            ContractDetailView: () => import(/* webpackChunkName: 'ContractDetailView' */ '@/pages/contract/ContractDetailView'),
            FileAddView: () => import(/* webpackChunkName: 'FileAddView' */ '@/pages/file/FileAddView'),
            SDKDetailView: () => import(/* webpackChunkName: 'SDKDetailView' */ '@/pages/sdk/SDKDetailView'),
            SKUAddView: () => import(/* webpackChunkName: 'SKUAddView' */ '@/pages/sdk/SKUAddView'),
            ContractAcceptView: () => import(/* webpackChunkName: 'ContractAcceptView' */ '@/pages/contract/ContractAcceptView'),
            ContractInfoView: () => import(/* webpackChunkName: 'ContractAcceptView' */ '@/pages/contract/ContractInfoView'),
            ContractAddView: () => import(/* webpackChunkName: 'ContractAcceptView' */ '@/pages/file/ContractAddView')
        },
        data() {
            return {
                menuOpen: false,
                drawer: true,
                userMenus: [],
                messageDialog: {
                    visible: true,
                    title: 'title',
                    content: '',
                    confirm: () => {},
                },
                currentNavPath: '',
                subPath: [],
                unReadCount: 0,
                timeoutID: null,
            };
        },
        created() {
            if (!this.menuOpen){
                // eslint-disable-next-line no-undef
                $('body').removeClass('toggled');
            }
            this.currentNavPath = this.$router.currentRoute.path;

            this.fetchPlatformList();

            Notification.addObserver('changePath', (path)=>{
                if (path) {
                    this.currentNavPath = path;
                } else {
                    this.currentNavPath = this.$router.currentRoute.path;
                }
            });

            Notification.addObserver('pushSubPath', (path) => {
                // console.log(`pushSubPath ${JSON.stringify(path)}`);
                const isSame = this.subPath.some(item => item.label === path.label);
                // console.log(`isSame ${isSame} / ${JSON.stringify(this.subPath)}`);
                if (!isSame) {
                    this.subPath.push(path);
                }
            });

            Notification.addObserver('popSubPath', () => {
                this.subPath.pop();
            });

            // console.log(`=== nav === ${this.$router.currentRoute.path} ${JSON.stringify(this.getUserInfo)}`);
            Notification.addObserver('checkUserStatus', async ()=>{
                console.log(`Notification checkUserStatus`);
                await this.checkUserStatus();
            });

            Notification.notifyObservers('checkUserStatus');

            //更新未讀
            Notification.addObserver('refreshUnReadCount', ()=>{
                this.loadMessageUnReadCount();
            });

            Notification.addObserver('reloadContractStatus', async ()=>{
              console.log('reloadContractStatus');
              await this.loadContractData();
              Notification.notifyObservers('checkContractStatus');
            });
        },
        mounted() {
            if (!this.menuOpen) {
                // eslint-disable-next-line no-undef
                $('body').removeClass("toggled");
            }

            if (this.currentNavPath.indexOf('userDetail') > -1) {
              Notification.notifyObservers('pushSubPath', {label: 'Users', path:'/home/users', query:{tab:'Users'}});
              Notification.notifyObservers('pushSubPath', {label: 'User Detail', path:'/home/userDetail',
                query:this.$router.currentRoute.query });
            } else if (this.currentNavPath.indexOf('groupDetail') > -1) {
              Notification.notifyObservers('pushSubPath', {label: 'Group', path:'/home/users', query:{tab:'Group'}});
              Notification.notifyObservers('pushSubPath', {label: 'Group Detail', path:'/home/groupDetail',
                query:this.$router.currentRoute.query });
            } else {
              if (this.currentNavPath.indexOf('Detail') > -1) {
                Notification.notifyObservers('pushSubPath', {label: 'Detail'});
              }
            }
        },
        watch: {
            currentFullPath() {
                if (this.menuItems[this.currentFullPath]) {
                    Notification.notifyObservers('popSubPath');
                    Notification.notifyObservers('changePath');
                }

                if (this.subPath.length > 1 && this.currentFullPath.indexOf(this.subPath[this.subPath.length - 2].label) > -1) {
                    Notification.notifyObservers('popSubPath');
                }
            }
        },
        computed: {
            ...mapGetters([
              'getUserInfo',
              'getUserPermission',
              'alertInfo',
              'getContractAccept'
            ]),
            getUserAvatar(){
                if (this.getUserInfo.userId){
                    return this.getUserInfo.account.toUpperCase().substring(0,1)
                }
                return this.getUserInfo.account;
            },
            salesMenuList(){
              return [
                {key: '1', path: '/home/dashboard', group: [], label: 'Dashboard', className: 'a-dashboard', icon: 'icon icon-dashboard'},
                {key: '2', path: '/home/files', group: ['/home/fileDetail', '/home/fileEdit'], label: this.isCustomer ? 'My Files' : 'Delivery', className: this.isCustomer ? 'a-files': 'a-delivery', icon: 'icon icon-files'},
                {key: '3', path: '/home/sdk', group: [], label: 'SKUs', className: 'a-sdks', icon: 'icon icon-sdks'},
                {key: '5', path: '/home/document', group: [], label: 'Documentations', className: 'a-doc', icon: 'icon icon-doc'},
                {key: '6', path: '/home/customers', group: [], label: 'My Customers', className: 'a-customers', icon: 'icon icon-customers'},
                {key: '7', path: '/home/role', group: ['/home/roleDetail'], label: 'Roles and Permissions', className: 'a-role', icon: 'icon icon-role'},
                {key: '9', path: '/home/contract', group: [], label: 'Contracts', className: 'a-contract', icon: 'icon icon-contract'},
                {key: '11', path: '/home/support', group: [], label: 'Support', className: 'a-support', icon: 'icon icon-support'}
              ];
            },
            menuList() {
                const menuList = [
                    {key: '1', path: '/home/dashboard', group: [], label: 'Dashboard', className: 'a-dashboard', icon: 'icon icon-dashboard'},
                    {key: '2', path: '/home/files', group: ['/home/fileDetail', '/home/fileEdit'], label: this.isCustomer ? 'My Files' : 'Delivery', className: this.isCustomer ? 'a-files': 'a-delivery', icon: 'icon icon-files'},
                    {key: '3', path: '/home/sdk', group: [], label: 'SKUs', className: 'a-sdks', icon: 'icon icon-sdks'},
                    {key: '5', path: '/home/document', group: [], label: 'Documentations', className: 'a-doc', icon: 'icon icon-doc'},
                    {key: '6', path: '/home/users', group: ['/home/userDetail'], label: 'Users & Groups', className: 'a-users', icon: 'icon icon-users' , query: {tab: 'Users'}},
                    {key: '7', path: '/home/role', group: ['/home/roleDetail'], label: 'Roles and Permissions', className: 'a-role', icon: 'icon icon-role'},
                    // {key: '8', path: '/home/settings', group: [], label: 'Settings', className: 'a-setting', icon: 'icon icon-setting'},
                    {key: '9', path: '/home/contract', group: [], label: 'Contracts', className: 'a-contract', icon: 'icon icon-contract'},
                    // {key: '10', path: '/home/message', group: [], label: 'Message', className: 'a-message', icon: 'icon icon-message'},
                    {key: '11', path: '/home/support', group: [], label: 'Support', className: 'a-support', icon: 'icon icon-support'}
                ];
                // console.log(JSON.stringify(this.getUserPermission));
                const cacheMenu = localStorage.getItem(CACHE_USER_PERMISSION);
                console.log(`cacheMenu ${JSON.stringify(cacheMenu)}`);

                let userMenuItems = [];
                if (cacheMenu){
                    try {
                        userMenuItems = JSON.parse(cacheMenu);
                    } catch (e) {
                        userMenuItems = [];
                    }
                } else {
                    userMenuItems = this.getUserPermission;
                    // console.log(`getUserPermission ${JSON.stringify(userMenuItems)}`);
                }
                if (userMenuItems.length > 0){
                    let menus = [];
                    if (this.isCustomer){
                      menus = menuList.filter(m=>m.key !=='9');
                    } else if (this.isSales){
                      console.log(`== isSales ==`);
                      menus = this.salesMenuList;
                    } else {
                      menus = menuList;
                    }
                    let filterList = menus.filter(menu=> {
                        const menuItem = userMenuItems.find(userMenu=>{
                          return userMenu.menuItem === menu.key && userMenu.enable === true;
                        });
                        return menuItem ?? false;
                    });
                    filterList.push({key: 'logout', path: '/index', label: 'Logout', className: 'a-logout'},);
                    return filterList;
                }
                return [];
            },
            menuItems(){
                return {
                    '/home/profile': {
                        key: '0', path: '/home/profile', label: 'Profile', className: ''
                        , icon: 'icon icon-profile'
                    },
                    '/home/dashboard': {
                        key: '1', path: '/home/dashboard', label: 'Dashboard', className: 'a-dashboard'
                        , icon: 'icon icon-dashboard'
                    },
                    '/home/files': {
                        key: '2',
                        path: '/home/files',
                        label: this.isCustomer ? 'My Files' : 'Delivery',
                        className: 'a-delivery',
                        icon: 'icon icon-delivery'
                    },
                    '/home/sdk': {
                        key: '3', path: '/home/sdk', label: 'SKUs', className: 'a-sdks'
                        , icon: 'icon icon-sdks'
                    },
                    '/home/customers': {
                        key: '4', path: '/home/customers', label: 'My Customers', className: 'a-customers'
                        , icon: 'icon icon-customers'
                    },
                    '/home/document': { // '/home/documents'
                        key: '5', path: '/home/document', label: 'Documentations', className: 'a-doc'
                        , icon: 'icon icon-doc'
                    },
                    '/home/users': {
                        key: '6', path: '/home/users', label: 'Users & Groups', className: 'a-users'
                        , icon: 'icon icon-users'
                    },
                    '/home/role': {
                        key: '7', path: '/home/role', label: 'Roles and Permissions', className: 'a-role'
                        , icon: 'icon icon-role'
                    },
                    '/home/settings': {
                        key: '8', path: '/home/settings', label: 'Settings', className: 'a-setting'
                        , icon: 'icon icon-setting'
                    },
                    '/home/contract': {
                        key: '9', path: '/home/contract', label: 'Contracts', className: 'a-files'
                        , icon: 'icon icon-contract'
                    },
                    '/home/message': {
                        key: '10', path: '/home/message', label: 'Messages', className: 'a-files'
                        , icon: 'icon icon-message'
                    },
                    '/home/support': {
                        key: '11', path: '/home/support', label: 'Support', className: 'a-files'
                        , icon: 'icon icon-support'
                    },
                }
            },
            getCurrentItem(){
                // console.log(`this.currentNavPath ${this.currentNavPath}`);
                let find = null;
                if (this.currentNavPath.indexOf('user') > -1 || this.currentNavPath.indexOf('group') > -1){
                    find = this.menuItems['/home/users'];
                } else if (this.currentNavPath.indexOf('role') > -1) {
                    find = this.menuItems['/home/role'];
                } else if (this.currentNavPath.indexOf('contract') > -1) {
                    find = this.menuItems['/home/contract'];
                } else if (this.currentNavPath.indexOf('message') > -1) {
                    find = this.menuItems['/home/message'];
                } else {
                    find = this.menuItems[this.currentNavPath];
                }
                if (find){
                    // console.log(find);
                    return  find;
                }
                return null;
            },
            currentFullPath() {
                return this.$route.path;
            }
        },
        methods: {
            ...mapActions([
                'logOut',
                'loadMenuList',
                'loadRoleMenuList',
                'verifyToken',
                'fetchUserInfo',
                'configUserInfo',
                'fetchPlatformList',
                'getContractList',
                'getMessageUnReadCount']),
            async loadMessageUnReadCount(){
                const token = localStorage.getItem(CACHE_USER_KEY);
                const response = await this.getMessageUnReadCount({ token: token ? token : this.getUserInfo.token });
                const result = response.data;
                if (result && result.statusCode === 0){
                    this.unReadCount = result.data.count;
                    console.log(`unReadCount ${this.unReadCount}`);
                }
            },
            subPathEvent(item){ // 麵包條點擊事件
              console.log(`currentNavPath ${this.currentNavPath} / ${JSON.stringify(item)} / ${JSON.stringify(this.$router.currentRoute.query)}`);
              if (this.$router.currentRoute.path !== item.path) {
                if (item.path){
                  if (item.path === '/home/users'){
                    this.$router.push({ path: item.path , query: item.query ? item.query: { tab:'Users' } });
                    Notification.notifyObservers('popSubPath');
                  } else {
                    this.$router.push({ path: item.path , query: this.$router.currentRoute.query});
                    Notification.notifyObservers('popSubPath');
                  }
                }
              }
            },
            // ignoreEvent(){
            //     console.log(`ignoreEvent ${this.currentNavPath} / ${JSON.stringify(this.$router.currentRoute.query)}`);
            //     if (this.$router.currentRoute.path !== this.currentNavPath) {
            //         this.$router.push({ path: this.currentNavPath , query: this.$router.currentRoute.query});
            //         Notification.notifyObservers('popSubPath');
            //     }
            // },
            mobileMenu(){
                console.log(`isMobile`);
                // eslint-disable-next-line no-undef
                if($('body').hasClass("toggled_m")){
                    // eslint-disable-next-line no-undef
                    $('body').removeClass("toggled_m");
                } else {
                    // eslint-disable-next-line no-undef
                    $('body').addClass('toggled_m');
                }
            },
            openMenu(){
                // eslint-disable-next-line no-undef
                if($('body').hasClass("toggled")){
                    // eslint-disable-next-line no-undef
                    $('body').removeClass("toggled");
                    this.menuOpen = true;
                } else {
                    // eslint-disable-next-line no-undef
                    $('body').addClass('toggled');
                }
            },
            menuEvent(item) {
                const key = item.key;
                const path = item.path;
                console.log(`menuEvent ${key} / ${path}`);
                if (this.isMobile) {
                    this.mobileMenu();
                }

                if (key === 'logout') {
                    this.logOut();
                    this.$router.push(path);
                    return;
                }

                if (key === '5') {

                    if (this.$router.currentRoute.path !== path) {

                        this.currentNavPath = path;
                        this.$router.push('documentView');
                        console.log(`currentNavPath ${this.currentNavPath}`);
                        // this.$router.push('document');
                        // this.$router.push('documentView');
                        Notification.notifyObservers('popSubPath');
                    }
                }

                if (this.$router.currentRoute.path !== path) {
                    this.currentNavPath = path;
                    console.log(`currentNavPath ${this.currentNavPath}`);
                    if (key === 'profile'){
                        this.$router.push({ path , query: { mode: 0 }});
                    } else {
                      if (path === '/home/users') {
                        console.log(`to users ${path}`);
                        this.$router.push({path: item.path, query: item.query ? item.query : {tab: 'Users'}});
                      } else if (path === '/home/files') {
                        console.log(`to file ${path}`);
                        this.$router.push({ path, query: item.query ? item.query : {tab: 'Files'} });
                      } else {
                        console.log(`to other ${path}`);
                        this.$router.push({ path, query: item.query ? item.query : {tab: ''}  });
                      }
                    }
                    Notification.notifyObservers('popSubPath');
                }
                this.toTop();
            },
            ignorePages(){
                if (this.$router.currentRoute.path === '/forgetPassword'
                    || this.$router.currentRoute.path === '/verifyEmail'
                    || this.$router.currentRoute.path === '/documentations'
                    || this.$router.currentRoute.path === '/register'
                    || this.$router.currentRoute.path === '/support'
                    || this.$router.currentRoute.path === '/contact'
                    || this.$router.currentRoute.path === '/sample'
                    || this.$router.currentRoute.path === '/gettingStart'
                    || this.$router.currentRoute.path === '/api'
                    || this.$router.currentRoute.path === '/faq'
                    || this.$router.currentRoute.path === '/login'
                    || this.$router.currentRoute.path === '/index'){
                    console.log(`ignorePages ${this.$router.currentRoute.path}`);
                    return true;
                }
                return false;
            },
            async checkUserStatus(){
                if (this.ignorePages() === false) {
                    const token = localStorage.getItem(CACHE_USER_KEY);
                    console.log(`checkUserStatus token == ${token}`);
                    const updatedTime = localStorage.getItem('updateTime');
                    if (updatedTime){
                        const d1 = new Date(updatedTime);
                        const d2 = new Date();
                        let diff = d2 - d1;
                        const ONE_MIN = 1000 * 60; // 1分鐘的毫秒數
                        const leftMins = Math.floor(diff/ONE_MIN);
                        if(leftMins > 0) {
                            diff = diff - (leftMins * ONE_MIN);
                        }
                        console.log(`時間差 ${d1} / ${d2} ${leftMins}`);
                        if (this.getUserInfo && this.getUserInfo.userId){
                            if(leftMins >= 1){
                                await this.configUser(token);
                            } else {
                                console.log(`== getUserInfo == ${JSON.stringify(this.getUserInfo)}`);
                                const cacheMenu = localStorage.getItem(CACHE_USER_PERMISSION);
                                console.log(`== cacheMenu == ${JSON.stringify(cacheMenu)}`);
                                if (!cacheMenu || cacheMenu.length === 0){
                                    this.configUserInfo(this.getUserInfo);
                                }
                                Notification.notifyObservers('refresh_user', this.getUserInfo);
                                if (this.$router.currentRoute.path.indexOf('home') === -1) {
                                    this.$router.push('/home/files');
                                }
                            }
                        } else {
                            await this.configUser(token);
                        }
                    } else {
                        await this.configUser(token);
                    }

                    if (token || this.getUserInfo.token) {
                        this.loadUserMenu();

                        if (this.isCustomer){
                          Notification.notifyObservers('reloadContractStatus');
                        }

                        console.log(`timeoutID == ${this.timeoutID}`);
                        if (this.timeoutID === null){
                            this.loadMessageUnReadCount();
                            this.timeoutID = setInterval(()=>{
                                this.loadMessageUnReadCount();
                            }, 5 * 60 * 1000);
                        }
                    }
                }
            },
            async configUser(token){
                console.log(`== fetchUserInfo == ${token}`);
                const response = await this.fetchUserInfo({ token });
                const result = response.data;
                if (result){
                    // console.log(`statusCode == ${result.statusCode}`);
                    if (result.statusCode === 0) {
                        const userInfo = result.data;
                        // console.log(`router userInfo == ${JSON.stringify(userInfo)}`);
                        userInfo.token = token;
                        userInfo.isLogin = true;
                        this.configUserInfo(userInfo);
                        // this.setRoleMenu();
                        localStorage.setItem('updateTime', getNowTime());
                        Notification.notifyObservers('refresh_user', userInfo);
                        if (this.$router.currentRoute.path.indexOf('home') === -1) {
                            this.$router.push('/home/files');
                        }
                    } else {
                        this.logoutUser();
                    }
                } else {
                    this.logoutUser();
                }
            },
            async loadUserMenu(){
              await this.loadMenuList();
            },
            async loadContractData(){

                const token = localStorage.getItem(CACHE_USER_KEY);
                let res;
                res = await this.getContractList({
                    token: token ? token : this.getUserInfo.token,
                    searchValue: '',
                    filter: 10,
                    pageIndex: 1, limit: 100,
                    sortBy: 'createdDate',
                    sortByValue: 'DESC'
                });

                if (res){
                    const results = res.data;
                    this.$store.commit(types.SET_CONTRACT_ACCEPT, results.data.header.unAcceptCount);
                }
            },
            logoutUser(){
                Notification.notifyObservers('isLoading', false);
                this.menuOpen = false;
                console.log(`logoutUser ${this.$router.currentRoute.path}`);
                if (this.timeoutID){
                  clearInterval(this.timeoutID);
                }
                this.logOut();
                this.$router.push('/index');
            },
            showDialog(visible, title, content, confirm) {
                this.messageDialog.visible = visible;
                this.messageDialog.title = title;
                this.messageDialog.content = content;
                this.messageDialog.confirm = confirm;
            },
            toTop(){
                // eslint-disable-next-line no-undef
                $('html,body').animate({scrollTop: '0px'}, 800);
            },
            selectedClass(item) {
                const { path, group } = item;
                const current = this.$route.path;

                return path === current || (group && group.indexOf(current) > -1);
            }
        },
    };
</script>

<style scoped src="../assets/css/all-admin.css">
</style>
