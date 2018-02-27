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
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteProjectInfo()">删除</el-button>
    <el-table
      ref="multipleTable"
      :data="projectInfoList"
      border
      tooltip-effect="dark"
      style="width: 100%;margin-top: 20px"
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
      <el-table-column
        label="项目联系人信息"
        width="150">
        <template slot-scope="scope">
          <a @click="addLinkManInfoMethod(scope.row)" class="el-button--text">联系人详细信息</a>
        </template>
      </el-table-column>

      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="projectDetailMethods(scope.row)" size="small"
                     class="el-icon-edit green-btn"></el-button>
          <el-button @click="deleteProjectInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑项目详情信息-->
    <el-dialog
      title="项目详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="null" ref="projectDetail" :model="projectDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="合同编号" prop="serialNumber" label-width="140px">
          <el-input v-model="projectDetail.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName" label-width="140px">
          <el-input v-model="projectDetail.projectName"></el-input>
        </el-form-item>
        <el-form-item label="服务对象" prop="customerFlag" label-width="140px">
          <el-radio-group v-model="projectDetail.customerFlag" v-for="item in customerFlagList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目状态" prop="projectStatus" label-width="140px">
          <el-radio-group v-model="projectDetail.projectStatus" v-for="item in projectStatusList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType" label-width="140px">
          <el-radio-group v-model="projectDetail.serviceType" v-for="item in serviceTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod" label-width="140px">
          <el-radio-group v-model="projectDetail.paymentMethod" v-for="item in paymentMethodList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目金额" prop="itemAmount" label-width="140px">
          <el-input v-model="projectDetail.itemAmount"></el-input>
        </el-form-item>
        <el-form-item label="项目税金" prop="taxes" label-width="140px">
          <el-input v-model="projectDetail.taxes"></el-input>
        </el-form-item>
        <el-form-item label="合同开始时间" prop="contractStartTime" label-width="140px">
          <el-date-picker
            v-model="projectDetail.contractStartTime"
            type="date"
            placeholder="选择合同开始时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同截止时间" prop="contractEndTime" label-width="140px">
          <el-date-picker
            v-model="projectDetail.contractEndTime"
            type="date"
            placeholder="选择合同截止时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约主体" prop="contractParty" label-width="140px">
          <el-radio-group v-model="projectDetail.contractParty" v-for="item in contractPartyList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--<el-button type="primary" @click="addLinkman()">添加联系人</el-button>
        <br/><br/>
        <div v-for="(item,index) in projectDetail.linkmans">
          <div v-if="index==0">
            <el-form-item :label='"联系人"' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="联系人电话" label-width="140px">
              <el-input v-model="item.telephone"></el-input>
            </el-form-item>
            <el-form-item label="联系人邮箱" label-width="140px">
              <el-input v-model="item.email"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"联系人"+index' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item :label='"联系人电话"+index' label-width="140px">
              <el-input v-model="item.telephone"></el-input>
            </el-form-item>
            <el-form-item :label='"联系人邮箱"+index' label-width="140px">
              <el-input v-model="item.email"></el-input>
            </el-form-item>
          </div>
        </div>-->

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增项目详情信息-->
    <el-dialog
      title="项目详情信息"
      :visible.sync="viewAddDialogVisible"
      width="50%">
      <el-form :rules="null" ref="projectAddDetail" :model="projectAddDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="合同编号" prop="serialNumber" label-width="140px">
          <el-input v-model="projectAddDetail.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="projectName" label-width="140px">
          <el-input v-model="projectAddDetail.projectName"></el-input>
        </el-form-item>
        <el-form-item label="服务对象" prop="customerFlag" label-width="140px">
          <el-radio-group v-model="projectAddDetail.customerFlag" v-for="item in customerFlagList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目状态" prop="projectStatus" label-width="140px">
          <el-radio-group v-model="projectAddDetail.projectStatus" v-for="item in projectStatusList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="服务类型" prop="serviceType" label-width="140px">
          <el-radio-group v-model="projectAddDetail.serviceType" v-for="item in serviceTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="付款方式" prop="paymentMethod" label-width="140px">
          <el-radio-group v-model="projectAddDetail.paymentMethod" v-for="item in paymentMethodList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目金额" prop="itemAmount" label-width="140px">
          <el-input v-model="projectAddDetail.itemAmount"></el-input>
        </el-form-item>
        <el-form-item label="项目税金" prop="taxes" label-width="140px">
          <el-input v-model="projectAddDetail.taxes"></el-input>
        </el-form-item>
        <el-form-item label="合同开始时间" prop="contractStartTime" label-width="140px">
          <el-date-picker
            v-model="projectAddDetail.contractStartTime"
            type="date"
            placeholder="选择合同开始时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合同截止时间" prop="contractEndTime" label-width="140px">
          <el-date-picker
            v-model="projectAddDetail.contractEndTime"
            type="date"
            placeholder="选择合同截止时间"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="签约主体" prop="contractParty" label-width="140px">
          <el-radio-group v-model="projectAddDetail.contractParty" v-for="item in contractPartyList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <!-- <el-button type="primary" @click="addLinkman('true')">添加联系人</el-button>
         <br/><br/>
         <div v-for="(item,index) in projectAddDetail.linkmans">
           <div v-if="index==0">
             <el-form-item :label='"联系人"' label-width="140px">
               <el-input v-model="item.name"></el-input>
             </el-form-item>
             <el-form-item label="联系人电话" label-width="140px">
               <el-input v-model="item.telephone"></el-input>
             </el-form-item>
             <el-form-item label="联系人邮箱" label-width="140px">
               <el-input v-model="item.email"></el-input>
             </el-form-item>
           </div>
           <div v-if="index>0">
             <el-form-item :label='"联系人"+index' label-width="140px">
               <el-input v-model="item.name"></el-input>
             </el-form-item>
             <el-form-item :label='"联系人电话"+index' label-width="140px">
               <el-input v-model="item.telephone"></el-input>
             </el-form-item>
             <el-form-item :label='"联系人邮箱"+index' label-width="140px">
               <el-input v-model="item.email"></el-input>
             </el-form-item>
           </div>
         </div>-->
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="resetAddFields()">取 消</el-button>
        <el-button type="primary" @click="addInfo()">确 定</el-button>
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
    <!--联系人信息编辑页面-->
    <el-dialog
      title="联系人信息详情页面"
      :visible.sync="viewLinkMansDialogVisible"
      width="50%">
      <el-form :rules="null" ref="addLinkManInfo" :model="addLinkManInfo"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="联系人姓名" prop="name">
          <el-input v-model="addLinkManInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="telephone">
          <el-input v-model="addLinkManInfo.telephone"></el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="email">
          <el-input v-model="addLinkManInfo.email"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addLinkmanMethod()">新增联系人</el-button>
      <el-table
        ref="multipleTable"
        :data="linkManList"
        border
        tooltip-effect="dark"
        style="width: 100%;margin-top: 20px">
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="telephone"
          label="电话">
        </el-table-column>
        <el-table-column
          prop="email"
          label="邮箱">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="getLinkManDetailMethod(scope.row)" size="small"
                       class="el-icon-edit green-btn"></el-button>
            <el-button @click="deleteLinkManMethod(scope.row)" size="small" class="el-icon-delete"
                       type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--编辑单个联系人-->
    <el-dialog
      title="编辑联系人"
      :visible.sync="viewLinkManDialogVisible"
      width="50%">
      <el-form :rules="null" ref="linkManDetail" :model="linkManDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="联系人姓名" prop="name">
          <el-input v-model="linkManDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="联系人电话" prop="telephone">
          <el-input v-model="linkManDetail.telephone"></el-input>
        </el-form-item>
        <el-form-item label="联系人邮箱" prop="email">
          <el-input v-model="linkManDetail.email"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewLinkManDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyLinkManInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getProjectInfo,
    getContractParty,
    getCustomerType,
    getProjectStatus,
    getProjectDetail,
    getServiceType,
    getCustomerFlag,
    getPaymentMethod,
    modifyInfo,
    deleteInfo,
    addProjectInfo,
    getLinkManList,
    addLinkMan,
    getLinkManDetail,
    submitModifyLinkMan,
    deleteLinkMan
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
        multipleSelection: [],
        customerFlagList: null,
        serviceTypeList: null,
        paymentMethodList: null,
        projectDetail: {
          serialNumber: null,
          projectName: null,
          customerFlag: null,
          projectStatus: null,
          linkmans: [],
          serviceType: null,
          paymentMethod: null,
          itemAmount: null,
          taxes: null,
          contractStartTime: null,
          contractEndTime: null,
          contractParty: null,
        },
        projectAddDetail: {
          serialNumber: null,
          projectName: null,
          customerFlag: null,
          projectStatus: null,
          linkmans: [],
          serviceType: null,
          paymentMethod: null,
          itemAmount: null,
          taxes: null,
          contractStartTime: null,
          contractEndTime: null,
          contractParty: null,
        },
        viewDialogVisible: false,
        viewAddDialogVisible: false,
        addLinkManInfo: {
          name: null,
          telephone: null,
          email: null,
        },
        viewLinkMansDialogVisible: false,
        linkManList: null,
        currentCustomerInfo: null,
        viewLinkManDialogVisible: false,
        linkManDetail: {
          name: null,
          telephone: null,
          email: null,
        }
      }
    },
    created() {
      let vue = this;
      vue.getProjectInfoMethods()
      vue.getContractPartyList()
      vue.getCustomerTypeList()
      vue.getProjectStatusList()
      vue.getCustomerFlagList()
      vue.getServiceTypeList()
      vue.getPaymentMethodList()
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
      getCustomerFlagList: function () {
        let vue = this
        getCustomerType().then(response => {
          vue.customerFlagList = response.data.data
          vue.codeDelete(vue.customerFlagList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      getServiceTypeList: function () {
        let vue = this
        getServiceType().then(response => {
          vue.serviceTypeList = response.data.data
          vue.codeDelete(vue.serviceTypeList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      getPaymentMethodList: function () {
        let vue = this
        getPaymentMethod().then(response => {
          vue.paymentMethodList = response.data.data
          vue.codeDelete(vue.paymentMethodList)
        }).catch(() => {
          this.loading = false;
          console.log('获取失败')
        })
      },
      projectDetailMethods: function (row) {
        let vue = this
        this.loading = true
        getProjectDetail(row.id).then(response => {
          vue.viewDialogVisible = true
          vue.projectDetail.id = response.data.data.id
          vue.projectDetail.serialNumber = response.data.data.serialNumber
          vue.projectDetail.projectName = response.data.data.projectName
          vue.projectDetail.customerFlag = response.data.data.customerFlag.name
          vue.projectDetail.projectStatus = response.data.data.projectStatus.name
          vue.projectDetail.linkmans = response.data.data.linkmans
          vue.projectDetail.serviceType = response.data.data.serviceType.name
          vue.projectDetail.paymentMethod = response.data.data.paymentMethod.name
          vue.projectDetail.itemAmount = response.data.data.itemAmount
          vue.projectDetail.taxes = response.data.data.taxes
          vue.projectDetail.contractStartTime = response.data.data.contractStartTime
          vue.projectDetail.contractEndTime = response.data.data.contractEndTime
          vue.projectDetail.contractParty = response.data.data.contractParty.name
          console.log(vue.projectDetail)

        }).catch(() => {
          this.loading = false
          console.log('获取客户详细信息失败')
        })
      },
      submitModifyInfo: function () {
        let vue = this
        this.loading = true
        modifyInfo(vue.projectDetail).then(response => {
          vue.viewDialogVisible = false;
          vue.getProjectInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      /*   // 添加联系人
         addLinkman: function (flag) {
           let vue = this;
           if (flag) {
             vue.projectAddDetail.linkmans.push({
               name: null,
               telephone: null,
               email: null
             })
           } else {
             vue.projectDetail.linkmans.push({
               name: null,
               telephone: null,
               email: null
             })
           }
           console.log(vue.projectAddDetail.linkmans)
           // console.log(vue.projectDetail.linkmans)
         },*/
      deleteProjectInfo: function (index, row) {
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
        deleteInfo(ids).then(response => {
          vue.getProjectInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除列表信息失败')
        })
      },
      addInfo: function () {
        let vue = this
        this.loading = true
        addProjectInfo(vue.projectAddDetail).then(response => {
          vue.resetAddFields()
          console.log(vue.projectAddDetail)
          vue.clearList()
          vue.getProjectInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('添加信息失败')
        })
      },
      addLinkManInfoMethod: function (row) {
        let vue = this;
        vue.viewLinkMansDialogVisible = true
        vue.getLinkManMethod(row)
        vue.currentCustomerInfo = row;
      },
      // 获取联系人列表信息
      getLinkManMethod: function (row) {
        let vue = this
        this.loading = true
        getLinkManList(row.id).then(response => {
          this.loading = false
          vue.linkManList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      // 添加联系人
      addLinkmanMethod: function () {
        let vue = this
        this.loading = true
        vue.addLinkManInfo.extId = vue.currentCustomerInfo.id;
        addLinkMan(vue.addLinkManInfo).then(response => {
          this.loading = false
          vue.getLinkManMethod(vue.currentCustomerInfo)
          vue.$refs.addLinkManInfo.resetFields()
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      getLinkManDetailMethod: function (row) {
        let vue = this
        this.loading = true
        getLinkManDetail(row.id).then(response => {
          vue.viewLinkManDialogVisible = true
          vue.linkManDetail = response.data.data
          this.loading = false
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      submitModifyLinkManInfo: function () {
        let vue = this
        this.loading = true
        submitModifyLinkMan(vue.linkManDetail).then(response => {
          vue.viewLinkManDialogVisible = false
          vue.getLinkManMethod(vue.currentCustomerInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      deleteLinkManMethod: function (row) {
        let vue = this
        this.loading = true
        deleteLinkMan(row.id).then(response => {
          vue.getLinkManMethod(vue.currentCustomerInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      resetAddFields: function () {
        let vue = this
        vue.viewAddDialogVisible = false
        vue.$refs.projectAddDetail.resetFields()
        vue.projectAddDetail.linkmans = []
      },
      // 清空列表
      clearList: function () {
        let vue = this
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = 8
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
