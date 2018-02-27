<template>
  <div class="dashboard-container property-management">
    <div
      class="el-table el-table--fit el-table--border el-table--enable-row-hover el-table--enable-row-transition el-table--medium"
      style="width: 800px">
      <div class="el-table__body-wrapper is-scroll-left">
        <table cellspacing="0" cellpadding="0" border="0" class="el-table__body" style="width: 100%">
          <tbody>
          <tr class="el-table__row" v-for="item in propertyManagementInfo">
            <td style="width: 200px;font-weight: bold;background-color: #e5e5e5">
              <div class="cell">{{item.name}}</div>
            </td>
            <td>
              <div class="cell">{{item.value}}</div>
            </td>
          </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "property-management",
    data() {
      return {
        propertyManagementInfo: [{
          name: '版本',
          value: '1.0.9',
        }, {
          name: '驱动',
          value: 'com.alibaba.druid.proxy.DruidDriver orcal.jdbc.OracleDriver',
        },{
          name: '是否允许重置',
          value: 'true',
        },{
          name: '重置次数',
          value: '0',
        },{
          name: 'java版本',
          value: '1.8.0_51',
        },{
          name: 'jvm名称',
          value: 'Java HotSpot(TM) 64-Bit Server VM',
        },{
          name: 'classpath路径',
          value: '/opt/tomcat/bin/bootstrap.jar    /opt/tomcat/bin/tomcat-juli.jar',
        },{
          name: '启动时间',
          value: '2018-01-01 14:10:34',
        }]
      }
    }
  }
</script>

<style scoped>

</style>
