<template>
    <div>
        <div class="title">
            <h1>{{$t('sign_in')}}</h1>
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="signIn">
            <div class="ad">
            </div><!--end of ad-->
            <div class="form" >
                <v-form ref="form" v-model="valid" :lazy-validation="true">
                    <h3>{{ $t('title_welcome') }}</h3>
                    <div class="rowDiv">
                        <div class="tit">
                          {{ $t('title_account') }}
                        </div>
                        <div class="con">
                            <input v-model="loginInfo.account" type="text" class="textInput">
                            <span v-if="validation.hasError('account')" class="msg">{{validation.firstError('account')}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                          {{ $t('title_password') }}
                        </div>
                        <div class="con">
                            <input v-model="loginInfo.password" type="password" class="textInput">
                            <span v-if="validation.hasError('password')" class="msg">{{validation.firstError('password')}}</span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                          {{ $t('title_captcha') }}
                        </div>
                        <div class="tit checkTit">&nbsp;</div>
                        <div class="con">
                            <div class="checkBox">
                                <input type="checkbox" v-model="checkBox" id="c1" name="cc" @change="recaptcha"/>
                                <label for="c1">
                                    <span class="labelGray"></span>
                                    <span class="labelRed"></span>
                                    {{$t('message_not_robot')}}
                                </label>
                                <span v-if="validation.hasError('recaptchaToken')" class="msg">{{validation.firstError('recaptchaToken')}}</span>
                            </div>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv" v-show="errorMessage !== ''">
                        <span class="msg">{{errorMessage}}</span>
                    </div>
                    <div class="rowDiv">
                        <a href="#" class="redBtn" @click.prevent="loginEvent">
                            <v-progress-circular color="#ffffff" indeterminate :size="28"
                                                 :width="2"
                                                 v-if="loading" :value="20"></v-progress-circular>
                            <span v-else>Sign In</span></a>
                    </div>
                    <div class="rowDiv">
                        <a href="#" class="btn_forgot" @click.prevent="forgetEvent"><span></span>{{ $t('message_Lost_password') }}</a>
                    </div>
                    <div class="rowDiv">
                        <a href="#"  class="btn_register" @click.prevent="registerEvent"><span></span>{{$t('message_create_account')}}</a>
                    </div>
                </v-form>
            </div><!--end of form-->

            <div class="clear"></div>
        </div><!--end of signIn-->
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import {mapActions} from 'vuex';
    import BreadView from "../components/view/BreadView";
    // import AlertView from '@//components/tools/AlertView';
    // import ProgressView from '@//components/tools/ProgressView';
    import { RSAEncrypted } from '../utils/tools';
    import Notification from '../utils/notice_manager';
    import SimpleVueValidator from 'simple-vue-validator';
    const Validator = SimpleVueValidator.Validator;
    export default {
        name: 'login',
        components: { BreadView },
        data() {
            return {
                valid: true,
                lazy: true,
                loading: false,
                checkBox: false,
                loginInfo: {
                    account: '',
                    email: '',
                    password: '',
                    errorAccount: [],
                    checkAccount: false,
                    checkPassword: false,
                    errorPassword: [],
                    recaptchaToken: '',
                },
                errorMessage:'',
                messageDialog: {
                    visible: false,
                    title: '',
                    content: '',
                },
                progressDialog: {
                    visible: false,
                    content: '',
                },
            };
        },
        created() {
            // eslint-disable-next-line no-undef
            $(window).scrollTop(0);
        },
        validators: {
            account: function (value) {
                return Validator.value(value).required(this.$t('message_account_required'));
            },
            password: function (value) {
                return Validator.value(value).required(this.$t('message_password_required'));
                    // .minLength(6);
            },
            recaptchaToken: function (value) {
                return Validator.value(value).required(this.$t('message_recaptcha'));
            },
        } ,
        computed: {
            getTitle(){
              return this.$t('sign_in');
            },
            account(){
                return this.loginInfo.account;
            },
            password(){
                return this.loginInfo.password;
            },
            recaptchaToken(){
                return this.loginInfo.recaptchaToken;
            },
            breadMenu(){
                return [
                    { key: 'index', label: this.$t('path_index') },
                    { key: 'login', label: this.$t('sign_in') },
                ];
            }
        },
        methods: {
            ...mapActions(['fetchUserInfo', 'login', 'configUserInfo', 'getKey']),
            async recaptcha() {
                console.log(`== recaptcha start==`);
                // (optional) Wait until recaptcha has been loaded.
                if (this.checkBox === true) {
                    this.errorMessage = '';
                    await this.$recaptchaLoaded();

                    // Execute reCAPTCHA with action "login".
                    this.loginInfo.recaptchaToken = await this.$recaptcha('login');
                    console.log(`recaptcha == ${this.loginInfo.recaptchaToken}`);
                    // Do stuff with the received token.
                } else {
                    this.loginInfo.recaptchaToken = '';
                }

            },
            async loginEvent() {
                this.errorMessage = '';

                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    return;
                }

                this.loading = true;
                console.log(`req === ${JSON.stringify(this.loginInfo)}`);
                const response = await this.getKey();
                this.loading = false;

                const result = response.data;
                console.log(JSON.stringify(result));
                if (result && result.statusCode === 0){
                    this.loading = true;
                    const rsaKey = result.data.publicKey;
                    console.log(`publicKey === ${rsaKey}`);
                    const password = RSAEncrypted(rsaKey, this.loginInfo.password.trim() );
                    const res = await this.login({ account: this.loginInfo.account, password: password.trim(),
                        recaptchaToken: this.loginInfo.recaptchaToken });
                    const userResult = res.data;
                    console.log(JSON.stringify(userResult));
                    this.loading = false;
                    if (userResult && userResult.statusCode === 0){
                        const user = {token: userResult.data.token, name: userResult.data.name
                            , isLogin: true, permissions: userResult.data.permissions};
                        // console.log(`login user ${JSON.stringify(user)}`);
                        this.configUserInfo(user);
                        Notification.notifyObservers('checkUserStatus');
                        console.log('userResult', userResult.data.enter);
                        this.$router.push(`/home/${userResult.data.enter}`);
                    } else {
                        this.checkBox = false;
                        this.errorMessage = userResult ? userResult.message: this.$t('error_message_login');
                    }
                } else {
                    this.checkBox = false;
                    this.errorMessage = result ? result.message : this.$t('error_message_login');
                }
            },
            showDialog(visible, title, content) {
                this.errorMessage = content;
            },
            confirmEvent() {
                this.messageDialog.visible = false;
            },
            async registerEvent() {
                this.$router.push('/register')
            },
            forgetEvent() {
                this.$router.push({ path: '/forgetPassword',
                    query: { token:''}});
            },
        },
    };
</script>

<style scoped src="../assets/css/all.css">
</style>
