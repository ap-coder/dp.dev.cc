<template>
    <div>
        <div id="editUser_PopWd" class="PopupWindow" :class="{ 'PopWdshow': dialogInfo.visible }">
            <slot></slot>
        </div><!--PopupWindow-->
        <div id="blockOverlay" :class="{ 'blockshow': dialogInfo.visible }"></div>
    </div>
</template>

<script>
import common from '@M/common';

export default {
    mixins: [common],
    methods: {
        closeHandle() {
            this.hideDialog();
        }
    }
}
</script>

<style scoped src="../../assets/css/all-admin.css"></style>