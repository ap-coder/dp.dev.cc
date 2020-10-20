<template>
    <div>
        <!--彈出視窗-->
        <v-dialog
                v-model="visible"
                persistent
                :max-width="width">
            <v-card>

                <v-card-text>
                    <v-layout row wrap align-center justify-center>
                        <v-flex xs3>
                            <v-progress-circular
                                    :size="60"
                                    :width="7"
                                    color="blue"
                                    indeterminate
                            ></v-progress-circular>
                        </v-flex>
                        <v-flex xs7>
                            <span class="title">{{content}}</span>
                        </v-flex>
                    </v-layout>

                </v-card-text>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
    import MobileDetect from 'mobile-detect';
    const md = new MobileDetect(window.navigator.userAgent);
    export default {
        name: "ProgressView",
        props: {
            visible: Boolean,
            content: String,
        },
        data() {
            return {
                width: md.phone() ? '85%' : '40%',
            };
        },
    }
</script>

<style scoped>

</style>
