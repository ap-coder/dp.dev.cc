<template>
    <div class="usersDiv">
        <!--Change Password-->
        <div class="form" v-if="getMode === '1'">
            <v-form ref="form"
                    v-model="valid"
                    lazy-validation>
<!--                <h3>{{getTitle}}</h3>-->
                <div class="rowDiv">
                    <button type="button" class="v-btn theme--light primary">
                        <div class="v-btn__content" @click.prevent="changeMode('0')">Profile</div>
                    </button>
                </div>
                <div class="rowDiv" v-for="col in getPasswordOptions"
                     :key="col.key">
                    <div class="tit">
                        {{col.text}}
                    </div>
                    <div class="con">
                        <input :type="col.type" v-model="passwordInfo[col.key]"
                               class="textInput" value="name">
                        <span class="msg" v-if="validation.hasError(col.key)">
                                {{validation.firstError(col.key)}}
                            </span>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="rowDiv">
                    <a href="#"
                       @click.prevent="saveEvent" class="redBtn">
                        <v-progress-circular color="#ffffff" indeterminate :size="28"
                                             :width="2"
                                             v-if="loading" :value="20"></v-progress-circular>
                        <span v-else>Submit</span>
                    </a>
                </div>
            </v-form>
        </div>
        <!--修改mail-->
        <div class="form" v-if="getMode === '2'">
            <v-form ref="form"
                    v-model="valid"
                    lazy-validation>
<!--                <h3>{{getTitle}}</h3>-->
                <div class="rowDiv">
                    <button type="button" class="v-btn theme--light primary">
                        <div class="v-btn__content" @click.prevent="changeMode('0')">Profile</div>
                    </button>
                </div>
                <div class="rowDiv" v-for="col in getEmailOptions"
                     :key="col.key">
                    <div class="tit">
                        {{col.text}}
                    </div>
                    <div class="con">
                        <input :type="col.type" v-model="userProfile[col.key]"
                               class="textInput" value="name">
                        <span class="msg" v-if="validation.hasError(col.key)">
                                {{validation.firstError(col.key)}}
                            </span>
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="rowDiv">
                    <a href="#"
                       @click.prevent="saveEvent" class="redBtn">
                        <v-progress-circular color="#ffffff" indeterminate :size="28"
                                             :width="2"
                                             v-if="loading" :value="20"></v-progress-circular>
                        <span v-else>Submit</span>
                    </a>
                </div>
            </v-form>
        </div>
        <!--Profile-->
        <div class="form profile" v-if="getMode === '0'">
            <form class="v-form">
<!--                <h3>Profile</h3>-->
                <div class="rowDiv">
                    <div class="photo" style="">
                        <img v-if="getUserInfo.profileURL"
                             :src="getUserInfo.profileURL">
                        <img v-else :src="defaultPhoto">
                    </div>
                    <div class="function">
                        <div class="name">Hi, {{ `${getUserInfo.firstName} ${getUserInfo.lastName}`}}</div>
                        <button type="button" class="v-btn theme--light primary" @click="uploadEvent">
                            <div class="v-btn__content">
                                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                                     :width="2"
                                                     v-if="uploading" :value="20"></v-progress-circular>
                                <span v-else>Change Avatar</span>
                            </div>
                        </button>
                        <button type="button" class="v-btn theme--light primary">
                            <div class="v-btn__content" @click.prevent="changeMode('1')">Change Password</div></button>
<!--                        <button type="button" class="v-btn theme&#45;&#45;light primary">-->
<!--                            <div class="v-btn__content" @click.prevent="changeMode('2')">ReVerify Email</div></button>-->
                        <input
                               ref="files"
                               type="file" :name="uploadFieldName"
                               style="visibility: hidden"
                               @change="handleFilesUpload()"
                               accept="image/*" class="v-btn theme--light primary">
                    </div>
                    <div class="clear"></div>
                </div>
                <div class="rowLeft">
                    <div class="rowDiv">
                        <div class="tit">Account</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.account" class="textInput" disabled="disabled">
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Email</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.email" class="textInput" disabled="disabled">
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">First Name</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.firstName" class="textInput">
                            <span class="msg" v-if="validation.hasError('firstName')">
                                {{validation.firstError('firstName')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Last Name</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.lastName" class="textInput">
                            <span class="msg" v-if="validation.hasError('lastName')">
                                {{validation.firstError('lastName')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div><div class="rowDiv">
                </div>
                </div><!--rowLeft-->
                <div class="rowRight">
                    <div class="rowDiv">
                        <div class="tit">Display Name</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.displayName" class="textInput">
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv" v-if="isCustomerByUserProfile">
                        <div class="tit">Company Name</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.company" class="textInput">
                            <span class="msg" v-if="validation.hasError('company')">
                                {{validation.firstError('company')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv">
                        <div class="tit">Phone Number</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.cellphone" class="textInput">
                            <span class="msg" v-if="validation.hasError('cellphone')">
                                {{validation.firstError('cellphone')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv" v-if="isCustomerByUserProfile">
                        <div class="tit">Country</div>
                        <div class="con">
                            <select class="select" v-model="userProfile.country">
                                <option v-for="option in getCountryList" :key="option.name"
                                        :value="option.name">{{option.name}}</option>
                            </select>
                            <span class="msg" v-if="validation.hasError('country')">
                                {{validation.firstError('country')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                    <div class="rowDiv" v-if="isCustomerByUserProfile">
                        <div class="tit">City</div>
                        <div class="con">
                            <input type="text" v-model="userProfile.city" class="textInput">
                            <span class="msg" v-if="validation.hasError('city')">
                                {{validation.firstError('city')}}
                            </span>
                        </div>
                        <div class="clear"></div>
                    </div>
                </div><!--rowRight-->

                <div class="clear"></div>
                <div class="rowDiv" v-if="errorMessage !== ''">
                    <span class="msg">{{errorMessage}}</span>
                </div>
                <div class="rowDiv">
                    <!--                    <a href="#" class="redBtn"><span data-v-483fc058="">Save</span></a>-->
                    <a href="#" class="redBtn" @click.prevent="saveEvent">
                        <v-progress-circular color="#ffffff" indeterminate :size="28"
                                             :width="2"
                                             v-if="loading" :value="20"></v-progress-circular>
                        <span v-else>Save</span>
                    </a>
                </div>
            </form>
        </div>
        <!--profile-->

        <!--彈出視窗-->
        <!-- <alert-view :visible="messageDialog.visible"
                    :title="messageDialog.title"
                    :content="messageDialog.content"
                    :show-cancel="false"
                    @confirmEvent="messageDialog.confirm"></alert-view> -->
    </div>
</template>

<script>
    import {mapActions, mapGetters} from 'vuex';
    import countries from '../assets/json/countries'
    // import AlertView from '@/components/tools/AlertView';
    import SimpleVueValidator from 'simple-vue-validator';
    const Validator = SimpleVueValidator.Validator;
    import Notification from '../utils/notice_manager';
    import {RSAEncrypted} from "../utils/tools";
    import {ROLE_ID} from "@U/Constant";
    export default {
        name: "ProfileView",
        // components: {AlertView},
        data(){
            return {
                defaultPhoto: require('../assets/images/profilePhoto-lg.jpg'),
                valid: true,
                lazy: true,
                loading: false,
                uploading: false,
                mode: '0', // 0:profile 1:change password 2:changeEmail
                userProfile: {
                    userId:'',
                    account:'',
                    email: '',
                    nickname:'',
                    displayName:'',
                    firstName: '',
                    lastName: '',
                    cellphone: '',
                    company:'',
                    country: '',
                    city: '',
                },
                passwordInfo: {
                    password: '',
                    confirmPassword: '',
                },
                // messageDialog: {
                //     visible: false,
                //     title: '',
                //     content: '',
                //     confirm: ()=>{},
                // },
                files: '',
                uploadedFiles: [],
                uploadFieldName: 'photos',
                profileURL: null,
                errorMessage:'',
            };
        },
        validators: {
            password: function (value) {
                if (this.getMode === '1'){
                    return Validator.value(value).required('password is required.');
                }
                return Validator.value(value);
            },
            'confirmPassword, password': function (confirmPassword, password) {
                if (this.getMode === '1' && confirmPassword && confirmPassword.length > 0){
                    return Validator.value(confirmPassword).required('confirmPassword is required.').match(password);
                }
                return Validator.value(confirmPassword);
            },
            email: function (value) {
                if (this.getMode === '0' || this.getMode === '2'){
                    return Validator.value(value).required('email is required.').email('That doesn\'t look like a valid email address.');
                }
                return Validator.value(value);
            },
            firstName: function (value) {
                if (this.getMode === '0'){
                    return Validator.value(value).required('First Name is required.');
                }
                return Validator.value(value);
            },
            lastName: function (value) {
                if (this.getMode === '0') {
                    return Validator.value(value).required('Last Name is required.');
                }
                return Validator.value(value);
            },
            cellphone: function (value) {
                if (this.getMode === '0') {
                    return Validator.value(value).required('Phone number is required.');
                }
                return Validator.value(value);
            },
            country: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required('Country is required.');
            },
            city: function (value) {
                this.errorMessage = '';
                return Validator.value(value).required('City is required.');
            },
        } ,
        created() {
            this.mode = `${this.$route.query.mode}`;
            // this.$set(this,'mode',this.$route.query.mode);
            console.log(`create ${this.mode}`);

            Notification.addObserver('refresh_user', userInfo=>{
                this.configUser(userInfo);
            });

            if (this.getUserInfo.userId){
                this.configUser(this.getUserInfo);
                this.profileURL = this.getUserInfo.profileURL;
            }
            console.log(`userProfile == ${this.mode} / ${JSON.stringify(this.userProfile)}`);
        },
        watch:{
            // eslint-disable-next-line no-unused-vars
            '$route' (to, from) {
                console.log(`route ${to.query.mode}`);
                this.mode = `${to.query.mode}`;
            }
        },
        computed: {
            ...mapGetters(['getUserInfo','getUserPermission']),
            getUserAvatar(){
                if (this.getUserInfo.userId){
                    return this.getUserInfo.account.toUpperCase().substring(0,1)
                }
                return this.getUserInfo.account;
            },
            getMode(){
              return `${this.mode}`;
            },
            getTitle(){
                console.log(`getTitle == ${`${this.mode}`=== '2'}`);
                if (this.mode === '1'){
                    return 'Change Password';
                }
                if (this.mode === '2'){
                    return 'Change Email';
                }
                return 'Edit Profile';
            },
            getCountryList(){
                return countries;
            },
            password(){
                return this.passwordInfo.password;
            },
            confirmPassword(){
                return this.passwordInfo.confirmPassword;
            },
            email(){
                return this.userProfile.email;
            },
            firstName(){
                return this.userProfile.firstName;
            },
            lastName(){
                return this.userProfile.lastName;
            },
            nickname(){
                return this.userProfile.nickname;
            },
            cellphone(){
                return this.userProfile.cellphone;
            },
            company(){
                return this.userProfile.company;
            },
            country(){
                return this.userProfile.country;
            },
            city(){
                return this.userProfile.city;
            },
            getDialogOptions() {
                return [
                    {key: 'account', text: 'Account', type: 'text'
                        , error: false , errorMessages:[] , disabled: true},
                    // {key: 'password', text: 'Password', type: 'password'
                    //     , error: false , errorMessages:[]},
                    // {key: 'confirmPassword', text: 'Confirm Password', type: 'password'
                    //     , error: false , errorMessages:[]},
                    {key: 'email', text: 'Email', type: 'text'
                        , error: false, disabled: true , errorMessages:[]},
                    {key: 'firstName', text: 'First Name', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'lastName', text: 'Last Name', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'nickname', text: 'NickName', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'displayName', text: 'Display Name', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'company', text: 'Company Name', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'cellphone', text: 'Phone number', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'country', text: 'Country', type: 'text'
                        , error: false , errorMessages:[]},
                    {key: 'city', text: 'City', type: 'text'
                        , error: false , errorMessages:[]},
                    // {key: 'captchaConfirmValue', text: 'Captcha', type: 'text'
                    //     , error: false , errorMessages:[]}
                ]
            },
            getPasswordOptions() {
                return [
                    {key: 'oldPassword', text: 'Old Password', type: 'password'
                        , error: false , errorMessages:[]},
                    {key: 'password', text: 'Password', type: 'password'
                        , error: false , errorMessages:[]},
                    {key: 'confirmPassword', text: 'Confirm Password', type: 'password'
                        , error: false , errorMessages:[]},
                ]
            },
            getEmailOptions() {
                return [
                    {key: 'email', text: 'Email', type: 'text'
                        , error: false , errorMessages:[]},
                ]
            },
            isCustomerByUserProfile() {
              return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
            },
        },
        methods: {
            ...mapActions([
                'updateProfile',
                'updatePassword',
                'getKey',
                'changeEmail',
                'uploadProfileImage',
                'showAlert',
                'hideAlert'
            ]),
            changeMode(key){
                this.mode = key;
            },
            configUser(userInfo){
                this.userProfile.userId = userInfo.userId;
                this.userProfile.account = userInfo.account;
                this.userProfile.email = userInfo.email;
                this.userProfile.firstName = userInfo.firstName;
                this.userProfile.lastName = userInfo.lastName;
                this.userProfile.company = userInfo.company ? userInfo.company: '';
                this.userProfile.cellphone = userInfo.cellphone ? userInfo.cellphone: '';
                this.userProfile.country = userInfo.country ? userInfo.country: '';
                this.userProfile.city = userInfo.city ? userInfo.city: '';
                this.userProfile.nickname = userInfo.nickname ? userInfo.nickname: '';
                this.userProfile.displayName = userInfo.displayName ? userInfo.displayName: '';
            },
            showDialog(visible, title, content, confirmEvent) {
                this.showAlert({
                    title,
                    content,
                    showCancel: false,
                    confirmEvent
                });
                // this.messageDialog.visible = visible;
                // this.messageDialog.title = title;
                // this.messageDialog.content = content;
                // this.messageDialog.confirm = confirmEvent;
            },
            async saveEvent(){
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    return;
                }

                if (this.getMode === '1'){
                    await this.savePassword();
                } else if (this.getMode === '2'){
                    await this.saveEmail();
                } else {
                    await this.saveProfile();
                }

            },
            async saveProfile(){
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    this.errorMessage = 'Please fill in all fields';
                    return;
                }

                this.loading = true;
                const result = await this.updateProfile({
                    token: this.getUserInfo.token,
                    info: this.userProfile,
                });
                this.loading = false;
                if (result.data){
                    console.log(`save result ${JSON.stringify(result)}`);
                    this.errorMessage = result.data.message;
                } else {
                    this.errorMessage = 'Server Error';
                }
            },
            async savePassword(){
                const success = await this.$validate();
                console.log(`success == ${success}`);
                if (!success){
                    this.errorMessage = 'Please fill in all fields';
                    return;
                }

                this.loading = true;
                const keyResponse = await this.getKey();
                const keyResult = keyResponse.data;
                if (keyResult && keyResult.statusCode === 0) {
                    const rsaKey = keyResult.data.publicKey;
                    this.passwordInfo.password = RSAEncrypted(rsaKey, this.passwordInfo.password.trim());
                    this.passwordInfo.confirmPassword = this.passwordInfo.password;
                    const res = await this.updatePassword({ token: this.getUserInfo.token
                        ,info: { userId: this.getUserInfo.userId,
                            password: this.passwordInfo.password } });
                    this.loading = false;
                    if (res){
                        if (res.data.statusCode === 0){
                            this.showDialog(true, 'Success' , res.data.message, ()=>{
                                // this.messageDialog.visible = false;
                                this.hideAlert();
                                this.passwordInfo.password = '';
                                this.passwordInfo.confirmPassword = '';
                                this.validation.reset();
                            });
                        } else {
                            this.showDialog(true, 'Error' , res.data.message, ()=>{
                                // this.messageDialog.visible = false;
                                this.hideAlert();
                            });
                        }
                    } else {
                        this.showDialog(true, 'Error' , 'Update Error', ()=>{
                            // this.messageDialog.visible = false;
                            this.hideAlert();
                        });
                    }
                } else {
                    this.showMessageDialog('Error', 'Update Error', true);
                }
            },
            async saveEmail(){
                this.loading = true;
                const res = await this.changeEmail({ token: this.getUserInfo.token
                    ,info: { userId: this.getUserInfo.userId,
                        email: this.userProfile.email } });
                this.loading = false;
                if (res){
                    if (res.data.statusCode === 0){
                        this.errorMessage = res.data.message;
                        this.validation.reset();
                    } else {
                        this.errorMessage = res.data.message;
                    }
                } else {
                    this.errorMessage = 'Update Error';
                }
            },
            uploadEvent(){
                this.errorMessage = '';
                this.files = null;
                this.$refs.files.click();
            },
            handleFilesUpload() {
                this.files = this.$refs.files.files;
                console.log('handleFilesUpload');
                //
                const file = this.files[0];
                const limit =  2 * 1024 * 1024;
                console.log(`check file size ${file.size} > ${limit}`);
                if (file.size > limit){
                    this.errorMessage = 'File too large';
                    return;
                }
                // console.log(file);
                this.upload();
            },
            upload() {
                this.uploading = true;
                const formData = new FormData();
                for (let i = 0; i < this.files.length; i += 1) {
                    const file = this.files[i];
                    formData.append(`photos[${i}]`, file);
                }
                this.uploadProfileImage({ fileList: formData,
                    token:this.getUserInfo.token }).then((response) => {
                    console.log(`upload ... ${JSON.stringify(response)}`);
                    this.uploading = false;
                    if (response.status === 200) {
                        console.log('上傳成功');
                        Notification.notifyObservers('checkUserStatus');
                        this.files = '';
                    }
                }).catch(e=>{
                    this.uploading = false;
                    this.errorMessage = 'Upload Error';
                    console.log(`上傳失敗 ${e}`);
                });
            },
        },
    }
</script>

<style scoped src="../assets/css/all-admin.css"></style>
<style scoped src="../assets/css/profile.css"></style>
