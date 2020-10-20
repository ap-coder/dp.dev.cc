<script>
import { mapGetters, mapActions } from 'vuex';
import { FILE_TYPE, USER_STATUS, DELIVERY_FILE_TYPE, ROLE_ID } from '@/utils/Constant';
import {formatDate} from "@U/tools";
import * as Tools from "@U/tools";
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);
export default {
    data() {
        return {
        }
    },
    computed: {
        ...mapGetters([
            'getUserInfo',
            'getRoleList',
            'dialogInfo'
        ]),
        isMobile: ()=> md.phone(),
        fileTypes: () => FILE_TYPE,
        userStatus: () => USER_STATUS,
        deliveryFileTypes: () => DELIVERY_FILE_TYPE,
        currentPath() {
            return this.$route.fullPath;
        },
        isCustomer() {
          if (this.getUserInfo){
            return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
          }
          return false;
        },
        isSales(){
            return this.getUserInfo.role === ROLE_ID.SALES_ROLE_ID;
        },
        isAdmin(){
          return this.getUserInfo.role === ROLE_ID.ADMIN_ROLE_ID;
        },
        getUserPermission() {
          return Tools.getUserPermission('Users');
        },
        canEditUser() {
          if (this.getUserPermission && this.getUserPermission.subItems.length) {
            return this.getUserPermission.subItems.find(feature => feature.featureId === 1).enable === true;
          }
          return false;
        },
        getFilePermission() {
          return Tools.getUserPermission('Files');
        },
        canEditFile() {
          if (this.getFilePermission && this.getFilePermission.subItems.length) {
            const canEditFile = this.getFilePermission.subItems.find(feature => feature.featureId === 1).enable === true;
            console.log(`canEditFile ${canEditFile}`);
            return canEditFile;
          }
          return false;
        },
        getGroupPermission() {
          return Tools.getUserPermission('Groups & Permissions');
        },
        canEditGroup() {
          if (this.getGroupPermission && this.getGroupPermission.subItems.length) {
            const canEditFile = this.getGroupPermission.subItems.find(feature => feature.featureId === 1).enable === true;
            console.log(`canEditGroup ${canEditFile}`);
            return canEditFile;
          }
          return false;
        },
    },
    methods: {
        ...mapActions([
            'showAlert',
            'hideAlert',
            'showDialog',
            'hideDialog'
        ]),
        formatDateText(text){
          return formatDate(new Date(text));
        },
        toTop(){
          // eslint-disable-next-line no-undef
          $('html,body').animate({scrollTop: '0px'}, 800);
        },
    }
}
</script>
