<template>
    <div class="bread">
        <span v-for="(menu , i) in breadMenu" :key="menu.key">
            <span class="icon" v-if="i===0"></span>
            <span class="dot" v-else></span>
            <a href="#" target="_self" @click.prevent="changePage(menu.key)">{{menu.label}}</a>
        </span>
    </div>
</template>

<script>
    export default {
        name: "BreadView",
        props:{
          breadMenu: Array,
        },
        methods:{
            changePage(key){
                console.log(`changePage ${key}`);
                if (this.$router.currentRoute.path.indexOf(key) === -1){
                    this.$router.push({ path : `/${key}`});
                }
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
