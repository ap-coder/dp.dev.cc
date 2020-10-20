<template>
    <div class="PopupFrame" >
        <div class="popTitle clearfix">
        <h1>{{`${getUserDetails.firstName} ${getUserDetails.lastName}`}}<span class="mail">{{getUserDetails.email}}</span></h1><a class="btnClose" @click="closeHandle"></a>
        </div>
        <v-progress-linear height="3px"
                v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="pop_content">
        <div class="rowDiv" v-if="!isSales">
            <a href="#" class="blueBtn" @click.prevent="changeMode('1')">Change Password</a>
            <a class="delete2Btn" style="float: right;" @click.prevent="deleteUser"></a>
            <div class="clear"></div>
        </div><!--rowDiv-->
        <!--變更密碼-->
          <div class="usersPswDiv" v-if="getMode === '1'">
            <div class="rowLeft">
              <div class="rowDiv">
                <div class="tit">New Password</div>
                <div class="con">
                  <input type="password" class="textInput" v-model="passwordInfo.password">
                  <span class="msg" v-if="validation.hasError('password')">
                                {{validation.firstError('password')}}
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
              <div class="rowDiv" style="margin-top: 5px;" v-if="errorMessage !== '' || message !== ''">
                <span class="msg" v-if="message !== ''">{{ message }}</span>
                <span class="msg" v-else-if="errorMessage !==''">{{ errorMessage }}</span>
                <span class="msg" v-else></span>
                <div class="clear"></div>
              </div>
            </div><!--rowLeft-->
            <div class="clear"></div>
            <div class="rowDiv">
              <a href="#"
                 @click.prevent="savePassword" class="redBtn">
                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                     :width="2"
                                     v-if="updateLoading" :value="20"></v-progress-circular>
                <span v-else>Save</span>
              </a>
              <a href="#" class="grayBtn" style="margin-left: 5px;"
                 @click.prevent="changeMode('0')">
                Back
              </a>
            </div>
          </div><!--usersAddDiv-->

        <!--會員資料-->
        <div class="rowLeft" v-if="getMode === '0'">
            <div class="rowDiv">
            <div class="tit">
                <span class="red--text">*</span>Email
            </div>
            <div class="con">
                <input type="text" disabled="disabled" class="textInput" v-model="getUserDetails.email">
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">
                <span class="red--text">*</span>First Name
            </div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.firstName" :disabled="!canEditUser">
                <span class="msg" v-if="validation.hasError('firstName')">
                                {{ validation.firstError('firstName') }}
                            </span>
                <!---->
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">
                <span class="red--text">*</span>Last Name
            </div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.lastName" :disabled="!canEditUser">
                <span class="msg" v-if="validation.hasError('lastName')">
                                {{ validation.firstError('lastName') }}
                            </span>
                <!---->
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">
                <span class="red--text">*</span>Phone Number
            </div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.cellphone" :disabled="!canEditUser">
                <span class="msg" v-if="validation.hasError('cellphone')">
                                {{ validation.firstError('cellphone') }}
                            </span>
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv" v-if="isCustomerByUserProfile">
            <div class="tit">Company Name</div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.company" :disabled="!canEditUser">
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv" v-if="isCustomerByUserProfile">
            <div class="tit">Epic ID</div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.epicId" :disabled="!canEditUser">
            </div>
            <div class="clear"></div>
            </div>
        </div><!--rowLeft-->
        <div class="rowRight" v-if="getMode === '0'">
            <div class="rowDiv" v-if="isCustomerByUserProfile">
            <div class="tit">Country</div>
            <div class="con">
                <select class="select" v-model="itemDetails.country" :disabled="!canEditUser">
                    <option v-for="option in getCountryList" :key="option.name"
                      :value="option.name">{{ option.name }}
                    </option>
                </select>
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv" v-if="isCustomerByUserProfile">
            <div class="tit">City</div>
            <div class="con">
                <input type="text" class="textInput" v-model="itemDetails.city" :disabled="!canEditUser">
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">
                <span class="red--text">*</span>Role
            </div>
            <div class="con">
                <select class="select" v-model="itemDetails.role" :disabled="!canEditUser">
                    <option
                        v-for="option in userRoleList"
                        :key="option.key"
                        :value="option.key">{{ option.text }}
                    </option>
                </select>
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">Status</div>
            <div class="con">
                <select class="select" v-model="itemDetails.status" :disabled="!canEditUser">
                    <option
                        v-for="option in userStatusList"
                        :key="option.key"
                        :value="option.key">{{ option.text }}
                    </option>
                </select>
            </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv" v-if="isCustomerByUserProfile">
                <div class="tit">
                    <span class="red--text">*</span>Account Manager
                </div>
                <div class="con">
                    <select class="select" v-model="itemDetails.accountManager" :disabled="!canEditUser">
                        <option
                            v-for="option in salesList"
                            :key="option.userId"
                            :value="option.userId">{{ option.firstName }} {{ option.lastName }}
                        </option>
                    </select>
                </div>
            <div class="clear"></div>
            </div>
            <div class="rowDiv">
            <div class="tit">Group</div>
            <div class="con">
                <select class="select" v-model="itemDetails.groupId" :disabled="!canEditUser">
                    <option v-for="option in groupOptions"
                        :key="option.groupId"
                        :value="option.groupId">{{ option.name }}
                    </option>
                </select>
            </div>
            <div class="clear"></div>
            </div>
        </div><!--rowRight-->
          <div class="clear"></div>
          <div class="rowDiv" style="margin-top: 5px;" v-if="errorMessage !== '' || message !== ''">
            <span class="msg" v-if="message !== ''">{{ message }}</span>
            <span class="msg" v-else-if="errorMessage !==''">{{ errorMessage }}</span>
            <span class="msg" v-else></span>
            <div class="clear"></div>
          </div>
        <div class="clear"></div>
        <div class="rowDiv" v-if="getMode === '0'">
            <a class="redBtn" @click="saveEvent(itemDetails)" v-if="canEditUser">
              <v-progress-circular color="#ffffff" indeterminate :size="28"
                                  :width="2"
                                  v-if="saveLoading" :value="20"></v-progress-circular>
              <span v-else>Save</span>
            </a>
            <a class="grayBtn popCancelBtn" style="margin-left: 10px;" @click="closeHandle">Back</a>
        </div>
        </div><!--pop_content-->
    </div><!--frame-->
</template>

<script>
import SimpleVueValidator from 'simple-vue-validator';
import { mapGetters, mapActions } from 'vuex';
import common from '@M/common';
import countries from "../../assets/json/countries";
import {CACHE_USER_KEY, ROLE_ID} from "@/utils/Constant";
import {RSAEncrypted} from "@U/tools";
import Notification from "@U/notice_manager";
const Validator = SimpleVueValidator.Validator;

export default {
    mixins: [common],
    data() {
        return {
            mode: '0',
            itemDetails: {},
            salesList: [],
            groupOptions: [],
            loading: true,
            passwordInfo: {
              oldPassword: '',
              password: '',
              confirmPassword: '',
            },
            updateLoading: false,
            message:'',
            errorMessage:'',
            saveLoading: false
        }
    },
    validators:{
      password: function (value) {
        console.log(`mode ${this.getMode} / password ${value}`);
        if (this.getMode === '1') {
          return Validator.value(value).required('password is required.');
        }
        return Validator.value(true).match(true);
      },
      'confirmPassword, password': function (confirmPassword, password) {
        console.log(`mode ${this.getMode} / confirmPassword ${confirmPassword} == ${password}`);
        if (this.getMode === '1') {
          return Validator.value(confirmPassword).required('confirm password is required.').match(password);
        }
        return Validator.value(true).match(true);
      },
      firstName: function (value) {
        console.log('first', value);

        if (this.getMode === '0') {
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
      accountManager: function (value) {
        this.message = '';
        if (this.itemDetails.role === ROLE_ID.CUSTOMER_ROLE_ID) {
          return Validator.value(value).required('Account Manager is required.');
        }
        return Validator.value(true).match(true);
      }
    },
    computed: {
        ...mapGetters([
            'getUserInfo',
            'getUserDetails',
            'getRoleList'
        ]),
        getMode() {
          return this.mode;
        },
        isCustomerByUserProfile() {
            return this.itemDetails.role === ROLE_ID.CUSTOMER_ROLE_ID;
        },
        getCountryList() {
            return countries;
        },
        userRoleList() {
            let list = [];
            this.getRoleList.forEach(role => {
                list.push({
                key: role.roleId,
                text: role.name,
                })
            });
            return list;
        },
        userStatusList() {
            return [
                {key: 0, text: 'Registered'},
                {key: 1, text: 'Pending'},
                {key: 2, text: 'Approved'},
                // { key: -1, text: 'Disabled'},
            ];
        },
        password() {
          return this.passwordInfo.password;
        },
        confirmPassword() {
          return this.passwordInfo.confirmPassword;
        },
        email() {
          return this.itemDetails.email;
        },
        firstName() {
          return this.itemDetails.firstName;
        },
        lastName() {
          return this.itemDetails.lastName;
        },
        nickname() {
          return this.itemDetails.nickname;
        },
        cellphone() {
          return this.itemDetails.cellphone;
        },
        company() {
          return this.itemDetails.company;
        },
        country() {
          return this.itemDetails.country;
        },
        city() {
          return this.itemDetails.city;
        },
        accountManager() {
          return this.itemDetails.accountManager;
        },
        groupId() {
          return this.itemDetails.groupId;
        },
    },
    async created() {
        await this.loadSalesList();
        await this.loadGroupData();
        this.loading = false;
    },
    mounted() {
        this.itemDetails = JSON.parse(JSON.stringify(this.getUserDetails));
    },
    methods: {
        ...mapActions([
            'setUserDetails',
            'getSalesList',
            'getGroupOptionList',
            'updatePassword',
            'getKey',
            'saveUserInfo',
            'deleteUserInfo',
        ]),
        changeMode(key) {
          this.mode = key;
          this.message = '';
        },
        closeHandle() {
            this.hideDialog();
        },
        async loadSalesList() {
            const token = localStorage.getItem(CACHE_USER_KEY);
            // const userId = this.$route.query.id;
            const res = await this.getSalesList({token: token ? token : this.getUserInfo.token});
            if (res.data) {
                const list = res.data.data.list;
                console.log('list', list);

                this.salesList = list.filter(user => user.userId !== this.itemDetails.userId);
            } else {
                console.log(`error ${JSON.stringify(res.data)}`);
            }
        },
        async loadGroupData() {
            const token = localStorage.getItem(CACHE_USER_KEY);
            const res = await this.getGroupOptionList({
                token: this.getUserInfo ? this.getUserInfo.token : token,
            });
            if (res) {
                const results = res.data;
                this.groupOptions = results.data.list;
                this.groupOptions.unshift({groupId: '', name: 'None'});
                console.log(`groupOptions results ${JSON.stringify(this.groupOptions)}`);
            }
        },
        async savePassword() {
          const success = await this.$validate();
          if (!success) {
            this.message = 'Please fill in all fields';
            return;
          }

          this.updateLoading = true;
          const keyResponse = await this.getKey();
          const keyResult = keyResponse.data;
          if (keyResult && keyResult.statusCode === 0) {
            const rsaKey = keyResult.data.publicKey;
            // this.passwordInfo.password = RSAEncrypted(rsaKey, this.passwordInfo.password.trim());
            // this.passwordInfo.confirmPassword = this.passwordInfo.password;
            const oldPassword = RSAEncrypted(rsaKey, this.passwordInfo.oldPassword.trim());
            console.log(`oldPassword == ${oldPassword}`);
            const password = RSAEncrypted(rsaKey, this.passwordInfo.password.trim());
            const res = await this.updatePassword({
              token: this.getUserInfo.token
              , info: {
                userId: this.itemDetails.userId,
                oldPassword: oldPassword,
                password: password,
              }
            });
            this.updateLoading = false;
            const result = res.data;
            if (result.statusCode === 0) {
              this.passwordInfo.oldPassword = '';
              this.passwordInfo.password = '';
              this.passwordInfo.confirmPassword = '';
              this.validation.reset();
              this.message = 'Change Success';
              setTimeout(()=>{
                this.message = '';
                this.mode = '0';
              }, 1000);
            } else {
              this.message = result.message ? result.message : 'Update Error';
            }
          } else {
            this.updateLoading = false;
            this.message = keyResult.data ? keyResult.data.message : 'Update Error';
          }
        },
        async saveEvent(item) {
          const success = await this.$validate();
          console.log(`item, success == ${JSON.stringify(item)} , ${success}`);
          Object.assign(item, {
            check: success
          })

          if (!item.check) {
            this.message = 'Please fill in all fields';
            return;
          }
          this.saveUser();
        },
        async saveUser() {
          this.saveLoading = true;
          const response = await this.saveUserInfo({
            token: this.getUserInfo.token,
            info: this.itemDetails
          });
          const result = response.data;
          this.saveLoading = false;
          if (result && result.statusCode === 0) {
            this.message = 'User information updated successfully';
            console.log(`save ${result.message}`);
            setTimeout(() => {
              this.message = '';
              this.dialogInfo.confirmEvent();
              this.closeHandle();
            }, 1000);
          } else {
            this.message = result.message ? result.message : 'Save Error';
          }
        },
        deleteUser(){
          console.log(`deleteUser`);
          this.showAlert({
            content: 'Are you sure delete this user?',
            confirmEvent: async () => {
              console.log(`confirmEvent user`);
              this.hideAlert();
              const token = localStorage.getItem(CACHE_USER_KEY);
              const res = await this.deleteUserInfo({token, info:{userId: this.getUserDetails.userId}});
              const result = res.data;
              console.log(`res == ${JSON.stringify(res)}`);
              this.closeHandle();
              if (result && result.statusCode === 0) {
                Notification.notifyObservers('delete_user');
              } else {
                this.message = result ? result.message : 'Delete User Error';
                console.log(`error ${JSON.stringify(res)}`);
              }
            }
          });
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
