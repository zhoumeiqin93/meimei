<template>
  <div class="dashboard-container">
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteSupplierInfoMethods()">删除</el-button>
    <el-table
      ref="multipleTable"
      :data="supplierInfoList"
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
      <!--<el-table-column
        prop=""
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
      <el-table-column
        label="供应商联系人信息"
        width="150">
        <template slot-scope="scope">
          <a @click="addLinkManInfoMethod(scope.row)" class="el-button--text">联系人详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="handleEdit(scope.$index, scope.row)" type="primary" size="small"
                     class="el-icon-edit"></el-button>
          <el-button @click="deleteSupplierInfoMethods(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑界面-->
    <el-dialog
      title="编辑供应商信息"
      :visible.sync="editDialogVisible"
      width="50%">
      <el-form :rules="supplierDataRules" ref="editSupplierData" :model="editSupplierData" label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="纳税人识别号" prop="identificationNumberOfTheTaxpayer">
          <el-input v-model="editSupplierData.identificationNumberOfTheTaxpayer"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="depositBank">
          <el-input v-model="editSupplierData.depositBank" placeholder="开户银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="editSupplierData.bankAccount" placeholder="卡号"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="editSupplierData.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="组织全称" prop="fullName">
          <el-input v-model="editSupplierData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="提供的商品和服务">
          <el-input v-model="editSupplierData.provideGoodsServices"></el-input>
        </el-form-item>
        <el-form-item label="合作时间">
          <el-date-picker
            v-model="editSupplierData.cooperationDate"
            type="date"
            placeholder="请选择合作时间"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合作周期">
          <el-date-picker
            v-model="editSupplierData.cooperationCycle"
            type="date"
            placeholder="请选择合作周期"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="供应商代码" prop="serialNumber">
          <el-input v-model="editSupplierData.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="供应商类别" prop="supplierType">
          <el-select class="filter-item"
                     v-model="editSupplierData.supplierType" placeholder="请选择供应商类别">
            <el-option v-for="item in supplierTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税类" prop="taxType">
          <el-select class="filter-item"
                     v-model="editSupplierData.taxType" placeholder="请选择税类">
            <el-option v-for="item in taxTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-button type="primary" @click="addLinkman()">添加联系人</el-button>
        <br/><br/>
        <div v-for="(item,index) in editSupplierData.linkmans">
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
            <el-button @click="editDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
        </span>
    </el-dialog>
    <!--新增界面-->
    <el-dialog
      title="新增供应商信息"
      :visible.sync="viewAddDialogVisible"
      width="50%">
      <el-form :rules="supplierDataRules" ref="addSupplierData" :model="addSupplierData" label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="纳税人识别号" prop="identificationNumberOfTheTaxpayer">
          <el-input v-model="addSupplierData.identificationNumberOfTheTaxpayer"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="depositBank">
          <el-input v-model="addSupplierData.depositBank" placeholder="开户银行名称"></el-input>
        </el-form-item>
        <el-form-item label="银行账号" prop="bankAccount">
          <el-input v-model="addSupplierData.bankAccount" placeholder="卡号"></el-input>
        </el-form-item>
        <el-form-item label="地址">
          <el-input v-model="addSupplierData.address" placeholder="地址"></el-input>
        </el-form-item>
        <el-form-item label="组织全称" prop="fullName">
          <el-input v-model="addSupplierData.fullName"></el-input>
        </el-form-item>
        <el-form-item label="提供的商品和服务">
          <el-input v-model="addSupplierData.provideGoodsServices"></el-input>
        </el-form-item>
        <el-form-item label="合作时间">
          <el-date-picker
            v-model="addSupplierData.cooperationDate"
            type="date"
            placeholder="请选择合作时间"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="合作周期">
          <el-date-picker
            v-model="addSupplierData.cooperationCycle"
            type="date"
            placeholder="请选择合作周期"
            value-format="yyyy-MM-dd hh:mm:ss">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="供应商代码" prop="serialNumber">
          <el-input v-model="addSupplierData.serialNumber"></el-input>
        </el-form-item>
        <el-form-item label="供应商类别" prop="supplierType">
          <el-select class="filter-item"
                     v-model="addSupplierData.supplierType" placeholder="请选择供应商类别">
            <el-option v-for="item in supplierTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="税类" prop="taxType">
          <el-select class="filter-item"
                     v-model="addSupplierData.taxType" value="">
            <el-option v-for="item in taxTypeList" :label="item.text" :key="item.name" :value="item.name">
            </el-option>
          </el-select>
        </el-form-item>
        <!--<el-button type="primary" @click="addLinkman()">添加联系人</el-button>
        <br/><br/>
        <div v-for="(item,index) in addSupplierData.linkmans">
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
            <el-button type="primary" @click="addSupplierInfoMethod()">确 定</el-button>
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
    getSupplierInfo,
    getSupplierDetails,
    getSupplierTypeList,
    modifySupplierInfo,
    getTaxTypeList,
    deleteSupplierInfo,
    addSupplierInfo,
    getLinkManList,
    addLinkMan,
    getLinkManDetail,
    submitModifyLinkMan,
    deleteLinkMan
  } from '@/api/supplierInfo'

  import Vue from "vue"

  export default {
    name: "department-info",
    data() {
      return {
        supplierInfoList: [], // 供应商信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        editSupplierData: {
          identificationNumberOfTheTaxpayer: null,
          depositBank: null,
          bankAccount: null,
          address: null,
          fullName: null,
          provideGoodsServices: null,
          serialNumber: null,
          supplierType: null,
          linkmans: null,
          cooperationDate: null,
          cooperationCycle: null,
          taxType: null,
        },
        editDialogVisible: false,
        supplierTypeList: null,
        taxTypeList: null,
        multipleSelection: [],
        viewAddDialogVisible: false,
        addSupplierData: {
          identificationNumberOfTheTaxpayer: null,
          depositBank: null,
          bankAccount: null,
          address: null,
          fullName: null,
          provideGoodsServices: null,
          serialNumber: null,
          supplierType: null,
          linkmans: null,
          cooperationDate: null,
          cooperationCycle: null,
          taxType: null,
        },
        supplierDataRules: {
          identificationNumberOfTheTaxpayer: [{required: true, trigger: 'blur,change', message: '请输入纳税人识别号'}],
          depositBank: [{required: true, trigger: 'blur,change', message: '请输入开户银行'}],
          bankAccount: [{required: true, trigger: 'blur,change', message: '请输入客户银行账号'}],
          fullName: [{required: true, trigger: 'blur,change', message: '请输入供应商全称'}],
          serialNumber: [{required: true, trigger: 'blur,change', message: '请输入供应商代码'}],
          supplierType: [{required: true}],
          taxType: [{required: true}],
        },
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
      let vue = this
      vue.getSupplierInfoMethods()
      vue.getSupplierTypeMethods()
      vue.getTaxTypeListMethods()
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
          vue.pageInfo = response.data.pageInfo
          // for (let i in vue.supplierInfoList) {
          //   vue.supplierInfoList[i].childrenDepartment = vue.getDepartmentContact(vue.supplierInfoList[i].childrenDepartmentList)
          // }
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
      },
      // 打开编辑弹框
      handleEdit: function (index, row) {
        let vue = this
        console.log(row)
        // 获取供应商详细信息
        getSupplierDetails(row.id).then(response => {
          vue.editDialogVisible = true
          vue.editSupplierData.id = response.data.data.id
          vue.editSupplierData.identificationNumberOfTheTaxpayer = response.data.data.identificationNumberOfTheTaxpayer
          vue.editSupplierData.depositBank = response.data.data.depositBank
          vue.editSupplierData.bankAccount = response.data.data.bankAccount
          vue.editSupplierData.address = response.data.data.address
          vue.editSupplierData.fullName = response.data.data.fullName
          vue.editSupplierData.provideGoodsServices = response.data.data.provideGoodsServices
          vue.editSupplierData.serialNumber = response.data.data.serialNumber
          vue.editSupplierData.supplierType = response.data.data.supplierType.name
          vue.editSupplierData.linkmans = response.data.data.linkmans
          vue.editSupplierData.cooperationDate = response.data.data.cooperationDate
          vue.editSupplierData.cooperationCycle = response.data.data.cooperationCycle
          vue.editSupplierData.taxType = response.data.data.taxType.name
        }).catch(() => {
          this.loading = false
          console.log('获取公司供应商详情失败')
        })
      },
      submitModifyInfo: function () {
        let vue = this
        vue.$refs.editSupplierData.validate(valid => {
          if (valid) {
            this.loading = true
            modifySupplierInfo(vue.editSupplierData).then(response => {
              vue.editDialogVisible = false;
              vue.getSupplierInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('编辑信息失败')
            })
          }
        })
      },
      // 获取供应商类别列表
      getSupplierTypeMethods: function () {
        let vue = this
        this.loading = true
        getSupplierTypeList().then(response => {
          vue.supplierTypeList = response.data.data
          vue.deleteCode(vue.supplierTypeList)
          vue.addSupplierData.supplierType = vue.supplierTypeList[0].name
          console.log(vue.supplierTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },

      // 获取税累枚举
      getTaxTypeListMethods: function () {
        let vue = this
        this.loading = true
        getTaxTypeList().then(response => {
          vue.taxTypeList = response.data.data
          vue.deleteCode(vue.taxTypeList)
          vue.addSupplierData.taxType = vue.taxTypeList[0].name
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      deleteSupplierInfoMethods: function (index, row) {
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
        deleteSupplierInfo(ids).then(response => {
          vue.getSupplierInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除客户列表信息失败')
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      // 清空列表
      clearList: function () {
        let vue = this
        vue.pageInfo.offset = 0
        vue.pageInfo.limit = 8
      },
      addSupplierInfoMethod: function () {
        let vue = this
        vue.$refs.addSupplierData.validate(valid => {
          if (valid) {
            this.loading = true
            addSupplierInfo(vue.addSupplierData).then(response => {
              vue.viewAddDialogVisible = false
              vue.$refs.addSupplierData.resetFields()
              vue.clearList()
              vue.getSupplierInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('获取客户详细信息失败')
            })
          }
        });
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
      deleteCode: function (item) {
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
