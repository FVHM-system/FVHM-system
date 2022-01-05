<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">报警管理</p>

      <el-form
          :model="searchForm"
          status-icon
          :rules="rules"
          label-width="120px"
          class="searchForm"
          style="position:absolute;right: 20px"
      >
        <el-form-item prop="place">
          <el-cascader
              v-model="searchForm.place"
              :options="options"
              :props="CarProps"
              placeholder="选择地址"
              :show-all-levels="false"
              style="width: 118px;"
              clearable></el-cascader>
        </el-form-item>
        <el-form-item prop="type">
          <el-select v-model="searchForm.type" placeholder="选择阀栓类型"
                     style="margin-left:-110px;width: 138px;">
            <el-option
                v-for="item in types"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="typeWarn">
          <el-select v-model="searchForm.typeWarn" placeholder="选择报警类型"
                     style="margin-left:-110px;width: 138px;">
            <el-option
                v-for="item in alarmType"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item prop="status">
          <el-select v-model="searchForm.status" placeholder="选择处理状态"
                     style="margin-left:-110px;width: 138px;">
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
          <el-date-picker
            v-model="searchForm.time"
            type="datetimerange"
            value-format="YYYY-MM-DD HH:mm:ss"
            range-separator="至"
            start-placeholder="开始时间"
            end-placeholder="结束时间"
            style="margin-left:-110px;width: 360px"
            >
            </el-date-picker>
        </el-form-item>
        <el-form-item>
          <div class="button">
            <el-button v-model="search" type="primary" @click="dataRSearch">查询</el-button>
            <el-button type="info" @click="dataRequire">重置</el-button>
            <el-button type="primary" @click="exportCSV">导出</el-button>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div id="data-chart">
      <el-table
          v-loading="loading"
          :data=currentData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          :height="tableHeight"
      >
        <el-table-column fixed="left" label="阀栓编号" prop="valveCode" width="120px"/>
        <el-table-column label="阀栓类型" prop="valveType" :formatter="typeFormate2" min-width="120px"/>
        <el-table-column fixed="left" label="阀栓名称" prop="valveName" min-width="120px"/>
        <el-table-column label="地址" prop="address" min-width="200px"/>
        <el-table-column label="报警类型" prop="warnType" :formatter="typeFormate" min-width="200px"/>
        <el-table-column label="状态" prop="warnStatus" :formatter="statusFormate" min-width="200px"/>
        <el-table-column label="报警时间" prop="warnTime" min-width="200px"/>
        <el-table-column fixed="right" label="操作" min-width="200px">
          <template #default="scope">
            <el-button type="warning" v-if="scope.row.warnStatus===0"
                       @click="handleStatus(scope.row)">{{
                alarmStatus.find(i => i.value === scope.row.warnStatus).label
              }}
            </el-button>
            <el-button type="success" v-if="scope.row.warnStatus===1"
                       @click="handleStatus(scope.row)">{{
                alarmStatus.find(i => i.value === scope.row.warnStatus).label
              }}
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination-out">
        <div class="pagination-in">
          <el-pagination
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              v-model:currentPage="currentPage"
              :page-sizes="[10, 20, 30, 50, 100]"
              :page-size="pageSize"
              style="margin-top: 10px;"
              layout="total, prev, pager, next"
              v-if="pageshow"
              :total="tableData.length">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup>
import {getCurrentInstance, onMounted, reactive, ref,} from 'vue'
import {fetchAlarmManage, fetchFindWarnInfo, fetchUpdateWarnIdById} from "./util/alarmManage.js";
import {mountedToArrPrototype} from "../../mock";
import {fetchSuper} from '../../apis/2.0/addr'
import {types} from '../../utils/transform.js'
import {ElLoading, ElMessage} from 'element-plus'
import {fetchVpinformation} from "../valveInformation/util/vpinformation";
import {exportExcel} from '../../utils/exportExcel'

/* 初始化输入变量 */
const {proxy} = getCurrentInstance()
let searchForm = reactive({
  place:'',
  type:'',
  typeWarn:'',
  status:'',
  time:''
})
let tableHeight = window.innerHeight - 310
let input1 = ref('') //查询阀栓名称变量初始化
let input2 = ref('') //查询阀栓状态变量初始化
let value1 = ref('') //查询创建时间初始化
let options = ref([]) //道路选择项初始化
let tableData = ref([]) //表单数据初始化
let place = ref('') //道路选择变量初始化
let currentData = ref([])
let loading=ref(true)
let currentPage = 1
let pageshow = ref(true)
let pageSize = 10// 每页多少条
let CarProps
/* 初始化级联菜单选项 */
CarProps = {
  label: 'name',
  value: 'message',
  children: 'child',
  checkStrictly: true
}
/* 初始化报警状态 */
const statuss = [
  {
    value: 0,
    label: '未处理',
  },
  {
    value: 1,
    label: '已处理',
  },
  {
    value: null,
    label: '全部状态',
  },
]
/* 初始化报警类型 */
const alarmType = [
  {
    value: 1,
    label: '水量超额报警',
  },
  {
    value: 2,
    label: '阀栓故障报警',
  },
  {
    value: 3,
    label: '流量异常报警',
  },
  {
    value: 4,
    label: '监测设备电量不足',
  }
]
/* 初始化按钮类型 */
const alarmStatus = [
  {
    value: 0,
    label: '确认已处理',
  },
  {
    value: 1,
    label: '取消已处理',
  }
]

async function exportCSV() {
  const excel = {}
  excel.props = [
    {
      label: '阀栓编号',
      name: 'valveCode',
    },
    {
      label: '阀栓名称',
      name: 'valveName',
    },
    {
      label: '阀栓类型',
      name: 'valveType',
    },
    {
      label: '地址',
      name: 'address',
    },
    {
      label: '报警类型',
      name: 'warnType',
    },
    {
      label: '状态',
      name: 'warnStatus',
      default: '0',
    },
    {
      label: '报警时间',
      name: 'warnTime',
    },
  ]

  let temp = await fetchAlarmManage()

  temp.data.map(item=>{
    if(item.warnType===1){
      item.warnType="水量超额"
    }else if(item.warnType===2){
      item.warnType="阀栓故障"
    }else if(item.warnType===3){
      item.warnType="流量异常"
    }else if(item.warnType===4){
      item.warnType="电量不足"
    }
    if(item.warnStatus===1){
      item.warnStatus="已处理"
    }else if(item.warnStatus===0){
      item.warnStatus="未处理"
    }
    if(item.valveType===1){
      item.valveType="阀门"
    }else if(item.valveType===2){
      item.valveType="消防栓"
    }
  })

  excel.body = temp.data
  excel.fileName = '报警管理表'
  exportExcel(excel)
}
/* 处理按钮名称点击事件 */
const handleStatus = async item => {
  let res
  if (item.warnStatus === 1) {
    res = await fetchUpdateWarnIdById(item.valveId, item.warnId, 0)
  } else if (item.warnStatus === 0) {
    res = await fetchUpdateWarnIdById(item.valveId, item.warnId, 1)
  }
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '修改成功！',
    })
    pageshow.value = false
    let res = await fetchAlarmManage()
    if (res.code === '200') {
      tableData.value = res.data;
    }
    if (tableData.value.length < pageSize) {
      currentData.value = tableData.value
    } else {
      currentData.value = tableData.value.slice(0, pageSize)
    }
    currentPage = 1
    pageshow.value = true
  }
}
/* 阀栓代码与文本转换 */
const typeFormate2 = function (row) {
  const target = types.find(i => i.value === row.valveType)
  return target.label;
}
/* 阀栓类型码转文本 */
const typeFormate = function (row) {
  const targetType = alarmType.find(i => i.value === row.warnType)
  return targetType.label;
}
/* 重置按钮点击事件 */
const dataRequire = async function () {
  searchForm.place = ''
  searchForm.type = ''
  searchForm.typeWarn = ''
  searchForm.status = ''
  searchForm.time = ''
  pageshow.value = false
  let res = await fetchAlarmManage()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  currentPage = 1
  pageshow.value = true
}
/* 查询按钮点击事件 */
const dataRSearch = async function () {
  let startTime = ''
  let endTime = ''
  let address = ref('')
  if (searchForm.place) {
    if(searchForm.place.length>1){
      for (let i = searchForm.place.length - 1; i >= 0; i--) {
        address.value = searchForm.place[i].name + address.value
      }
    }
  }
  if(searchForm.time){
    searchForm.time[0]
    searchForm.time[1]
  }
  let res = await fetchFindWarnInfo(address.value, searchForm.type, searchForm.typeWarn,searchForm.status,startTime,endTime)
  if (res.code === '200' ) {
    if(res.data.length !== 0) {
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
    else{
        ElMessage({
          type: 'warning',
          message : '尚无当前所查数据'
        })
    }
  } else {
    ElMessage({
      type: 'error',
      message: '数据未找到！',
    })
  }
}
function handleSizeChange(val) {
  pageSize = val;
}
// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}
/* 阀栓状态码转文本 */
const statusFormate = function (row) {
  const targetStatus = statuss.find(i => i.value === row.warnStatus)
  return targetStatus.label;
}
/* 页面初始化加载 */
onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service({target:document.getElementById("data-chart"),fullscreen: false})
  let res = await fetchAlarmManage()
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
.button {
  position: relative;
  margin-left:-110px
}
.pagination-out{
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 70px;
}
/* .searchForm{
  display: flex;
  flex-direction: row;
  align-items: center;
} */
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



</style>
