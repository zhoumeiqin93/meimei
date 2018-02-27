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
      <el-button type="success" @click="addEquipmentMethods()">新增</el-button>
      <el-button type="danger" @click="deleteAssetsInfo()">删除</el-button>
      <br/> <br/>
      <el-table
        ref="multipleTable"
        :data="equipmentInfoList"
        border
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange">
        <el-table-column
          type="selection"
          width="55">
        </el-table-column>
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
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small"
                       class="el-icon-edit"></el-button>
            <el-button @click="deleteAssetsInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                       type="danger"></el-button>
          </template>
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
      <!--新增界面-->
      <el-dialog
        title="新增公司设备"
        :visible.sync="addDialogVisible"
        width="50%">
        <el-form :rules="addAssetsRules" ref="addAssetsData" :model="addAssetsData" label-position="left"
                 label-width="100px"
                 style='width: 400px; margin-left:20px;'>
          <el-form-item label="设备名称" prop="assetsId">
            <el-select @change='' class="filter-item" v-model="addAssetsData.assetsId">
              <el-option v-for="item in assetsList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="extId">
            <el-input v-model="addAssetsData.extId" style="display: none"></el-input>
            <el-select @change='getDepartMentSubList(addDepartment)' style="width: 140px" class="filter-item"
                       v-model="addDepartment" placeholder="请选择部门">
              <el-option v-for="item in departmentList" :label="item.name" :key="item.id" :value="item.id">
              </el-option>
            </el-select>
            <el-select @change='getExtId(addDepartmentSub)' style="width: 140px;margin-left: 10px" class="filter-item"
                       v-model="addDepartmentSub"
                       placeholder="请选择子部门"
                       :disabled="canChooseSubDepart">
              <el-option v-for="item in departmentSubList" :label="item.name" :key="item.id" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="assetStatus">
            <el-select @change='' class="filter-item" v-model="addAssetsData.assetStatus">
              <el-option v-for="item in CompanyAssetsList" :key="item.name" :label="item.text"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="addAssetsData.note"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="addDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitAddInfo()">确 定</el-button>
        </span>
      </el-dialog>
      <!--编辑界面-->
      <el-dialog
        title="编辑公司设备"
        :visible.sync="editDialogVisible"
        width="50%">
        <el-form :rules="editAssetsRules" ref="editAssetsData" :model="editAssetsData" label-position="left"
                 label-width="100px"
                 style='width: 400px; margin-left:20px;'>
          <el-form-item label="设备名称" prop="assetsId">
            <el-select @change='' class="filter-item" v-model="editAssetsData.assetsId">
              <el-option v-for="item in assetsList" :key="item.id" :label="item.name"
                         :value="item.id"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="所属部门" prop="extId">
            <el-input v-model="editAssetsData.extId" style="display: none"></el-input>
            <el-select @change='getDepartMentSubList(editDepartment)' style="width: 140px" class="filter-item"
                       v-model="editDepartment" placeholder="请选择部门">
              <el-option v-for="item in departmentList" :label="item.name" :key="item.id" :value="item.id">
              </el-option>
            </el-select>
            <el-select @change='getEditExtId(editDepartmentSub)' style="width: 140px;margin-left: 10px"
                       class="filter-item"
                       v-model="editDepartmentSub"
                       placeholder="请选择子部门"
                       :disabled="canChooseSubDepart">
              <el-option v-for="item in departmentSubList" :label="item.name" :key="item.id" :value="item.id">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="设备状态" prop="assetStatus">
            <el-select @change='' class="filter-item" v-model="editAssetsData.assetStatus">
              <el-option v-for="item in CompanyAssetsList" :key="item.name" :label="item.text"
                         :value="item.name"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="备注" prop="note">
            <el-input v-model="editAssetsData.note"></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer" class="dialog-footer">
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  import {
    getDepartMentInfo,
    getEquipmentInfo,
    getCompanyAssets,
    addCompanyAssets,
    editCompanyAssets,
    deleteCompanyAssets,
    getAssetsDetails,
    getAssetsList
  } from '@/api/equipmentInfo'

  export default {
    data() {
      const validateExtId = (rule, value, callback) => {
        if (!value) {
          callback(new Error('请选择部门'))
        } else {
          callback()
        }
      }
      return {
        value9: '',
        equipmentInfoList: [], // 设备信息列表
        multipleSelection: [],
        dialogVisible: false,
        // 编辑界面显示
        departmentList: [],
        departmentSubList: [],
        loading: true,
        department: null,
        departmentSub: null,
        addDepartment: null,
        addDepartmentSub: null,
        // 能不能下拉选择
        canChooseSubDepart: true,
        assetStatus: null,
        CompanyAssetsList: [],
        name: null, // 设备名字
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        // 新增对话框
        addDialogVisible: false,
        addAssetsData: {
          extId: null,
          assetStatus: null,
          note: null,
          assetsId: null,
        },
        addAssetsRules: {
          assetsId: [{required: true, trigger: 'blur', message: '请选择设备信息'}],
          extId: [{required: true, trigger: 'blur,change', validator: validateExtId}]
        },
        // 编辑公司设备
        editDialogVisible: false,
        editAssetsData: {
          id: null,
          assetsId: null,
          extId: null,
          assetStatus: null,
          note: null,
        },
        editDepartment: null,
        editDepartmentSub: null,
        editAssetsRules: {
          assetsId: [{required: true, trigger: 'blur', message: '请选择设备信息'}],
          extId: [{required: true, trigger: 'blur,change', validator: validateExtId}]
        },
        assetsList: null,
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
        // this.loading = false
      }).catch(() => {
        this.loading = false
        console.log('获取失败')
      })
      // 获取设备状态的枚举
      vue.getCompanyAssetsMethods()
      vue.getAssetsListMethod()
    },

    methods: {
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      getAssetsListMethod: function () {
        let vue = this
        this.loading = true
        getAssetsList().then(response => {
          vue.assetsList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      // 打开编辑弹框
      handleEdit: function (index, row) {
        let vue = this
        console.log(row)
        // 获取设备详细信息
        getAssetsDetails(row.id).then(response => {
          vue.editDialogVisible = true
          vue.editDepartmentSub = null
          vue.editAssetsData.id = response.data.data.id
          vue.editAssetsData.assetsId = response.data.data.assets.id
          vue.editAssetsData.extId = response.data.data.extId
          vue.editAssetsData.assetStatus = response.data.data.assetsStatus.name
          vue.editAssetsData.note = response.data.data.note
          if (response.data.data.department.parentDepartment) {
            vue.editDepartment = response.data.data.department.parentDepartment.id
            vue.editDepartmentSub = response.data.data.department.id
          }
        }).catch(() => {
          this.loading = false
          console.log('获取公司设备详情失败')
        })
      },
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
      // 改变部门id
      getExtId: function (item) {
        let vue = this
        vue.addAssetsData.extId = item
      },
      // 编辑改变部门id
      getEditExtId: function (item) {
        let vue = this
        vue.editAssetsData.extId = item
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
      // 新增对话框
      addEquipmentMethods: function () {
        let vue = this
        vue.addDialogVisible = true
      },
      // 确定新增公司设备
      submitAddInfo: function () {
        let vue = this
        vue.$refs.addAssetsData.validate(valid => {
          if (valid) {
            this.loading = true
            // 发送新增公司设备请求
            addCompanyAssets(vue.addAssetsData).then(response => {
              // 清空表单
              vue.addDialogVisible = false
              vue.addDepartmentSub = null
              vue.addDepartment = null
              vue.$refs.addAssetsData.resetFields()
              vue.clearList()
              vue.getEquipmentInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('获取失败')
            })
          } else {
            console.log('error submit!!')
            return false
          }
        })
      },
      // 确定修改公司设备信息
      submitModifyInfo: function () {
        let vue = this
        // 发送新增公司设备请求
        editCompanyAssets(vue.editAssetsData).then(response => {
          vue.editDialogVisible = false;
          vue.getEquipmentInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('修改公司设备信息失败')
        })
      },
      // 删除公司设备信息
      deleteAssetsInfo: function (index, row) {
        console.log(row)
        let vue = this
        let ids = []
        if (row) {
          ids.push(row.id)
        } else {
          vue.multipleSelection.forEach(function (item) {
            ids.push(item.id)
          })
        }
        deleteCompanyAssets(ids).then(response => {
          vue.clearList()
          vue.getEquipmentInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除公司设备信息失败')
        })
      },
      // 清空列表
      clearList: function () {
        let vue = this
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = 8
        vue.department = null
        vue.departmentSub = null
        vue.assetStatus = null
      }
    }
  }
</script>

<style scoped>

</style>
