<template>
    <v-app>
        <div class="wrapper">
            <div id="navBar" class="navBar">
                <NavBar></NavBar>
            </div><!--end of navBar-->
            <div class="content">
                <router-view></router-view>
                <div id="footer">
                    <Footer></Footer>
                </div><!--end of footer-->
            </div><!--end of content-->
        </div><!--end of wrapper-->
    </v-app>
</template>

<script>
    import NavBar from "../../components/view/NavBar";
    import Footer from "../../components/view/Footer";
    export default {
        name: "index",
        components: { NavBar , Footer},
        data(){
            return {
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
