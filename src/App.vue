<template>
  <div id="app">
    <router-view/>
    <div class="loading" v-if="showLoading">
      <v-progress-circular
        :size="50"
        color="#ad1f25"
        indeterminate></v-progress-circular>
    </div>
  </div>
</template>

<script>
import Notification from '@/utils/notice_manager';

export default {
  name: 'app',
  data(){
    return {
      showLoading: false,
    }
  },
  created() {
    Notification.addObserver('isLoading', (show)=>{
      this.showLoading = show;
    });
  }
}
</script>

<style>
  .application--wrap { background: #282828!important;}
  .loading {
    position: fixed;
    top: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, .5);
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .v-dialog {
    background: #fafafa;
  }
</style>
