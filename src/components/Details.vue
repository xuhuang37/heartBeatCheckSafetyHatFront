<template>
  <div>
  
    <mt-header :title="linkFlag?'详细(已断开连接)':'详细'" :class="{header: linkFlag}">
      <router-link to="/" slot="left">
        <mt-button icon="back">返回</mt-button>
      </router-link>
      <router-link to="/setting" slot="right">
        <mt-button @click="position">设置</mt-button>
      </router-link>
    </mt-header>
    <mt-cell :title="item.title" :value="item.value" v-for="item in dataList"></mt-cell>
    <img :src="rootUrl+imgId" style="width:100%">
  
  </div>
</template>
<script>
import EventBus from '../common/eventBus'
import { mapState } from 'vuex'

export default {
  data() {
    return {
      rootUrl: 'http://60.171.122.59:3031/api/file/',
      url: 'http://60.171.122.59:3031/api/videoInfo/paging',
      detailsObj: {},
      imgId: '',
      dataList: [],

    }
  },
  computed: mapState({
    details: state => state.detailsInRow,
    linkFlag: state => state.linkFlag

  }),
  mounted() {
    this.imgId = this.details.FileID
    this.detailsObj = this.details
    var detailList = []
    var status = ''
    if (this.detailsObj.Status == 0) {
      var status = '异常'
    } else if (this.detailsObj.Status == 1) {
      var status = '正常'
    } else {
      var status = '未检测'
    }
    this.dataList.push({ title: '时间', value: this.detailsObj.CreateDate })
    this.dataList.push({ title: '状态', value: status })
    this.dataList.push({ title: '监测点', value: this.detailsObj.PointID })
  },
  methods: {
    position() {
      this.$store.dispatch('position', '/details')
    }
  },
  watch: {
  }
}
</script>
<style scoped>
.header {
  background-color: #FFCC00
}
</style>

