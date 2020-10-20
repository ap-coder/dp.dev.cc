<template>
  <div class="usersDiv">
    <ul class="userUl">
      <li @click="tabName = Files"><a :class="{ 'now': tabName === Files }">Files</a></li>
      <li @click="tabName = Contracts"><a :class="{ 'now': tabName === Contracts }">Contracts</a></li>
      <div class="clear"></div>
    </ul>
    <components :is="tabName" />
  </div><!--usersDiv-->
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@M/common';
import {ROLE_ID} from "@U/Constant";
import Notification from "@U/notice_manager";

export default {
  mixins: [common],
  components: {
    Files: () => import(/* webpackChunkName: 'Users' */ './Files'),
    Contracts: () => import(/* webpackChunkName: 'Group' */ './Contracts')
  },
  data() {
    return {
      Files: 'Files',
      Contracts: 'Contracts'
    }
  },
  created() {
    Notification.addObserver('checkContractStatus',()=>{
      console.log(`checkContractStatus ${this.isCustomer} ${this.getContractAccept}`);
      if (this.isCustomer && this.getContractAccept > 0) {
        this.showAlert({
          content: 'Please Accept All Contracts.',
          showCancel: false,
          confirmEvent: () => {
            this.hideAlert();
            this.tabName = 'Contracts';
          },
          cancelEvent: ()=>{
            this.hideAlert();
            this.tabName = 'Contracts';
          }
        });
      }
    });
  },
  computed: {
    ...mapGetters(['getContractAccept']),
    tabName: {
      set(val) {
        this.$router.replace({ path: 'files', query: { tab: val } });
      },
      get() {
        return this.$route.query.tab || this.Files;
      }
    },
    isCustomer(){
      return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
    }
  }
}
</script>
<style scoped src="../../assets/css/all-admin.css">

</style>
