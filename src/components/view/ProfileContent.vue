<template>
  <div>
    <!--Change Password-->
    <div class="usersPswDiv" v-if="getMode === '1'">
      <div class="rowLeft">
<!--        <div class="rowDiv">-->
<!--          <div class="tit">Old Password</div>-->
<!--          <div class="con">-->
<!--            <input type="password" class="textInput" v-model="passwordInfo.oldPassword">-->
<!--          </div>-->
<!--          <div class="clear"></div>-->
<!--        </div>-->
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
      <div class="rowDiv">
        <a href="#"
           @click.prevent="savePassword" class="redBtn">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="updateLoading" :value="20"></v-progress-circular>
          <span v-else>Submit</span>
        </a>
        <a href="#" class="grayBtn" style="margin-left: 5px;"
           @click.prevent="changeMode('0')">
          Back
        </a>
      </div>
    </div><!--usersAddDiv-->
    <!--Profile-->
    <div class="usersDetailDiv" v-if="getMode === '0'">
      <!-- <form class="v-form"> -->
      <div class="rowDiv" v-if="isEdit">
        <!--                    <div class="photo" style="">-->
        <!--                        <img v-if="userProfile.profileURL"-->
        <!--                             :src="userProfile.profileURL"-->
        <!--                             class="photoImg-lg"-->
        <!--                             width="127"-->
        <!--                             height="127">-->
        <!--                        <img v-else :src="defaultPhoto" width="127" height="127">-->
        <!--                    </div>-->
        <div class="function" style="margin-left: 0; margin-bottom: 10px;">
          <div class="name">{{ `${userProfile.firstName} ${userProfile.lastName}` }}</div>
          <a href="#" class="blueBtn" @click.prevent="changeMode('1')">Change Password</a>
          <a href="#" class="delete2Btn" style="display:inline; padding:8px 20px;" v-if="canDelete"
             @click.prevent="deleteUser"> </a>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowLeft">
        <!--                    <div class="rowDiv">-->
        <!--                        <div class="tit"><span class="red&#45;&#45;text">*</span>Account</div>-->
        <!--                        <div class="con">-->
        <!--                            <input type="text" v-model="userProfile.account" class="textInput" :disabled="isEdit">-->
        <!--                        </div>-->
        <!--                        <div class="clear"></div>-->
        <!--                    </div>-->
        <div class="rowDiv">
          <div class="tit"><span class="red--text">*</span>Email</div>
          <div class="con">
            <input type="text" v-model="userProfile.email" class="textInput" :disabled="isEdit">
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit"><span class="red--text">*</span>First Name</div>
          <div class="con">
            <input type="text" v-model="userProfile.firstName" class="textInput">
            <span class="msg" v-if="validation.hasError('firstName')">
                                {{ validation.firstError('firstName') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit"><span class="red--text">*</span>Last Name</div>
          <div class="con">
            <input type="text" v-model="userProfile.lastName" class="textInput">
            <span class="msg" v-if="validation.hasError('lastName')">
                                {{ validation.firstError('lastName') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit"><span class="red--text">*</span>Phone Number</div>
          <div class="con">
            <input type="text" v-model="userProfile.cellphone" class="textInput">
            <span class="msg" v-if="validation.hasError('cellphone')">
                                {{ validation.firstError('cellphone') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">Company Name</div>
          <div class="con">
            <input type="text" v-model="userProfile.company" class="textInput">
            <span class="msg" v-if="validation.hasError('company')">
                                {{ validation.firstError('company') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">EpicId</div>
          <div class="con">
            <input type="text" v-model="userProfile.epicId" class="textInput">
          </div>
          <div class="clear"></div>
        </div>
      </div><!--rowLeft-->
      <div class="rowRight">
        <div class="rowDiv" v-if="!isEdit">
          <div class="tit"><span class="red--text">*</span>Default Password</div>
          <div class="con">
            <input type="password" v-model="userProfile.defaultPassword" class="textInput">
            <span class="msg" v-if="validation.hasError('defaultPassword')">{{ validation.firstError('defaultPassword') }}</span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="!isEdit">
          <div class="tit"><span class="red--text">*</span>Confirm Password</div>
          <div class="con">
            <input type="password" v-model="userProfile.checkPassword" class="textInput">
            <span class="msg" v-if="validation.hasError('checkPassword')">{{ validation.firstError('checkPassword') }}</span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">Country</div>
          <div class="con">
            <select class="select" v-model="userProfile.country">
              <option v-for="option in getCountryList" :key="option.name"
                      :value="option.name">{{ option.name }}
              </option>
            </select>
            <!-- <span class="msg" v-if="validation.hasError('country')">
                {{validation.firstError('country')}}
            </span> -->
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">City</div>
          <div class="con">
            <input type="text" v-model="userProfile.city" class="textInput">
            <!-- <span class="msg" v-if="validation.hasError('city')">
                {{validation.firstError('city')}}
            </span> -->
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit"><span class="red--text">*</span>Role</div>
          <select class="select" v-model="userProfile.role">
            <option v-for="option in userRoleList" :key="option.key"
                    :value="option.key">{{ option.text }}
            </option>
          </select>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Status</div>
          <select class="select" v-model="userProfile.status">
            <option v-for="option in userStatusList" :key="option.key"
                    :value="option.key">{{ option.text }}
            </option>
          </select>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit"><span class="red--text">*</span>Account Manager</div>
          <select class="select" v-model="userProfile.accountManager">
            <option v-for="option in salesList" :key="option.userId"
                    :value="option.userId">{{ option.firstName }} {{ option.lastName }}
            </option>
          </select>
          <span class="msg" v-if="validation.hasError('accountManager')">
                            {{ validation.firstError('accountManager') }}
                        </span>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Group</div>
          <select class="select" v-model="userProfile.groupId">
            <option v-for="option in groupOptions" :key="option.groupId"
                    :value="option.groupId">{{ option.name }}
            </option>
          </select>
          <!--                        <span class="msg" v-if="validation.hasError('groupId')">-->
          <!--                            {{validation.firstError('groupId')}}-->
          <!--                        </span>-->
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
      <div class="rowDiv mt-2">
        <a href="#" class="redBtn" @click.prevent="saveEvent">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="saveLoading" :value="20"></v-progress-circular>
          <span v-else>Save</span>
        </a>
        <a href="#" class="grayBtn" style="margin-left: 10px;"
           @click.prevent="cancelEvent"><span data-v-483fc058="">Back</span></a>
      </div>
      <!-- </form> -->
    </div>
    <!--profile-->
  </div>
</template>

<script>
import countries from "../../assets/json/countries";
import SimpleVueValidator from 'simple-vue-validator';
import {mapActions, mapGetters} from "vuex";
import {RSAEncrypted} from "../../utils/tools";
import {CACHE_USER_KEY, ROLE_ID} from "@/utils/Constant";
import * as Tools from "@U/tools";

const Validator = SimpleVueValidator.Validator;
export default {
  name: "ProfileContent",
  props: {
    userProfile: Object,
    saveLoading: Boolean,
    uploading: Boolean,
    errorMessage: String,
    files: Object,
    uploadFieldName: String,
    isEdit: Boolean,
  },
  data() {
    return {
      valid: false,
      updateLoading: false,
      mode: '0',
      passwordInfo: {
        oldPassword: '',
        password: '',
        confirmPassword: '',
      },
      message: '',
      defaultPhoto: require('../../assets/images/user-photo-lg.jpg'),
      salesList: [],
      groupOptions: [],
    }
  },
  created() {
    // console.log(`edit role ${this.userProfile.role}`);
    // console.log(`roles ${JSON.stringify(this.userRoleList)}`)
    this.loadSalesList();
    this.loadRoleData();
    this.loadGroupData();
    console.log('== Profile ===')
  },
  validators: {
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
    email: function (value) {
      if (this.getMode === '0' || this.getMode === '2') {
        return Validator.value(value).required('email is required.').email('That doesn\'t look like a valid email address.');
      }
      return Validator.value(value);
    },
    firstName: function (value) {
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
      if (this.userProfile.role === ROLE_ID.CUSTOMER_ROLE_ID) {
        return Validator.value(value).required('Account Manager is required.');
      }
      return Validator.value(true).match(true);
    },
    'defaultPassword, checkPassword': function (defaultPassword, checkPassword) {
      if (this.getMode === '0' && defaultPassword && defaultPassword.length > 0 && !this.isEdit) {
        return Validator.value(defaultPassword).required('defaultPassword is required.').match(checkPassword);
      }
      return Validator.value(defaultPassword);
    },
  },
  computed: {
    ...mapGetters(['getUserInfo', 'getMenuList', 'getRoleList']),
    canDelete(){
      return this.userProfile.userId !== this.getUserInfo.userId
          && this.getUserInfo.role !== ROLE_ID.CUSTOMER_ROLE_ID && this.showEdit;
    },
    getCurrentPermission(){
      return Tools.getUserPermission('Users');
    },
    showEdit(){
      if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
        return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
      }
      return false;
    },
    getCountryList() {
      return countries;
    },
    password() {
      return this.passwordInfo.password;
    },
    confirmPassword() {
      return this.passwordInfo.confirmPassword;
    },
    email() {
      return this.userProfile.email;
    },
    firstName() {
      return this.userProfile.firstName;
    },
    lastName() {
      return this.userProfile.lastName;
    },
    nickname() {
      return this.userProfile.nickname;
    },
    cellphone() {
      return this.userProfile.cellphone;
    },
    company() {
      return this.userProfile.company;
    },
    country() {
      return this.userProfile.country;
    },
    city() {
      return this.userProfile.city;
    },
    accountManager() {
      return this.userProfile.accountManager;
    },
    groupId() {
      return this.userProfile.groupId;
    },
    isCustomerByUserProfile() {
      return this.userProfile.role === ROLE_ID.CUSTOMER_ROLE_ID;
    },
    defaultPassword() {
      return this.userProfile.defaultPassword;
    },
    checkPassword() {
      return this.userProfile.checkPassword;
    },
    userStatusList() {
      return [
        {key: 0, text: 'Registered'},
        {key: 1, text: 'Pending'},
        {key: 2, text: 'Approved'},
        // { key: -1, text: 'Disabled'},
      ];
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
    getPasswordOptions() {
      return [
        {
          key: 'password', text: 'Password', type: 'password'
          , error: false, errorMessages: []
        },
        {
          key: 'confirmPassword', text: 'Confirm Password', type: 'password'
          , error: false, errorMessages: []
        },
      ]
    },
    getMode() {
      return this.mode;
    },
  },
  methods: {
    ...mapActions(['updatePassword', 'getKey', 'loadRoleList', 'getSalesList', 'getGroupOptionList'
      , 'showAlert', 'hideAlert', 'deleteUserInfo']),
    async loadRoleData() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      await this.loadRoleList({
        token: token ? token : this.getUserInfo.token,
        query: {searchValue: ''}
      });
    },
    async loadSalesList() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      // const userId = this.$route.query.id;
      const res = await this.getSalesList({token: token ? token : this.getUserInfo.token});
      if (res.data) {
        const list = res.data.data.list;
        this.salesList = list.filter(user => user.userId !== this.userProfile.userId);
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
    async saveEvent() {
      const success = await this.$validate();
      console.log(`success == ${success}`);
      this.userProfile.account = this.userProfile.email;
      this.$emit('saveEvent', {
        check: success,
        user: this.userProfile,
        isEdit: this.isEdit,
      });
    },
    changeMode(key) {
      this.mode = key;
      this.message = '';
      this.$emit('changeMode', key);
    },
    handleFilesUpload() {
      this.$emit('handleFilesUpload');
    },
    cancelEvent() {
      this.$emit('cancelEvent');
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
            userId: this.userProfile.userId,
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
              this.$router.back();
          }, 1000);
        } else {
          this.message = result.message ? result.message : 'Update Error';
        }
      } else {
        this.updateLoading = false;
        this.message = keyResult.data ? keyResult.data.message : 'Update Error';
      }
    },
    deleteUser() {
      console.log(`deleteUser`);
      this.showAlert({
        content: 'Are you sure delete this user?',
        confirmEvent: async () => {
          console.log(`confirmEvent user`);
          const token = localStorage.getItem(CACHE_USER_KEY);
          const res = await this.deleteUserInfo({token, info:{userId: this.userProfile.userId}});
          const result = res.data;
          console.log(`res == ${JSON.stringify(res)}`);
          if (result && result.statusCode === 0) {
            this.$emit('cancelEvent');
          } else {
            this.message = result ? result.message : 'Delete User Error';
            console.log(`error ${JSON.stringify(res)}`);
          }
          this.hideAlert();
        }
      });
    }
  }
}
</script>


<style scoped src="../../assets/css/all-admin.css"></style>
