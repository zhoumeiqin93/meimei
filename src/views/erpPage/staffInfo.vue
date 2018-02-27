<template>
  <div class="dashboard-container">

    <!--<el-button type="primary" @click="getStaffInfoMethods()">查询</el-button>-->
    <el-table
      ref="multipleTable"
      :data="staffInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="englishName"
        label="英文名">
      </el-table-column>
      <el-table-column
        prop="gender.text"
        label="性别">
      </el-table-column>
      <el-table-column
        label="用户职位">
        <template slot-scope="scope" v-if="scope.row.caste">
          {{scope.row.post}}{{scope.row.caste.text}}
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="电话">
        <template slot-scope="scope">
          <span v-for="item in scope.row.mobilephoneList">
            {{item}}<br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="电子邮箱">
        <template slot-scope="scope">
          <span v-for="item in scope.row.emailList">
            {{item}}<br/>
          </span>
        </template>
      </el-table-column>
      <el-table-column
        prop="hiredate"
        label="入职时间">
      </el-table-column>
      <el-table-column
        prop="contractTime"
        label="劳动合同起止时间">
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
</template>

<script>
  import {
    getStaffInfo,
  } from '@/api/staffInfo'

  import Vue from "vue"

  export default {
    name: "customer-info",
    data() {
      return {
        staffInfoList: [], // 员工信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
      }
    },
    created() {
      let vue = this;
      vue.getStaffInfoMethods()
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      //获取员工信息列表
      getStaffInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
        }
        getStaffInfo(data).then(response => {
          vue.staffInfoList = response.data.data
          vue.pageInfo = response.data.pageInfo;
          // 劳动合同起止时间
          for (let i in vue.staffInfoList) {
            vue.staffInfoList[i].contractTime = vue.staffInfoList[i].contractStartTime.substr(0, 10) + '~' + vue.staffInfoList[i].contractEndTime.substr(0, 10)
            // 入职时间
            vue.staffInfoList[i].hiredate = vue.staffInfoList[i].hiredate.substr(0, 10)

          }

          vue.loading = false
        }).catch(() => {
          vue.loading = false
          console.log('获取失败')
        })
      },
      handleSizeChange(val) {
        let vue = this
        console.log(`每页 ${val} 条`)
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = val
        vue.getStaffInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getStaffInfoMethods()
      },
    }
  }
</script>

<style scoped>

</style>
