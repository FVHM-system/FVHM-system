<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">阀栓信息</p>
      <el-cascader
          v-model="place"
          :options="options"
          :props="myprops"
          ref="require"
          placeholder="选择道路"
          :show-all-levels="false"
          style="margin-left: -145px;top:3px"
          clearable></el-cascader>
      <el-col :span="8">
        <el-input class="device-id" v-model="input1" placeholder="请输入阀栓编号"/>
      </el-col>
      <el-col :span="8">
        <el-input class="device-name" v-model="input2" placeholder="请输入阀栓名称"/>
      </el-col>
      <div class="button">
        <el-button v-model="search" type="primary" @click="dataFind">查询</el-button>
        <el-button type="info" @click="dataRequire">重置</el-button>
        <add-valve-plug></add-valve-plug>
        <el-button type="primary" @click="exportCSV">导出</el-button>
      </div>

    </div>
    <div class="data-chart">
      <el-table
          v-loading="loading"
          :key="Math.random()"
          :data=tableData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          height="520"
          @row-click="getValveId"
      >
        <el-table-column fixed="left" label="阀栓编号" prop="valveCode" width="120px"/>
        <el-table-column label="阀栓类型" prop="valveType" :formatter="typeFormate" width="120px"/>
        <el-table-column label="阀栓名称" prop="valveName" width="120px"/>
        <el-table-column label="所属道路" prop="address" width="200px"/>
        <el-table-column label="阀栓状态" prop="status" :formatter="statusFormate" width="200px"/>
        <el-table-column label="阀栓设置时间" :valve_createTime="this.prop" prop="createTime"
                         width="200px"/>
        <el-table-column label="计量设备型号" prop="meterCode" width="200px"/>
        <el-table-column label="通讯编号" prop="comNumber" width="200px"/>
        <el-table-column fixed="right" label="操作" width="360">
          <template #default="scope">
            <valve-detail class="drawer" :valve_id="scope.row.valveId"
                          :valve_createTime="tableData.createTime"></valve-detail>
            <el-button type="warning" @click="">停用</el-button>
            <el-button type="danger" @click="deleteValve(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

  </div>
</template>
<script setup>
import {onMounted, ref, getCurrentInstance} from 'vue'
import {fetchVpinformation, fetDeleteValveInfo} from "./util/vpinformation";
import {fetchFindData} from "./util/dataSearch";
import {types, statuss} from '@/utils/transform.js'
import ValveDetail from "@/pages/ValvePlugInformation/valveDetail.vue";
import AddValvePlug from "@/pages/ValvePlugInformation/addValvePlug.vue";
import {fetchSuper} from '@/apis/2.0/addr'
import {exportExcel} from '../../utils/exportExcel'
import {ElMessage} from 'element-plus'

let input1 = ref('')
let input2 = ref('')
let options = ref([])
let tableData = ref([])
let excelData = ref([])
let testnum = ref('')
let require = ref(null)
let myprops = ref()
let dialogVisible = ref(false)
myprops = {
  label: 'name',
  value: 'message',
  children: 'child',
  checkStrictly: true
}
let place = ref()
const getValveId = function (row) {
  testnum = row.valveId
}
/* 阀栓代码与文本转换 */
const typeFormate = function (row) {
  const target = types.find(i => i.value === row.valveType)
  return target.label;
}
const statusFormate = function (row) {
  const targetStatus = statuss.find(i => i.value === row.status)
  return targetStatus.label;
}

/* 查询 */
const dataFind = async function () {
  let address = ref('')
  if (place.value) {
    for (let i = place.value.length - 1; i >= 0; i--) {
      address.value = place.value[i].name + address.value
    }
  }
  console.log(input2.value)
  let res = await fetchFindData(input1.value, input2.value, address.value)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '查询成功！',
    })
    tableData.value = res.data;
  }
  console.log(tableData.value)
  console.log(address.value)
}
/* 获取阀栓信息 */
const dataRequire = async function () {
  location.reload()
}
const deleteValve = async function (row) {
  let res = await fetDeleteValveInfo({valveId: row.valveId})
  console.log(row.valveId)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '删除成功！',
    })
    location.reload()
  }
}

/* 导出 */
function exportCSV() {
  excelData.value = tableData.value
  let status
  let type
  for (let j = 0; j < excelData.value.length; j++) {
    status = statuss.find(i => i.value === excelData.value[j].status)
    type = types.find(i => i.value === excelData.value[j].valveType)
    console.log(status.label)
  }
  console.log((statuss.find(i => i.value === excelData.value[4].status)).label)
  const excel = {}
  excel.props = [
    {
      label: '阀栓编号',
      name: 'valveCode',
    },
    {
      label: '阀栓类型',
      name: 'valveType',
    },
    {
      label: '阀栓名称',
      name: 'valveName',
    },
    {
      label: '所属道路',
      name: 'address',
    },
    {
      label: '阀栓状态',
      name: "status",
    },
    {
      label: '阀栓设置时间',
      name: 'createTime',
    },
    {
      label: '计量设备编号',
      name: 'meterCode',
    },
    {
      label: '通讯编号',
      name: 'comNumber',
    },
  ]
  excel.body = excelData.value
  excel.fileName = '阀栓信息表'
  exportExcel(excel)
}

onMounted(async () => {
  let res = await fetchVpinformation()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  options.value = await fetchSuper()
})

</script>
<style>
.p-page {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
}

.p-header {
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}

.page-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.addrSelect {
  position: relative;
  top: 3px;
  margin-left: -145px;
  width: 200px;
}

.device-id {
  position: relative;
  top: 3px;
  left: 500px;
}

.device-name {
  position: relative;
  top: 3px;
  left: 510px;
}

.button {
  position: relative;
  top: -37px;
  left: 950px;
}

.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}

::-webkit-scrollbar {
  width: 0px;
  height: 8px;
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background-color: darkgray;
  border-radius: 4px;
}

/*/deep/ .el-table__body-wrapper::-webkit-scrollbar {*/
/*  width: 6px;*/
/*  height: 6px;*/
/*}*/

/*/deep/ .el-table__body-wrapper::-webkit-scrollbar-thumb {*/
/*  background-color: #ddd;*/
/*  border-radius: 3px;*/
/*}*/


</style>