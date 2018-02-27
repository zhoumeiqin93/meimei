<template>
  <div class="dashboard-container">
    <!--查询条件-->
    <el-input
      placeholder="请输入个人电话"
      style="width: 200px;margin-left: 10px" v-model="mobilephones">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-input
      placeholder="请输入证件号"
      style="width: 200px;margin-left: 10px" v-model="idCardNo">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-select @change='' style="margin-left: 10px" class="filter-item" v-model="appellation"
               placeholder="请选择专业职称">
      <el-option v-for="item in appellationList" :label="item.text" :key="item.name" :value="item.name">
      </el-option>
    </el-select>

    <!--表格操作按钮-->
    <el-button type="primary" @click="getTeacherInfoMethods()">查询</el-button>
    <el-table
      ref="multipleTable"
      :data="teacherInfoList"
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
        label="姓名">
      </el-table-column>
      <el-table-column
        prop="feeScale"
        label="收费标准">
      </el-table-column>
      <el-table-column
        prop="idCardType.text"
        label="证件类型">
      </el-table-column>
      <el-table-column
        prop="idCardNo"
        label="证件号">
      </el-table-column>
      <el-table-column
        prop="mobilephones"
        label="个人电话">
      </el-table-column>
    <!--  <el-table-column
        label="公司联系人">
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
        prop="note"
        label="备注">
      </el-table-column>
      <el-table-column
        prop="appellation.text"
        label="专业职称">
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
    getTeacherInfo,
    getAppellation
  } from '@/api/teacherInfo'

  import Vue from "vue"

  export default {
    name: "customer-info",
    data() {
      return {
        teacherInfoList: [], // 师资库信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        // 查询条件
        appellation: null,
        mobilephones: null,
        idCardNo: null,
        appellationList: null
      }
    },
    created() {
      let vue = this;
      vue.getTeacherInfoMethods()
      vue.getAppellationList();
    },
    methods: {
      //获取客户信息列表
      getTeacherInfoMethods: function () {
        let vue = this
        // 获取师资库信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
          appellation: vue.appellation,
          mobilephones: vue.mobilephones,
          idCardNo: vue.idCardNo,
        }
        getTeacherInfo(data).then(response => {
          vue.teacherInfoList = response.data.data
          for (let i in vue.teacherInfoList) {
            // 开户银行及账号
            vue.teacherInfoList[i].accountInfo = vue.teacherInfoList[i].depositBank + vue.teacherInfoList[i].bankAccount
            // 首次合作时间格式
            if (vue.teacherInfoList[i].firstCooperationDate) {
              vue.teacherInfoList[i].firstCooperationDate = vue.teacherInfoList[i].firstCooperationDate.substr(0, 10)
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
        vue.getTeacherInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getTeacherInfoMethods()
      },
      changeShow: function (item) {
        console.log(item)
        // item.showMoreInfo= !item.showMoreInfo
        Vue.set(item, 'showMoreInfo', !item.showMoreInfo)
        // console.log(item.showMoreInfo)
      },
      // 获取小屋类型列表
      getAppellationList: function () {
        let vue = this
        // 获取公司设备类别枚举类型
        getAppellation().then(response => {
          vue.appellationList = response.data.data
          for (let i in vue.appellationList) {
            if (vue.appellationList[i].code <= 0) {
              vue.appellationList.splice(i, 1)
            }
          }
        }).catch(() => {

          this.loading = false;
          console.log('获取失败')
        })
      }
    }
  }
</script>

<style scoped>

</style>
