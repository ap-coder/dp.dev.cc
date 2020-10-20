<template>
    <div class="PopupFrame">
      <div class="popTitle clearfix">
        <h1>Contract Review<span class="mail"></span></h1><a class="btnClose" @click="cancel"></a>
      </div>
      <v-progress-linear height="3px"
                         v-show="loading" color="#ad1f25" indeterminate></v-progress-linear>
      <div class="pop_content">
        <div class="rowDiv mt-2" v-if="item && item.originURL !== ''">
          <iframe :src="item.originURL" width="100%" height="500px"></iframe>
        </div>
        <div class="rowDiv"  v-if="item">
          <div class="rowDiv m-2">
            <div class="tit">Signature</div>
            <div class="con">
              <input type="text" v-model="item.signature" class="textInput" :disabled="item.accept=== true">
            </div>
            <div class="clear"></div>
          </div>
          <div class="rowDiv m-2" v-if="message !==''">
            <span class="red--text">{{message}}</span>
            <div class="clear"></div>
          </div>
          <div class="rowDiv">
            <!--                    <a href="#" class="redBtn mr-4"  @click.prevent="()=>{}">Agree</a>-->
            <a href="#" v-if="item.accept === false"
               @click.prevent="agreeEvent" class="redBtn mr-4">
              <v-progress-circular color="#ffffff" indeterminate :size="28"
                                   :width="2"
                                   v-if="saveLoading" :value="20"></v-progress-circular>
              <span v-else>Agree</span>
            </a>
            <a href="#" class="grayBtn" @click.prevent="cancel">Back</a>
          </div>
        </div>
      </div>
    </div>
</template>

<script>
    import {mapActions, mapGetters} from "vuex";
    import {CACHE_USER_KEY} from "@/utils/Constant";
    import common from '@M/common';
    export default {
        name: "ContractAcceptView",
        mixins: [common],
        data(){
          return {
              item: null,
              saveLoading: false,
              message:'',
              loading: false,
          };
        },
        created() {
            this.loadData();
        },
        computed:{
            ...mapGetters(['getUserInfo']),
        },
        methods: {
            ...mapActions(['uploadContract','getContractInfo','acceptContractInfo']),
            async loadData() {
                const fileId = this.dialogInfo.id;
                // const fileId = this.$route.query.id;
                // if (!fileId || fileId === ''){
                //     return;
                // }
                this.loading = true;
                const token = localStorage.getItem(CACHE_USER_KEY);
                const res = await this.getContractInfo({
                    token: this.getUserInfo.token ? this.getUserInfo.token : token ,
                    fileId: fileId,
                });
                const result = res.data;

                if (result && result.data){
                    if (result.statusCode === 0){
                        this.item = result.data;
                        console.log(`get contract file == ${JSON.stringify(this.item)}`);
                    }
                }
                this.loading = false;
            },
            agreeEvent(){
                this.message = '';
                if (!this.item.signature || this.item.signature === ''){
                    this.message = 'Signature is required';
                    return;
                }
                this.accept(this.item);
            },
            async accept(item){
                this.saveLoading = true;
                const res = await this.acceptContractInfo({
                    token: this.getUserInfo.token,
                    info: {
                        signature: item.signature,
                        fileId: item.fileId,
                        userId: this.getUserInfo.userId,
                    },
                });
                if (res) {
                    const results = res.data;
                    if (results.statusCode === 0){
                        this.loadData();
                    }
                    this.message = results.message;
                    setTimeout(()=>{
                        this.message = '';
                        this.cancel();
                    }, 1500);
                } else {
                    this.message = 'Save Fail';
                }
                this.saveLoading = false;
            },
            cancel(){
                // this.$router.back();
              this.hideDialog();
            }
        }
    }
</script>


<style scoped src="../../assets/css/all-admin.css"></style>
