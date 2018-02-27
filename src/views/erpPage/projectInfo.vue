<template>
  <div class="dashboard-container">
    <!--查询条件-->
    <el-input
      placeholder="请输入小屋序号"
      style="width: 200px;margin-left: 10px" v-model="serialNumber">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-input
      placeholder="请输入项目名称"
      style="width: 200px;margin-left: 10px" v-model="projectName">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-select @change='' style="margin-left: 10px" class="filter-item" v-model="customerType"
               placeholder="请选择客户类别">
      <el-option v-for="item in customerTypeList" :label="item.text" :key="item.name" :value="item.name">
      </el-option>
    </el-select>
    <el-select @change='' style="margin-left: 10px" class="filter-item" v-model="projectStatus"
               placeholder="请选择项目状态">
      <el-option v-for="item in projectStatusList" :label="item.text" :key="item.name" :value="item.name">
      </el-option>
    </el-select>
    <el-select @change='' style="margin-left: 10px" class="filter-item" v-model="contractParty"
               placeholder="请选择客户类别">
      <el-option v-for="item in contractPartyList" :label="item.text" :key="item.name" :value="item.name">
      </el-option>
    </el-select>
    <!--表格操作按钮-->
    <el-button type="primary" @click="getProjectInfoMethods()">查询</el-button>
    <el-table
      ref="multipleTable"
      :data="projectInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="编码">
      </el-table-column>
      <el-table-column
        prop="projectName"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="customerFlag.text"
        label="客户类型">
      </el-table-column>
      <el-table-column
        prop="projectStatus.text"
        label="签约状态">
      </el-table-column>
      <el-table-column
        prop="contractParty.text"
        label="签约主体">
      </el-table-column>
      <el-table-column
        prop="contractTime"
        label="合同时间">
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
    getProjectInfo,
    getContractParty,
    getCustomerType,
    getProjectStatus,
  } from '@/api/projectInfo'

  import Vue from "vue"

  export default {
    name: "customer-info",
    data() {
      return {
        projectInfoList: [], // 部门信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        // 查询条件
        serialNumber: null,
        projectName: null,
        customerType: null,
        customerTypeList: null,
        projectStatus: null,
        projectStatusList: null,
        contractParty: null,
        contractPartyList: null,
      }
    },
    created() {
      let vue = this;
      vue.getProjectInfoMethods()
      vue.getContractPartyList()
      vue.getCustomerTypeList()
      vue.getProjectStatusList()
    },
    methods: {
      //获取客户信息列表
      getProjectInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
          serialNumber: vue.serialNumber,
          projectName: vue.projectName,
          customerFlag: vue.customerType,
          projectStatus: vue.projectStatus,
          contractParty: vue.contractParty,
        }
        getProjectInfo(data).then(response => {
          vue.projectInfoList = response.data.data
          for (let i in vue.projectInfoList) {
            vue.projectInfoList[i].contractTime = vue.projectInfoList[i].contractStartTime.substr(0, 10) + '~' + vue.projectInfoList[i].contractEndTime.substr(0, 10)
          }
          vue.pageInfo = response.data.pageInfo;
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
        vue.getProjectInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getProjectInfoMethods()
      },
      getContractPartyList: function () {
        let vue = this
        // 获取签约主体枚举
        getContractParty().then(response => {
          vue.contractPartyList = response.data.data
          vue.codeDelete(vue.contractPartyList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      getCustomerTypeList: function () {
        let vue = this
        getCustomerType().then(response => {
          vue.customerTypeList = response.data.data
          vue.codeDelete(vue.customerTypeList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      getProjectStatusList: function () {
        let vue = this
        getProjectStatus().then(response => {
          vue.projectStatusList = response.data.data
          vue.codeDelete(vue.projectStatusList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      codeDelete: function (item) {
        for (let i in item) {
          if (item[i].code <= 0) {
            item.splice(i, 1)
          }
        }
        return item
      }
    }
  }
</script>

<style scoped>

</style>
