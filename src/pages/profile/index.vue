<template>
  <div class="profileDiv">
    <form class="v-form">
      <div class="rowDiv">
        <div class="function" style="margin-left: 0; margin-bottom: 10px;">
          <div class="name">Hi, {{  `${getUserInfo.firstName} ${getUserInfo.lastName}` }}</div>
          <a class="blueBtn" @click="changePassword">Change Password</a>
        </div>
        <div class="clear"></div>
      </div>
      <div class="rowLeft">
<!--        <div class="rowDiv">-->
<!--          <div class="tit">Account</div>-->
<!--          <div class="con">-->
<!--            <input type="text" class="textInput" v-model="userProfile.account" disabled="disabled">-->
<!--          </div>-->
<!--          <div class="clear"></div>-->
<!--        </div>-->
        <div class="rowDiv">
          <div class="tit">Email</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.email" disabled="disabled">
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">First Name</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.firstName">
            <span class="msg" v-if="validation.hasError('firstName')">
                            {{ validation.firstError('firstName') }}
                        </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Last Name</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.lastName">
            <span class="msg" v-if="validation.hasError('lastName')">
                            {{ validation.firstError('lastName') }}
                        </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">Phone Number</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.cellphone">
            <span class="msg" v-if="validation.hasError('cellphone')">
                        {{ validation.firstError('cellphone') }}
                    </span>
          </div>
          <div class="clear"></div>
        </div>
      </div><!--rowLeft-->
      <div class="rowRight">
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">Country</div>
          <div class="con">
            <select class="select" v-model="userProfile.country">
              <option v-for="option in getCountryList" :key="option.name"
                      :value="option.name">{{ option.name }}
              </option>
            </select>
            <span class="msg" v-if="validation.hasError('country')">
                        {{ validation.firstError('country') }}
                    </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">Company Name</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.company">
            <span class="msg" v-if="validation.hasError('company')">
                        {{ validation.firstError('company') }}
                    </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">City</div>
          <div class="con">
            <input type="text" class="textInput" v-model="userProfile.city">
            <span class="msg" v-if="validation.hasError('city')">
                        {{ validation.firstError('city') }}
                    </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv" v-if="isCustomerByUserProfile">
          <div class="tit">Account Manager</div>
          <div class="con">
            <input type="text" class="textInput" v-model="accountManager" :disabled="true">
          </div>
          <div class="clear"></div>
        </div>
      </div><!--rowRight-->
      <div class="clear"></div>
      <div class="rowDiv" v-if="errorMessage !== ''">
        <span class="msg">{{ errorMessage }}</span>
      </div>
      <div class="rowDiv mt-2">
        <a href="#" class="redBtn" @click.prevent="saveProfile">
          <v-progress-circular color="#ffffff" indeterminate :size="28"
                               :width="2"
                               v-if="loading" :value="20"></v-progress-circular>
          <span v-else>Save</span>
        </a>
        <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
      </div>
    </form>
  </div><!--usersAddDiv-->
</template>

<script>
import {mapActions} from 'vuex';
import common from '@M/common';
import countries from '../../assets/json/countries';
import SimpleVueValidator from 'simple-vue-validator';

const Validator = SimpleVueValidator.Validator;
import {CACHE_USER_KEY, ROLE_ID} from "@U/Constant";

export default {
  name: 'Profile',
  mixins: [common],
  data() {
    return {
      defaultPhoto: require('../../assets/images/user-photo-lg.jpg'),
      userProfile: {
        userId: '',
        account: '',
        email: '',
        nickname: '',
        displayName: '',
        firstName: '',
        lastName: '',
        cellphone: '',
        company: '',
        country: '',
        city: '',
      },
      salesList:[],
      accountManager:'None',
      errorMessage: '',
      loading: false,
    }
  },
  computed: {
    getCountryList() {
      return countries;
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
    isCustomerByUserProfile() {
      return this.userProfile.role === ROLE_ID.CUSTOMER_ROLE_ID;
    },
  },
  validators: {
    email: function (value) {

      if (this.getMode === '0' || this.getMode === '2') {
        return Validator.value(value).required('email is required.').email('That doesn\'t look like a valid email address.');
      }
      return Validator.value(value);
    },
    firstName: function (value) {
      // if (this.getMode === '0'){
      // }
      return Validator.value(value).required('First Name is required.');
      // return Validator.value(value);
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
      if (this.isCustomerByUserProfile){
        return Validator.value(value).required('Country is required.');
      }
      return Validator.value(true).match(true);
    },
    city: function (value) {
      this.errorMessage = '';
      if (this.isCustomerByUserProfile){
        return Validator.value(value).required('City is required.');
      }
      return Validator.value(true).match(true);
    },
  },
  created() {
    if (this.getUserInfo.userId) {
      this.configUser(this.getUserInfo);
      this.profileURL = this.getUserInfo.profileURL;
    }
    this.loadSalesList();
  },
  methods: {
    ...mapActions([
      'updateProfile',
      'fetchUserInfo',
      'configUserInfo',
      'showAlert',
      'hideAlert',
       'getSalesList',
    ]),
    async loadSalesList() {
      const token = localStorage.getItem(CACHE_USER_KEY);
      // const userId = this.$route.query.id;
      const res = await this.getSalesList({token: token ? token : this.getUserInfo.token});
      if (res.data) {
        const list = res.data.data.list;
        this.salesList = list.filter(user => user.userId !== this.userProfile.userId);
        const find = this.salesList.find(p=>p.userId === this.userProfile.accountManager);
        if (find){
          this.accountManager = `${find.firstName} ${find.lastName}`;
        } else {
          this.accountManager = `None`;
        }
      } else {
        console.log(`error ${JSON.stringify(res.data)}`);
      }
    },
    configUser(userInfo) {
      console.log(`configUser ${JSON.stringify(userInfo)}`);
      this.userProfile.userId = userInfo.userId;
      this.userProfile.account = userInfo.account;
      this.userProfile.email = userInfo.email;
      this.userProfile.firstName = userInfo.firstName;
      this.userProfile.lastName = userInfo.lastName;
      this.userProfile.company = userInfo.company ? userInfo.company : '';
      this.userProfile.cellphone = userInfo.cellphone ? userInfo.cellphone : '';
      this.userProfile.country = userInfo.country ? userInfo.country : '';
      this.userProfile.city = userInfo.city ? userInfo.city : '';
      this.userProfile.nickname = userInfo.nickname ? userInfo.nickname : '';
      this.userProfile.displayName = userInfo.displayName ? userInfo.displayName : '';
      this.userProfile.role = userInfo.role ? userInfo.role : '';
      this.userProfile.accountManager = userInfo.accountManager ? userInfo.accountManager : '';
    },
    async saveProfile() {
      const success = await this.$validate();
      console.log(`success == ${success}`);
      if (!success) {
        this.errorMessage = 'Please fill in all fields';
        return;
      }

      this.loading = true;
      const result = await this.updateProfile({
        token: this.getUserInfo.token,
        info: this.userProfile,
      });
      this.loading = false;
      if (result.data) {
        const token = localStorage.getItem(CACHE_USER_KEY);
        const res = await this.fetchUserInfo({token});
        const userInfo = res.data.data;
        userInfo.token = token;

        this.configUserInfo(userInfo);
        this.errorMessage = 'User information updated successfully';

        setTimeout(() => {
          this.errorMessage = '';
        }, 1500);
      } else {
        this.errorMessage = 'Server Error';
      }
    },
    changePassword() {
      console.log('changePassword');
      this.$router.push({path: 'changePassword'});
    },
    cancel() {
      this.$router.back();
    },
  }
}

</script>

<style scoped src="../../assets/css/all-admin.css"></style>
