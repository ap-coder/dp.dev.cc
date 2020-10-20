<template>
    <div class="main_ad">
        <div class="txt">
            <div class="ad_title">
                The Best<br/>
                Barcode<br/>
                Scanning Software
            </div>
            <div class="subtitle">Stable, strong and easy to use.</div>
            <a href="#" class="redBtn" @click.prevent="toRegister">Start Trial</a>
        </div>
        <img src="../../assets/images/index/ad-home-lg.jpg" class="img-lg">
        <img src="../../assets/images/index/ad-home-md.jpg" class="img-md">
        <img src="../../assets/images/index/ad-home-xs.jpg" class="img-xs">
    </div><!--end of main_ad-->
</template>

<script>
    export default {
        name: "IndexContent",
        created() {
            // eslint-disable-next-line no-undef
            $(window).scrollTop(0);
        },
        methods:{
            toRegister(){
                this.$router.push('/register');
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>

