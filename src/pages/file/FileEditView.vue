<template>
    <div class="deliveryEditDiv">
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="rowTop" v-show="!loading">
            <h4>{{getDeliveryFileType(itemDetail.type)}}</h4>
            <div class="con">
                <share-group-view
                        :message="shareMessage"
                        :show-radio-button="true"
                        :show-notice="true"
                        :show-save-button="false"
                        :enable-multi-select="false"
                        @save="handleShareGroup"
                        @clear="handleShareClear"></share-group-view>
            </div><!--con-->
            <template v-if="showField(itemDetail, 'displayName')">
                <div class="tit">File Name</div>
                <div class="con">
                    <input placeholder="File Name" class="textInput" v-model="itemDetail.displayName">
                </div><!--con-->
                <div class="clear"></div>
            </template>
            <template v-if="showField(itemDetail, 'customerId')">
                <div class="tit">Customer ID</div>
                <div class="con">
                <input placeholder="Customer ID" class="textInput" v-model="itemDetail.customerId">
                </div><!--con-->
                <div class="clear"></div>
            </template>
            <template v-if="showField(itemDetail, 'expiredDate')">
                <div class="tit">Expired Date</div>
                <div class="con">
                    <v-menu
                        ref="menu"
                        v-model="itemDetail.menu"
                        :nudge-right="40"
                        :return-value="itemDetail.expiredDate"
                        transition="scale-transition"
                        offset-y
                        full-width
                        min-width="290px">
                        <template v-slot:activator="{ on }">
                            <input placeholder="2020-05-28" class="textInput" v-model="itemDetail.expiredDate" v-on="on" >
                        </template>
                        <v-date-picker
                            v-model="itemDetail.expiredDate"
                            header-color="#ad1f25"
                            color="#ad1f25"
                            no-title scrollable>
                        </v-date-picker>
                    </v-menu>
                </div><!--con-->
                <div class="clear"></div>
            </template>
            <template v-if="showField(itemDetail, 'fileDescription')">
                <div class="tit">License Key</div>
                <div class="con">
                <input id="LicenseKey" placeholder="License Key" class="textInput" v-model="itemDetail.fileDescription">
                <a v-if="isCustomer" target="_self" class="blueBtn" @click="copyKey()">Copy Key</a>
                <a v-if="isCustomer" href="#" target="_self" class="redBtn" @click="verifyKey(itemDetail)">Verify</a>
                </div><!--con-->
                <div class="clear"></div>
            </template>

            <div class="rowDiv" v-if="message !==''">
                <span class="red--text">{{message}}</span>
                <div class="clear"></div>
            </div>
            <div class="clear"></div>
        </div><!--rowTop-->
        <div class="clear"></div>
        <div class="rowBtn">
            <a @click.prevent="upload" class="redBtn">
                <v-progress-circular
                        color="#ffffff"
                        indeterminate
                        :size="28"
                        :width="2"
                        v-if="saveLoading"
                        :value="20"></v-progress-circular>
                <span v-else>Save</span>
            </a>
            <a class="grayBtn" @click="cancel">Cancel</a>
        </div>
    </div><!--usersAddDiv-->
</template>

<script>
import { mapActions } from 'vuex';
import common from '@M/common';
import {CACHE_USER_KEY, ROLE_ID} from "../../utils/Constant";
import ShareGroupView from "@/components/view/ShareGroupView";

export default {
    name: "FileEditlView",
    mixins: [common],
    components:{
        ShareGroupView
    },
    data() {
        return {
            shareMessage:'',
            message:'',
            itemDetail: {
                activations: 0,
                createdDate: '',
                customerId: '',
                displayName: '',
                expiredDate: '',
                fileDescription: '',
                fileId: '',
                filePath: null,
                isDelete: false,
                name: '',
                note: null,
                originURL: '',
                owner: '',
                shareGroup: '',
                size: 0,
                subType: -1,
                type: 2,
                updatedDate: '',
                url: null,
                version: '',
                menu: false
            },
            loading: false,
            saveLoading: false,
            radioGroup: '0',
            selectGroup: '',
            fileItems:[],
        }
    },
    created(){
        this.loadData();
    },
    computed: {
        fields() {
            return {
                '-1': ['displayName','file'],
                '0': ['selectSubType'],
                '1': ['displayName', 'file'],
                '2': ['displayName', 'fileDescription', 'customerId', 'expiredDate', 'file'], //EDK
                '3': ['displayName', 'fileDescription', 'expiredDate'], // gem
                '4': ['displayName', 'fileDescription', 'expiredDate'], //so
                '6': ['displayName', 'file'],
                '7': ['displayName', 'file'],
                '8': ['displayName', 'file']
            }
        },
        isCustomer(){
            return this.getUserInfo.role === ROLE_ID.CUSTOMER_ROLE_ID;
        },
        fieldsError() {
            return {
                displayName: { error: 'File name is required' },
                file: { error: 'File too large' }
            }
        },
    },
    methods: {
        ...mapActions([
            'getFileInfo',
            'verifyFileKey',
            'uploadFile'
        ]),
        showField(item, key) {
            const { type } = item;
            return this.fields[`${type}`].indexOf(key) > -1;
        },
        async loadData(){
            this.loading = true;

            const fileId = this.dialogInfo.id;
            const token = localStorage.getItem(CACHE_USER_KEY);
            const res = await this.getFileInfo({
                token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                fileId: fileId,
            });
            const result = res.data;

            if (result && result.data){
                if (result.statusCode === 0){
                    Object.assign(this.itemDetail, result.data);
                    this.loading = false;
                    console.log(this.itemDetail);
                    this.fileItems = [];
                    this.fileItems.push(this.itemDetail);
                }
            } else {
                this.$router.back();
            }
        },
        getDeliveryFileType(key) {
            return this.deliveryFileTypes.find(item => item.key === key).text;
        },
        cancel(){
            this.hideDialog();
        },
        handleShareClear(){
            this.saveMessage = '';
        },
        handleShareGroup(user){
            console.log(`handleShareGroup == ${JSON.stringify(user)}`);
            const item = user.items[0];
            if (user.isGroup){
                this.selectGroup = item.groupId;
            } else {
                this.selectGroup = item.userId;
            }
            console.log(`shareGroup == ${this.selectGroup}`);
        },
        copyKey() {
            const el = document.querySelector('#LicenseKey');

            el.select();
            document.execCommand('copy');
            this.message = 'copied';
        },
        verifyKey(item){
            const { type } = item;
            const link = document.createElement('a');
            link.href = type === 3 ?
                'https://ems.tachyoniq.com/ems/customerLogin.html' :
                'https://quicklicensemanager.com/codecorp/QlmCustomerSite/qlmlicenseinfo.aspx';
            link.target = '_blank';
            link.click();
        },
        checkUpload(){
            let hasError = false;

            this.message = '';
            if (!this.selectGroup){
                console.log(`selectGroup ${this.selectGroup}`);
                this.message = 'Please fill in all fields';
                this.shareMessage = 'Customer or Group is required';
                return false;
            }
            this.fileItems.forEach(item => {
                const { type } = item;
                const checkFields = this.fields[`${type}`];
                item.message = ''
                console.log(`item ${JSON.stringify(item)}`);
                if (checkFields.length) {

                    for (let loop = 0; loop < checkFields.length; loop++) {
                        const filedKey = checkFields[loop];
                        console.log(`filedKey ${filedKey}`);
                        const isCheck = !!this.fieldsError[filedKey];
                        const value = item[filedKey];
                        console.log(`value ${value}`);
                        if (isCheck) {
                            const errorMes = this.fieldsError[filedKey].error;
                            const file = item.file;
                            const limit =  100 * 1024 * 1024;

                            switch(filedKey) {
                                // case 'selectSubType':
                                //     (value < 0) && (item.message = errorMes);
                                //     break;
                                case 'displayName':
                                    !value && (item.message = errorMes);
                                    break;
                                case 'file':
                                    if (file){
                                        console.log(`check file size ${file.size} > ${limit}`);
                                        if (file.size > limit){
                                            item.message = errorMes;
                                        }
                                    }
                                    break;
                            }
                        }

                        if (item.message) {
                            hasError = true;
                        }
                    }

                } else {
                    item.message = 'Select Type';
                    return;
                }
            });

            console.log(`error ${this.message}`);

            if (hasError){
                return false;
            }
            return  true;
        },
        chooseFile(key){
            const ref = this.$refs[key];
            ref[0].click();
        },
        handleFilesUpload(i){
            const ref = this.$refs['file_'+i];
            this.message = '';
            const file = ref[0].files[0];
            this.fileItems[i].message = '';
            this.fileItems[i].file = file;
        },
        upload() {
            if (!this.checkUpload()){
                return;
            }
            this.saveLoading = true;
            const formData = new FormData();
            let i = 0;
            for (let item of this.fileItems){
                const file = item.file;
                console.log(`name === ${file ? file.name : ''}`);
                formData.append(`photos[${i}]`, file);
                const info = Object.assign({}, item);
                info.owner = this.getUserInfo.userId;
                info.shareGroup = this.selectGroup;
                delete info.file;
                formData.append(`info_${i}`, JSON.stringify(info));
                i+=1;
            }
            this.uploadFile({ fileList: formData,
                token:this.getUserInfo.token}).then((response) => {
                console.log(`upload ... ${JSON.stringify(response)}`);
                this.saveLoading = false;
                if (response.status === 200) {
                    console.log('上傳成功');
                    this.message = 'Upload Complete';
                    this.reset();
                    this.cancel();
                }
            }).catch(e=>{
                this.saveLoading = false;
                this.message = 'Upload Error';
                console.log(`上傳失敗 ${e}`);
            });
        },
        reset(){
            this.fileItems = [];
            const newFile = Object.assign({}, this.defaultItem);
            this.fileItems.push(newFile);
            this.radioGroup = '0';
            this.selectUserName = '';
            this.groupList = [];
            this.selectGroup = null;
            this.selectMessage = '';
            setTimeout(()=>{
                this.message = '';
            }, 2000);
        },
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
