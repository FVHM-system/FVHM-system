<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">阀栓信息</p>
      <el-form
          :model="searchForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="searchForm"
          style="position: absolute;top:30px;right: 40px;"
      >
        <el-form-item prop="place">
          <el-cascader
              v-model="searchForm.place"
              :options="options"
              :props="myprops"
              placeholder="选择地址"
              :show-all-levels="false"
              clearable></el-cascader>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="选择类型"
                     style="margin-left:-110px;width: 140px;">
            <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="searchForm.status" placeholder="选择状态"
                     style="margin-left:-110px;width: 140px;">
            <el-option
                v-for="item in statuss"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item>
              <div class="button">
                <el-button v-model="search" type="primary" @click="dataFind">查询</el-button>
                <el-button type="info" @click="dataRequire">重置</el-button>
                <add-valve-plug></add-valve-plug>
                <el-button type="primary" @click="exportCSV">导出</el-button>
              </div>
        </el-form-item>
      </el-form>
    </div>
    <div id="data-chart">
      <el-table
          :data=currentData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="margin-top:10px;width: 100%"
          :height="tableHeight"
          @row-click="getValveId"
      >
        <el-table-column fixed="left" label="阀栓编号" prop="valveCode" width="120px"/>
        <el-table-column label="阀栓类型" prop="valveType" :formatter="typeFormate" width="120px"/>
        <el-table-column label="阀栓名称" prop="valveName" width="120px"/>
        <el-table-column label="地址" prop="address" width="200px"/>
        <el-table-column label="阀栓状态" prop="status" :formatter="statusFormate" width="200px"/>
        <el-table-column label="阀栓设置时间"  prop="createTime"
                         width="200px"/>
        <el-table-column label="计量设备型号" prop="meterCode" width="200px"/>
        <el-table-column label="通讯编号" prop="comNumber" width="200px"/>
        <el-table-column fixed="right" label="操作" width="360">
          <template #default="scope">
            <valve-detail class="drawer" :valve_id="scope.row.valveId"
                          :valve_createTime="tableData.createTime"></valve-detail>
            <el-button type="warning" v-if="scope.row.status === 1001"
                       @click="valveStatusChange(scope.row)" :disabled="buttonState">停用
            </el-button>
            <el-button type="success" v-if="scope.row.status !== 1001"
                       @click="valveStatusChange(scope.row)" :disabled="buttonState">启用
            </el-button>
            <el-popconfirm
                confirm-button-text="确定"
                cancel-button-text="取消"
                :icon="InfoFilled"
                icon-color="red"
                title="确定要删除该设备吗?"
                @confirm="deleteValve(scope.row)"
            >
              <template #reference>
                <el-button type="danger" :disabled="buttonState">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      </div>
      <div class="pagination-out">
        <div class="pagination-in">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              v-model:currentPage="currentPage"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="pageSize"
              layout="total, prev, pager, next"
              v-if="pageshow"
              style="margin-top: 10px;"
              :total="tableData.length">
          </el-pagination>
        </div>
      </div>
  </div>
</template>
<script setup>
import {onMounted, ref, getCurrentInstance, reactive} from 'vue'
import {fetchVpinformation, fetDeleteValveInfo, fetUpdateStatus} from "./util/vpinformation";
import {fetchFindData} from "./util/dataSearch";
import {types, statuss} from '../../utils/transform.js'
import ValveDetail from "./valveDetail.vue";
import AddValvePlug from "./addValvePlug.vue";
import {fetchSuper} from '../../apis/2.0/addr'
import {exportExcel} from '../../utils/exportExcel'
import {ElLoading, ElMessage} from 'element-plus'
import {
  fetchAuthority ,
  fetchUsername
} from '../../utils/mrWang'

const {proxy} = getCurrentInstance()
let tableHeight = window.innerHeight - 310
let authority=ref('')
let buttonState=ref(false)//禁用按钮
let input1 = ref('')
let input2 = ref('')
let options = ref([])
let tableData = ref([])
let currentData = ref([])
let currentPage = reactive(1)
let pageSize = 10// 每页多少条
let excelData = ref([])
let testnum = ref('')
let myprops = ref()
let pageshow = ref(true)
let dialogVisible = ref(false)
myprops = {
  label: 'name',
  value: 'message',
  children: 'child',
  checkStrictly: true
}
const getValveId = function (row) {
  testnum = row.valveId
}

let searchForm = reactive({
  place:'',
  type:'',
  status:''
})

function handleSizeChange(val) {
  pageSize = val;
}
// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
const valveStatusChange = async function (row) {
  if (row.status === 1003) {
    let res = await fetUpdateStatus({valveId: row.valveId, status: 1001})
    console.log(res)
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '启用成功！',
      })
      location.reload()
    }
  } else if (row.status === 1001 || row.status === 4444) {
    let res = await fetUpdateStatus({valveId: row.valveId, status: 1003})
    console.log(res)
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '停用成功！',
      })
      location.reload()
    }
  }
}
/* 查询 */
const dataFind = async function () {
  let address = ref('')
  console.log(searchForm.place)
  if (searchForm.place) {
    if(searchForm.place.length>1){
    for (let i = searchForm.place.length - 1; i >= 0; i--) {
      address.value = searchForm.place[i].name + address.value
    }
    }
  }
  console.log(searchForm.type, searchForm.status, address.value)
  let res = await fetchFindData(searchForm.type, searchForm.status, address.value)
  if (res.code === '200') {
    if(res.data.length>0){
    ElMessage({
      type: 'success',
      message: '查询成功！',
    })
    tableData.value = res.data;
    if (tableData.value.length < pageSize) {
      currentData.value = tableData.value
    } else {
      currentData.value = tableData.value.slice(0, pageSize)
    }
  }
    else {
      ElMessage({
        type: 'warning',
        message: '尚无数据！',
      })
    }
  }
  console.log(tableData.value)
  console.log(address.value)
}

const dataRequire = async function () {
  searchForm.place=''
  searchForm.type=''
  searchForm.status=''
  pageshow.value = false
  let res = await fetchVpinformation()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  pageshow.value = true
  currentPage = 1
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
async function exportCSV() {
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
      label: '地址',
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
      label: '监测编号',
      name: 'meterCode',
    },
    {
      label: '通讯编号',
      name: 'comNumber',
    },
    {
      label: '所属单位',
      name:'applicantName'
    }
  ]

  let temp=await fetchVpinformation()
  temp.data.map(item=>{
    if(item.valveType===1){//
      item.valveType="阀门"
    }else if(item.valveType===2){
      item.valveType="消防栓"
    }

    if(item.status===1001){
      item.status="正在运行"
    }else if(item.status===1002){
      item.status="尚未安装"
    }else if(item.status===1003){
      item.status="已经停用"
    }else if(item.status===4444){
      item.status="正在报警"
    }

  })

  excel.body = temp.data
  excel.fileName = '阀栓信息表'
  exportExcel(excel)
}

onMounted(async () => {
  authority.value=fetchAuthority()
  if(authority.value==='ROLE_ADMIN'){
    buttonState.value=false
  }else{
    buttonState.value=true
  }
  const loadingInstance = ElLoading.service({target:document.getElementById("data-chart"),fullscreen: false})
  let res = await fetchVpinformation()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  options.value = await fetchSuper()
  loadingInstance.close()
  console.log(proxy)
})

</script>
<style>
.p-page {
  width: 90%;
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
}

::-webkit-scrollbar {
  width: 0px;
  height: 8px;
  border-radius: 4px;
}
.pagination-out{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 70px;
}
.pagination-in{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 15px;
  background-color: white;
  height: 50px;
  width: 600px;
  border-radius: 30px;
  box-shadow: -2px 2px 2px #888888;
}
.searchForm{
  display: flex;
  flex-direction: row;
  align-items: center;
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
