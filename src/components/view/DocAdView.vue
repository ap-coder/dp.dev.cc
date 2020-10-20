<template>
    <div class="doc_gettinstarted_ad">
        <div class="docAD1">
            <div class="txt">
                <a href="#" class="redBtn" @click.prevent="changePage('/contact')">Contact Sales</a>
                <a href="#" class="redBtn" @click.prevent="changePage('/support')">Find Support</a>
            </div>
            <img src="../../assets/images/documentations/doc-ad1-lg.jpg" class="img-lg">
            <img src="../../assets/images/documentations/doc-ad1-xs.jpg" class="img-xs">
        </div>
        <div class="docAD2">
            <div class="txt">
                <a href="#" class="redBtn" @click.prevent="changePage('/login')">Sign In to Start Trial</a>
            </div>
            <img src="../../assets/images/documentations/doc-ad2-lg.jpg" class="img-lg">
            <img src="../../assets/images/documentations/doc-ad2-xs.jpg" class="img-xs">
        </div>
        <div class="clear"></div>
    </div>
</template>

<script>
    export default {
        name: "DocAdView",
        props:{
          path:String
        },
        created(){
          console.log(`key === ${this.path}`);
        },
        methods: {
            changePage(key){
                this.$router.push(key);
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
