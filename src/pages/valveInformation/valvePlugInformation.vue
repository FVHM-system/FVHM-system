<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">阀栓信息</p>
      <el-form
          :model="searchForm"
          status-icon
          label-width="120px"
          class="searchForm"
          style="position: absolute;top:30px;right: 40px;"
      >
        <el-form-item prop="place">
          <el-cascader
              v-model="searchForm.place"
              :options="optionss"
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
            <el-button type="success"
                       @click="add"
                       :disabled="buttonState"
            >新增
            </el-button>
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
        <el-table-column label="阀栓设置时间" prop="createTime"
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
      <el-dialog
          v-model="dialogVisible"
          title="填写阀栓信息"
          width="50%"
          :before-close="handleClose">
        <el-form ref="addForm" :rules="addRule" :model="formData" label-width="120px">
          <div style="display: flex;flex-direction: row">
            <el-form-item prop="valveName" label="阀栓名称">
              <el-input v-model="formData.valveName" style="width: 190px"></el-input>
            </el-form-item>
            <el-form-item prop="valveCode" label="阀栓编号">
              <el-input v-model="formData.valveCode" style="width: 190px"></el-input>
            </el-form-item>
          </div>
          <div style="margin-top:10px;display: flex;flex-direction: row">
            <el-form-item prop="place" label="所在位置">
              <el-cascader
                  v-model="formData.place"
                  :options="optionss"
                  :props="mypropss"
                  placeholder="选择地址"
                  :show-all-levels="false"
                  style="width: 190px"
                  clearable></el-cascader>
            </el-form-item>
            <el-form-item prop="createTime" label="阀栓创建时间">
              <el-date-picker
                  value-format="YYYY-MM-DD HH:mm:ss"
                  v-model="formData.createTime"
                  type="datetime"
                  placeholder="选择阀栓创建时间"
                  style="width: 190px"
              >
              </el-date-picker>
            </el-form-item>
          </div>
          <div style="display: flex;margin-top:10px;flex-direction: row;">
            <el-form-item prop="longitude" label="经度">
              <el-input v-model="formData.longitude" style="width: 150px"></el-input>
            </el-form-item>
            <el-form-item prop="comNumber" label="通讯编号" style="margin-left: 40px">
              <el-input v-model="formData.comNumber" style="width: 190px"></el-input>
            </el-form-item>
          </div>
          <div style="display: flex;margin-top:10px;flex-direction: row">
            <el-form-item prop="latitude" label="纬度">
              <el-input v-model="formData.latitude" style=" width: 150px"></el-input>
            </el-form-item>
            <el-form-item prop="valveType" label="阀栓类型" style="margin-left: 40px;">
              <el-select v-model="formData.valveType" placeholder="选择类型" style="width: 120px">
                <el-option
                    v-for="item in optionsss"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex;margin-top:10px;flex-direction: row">
            <el-form-item prop="status" label="状态">
              <el-select v-model="formData.status" placeholder="选择状态" style="width: 140px">
                <el-option
                    v-for="item in statuss"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item prop="applicantId" label="所属单位" style="margin-left: 50px;">
              <el-select v-model="formData.applicantId" placeholder="选择所属单位" style="width: 190px">
                <el-option
                    v-for="item in applicantList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                >
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex;margin-top:10px;flex-direction: row">
            <el-form-item prop="remark" label="备注">
              <el-input v-model="formData.remark" style="width: 190px"></el-input>
            </el-form-item>
          </div>
        </el-form>
        <template #footer>
      <span class="dialog-footer">
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" @click="confirm"
        >确认</el-button
        >
      </span>
          <p style="font-size: 3px;color: red">(注：除备注外其他项均不可为空)</p>
        </template>
      </el-dialog>
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
import {ElMessageBox} from 'element-plus'
import {fetInsertValveInfo} from "./util/vpinformation";
import axios from "axios";
import {getApplicant} from "../applicantMgmt/util/ApplicantMgmt";
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
  fetchAuthority,
  fetchUsername
} from '../../utils/mrWang'

let formData = reactive({
  place:[],
  valveName: '',
  valveCode: '',
  createTime: '',
  longitude: '',
  comNumber: '',
  latitude: '',
  valveType: '',
  status: '',
  applicantId: '',
  remark: ''
});
const addRule = reactive({
  valveName:
      [
        {
          required: true,
          message: '请输入阀栓名称',
          trigger: 'blur',
        }
      ],
  valveCode:
      [
        {
          required: true,
          message: '请输入阀栓编号',
          trigger: 'blur',
        }
      ],
  createTime:
      [

      ],
  longitude:
      [

      ],
  comNumber:
      [

      ],
  latitude:
      [

      ],
  valveType:
      [

      ],
  status:
      [

      ],
  applicantId:
      [

      ],
})
let addForm = ref()
let input = ref('')
let applicantList = ref([])
let optionsss = ref([
  {
    value: 1,
    label: '阀门',
  },
  {
    value: 2,
    label: '消防栓',
  }
])
let place = ref()
let mypropss = ref()
mypropss = {
  label: 'name',
  value: 'message',
  children: 'child',
}
const {proxy} = getCurrentInstance()
let tableHeight = window.innerHeight - 310
let authority = ref('')
let buttonState = ref(false)//禁用按钮
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
  place: '',
  type: '',
  status: ''
})

function handleSizeChange(val) {
  pageSize = val;
}

// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}

let optionss = ref([])
const statussss = [
  {
    value: 1001,
    label: '正常运行',
  },
  {
    value: 1002,
    label: '尚未安装',
  },
  {
    value: 1003,
    label: '已经停用',
  },
  {
    value: 4444,
    label: '正在报警',
  },
]
const add = function () {
  dialogVisible.value = true
}
let valveInfo
const stringJudge = function (input) {
  if (!input) {
    return ''
  } else {
    return input.toString()
  }
}

const confirm = async function () {
    addForm.value.validate(async (valid) => {
      if (valid){
        console.log('ssss')
        // valveInfo = {
        //   place : [],
        //   valveName:'',
        //   valveCode:'',
        //   createTime:'',
        //   longitude:'',
        //   comNumber:'',
        //   latitude:'',
        //   valveType:'',
        //   status:'',
        //   applicantId:'',
        //   remark:'',
        //   zoneId:'',
        // }
        // valveInfo.zoneId = formData.place[5].zoneId
        // valveInfo.applicantId = formData.applicantId
        // valveInfo.comNumber = stringJudge(formData.comNumber)
        // valveInfo.createTime = formData.createTime
        // valveInfo.latitude = parseFloat(formData.latitude)
        // valveInfo.longitude = parseFloat(formData.longitude)
        // valveInfo.remark = stringJudge(formData.remark)
        // valveInfo.status = formData.status
        // valveInfo.valveCode = stringJudge(formData.valveCode)
        // valveInfo.valveId = 0
        // valveInfo.zoneType = 2
        // valveInfo.valveName = stringJudge(formData.valveName)
        // valveInfo.valveType = formData.valveType
        // valveInfo = JSON.stringify(valveInfo)
        // let res = await fetInsertValveInfo(valveInfo)
        // if (res.code === '200') {
        //   ElMessage({
        //     type: 'success',
        //     message: '操作成功！',
        //   })
        //   dialogVisible.value = false
        //   pageshow = false
        //   let res = await fetchVpinformation()
        //   if (res.code === '200') {
        //     tableData.value = res.data;
        //   }
        //   if (tableData.value.length < pageSize) {
        //     currentData.value = tableData.value
        //   } else {
        //     currentData.value = tableData.value.slice(0, pageSize)
        //   }
        //   currentPage = 1
        //   pageshow = true
        // } else {
        //   ElMessage({
        //     type: 'error',
        //     message: '添加失败！',
        //   })
        //   return
        // }
      } else {
        ElMessage({
          type: 'error',
          message: '未填写完整数据！',
        })
      }
    })
}

function dateTimeTrans(d) {
  if (typeof d === 'string') {
    return d
  }
  if (!d) {
    return ''
  }
}

async function getApplicantList() {
  let res = await getApplicant()
  applicantList.value = res.data.map(item => {
    return {
      value: item.applicantId,
      label: item.applicantName
    }
  })
}

const handleClose = (done) => {
  ElMessageBox.confirm('是否要退出编辑？')
  .then(() => {
    done()
  })
  .catch(() => {
    // catch error
  })
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
      pageshow = false
      let res = await fetchVpinformation()
      if (res.code === '200') {
        tableData.value = res.data;
      }
      if (tableData.value.length < pageSize) {
        currentData.value = tableData.value
      } else {
        currentData.value = tableData.value.slice(0, pageSize)
      }
      currentPage = 1
      pageshow = true
    }
  } else if (row.status === 1001 || row.status === 4444) {
    let res = await fetUpdateStatus({valveId: row.valveId, status: 1003})
    console.log(res)
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '停用成功！',
      })
      pageshow = false
      let res = await fetchVpinformation()
      if (res.code === '200') {
        tableData.value = res.data;
      }
      if (tableData.value.length < pageSize) {
        currentData.value = tableData.value
      } else {
        currentData.value = tableData.value.slice(0, pageSize)
      }
      currentPage = 1
      pageshow = true
    }
  }
}
/* 查询 */
const dataFind = async function () {
  let address = ref('')
  console.log(searchForm.place)
  if (searchForm.place) {
    if (searchForm.place.length > 1) {
      for (let i = searchForm.place.length - 1; i >= 0; i--) {
        address.value = searchForm.place[i].name + address.value
      }
    }
  }
  console.log(searchForm.type, searchForm.status, address.value)
  let res = await fetchFindData(searchForm.type, searchForm.status, address.value)
  if (res.code === '200') {
    if (res.data.length > 0) {
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
    } else {
      ElMessage({
        type: 'warning',
        message: '尚无当前所查数据！',
      })
    }
  }
  console.log(tableData.value)
  console.log(address.value)
}

const dataRequire = async function () {
  searchForm.place = ''
  searchForm.type = ''
  searchForm.status = ''
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
    pageshow = false
    let res = await fetchVpinformation()
    if (res.code === '200') {
      tableData.value = res.data;
    }
    if (tableData.value.length < pageSize) {
      currentData.value = tableData.value
    } else {
      currentData.value = tableData.value.slice(0, pageSize)
    }
    currentPage = 1
    pageshow = true
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
      name: 'applicantName'
    }
  ]

  let temp = await fetchVpinformation()
  temp.data.map(item => {
    if (item.valveType === 1) {//
      item.valveType = "阀门"
    } else if (item.valveType === 2) {
      item.valveType = "消防栓"
    }

    if (item.status === 1001) {
      item.status = "正在运行"
    } else if (item.status === 1002) {
      item.status = "尚未安装"
    } else if (item.status === 1003) {
      item.status = "已经停用"
    } else if (item.status === 4444) {
      item.status = "正在报警"
    }

  })

  excel.body = temp.data
  excel.fileName = '阀栓信息表'
  exportExcel(excel)
}

onMounted(async () => {
  authority.value = fetchAuthority()
  if (authority.value === 'ROLE_ADMIN') {
    buttonState.value = false
  } else {
    buttonState.value = true
  }
  const loadingInstance = ElLoading.service(
      {target: document.getElementById("data-chart"), fullscreen: false})
  let res = await fetchVpinformation()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  optionss.value = await fetchSuper()
  await getApplicantList()
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

.pagination-out {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 70px;
}

.pagination-in {
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

.searchForm {
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
