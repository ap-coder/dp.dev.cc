<template>
    <div>
        <div class="title">
            <h1>Documentations</h1>
<!--            <div class="bread">-->
<!--                <span class="icon"></span><a href="index.html" target="_self">Index</a><span class="dot"></span><a href="documentations.html" target="_self">Documentations</a>-->
<!--            </div>-->
            <bread-view :bread-menu="breadMenu"></bread-view>
        </div><!--end of title-->
        <div class="documentations">
<!--            <div class="docBox">-->
<!--                <div class="doc_android"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>Android SDK</h6></li>-->
<!--                    <li><a href="android_gettingStarted.html" target="_self">Getting Started</a></li>-->
<!--                    <li><a href="android_sampleProjects.html" target="_self">Sample Projects</a></li>-->
<!--                    <li><a href="android_API.html" target="_self">API Documentation</a></li>-->
<!--                    <li><a href="android_FAQ.html" target="_self">FAQ</a></li>-->
<!--                </ul>-->
<!--            </div>-->
<!--            <div class="docBox">-->
<!--                <div class="doc_ios"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>IOS SDK</h6></li>-->
<!--                    <li><a href="ios_gettingStarted.html" target="_self">Getting Started</a></li>-->
<!--                    <li><a href="ios_sampleProjects.html" target="_self">Sample Projects</a></li>-->
<!--                    <li><a href="ios_API.html" target="_self">API Documentation</a></li>-->
<!--                    <li><a href="ios_FAQ.html" target="_self">FAQ</a></li>-->
<!--                </ul>-->

<!--            </div>-->
<!--            <div class="docBox">-->
<!--                <div class="doc_windows"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>Windows SDK</h6></li>-->
<!--                    <li><a href="windows_gettingStarted.html" target="_self">Getting Started</a></li>-->
<!--                    <li><a href="windows_sampleProjects.html" target="_self">Sample Projects</a></li>-->
<!--                    <li><a href="windows_API.html" target="_self">API Documentation</a></li>-->
<!--                    <li><a href="windows_FAQ.html" target="_self">FAQ</a></li>-->
<!--                </ul>-->
<!--            </div>-->
<!--            <div class="docBox">-->
<!--                <div class="doc_linux"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>Linux SDK</h6></li>-->
<!--                    <li><a href="linux_gettingStarted.html" target="_self">Getting Started</a></li>-->
<!--                    <li><a href="linux_sampleProjects.html" target="_self">Sample Projects</a></li>-->
<!--                    <li><a href="linux_API.html" target="_self">API Documentation</a></li>-->
<!--                    <li><a href="linux_FAQ.html" target="_self">FAQ</a></li>-->
<!--                </ul>-->
<!--            </div>-->
<!--            <div class="docBox">-->
<!--                <div class="doc_xamarin"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>Xamarin SDK</h6></li>-->
<!--                    <li><a href="xamarin_gettingStarted.html" target="_self">Getting Started</a></li>-->
<!--                    <li><a href="xamarin_sampleProjects.html" target="_self">Sample Projects</a></li>-->
<!--                    <li><a href="xamarin_API.html" target="_self">API Documentation</a></li>-->
<!--                    <li><a href="xamarin_FAQ.html" target="_self">FAQ</a></li>-->
<!--                </ul>-->
<!--            </div>-->
<!--            <div class="docBox">-->
<!--                <div class="doc_web"></div>-->
<!--                <div class="bg_gray"></div>-->
<!--                <div class="bg_red"><span></span></div>-->
<!--                <ul>-->
<!--                    <li><h6>Web SDK</h6></li>-->
<!--                    <li>-->
<!--&lt;!&ndash;                        <a href="web_gettingStarted.html" target="_self">Getting Started</a>&ndash;&gt;-->
<!--                        <router-link :to="{ path:'gettingStart' , query: { key: 'web' }}">Getting Started</router-link>-->
<!--                    </li>-->
<!--                    <li>-->
<!--&lt;!&ndash;                        <a href="web_sampleProjects.html" target="_self">Sample Projects</a>&ndash;&gt;-->
<!--                        <router-link to="sample">Sample Projects</router-link>-->
<!--                    </li>-->
<!--                    <li>-->
<!--&lt;!&ndash;                        <a href="web_API.html" target="_self">API Documentation</a>&ndash;&gt;-->
<!--                        <router-link to="api">API Documentation</router-link>-->
<!--                    </li>-->
<!--                    <li>-->
<!--&lt;!&ndash;                        <a href="web_FAQ.html" target="_self">FAQ</a>&ndash;&gt;-->
<!--                        <router-link to="faq">FAQ</router-link>-->
<!--                    </li>-->
<!--                </ul>-->
<!--            </div>-->
            <div class="docBox" v-for="menu in menuKeys" :key="menu.key">
                <div class="doc_web"></div>
                <div class="bg_gray"></div>
                <div><span></span></div>
                <ul>
                    <li><h6>{{menu.text}}</h6></li>
                    <li v-for="subMenu in subMenuKeys" :key="subMenu.key">
                        <router-link :to="{ path: subMenu.path , query: { key: menu.key }}">{{subMenu.label}}</router-link>
                    </li>
                </ul>
            </div>
            <div class="clear"></div>
        </div><!--end of documentations-->
        <div>

        </div><!--end of footer-->
    </div><!--end of content-->
</template>

<script>
    import BreadView from "../../components/view/BreadView";
    import { FILE_TYPE} from '@/utils/Constant';
    export default {
        name: "DocumentationsView",
        components:{
            BreadView
        },
        created() {
            // eslint-disable-next-line no-undef
            $(window).scrollTop(0);
        },
        computed: {
            menuKeys(){
                return FILE_TYPE;
            },
            subMenuKeys(){
                return [
                    { path: 'gettingStart', label:'Getting Started' },
                    { path: 'sample', label:'Sample Projects' },
                    { path: 'api', label:'API Documentation' },
                    { path: 'faq', label:'FAQ' },
                ];
            },
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    { key: 'documentations', label:'Documentations' },
                ];
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">
</style>
