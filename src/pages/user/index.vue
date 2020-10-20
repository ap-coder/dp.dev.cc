<template>
    <div class="usersDiv">
        <ul class="userUl">
            <li @click="tabName = USERS"><a :class="{ 'now': tabName === USERS }">Users</a></li>
            <li @click="tabName = GROUP"><a :class="{ 'now': tabName === GROUP }">Groups</a></li>
            <div class="clear"></div>
        </ul>
        <components :is="tabName" />
    </div><!--usersDiv-->
</template>

<script>
import common from '@M/common';

export default {
    mixins: [common],
    components: {
        Users: () => import(/* webpackChunkName: 'Users' */ './Users'),
        Group: () => import(/* webpackChunkName: 'Group' */ './Group')
    },
    data() {
        return {
            USERS: 'Users',
            GROUP: 'Group'
        }
    },
    computed: {
        tabName: {
            set(val) {
                this.$router.replace({ path: 'users', query: { tab: val } });
            },
            get() {
                return this.$route.query.tab || this.USERS;
            }
        }
    }
}
</script>
<style scoped src="../../assets/css/all-admin.css">

</style>
