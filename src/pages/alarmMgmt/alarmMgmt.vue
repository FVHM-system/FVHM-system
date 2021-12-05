<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">报警管理</p>
      <el-col :span="8">
        <el-cascader
            v-model="place"
            :options="options"
            :props="CarProps"
            ref="require"
            placeholder="选择道路"
            :show-all-levels="false"
            style="margin-left: 170px;top:3px;width: 150px"
            clearable></el-cascader>
      </el-col>
      <el-col :span="8">
        <el-input v-model="input1" placeholder="请输入阀栓名称"
                  style="margin-top: 3px;margin-left: 10px;width: 150px"/>
      </el-col>
      <el-select v-model="input2" placeholder="选择状态"
                 style="margin-left:10px;width: 120px;margin-top: 3px">
        <el-option
            v-for="item in statuss"
            :key="item.value"
            :label="item.label"
            :value="item.value"
        >
        </el-option>
      </el-select>
      <el-date-picker
          v-model="value1"
          type="datetimerange"
          range-separator="至"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="margin-top: 3px;margin-left: 10px"
      >
      </el-date-picker>
      <div class="button2">
        <el-button v-model="search" type="primary" @click="dataRSearch">查询</el-button>
        <el-button type="info" @click="dataRequire">重置</el-button>
        <el-button type="primary">导出</el-button>
      </div>
    </div>
    <el-scrollbar class="data-chart2">
      <el-table
          :data=tableData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
      >
        <el-table-column fixed="left" label="报警编号" prop="warnId" width="120px"/>
        <el-table-column fixed="left" label="设备编号" prop="valveId" width="120px"/>
        <el-table-column fixed="left" label="阀栓名称" prop="valveName" width="120px"/>
        <el-table-column label="所属道路" prop="roadName" width="200px"/>
        <el-table-column label="报警类型" prop="warnType" :formatter="typeFormate" width="200px"/>
        <el-table-column label="状态" prop="warnStatus" :formatter="statusFormate" width="200px"/>
        <el-table-column label="报警时间" prop="warnTime" width="200px"/>
        <el-table-column fixed="right" label="操作" width="200">
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
    </el-scrollbar>
  </div>
</template>
<script setup>
import {onMounted, ref,} from 'vue'
import {fetchAlarmManage, fetchFindWarnInfo, fetchUpdateWarnIdById} from "./util/alarmManage.js";
import {mountedToArrPrototype} from "../../mock";
import {fetchSuper} from '../../apis/2.0/addr'
import {ElMessage} from 'element-plus'

/* 初始化输入变量 */
let input1 = ref('') //查询阀栓名称变量初始化
let input2 = ref('') //查询阀栓状态变量初始化
let value1 = ref('') //查询创建时间初始化
let options = ref([]) //道路选择项初始化
let tableData = ref([]) //表单数据初始化
let place = ref('') //道路选择变量初始化
let CarProps
/* 初始化级联菜单选项 */
CarProps = {
  label: 'name',
  value: 'message',
  children: 'child',
}
/* 初始化报警状态 */
const statuss = [
  {
    value: 0,
    label: '已处理',
  },
  {
    value: 1,
    label: '未处理',
  },
]
/* 初始化报警类型 */
const alarmType = [
  {
    value: 1,
    label: '阀门故障',
  },
  {
    value: 2,
    label: '消防栓故障',
  },
  {
    value: 3,
    label: '水量超额',
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
    label: '取消已处理',
  },
  {
    value: 1,
    label: '确认已处理',
  }
]
/* 处理按钮名称点击事件 */
const handleStatus = async item => {
  console.log(item)
  let res
  if (item.warnStatus === 1) {
    res = await fetchUpdateWarnIdById(item.valveId, item.warnId, 0)
    console.log(item.valveId, item.warnId)
  } else if (item.warnStatus === 0) {
    res = await fetchUpdateWarnIdById(item.valveId, item.warnId, 1)
    console.log(item.valveId, item.warnId)
  }
  console.log(res)
  if (res.code === '200') {
    ElMessage({
      type: 'success',
      message: '修改成功！',
    })
    location.reload()
  }
}
/* 阀栓类型码转文本 */
const typeFormate = function (row) {
  const targetType = alarmType.find(i => i.value === row.warnType)
  return targetType.label;
}
/* 重置按钮点击事件 */
const dataRequire = async function () {
  if (value1.value !== '' || input1.value !== '' || input2.value !== '' || place.value.length
      !== 0) {
    location.reload()
  }
}
/* 查询按钮点击事件 */
const dataRSearch = async function () {
  let roadValue = ''
  if (place.value.length !== 0) {
    roadValue = place.value[4].name
  }
  let res = await fetchFindWarnInfo(roadValue, input1.value, input2.value)
  console.log(res.data)
  console.log(place.value)
  console.log(input1.value)
  console.log(input2.value)
  if (res.code === '200' && res.data.length !== 0) {
    ElMessage({
      type: 'success',
      message: '查询成功！',
    })
    tableData.value = res.data;
    console.log(res.data)
  } else {
    ElMessage({
      type: 'error',
      message: '数据未找到！',
    })
  }
}
/* 阀栓状态码转文本 */
const statusFormate = function (row) {
  const targetStatus = statuss.find(i => i.value === row.warnStatus)
  return targetStatus.label;
}
/* 页面初始化加载 */
onMounted(async () => {
  mountedToArrPrototype()
  let res = await fetchAlarmManage()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  console.log(res.data)
  options.value = await fetchSuper()
})

</script>
<style>
.p-page2 {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
}

.p2-header {
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}

.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.button2 {
  position: relative;
  margin-top: -40px;
  margin-left: 1035px;
  width: 260px;
}

.data-chart2 {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>