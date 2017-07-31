<template>
    <div>
        <mt-header :title="linkFlag?'事件列表(已断开连接)':'事件列表'" style="margin-bottom:5px" :class="{header: linkFlag}">
            <router-link to="/setting" slot="right">
                <mt-button @click="position">设置</mt-button>
            </router-link>
        </mt-header>

        <el-table :data="dataList" style="width: 100%;margin-bottom:10px" stripe @row-click="toDetails">
            <el-table-column prop="CreateDate" label="时间">
            </el-table-column>
            <el-table-column prop="type" label="状态">
                <template scope='scope'>
                    <el-tag :type="scope.row.type=='异常'?'danger':scope.row.type=='正常'?'success':'warning'">{{scope.row.type}}</el-tag>
                  </template>
            </el-table-column>
            <el-table-column prop="PointID" label="监测点">
            </el-table-column>
        </el-table>
        <el-pagination 
        @size-change="handleSizeChange" 
        @current-change="handleCurrentChange" 
        :current-page.sync="page" 
        :page-size="10" 
        layout="prev, pager, next, jumper" 
        :total="1000">
        </el-pagination>
    </div>
</template>
<script>
import EventBus from '../common/eventBus'
import * as types from '../common/order-types'
import axios from 'axios'
import { mapState } from 'vuex'

export default {
    data() {
        return {
            dataList: [],
            page: 1,
            rootUrl: 'http://60.171.122.59:3031',
            url: 'http://60.171.122.59:3031/api/videoInfo/paging',
            imgId: '597d67cedd0cf2177cac6afe',
            total:0
        }
    },
    computed:mapState({
        linkFlag: state=>state.linkFlag
    }),
    mounted() {
        EventBus.$on('img', data => {
            this.getList()
        }),
            this.getList()
    },

    methods: {
        getList() {
            var _this = this
            axios.get(this.url, {
                params: {
                    key: '',
                    start: (_this.page - 1) * 10,
                    length: 10
                }
            }).then(function (res) {
                console.log(res)
                _this.total = res.data.Total
                for (var i in res.data.Rows) {
                    if(res.data.Rows[i].Status == 0){
                    res.data.Rows[i].type = '异常'
                    }else if (res.data.Rows[i].Status ==1) {
                        res.data.Rows[i].type = '正常'
                    }else {
                        res.data.Rows[i].type = '未检测'
                    }
                }
                _this.dataList = res.data.Rows
                console.log(11111, _this.dataList)
            })
        },
        toDetails(row, event, column) {
            this.$store.dispatch('toDetails', row)
            this.$router.push({ name: 'details' })
        },
        position() {
            this.$store.dispatch('position', '/list')
            console.log('/list')
        },
        handleSizeChange() {

        },
        handleCurrentChange(val) {
            this.page = val
            this.getList()
        }
    }

}
</script>
<style scoped>
    .header{
        background-color:#FFCC00 
    }
</style>
