<template>
  <div class="dashboard-container">
    <!--查询条件-->
    <el-input
      placeholder="请输入小屋名称"
      style="width: 200px;margin-left: 10px" v-model="name">
      <i slot="prefix" class="el-input__icon el-icon-search"></i>
    </el-input>
    <el-select @change='' style="margin-left: 10px" class="filter-item" v-model="type"
               placeholder="请选择健康小屋类型">
      <el-option v-for="item in hutTypeList" :label="item.text" :key="item.name" :value="item.name">
      </el-option>
    </el-select>

    <el-date-picker
      v-model="beforeRegisterDate"
      type="date"
      placeholder="选择日期">
    </el-date-picker>

    <el-button type="primary" @click="getHutInfoMethods()">查询</el-button>
    <el-table
      ref="multipleTable"
      :data="hutInfoList"
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
        label="代码">
      </el-table-column>
      <el-table-column
        prop="type.text"
        label="类型">
      </el-table-column>
      <el-table-column
        prop="areaFull.county.areaName"
        label="城市">
      </el-table-column>
      <el-table-column
        prop="address"
        label="地址">
      </el-table-column>
      <el-table-column
        prop="registerDate"
        label="成立时间">
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
    getHutInfo,
    getHutType
  } from '@/api/hutInfo'

  export default {
    name: "customer-info",
    data() {
      return {
        hutInfoList: [], // 小屋信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        // 小屋查询条件
        areaId: null, //城市
        type: null, //小屋类型
        name: null, //小屋名称
        beforeRegisterDate: null, //小屋成立时间
        hutTypeList: null, // 小屋类型
      }
    },
    created() {
      let vue = this;
      vue.getHutInfoMethods();
      vue.getHutTypeList()
    },
    methods: {
      //获取小屋信息列表
      getHutInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
          areaId: vue.areaId,
          type: vue.type,
          name: vue.name,
          beforeRegisterDate: vue.beforeRegisterDate,
        }
        getHutInfo(data).then(response => {
          vue.hutInfoList = response.data.data
          for (let i in vue.hutInfoList) {
            // 成立时间
            vue.hutInfoList[i].registerDate = vue.hutInfoList[i].registerDate.substr(0, 10)

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
        vue.getHutInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getHutInfoMethods()
      },
      // 获取小屋类型列表
      getHutTypeList: function () {
        let vue = this
        // 获取公司设备类别枚举类型
        getHutType().then(response => {
          vue.hutTypeList = response.data.data
          for (let i in vue.hutTypeList) {
            if (vue.hutTypeList[i].code <= 0) {
              vue.hutTypeList.splice(i, 1)
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
