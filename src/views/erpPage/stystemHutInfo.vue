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
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteHutInfo()">删除</el-button>
    <el-table
      ref="multipleTable"
      :data="hutInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px">
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
      <el-table-column
        prop=""
        label="小屋客户信息">
        <template slot-scope="scope">
          <a @click="roomCustomers(scope.row)" class="el-button--text">小屋客户详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="小屋工作人员信息">
        <template slot-scope="scope">
          <a @click="roomOperators(scope.row)" class="el-button--text">小屋工作人员详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        prop=""
        label="小屋设备信息">
        <template slot-scope="scope">
          <a @click="roomAssets(scope.row)" class="el-button--text">小屋设备详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="hutDetail(scope.row)" size="small"
                     class="el-icon-edit green-btn"></el-button>
          <el-button @click="deleteHutInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑客户详情信息-->
    <el-dialog
      title="客户详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="null" ref="hutInfoDetail" :model="hutInfoDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="名称" prop="name" label-width="140px">
          <el-input v-model="hutInfoDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="客户代码" prop="serialNumber" label-width="140px">
          <el-input v-model="hutInfoDetail.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="地址" prop="address" label-width="140px">
          <el-input v-model="hutInfoDetail.address"></el-input>
        </el-form-item>
        <el-form-item label="成立时间" label-width="140px">
          <el-date-picker
            v-model="hutInfoDetail.registerDate"
            type="date"
            placeholder="选择成立时间"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
      </span>
    </el-dialog>
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
    <!--小屋工作人员详情信息-->
    <el-dialog
      title="小屋工作人员详情信息"
      :visible.sync="viewRoomOperatorsDialogVisible"
      width="50%">
      <el-table
        ref="multipleTable"
        :data="roomOperatorsList"
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
    <!--小屋客户详情信息-->
    <el-dialog
      title="小屋客户详情信息"
      :visible.sync="viewRoomCustomersDialogVisible"
      width="50%">
      <el-table
        ref="multipleTable"
        :data="roomCustomersList"
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
      </el-table>
      <br/>
      <template>
        <el-select
          v-model="enterpriseCustomerIds"
          multiple
          filterable
          allow-create
          default-first-option
          placeholder="请选择想要添加的员工">
          <el-option
            v-for="item in customersList"
            :key="item.id"
            :label="item.fullName"
            :value="item.id">
          </el-option>
        </el-select>
      </template>
      <el-button type="primary" @click="addRoomCustomersMethods()">编辑</el-button>
    </el-dialog>
    <!--小屋设备详情信息-->
    <el-dialog
      title="小屋客户详情信息"
      :visible.sync="viewRoomAssentsDialogVisible"
      width="50%"
      @close="$refs.addAssetsInfo.resetFields()">
      <el-form :rules="null" ref="addAssetsInfo" :model="addAssetsInfo"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="设备名称" prop="assetsId" label-width="140px">
          <el-select @change='' class="filter-item" v-model="addAssetsInfo.assetsId">
            <el-option v-for="item in assetsList" :key="item.id" :label="item.name"
                       :value="item.id"></el-option>
          </el-select>&nbsp;&nbsp;
          <el-button type="primary" @click="viewAddAssentTypeDialogVisible=true">新增设备</el-button>
        </el-form-item>
        <el-form-item label="设备状态" prop="assetStatus" label-width="140px">
          <el-select @change='' class="filter-item" v-model="addAssetsInfo.assetStatus">
            <el-option v-for="item in CompanyAssetsList" :key="item.name" :label="item.text"
                       :value="item.name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="备注" prop="note" label-width="140px">
          <el-input v-model="addAssetsInfo.note"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="submitAddAssetsInfo()">确 定</el-button>
      <el-table
        ref="multipleTable"
        :data="roomAssetsList"
        border
        tooltip-effect="dark"
        style="width: 100%;margin-top: 20px">
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
          prop="assets.unit"
          label="设备单位">
        </el-table-column>
        <el-table-column
          prop="assetsStatus.text"
          label="设备状态">
        </el-table-column>
        <el-table-column
          prop="note"
          label="备注">
        </el-table-column>
      </el-table>
    </el-dialog>
    <el-dialog
      title="新增设备类型"
      :visible.sync="viewAddAssentTypeDialogVisible"
      width="50%"
      @close="$refs.addAssetTypeInfo.resetFields()">
      <el-form :rules="null" ref="addAssetTypeInfo" :model="addAssetTypeInfo"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="设备类别" prop="name" label-width="140px">
          <el-input v-model="addAssetTypeInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="设备单位" prop="unit" label-width="140px">
          <el-input v-model="addAssetTypeInfo.unit"></el-input>
        </el-form-item>
        <el-form-item label="设备备注" prop="note" label-width="140px">
          <el-input v-model="addAssetTypeInfo.note"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAddType()">取 消</el-button>
        <el-button type="primary" @click="submitAddAssetTypeMethod()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getHutInfo,
    getHutType,
    getHutDetail,
    getRoomOperators,
    getOperatorsList,
    addRoomOperators,
    getCustomersList,
    addRoomCustomers,
    getRoomCustomers,
    getRoomAssetsList,
    getCompanyAssets,
    getAssetsList,
    submitAddAssets,
    submitAddAssetType
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
        viewAddDialogVisible: false,
        viewDialogVisible: false,
        hutInfoDetail: {
          name: null,
          serialNumber: null,
          type: null,
          address: null,
          registerDate: null,
        },
        editDepartment: null,
        editDepartmentSub: null,
        canChooseSubDepart: true,
        departmentList: [],
        departmentSubList: [],
        CompanyAssetsList: [],
        viewRoomOperatorsDialogVisible: false,
        currentRoomInfo: null,
        roomOperatorsList: null,
        operatorIds: '',
        operatorList: null,
        viewRoomCustomersDialogVisible: false,
        customersList: null,
        enterpriseCustomerIds: '',
        currentRoomCustomerInfo: null,
        roomCustomersList: null,
        viewRoomAssentsDialogVisible: false,
        currentRoomAssentsInfo: null,
        roomAssetsList: null,
        addAssetsInfo: {
          assetsId: null,
          assetStatus: null,
          note: null,
        },
        assetsList: null,
        viewAddAssentTypeDialogVisible: false,
        addAssetTypeInfo: {
          name: null,
          unit: null,
          note: null
        }
      }
    },
    created() {
      let vue = this;
      vue.getHutInfoMethods();
      vue.getHutTypeList()
      vue.operatorsListMethod()
      vue.customersListMethod()
      vue.getCompanyAssetsMethods()
      vue.getAssetsListMethod()
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
      },
      deleteHutInfo: function (index, row) {
      },
      hutDetail: function (row) {
        let vue = this
        this.loading = true
        getHutDetail(row.id).then(response => {
          vue.viewDialogVisible = true;
          vue.hutInfoDetail.id = response.data.data.id
          vue.hutInfoDetail.name = response.data.data.name
          vue.hutInfoDetail.serialNumber = response.data.data.serialNumber
          vue.hutInfoDetail.type = response.data.data.type.name
          vue.hutInfoDetail.address = response.data.data.address
          vue.hutInfoDetail.registerDate = response.data.data.registerDate
          console.log(vue.hutInfoDetail)
        }).catch(() => {
          this.loading = false
          console.log('获取客户详细信息失败')
        })
      },
      // 获取子部门
      getDepartMentSubList: function (item) {
        let vue = this
        if (vue.addDialogVisible) {
          vue.hutInfoDetail.companyAssets.extId = item
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
      roomOperators: function (row) {
        let vue = this
        vue.viewRoomOperatorsDialogVisible = true
        vue.currentRoomInfo = row
        vue.roomOperatorsListMethod(row)
      },
      roomOperatorsListMethod: function (row) {
        let vue = this
        this.loading = true
        getRoomOperators(row.id).then(response => {
          vue.roomOperatorsList = response.data.data
          vue.operatorIds = []
          for (let i in vue.roomOperatorsList) {
            vue.operatorIds.push(vue.roomOperatorsList[i].id);
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
        addRoomOperators({
          id: vue.currentRoomInfo.id,
          uhealthRoomOperatorIds: vue.operatorIds
        }).then(response => {
          vue.roomOperatorsListMethod(vue.currentRoomInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加信息失败')
        })
      },
      roomCustomers: function (row) {
        let vue = this
        vue.viewRoomCustomersDialogVisible = true
        vue.currentRoomCustomerInfo = row
        vue.roomCustomersListMethod(row)
      },
      roomCustomersListMethod: function (row) {
        let vue = this
        this.loading = true
        getRoomCustomers(row.id).then(response => {
          vue.roomCustomersList = response.data.data
          vue.enterpriseCustomerIds = []
          for (let i in vue.roomCustomersList) {
            vue.enterpriseCustomerIds.push(vue.roomCustomersList[i].id);
          }
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      customersListMethod: function () {
        let vue = this
        this.loading = true
        getCustomersList().then(response => {
          vue.customersList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      addRoomCustomersMethods: function () {
        let vue = this
        this.loading = true
        addRoomCustomers({
          id: vue.currentRoomCustomerInfo.id,
          enterpriseCustomerIds: vue.enterpriseCustomerIds
        }).then(response => {
          vue.roomCustomersListMethod(vue.currentRoomCustomerInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加信息失败')
        })
      },
      roomAssets: function (row) {
        let vue = this
        vue.viewRoomAssentsDialogVisible = true
        vue.currentRoomAssentsInfo = row
        vue.roomAssetsListMethod(row)
      },
      roomAssetsListMethod: function (row) {
        let vue = this
        this.loading = true
        getRoomAssetsList(row.id).then(response => {
          vue.roomAssetsList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
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
      submitAddAssetsInfo: function () {
        let vue = this
        this.loading = true
        vue.addAssetsInfo.extId = vue.currentRoomAssentsInfo.id
        submitAddAssets(vue.addAssetsInfo).then(response => {
          vue.$refs.addAssetsInfo.resetFields()
          vue.roomAssetsListMethod(vue.currentRoomAssentsInfo)
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      submitAddAssetTypeMethod: function () {
        let vue = this
        this.loading = true
        submitAddAssetType(vue.addAssetTypeInfo).then(response => {
          vue.$refs.addAssetTypeInfo.resetFields()
          vue.getAssetsListMethod()
          vue.viewAddAssentTypeDialogVisible = false
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
     /* cancleAddAssets: function () {

      },*/
      /*cancleAddType: function () {
        this.$refs.addAssetTypeInfo.resetFields()
      }*/
    }
  }
</script>

<style scoped>

</style>
