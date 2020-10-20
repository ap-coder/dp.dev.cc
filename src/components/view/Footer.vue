<template>
   <div>
       <a href="#" ref="top" v-if="showTopButton"
          id="top" @click="toTop"><span class="arrow"></span>TOP</a>
       <div class="footer-contact">
           <ul>
               <li><h6>CODE (GLOBAL HQ)</h6></li>
               <li>
                   434 West Ascension Way |<br/>
                   Suite 300 | Murray, UT  84123
               </li>
               <li>Phone: (801) 495-2200</li>
               <li>Fax: (801) 495-2202</li>
           </ul>
           <ul>
               <li><h6>CODE TECHNOLOGY CENTER (TACHYONIQ)</h6></li>
               <li>
                   43 Nagog Park | Suite 215 |<br/>
                   Acton MA 01720
               </li>
               <li>Phone: (801) 495-2200</li>
               <li>Fax: (801) 495-0280</li>
               <li>Web: <a href="https://www.tachyoniq.com/" target="_new">tachyonIQ.com</a></li>
           </ul>
           <ul>
               <li><h6>CODE BV (EMEA)</h6></li>
               <li>
                   Tolnasingel 1 2411 PV |<br/>
                   Bodegraven The Netherlands
               </li>
               <li>Phone: +31-172636867</li>
           </ul>
       </div><!--end of footer-contact-->
       <div class="footer-copyright">
           <p>© Copyright   |   Code Corporation   |   All Rights Reserved</p>
       </div><!--end of footer-copyright-->
   </div>
</template>

<script>
    export default {
        name: "Footer",
        data(){
          return {
              showTopButton: false,
          }
        },
        created(){

            const self = this;
            // eslint-disable-next-line no-unused-vars,no-undef
            $(window).scroll(function() {
                self.showTopButton = parseInt(window.scrollY) > 200;
            });
        },
        methods:{
            toTop(){
                // eslint-disable-next-line no-undef
                $('html,body').animate({scrollTop: '0px'}, 800);
            }
        }
    }
</script>

<style scoped src="../../assets/css/all.css">

</style>
