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
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteCustomerInfo()">删除</el-button>
    <el-table
      ref="multipleTable"
      :data="customerInfoList"
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
      <!--<el-table-column
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
      <el-table-column
        label="客户联系人信息"
        width="150">
        <template slot-scope="scope">
          <a @click="addLinkManInfoMethod(scope.row)" class="el-button--text">联系人详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="customerDetail(scope.row)" size="small"
                     class="el-icon-edit green-btn"></el-button>
          <el-button @click="deleteCustomerInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑客户详情信息-->
    <el-dialog
      title="客户详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="customerInfoDetailRules" ref="customerInfoDetail" :model="customerInfoDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="组织全称" prop="fullName" label-width="140px">
          <el-input v-model="customerInfoDetail.fullName"></el-input>
        </el-form-item>
        <el-form-item label="客户代码" prop="serialNumber" label-width="140px">
          <el-input v-model="customerInfoDetail.serialNumber"></el-input>
          <!--<el-button type="primary" @click="checkSerialNumber">检 测</el-button>-->
        </el-form-item>
        <el-form-item label="企业性质" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoDetail.property" placeholder="请选择企业性质">
            <el-option v-for="item in propertyList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 纳税人识别号" prop="identificationNumberOfTheTaxpayer" label-width="140px">
          <el-input v-model="customerInfoDetail.identificationNumberOfTheTaxpayer"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" label-width="140px" prop="depositBank">
          <el-input v-model="customerInfoDetail.depositBank" placeholder="开户银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" label-width="140px" prop="bankAccount">
          <el-input v-model="customerInfoDetail.bankAccount" placeholder="卡号"></el-input>
        </el-form-item>
        <!--<el-form-item label="区域">
          <el-input v-model="customerInfoDetail.depositBank"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" label-width="140px">
          <el-input v-model="customerInfoDetail.address"></el-input>
        </el-form-item>
        <el-form-item label="首次合作时间" label-width="140px">
          <el-date-picker
            v-model="customerInfoDetail.firstCooperationDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业规模（人数）" label-width="140px">
          <el-input v-model="customerInfoDetail.enterpriseScale"></el-input>
        </el-form-item>
        <el-form-item label="客户等级" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoDetail.customerLevel" placeholder="请选择客户等级">
            <el-option v-for="item in customerLevelList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业类别" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoDetail.customerType" placeholder="请选择企业类别">
            <el-option v-for="item in customerTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button type="primary" @click="addLinkman()">添加联系人</el-button>
         <br/><br/>
         <div v-for="(item,index) in customerInfoDetail.linkmans">
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
    <!--新增客户详情信息-->
    <el-dialog
      title="新增客户信息"
      :visible.sync="viewAddDialogVisible"
      width="50%">
      <el-form :rules="customerInfoDetailRules" ref="customerInfoAddDetail" :model="customerInfoAddDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="组织全称" prop="fullName" label-width="140px">
          <el-input v-model="customerInfoAddDetail.fullName"></el-input>
        </el-form-item>
        <el-form-item label="客户代码" prop="serialNumber" label-width="140px">
          <el-input v-model="customerInfoAddDetail.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="企业性质" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoAddDetail.property" placeholder="请选择企业性质">
            <el-option v-for="item in propertyList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label=" 纳税人识别号" prop="identificationNumberOfTheTaxpayer" label-width="140px">
          <el-input v-model="customerInfoAddDetail.identificationNumberOfTheTaxpayer"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" label-width="140px" prop="depositBank">
          <el-input v-model="customerInfoAddDetail.depositBank" placeholder="开户银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" label-width="140px" prop="bankAccount">
          <el-input v-model="customerInfoAddDetail.bankAccount" placeholder="卡号"></el-input>
        </el-form-item>
        <!--<el-form-item label="区域">
          <el-input v-model="customerInfoDetail.depositBank"></el-input>
        </el-form-item>-->
        <el-form-item label="地址" label-width="140px">
          <el-input v-model="customerInfoAddDetail.address"></el-input>
        </el-form-item>
        <el-form-item label="首次合作时间" label-width="140px">
          <el-date-picker
            v-model="customerInfoAddDetail.firstCooperationDate"
            type="date"
            placeholder="选择日期"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="企业规模（人数）" label-width="140px">
          <el-input v-model="customerInfoAddDetail.enterpriseScale"></el-input>
        </el-form-item>
        <el-form-item label="客户等级" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoAddDetail.customerLevel" placeholder="请选择客户等级">
            <el-option v-for="item in customerLevelList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="企业类别" label-width="140px">
          <el-select class="filter-item"
                     v-model="customerInfoAddDetail.customerType" placeholder="请选择企业类别">
            <el-option v-for="item in customerTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-button type="primary" @click="addLinkman('true')">添加联系人</el-button>
         <br/><br/>
         <div v-for="(item,index) in customerInfoAddDetail.linkmans">
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
        <el-button @click="viewAddDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addCustomerInfoMethods()">确 定</el-button>
      </span>
    </el-dialog>
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
    getCustomerDetail,
    getPropertyList,
    getCustomerLevelList,
    getCustomerTypeList,
    modifyCustomerInfo,
    deleteCustomerInfo,
    addCustomerInfo,
    getLinkManList,
    addLinkMan,
    getLinkManDetail,
    submitModifyLinkMan,
    deleteLinkMan
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
        // 详细信息
        customerInfoDetail: {
          fullName: null,
          property: null,
          identificationNumberOfTheTaxpayer: null,
          depositBank: null,
          bankAccount: null,
          address: null,
          firstCooperationDate: null,
          enterpriseScale: null,
          customerLevel: null,
          customerType: null,
          linkmans: null
        },
        viewDialogVisible: false,
        // 企业性质
        propertyList: null,
        customerLevelList: null,
        customerTypeList: null,
        customerInfoDetailRules: {
          fullName: [{required: true, trigger: 'blur,change', message: '请输入组织全称'}],
          identificationNumberOfTheTaxpayer: [{required: true, trigger: 'blur,change', message: '请输入纳税人识别号'}],
          depositBank: [{required: true, trigger: 'blur,change', message: '请输入开户银行'}],
          bankAccount: [{required: true, trigger: 'blur,change', message: '请输入银行账号'}],
          serialNumber: [{required: true, trigger: 'blur,change', message: '请输入客户代码'}]
        },
        viewAddDialogVisible: false,
        customerInfoAddDetail: {
          fullName: null,
          property: null,
          identificationNumberOfTheTaxpayer: null,
          depositBank: null,
          bankAccount: null,
          address: null,
          firstCooperationDate: null,
          enterpriseScale: null,
          customerLevel: null,
          customerType: null,
          linkmans: []
        },
        multipleSelection: [],
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
      vue.getCustomerInfoMethods()
      vue.getPropertyListMethod()
      vue.getCustomerLevelListMethod()
      vue.getCustomerTypeListMethod()
    },
    methods: {
      //获取客户信息列表
      getCustomerInfoMethods: function () {
        let vue = this
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
      },
      departmentDetail: function (row) {
        console.log(row)
      },
      deleteCustomerInfo: function (index, row) {
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
        deleteCustomerInfo(ids).then(response => {
          vue.clearList()
          vue.getCustomerInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除客户列表信息失败')
        })
      },
      // 获取客户详细
      customerDetail: function (row) {
        let vue = this
        this.loading = true
        getCustomerDetail(row.id).then(response => {
          vue.customerInfoDetail.id = response.data.data.id
          vue.customerInfoDetail.fullName = response.data.data.fullName
          vue.customerInfoDetail.property = response.data.data.property.name
          vue.customerInfoDetail.identificationNumberOfTheTaxpayer = response.data.data.identificationNumberOfTheTaxpayer
          vue.customerInfoDetail.depositBank = response.data.data.depositBank
          vue.customerInfoDetail.bankAccount = response.data.data.bankAccount
          vue.customerInfoDetail.address = response.data.data.address
          vue.customerInfoDetail.firstCooperationDate = response.data.data.firstCooperationDate
          vue.customerInfoDetail.enterpriseScale = response.data.data.enterpriseScale
          vue.customerInfoDetail.customerLevel = response.data.data.customerLevel.name
          vue.customerInfoDetail.customerType = response.data.data.customerType.name
          vue.customerInfoDetail.linkmans = response.data.data.linkmans
          // vue.customerInfoDetail = response.data.data
          console.log(vue.customerInfoDetail)
          vue.viewDialogVisible = true
        }).catch(() => {
          this.loading = false
          console.log('获取客户详细信息失败')
        })
      },
      // 获取企业性质列表
      getPropertyListMethod: function () {
        let vue = this
        this.loading = true
        getPropertyList().then(response => {
          vue.propertyList = response.data.data
          vue.deleteCode(vue.propertyList)
        }).catch(() => {
          this.loading = false
          console.log('获取企业性质列表失败')
        })
      },
      getCustomerLevelListMethod: function () {
        let vue = this
        this.loading = true
        getCustomerLevelList().then(response => {
          vue.customerLevelList = response.data.data
          vue.deleteCode(vue.customerLevelList)
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      getCustomerTypeListMethod: function () {
        let vue = this
        this.loading = true
        getCustomerTypeList().then(response => {
          vue.customerTypeList = response.data.data
          vue.deleteCode(vue.customerTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      submitModifyInfo: function () {
        let vue = this
        vue.$refs.customerInfoDetail.validate(valid => {
          if (valid) {
            this.loading = true
            modifyCustomerInfo(vue.customerInfoDetail).then(response => {
              vue.viewDialogVisible = false;
              vue.getCustomerInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('获取信息失败')
            })
          }
        })
      },
      addCustomerInfoMethods: function () {
        let vue = this
        vue.$refs.customerInfoAddDetail.validate(valid => {
          if (valid) {
            this.loading = true
            addCustomerInfo(vue.customerInfoAddDetail).then(response => {
              vue.viewAddDialogVisible = false
              vue.$refs.customerInfoAddDetail.resetFields()
              vue.clearList()
              vue.getCustomerInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('获取客户详细信息失败')
            })
          }
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
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
      // 清空列表
      clearList: function () {
        let vue = this
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = 8
      },
      deleteCode: function (item) {
        for (let i in item) {
          if (item[i].code <= 0) {
            item.splice(i, 1)
          }
        }
        return item
      },
    }
  }
</script>

<style scoped>

</style>
