<template>
  <div class="dashboard-container">
    <!--查询条件-->
    <el-input
      placeholder="请输入组织全称"
      style="width: 200px;margin-left: 10px" v-model="fullName">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-input
      placeholder="请输入客户代码"
      style="width: 200px;margin-left: 10px" v-model="serialNumber">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <!--<el-input-->
    <!--placeholder="请输入区域"-->
    <!--style="width: 200px;margin-left: 10px" v-model="name">-->
    <!--<i slot="prefix" class="el-input__icon el-icon-search"></i>-->
    <!--</el-input>-->
    <!--table-->
    <!--表格操作按钮-->
    <el-button type="primary" @click="getCustomerInfoMethods()">查询</el-button>
    <el-table
      ref="multipleTable"
      :data="customerInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
      <el-table-column
        type="index"
        width="50"
        label="序号">
      </el-table-column>
      <el-table-column
        prop="fullName"
        label="组织全称">
      </el-table-column>
      <el-table-column
        prop="serialNumber"
        label="客户代码">
      </el-table-column>
      <el-table-column
        prop="property.text"
        label="企业性质">
      </el-table-column>
      <el-table-column
        prop="identificationNumberOfTheTaxpayer"
        label="纳税人识别号">
      </el-table-column>
      <el-table-column
        prop="accountInfo"
        label="开户银行及账号">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
     <!-- <el-table-column
        label="联系人信息">
        <template slot-scope="scope">
          <div v-if="scope.row.linkmans.length">
            <div v-show="!scope.row.showMoreInfo">
              {{scope.row.linkmans[0].name}}:{{scope.row.linkmans[0].telephone}}
              <div v-if="scope.row.linkmans.length!=1">
                <a style="color: blue" @click="changeShow(scope.row)">更多>></a>
              </div>
            </div>
            <div v-show="scope.row.showMoreInfo">
              <div v-for="item in scope.row.linkmans">
                {{item.name}}:{{item.telephone}}<br/>
              </div>
              <a style="color: blue" @click="changeShow(scope.row)">收起<<</a>
            </div>
          </div>
        </template>
      </el-table-column>-->
      <el-table-column
        prop="firstCooperationDate"
        label="首次合作时间">
      </el-table-column>
      <el-table-column
        prop="enterpriseScale"
        label="企业规模（人数）">
      </el-table-column>
      <el-table-column
        prop="customerLevel.text"
        label="客户等级">
      </el-table-column>
      <el-table-column
        prop="customerType.text"
        label="客户类别">
      </el-table-column>
      <!--<el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="departmentDetail(scope.row)" type="primary" size="small"
                     class="el-icon-edit"></el-button>
          <el-button @click="deleteAssetsInfo(scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
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
    getCustomerInfo,
  } from '@/api/customerInfo'

  import Vue from "vue"

  export default {
    name: "customer-info",
    data() {
      return {
        customerInfoList: [], // 部门信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        // 查询条件
        fullName: null,// 组织全称
        serialNumber: null,// 客户代码
      }
    },
    created() {
      let vue = this;
      vue.getCustomerInfoMethods()
    },
    methods: {
      //获取客户信息列表
      getCustomerInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
          fullName: vue.fullName,
          serialNumber: vue.serialNumber
        }
        getCustomerInfo(data).then(response => {
          vue.customerInfoList = response.data.data
          for (let i in vue.customerInfoList) {
            // 开户银行及账号
            vue.customerInfoList[i].accountInfo = vue.customerInfoList[i].depositBank + vue.customerInfoList[i].bankAccount
            // 首次合作时间格式
            if (vue.customerInfoList[i].firstCooperationDate) {
              vue.customerInfoList[i].firstCooperationDate = vue.customerInfoList[i].firstCooperationDate.substr(0, 10)
            }
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
        vue.getCustomerInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getCustomerInfoMethods()
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
