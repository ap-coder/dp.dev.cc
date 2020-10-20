<template>
    <div>
        <div class="title">
            <h1>{{title}} SDK</h1>
<!--            <div class="bread">-->
<!--                <span class="icon"></span><a href="index.html" target="_self">Index</a><span class="dot"></span><a href="documentations.html" target="_self">Documentations</a><span class="dot"></span>IOS SDK<span class="dot"></span><a href="ios_API.html" target="_self">API Documentation</a>-->
<!--            </div>-->
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="API">
            <h3>API Documentation</h3>
            <h6>Title</h6>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content</p>
            <h6>Title</h6>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content</p>
            <p>content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content content </p>
        </div><!--end of gettingStarted-->
        <doc-ad-view></doc-ad-view>
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import DocAdView from "../../components/view/DocAdView";
    import BreadView from "../../components/view/BreadView";
    import { FILE_TYPE} from '@/utils/Constant';
    export default {
        name: "APIView",
        components:{
            DocAdView,
            BreadView,
        },
        data(){
            return {
                key:'',
                title: '',
            };
        },
        created() {
            this.key = this.$route.query.key;
            const find = this.menuKeys.find(m=>m.key === this.key);
            if (find){
              this.title = find.text;
            }
        },
        computed:{
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    { key: 'documentations', label:'Documentations' },
                    { key: 'api', label: `API Documentation` },
                ];
            },
            menuKeys(){
              return FILE_TYPE;
            },
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
