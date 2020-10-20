import Vue from 'vue';
import Router from 'vue-router';

import NavigationView from '@/pages/Navigation';
import LoginView from '@/pages/Login';
import CustomerView from '@/pages/CustomerView';
import SettingView from '@/pages/SettingView';
import RegisterView from '@/pages/RegisterView';
import ForgetPasswordView from '@/pages/ForgetPasswordView';
import VerifyEmailView from '@/pages/VerifyEmailView';

import IndexView from '@/pages/home/index';
import IndexContent from '@/pages/home/IndexContent';
import DocContent from '@/pages/home/DocumentationsView';
import FAQContent from '@/pages/home/FAQView';
import GettingStartContent from '@/pages/home/GettingStartView';
import APIContent from '@/pages/home/APIView';
import SampleProjectsContent from '@/pages/home/SampleProjectsView';
import SupportContent from '@/pages/home/SupportContent';
import ContactContent from '@/pages/home/ContactContent';


import {CACHE_USER_KEY} from "@/utils/Constant";
const NoticeManager = require('../utils/notice_manager');

Vue.use(Router);

const DashboardView = () => import(/* webpackChunkName: 'DashboardView' */ '@/pages/dashboard');

const RoleListView = () => import(/* webpackChunkName: 'RoleListView' */ '@/pages/role');
const RoleDetailView = () => import(/* webpackChunkName: 'RoleDetailView' */ '@/pages/role/RoleDetailView');
const DocumentsView = () => import(/* webpackChunkName: 'DocumentsView' */ '@/pages/documents');
const DocumentView = () => import(/* webpackChunkName: 'DocumentsView' */ '@/pages/documents/DocumentView');
const DocumentDetailView = () => import(/* webpackChunkName: 'DocumentDetailView' */ '@/pages/documents/DocumentDetailView');

const SDKListView = () => import(/* webpackChunkName: 'SDKView' */ '@/pages/sdk');
// const SDKDetailView = () => import(/* webpackChunkName: 'SDKDetailView' */ '@/pages/sdk/SDKDetailView');
const SKUAddView = () => import(/* webpackChunkName: 'SKUAddView' */ '@/pages/sdk/SKUAddView');

const ContractListView = () => import(/* webpackChunkName: 'ContractListView' */ '@/pages/contract');
// const ContractAcceptView = () => import(/* webpackChunkName: 'ContractAcceptView' */ '@/pages/contract/ContractAcceptView');
// const ContractInfoView = () => import(/* webpackChunkName: 'ContractAcceptView' */ '@/pages/contract/ContractInfoView');

const UserViewNew = () => import(/* webpackChunkName: 'UserView' */ '@/pages/user');
const UserDetailView = () => import(/* webpackChunkName: 'UserDetailView' */ '@/pages/user/UserDetailView');
const GroupDetailView = () => import(/* webpackChunkName: 'GroupDetailView' */ '@/pages/user/GroupDetailView');

const FileView = () => import(/* webpackChunkName: 'FileView' */ '@/pages/file');
const FileAddView = () => import(/* webpackChunkName: 'FileAddView' */ '@/pages/file/FileAddView');
const FileInfoView = () => import(/* webpackChunkName: 'FileAddView' */ '@/pages/file/FileInfoView');


const ShareFileView = () => import(/* webpackChunkName: 'RoleListView' */ '@/pages/file/ShareFileView');

const ProfileView = () => import(/* webpackChunkName: 'ProfileView' */ '@/pages/profile');
const ChangePasswordView = () => import(/* webpackChunkName: 'ChangePasswordView' */ '@/pages/profile/ChangePasswordView');

const MessageListView = () => import(/* webpackChunkName: 'MessageListView' */ '@/pages/message');
const MessageDetailView = () => import(/* webpackChunkName: 'MessageDetailView' */ '@/pages/message/MessageDetailView');
const MessageAddView = () => import(/* webpackChunkName: 'MessageAddView' */ '@/pages/message/MessageAddView');

const AdminSupportView = () => import(/* webpackChunkName: 'AdminSupportView' */ '@/pages/support');

const router = new Router({
    routes: [
        {
            path: '/',
            name: 'index',
            component: IndexView,
            beforeEnter: (to, from, next) => {
                const token = localStorage.getItem(CACHE_USER_KEY);
                console.log(`token ${token} : ${to.path}`);
                if (to.path.indexOf('index') > -1){
                    next();
                } else if (to.path === '/'){
                    next('/index');
                } else {
                    next();
                }
            },
            children:[
                {
                    path: 'index',
                    name: 'IndexContent',
                    component: IndexContent,
                },
                {
                    path: 'documentations',
                    name: 'DocContent',
                    component: DocContent,
                },
                {
                    path: 'faq',
                    name: 'FAQContent',
                    component: FAQContent,
                },
                {
                    path: 'gettingStart',
                    name: 'GettingStartContent',
                    component: GettingStartContent,
                },
                {
                    path: 'api',
                    name: 'APIContent',
                    component: APIContent,
                },
                {
                    path: 'sample',
                    name: 'SampleProjectsContent',
                    component: SampleProjectsContent,
                },
                {
                    path: 'support',
                    name: 'SupportContent',
                    component: SupportContent,
                },
                {
                    path: 'contact',
                    name: 'ContactContent',
                    component: ContactContent,
                },
                {
                    path: 'login',
                    name: 'IndexLoginView',
                    component: LoginView,
                },
                {
                    path: 'register',
                    name: 'RegisterView',
                    component: RegisterView,
                },
                {
                    path: 'forgetPassword',
                    name: 'ForgetPasswordView',
                    component: ForgetPasswordView,
                },
                {
                    path: 'verifyEmail',
                    name: 'VerifyEmailView',
                    component: VerifyEmailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
            ]
        },
        {
            path: '/home',
            name: 'NavigationView',
            component: NavigationView,
            children: [
                {
                    path: 'login',
                    name: 'LoginView',
                    component: LoginView,
                },
                {
                    path: 'profile',
                    name: 'ProfileView',
                    component: ProfileView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'changePassword',
                    name: 'ChangePasswordView',
                    component: ChangePasswordView
                },
                {
                    path: 'userDetail',
                    name: 'UserDetailView',
                    component: UserDetailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'fileAdd',
                    name: 'FileAddView',
                    component: FileAddView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'fileInfo',
                    name: 'fileInfoView',
                    component: FileInfoView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'verifyEmail',
                    name: 'VerifyEmailView',
                    component: VerifyEmailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: DashboardView,
                },
                {
                    path: 'files',
                    name: 'FileView',
                    component: FileView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    }
                },
                {
                    path: 'shareFile',
                    name: 'ShareFileView',
                    component: ShareFileView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'sdk',
                    name: 'SDKView',
                    component: SDKListView,
                },
                // {
                //     path: 'sdkDetail',
                //     name: 'SDKDetailView',
                //     component: SDKDetailView
                // },
                {
                    path: 'skuDetail',
                    name: 'SKUAddView',
                    component: SKUAddView
                },
                {
                    path: 'customers',
                    name: 'CustomerView',
                    component: CustomerView,
                },
                {
                    path: 'documents',
                    name: 'DocumentView',
                    component: DocumentsView,
                },
                {
                    path: 'document',
                    name: 'DocumentView',
                    component: DocumentView,
                },
                {
                    path: 'docDetail',
                    name: 'DocumentDetailView',
                    component: DocumentDetailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'users',
                    name: 'UserViewNew',
                    component: UserViewNew,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'groupDetail',
                    name: 'GroupDetailView',
                    component: GroupDetailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'settings',
                    name: 'SettingView',
                    component: SettingView,
                },
                {
                    path: 'role',
                    name: 'Role',
                    component: RoleListView
                },
                {
                    path: 'roleDetail',
                    name: 'RoleDetailView',
                    component: RoleDetailView
                },
                {
                    path: 'contract',
                    name: 'ContractListView',
                    component: ContractListView
                },
                // {
                //     path: 'contractInfo',
                //     name: 'ContractInfoView',
                //     component: ContractInfoView
                // },
                // {
                //     path: 'contractAccept',
                //     name: 'ContractAcceptView',
                //     component: ContractAcceptView
                // },
                {
                    path: 'message',
                    name: 'MessageListView',
                    component: MessageListView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'messageDetail',
                    name: 'MessageDetailView',
                    component: MessageDetailView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
                {
                    path: 'messageAdd',
                    name: 'MessageAddView',
                    component: MessageAddView,
                },
                {
                    path: 'support',
                    name: 'AdminSupportView',
                    component: AdminSupportView,
                    beforeEnter: (to, from, next) => {
                        next({ query: to.query });
                    },
                },
            ],
        }
    ]
});



router.beforeEach( (to, from, next) => {

    console.log(`router ${from.path} , ${to.path}`);

    NoticeManager.addObserver('user_auth', (user) => {
        console.log(`user status ${JSON.stringify(user)}`);
        if (!user) {
            console.log(`router user login`);
            return next({ path: '/index' });
        }
        return next();
    });
    return next();
});

export default router;
