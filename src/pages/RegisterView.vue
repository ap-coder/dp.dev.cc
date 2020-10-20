<template>
    <div>
        <div class="title">
            <h1>{{ $t('register') }}</h1>
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="register">
            <div class="form" v-if="saveSuccess === false">
                <h3>{{ $t('message_create_account') }}</h3>
                <div class="left">
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('email') }}
                        </div>
                        <div class="con">
                            <input type="text" class="textInput" v-model="registerInfo.email">
                            <span class="msg" v-if="validation.hasError('email')">
                                {{validation.firstError('email')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_password') }}
                        </div>
                        <div class="con">
                            <input type="password" class="textInput" v-model="registerInfo.password">
                            <span class="msg" v-if="validation.hasError('password')">
                                {{validation.firstError('password')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_check_password') }}
                        </div>
                        <div class="con">
                            <input type="password" class="textInput" v-model="registerInfo.confirmPassword">
                            <span class="msg" v-if="validation.hasError('confirmPassword')">
                                {{validation.firstError('confirmPassword')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_company_name') }}
                        </div>
                        <div class="con">
                            <input type="text" class="textInput" v-model="registerInfo.company">
                            <span class="msg" v-if="validation.hasError('company')">
                                {{validation.firstError('company')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_phone') }}
                        </div>
                        <div class="con">
                            <input type="text" class="textInput" v-model="registerInfo.cellphone">
                            <span class="msg" v-if="validation.hasError('cellphone')">
                                {{validation.firstError('cellphone')}}
                            </span>
                        </div>
                    </div>
                </div><!--end of left-->
                <div class="right">
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_first_name') }}
                        </div>
                        <div class="con">
                            <input type="text" v-model="registerInfo.firstName"
                                   class="textInput" value="name">
                            <span class="msg" v-if="validation.hasError('firstName')">
                                {{validation.firstError('firstName')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_last_name') }}
                        </div>
                        <div class="con">
                            <input type="text" class="textInput"
                                   v-model="registerInfo.lastName" value="name">
                            <span class="msg" v-if="validation.hasError('lastName')">
                                {{validation.firstError('lastName')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_country') }}
                        </div>
                        <div class="con">
                            <select class="select" v-model="registerInfo.country">
                                <option v-for="option in getCountryList" :key="option.name"
                                :value="option.name">{{option.name}}</option>
                            </select>
                            <span class="msg" v-if="validation.hasError('country')">
                                {{validation.firstError('country')}}
                            </span>
                        </div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">
                            <span class="red--text">*</span>{{ $t('title_city') }}
                        </div>
                        <div class="con">
                            <input type="text" class="textInput" v-model="registerInfo.city">
                            <span class="msg" v-if="validation.hasError('city')">
                                {{validation.firstError('city')}}
                            </span>
                        </div>
                    </div>
                </div><!--end of right-->
                <div class="clear"></div>

                <div class="rowDiv">
                    <div class="tit">
                        <p><span class="red--text">*</span>{{ $t('register_question1') }}</p>
                    </div>
                    <div class="con">
                        <div class="radioBox">
                            <input type="radio" v-model="question1" id="q1-y" name="q1" value="1"/>
                            <label for="q1-y">
                                <span class="labelGray"></span>
                                <span class="labelRed"></span>
                              {{ $t('yes') }}
                            </label>
                            <input type="radio" v-model="question1" id="q1-n" name="q1" value="0"/>
                            <label for="q1-n">
                                <span class="labelGray"></span>
                                <span class="labelRed"></span>
                              {{ $t('no') }}
                            </label>
                            <span class="msg" v-if="validation.hasError('getQuestion1')">
                                {{validation.firstError('getQuestion1')}}
                            </span>
                        </div><!--radioBox-->
                    </div><!--con-->
                </div><!--rowDiv-->
                <div class="left">
                    <div class="tit">
                        <p><span class="red--text">*</span>{{ $t('register_question2') }}</p>
                    </div>
                    <div class="con">
                      <select id="drip-SDK-Platform" class="select" v-model="question2" name="fields[SDK_Platform">
                        <option value="Medical">{{ $t('title_q2_option1') }}</option>
                        <option value="Mobile">{{ $t('title_q2_option2') }}</option>
                        <option value="Embedded">{{ $t('title_q2_option3') }}</option>
                        <option value="Server">{{ $t('title_q2_option4') }}</option>
                      </select>
                      <span class="msg" v-if="validation.hasError('getQuestion2')">
                                {{validation.firstError('getQuestion2')}}
                            </span>
                    </div><!--con-->

                </div><!--rowDiv-->
              <div class="clear"></div>
                <div class="rowDiv">
                  <div class="tit">
                    <p><span class="red--text">*</span>{{ $t('register_question3') }}</p>
                  </div>
                </div>
                <div class="left">
                    <div class="con">
                      <select id="drip-SDK-Number-Devices" class="select" v-model="question3" name="fields[SDK_Number_Devices]">
                        <option value="0-100">{{ $t('title_q3_option1') }}</option>
                        <option value="100-1000">{{ $t('title_q3_option2') }}</option>
                        <option value="1000-10000">{{ $t('title_q3_option3') }}</option>
                        <option value="10000+">{{ $t('title_q3_option4') }}</option>
                      </select>
                      <span class="msg" v-if="validation.hasError('getQuestion3')">
                                {{validation.firstError('getQuestion3')}}
                            </span>
                    </div><!--con-->
                </div><!--rowDiv-->
              <div class="clear"></div>
                <div class="rowDiv">
                    <div class="tit">
                        <div class="checkBox">
                            <input type="checkbox" v-model="question6" id="c1" name="cc">
                            <label for="c1">
                                <span class="labelGray"></span>
                                <span class="labelRed"></span>
                                <span class="red--text">*</span>{{ $t('message_accept_conditions') }}<br/>
                                <span class="read">{{ $t('message_accept_conditions1') }}</span>&nbsp;
                                <a href="https://developer.tachyoniq.com/wp-content/uploads/2019/09/cortex-decoder-for-apps-v1-3.pdf" target="_blank" class="read">
                                  {{ $t('message_accept_conditions2') }}</a>&nbsp;
                                <span class="read">{{$t('message_accept_conditions3') }}</span>
                            </label>
                            <span class="msg" v-if="validation.hasError('getQuestion6')">
                                {{validation.firstError('getQuestion6')}}
                            </span>
                        </div>
                    </div><!--tit-->
                </div><!--rowDiv-->
                <div class="rowDiv">
                    <div class="checkBox">
                        <input type="checkbox" v-model="checkBox" id="c2" name="cc" @change="recaptcha"/>
                        <label for="c2">
                            <span class="labelGray"></span>
                            <span class="labelRed"></span>
                            <span class="red--text">*</span>{{ $t('message_not_robot') }}<br/>
                        </label>
                        <span v-if="validation.hasError('recaptchaToken')" class="msg">{{validation.firstError('recaptchaToken')}}</span>
                    </div>
                </div>
                <div class="rowDiv" v-if="errorMessage !== ''">
                    <span class="msg">{{errorMessage}}</span>
                </div>
                <div class="rowDiv">
                    <a href="#" class="redBtn" @click.prevent="signUpEvent">
                        <v-progress-circular color="#ffffff" indeterminate :size="28"
                                             :width="2"
                                             v-if="loading" :value="20"></v-progress-circular>
                        <span v-else>Submit</span>
                    </a>
                </div>

            </div><!--end of form-->
            <div class="clear"></div>
            <div class="rowDiv ml-4" v-if="saveSuccess">
                <h3>{{ $t('title_register_success') }}</h3>
                <p>{{ $t('message_register_success') }}</p>
            </div><!--end of form-->
            <div class="clear"></div>
        </div><!--end of register-->
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import {mapActions} from 'vuex';
    import countries from '../assets/json/countries'
    import AlertView from '@/components/tools/AlertView';
    import { RSAEncrypted } from '@/utils/tools';
    import SimpleVueValidator from 'simple-vue-validator';
    const Validator = SimpleVueValidator.Validator;
    import BreadView from "../components/view/BreadView";


    export default {
        name: "RegisterView",
        components: {BreadView},
        comments: [
            AlertView,
        ],
        data() {
            return {
                valid: true,
                lazy: true,
                loading: false,
                checkBox: false,
                errorMessage:'',
                saveSuccess: false,
                registerInfo: {
                    account:'',
                    email: '',
                    password: '',
                    confirmPassword: '',
                    firstName: '',
                    lastName: '',
                    cellphone: '',
                    company:'',
                    country: '',
                    city: '',
                    recaptchaToken: '',
                    epicId:'',
                },
                messageDialog: {
                    visible: false,
                    title: '',
                    content: '',
                },
                progressDialog: {
                    visible: false,
                    content: '',
                },
                question1: '',
                question2: '',
                question3: '',
                question4: '',
                question5: '',
                question6: '',
                question7: '',
                isSubmit: false,
            };
        },
        created() {
            // eslint-disable-next-line no-undef
            $(window).scrollTop(0);
        },
        validators: {
            // account: function (value) {
            //     this.errorMessage = '';
            //     return Validator.value(value).required('account is required.').minLength(6).regex(/^[\d|a-zA-Z]+$/,'can\'t input space');
            // },
            password: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_password_required'))
                    .minLength(6).regex(/^[\d|a-zA-Z]+$/, this.$t('error_input_space'));
            },
            'confirmPassword, password': function (confirmPassword, password) {
                this.errorMessage = '';
                if ((confirmPassword && confirmPassword.length > 0) || this.isSubmit === true){
                    return Validator.value(confirmPassword).required(this.$t('message_confirmPassword_required')).match(password);
                }
                return Validator.value(confirmPassword);
            },
            email: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_email_required')).email(this.$t('error_email_format'));
            },
            firstName: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_first_name_required'));
            },
            lastName: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_last_name_required'));
            },
            cellphone: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_cellphone_required'));
            },
            country: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_country_required'));
            },
            city: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_city_required'));
            },
            company: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_company_required'));
            },
            recaptchaToken: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_recaptcha'));
            },
            getQuestion1 : function (value) {
                console.log(value);
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_question_required'));
            },
            getQuestion2 : function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_question_required'));
            },
            getQuestion3 : function (value) {
                this.errorMessage = '';
                return Validator.value(value).required(this.$t('message_question_required'));
            },
            epicId : function (value) {
                this.errorMessage = '';
                if (this.question2 === '1'){
                    return Validator.value(value).required(this.$t('message_epicId_required'));
                }
                return Validator.value(value).match(true);
            },
        } ,
        computed:{
            getQuestion1(){
              return this.question1;
            },
            getQuestion2(){
                return this.question2;
            },
            getQuestion3(){
                return this.question3;
            },
            getQuestion4(){
                return this.question4;
            },
            getQuestion5(){
                return this.question5;
            },
            getQuestion6(){
                return this.question6;
            },
            getQuestion7(){
                return this.question7;
            },
            getCountryList(){
              return countries;
            },
            account(){
                return this.registerInfo.account;
            },
            password(){
                return this.registerInfo.password;
            },
            confirmPassword(){
                return this.registerInfo.confirmPassword;
            },
            email(){
                return this.registerInfo.email;
            },
            firstName(){
                return this.registerInfo.firstName;
            },
            lastName(){
                return this.registerInfo.lastName;
            },
            cellphone(){
                return this.registerInfo.cellphone;
            },
            company(){
                return this.registerInfo.company;
            },
            country(){
                return this.registerInfo.country;
            },
            city(){
                return this.registerInfo.city;
            },
            epicId(){
                return this.registerInfo.epicId;
            },
            recaptchaToken(){
                return this.registerInfo.recaptchaToken;
            },
            getDialogOptions() {
                return [
                    // {key: 'account', text: 'Account', type: 'text'
                    //     , error: false , errorMessages:[]},
                    {key: 'password', text: this.$t('title_password'), type: 'password'
                        , error: false , errorMessages:[]},
                    {key: 'confirmPassword', text: this.$t('title_confirm_password'), type: 'password'
                        , error: false , errorMessages:[]},
                    {key: 'email', text: this.$t('email'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'firstName', text: this.$t('title_first_name'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'lastName', text: this.$t('title_last_name'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'company', text: this.$t('title_company_name'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'cellphone', text: this.$t('title_phone_number'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'country', text: this.$t('title_country'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'city', text: this.$t('title_city'), type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'captchaConfirmValue', text: this.$t('title_captcha'), type: 'text'
                        , error: false , errorMessages:[]}
                ]
            },
            breadMenu(){
                return [
                    { key: 'index', label: this.$t('path_index') },
                    { key: 'register', label: this.$t('sign_up_title') },
                ];
            },
        },
        methods: {
            ...mapActions(['registerUser', 'configUserInfo', 'getKey']),
            async recaptcha() {
                console.log(`== recaptcha start==`);
                if (this.checkBox === true) {
                    await this.$recaptchaLoaded();

                    // Execute reCAPTCHA with action "login".
                    this.registerInfo.recaptchaToken = await this.$recaptcha('login');
                    console.log(`recaptcha == ${this.registerInfo.recaptchaToken}`);
                } else {
                    this.registerInfo.recaptchaToken = '';
                }
            },
            showDialog(visible, title, content) {
                this.errorMessage = content;
            },
            confirmEvent() {
                this.messageDialog.visible = false;
            },
            signUpCancelEvent(){
                this.$router.push('/login');
            },
            async signUpEvent(){

                this.isSubmit = true;
                this.errorMessage = '';
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    this.errorMessage = this.$t('error_fill_all_fields');
                    return;
                }

                console.log(JSON.stringify(this.registerInfo));

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

                    const copy = Object.assign({}, this.registerInfo);
                    copy.question1 = this.question1;
                    copy.question2 = this.question2;
                    copy.question3 = this.question3;
                    copy.question4 = this.question4;
                    copy.question5 = this.question5;
                    copy.question6 = this.question6;
                    copy.question7 = this.question7;
                    copy.account = copy.email;
                    copy.password = RSAEncrypted(rsaKey, copy.password.trim());
                    copy.confirmPassword = copy.password;
                    const res = await this.registerUser(copy);
                    const userResult = res.data;
                    console.log(JSON.stringify(userResult));
                    this.loading = false;
                    if (userResult && userResult.statusCode === 0){
                        const user = {token: userResult.data.token, name: userResult.data.name , isLogin: false};
                        console.log(`register user ${JSON.stringify(user)}`);
                        this.saveSuccess = true;
                        this.toTop();
                    } else {
                        this.checkBox = false;
                        this.saveSuccess = false;
                        this.errorMessage = userResult ? userResult.message: this.$t('error_message_register');
                    }
                } else {
                    this.checkBox = false;
                    this.saveSuccess = false;
                    this.errorMessage = result ? result.message : this.$t('error_message_register');
                }
            },
            toTop(){
                // eslint-disable-next-line no-undef
                $('html,body').animate({scrollTop: '0px'}, 800);
            }
        }
    }
</script>

<style scoped src="../assets/css/all.css">

</style>
