<template>
    <div>
        <div class="title">
            <h1>{{key}} SDK</h1>
<!--            <div class="bread">-->
<!--                <span class="icon"></span><a href="index.html" target="_self">Index</a><span class="dot"></span><a href="documentations.html" target="_self">Documentations</a><span class="dot"></span>IOS SDK<span class="dot"></span><a href="ios_FAQ.html" target="_self">FAQ</a>-->
<!--            </div>-->
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="FAQ">
            <h3>FAQ</h3>
<!--            <script>-->
<!--                $(function(){-->
<!--                    $(".tabBtn").click(function(){-->
<!--                        if($(this).hasClass("tabrotate")){-->
<!--                            $(this).removeClass("tabrotate").addClass("tabrotate1");-->
<!--                        }else{-->
<!--                            $(this).removeClass("tabrotate1").addClass("tabrotate");-->
<!--                        }-->
<!--                    })-->
<!--                })-->
<!--            </script>-->
            <a data-toggle="collapse" href="#q1" id="q1_link" class="tabBtn tabrotate" @click.prevent="changeExpend('q1_link')">
                Do you only support mobile devices?
                <span class="circle">
              <span class="ciecle1"></span>
              <span class="ciecle2"></span>
            </span>
            </a>
            <div id="q1" class="box collapse q1" aria-expanded="false">No way. Our software has been ported to embedded systems for use in purpose-built handheld and presentation barcodes readers. We also have enabled a variety of PC-based applications. We really are flexible enough for just about any platform.</div>
            <a data-toggle="collapse" href="#q2" id="q2_link" class="tabBtn tabrotate"
               @click.prevent="changeExpend('q2_link')">
                Do you only support mobile devices?
                <span class="circle">
              <span class="ciecle1"></span>
              <span class="ciecle2"></span>
            </span>
            </a>
            <div id="q2" class="box collapse q2"  aria-expanded="false">No way. Our software has been ported to embedded systems for use in purpose-built handheld and presentation barcodes readers. We also have enabled a variety of PC-based applications. We really are flexible enough for just about any platform.</div>
            <a data-toggle="collapse" href="#q3" id="q3_link" class="tabBtn tabrotate"
               @click.prevent="changeExpend('q3_link')">
                Do you only support mobile devices?
                <span class="circle">
              <span class="ciecle1"></span>
              <span class="ciecle2"></span>
            </span>
            </a>
            <div id="q3" class="box collapse q3" aria-expanded="false">No way. Our software has been ported to embedded systems for use in purpose-built handheld and presentation barcodes readers. We also have enabled a variety of PC-based applications. We really are flexible enough for just about any platform.</div>
            <a data-toggle="collapse" href="#q4" id="q4_link" class="tabBtn tabrotate"
               @click.prevent="changeExpend('q4_link')">
                Do you only support mobile devices?
                <span class="circle">
              <span class="ciecle1"></span>
              <span class="ciecle2"></span>
            </span>
            </a>
            <div id="q4" class="box collapse q4" aria-expanded="false">No way. Our software has been ported to embedded systems for use in purpose-built handheld and presentation barcodes readers. We also have enabled a variety of PC-based applications. We really are flexible enough for just about any platform.</div>
        </div><!--end of gettingStarted-->
        <doc-ad-view></doc-ad-view>
        <div id="footer">

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import DocAdView from "../../components/view/DocAdView";
    import BreadView from "../../components/view/BreadView";
    export default {
        name: "FAQView",
        components:{
            DocAdView,
            BreadView
        },
        data(){
            return {
                key:'',
            };
        },
        created() {
            this.key = this.$route.query.key;
            // this.changeExpend();
        },
        computed:{
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    { key: 'documentations', label:'Documentations' },
                    { key: 'faq', label: `FAQ` },
                ];
            }
        },
        methods:{
            changeExpend(id){
                // eslint-disable-next-line no-undef
                if ($(`#${id}`).hasClass("tabrotate")) {
                    // eslint-disable-next-line no-undef
                    $(`#${id}`).removeClass("tabrotate").addClass("tabrotate1");
                } else {
                    // eslint-disable-next-line no-undef
                    $(`#${id}`).removeClass("tabrotate1").addClass("tabrotate");
                }
            }
        }
    }
</script>

<style scoped>
    .collapse {
        visibility: visible !important;
    }
</style>

<style scoped src="../../assets/css/all.css">
</style>
