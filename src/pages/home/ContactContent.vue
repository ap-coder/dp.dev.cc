<template>
  <div>
    <div class="title">
      <h1>Contact Sales</h1>
      <div class="bread">
        <span class="icon"></span>
        <router-link to="/index">Index</router-link>
        <span class="dot"></span>
        <router-link to="/contact">Contact Sales</router-link>
      </div>
    </div><!--end of title-->
    <div class="contactSales">
      <div class="ad">
        <router-link to="/register" class="redBtn">Sign In to Start Trial</router-link>
        <img src="../../assets/images/contact/ad-contact-lg.jpg" class="img-lg">
        <img src="../../assets/images/contact/ad-contact-md.jpg" class="img-md">
        <img src="../../assets/images/contact/ad-contact-xs.jpg" class="img-xs">
      </div><!--end of ad-->
      <div class="form" v-if="saveSuccess === false">
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>First Name
          </div>
          <div class="con">
            <input type="text" v-model="itemDetail.firstName" class="textInput name">
            <span class="msg" v-if="validation.hasError('firstName')">
                                {{ validation.firstError('firstName') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Last Name
          </div>
          <div class="con">
            <input type="text" v-model="itemDetail.lastName" class="textInput name">
            <span class="msg" v-if="validation.hasError('lastName')">
                                {{ validation.firstError('lastName') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Company Name
          </div>
          <div class="con">
            <input type="text" v-model="itemDetail.company" class="textInput">
            <span class="msg" v-if="validation.hasError('company')">
                                {{ validation.firstError('company') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Email
          </div>
          <div class="con">
            <input type="text" v-model="itemDetail.email" class="textInput">
            <span class="msg" v-if="validation.hasError('email')">
                                {{ validation.firstError('email') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Country
          </div>
          <div class="con">
            <select class="select" v-model="itemDetail.country">
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
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Phone Number
          </div>
          <div class="con">
            <input type="text" v-model="itemDetail.cellphone" class="textInput">
            <span class="msg" v-if="validation.hasError('cellphone')">
                                {{ validation.firstError('cellphone') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="rowDiv">
          <div class="tit">
            <span class="red--text">*</span>Question
          </div>
          <div class="con">
            <textarea class="textarea" v-model="itemDetail.content"></textarea>
            <span class="msg" v-if="validation.hasError('content')">
                                {{ validation.firstError('content') }}
                            </span>
          </div>
          <div class="clear"></div>
        </div>
        <div class="checkBox">
          <input type="checkbox" v-model="checkBox" id="c2" name="cc" @change="recaptcha"/>
          <label for="c2">
            <span class="labelGray"></span>
            <span class="labelRed"></span>
            <span class="red--text">*</span>I'm not a robot<br/>
          </label>
          <span v-if="validation.hasError('recaptchaToken')"
                class="msg">{{ validation.firstError('recaptchaToken') }}</span>
          <div class="clear"></div>
        </div>
        <div class="rowDiv mt-2" v-if="message !==''">
          <span class="msg">{{ message }}</span>
          <div class="clear"></div>
        </div>
        <div class="rowDiv  mt-2">
          <a href="#" class="redBtn" @click.prevent="save">
            <v-progress-circular color="#ffffff" indeterminate :size="28"
                                 :width="2"
                                 v-if="loading" :value="20"></v-progress-circular>
            <span v-else>Submit</span>
          </a>
        </div>
      </div><!--end of form-->

      <div class="form" v-if="saveSuccess === true">
        <div class="rowDiv mt-2">
          <span>{{message}}</span>
          <div class="clear"></div>
        </div>
        <div class="rowBtn mt-2" v-if="message !==''">
          <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
        </div>
      </div>


      <div class="clear"></div>
    </div><!--end of contactSales-->
    <div id="footer">

    </div><!--end of footer-->
  </div><!--end of content-->
</template>

<script>
import countries from "@/assets/json/countries.json";
import SimpleVueValidator from 'simple-vue-validator';
import {mapActions} from 'vuex';

const Validator = SimpleVueValidator.Validator;
export default {
  name: "ContactContent",
  data() {
    return {
      loading: false,
      checkBox: false,
      message: '',
      itemDetail: {},
      defaultItem: {
        email: '',
        firstName: '',
        lastName: '',
        cellphone: '',
        company: '',
        country: '',
        recaptchaToken: '',
        content: '',
      },
      saveSuccess: false,
    }
  },
  created() {
    // eslint-disable-next-line no-undef
    $(window).scrollTop(0);

    this.itemDetail = Object.assign({}, this.defaultItem);
  },
  validators: {
    email: function (value) {
      this.message = '';
      return Validator.value(value).required('email is required.').email('That doesn\'t look like a valid email address.');
    },
    firstName: function (value) {
      this.message = '';
      return Validator.value(value).required('First Name is required.');
    },
    lastName: function (value) {
      this.message = '';
      return Validator.value(value).required('Last Name is required.');
    },
    cellphone: function (value) {
      this.message = '';
      return Validator.value(value).required('Phone number is required.');
    },
    country: function (value) {
      this.message = '';
      return Validator.value(value).required('Country is required.');
    },
    company: function (value) {
      this.message = '';
      return Validator.value(value).required('Company Name is required.');
    },
    recaptchaToken: function (value) {
      this.message = '';
      return Validator.value(value).required('please check this checkbox.');
    },
    content: function (value) {
      this.message = '';
      return Validator.value(value).required('Content is required.');
    },

  },
  computed: {
    getCountryList() {
      return countries;
    },
    email() {
      return this.itemDetail.email;
    },
    firstName() {
      return this.itemDetail.firstName;
    },
    lastName() {
      return this.itemDetail.lastName;
    },
    cellphone() {
      return this.itemDetail.cellphone;
    },
    company() {
      return this.itemDetail.company;
    },
    country() {
      return this.itemDetail.country;
    },
    recaptchaToken() {
      return this.itemDetail.recaptchaToken;
    },
    content() {
      return this.itemDetail.content;
    },
  },
  methods:{
    ...mapActions(['submitNewContact']),
    async recaptcha(){
      console.log(`== recaptcha start==`);
      // (optional) Wait until recaptcha has been loaded.
      if (this.checkBox === true) {
        await this.$recaptchaLoaded();

        // Execute reCAPTCHA with action "login".
        this.itemDetail.recaptchaToken = await this.$recaptcha('login');
        console.log(`recaptcha == ${this.itemDetail.recaptchaToken}`);
      } else {
        this.itemDetail.recaptchaToken = '';
      }
    },
    async save(){

      const success = await this.$validate();
      console.log(`success == ${success} / ${JSON.stringify(this.itemDetail)}`);
      if (!success){
        this.message = 'Please fill in all fields';
        return;
      }

      this.loading = true;
      const res = await this.submitNewContact({info: this.itemDetail});
      const result = res.data;
      console.log(JSON.stringify(result));
      this.loading = false;
      if (result && result.statusCode === 0){
        this.checkBox = false;
        this.toTop();

        this.saveSuccess = true;
        this.$set(this, 'saveSuccess' , true);
        this.message = 'Thank you for contacting us, we will reach out to you as soon as possible.';
      } else {
        this.checkBox = false;
        this.saveSuccess = false;
        this.message = result ? result.message: 'Save Fail';
      }
    },
    toTop(){
      // eslint-disable-next-line no-undef
      $('html,body').animate({scrollTop: '0px'}, 800);
    },
    cancel(){
      this.itemDetail = Object.assign({}, this.defaultItem);
      this.validation.reset();
      this.saveSuccess = false;
      this.message = '';
    }
  }
}
</script>

<style scoped src="../../assets/css/all.css">

</style>

