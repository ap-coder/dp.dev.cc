<template>
    <div class="PopupFrame" >
        <div class="popTitle clearfix">
        <h1>{{item.displayName}}<span class="mail"></span></h1><a class="btnClose" @click="back"></a>
        </div>
        <v-progress-linear height="3px"
            v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="pop_content">
            <div class="deliveryDetailDiv">
              <div class="fileBox" v-show="!loading">
                <h4 v-if="showField(item, 'username')">{{ `Customer Name: ${getUserName(item)}` }}</h4>
                <div class="con">
                  <p>
                    <span v-if="showField(item, 'company')">{{ `Company: ${!item.company || item.company === '' ? '--' :item.company }` }}</span>
                    <span v-if="showField(item, 'email')"><br/>{{ `Email: ${item.email ? item.email : '--'}` }}</span>
                  </p>
                </div>
              </div>
              <div class="fileBox" v-show="!loading">
                <h4 v-if="showField(item, 'displayName')">{{`Contract Name: ${item.displayName}`}}</h4>
                <div class="con">
                  <p>
                    <span v-if="showField(item, 'note')">{{`Release Notes: ${item.note}`}}</span>
                    <span
                          v-if="showField(item, 'status')"><br />{{`Status: `}}
                      <span  :style="{ color: getStatusInfo(item.status).color }">
                        {{getStatusInfo(item.status).text}}</span></span>
                    <span v-if="showField(item, 'createdDate')"><br />{{`Updated Date: ${formatDateText(item.updatedDate)}`}}</span>
                  </p>
                </div>
                <div class="con" v-if="message !==''">
                  <span class="red--text">{{message}}</span>
                  <div class="clear"></div>
                </div>
                <!--con-->
                <div class="con">
                  <a
                      v-if="showField(item, 'originURL')"
                      @click="downloadClick(item)"
                      class="downloadTxtBtn">{{item.name === ''? item.displayName: item.name}}</a>
                </div>
                <!--con-->
              </div>
              <!--fileBox-->
              <div class="rowBtn">
                <a class="grayBtn" @click="back">Back</a>
              </div>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import {CACHE_USER_KEY} from "@/utils/Constant";
    import Notification from "@U/notice_manager";
    import common from '@M/common';

    export default {
        name: "ContractDetailView",
        mixins: [common],
        data(){
            return {
                item: null,
                defaultItem: {
                    displayName: '',
                    type: 10,
                    subType: -1,
                    version: '',
                    shareGroup: '',
                    note:'',
                    uploadFieldName: 'photos',
                    file: null,
                    originURL: '',
                },
                message:'',
                saveLoading: false,
                saveMessage:'',
                fileURL: '',
                uploadProgress:0,
                loading: true
            };
        },
        created() {
            // 上傳進度
            Notification.addObserver('contractProgress', (uploadProgress)=>{
              this.uploadProgress = uploadProgress;
              console.log(`contractProgress == ${uploadProgress}`);
            });

            this.item = Object.assign({} , this.defaultItem);
            this.loadData();
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            isEdit(){
                return this.$route.query.id !== '';
            },
            fields() {
              return {
                '-1': ['username','company','email','displayName','groupName','createdDate', 'originURL'],
                '0': ['username','company','email','displayName','expiredDate','createdDate','originURL'],
                '1': ['username','company','email','displayName','groupName','createdDate', 'originURL'],
                '2': ['username','company','email','displayName','groupName', 'customerId', 'fileDescription','expiredDate' ,'createdDate'],
                '3': ['username','company','email','displayName','groupName', 'fileDescription','expiredDate','createdDate'],
                '4': ['username','company','email','displayName','groupName', 'fileDescription','expiredDate','createdDate'],
                '6': ['username','company','email','displayName','groupName','createdDate', 'originURL'],
                '7': ['username','company','email','displayName','groupName','createdDate', 'originURL'],
                '8': ['username','company','email','displayName','note','createdDate','status', 'originURL'],
                '9': ['username','company','email','displayName','note','createdDate', 'originURL'],
                '10': ['username','company','email','displayName','note','createdDate','status', 'originURL']
              }
            },
        },
        methods:{
            ...mapActions(['uploadContract','getFileInfo']),
            getUserName(item){
              if (item.shareFirstName && item.shareLastName){
                return `${item.shareFirstName} ${item.shareLastName}`;
              }
              return item.groupName;
            },
            getStatusInfo(status){
              if (status === 0){
                return {key: 0, text: 'Not Accepted', color: '#ad1f25'};
              }
              return {key: 1, text: 'Accepted', color: '#7f7f7f'};
            },
            showField(item, key) {
              const { type } = item;
              if (this.fields[`${type}`]){
                return this.fields[`${type}`].indexOf(key) > -1;
              }
              return false;
            },
            async loadData() {
                const fileId = this.dialogInfo.id;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.getFileInfo({
                    token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                    fileId: fileId,
                    userId: this.dialogInfo.userId
                });
                const result = res.data;

                if (result && result.data){
                    if (result.statusCode === 0){
                        this.item = result.data;
                        this.loading = false;
                        console.log(`get contract file == ${JSON.stringify(this.item)}`);
                    }
                }
            },
            checkUpload(){
                console.log(JSON.stringify(this.fileItems));
                let hasError = false;
                let errorMessage = '';
                console.log(`item ${JSON.stringify(this.item)}`);

                if (this.item.displayName === ''){
                    hasError = true;
                    errorMessage = 'Contract name is required';
                    this.message = errorMessage;
                    return false;
                }

                if (this.item.note.length > 1000){
                    hasError = true;
                    errorMessage = 'Release limit 1000 character';
                    this.message = errorMessage;
                    return false;
                }

                const file = this.item.file;
                if (file){
                    const limit =  100 * 1024 * 1024; //100M
                    console.log(`check file size ${file.size} > ${limit}`);
                    if (file.size > limit){
                        hasError = true;
                        errorMessage = 'File too large';
                        this.message = errorMessage;
                        return false;
                    }
                } else {
                    hasError = true;
                    errorMessage = 'File is required';
                }
                console.log(`hasError ${hasError}`)

                if (hasError){
                    // this.message = 'Please fill in all fields';
                    this.message = errorMessage;
                    return false;
                }
                return  true;
            },
            chooseFile(){
                const ref = this.$refs.file;
                console.log(ref);
                // console.log(ref);
                ref.click();
            },
            handleFilesUpload(){
                console.log(`handleFilesUpload`);
                const ref = this.$refs.file;
                console.log(ref);

                this.message = '';
                const file = ref.files[0];
                console.log(file);
                this.$set(this.item, 'file', file);
            },
            upload() {
                if (!this.checkUpload()){
                    return;
                }
                this.$refs.file.value = null;
                this.saveLoading = true;
                const formData = new FormData();
                const file = this.item.file;
                formData.append(`photos`, file);
                const info = Object.assign({}, this.item);
                info.owner = this.getUserInfo.userId;
                delete info.file;
                formData.append(`info`, JSON.stringify(info));
                const token = localStorage.getItem(CACHE_USER_KEY);
                this.uploadContract({
                    fileList: formData,
                    token:this.getUserInfo ? this.getUserInfo.token : token
                    }).then((response) => {
                    console.log(`upload ... ${JSON.stringify(response)}`);
                    this.saveLoading = false;
                    const result = response.data;
                    if (result.statusCode === 0) {
                        console.log('上傳成功');
                        this.message = 'Upload Complete';
                        this.reset();
                        setTimeout(()=>{
                          this.cancel();
                        }, 1000);
                    } else {
                        this.message = result.message;
                    }
                }).catch(e=>{
                    this.saveLoading = false;
                    this.message = 'Upload Error';
                    console.log(`上傳失敗 ${e}`);
                });
            },
            reset(){
                this.item = Object.assign({}, this.defaultItem);
                this.selectMessage = '';
                setTimeout(()=>{
                    this.message = '';
                }, 2000);
            },
            back(){
                // this.$router.back();
                this.hideDialog();
            },
            downloadClick(item) {
              const { displayName, originURL } = item;
              const link = document.createElement('a');
              link.target = '_blank';
              link.href = originURL;
              link.download = displayName;
              link.click();
            },
        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
