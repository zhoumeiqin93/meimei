<template>
  <div class="dashboard-container">

    <el-table
      ref="multipleTable"
      :data="departmentInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="name"
        label="名称">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="部门代码">
      </el-table-column>
      <el-table-column
        prop="responsibility"
        label="职能">
      </el-table-column>
      <el-table-column
        prop="parentDepartment"
        label="上级部门">
      </el-table-column>
      <el-table-column
        prop="childrenDepartment"
        label="下级部门">
      </el-table-column>
      <el-table-column
        prop="staffSize"
        label="编制人员数量">
      </el-table-column>
      <el-table-column
        prop="actualSize"
        label="实际人员数量">
      </el-table-column>
      <!--<el-table-column
        label="查看"
        width="150">
        <template slot-scope="scope">
          <el-button @click="departmentDetail(scope.row)" type="primary" size="small">查看详情</el-button>
        </template>
      </el-table-column>-->
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
    getDepartMentInfo,
    getDepartmentDetail,
    editCompany,
    addCompany
  } from '@/api/departmentInfo'

  export default {
    name: "department-info",
    data() {
      return {
        departmentInfoList: [], // 部门信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
      }
    },
    created() {
      let vue = this
      vue.getDepartmentInfoMethods()
    },
    methods: {
      // 获取部门信息
      getDepartmentInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
        }
        getDepartMentInfo(data).then(response => {
          vue.departmentInfoList = response.data.data
          vue.pageInfo = response.data.pageInfo
          for (let i in vue.departmentInfoList) {
            vue.departmentInfoList[i].childrenDepartment = vue.getDepartmentContact(vue.departmentInfoList[i].childrenDepartmentList)
          }
          vue.loading = false
        }).catch(() => {
          vue.loading = false
          console.log('获取失败')
        })
      },
      // 获取部门字段
      getDepartmentContact: function (item) {
        if (item && item.length) {
          return item.map(function (val) {
            return val.name
          }).join(',')
        } else {
          return '无'
        }
      },
      handleSizeChange(val) {
        let vue = this
        console.log(`每页 ${val} 条`)
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = val
        vue.getDepartmentInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getDepartmentInfoMethods()
      },
    }
  }
</script>

<style scoped>

</style>
