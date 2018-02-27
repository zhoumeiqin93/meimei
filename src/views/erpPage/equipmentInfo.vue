<template>
  <div class="dashboard-container">
    <div class="demo-input-suffix" style="padding: 10px;" v-loading="loading">
      <!--下拉菜单-->
      <el-select @change='getDepartMentSubList(department)' style="width: 140px" class="filter-item"
                 v-model="department" placeholder="请选择部门">
        <el-option v-for="item in departmentList" :label="item.name" :key="item.id" :value="item.id">
        </el-option>
      </el-select>
      <el-select @change='' style="width: 140px;margin-left: 10px" class="filter-item" v-model="departmentSub"
                 placeholder="请选择子部门"
                 :disabled="canChooseSubDepart">
        <el-option v-for="item in departmentSubList" :label="item.name" :key="item.id" :value="item.id">
        </el-option>
      </el-select>
      <!--设备状态-->
      <el-select @change='' style="width: 150px;margin-left: 10px" class="filter-item" v-model="assetStatus"
                 placeholder="请选择设备状态">
        <el-option :key="''" :label="'全部'" :value="''"></el-option>
        <el-option v-for="item in CompanyAssetsList" :key="item.name" :label="item.text" :value="item.name"></el-option>
      </el-select>
      <!--搜索框-->
      <el-input
        placeholder="请输入设备名称"
        style="width: 200px;margin-left: 10px" v-model="name">
        <i slot="prefix" class="el-input__icon el-icon-search"></i>
      </el-input>
      <!--表格操作按钮-->
      <el-button type="primary" @click="getEquipmentInfoMethods('true')">查询</el-button>
      <br/> <br/>
      <el-table
        ref="multipleTable"
        :data="equipmentInfoList"
        border
        tooltip-effect="dark"
        style="width: 100%">
        <el-table-column
          type="index"
          width="50"
          label="序号">
        </el-table-column>
        <el-table-column
          prop="assets.name"
          label="设备名称">
        </el-table-column>
        <el-table-column
          prop="department.name"
          label=" 所属部门">
        </el-table-column>
        <el-table-column
          prop="assets.unit"
          label=" 设备单位">
        </el-table-column>
        <el-table-column
          prop="assetsStatus.text"
          label=" 状态">
        </el-table-column>
        <el-table-column
          prop="note"
          label=" 备注">
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
  import {
    getDepartMentInfo,
    getEquipmentInfo,
    getCompanyAssets,
  } from '@/api/equipmentInfo'

  export default {
    data() {
      return {
        equipmentInfoList: [], // 设备信息列表
        multipleSelection: [],
        dialogVisible: false,
        // 编辑界面显示
        departmentList: [],
        departmentSubList: [],
        loading: true,
        department: null,
        departmentSub: null,
        // 能不能下拉选择
        canChooseSubDepart: true,
        assetStatus: null,
        CompanyAssetsList: [],
        name: null, // 设备名字
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
      }
    },
    created() {
      let vue = this
      console.log(this.$router)
      this.loading = true
      // 获取部门信息
      getDepartMentInfo().then(response => {
        vue.departmentList = response.data.data
        vue.getEquipmentInfoMethods()
      }).catch(() => {
        this.loading = false
        console.log('获取失败')
      })
      // 获取设备状态的枚举
      vue.getCompanyAssetsMethods()
    },

    methods: {
      // 获取子部门
      getDepartMentSubList: function (item) {
        let vue = this
        if (vue.addDialogVisible) {
          vue.addAssetsData.extId = item
          vue.addDepartmentSub = null
        } else if (vue.editDialogVisible) {
          vue.editAssetsData.extId = item
          vue.editDepartmentSub = null
        } else {
          vue.departmentSub = null
        }
        vue.canChooseSubDepart = true
        for (let i in vue.departmentList) {
          if (vue.departmentList[i].id === item) {
            vue.departmentSubList = vue.departmentList[i].childrenDepartmentList
            if (vue.departmentList[i].childrenDepartmentList.length) {
              vue.canChooseSubDepart = false
            }
            return
          }
        }
      },
      // 获取设备资产信息
      getEquipmentInfoMethods: function (isClear) {
        let vue = this
        if (isClear) {
          vue.pageInfo.offset = 0
          vue.pageInfo.limit = 8
        }
        let getEquipmentInfoParams = {
          extId: vue.department,
          name: vue.name,
          assetStatus: vue.assetStatus,
          offset: vue.pageInfo.offset,
          limit: vue.pageInfo.limit
        }
        if (vue.departmentSub) {
          getEquipmentInfoParams.extId = vue.departmentSub
        }
        getEquipmentInfo(getEquipmentInfoParams).then(response => {
          console.log(response.data.data)
          vue.equipmentInfoList = response.data.data
          vue.pageInfo = response.data.pageInfo
          this.loading = false
        }).catch(() => {
          this.loading = false
          console.log('获取失败')
        })
      },
      // 获取设备状态的枚举
      getCompanyAssetsMethods: function () {
        let vue = this
        // 获取公司设备类别枚举类型
        getCompanyAssets().then(response => {
          vue.CompanyAssetsList = response.data.data
        }).catch(() => {

          this.loading = false;
          console.log('获取失败')
        })
      },
      handleSizeChange(val) {
        let vue = this
        console.log(`每页 ${val} 条`)
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = val
        vue.getEquipmentInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getEquipmentInfoMethods()
      },
    }
  }
</script>

<style scoped>

</style>
