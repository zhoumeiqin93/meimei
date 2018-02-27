<template>
  <div class="dashboard-container">
    <div class="demo-input-suffix" style="padding: 10px;" v-loading="loading">
      <!--日志类型-->
      <el-select @change='' style="width: 200px;margin-left: 10px" class="filter-item" v-model="logType"
                 placeholder="请选择日志类型">
        <el-option :key="''" :label="'全部'" :value="''"></el-option>
        <el-option v-for="item in logTypeList" :key="item.name" :label="item.text" :value="item.name"></el-option>
      </el-select>
      <!--表格操作按钮-->
      <el-button type="primary" @click="getLogListMethods('true')">查询</el-button>
      <el-table
        ref="multipleTable"
        :data="logList"
        border
        tooltip-effect="dark"
        style="width: 100%;margin-top: 10px"
        :default-sort="{prop: 'createDate', order: 'descending'}">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="content"
          label="操作内容">
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="操作人">
        </el-table-column>
        <el-table-column
          prop="operatorName"
          label="账号">
        </el-table-column>
        <el-table-column
          prop="createDate"
          sortable
          label="操作时间">
        </el-table-column>
        <el-table-column
          prop="logType.text"
          label="日志类型">
        </el-table-column>
        <el-table-column
          prop="ipAddress"
          label="IP地址">
        </el-table-column>
      </el-table>
      <!--分页-->
      <div class="block" style="text-align: right;margin-top: 10px">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageInfo.pageNum"
          :page-sizes="[5,10,15]"
          :page-size="pageInfo.limit"
          layout="total, sizes, prev, pager, next, jumper"
          :total="pageInfo.totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
  import {getLogListInfo, logTypeListInfo} from '@/api/operationLog'

  export default {
    name: "operation-log",
    data() {
      return {
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        logType: null,
        logTypeList: [],
        logList: []
      }
    },
    created() {
      let vue = this
      this.loading = true
      // 获取部门信息
      logTypeListInfo().then(response => {
        vue.logTypeList = response.data.data
        vue.getLogListMethods()
      }).catch(() => {
        this.loading = false
        console.log('获取日志列表失败')
      })
    },
    methods: {
      getLogListMethods: function (isClear) {
        let vue = this
        if (isClear) {
          vue.pageInfo.offset = 0
          vue.pageInfo.limit = 8
        }
        let data = {
          logType: vue.logType,
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset
        }
        getLogListInfo(data).then(response => {
          console.log(response.data.data)
          vue.logList = response.data.data
          console.log(vue.logList);
          vue.pageInfo = response.data.pageInfo
          this.loading = false
        }).catch(() => {
          this.loading = false
          console.log('获取失败')
        })
      },
      handleSizeChange(val) {
        let vue = this
        console.log(`每页 ${val} 条`)
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = val
        vue.getLogListMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getLogListMethods()
      }
    }
  }
</script>

<style scoped>

</style>
