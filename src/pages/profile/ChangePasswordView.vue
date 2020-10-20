<template>
    <div class="profilePswDiv">
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="rowLeft">
            <form class="v-form">
                <div class="rowDiv">
                  <div class="tit">Old Password</div>
                  <div class="con">
                      <input type="password" class="textInput" v-model="passwordInfo.oldPassword">
                      <span class="msg" v-if="validation.hasError('oldPassword')">
                          {{validation.firstError('oldPassword')}}
                      </span>
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="rowDiv">
                  <div class="tit">New Password</div>
                  <div class="con">
                      <input type="password" class="textInput" v-model="passwordInfo.newPassword">
                      <span class="msg" v-if="validation.hasError('newPassword')">
                          {{validation.firstError('newPassword')}}
                      </span>
                  </div>
                  <div class="clear"></div>
                </div>
                <div class="rowDiv">
                  <div class="tit">Confirm New Password</div>
                  <div class="con">
                      <input type="password" class="textInput" v-model="passwordInfo.confirmPassword">
                      <span class="msg" v-if="validation.hasError('confirmPassword')">
                          {{validation.firstError('confirmPassword')}}
                      </span>
                  </div>
                  <div class="clear"></div>
                </div>
            </form>
        </div><!--rowLeft-->
        <div class="rowDiv">
          <a href="#"
             @click.prevent="saveEvent" class="redBtn">
            <v-progress-circular color="#ffffff" indeterminate :size="28"
                                 :width="2"
                                 v-if="loading" :value="20"></v-progress-circular>
            <span v-else>Save</span>
          </a>
            <a class="grayBtn" @click="cancel">Back</a>
        </div>
    </div><!--usersAddDiv-->
</template>
<script>
import { mapActions } from 'vuex';
import common from '@M/common';
import {RSAEncrypted} from "@U/tools";
import SimpleVueValidator from 'simple-vue-validator';
const Validator = SimpleVueValidator.Validator;
// import AlertView from '@/components/tools/AlertView';
// import {CACHE_USER_KEY} from "@U/Constant";
import Notification from "@U/notice_manager";

export default {
    name: "ChangePasswordView",
    mixins: [common],
    components: {
        // AlertView
    },
    data() {
        return {
            loading: false,
            passwordInfo: {
                oldPassword: '',
                newPassword: '',
                confirmPassword: '',
            },
            messageDialog: {
                visible: false,
                title: '',
                content: '',
                confirm: ()=>{},
            },
        }
    },
    computed: {
        oldPassword(){
            return this.passwordInfo.oldPassword;
        },
        newPassword(){
            return this.passwordInfo.newPassword;
        },
        confirmPassword(){
            return this.passwordInfo.confirmPassword;
        },
    },
    created() {
        Notification.notifyObservers('pushSubPath', {label: 'Change Password'});
    },
    validators: {
        oldPassword: function (value) {
            return Validator.value(value).required('password is required.');
        },
        'confirmPassword, newPassword': function (confirmPassword, password) {
            return Validator.value(confirmPassword).required('confirm password is required.').match(password);
        },
    },
    methods: {
        ...mapActions([
            'getKey',
            'updatePassword',
            'showAlert',
            'hideAlert'
        ]),
        async saveEvent() {
            const success = await this.$validate();
            console.log(`success == ${success}`);
            if (!success){
                this.errorMessage = 'Please fill in all fields';
                return;
            }

            // do something
            this.loading = true;
            const keyResponse = await this.getKey();
            const keyResult = keyResponse.data;
            if (keyResult && keyResult.statusCode === 0) {
                const rsaKey = keyResult.data.publicKey;
                const oldPassword = RSAEncrypted(rsaKey, this.passwordInfo.oldPassword.trim());
                const RSAEncryptedPassword = RSAEncrypted(rsaKey, this.passwordInfo.newPassword.trim());
                const res = await this.updatePassword({
                    token: this.getUserInfo.token,
                    info: {
                        userId: this.getUserInfo.userId,
                        oldPassword: oldPassword,
                        password: RSAEncryptedPassword
                    }
                });
                this.loading = false;
                if (res){
                    if (res.data.statusCode === 0){
                        this.showDialog(true, 'Success' , res.data.message, ()=>{
                            // this.messageDialog.visible = false;
                            this.hideAlert();
                            this.passwordInfo.oldPassword = '';
                            this.passwordInfo.newPassword = '';
                            this.passwordInfo.confirmPassword = '';
                            this.validation.reset();
                            this.$router.back();
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
        cancel(){
            this.$router.back();
        }
    },
    destoryed() {
        Notification.notifyObservers('popSubPath');
    }
}

</script>

<style scoped src="../../assets/css/all-admin.css"></style>
