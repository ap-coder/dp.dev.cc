<template>
    <div>
        <div class="title">
            <h1>Forgot Password</h1>
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="forgot">
            <div class="ad">
<!--                <img src="../assets/images/forgot/ad-forgot-lg.jpg" class="img-lg">-->
            </div><!--end of ad-->
            <div class="form" v-if="token === ''">
                <v-form ref="form"
                    v-model="valid" lazy-validation>
                    <div v-if="isSuccess === false">
                        <p>Please enter your email address. You will receive a link to create a new password via email.</p>
                        <div class="rowDiv">
                            <div class="tit">
                                Email
                            </div>
                            <div class="con">
                                <input type="text" v-model="resetInfo.account"
                                       class="textInput" value="name">
                                <span class="msg" v-if="validation.hasError('account')">
                                {{validation.firstError('account')}}
                            </span>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="rowDiv">
                            <div class="checkBox">
                                <input type="checkbox" v-model="checkBox" id="c1" name="cc" @change="recaptcha"/>
                                <label for="c1">
                                    <span class="labelGray"></span>
                                    <span class="labelRed"></span>
                                    I'm not a robot
                                </label>
                                <span v-if="validation.hasError('recaptchaToken')"
                                      class="msg">{{validation.firstError('recaptchaToken')}}</span>
                            </div>
                        </div>
                        <div class="rowDiv" v-if="errorMessage !== ''">
                            <span class="msg">{{errorMessage}}</span>
                        </div>
                        <div class="rowDiv">
                            <a href="#"
                               @click.prevent="resetPasswordEvent" class="redBtn">
                                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                                     :width="2"
                                                     v-if="loading" :value="20"></v-progress-circular>
                                <span v-else>Submit</span>
                            </a>
                        </div>
                    </div>
                    <div  v-if="isSuccess === true">
                        <p>You will receive a link to create a new password via email.</p>
                    </div><!--end of form-->

                    <div class="rowDiv">
                        <a href="#" class="btn_signIn" @click.prevent="changePage('/login')"><span></span>Sign In</a>
                    </div>
                    <div class="rowDiv">
                        <a href="#"  class="btn_register" @click.prevent="changePage('/register')"
                        ><span></span>Creat an Account</a>
                    </div>
                </v-form>
            </div><!--end of form-->
            <div class="clear"></div>
        </div><!--end of forgot-->

        <div class="reset" v-if="token !== ''">
            <div class="form">
                <v-form ref="form"
                        v-model="valid" lazy-validation>
                    <!--重設密碼-->
                    <div v-if="isSuccess === false && saveSuccess === false">
                        <h3>Reset your Password</h3>
                        <div class="rowDiv">
                            <div class="tit">
                                New Password
                            </div>
                            <div class="con">
                                <input type="password" v-model="resetInfo.password"
                                       class="textInput">
                                <span class="msg" v-if="validation.hasError('password')">
                                {{validation.firstError('password')}}
                            </span>
                            </div>
                            <div class="clear"></div>
                        </div>
                        <div class="rowDiv">
                            <div class="tit">
                                Confirm Password
                            </div>
                            <div class="con">
                                <input type="password" v-model="resetInfo.confirmPassword"
                                       class="textInput">
                                <span class="msg" v-if="validation.hasError('confirmPassword')">
                                {{validation.firstError('confirmPassword')}}
                            </span>
                            </div>
                            <div class="clear"></div>
                        </div>

                        <div class="rowDiv" v-if="errorMessage !== ''">
                            <span class="msg">{{errorMessage}}</span>
                        </div>
                        <div class="rowDiv">
                            <a href="#"
                               @click.prevent="changePassword" class="redBtn">
                                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                                     :width="2"
                                                     v-if="loading" :value="20"></v-progress-circular>
                                <span v-else>Submit</span>
                            </a>
                        </div>
                    </div><!--end of form-->

                    <div v-if="isSuccess === true && saveSuccess === true">
                        <h3>Change Password Success</h3>
                        <p>You can use new password to sign in.</p>
                    </div><!--end of form-->

                    <div class="rowDiv">
                        <a href="#" class="btn_signIn" @click.prevent="changePage('/login')"><span></span>Sign In</a>
                    </div>
                    <div class="rowDiv">
                        <a href="#"  class="btn_register" @click.prevent="changePage('/register')"
                        ><span></span>Creat an Account</a>
                    </div>
                </v-form>
            </div><!--end of form-->
            <div class="clear"></div>
        </div>
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import {mapActions} from 'vuex';
    // import AlertView from '@/components/tools/AlertView';
    // import ProgressView from '@//components/tools/ProgressView';
    import { RSAEncrypted } from '../utils/tools';
    // import Notification from '../utils/notice_manager';
    // import CaptchaMini from 'captcha-mini';
    import BreadView from "../components/view/BreadView";
    import SimpleVueValidator from 'simple-vue-validator';
    const Validator = SimpleVueValidator.Validator;

    export default {
        name: "ForgetPasswordView",
        components: {BreadView},
        data() {
            return {
                valid: true,
                lazy: true,
                loading: false,
                isSuccess: false,
                saveSuccess: false,
                checkBox: false,
                isSubmit: false,
                resetInfo: {
                    account: '',
                    password: '',
                    confirmPassword: '',
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
                token:'',
            };
        },
        created(){
            // eslint-disable-next-line no-undef
            $(window).scrollTop(0);

            this.token = this.$route.query.token;
            if (this.token === '') {
                this.resetInfo.password = 'ignore';
                this.resetInfo.confirmPassword = 'ignore';
            } else {
                this.resetInfo.account = 'ignore';
            }
        },
        validators: {
            password: function (value) {
                return Validator.value(value.trim()).required('password is required.').minLength(6);
            },
            'confirmPassword, password': function (confirmPassword, password) {
                if ((confirmPassword && confirmPassword.length > 0) || this.isSubmit === true){
                    return Validator.value(confirmPassword.trim()).required('confirmPassword is required.')
                        .match(password.trim());
                }
                return Validator.value(confirmPassword.trim());
            },
            account: function (value) {
                return Validator.value(value).required('email or account is required.');
            },
            recaptchaToken: function (value) {
                if (this.token === '') {
                    return Validator.value(value).required('please check this checkbox.');
                }
                return Validator.value(value);
            },
        },
        computed:{
            password(){
                return this.resetInfo.password;
            },
            confirmPassword(){
                return this.resetInfo.confirmPassword;
            },
            account(){
                return this.resetInfo.account;
            },
            recaptchaToken(){
                return this.resetInfo.recaptchaToken;
            },
            getDialogOptions() {
                let list =  [
                    {key: 'account', text: 'Email or Account', type: 'text'
                        , error: false , errorMessages:[] , hidden: this.getToken !== ''},
                    {key: 'password', text: 'Password', type: 'password'
                        , error: false , errorMessages:[] , hidden: this.getToken === ''},
                    {key: 'confirmPassword', text: 'Confirm Password', type: 'password'
                        , error: false , errorMessages:[] , hidden: this.getToken === ''},
                    {key: 'captchaConfirmValue', text: 'Captcha', type: 'text'
                        , error: false , errorMessages:[]}
                ];
                return list.filter(m=>!m.hidden);
            },
            getToken(){
                return this.token;
            },
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    // { key: 'login', label:'Sign In' },
                    { key: 'forgetPassword', label:'Forgot Password' },
                ];
            }
        },
        methods: {
            ...mapActions(['configUserInfo', 'getKey' ,'forgetPassword','updatePassword']),
            async recaptcha() {
                console.log(`== recaptcha start==`);
                if (this.checkBox === true) {
                    await this.$recaptchaLoaded();
                    this.resetInfo.recaptchaToken = await this.$recaptcha('login');
                    console.log(`recaptcha == ${this.resetInfo.recaptchaToken}`);
                } else {
                    this.resetInfo.recaptchaToken = '';
                }
            },
            showDialog(visible, title, content) {
                this.messageDialog.visible = visible;
                this.messageDialog.title = title;
                this.messageDialog.content = content;
            },
            confirmEvent() {
                this.messageDialog.visible = false;
                if (this.isSuccess){
                    this.$router.push('/login');
                }
            },
            signUpCancelEvent(){
                this.$router.push('/login');
            },
            signUpEvent(){
                this.$router.push('/register');
            },
            async resetPasswordEvent(){
                this.errorMessage = '';
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    return;
                }

                if (this.token === ''){
                    this.loading = true;
                    const res = await this.forgetPassword(this.resetInfo);
                    const result = res.data;
                    this.loading = false;
                    if (result && result.statusCode === 0){
                        this.isSuccess = true;
                        // this.showDialog(true , 'Success' , 'Please check your email');
                    } else {
                        this.checkBox = false;
                        this.errorMessage = result ? result.message : 'Get new password Fail';
                        // this.showDialog(true , 'Error' , result ? result.message : 'Get new password Fail');
                    }
                } else {
                    this.checkBox = false;
                    await this.changePassword();
                }
            },
            async changePassword(){
                this.isSubmit = true;
                this.errorMessage = '';
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    return;
                }
                this.saveSuccess = false;
                this.loading = true;
                const keyResponse = await this.getKey();
                const keyResult = keyResponse.data;
                if (keyResult && keyResult.statusCode === 0) {
                    const rsaKey = keyResult.data.publicKey;
                    // this.resetInfo.password = RSAEncrypted(rsaKey, this.resetInfo.password.trim());
                    // this.resetInfo.confirmPassword = this.resetInfo.password;

                    const copy = Object.assign({}, this.resetInfo);
                    copy.password = RSAEncrypted(rsaKey, copy.password.trim());
                    copy.confirmPassword = copy.password;

                    const res = await this.updatePassword({ token: this.token
                        ,info: { password: copy.password } });
                    this.loading= false;
                    if (res && res.data){
                        if (res.data.statusCode === 0){
                            this.isSuccess = true;
                            this.saveSuccess = true;
                            // this.showDialog(true,'Success', res.data.message);
                        } else {
                            this.errorMessage = res.data.message;
                            // this.showDialog(true,'Error', res.data.message);
                        }
                    } else {
                        this.errorMessage = 'Change password Error';
                        // this.showDialog(true, 'Error', 'Change password Error');
                    }
                } else {
                    this.errorMessage = 'Change password Error';
                    // this.showDialog(true, 'Error', 'Change password Error');
                }
            },
            changePage(key){
                this.$router.push(key);
            }
        }

    }
</script>

<style scoped src="../assets/css/all.css">

</style>
