<template>
  <div class="dashboard-container">

    <el-table
      ref="multipleTable"
      :data="supplierInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="identificationNumberOfTheTaxpayer"
        label="纳税人识别号">
      </el-table-column>
      <el-table-column
        prop=""
        label="开户银行及账号">
        <template slot-scope="scope">
          {{scope.row.depositBank}}{{scope.row.bankAccount}}
        </template>
      </el-table-column>
      <el-table-column
        prop="detailAddress"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="fullName"
        label="组织全称">
      </el-table-column>
      <el-table-column
        prop="provideGoodsServices"
        label="提供的商品和服务">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="供应商代码">
      </el-table-column>
      <el-table-column
        prop="supplierType.text"
        label="供应商类别">
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
    getSupplierInfo,
  } from '@/api/supplierInfo'

  import Vue from "vue"

  export default {
    name: "department-info",
    data() {
      return {
        supplierInfoList: [], // 供应商信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
      }
    },
    created() {
      let vue = this
      vue.getSupplierInfoMethods()
    },
    methods: {
      getSupplierInfoMethods: function () {
        let vue = this
        // 获取供应商信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
        }
        getSupplierInfo(data).then(response => {
          vue.supplierInfoList = response.data.data
          vue.pageInfo=response.data.pageInfo
          for (let i in vue.supplierInfoList) {
            vue.supplierInfoList[i].childrenDepartment = vue.getDepartmentContact(vue.supplierInfoList[i].childrenDepartmentList)
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
        vue.getSupplierInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getSupplierInfoMethods()
      },
      changeShow: function (item) {
        console.log(item)
        // item.showMoreInfo= !item.showMoreInfo
        Vue.set(item, 'showMoreInfo', !item.showMoreInfo)
        // console.log(item.showMoreInfo)
      }
    }
  }
</script>

<style scoped>

</style>
