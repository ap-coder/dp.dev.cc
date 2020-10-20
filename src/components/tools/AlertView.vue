<template>
  <div>
    <!--彈出視窗-->
    <div id="contractDelete_PopWd" class="PopupWindow" :class="{ 'PopWdshow': alertInfo.visible }" style="z-index: 1001">
      <div class="PopupFrame">
        <div class="popTitle clearfix"><h1>{{alertInfo.title}}</h1><a class="btnClose" @click="alertInfo.cancelEvent"></a></div>
        <div class="pop_content">
          <p>{{alertInfo.content}}</p>
          <div class="popBtnBar">
            <a v-if="alertInfo.showCancel"  class="blueBtn popCancelBtn" @click="alertInfo.cancelEvent">Cancel</a>
            <a class="red2Btn" @click="alertInfo.confirmEvent">OK</a>
          </div>

        </div><!--pop_content-->
      </div><!--frame-->
    </div><!--PopupWindow-->
    <div id="blockOverlay" :class="{ 'blockshow': alertInfo.visible }" style="z-index: 1000;"></div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex';
import MobileDetect from 'mobile-detect';
const md = new MobileDetect(window.navigator.userAgent);

export default {
  name: 'AlertView',
  data() {
    return {
      width: md.phone() ? '90%' : '40%',
    };
  },
  created() {},
  computed: {
      ...mapGetters([
          'alertInfo'
      ])
  },
  methods: {}
};
</script>

<style scoped src="../../assets/css/all-admin.css"></style>
