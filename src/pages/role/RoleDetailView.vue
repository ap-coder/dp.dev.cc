<template>
    <div class="permissionsEditDiv">
        <div class="rowRole">
            <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
            <div v-for="item in dialogKeys" :key="item.key">
                <div class="tit">{{item.text}}</div>
                <div class="con">
                    <input type="text" class="textInput" v-model="itemDetail[item.key]" disabled>
                </div>
            </div>
        </div><!--rowRole-->
        <div class="rowPer">
            <div class="perBox"
                 v-for="item in itemDetail.permissions"
                 :key="item.menuItem">
              <h4><span :class="`icon ${getRoleIconClass(item)}`"></span>{{ item.name }}</h4>
              <div class="perCon">
                <p>
                  <div class="checkBox">
                    <input type="checkbox" :id="`Dashboard-Enable-${item.menuItem}`"
                           name="Dashboard" :key="item.menuItem" v-model="item.enable"/>
                    <label :for="`Dashboard-Enable-${item.menuItem}`">
                      <span class="labelGray"></span>
                      <span class="labelRed"></span>
                      Read
                    </label>
                  </div>
                <p>
                  <div class="checkBox">
                    <input type="checkbox" :id="`Dashboard-Modify-${item.subItems[0].menuItem}_${item.subItems[0].featureId}}`"
                           name="Dashboard"
                           :key="`${item.subItems[0].menuItem}_${item.subItems[0].featureId}}`"
                           v-model="item.subItems[0].enable"/>
                    <label :for="`Dashboard-Modify-${item.subItems[0].menuItem}_${item.subItems[0].featureId}}`">
                      <span class="labelGray"></span>
                      <span class="labelRed"></span>
                      Write
                    </label>
                  </div>
              </div><!--perCon-->
            </div><!--perBox-->
        </div><!--rowPer-->
        <div class="clear"></div>
        <div class="rowDiv ml-2" v-if="message !==''">
            <span class="red--text">{{message}}</span>
            <div class="clear"></div>
        </div>
        <div class="clear"></div>
        <div class="rowBtn">
            <a href="#" class="redBtn" @click.prevent="saveEvent">
                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                     :width="2"
                                     v-if="saveLoading" :value="20"></v-progress-circular>
                <span v-else>Save</span>
            </a>
            <a href="#" class="grayBtn" @click.prevent="cancelEvent">Back</a>
        </div>
    </div><!--usersAddDiv-->
</template>

<script>
import { mapActions, mapGetters } from 'vuex';
import Notification from "@/utils/notice_manager";
import * as Constants from '../../utils/Constant';
export default {
    name: "GroupDetailView",
    data() {
        return {
            valid: false,
            itemDetail: {
                permissions: [],
            },
            defaultItem: {
                roleId: '',
                name: '',
                author:'',
                authorName:'',
                permissions: [],
            },
            lazy: false,
            isEdit: true,
            saveLoading: false,
            message: '',
            errorMessage: '',
            loading: true
        }
    },
    async created() {
        const roleId = this.$route.query.id;
        const token = localStorage.getItem(Constants.CACHE_USER_KEY);
        const res = await this.getRoleInfo({
                    token: token ? token : this.getUserInfo.token,
                    roleId,
                });
        this.loading = false;
        // console.log(localStorage.getItem(Constants.CACHE_USER_KEY));
        // console.log('role res:', res);

        if (res.status === 200) {
            const result = res.data;
            console.log('role result:', result);
            if (result.statusCode === 0){
                this.itemDetail.roleId = result.data.roleId;
                this.itemDetail.name = result.data.name;
                this.itemDetail.author = result.data.author;
                this.itemDetail.authorName = result.data.authorName;
                this.itemDetail.permissions = result.data.permissions;

                console.log('itemDetail:', this.itemDetail);
            }
            // const item = this.getRoleItem(roleId);
            // this.itemDetail = Object.assign({}, this.defaultItem);

            // console.log('loading:', this.loading);
            // console.log('itemDetail:', this.itemDetail);
        }
        this.loading = false;
    },
    computed: {
        ...mapGetters(['getUserInfo', 'getRoleItem', 'getMenuList', 'getRoleList']),
        dialogKeys(){
            let list = [
                { key: 'name', text: 'Role Name', sortable: true, disabled: true, required: false },
                // { key: 'authorName', text: 'Author Name', sortable: true, required: false , disabled: true},
            ];
            return list;
        },
        roleIcon() {
          return [
            { key: 'Dashboard', text: 'Dashboard', icon: 'icon-dashboard' },
            { key: 'Files', text: 'Files', icon: 'icon-files' },
            { key: 'SKUs', text: 'SKUs', icon: 'icon-sdks' },
            { key: 'Customers', text: 'Customers', icon: 'icon-customers' },
            { key: 'Documentations', text: 'Documentations', icon: 'icon-doc' },
            { key: 'Users', text: 'Users', icon: 'icon-users' },
            { key: 'Groups & Permissions', text: 'Groups & Permissions', icon: 'icon-role' },
            { key: 'Settings', text: 'Settings', icon: 'icon-setting' },
            { key: 'Contracts', text: 'Contracts', icon: 'icon-contract' },
            { key: 'Messages', text: 'Messages', icon: 'icon-message' },
            { key: 'Support', text: 'Support', icon: 'icon-support' },
          ]
        }
    },
    mounted() {},
    methods: {
        ...mapActions(['getRoleInfo', 'saveRoleInfo', 'loadRoleList']),
        getDefaultPermission(){
            let permissions = [];
            this.getMenuList.forEach(item=>{
                let menu = {
                    menuItem: item.id,
                    name: item.name,
                    subItems: [],
                };
                item.subItems.forEach(subItem=>{
                    let subMenuItem = Object.assign({} , subItem);
                    subMenuItem.featureId = subItem.id;
                    subMenuItem.enable = true;
                    menu.subItems.push(subMenuItem);
                });
                permissions.push(menu);
            });
            return permissions;
        },
        getRoleIconClass(item) {
            const roleItem = this.roleIcon.find(role => role.key === item.name);
            return roleItem && roleItem.icon;
        },
        async saveEvent() {
            this.saveLoading = true;
            const response = await this.saveRoleInfo({ token: this.getUserInfo.token,
                info: this.itemDetail });
            const result = response.data;
            this.saveLoading = false;
            if (result && result.statusCode === 0){
                this.message = result.message;
                // this.cancelEvent();
            } else {
                this.message = result ? result.message : 'Save Fail';
            }
            setTimeout(()=>{
                this.message = '';
            },1000);
        },
        cancelEvent(){
            Notification.notifyObservers('popSubPath');
            this.$router.back();
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
