<template>
   <div>
       <div class="title">
           <h1>Verify Email</h1>
           <bread-view :bread-menu="breadMenu"></bread-view>
       </div><!--end of title-->
       <div class="register">
           <div class="form">
               <h3 v-if="status || status === 1 || status === true">Your email has been verified.</h3>
               <h3 v-else>Your email has not verified.</h3>
               <p>Once your access has been approved, you will receive an email for accessing the developer portal.</p>
           </div><!--end of form-->
       </div>
   </div>
</template>

<script>
    import BreadView from "../components/view/BreadView";
    export default {
        name: "verifyEmailView",
        components: {BreadView},
        data(){
            return {
                status: false,
            }
        },
        created(){
            this.status = this.$route.query.s === '1';
        },
        computed:{
            breadMenu(){
                return [
                    { key: 'index', label:'Index' },
                    // { key: 'login', label:'Sign In' },
                    // { key: 'register', label:'Sign Up' },
                    { key: 'verifyEmail', label:'Verify Email' },
                ];
            }
        }
    }
</script>

<style scoped src="../assets/css/all.css">

</style>
