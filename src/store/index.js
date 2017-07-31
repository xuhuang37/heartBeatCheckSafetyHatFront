import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
    state:{
        detailsInRow:{},
        voiceFlag:true,
        position:'',
        linkFlag:true
    },

    actions:{
        toDetails({commit}, row){
            commit('toDetails', row)
            console.log('actions',row)
        },
        voiceToggle({commit}, flag){
            commit('voiceToggle',flag)
        },
        position({commit},position){
            commit('position',position)
            console.log('position', position)
        },
        linkFlag({commit}, linkFlag){
            commit('linkFlag', linkFlag)
        }
    },

    mutations:{
        toDetails(state, payload){
            state.detailsInRow = payload
            console.log('toDetails',payload)      
        },
        voiceToggle(state,payload){
            state.voiceFlag = payload
        },
        position(state, payload){
            state.position = payload
        },
        linkFlag(state, payload){
            state.linkFlag = payload
        }
    }
})

export default store