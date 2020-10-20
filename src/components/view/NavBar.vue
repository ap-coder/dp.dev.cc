<template>
    <div class="navBarContent">
        <div class="logo">
            <a href="#" @click.prevent="toIndexPage">
                <img src="../../assets/images/all/menu/logo-lg.png" class="logo-lg">
                <img src="../../assets/images/all/menu/logo-md.png" class="logo-md" >
            </a>
        </div>
        <a :class="`mMenuBtn mMenuBtn_close`" @click="openMenu">
            <span class="l1"></span>
            <span class="l2"></span>
            <span class="l3"></span>
        </a>
        <div class="nav_m">
            <div class="bg_m"></div>
            <div class="nav_top">
                <a href="https://www.codecorp.com" class="nav_mainsite">
                    <img src="../../assets/images/all/menu/icon-mainSite.png" >
                    <span>Main Site</span>
                </a>
                <a href="#" @click.prevent="signInEvent">
                    <img src="../../assets/images/all/menu/icon-signIn.png" >
                    <span>Sign In</span>
                </a>
            </div>
            <ul class="nav">
                <li class="nav_doc">
                    <a href="#" @click.prevent="changePage('documentations')">
                        <span class="icon_doc"></span>
                        <span>Documentations</span>
                    </a>
                </li>
                <li class="nav_support">
                    <a href="#" @click.prevent="changePage('support')">
                        <span class="icon_support"></span>Support
                    </a>
                </li>
                <li class="nav_contactSales">
                    <a href="#" @click.prevent="changePage('contact')" >
                        <span class="icon_contact_sales"></span>Contact Sales
                    </a>
                </li>
            </ul><!--end of nav-->
        </div>
    </div><!--end of navBarContent-->
</template>

<script>
    import Notification from "@/utils/notice_manager";

    export default {
        name: "NavBar",
        data(){
            return {
                showMenu: true,
            };
        },
        created() {
            // eslint-disable-next-line no-undef
            $(window).resize(function() {

                // eslint-disable-next-line no-undef
                if($('body').hasClass("toggled")){
                    console.log(`resize`);
                    // eslint-disable-next-line no-undef
                    $('body').removeClass("toggled");
                    // eslint-disable-next-line no-undef
                    $('.mMenuBtn').removeClass("mMenuBtn_open").addClass("mMenuBtn_close");

                }
            });
            Notification.notifyObservers('checkUserStatus');
        },
        computed:{
            menuKeys(){
                return [
                    { key: 'Android' , title: 'Android' , subTitle:'SDK', class1: 'icon_android_w', class2:'icon_android' },
                    { key: 'iOS' , title: 'iOS', subTitle:'SDK' , class1: 'icon_ios_w', class2:'icon_ios'},
                    { key: 'Windows' , title: 'Windows', subTitle:'SDK', class1: 'icon_windows_w', class2:'icon_windows' },
                    { key: 'Linux' , title: 'Linux', subTitle:'SDK' , class1: 'icon_linux_w', class2:'icon_linux' },
                    { key: 'Xamarin' , title: 'Xamarin', subTitle:'SDK' , class1: 'icon_xamarin_w', class2:'icon_xamarin' },
                    { key: 'Web' , title: 'Web', subTitle:'SDK' , class1: 'icon_web_w', class2:'icon_web' }
                ];
            },
            subMenuKeys(){
                return [
                    { path: 'gettingStart', label:'Getting Started' },
                    { path: 'sample', label:'Sample Projects' },
                    { path: 'api', label:'API Documentation' },
                    { path: 'faq', label:'FAQ' },
                ];
            },
        },
        methods:{
            docBtnEvent(){
                // eslint-disable-next-line no-undef
                if($('.docBtn').hasClass("rotate")){
                    // eslint-disable-next-line no-undef
                    $('.docBtn').removeClass("rotate").addClass("rotate1");
                    // eslint-disable-next-line no-undef
                    $('.docNav').removeClass("show").addClass("in");
                }else{
                    // eslint-disable-next-line no-undef
                    $('.docBtn').removeClass("rotate1").addClass("rotate");
                    // eslint-disable-next-line no-undef
                    $('.docNav').removeClass("in").addClass("");
                }
            },
            openMenu(){
                // eslint-disable-next-line no-undef
                $('body').toggleClass("toggled");
                // eslint-disable-next-line no-undef
                if($('.mMenuBtn').hasClass("mMenuBtn_close")){
                    // eslint-disable-next-line no-undef
                    $('.mMenuBtn').removeClass("mMenuBtn_close").addClass("mMenuBtn_open");
                }else{
                    // eslint-disable-next-line no-undef
                    $('.mMenuBtn').removeClass("mMenuBtn_open").addClass("mMenuBtn_close");
                }
            },
            toIndexPage(){
                this.openMenu();
                if (this.$router.currentRoute.path.indexOf('index') === -1){
                    this.$router.push('/index');
                }
            },
            signInEvent(){
                this.openMenu();
                if (this.$router.currentRoute.path.indexOf('login') === -1){
                    this.$router.push({ path : '/login'});
                }
            },
            changePage(page){
                this.openMenu();
                if (this.$router.currentRoute.path.indexOf(page.path) === -1){
                    this.$router.push(page);
                }
            },
        }
    }
</script>

<style scoped src="../../assets/css/all.css">
</style>
