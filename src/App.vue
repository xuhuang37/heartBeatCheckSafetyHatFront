<template>
  <div id="app" ref="app">
    <!-- 音频 -->
    <audio src="../static/voice/welcome.wav" preload="auto"></audio>
    <audio src="../static/voice/reconnect.wav" preload="auto"></audio>
    <audio src="../static/voice/unlawful.wav" preload="auto"></audio>
    <audio src="../static/voice/successful.wav" preload="auto"></audio>
    <transition name="el-zoom-in-center">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import EventBus from './common/eventBus'
import * as types from './common/order-types'

export default {
  name: 'app',
  data() {
    return {
      voiceString: '',
      voiceFlag: true,
      relinkFlag: true,
      message: '',
      //websocket实例
      ws: {},
      //websocket url
      wsUrl: 'ws://60.171.122.59:3032',
      //避免重复连接
      lockReconnect: false,
      //心跳检测
      heartCheck: {
        timeout: 58000,//58秒
        timeoutObj: null,
        serverTimeoutObj: null,
        reset: function () {
          clearTimeout(this.timeoutObj);
          clearTimeout(this.serverTimeoutObj);
          return this;
        },
        start: function (ws) {
          var _this = this;
          this.timeoutObj = setTimeout(function () {
            //发送一个心跳，后端收到后，返回一个心跳消息，
            //onmessage拿到返回的心跳就说明连接正常
            ws.send(types.HEART_BEAT)
            _this.serverTimeoutObj = setTimeout(function () {
              //如果超过一定时间还没重置，说明后端主动断开了
              ws.close();
              //如果onclose会执行reconnect，我们执行ws.close()就行了.如果直接执行reconnect 会触发onclose导致重连两次
            }, _this.timeout)
          }, _this.timeout)
        }
      },
    }
  },
  mounted() {
    var _this = this
    this.createWebSocket(this.wsUrl)
    EventBus.$on('voiceToggle', data=>{
      _this.voiceFlag = data
    })
  },
  methods: {
    createWebSocket(url) {
      try {
        this.ws = new WebSocket(url);
        this.initEventHandle(url);
      } catch (e) {
        this.reconnect(url);
      }
    },
    //初始化ws事件函数
    initEventHandle(url) {
      var _this = this;
      this.ws.onclose = function (event) {
        console.log('close', event);
        _this.reconnect(url);
      };
      this.ws.onerror = function (error) {
        console.log('onerror');
        console.log(arguments)
        _this.reconnect(url);
      };
      this.ws.onopen = function (event) {
        _this.tipVoice(3)
        _this.notifyBox(1)
        //订阅图片
        _this.ws.send(types.SUBS_IMG)
        console.log('open', event);
        _this.$store.dispatch('linkFlag', false)
        //心跳检测重置
        _this.heartCheck.reset().start(_this.ws);
      };
      this.ws.onmessage = function (event) {
        //如果获取到消息，心跳检测重置
        //拿到任何消息都说明当前连接是正常的
        _this.$store.dispatch('linkFlag', false)
        console.log('onmessage', event);
        console.log(event.data)
        var obj = eval('(' + event.data + ')');
        console.log(obj)
        if (obj.SUBS_IMG) {
          _this.tipVoice(2)
          EventBus.$emit('img', obj.SUBS_IMG)
          _this.notifyBox(3)
        }
        _this.heartCheck.reset().start(_this.ws);
      }
    },
    //重连
    reconnect(url) {
      var _this = this
      this.tipVoice(1)
        _this.$store.dispatch('linkFlag', true)
      this.relinkFlag = true
      if (this.lockReconnect) return;
      this.lockReconnect = true;
      //没连接上会一直重连，设置延迟避免请求过多
      setTimeout(function () {
        _this.createWebSocket(url);
        _this.lockReconnect = false;
      }, 3000);
    },
    //提示音
    tipVoice(keyNum) {
      var _this = this
      var audioList = this.$refs.app.querySelectorAll('audio')
      if (!this.voiceFlag) {
        return;
      }
      audioList[keyNum].play()
    },

    notifyBox(keyNum) {
      switch (keyNum) {
        case 1:
          this.$notify.close()
          this.$notify({
            title: '成功',
            message: '已成功连接到系统',
            type: 'success'
          })
          break;
        case 2:
          this.$notify.close()
          this.$notify({
            title: '重连',
            message: '重连做业中，请耐心等待',
            type: 'error',
          })
          break;
        case 3:
          this.$notify.close()
          this.$notify({
            title: '警告',
            message: '检查到违规着装',
            type: 'warning',
          })
          break;
        default:
          break;
      }
    }
  }
}

</script>

<style>

</style>
