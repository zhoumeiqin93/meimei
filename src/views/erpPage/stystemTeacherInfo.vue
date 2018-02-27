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
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteTeacherInfo()">删除</el-button>
    <el-table
      ref="multipleTable"
      :data="teacherInfoList"
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
      <!--<el-table-column
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
      <el-table-column
        label="师资库联系人信息"
        width="150">
        <template slot-scope="scope">
          <a @click="addLinkManInfoMethod(scope.row)" class="el-button--text">联系人详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="teacherInfoDetailMethods(scope.row)" size="small"
                     class="el-icon-edit green-btn"></el-button>
          <el-button @click="deleteTeacherInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑师资库信息-->
    <el-dialog
      title="师资库详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="null" ref="teacherInfoDetail" :model="teacherInfoDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="姓名" prop="name" label-width="140px">
          <el-input v-model="teacherInfoDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="收费标准" prop="feeScale" label-width="140px">
          <el-input v-model="teacherInfoDetail.feeScale"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="idCardType" label-width="140px">
          <el-radio-group v-model="teacherInfoDetail.idCardType" v-for="item in idCardTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号" prop="idCardNo" label-width="140px">
          <el-input v-model="teacherInfoDetail.idCardNo"></el-input>
        </el-form-item>
        <el-form-item label="个人电话" prop="mobilephones" label-width="140px">
          <el-input v-model="teacherInfoDetail.mobilephones"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="depositBank" label-width="140px">
          <el-input v-model="teacherInfoDetail.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="bankAccount" label-width="140px">
          <el-input v-model="teacherInfoDetail.bankAccount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" label-width="140px">
          <el-input v-model="teacherInfoDetail.note"></el-input>
        </el-form-item>
        <el-form-item label="当前工作单位" prop="currentWorkingUnit" label-width="140px">
          <el-input v-model="teacherInfoDetail.currentWorkingUnit"></el-input>
        </el-form-item>
        <el-form-item label="专业职称" prop="appellation" label-width="140px">
          <el-radio-group v-model="teacherInfoDetail.appellation" v-for="item in appellationList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <!--<el-button type="primary" @click="addLinkman()">添加联系人</el-button>
        <br/><br/>
        <div v-for="(item,index) in teacherInfoDetail.linkmans">
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
    <!--新增师资库信息-->
    <el-dialog
      title="新增师资库"
      :visible.sync="viewAddDialogVisible"
      width="50%">
      <el-form :rules="null" ref="teacherInfoAddDetail" :model="teacherInfoAddDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="姓名" prop="name" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="收费标准" prop="feeScale" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.feeScale"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" prop="idCardType" label-width="140px">
          <el-radio-group v-model="teacherInfoAddDetail.idCardType" v-for="item in idCardTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件号" prop="idCardNo" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.idCardNo"></el-input>
        </el-form-item>
        <el-form-item label="个人电话" prop="mobilephones" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.mobilephones"></el-input>
        </el-form-item>
        <el-form-item label="开户银行" prop="depositBank" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="卡号" prop="bankAccount" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.bankAccount"></el-input>
        </el-form-item>
        <el-form-item label="备注" prop="note" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.note"></el-input>
        </el-form-item>
        <el-form-item label="当前工作单位" prop="currentWorkingUnit" label-width="140px">
          <el-input v-model="teacherInfoAddDetail.currentWorkingUnit"></el-input>
        </el-form-item>
        <el-form-item label="专业职称" prop="appellation" label-width="140px">
          <el-radio-group v-model="teacherInfoAddDetail.appellation" v-for="item in appellationList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-button type="primary" @click="addLinkman('true')">添加联系人</el-button>
        <br/><br/>
        <div v-for="(item,index) in teacherInfoAddDetail.linkmans">
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
        </div>
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
      width="50%"
      @close="$refs.addLinkManInfo.resetFields()">
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
    getTeacherInfo,
    getAppellation,
    getTeacherInfoDetail,
    getIdCardType,
    modifyTeacherInfo,
    deleteTeacherInfo,
    addTeacherInfo,
    addCustomerInfo,
    getLinkManList,
    addLinkMan,
    getLinkManDetail,
    submitModifyLinkMan,
    deleteLinkMan
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
        appellationList: null,
        idCardTypeList: null,
        viewDialogVisible: false,
        viewAddDialogVisible: false,
        teacherInfoDetail: {
          name: null,
          feeScale: null,
          idCardType: null,
          mobilephones: null,
          linkmans: [],
          depositBank: null,
          bankAccount: null,
          note: null,
          currentWorkingUnit: null,
          appellation: null,
        },
        teacherInfoAddDetail: {
          name: null,
          feeScale: null,
          idCardType: null,
          mobilephones: null,
          linkmans: [],
          depositBank: null,
          bankAccount: null,
          note: null,
          currentWorkingUnit: null,
          appellation: null,
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
      vue.getTeacherInfoMethods()
      vue.getAppellationList();
      vue.getIdCardTypeListMethods()
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
      },
      getIdCardTypeListMethods: function () {
        let vue = this
        this.loading = true
        getIdCardType().then(response => {
          vue.idCardTypeList = response.data.data
          vue.idCardTypeList = vue.deleteCode(vue.idCardTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取职等枚举失败')
        })
      },
      teacherInfoDetailMethods: function (row) {
        let vue = this
        this.loading = true
        getTeacherInfoDetail(row.id).then(response => {
          vue.teacherInfoDetail.id = response.data.data.id
          vue.teacherInfoDetail.name = response.data.data.name
          vue.teacherInfoDetail.feeScale = response.data.data.feeScale
          vue.teacherInfoDetail.idCardType = response.data.data.idCardType.name
          vue.teacherInfoDetail.idCardNo = response.data.data.idCardNo
          vue.teacherInfoDetail.mobilephones = response.data.data.mobilephones
          vue.teacherInfoDetail.linkmans = response.data.data.linkmans
          vue.teacherInfoDetail.depositBank = response.data.data.depositBank
          vue.teacherInfoDetail.bankAccount = response.data.data.bankAccount
          vue.teacherInfoDetail.note = response.data.data.note
          vue.teacherInfoDetail.currentWorkingUnit = response.data.data.currentWorkingUnit
          vue.teacherInfoDetail.appellation = response.data.data.appellation.name
          console.log(vue.teacherInfoDetail)
          vue.viewDialogVisible = true
        }).catch(() => {
          this.loading = false
          console.log('获取客户详细信息失败')
        })
      },
      submitModifyInfo: function () {
        let vue = this
        this.loading = true
        modifyTeacherInfo(vue.teacherInfoDetail).then(response => {
          vue.viewDialogVisible = false;
          vue.getTeacherInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      deleteTeacherInfo: function (index, row) {
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
        deleteTeacherInfo(ids).then(response => {
          vue.clearList()
          vue.getTeacherInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除师资库信息失败')
        })
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      addInfo: function () {
        let vue = this
        this.loading = true
        addTeacherInfo(vue.teacherInfoAddDetail).then(response => {
          vue.resetAddFields()
          console.log(vue.teacherInfoAddDetail)
          vue.clearList()
          vue.getTeacherInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('添加信息失败')
        })
      },
      resetAddFields: function () {
        let vue = this
        vue.viewAddDialogVisible = false
        vue.$refs.teacherInfoAddDetail.resetFields()
        vue.teacherInfoAddDetail.linkmans = []
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
