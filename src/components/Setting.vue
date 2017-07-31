<template>
    <div>
        <mt-header title="设置" class="header" :class="{}">
            <router-link :to="position" slot="left">
                <mt-button icon="back">返回</mt-button>
            </router-link>
        </mt-header>
        <div>
            <mt-cell title="语音提示开关" style="background-color:#eee">
                <mt-switch v-model="voiceFlag" @change="voiceKey">
                </mt-switch>
            </mt-cell>
        </div>
    </div>
</template>
<script>
import EventBus from '../common/eventBus'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            voiceFlag: true
        }
    },
    computed: mapState({
        position:state => state.position,
        
    }),
    mounted() {

    },
    methods: {
        voiceKey(flag) {
            console.log('voiceFlag', this.voiceFlag)
            EventBus.$emit('voiceToggle', this.voiceFlag)
        }
    }
}
</script>
<style scoped>
.header {
    margin-bottom: 10px
}
</style>