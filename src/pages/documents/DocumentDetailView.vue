<template>
    <div v-if="item">
        <ul class="docUl">
            <li v-for="option in getContentTypeList" :key="option.key">
                <a href="#" :id="`tab_${option.key}`" :class="contentType === option.key ? 'now' :''"
                   @click.prevent="changeTab(option.key)">{{option.text}}</a></li>
            <div class="clear"></div>
        </ul>

        <div class="gettingStartedDiv" v-if="showEdit">
            <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
            <!--                <div class="rowDiv">-->
            <!--                    <quill-editor-->
            <!--                            ref="QuillEditor"-->
            <!--                            v-model="item.content"-->
            <!--                            :options="editorOption"-->
            <!--                            @blur="onEditorBlur($event)"-->
            <!--                            @focus="onEditorFocus($event)"-->
            <!--                            @ready="onEditorReady($event)"-->
            <!--                    />-->
            <!--                </div>-->
            <div class="rowDiv">
                <div class="tit">Link Address</div>
                <div class="con">
                    <input type="text" v-model="item.url" class="textInput">
                    <a href="#" class="blueBtn" @click.prevent="showPreview">Preview</a>
                </div>
                <div class="clear"></div>
            </div>
            <div class="rowDiv linkDiv" v-if="isPreview === true">
                <div class="tit">Preview Page</div>
                <iframe :src="item.url" style="height:400px;"></iframe>
            </div>
            <div class="rowDiv" v-if="message !==''">
                <span class="red--text">{{message}}</span>
                <div class="clear"></div>
            </div>
            <div class="clear"></div>
            <div class="rowBtn">
                <a href="#" class="redBtn" @click.prevent="save">
                    <v-progress-circular color="#ffffff" indeterminate :size="28"
                                         :width="2"
                                         v-if="saveLoading" :value="20"></v-progress-circular>
                    <span v-else>Save</span>
                </a>
                <a href="#" class="grayBtn" @click.prevent="back()">Back</a>
            </div>
        </div>
        <div class="gettingStartedDiv"
              v-else-if="!showEdit && item && item.url !==''">
<!--            <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>-->
            <iframe :src="item.url" style="width: 100%; height:1000px; border:none;"></iframe>
        </div>

    </div>
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    // import { quillEditor } from 'vue-quill-editor'
    import { CACHE_USER_KEY , CACHE_PLATFORM } from "@/utils/Constant";
    import Notification from "@/utils/notice_manager";
    import * as Tools from '@/utils/tools';
    export default {
        name: "DocumentDetailView",
        components: {
            // quillEditor
        },
        data () {
            return {
                item: null,
                defaultItem:{
                    contentId:'',
                    name: '',
                    content: '',
                    contentType: 0,
                    platform: 0,
                    url:'',
                },
                editorOption: {
                },
                message:'',
                id: null,
                loading: false,
                saveLoading: false,
                contentType:0,
                isPreview: false,
            }
        },
        created(){
            this.id = this.$route.query.id;
            this.contentType = this.$route.query.type;
            this.item = Object.assign({}, this.defaultItem);
            this.loadData();
        },
        computed: {
            ...mapGetters(['getUserInfo','getPlatformList']),
            getCurrentPermission(){
                return Tools.getUserPermission('Documentations');
            },
            showEdit(){
                if (this.getCurrentPermission && this.getCurrentPermission.subItems.length){
                    return this.getCurrentPermission.subItems.find(feature=>feature.featureId === 1).enable === true;
                }
                return false;
            },
            // editor() {
            //     return this.$refs.QuillEditor.quill
            // },
            isEdit(){
                return this.id !== '';
            },
            platformList(){
                const cache = localStorage.getItem(CACHE_PLATFORM);
                const list = JSON.parse(cache)  ? JSON.parse(cache)  :
                    this.getPlatformList;
                return list;
            },
            getContentTypeList(){
                return [
                    { key: 0 , text: 'Getting Start' },
                    { key: 1 , text: 'Sample Project' },
                    { key: 2 , text: 'FAQ' },
                    { key: 3 , text: 'API Document' },
                ];
            },
        },
        mounted() {
            console.log('this is current quill instance object', this.editor)
        },
        methods: {
            ...mapActions(['createDocInfo','getPlatformDocInfo','updateDocInfo']),
            showPreview(){
                this.isPreview = true;
            },
            async loadData(){
                if (this.id === ''){
                    return;
                }
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                console.log(`load doc === ${token} id ${this.id}`);
                const results = await this.getPlatformDocInfo({
                    token: token ? token :  this.getUserInfo.token,
                    platform: this.id,
                    contentType: this.contentType,
                });
                console.log(results.data);
                if (results && results.data){

                    if (results.data.statusCode === 0){
                        this.item = results.data.data;
                        if (!this.item.url){
                            this.item.url = '';
                        }
                        console.log(this.item);
                    }
                    console.log(`this.item ${JSON.stringify(this.item)}`);
                }
                this.loading = false;
            },
            onEditorBlur(quill) {
                console.log('editor blur!', quill)
            },
            onEditorFocus(quill) {
                console.log('editor focus!', quill)
            },
            onEditorReady(quill) {
                console.log('editor ready!', quill);
                this.editor.container.style.height = '500px';
            },
            onEditorChange({ quill, html, text }) {
                console.log('editor change!', quill, html, text)
                this.content = html
            },
            changeTab(key){
                console.log(`changeTab ${key}`);
                this.contentType = key;

                // for (let i=0 ;i<4 ;i++){
                //
                //     if (i === key){
                //         // eslint-disable-next-line no-undef
                //         $(`#tab${key+1}`).addClass('now');
                //     } else {
                //         // eslint-disable-next-line no-undef
                //         $(`#tbl_${i}`).removeClass('now');
                //     }
                // }

                this.loadData();
            },
            async createDoc(){
                if (this.item.name === ''){
                    this.message = 'Document name is required';
                    return;
                }
                this.saveLoading = true;
                const res = await this.createDocInfo({
                    token: this.getUserInfo.token,
                    info: this.item
                });

                this.saveLoading = false;
                if (res && res.data){
                    this.message = res.data.message;
                    this.reset();
                    const contentId = res.data.data.contentId;
                    this.$router.replace({ path: 'docDetail', query: { id: contentId }});
                    this.loadData();
                } else {
                    this.message = res.data ? res.data.message : 'Save Error';
                }
            },
            async save(){
                // if (this.item.name === ''){
                //     this.message = 'Document name is required';
                //     return;
                // }
                this.saveLoading = true;
                this.item.contentType = this.contentType;
                console.log(`save doc ${this.getUserInfo} ${JSON.stringify(this.item)}`);
                let res;
                if (this.id === '') { // 新增
                    res = await this.createDocInfo({
                        token: this.getUserInfo.token,
                        info: this.item
                    });
                } else { //修改
                    res = await this.updateDocInfo({
                        token: this.getUserInfo.token,
                        info: this.item
                    });
                }

                this.saveLoading = false;
                console.log(JSON.stringify(res.data));
                if (res && res.data){
                    this.message = res.data.message;
                    if (res.data.statusCode === 0){
                        this.reset();
                        // this.item.contentId = res.data.data;
                        // this.item.name = res.data.data.name;
                    }
                } else {
                    this.message = res.data ? res.data.message : 'Save Error';
                }
            },
            reset(){
              // this.item = Object.assign({}, this.defaultItem);
              setTimeout(()=>{
                  this.message = '';
              }, 1500);
            },
            back(){
                Notification.notifyObservers('popSubPath', 'Edit Document');
                this.$router.back();
            }
        },
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
