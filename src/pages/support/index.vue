<template>
    <div class="sdksAddDiv">
        <v-progress-linear height="3px" v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
        <div class="rowLeft mt-2" v-if="!isSuccess">
            <div class="functionBar">
                <div class="tit">Support Type</div>
                <select class="select" v-model="item.type">
                    <option v-for="option in supportTypes" :key="option.key"
                            :value="option.key">{{option.text}}</option>
                </select>
            </div>
            <div class="rowDiv">
                <div class="tit">Title</div>
                <div class="con">
                    <input type="text" class="textInput" v-model="item.ticket">
                </div>
                <div class="clear"></div>
            </div>
            <div class="rowDiv">
                <div class="tit">Content</div>
                <div class="con">
                    <textarea v-model="item.content"></textarea>
                </div>
                <div class="clear"></div>
            </div>
            <div class="rowDiv mt-2" v-if="message !==''">
                <span class="red--text">{{message}}</span>
                <div class="clear"></div>
            </div>
        </div><!--rowLeft-->
        <div class="rowBtn" v-if="!isSuccess">
            <a href="#" class="redBtn" @click.prevent="save">
                <v-progress-circular color="#ffffff" indeterminate :size="28"
                                     :width="2"
                                     v-if="saveLoading" :value="20"></v-progress-circular>
                <span v-else>Submit</span>
            </a>
<!--            <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>-->
        </div>
        <div class="rowDiv mt-2" v-if="isSuccess && message !==''">
          <span>{{message}}</span>
          <div class="clear"></div>
        </div>
        <div class="rowBtn" v-if="isSuccess && message !==''">
          <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
        </div>
    </div><!--usersAddDiv-->
</template>

<script>
    import { mapActions, mapGetters } from 'vuex';
    import {CACHE_USER_KEY} from "@/utils/Constant";
    // import Notification from "@/utils/notice_manager";
    export default {
        name: "index",
        data(){
            return {
                item: null,
                defaultItem: {
                    ticket: '',
                    content:'',
                    type: 0,
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
                isSuccess: false,
            };
        },
        created() {
            this.item = Object.assign({} , this.defaultItem);
        },
        computed:{
            ...mapGetters(['getUserInfo']),
            currentPath() {
                return this.$route.fullPath;
            },
            supportTypes() {
                return [
                    {key: 0, text: 'Sales support' },
                    {key: 1, text: 'Tech support' },
                ];
            },
        },
        methods:{
            ...mapActions(['submitSupport']),
            checkForm(){
                console.log(JSON.stringify(this.fileItems));
                let hasError = false;
                if (this.item.title === '') {
                    hasError = true;
                    this.message = 'Title is required';
                } else if (this.item.content === '') {
                    hasError = true;
                    this.message = 'Content is required';
                }

                console.log(`error ${hasError} / ${this.message}`);
                if (hasError){
                    this.message = 'Please fill in all fields';
                    return false;
                }
                return  true;
            },
            async save() {
                if (!this.checkForm()){
                    return;
                }
                this.saveLoading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.submitSupport({ token: token ? token: this.getUserInfo.token,
                    info : this.item});

                const result = res.data;
                console.log(`result == ${JSON.stringify(result)}`);
                if (result.statusCode === 0) {
                    // console.log('儲存成功');
                    this.isSuccess = true;
                    this.message = 'Thank you for contacting us, we will reach out to you as soon as possible.';
                } else {
                    this.message = result ? result.message :'Upload Error';
                }
                this.saveLoading = false;
                this.reset();
            },
            reset(){
                this.item = Object.assign({}, this.defaultItem);
            },
            cancel(){
                this.isSuccess = false;
                this.message = '';
                // Notification.notifyObservers('popSubPath');
                // this.$router.back();
            },

        }
    }
</script>

<style scoped src="../../assets/css/all-admin.css">

</style>
