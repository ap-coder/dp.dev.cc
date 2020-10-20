<template>
    <div class="sdksAddDiv">
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="rowLeft">
            <div class="rowDiv">
                <div class="tit" v-if="isEdit === false">Title</div>
                <div class="con">
                    <input type="text" class="textInput" v-if="isEdit === false" v-model="item.title">
                    <h6 v-else>{{item.title}}</h6>
                    <span>{{item.createdDate}}</span>
                </div>
                <div class="clear"></div>
            </div>
            <div class="rowDiv">
                <div class="tit" v-if="isEdit === false">Content</div>
                <div class="con">
                    <quill-editor v-if="isEdit === false"
                                  ref="QuillEditor"
                                  v-model="item.content"
                                  :options="editorOption"
                                  @blur="onEditorBlur($event)"
                                  @focus="onEditorFocus($event)"
                                  @ready="onEditorReady($event)"
                    />
                    <div v-else v-html="item.content"></div>
                </div>
                <div class="clear"></div>
            </div>
            <div class="rowDiv" v-if="isEdit === false">
                <div class="tit">Share User & Groups</div>
                <share-group-view
                        :reset="searchReset"
                        :message="shareMessage"
                        :show-radio-button="true"
                        :show-notice="false"
                        :show-save-button="false"
                        :enable-multi-select="true"
                        :enable-share-all="true"
                        @changeRadio="handleRadio"
                        @save="handleShareGroup"
                        @clear="handleShareClear"></share-group-view>
            </div>
            <div class="rowDiv mt-2" v-if="message !==''">
                <span class="red--text">{{message}}</span>
                <div class="clear"></div>
            </div>
        </div><!--rowLeft-->
        <div class="rowBtn">
            <a href="#" class="redBtn" v-if="isEdit === false" @click.prevent="save">
                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                     :width="2"
                                     v-if="saveLoading" :value="20"></v-progress-circular>
                <span v-else>Save</span>
            </a>
            <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
        </div>
    </div><!--usersAddDiv-->
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import {CACHE_USER_KEY, DELIVERY_FILE_TYPE} from "../../utils/Constant";
    import Notification from "@/utils/notice_manager";
    import ShareGroupView from "@/components/view/ShareGroupView";
    import { quillEditor } from 'vue-quill-editor'
    export default {
        name: "MessageDetailView",
        components:{
            ShareGroupView,
            quillEditor
        },
        data(){
            return {
                item: null,
                defaultItem: {
                    title: '',
                    content:'',
                    shareType: '0',
                },
                message:'',
                loading: false,
                saveLoading: false,
                saveMessage:'',
                shareMessage:'',
                info: null,
                shareUsers:[],
                editorOption: {
                },
                shareGroup: '0',
                searchReset: false,
            };
        },
        created() {
            this.item = Object.assign({} , this.defaultItem);
            this.loadData();

            console.log(`isEdit ${this.isEdit}`);
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            fileTypes: () => DELIVERY_FILE_TYPE,
            isEdit(){
                return this.$route.query.id !== '';
            },
            currentPath() {
                return this.$route.fullPath;
            },
            editor() {
                return this.$refs.QuillEditor.quill
            },
        },
        methods:{
            ...mapActions(['getMessageInfo','createMessageInfo','updateMessageInfo']),
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill);
                this.editor.container.style.height = '300px';
            },
            handleRadio(key){
                console.log(`handleRadio == ${JSON.stringify(key)}`);
                this.shareGroup = key;
            },
            handleShareClear(){
                this.saveMessage = '';
            },
            async handleShareGroup(item){
                console.log(`handleShareGroup == ${JSON.stringify(item)}`);
                this.shareUsers = item.isGroup ? [item.group] : item.items;
            },
            async loadData() {
                const messageId = this.$route.query.id;
                if (!messageId || messageId === ''){
                    return;
                }
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.getMessageInfo({
                    token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                    messageId: messageId,
                });
                const result = res.data;
                this.loading = false;

                if (result && result.data){
                    if (result.statusCode === 0){
                        this.item = result.data;
                        console.log(`get message ==`, this.item);
                    }
                }
            },
            checkUpload(){
                console.log(JSON.stringify(this.fileItems));
                let hasError = false;
                if (this.item.title === '') {
                    hasError = true;
                    this.message = 'Title is required';
                } else if (this.item.content === '') {
                    hasError = true;
                    this.message = 'Content is required';
                } else if (this.shareGroup !== '-1' && this.shareUsers.length === 0) {
                    hasError = true;
                    this.message = 'Share Users is required';
                }

                console.log(`失敗 ${hasError} / ${this.message}`);
                if (hasError){
                    this.message = 'Please fill in all fields';
                    return false;
                }
                return  true;
            },
            async save() {
                if (!this.checkUpload()){
                    return;
                }
                this.saveLoading = true;
                this.item.owner = this.getUserInfo.userId;
                this.item.shareUsers = this.shareUsers;
                this.item.shareType = parseInt(this.shareGroup);
                const token = localStorage.getItem(CACHE_USER_KEY);
                this.loading = true;
                const messageId = this.$route.query.id;
                let res;
                if (!messageId || messageId === ''){
                    console.log(`upload info... ${JSON.stringify(this.info)}`);
                    res = await this.createMessageInfo({ token: token ? token: this.getUserInfo.token,
                    info : this.item})
                } else {
                    res = await this.updateMessageInfo({ token: token ? token: this.getUserInfo.token,
                        info : this.item})
                }

                this.saveLoading = false;
                const result = res.data;
                console.log(`result == ${JSON.stringify(result)}`);
                if (result.statusCode === 0) {
                    console.log('上傳成功');
                    this.message = result.message;
                    this.loading = false;
                } else {
                    this.loading = false;
                    this.message = result ? result.message :'Upload Error';
                }
                this.reset();
            },
            reset(){
                this.searchReset = true;
                this.item = Object.assign({}, this.defaultItem);
                this.selectMessage = '';
                setTimeout(()=>{
                    this.message = '';
                    this.shareUsers = [];
                }, 1500);
            },
            cancel(){
                Notification.notifyObservers('popSubPath');
                this.$router.back();
            },

        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
