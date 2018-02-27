<template>
  <div class="dashboard-container">
    <!--表格操作按钮-->
    <el-button type="success" @click="addMethods()">新增</el-button>
    <el-button type="danger" @click="deleteAssetsInfo()">删除</el-button>
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
        prop="serial_number"
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
      <el-table-column
        prop="staff"
        label="部门工作人员">
        <template slot-scope="scope">
          <a @click="departmentOperators(scope.row)" class="el-button--text">部门工作人员详细信息</a>
        </template>
      </el-table-column>
      <!--<el-table-column
        label="查看"
        width="150">
        <template slot-scope="scope">
          <el-button @click="departmentDetail(scope.row)" type="primary" size="small">查看详情</el-button>
        </template>
      </el-table-column>-->
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="departmentDetail(scope.row)" type="primary" size="small"
                     class="el-icon-edit"></el-button>
          <el-button @click="deleteAssetsInfo(scope.row)" size="small" class="el-icon-delete"
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
    <!--编辑部门详情信息-->
    <el-dialog
      title="部门详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="null" ref="departmentInfoDetail" :model="departmentInfoDetail" label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="名称">
          <el-input v-model="departmentInfoDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="编制人员数量">
          <el-input v-model="departmentInfoDetail.staffSize"></el-input>
        </el-form-item>
        <el-form-item label="实际人员数量">
          <el-input v-model="departmentInfoDetail.actualSize"></el-input>
        </el-form-item>
        <el-form-item label=" 部门职责">
          <el-input v-model="departmentInfoDetail.responsibility"></el-input>
        </el-form-item>
        <el-form-item label=" 上级部门">
          <el-input v-model="departmentInfoDetail.parentId"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增部门信息-->
    <el-dialog
      title="部门详情信息"
      :visible.sync="addDialogVisible"
      width="50%">
      <el-form :rules="null" ref="addDepartInfo" :model="addDepartInfo" label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="部门名称" prop="name">
          <el-input v-model="addDepartInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="编制人员数量">
          <el-input v-model="addDepartInfo.staffSize"></el-input>
        </el-form-item>
        <el-form-item label="实际人员数量">
          <el-input v-model="addDepartInfo.actualSize"></el-input>
        </el-form-item>
        <el-form-item label="部门职责" prop="reponsibility">
          <el-input v-model="departmentInfoDetail.reponsibility"></el-input>
        </el-form-item>
        <!--上级部门-->
        <el-form-item label="上级部门" prop="reponsibility">
          <el-input v-model="departmentInfoDetail.reponsibility"></el-input>
        </el-form-item>
        <!--<el-select @change='' style="width: 150px;margin-left: 10px" class="filter-item" v-model="parentId"
                   placeholder="上级部门">
          <el-option v-for="item in parentList" :key="item.name" :label="item.text"
                     :value="item.name"></el-option>
        </el-select>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!--部门工作人员详情信息-->
    <el-dialog
      title="部门工作人员详情信息"
      :visible.sync="viewDepartmentOperatorsDialogVisible"
      width="50%">
      <el-table
        ref="multipleTable"
        :data="departmentOperatorsList"
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
          prop="telephone"
          label="固定电话">
        </el-table-column>
        <el-table-column
          prop=""
          label="移动电话">
          <template slot-scope="scope">
          <span v-for="item in scope.row.mobilephoneList">
            {{item}}<br/>
          </span>
          </template>
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
          label="电子邮箱">
          <template slot-scope="scope">
          <span v-for="item in scope.row.emailList">
            {{item}}<br/>
          </span>
          </template>
        </el-table-column>
        <el-table-column
          prop="qq"
          label="qq">
        </el-table-column>
        <el-table-column
          prop="department"
          label="所属部门">
        </el-table-column>
      </el-table>
      <br/>
      <template>
        <el-select
          v-model="operatorIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择想要添加的员工">
          <el-option
            v-for="item in operatorList"
            :key="item.id"
            :label="item.realName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <el-button type="primary" @click="addDepartmentOperatorsMethods()">编辑</el-button>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getDepartMentInfo,
    getDepartmentDetail,
    editCompany,
    addCompany,
    getDepartmentOperators,
    getOperatorsList,
    addDepartmentOperators
  } from '@/api/departmentInfo'

  export default {
    data() {
      return {
        departmentInfoList: [], // 部门信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        departmentInfoDetail: {
          id: null,
          name: null,
          staffSize: null,
          actualSize: null,
          responsibility: null,
          parentId: null
        }, // 部门详细信息
        detailDialogVisible: false,
        parentId: null, // 上级部门id
        addDepartInfo: {
          name: null,
          reponsibility: null,
          staffSize: null,
          actualSize: null,
          parentId: '-1'
        },
        parentList: [],
        // 查看部门详情
        viewDialogVisible: false,
        // 新增部门
        addDialogVisible: false,
        viewDepartmentOperatorsDialogVisible: false,
        departmentOperatorsList: null,
        operatorIds: '',
        operatorList: null,
        currentDepartMentInfo: null,
      }
    },
    created() {
      let vue = this
      vue.getDepartmentInfoMethods()
      vue.operatorsListMethod()
    },
    methods: {
      // 获取部门信息
      getDepartmentInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        getDepartMentInfo().then(response => {
          vue.departmentInfoList = response.data.data
          vue.pageInfo = response.data.pageInfo
          for (let i in vue.departmentInfoList) {
            vue.departmentInfoList[i].childrenDepartment = vue.getDepartmentContact(vue.departmentInfoList[i].childrenDepartmentList)
            vue.departmentInfoList[i].parentDepartment = vue.getDepartmentContact(vue.departmentInfoList[i].parentDepartmentList)
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
      // 获取部门详细信息
      departmentDetail: function (row) {
        let vue = this
        this.loading = true
        getDepartmentDetail(row.id).then(response => {
          vue.departmentInfoDetail = response.data.data
          vue.viewDialogVisible = true
        }).catch(() => {
          this.loading = false
          console.log('获取部门详细信息失败')
        })
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
      // 确定修改公司部门信息
      submitModifyInfo: function () {
        let vue = this
        // 发送新增公司设备请求
        editCompany({
          id: vue.departmentInfoDetail.id,
          name: vue.departmentInfoDetail.name,
          size: vue.departmentInfoDetail.size,
          reponsibility: vue.departmentInfoDetail.responsibility,
          parentId: vue.departmentInfoDetail.parentId
        }).then(response => {
          vue.viewDialogVisible = false;
          vue.getDepartmentInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('修改公司设备信息失败')
        })
      },
      // 新增部门
      addMethods: function () {
        let vue = this;
        vue.addDialogVisible = true;
      },
      departmentOperators: function (row) {
        let vue = this
        vue.viewDepartmentOperatorsDialogVisible = true
        vue.currentDepartMentInfo = row
        vue.departmentOperatorsListMethod(row)
      },
      departmentOperatorsListMethod: function (row) {
        let vue = this
        this.loading = true
        getDepartmentOperators(row.id).then(response => {
          vue.departmentOperatorsList = response.data.data
          vue.operatorIds = []
          for (let i in vue.departmentOperatorsList) {
            vue.operatorIds.push(vue.departmentOperatorsList[i].id);
          }
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      operatorsListMethod: function () {
        let vue = this
        this.loading = true
        getOperatorsList().then(response => {
          vue.operatorList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      addDepartmentOperatorsMethods: function () {
        let vue = this
        this.loading = true
        addDepartmentOperators({
          id: vue.currentDepartMentInfo.id,
          operatorIds: vue.operatorIds
        }).then(response => {
          vue.departmentOperatorsListMethod(vue.currentDepartMentInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加信息失败')
        })
      },
    }
  }
</script>

<style scoped>

</style>
