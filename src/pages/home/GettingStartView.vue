<template>
    <div>
        <div class="title">
            <h1>{{key}} SDK</h1>

<!--            <div class="bread">-->
<!--                <span class="icon"></span><a href="index.html" target="_self">Index</a><span class="dot"></span><a href="documentations.html" target="_self">Documentations</a><span class="dot"></span>IOS SDK<span class="dot"></span><a href="ios_gettingStarted.html" target="_self">Getting Started</a>-->
<!--            </div>-->
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="gettingStarted">
            <h3>Getting Started</h3>
            <h6>Title</h6>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content</p>
            <a href="#" class="redBtn">Dounload SDK</a>
            <h6>Title</h6>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content</p>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content </p>
        </div><!--end of gettingStarted-->
        <doc-ad-view :path="key"></doc-ad-view>
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import DocAdView from "../../components/view/DocAdView";
    import BreadView from "../../components/view/BreadView";
    export default {
        name: "GettingStartView",
        components:{
            DocAdView,
            BreadView,
        },
        data(){
          return {
            key:'',
          };
        },
        created() {
            this.key = this.$route.query.key;
        },
        computed:{
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    { key: 'documentations', label:'Documentations' },
                    { key: 'gettingStart', label: `${this.key} SDK` },
                ];
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
