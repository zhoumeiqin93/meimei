<template>
  <div class="dashboard-container">
    <el-button type="success" @click="viewAddDialogVisible = true">新增</el-button>
    <el-button type="danger" @click="deleteStaffInfo()">删除</el-button>
    <!--<el-button type="primary" @click="getStaffInfoMethods()">查询</el-button>-->
    <el-table
      ref="multipleTable"
      :data="staffInfoList"
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
        prop="realName"
        label="真实姓名">
      </el-table-column>
      <el-table-column
        prop="englishName"
        label="英文名">
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
        label="电话">
        <template slot-scope="scope">
          <span v-for="item in scope.row.mobilephoneList">
            {{item}}<br/>
          </span>
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
        prop="hiredate"
        label="入职时间">
      </el-table-column>
      <el-table-column
        prop="contractTime"
        label="劳动合同起止时间">
      </el-table-column>
      <el-table-column
        label="员工家属信息"
        width="150">
        <template slot-scope="scope">
          <a @click="addLinkManInfoMethod(scope.row)" class="el-button--text">家属详细信息</a>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        width="150">
        <template slot-scope="scope">
          <el-button @click="staffDetail(scope.row)" size="small"
                     class="el-icon-edit green-btn"></el-button>
          <el-button @click="deleteStaffInfo(scope.$index, scope.row)" size="small" class="el-icon-delete"
                     type="danger"></el-button>
        </template>
      </el-table-column>
    </el-table>
    <!--编辑员工详情信息-->
    <el-dialog
      title="员工详情信息"
      :visible.sync="viewDialogVisible"
      width="50%">
      <el-form :rules="null" ref="staffInfoDetail" :model="staffInfoDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>

        <el-form-item label="真实姓名" label-width="140px">
          <el-input v-model="staffInfoDetail.realName"></el-input>
        </el-form-item>
        <el-form-item label="英文名" label-width="140px">
          <el-input v-model="staffInfoDetail.englishName"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="140px">
          <el-input v-model="staffInfoDetail.nickName"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" label-width="140px">
          <el-input v-model="staffInfoDetail.telephone"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addMobilephoneList()">添加移动电话</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoDetail.mobilephoneList">
          <div v-if="index==0">
            <el-form-item :label='"移动电话"' label-width="140px">
              <el-input v-model="staffInfoDetail.mobilephoneList[index]"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"移动电话"+index' label-width="140px">
              <el-input v-model="staffInfoDetail.mobilephoneList[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--性别-->
        <el-form-item label="性别" label-width="140px">
          <el-radio-group v-model="staffInfoDetail.gender" v-for="item in genderTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像信息" label-width="140px">
          <el-input v-model="staffInfoDetail.portrait"></el-input>
        </el-form-item>
        <!--用户职等-->
        <el-form-item label="用户职等" label-width="140px">
          <el-radio-group v-model="staffInfoDetail.caste" v-for="item in casteEnumList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户职位" label-width="140px">
          <el-input v-model="staffInfoDetail.post"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" label-width="140px">
          <el-radio-group v-model="staffInfoDetail.idCardType" v-for="item in idCardTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件编号" label-width="140px">
          <el-input v-model="staffInfoDetail.idCardNo"></el-input>
        </el-form-item>
        <el-form-item label="qq号" label-width="140px">
          <el-input v-model="staffInfoDetail.qq"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addEmailList()">添加电子邮箱</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoDetail.emailList">
          <div v-if="index==0">
            <el-form-item :label='"电子邮箱"' label-width="140px">
              <el-input v-model="staffInfoDetail.emailList[index]"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"电子邮箱"+index' label-width="140px">
              <el-input v-model="staffInfoDetail.emailList[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="入职时间" label-width="140px">
          <el-date-picker
            v-model="staffInfoDetail.hiredate"
            type="date"
            placeholder="选择入职日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出生时间" label-width="140px">
          <el-date-picker
            v-model="staffInfoDetail.birthday"
            type="date"
            placeholder="选择出生日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!--<el-button type="primary" @click="addOperatorFamilyMembers()">添加家庭成员</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoDetail.operatorFamilyMembers">
          <div v-if="index==0">
            <el-form-item :label='"成员"' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="关系" label-width="140px">
              <el-radio-group v-model="item.relationType" v-for="type in relationTypeList">
                <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='"工作"' label-width="140px">
              <el-input v-model="item.job"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"成员"+index' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item :label='"关系"+index' label-width="140px">
              <el-radio-group v-model="item.relationType" v-for="type in relationTypeList">
                <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='"工作"+index' label-width="140px">
              <el-input v-model="item.job"></el-input>
            </el-form-item>
          </div>
        </div>-->
        <div v-if="staffInfoDetail.operatorExtendsInformation">
          <el-form-item label="地址信息" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.censusRegisterAddress"></el-input>
          </el-form-item>
          <el-form-item label="紧急联系人" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.emergencyContactName"></el-input>
          </el-form-item>
          <el-form-item label="开户行" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.depositBank"></el-input>
          </el-form-item>
          <el-form-item label="银行卡号" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.bankAccount"></el-input>
          </el-form-item>
          <el-form-item label="婚姻状况" label-width="140px">
            <el-radio-group v-model="staffInfoDetail.operatorExtendsInformation.maritalStatus"
                            v-for="item in maritalStatusList">
              <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="子女状况" label-width="140px">
            <el-radio-group v-model="staffInfoDetail.operatorExtendsInformation.childrenInStatus"
                            v-for="item in childrenInStatusList">
              <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="合同类型" label-width="140px">
            <el-radio-group v-model="staffInfoDetail.contractType"
                            v-for="item in contractTypeList">
              <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="劳动合同起止时间" label-width="140px">
            <el-date-picker
              v-model="staffInfoDetail.contractTime"
              type="daterange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
          <el-form-item label="持有资格证书情况" label-width="140px">
            <el-radio-group v-model="staffInfoDetail.operatorExtendsInformation.credentials"
                            v-for="item in credentialsList">
              <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="学校" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.graduateSchool"></el-input>
          </el-form-item>
          <el-form-item label="专业" label-width="140px">
            <el-input v-model="staffInfoDetail.operatorExtendsInformation.graduateSchoolMajor"></el-input>
          </el-form-item>
          <el-form-item label="学历" label-width="140px">
            <el-radio-group v-model="staffInfoDetail.operatorExtendsInformation.educationBackground"
                            v-for="item in educationBackgroundList">
              <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="毕业时间" label-width="140px">
            <el-date-picker
              v-model="staffInfoDetail.operatorExtendsInformation.graduateTime"
              type="date"
              placeholder="选择毕业日期"
              value-format="yyyy-MM-dd">
            </el-date-picker>
          </el-form-item>
        </div>

      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyInfo()">确 定</el-button>
      </span>
    </el-dialog>
    <!--新增员工详细信息-->
    <el-dialog
      title="新增员工信息"
      :visible.sync="viewAddDialogVisible"
      width="50%">
      <el-form :rules="staffInfoAddDetailRules" ref="staffInfoAddDetail" :model="staffInfoAddDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="真实姓名" label-width="140px" prop="realName">
          <el-input v-model="staffInfoAddDetail.realName"></el-input>
        </el-form-item>
        <el-form-item label="英文名" label-width="140px" prop="englishName">
          <el-input v-model="staffInfoAddDetail.englishName"></el-input>
        </el-form-item>
        <el-form-item label="昵称" label-width="140px" prop="nickName">
          <el-input v-model="staffInfoAddDetail.nickName"></el-input>
        </el-form-item>
        <el-form-item label="固定电话" label-width="140px" prop="telephone">
          <el-input v-model="staffInfoAddDetail.telephone"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addMobilephoneList('true')">添加移动电话</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoAddDetail.mobilephoneList">
          <div v-if="index==0">
            <el-form-item :label='"移动电话"' label-width="140px">
              <el-input v-model="staffInfoAddDetail.mobilephoneList[index]"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"移动电话"+index' label-width="140px">
              <el-input v-model="staffInfoAddDetail.mobilephoneList[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <!--性别-->
        <el-form-item label="性别" label-width="140px" prop="gender">
          <el-radio-group v-model="staffInfoAddDetail.gender" v-for="item in genderTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="头像信息" label-width="140px" prop="portrait">
          <el-input v-model="staffInfoAddDetail.portrait"></el-input>
        </el-form-item>
        <!--用户职等-->
        <el-form-item label="用户职等" label-width="140px" prop="caste">
          <el-radio-group v-model="staffInfoAddDetail.caste" v-for="item in casteEnumList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="用户职位" label-width="140px" prop="post">
          <el-input v-model="staffInfoAddDetail.post"></el-input>
        </el-form-item>
        <el-form-item label="证件类型" label-width="140px" prop="idCardType">
          <el-radio-group v-model="staffInfoAddDetail.idCardType" v-for="item in idCardTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="证件编号" label-width="140px" prop="idCardNo">
          <el-input v-model="staffInfoAddDetail.idCardNo"></el-input>
        </el-form-item>
        <el-form-item label="qq号" label-width="140px" prop="qq">
          <el-input v-model="staffInfoAddDetail.qq"></el-input>
        </el-form-item>
        <el-button type="primary" @click="addEmailList('true')">添加电子邮箱</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoAddDetail.emailList">
          <div v-if="index==0">
            <el-form-item :label='"电子邮箱"' label-width="140px">
              <el-input v-model="staffInfoAddDetail.emailList[index]"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"电子邮箱"+index' label-width="140px">
              <el-input v-model="staffInfoAddDetail.emailList[index]"></el-input>
            </el-form-item>
          </div>
        </div>
        <el-form-item label="入职时间" label-width="140px" prop="hiredate">
          <el-date-picker
            v-model="staffInfoAddDetail.hiredate"
            type="date"
            placeholder="选择入职日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="出生时间" label-width="140px" prop="birthday">
          <el-date-picker
            v-model="staffInfoAddDetail.birthday"
            type="date"
            placeholder="选择出生日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <!--<el-button type="primary" @click="addOperatorFamilyMembers('true')">添加家庭成员</el-button>
        <br/><br/>
        <div v-for="(item,index) in staffInfoAddDetail.operatorFamilyMembers">
          <div v-if="index==0">
            <el-form-item :label='"成员"' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item label="关系" label-width="140px">
              <el-radio-group v-model="item.relationType" v-for="type in relationTypeList">
                <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='"工作"' label-width="140px">
              <el-input v-model="item.job"></el-input>
            </el-form-item>
          </div>
          <div v-if="index>0">
            <el-form-item :label='"成员"+index' label-width="140px">
              <el-input v-model="item.name"></el-input>
            </el-form-item>
            <el-form-item :label='"关系"+index' label-width="140px">
              <el-radio-group v-model="item.relationType" v-for="type in relationTypeList">
                <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item :label='"工作"+index' label-width="140px">
              <el-input v-model="item.job"></el-input>
            </el-form-item>
          </div>
        </div>-->
        <el-form-item label="地址信息" label-width="140px" prop="operatorExtendsInformation.censusRegisterAddress">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.censusRegisterAddress"></el-input>
        </el-form-item>
        <el-form-item label="紧急联系人" label-width="140px" prop="operatorExtendsInformation.emergencyContactName">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.emergencyContactName"></el-input>
        </el-form-item>
        <el-form-item label="开户行" label-width="140px" prop="operatorExtendsInformation.depositBank">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.depositBank"></el-input>
        </el-form-item>
        <el-form-item label="银行卡号" label-width="140px" prop="operatorExtendsInformation.bankAccount">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.bankAccount"></el-input>
        </el-form-item>
        <el-form-item label="婚姻状况" label-width="140px" prop="operatorExtendsInformation.maritalStatus">
          <el-radio-group v-model="staffInfoAddDetail.operatorExtendsInformation.maritalStatus"
                          v-for="item in maritalStatusList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="子女状况" label-width="140px" prop="operatorExtendsInformation.childrenInStatus">
          <el-radio-group v-model="staffInfoAddDetail.operatorExtendsInformation.childrenInStatus"
                          v-for="item in childrenInStatusList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="合同类型" label-width="140px" prop="contractType">
          <el-radio-group v-model="staffInfoAddDetail.contractType"
                          v-for="item in contractTypeList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="劳动合同起止时间" label-width="140px">
          <el-date-picker
            v-model="staffInfoAddDetail.contractTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        <el-form-item label="持有资格证书情况" label-width="140px" prop="operatorExtendsInformation.credentials">
          <el-radio-group v-model="staffInfoAddDetail.operatorExtendsInformation.credentials"
                          v-for="item in credentialsList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="学校" label-width="140px" prop="operatorExtendsInformation.graduateSchool">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.graduateSchool"></el-input>
        </el-form-item>
        <el-form-item label="专业" label-width="140px" prop="operatorExtendsInformation.graduateSchoolMajor">
          <el-input v-model="staffInfoAddDetail.operatorExtendsInformation.graduateSchoolMajor"></el-input>
        </el-form-item>
        <el-form-item label="学历" label-width="140px" prop="operatorExtendsInformation.educationBackground">
          <el-radio-group v-model="staffInfoAddDetail.operatorExtendsInformation.educationBackground"
                          v-for="item in educationBackgroundList">
            <el-radio :label="item.name">{{item.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="毕业时间" label-width="140px" prop="operatorExtendsInformation.graduateTime">
          <el-date-picker
            v-model="staffInfoAddDetail.operatorExtendsInformation.graduateTime"
            type="date"
            placeholder="选择毕业日期"
            value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAdd()">取 消</el-button>
        <el-button type="primary" @click="addStaffInfo()">确 定</el-button>
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
      title="家属信息详情页面"
      :visible.sync="viewFamilyNumbersDialogVisible"
      width="50%">
      <el-form :rules="null" ref="addFamilyNumberInfo" :model="addFamilyNumberInfo"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="成员" prop="name">
          <el-input v-model="addFamilyNumberInfo.name"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relationType">
          <el-radio-group v-model="addFamilyNumberInfo.relationType" v-for="type in relationTypeList">
            <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工作" prop="job">
          <el-input v-model="addFamilyNumberInfo.job"></el-input>
        </el-form-item>
      </el-form>
      <el-button type="primary" @click="addLinkmanMethod()">新增成员</el-button>
      <el-table
        ref="multipleTable"
        :data="familyNumberList"
        border
        tooltip-effect="dark"
        style="width: 100%;margin-top: 20px">
        <el-table-column
          prop="name"
          label="姓名">
        </el-table-column>
        <el-table-column
          prop="relationType.text"
          label="关系">
        </el-table-column>
        <el-table-column
          prop="job"
          label="工作">
        </el-table-column>
        <el-table-column
          label="操作"
          width="150">
          <template slot-scope="scope">
            <el-button @click="getLinkManDetailMethod(scope.row)" size="small"
                       class="el-icon-edit green-btn"></el-button>
            <el-button @click="deleteFamilyNumberMethod(scope.row)" size="small" class="el-icon-delete"
                       type="danger"></el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-dialog>
    <!--编辑单个联系人-->
    <el-dialog
      title="编辑家庭成员信息"
      :visible.sync="viewFamilyNumberDialogVisible"
      width="50%">
      <el-form :rules="null" ref="familyNumberDetail" :model="familyNumberDetail"
               label-position="left"
               label-width="100px"
               style='width: 400px; margin-left:20px;'>
        <el-form-item label="成员姓名" prop="name">
          <el-input v-model="familyNumberDetail.name"></el-input>
        </el-form-item>
        <el-form-item label="关系" prop="relationType">
          <el-radio-group v-model="familyNumberDetail.relationType" v-for="type in relationTypeList">
            <el-radio :label="type.name">{{type.text}}&nbsp;&nbsp;&nbsp;&nbsp;</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="工作" prop="job">
          <el-input v-model="familyNumberDetail.job"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="viewFamilyNumberDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitModifyFamilyNumberInfo()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
  import {
    getStaffInfo,
    getStaffDetail,
    getGenderType,
    getCasteEnum,
    getIdCardType,
    getMaritalStatus,
    getChildrenInStatus,
    getContractType,
    getCredentials,
    getEducationBackground,
    modifyStaffInfo,
    getRelationType,
    deleteStaffInfo,
    addStaffInfo,
    getFamilyNumberList,
    addFamilyNumber,
    getFamilyNumberDetail,
    submitModifyFamilyNumber,
    deleteFamilyNumber
  } from '@/api/staffInfo'

  import Vue from "vue"

  export default {
    name: "customer-info",
    data() {
      return {
        staffInfoList: [], // 员工信息列表
        pageInfo: {offset: 0, limit: 5, totalCount: 0, pageNum: 1, totalPage: 1},
        staffInfoAddDetailRules: {
          realName: [{required: true, trigger: 'blur,change', message: '请输入真实姓名'}],
        },
        genderTypeList: null,
        casteEnumList: null,
        idCardTypeList: null,
        maritalStatusList: null,
        childrenInStatusList: null,
        contractTypeList: null,
        credentialsList: null,
        relationTypeList: null,
        educationBackgroundList: null,
        viewAddDialogVisible: false,
        viewDialogVisible: false,
        staffInfoDetail: {
          realName: null,
          englishName: null,
          nickName: null,
          telephone: null,
          mobilephoneList: [],
          gender: null,
          portrait: null,
          caste: null,
          post: null,
          idCardType: null,
          idCardNo: null,
          qq: null,
          emailList: [],
          department: null,
          hiredate: null,
          birthday: null,
          contractType: null,
          contractTime: null,
          contractStartTime: null,
          contractEndTime: null,
          operatorFamilyMembers: [],
          operatorExtendsInformation: {
            censusRegisterAddress: null,
            emergencyContactName: null,
            depositBank: null,
            bankAccount: null,
            maritalStatus: null,
            childrenInStatus: null,
            credentials: null,
            graduateSchool: null,
            graduateSchoolMajor: null,
            educationBackground: null,
            graduateTime: null,
          }
        },
        staffInfoAddDetail: {
          realName: null,
          englishName: null,
          nickName: null,
          telephone: null,
          mobilephoneList: [],
          gender: null,
          portrait: null,
          caste: null,
          post: null,
          idCardType: null,
          idCardNo: null,
          qq: null,
          emailList: [],
          department: null,
          hiredate: null,
          birthday: null,
          contractType: null,
          contractTime: null,
          contractStartTime: null,
          contractEndTime: null,
          operatorFamilyMembers: [],
          operatorExtendsInformation: {

            censusRegisterAddress: null,
            emergencyContactName: null,
            depositBank: null,
            bankAccount: null,
            maritalStatus: null,
            childrenInStatus: null,
            credentials: null,
            graduateSchool: null,
            graduateSchoolMajor: null,
            educationBackground: null,
            graduateTime: null,
          }
        },
        multipleSelection: [],
        addFamilyNumberInfo: {
          name: null,
          relationType: null,
          job: null,
        },
        viewFamilyNumbersDialogVisible: false,
        familyNumberList: null,
        currentFamilyNumberInfo: null,
        viewFamilyNumberDialogVisible: false,
        familyNumberDetail: {
          name: null,
          relationType: null,
          job: null,
        }
      }
    },
    created() {
      let vue = this;
      vue.getStaffInfoMethods()
      vue.getGenderTypeMethods()
      vue.getCasteEnumMethods()
      vue.getIdCardTypeListMethods()
      vue.getMaritalStatusListMethods()
      vue.getChildrenInStatusListMethods()
      vue.getContractTypeListMethods()
      vue.getCredentialsListMethods()
      vue.getEducationBackgroundListMethods()
      vue.getRelationTypeListMethods()
    },
    methods: {
      handleChange(value) {
        console.log(value);
      },
      handleSelectionChange(val) {
        this.multipleSelection = val
        console.log(val)
      },
      //获取员工信息列表
      getStaffInfoMethods: function () {
        let vue = this
        // 获取部门信息
        vue.loading = true
        let data = {
          limit: vue.pageInfo.limit,
          offset: vue.pageInfo.offset,
        }
        getStaffInfo(data).then(response => {
          vue.staffInfoList = response.data.data
          vue.pageInfo = response.data.pageInfo;
          // 劳动合同起止时间
          for (let i in vue.staffInfoList) {
            vue.staffInfoList[i].contractTime = vue.staffInfoList[i].contractStartTime.substr(0, 10) + '~' + vue.staffInfoList[i].contractEndTime.substr(0, 10)
            // 入职时间
            vue.staffInfoList[i].hiredate = vue.staffInfoList[i].hiredate.substr(0, 10)

          }

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
        vue.getStaffInfoMethods()
      },
      handleCurrentChange(val) {
        let vue = this;
        console.log(`当前页: ${val}`)
        vue.pageInfo.offset = (val - 1) * vue.pageInfo.limit
        vue.getStaffInfoMethods()
      },
      staffDetail: function (row) {
        let vue = this
        this.loading = true
        getStaffDetail(row.id).then(response => {
          console.log(response.data.data)
          vue.viewDialogVisible = true
          vue.staffInfoDetail.id = response.data.data.id
          vue.staffInfoDetail.realName = response.data.data.realName
          vue.staffInfoDetail.englishName = response.data.data.englishName
          vue.staffInfoDetail.nickName = response.data.data.nickName
          vue.staffInfoDetail.gender = response.data.data.gender.name
          vue.staffInfoDetail.telephone = response.data.data.telephone
          vue.staffInfoDetail.mobilephoneList = response.data.data.mobilephoneList
          vue.staffInfoDetail.post = response.data.data.post
          vue.staffInfoDetail.portrait = response.data.data.portrait
          vue.staffInfoDetail.birthday = response.data.data.birthday
          vue.staffInfoDetail.idCardNo = response.data.data.idCardNo
          vue.staffInfoDetail.emailList = response.data.data.emailList
          vue.staffInfoDetail.qq = response.data.data.qq
          vue.staffInfoDetail.hiredate = response.data.data.hiredate
          vue.staffInfoDetail.caste = response.data.data.caste.name
          vue.staffInfoDetail.idCardType = response.data.data.idCardType.name
          vue.staffInfoDetail.contractType = response.data.data.contractType.name
          vue.staffInfoDetail.contractTime = [response.data.data.contractStartTime, response.data.data.contractEndTime];
          vue.staffInfoDetail.operatorFamilyMembers = response.data.data.operatorFamilyMembers
          for (let i in vue.staffInfoDetail.operatorFamilyMembers) {
            vue.staffInfoDetail.operatorFamilyMembers[i].relationType = vue.staffInfoDetail.operatorFamilyMembers[i].relationType.name
          }
          console.log(vue.staffInfoDetail.contractTime);
          if (response.data.data.operatorExtendsInformation) {
            vue.staffInfoDetail.operatorExtendsInformation.childrenInStatus = response.data.data.operatorExtendsInformation.childrenInStatus.name
            vue.staffInfoDetail.operatorExtendsInformation.maritalStatus = response.data.data.operatorExtendsInformation.maritalStatus.name
            vue.staffInfoDetail.operatorExtendsInformation.credentials = response.data.data.operatorExtendsInformation.credentials.name
            vue.staffInfoDetail.operatorExtendsInformation.educationBackground = response.data.data.operatorExtendsInformation.educationBackground.name
            vue.staffInfoDetail.operatorExtendsInformation.emergencyContactName = response.data.data.operatorExtendsInformation.emergencyContactName
            vue.staffInfoDetail.operatorExtendsInformation.emergencyContactTelephone = response.data.data.operatorExtendsInformation.emergencyContactTelephone
            vue.staffInfoDetail.operatorExtendsInformation.depositBank = response.data.data.operatorExtendsInformation.depositBank
            vue.staffInfoDetail.operatorExtendsInformation.bankAccount = response.data.data.operatorExtendsInformation.bankAccount
            vue.staffInfoDetail.operatorExtendsInformation.graduateSchool = response.data.data.operatorExtendsInformation.graduateSchool
            vue.staffInfoDetail.operatorExtendsInformation.graduateSchoolMajor = response.data.data.operatorExtendsInformation.graduateSchoolMajor
            vue.staffInfoDetail.operatorExtendsInformation.graduateTime = response.data.data.operatorExtendsInformation.graduateTime
            vue.staffInfoDetail.operatorExtendsInformation.censusRegisterAddress = response.data.data.operatorExtendsInformation.censusRegisterAddress
          }

        }).catch(() => {
          this.loading = false
          console.log('获取客户详细信息失败')
        })
      },
      deleteStaffInfo: function (index, row) {
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
        deleteStaffInfo(ids).then(response => {
          vue.clearList()
          vue.getStaffInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('删除员工列表信息失败')
        })
      },
      addMobilephoneList: function (flag) {
        let vue = this;
        if (flag) {
          vue.staffInfoAddDetail.mobilephoneList.push('')
        } else {
          vue.staffInfoDetail.mobilephoneList.push('')
        }
      },
      addEmailList: function (flag) {
        let vue = this;
        if (flag) {
          vue.staffInfoAddDetail.emailList.push('')
        } else {
          vue.staffInfoDetail.emailList.push('')
        }
      },
      addOperatorFamilyMembers: function (flag) {
        let vue = this;
        if (flag) {
          vue.staffInfoAddDetail.operatorFamilyMembers.push({
            name: null,
            relationType: null,
            job: null,
          })
        } else {
          if (!vue.staffInfoDetail.operatorFamilyMembers) {
            vue.staffInfoDetail.operatorFamilyMembers = []
          }
          vue.staffInfoDetail.operatorFamilyMembers.push({
            name: null,
            relationType: null,
            job: null,
          })
        }
        console.log(vue.staffInfoDetail.operatorFamilyMembers)
      },
      // 获取性别枚举
      getGenderTypeMethods: function () {
        let vue = this
        this.loading = true
        getGenderType().then(response => {
          vue.genderTypeList = response.data.data
          vue.genderTypeList = vue.deleteCode(vue.genderTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取性别枚举失败')
        })
      },
      getCasteEnumMethods: function () {
        let vue = this
        this.loading = true
        getCasteEnum().then(response => {
          vue.casteEnumList = response.data.data
          vue.casteEnumList = vue.deleteCode(vue.casteEnumList)
        }).catch(() => {
          this.loading = false
          console.log('获取职等枚举失败')
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
      getMaritalStatusListMethods: function () {
        let vue = this
        this.loading = true
        getMaritalStatus().then(response => {
          vue.maritalStatusList = response.data.data
          vue.maritalStatusList = vue.deleteCode(vue.maritalStatusList)
        }).catch(() => {
          this.loading = false
          console.log('获取婚姻状况枚举失败')
        })
      },
      getContractTypeListMethods: function () {
        let vue = this
        this.loading = true
        getContractType().then(response => {
          vue.contractTypeList = response.data.data
          vue.contractTypeList = vue.deleteCode(vue.contractTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取合同类型枚举失败')
        })
      },
      getChildrenInStatusListMethods: function () {
        let vue = this
        this.loading = true
        getChildrenInStatus().then(response => {
          vue.childrenInStatusList = response.data.data
          vue.childrenInStatusList = vue.deleteCode(vue.childrenInStatusList)
        }).catch(() => {
          this.loading = false
          console.log('获取子女状况枚举失败')
        })
      },
      getEducationBackgroundListMethods: function () {
        let vue = this
        this.loading = true
        getEducationBackground().then(response => {
          vue.educationBackgroundList = response.data.data
          vue.educationBackgroundList = vue.deleteCode(vue.educationBackgroundList)
        }).catch(() => {
          this.loading = false
          console.log('获取学历枚举失败')
        })
      },
      getCredentialsListMethods: function () {
        let vue = this
        this.loading = true
        getCredentials().then(response => {
          vue.credentialsList = response.data.data
          vue.credentialsList = vue.deleteCode(vue.credentialsList)
        }).catch(() => {
          this.loading = false
          console.log('获取持有资格证书情况枚举失败')
        })
      },
      getRelationTypeListMethods: function () {
        let vue = this
        this.loading = true
        getRelationType().then(response => {
          vue.relationTypeList = response.data.data
          vue.relationTypeList = vue.deleteCode(vue.relationTypeList)
        }).catch(() => {
          this.loading = false
          console.log('获取用户关系枚举失败')
        })
      },
      submitModifyInfo: function () {
        let vue = this
        this.loading = true
        vue.staffInfoDetail.contractStartTime = vue.staffInfoDetail.contractTime[0]
        vue.staffInfoDetail.contractEndTime = vue.staffInfoDetail.contractTime[1]
        delete  vue.staffInfoDetail.contractTime
        modifyStaffInfo(vue.staffInfoDetail).then(response => {
          vue.viewDialogVisible = false;
          vue.getStaffInfoMethods()
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      addStaffInfo: function () {
        let vue = this
        vue.$refs.staffInfoAddDetail.validate(valid => {
          if (valid) {
            this.loading = true
            if (vue.staffInfoAddDetail.contractTime) {
              vue.staffInfoAddDetail.contractStartTime = vue.staffInfoAddDetail.contractTime[0]
              vue.staffInfoAddDetail.contractEndTime = vue.staffInfoAddDetail.contractTime[1]
            }
            delete  vue.staffInfoAddDetail.contractTime
            addStaffInfo(vue.staffInfoAddDetail).then(response => {
              vue.viewAddDialogVisible = false
              vue.resetAddFields()
              console.log(vue.staffInfoAddDetail)
              vue.clearList()
              vue.getStaffInfoMethods()
            }).catch(() => {
              this.loading = false
              console.log('获取信息失败')
            })
          }
        })
      },
      addLinkManInfoMethod: function (row) {
        let vue = this;
        vue.viewFamilyNumbersDialogVisible = true
        vue.getLinkManMethod(row)
        vue.currentFamilyNumberInfo = row;
      },
      // 获取联系人列表信息
      getLinkManMethod: function (row) {
        let vue = this
        this.loading = true
        getFamilyNumberList(row.id).then(response => {
          this.loading = false
          vue.familyNumberList = response.data.data
        }).catch(() => {
          this.loading = false
          console.log('获取信息失败')
        })
      },
      // 添加联系人
      addLinkmanMethod: function () {
        let vue = this
        this.loading = true
        vue.addFamilyNumberInfo.operatorId = vue.currentFamilyNumberInfo.id;
        addFamilyNumber(vue.addFamilyNumberInfo).then(response => {
          this.loading = false
          vue.getLinkManMethod(vue.currentFamilyNumberInfo)
          vue.$refs.addFamilyNumberInfo.resetFields()
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      getLinkManDetailMethod: function (row) {
        let vue = this
        this.loading = true
        getFamilyNumberDetail(row.id).then(response => {
          vue.viewFamilyNumberDialogVisible = true
          vue.familyNumberDetail = response.data.data
          vue.familyNumberDetail.relationType = vue.familyNumberDetail.relationType.name
          this.loading = false
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      submitModifyFamilyNumberInfo: function () {
        let vue = this
        this.loading = true
        submitModifyFamilyNumber(vue.familyNumberDetail).then(response => {
          vue.viewFamilyNumberDialogVisible = false
          vue.getLinkManMethod(vue.currentFamilyNumberInfo)
        }).catch(() => {
          this.loading = false
          console.log('添加失败')
        })
      },
      deleteFamilyNumberMethod: function (row) {
        let vue = this
        this.loading = true
        deleteFamilyNumber(row.id).then(response => {
          vue.getLinkManMethod(vue.currentFamilyNumberInfo)
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
      cancleAdd: function () {
        let vue = this;
        vue.viewAddDialogVisible = false
        vue.resetAddFields()
      },
      resetAddFields: function () {
        let vue = this
        vue.$refs.staffInfoAddDetail.resetFields()
        vue.staffInfoAddDetail.contractTime = null
        vue.staffInfoAddDetail.mobilephoneList = []
        vue.staffInfoAddDetail.emailList = []
        vue.staffInfoAddDetail.operatorFamilyMembers = []
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
