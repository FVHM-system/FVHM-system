<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">监测设备管理</p>

      <div style="position:absolute;right:60px;top:30px">
        <el-input v-model="id" placeholder="根据设备编号进行搜索"
                  style="width: 200px"/>
        <el-button style="position:relative; margin-left: 10px" type="primary" @click="submit()">查询</el-button>
        <el-button style="position:relative; margin-left: 10px" type="info" @click="reset()">重置</el-button>
        <el-button style="position:relative; margin-left: 10px" type="success" @click="addModal.open()">新增</el-button>
      </div>

    </div>
    <div class="p-body">
        <el-table
            id="box"
            :data=currentData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
            :height="tableHeight"
        >
          <el-table-column fixed="left"  label="设备编号" prop="meterCode" min-width="200px"/>
          <el-table-column fixed="left"  label="设备名称" prop="meterName" min-width="200px"/>
          <el-table-column fixed="left" label="状态" prop="status" min-width="100px">
            <template #default="scope">
              <el-tag :type="statusFormate(scope.row.status)">{{['不正常','正常'][scope.row.status]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="设备型号" prop="meterNoName" width="180px" />
          <el-table-column fixed="left" label="安装时间" prop="createTime" width="230px" />
          <el-table-column fixed="right" label="操作" width="200">
            <template #default="scope">
              <el-button @click="editModal.open(scope.row)">修改</el-button>
              <el-popconfirm
              :title="'确认删除设备 ' + scope.row.meterCode + ' 吗？'"
              @confirm="deleteMet(scope.row.meterId)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
     </div>
        <div class="pagination-out">
        <div class="pagination-in">
        <el-pagination
            v-if="showpagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            v-model:currentPage="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            style="margin-top: 10px;"
            :total="tableData.length">
        </el-pagination>
      </div>
    </div>

    <el-dialog width="25%" v-model="addModal.show" title="新增设备">
      <el-form :rules="addRule" ref="addCheck" :model="addModal.data" :inline="true">
        <div>
        <el-form-item prop="meterCode" label="设备编号" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.meterCode">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="设备名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.meterName">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item style="margin-left: 8px" label="监测阀栓">
          <el-select no-data-text="当前没有需要监测的阀栓" style="position:relative; left:6%; width:101%" v-model="addModal.data.valveId" placeholder="请选择">
          <el-option
              v-for="item in valvePlugInformation"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="状态" required>
            <el-select style="position:relative; left:18%" v-model="addModal.data.status" placeholder="请选择">
            <el-option
              v-for="item in statusoption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="设备类型" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="addModal.data.typeId">
            <el-option v-for="item in meterType" :key="item.id" :value="item.id" :label="item.id + ' - ' + item.meterNoName">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="创建时间" required>
          <el-date-picker
          style="position:relative; left:6%"
          v-model="addModal.data.createTime"
          type="datetime"
          placeholder="选择日期时间"
          @change="transformAddDate()">
          </el-date-picker>
        </el-form-item>
        </div>
      </el-form>
      <el-footer style="text-align: end">
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
      </el-footer>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑设备">
      <el-form :rules="addRule" ref="editCheck" :model="editModal.data" :inline="true">
        <div>
        <el-form-item prop="meterCode" label="设备编号" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.meterCode">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="设备名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.meterName">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="监测阀栓" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.valveId" placeholder="请选择">
          <el-option
              v-for="item in valvePlugInformation"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="状态" required>
            <el-select style="position:relative; left:8%" v-model="editModal.data.status" placeholder="请选择">
            <el-option
              v-for="item in statusoption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="设备类型" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.typeId">
            <el-option v-for="item in meterType" :key="item.id" :value="item.id" :label="item.id + ' - ' + item.meterNoName">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="创建时间" required>
          <el-date-picker
          v-model="editModal.data.createTime"
          type="datetime"
          placeholder="选择日期时间"
          @change="transformEditDate()">
          </el-date-picker>
        </el-form-item>
        </div>
      </el-form>
      <el-button style="right: 20px" type="primary"  @click="editModal.submit()" >确定</el-button>
    </el-dialog>

  </div>
</template>
<script setup>
import {defineComponent, onMounted, ref,toRefs,reactive, computed, resolveDirective} from 'vue'
import {useStore} from 'vuex'
import { getMeter, getMeterById, addMeter,
editMeter, deleteMeter } from "./util/MeterMgmt.js"
import { getMeterType } from "./util/MeterTypeMgmt.js"
import {fetchVpinformationById, fetchHasNoMeterVpinformation} from "../valveInformation/util/vpinformation.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage, ElLoading} from 'element-plus'
let showpagination = ref(true)
const store= useStore()
let date=ref()
let valvePlugInformation=ref([])
let valvePlug
let input = ref('')
let tableData = ref([])
let currentPage = 1
let pageSize = 10
let currentData = ref([])
let addCheck=ref(null)
let editCheck=ref(null)
let tableHeight = window.innerHeight - 310
let meterType = ref([])
let statusoption = ref([])
statusoption.value = [
  {
    value: 1,
    label: '正常'
  },
  {
    value: 0,
    label: '不正常'
  }
]
const addRule=reactive({
  meterCode:[
    {
      required: true,
      message: '请输入9位设备编号',
      trigger: 'blur',
      type: 'string',
      pattern: /^[0-9]+$/,
      //pattern: /^[\u4e00-\u9fa5]+$/,
      len:9,
    }
  ]
})
function handleSizeChange(val) {
  pageSize = val;
}
// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  console.log(currentPage)
}

const statusFormate = function (i){
  return ['danger','success'][i]
}

function dateFormatter(str){//默认返回yyyy-MM-dd HH-mm-ss
	var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
	var d = new Date(str);
	var year = d.getFullYear();
	var month = (d.getMonth()+1)<10 ? '0'+(d.getMonth()+1) : (d.getMonth()+1);
	var day = d.getDate()<10 ? '0'+d.getDate() : d.getDate();
	var hour = d.getHours()<10 ? '0'+d.getHours() : d.getHours();
	var minute = d.getMinutes()<10 ? '0'+d.getMinutes() : d.getMinutes();
	var second = d.getSeconds()<10 ? '0'+d.getSeconds() : d.getSeconds();
	if(hasTime){
		return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
	}else{
		return [year, month, day].join('-');
	}
}

function transformAddDate(){
  addModal.data.createTime=dateFormatter(addModal.data.createTime)
}

function transformEditDate(){
  editModal.data.createTime=dateFormatter(editModal.data.createTime)
}

let id = ref()
async function submit(){
  console.log(JSON.stringify(id.value))
    if (!id.value){
      return
    }
    else{
      const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
      let res = await getMeterById(id.value)
      if (res.code === '200') {
        if(res.data) {
          currentData.value = [res.data]
        }
        else{
          ElMessage({
            type: 'warning',
            message : '尚无当前所查数据'
          })
        }
      }
      loadingInstance.close()
    }
}

async function reset(){
  id.value = null
  showpagination.value = false
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await getMeter()
    if (res.code == '200'){
      tableData.value = res.data;
    }
  currentPage = 1
  showpagination.value = true
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  loadingInstance.close()
  ElMessage({
        type: 'success',
        message : '重置成功'
      })
}

const addModal = reactive({
  show : false,
  data : {
    meterCode: '',
    meterName: '',
    valveId:'',
    status:'',
    typeId:'',
    createTime:'',
  },
  async open(){
    const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
    let res = await fetchHasNoMeterVpinformation()
    if (res.code === '200') {
    valvePlug = res.data;
    console.log('sdsd',res.data)
    valvePlugInformation.value = res.data.map(item=>{
      return{
        value:item.valveId,
        label:item.valveName
      }
    })
    }
    console.log()
    loadingInstance.close(valvePlugInformation.value)
    this.show = true;
  },
  async submit(){
    addCheck.value.validate(async (valid)=>{
      if(valid){
        if( !this.data.meterCode || !this.data.meterName ){
      ElMessage({
        type: 'error',
        message : '不能为空'
      })
      return
    }
    let res = await addMeter(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '添加成功'
      })
      this.data.meterCode=''
      this.data.meterName=''
      this.data.valveId=''
      this.data.status=''
      this.data.typeId=''
      this.data.createTime=''
      res = await getMeter()
      if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      }
      this.show = false;
    }
    else {ElMessage({
        type: 'error',
        message : '添加失败'
      })}
      }else{
        ElMessage({
        type: 'error',
        message : '请输入9位数字设备编号'
      })
      }
    })
    
  }
})

const editModal = reactive({
  show : false,
  data : {
    meterId:'',
    meterCode: '',
    meterName: '',
    valveId:'',
    status:'',
    typeId:'',
    createTime:'',
  },
  async open(row){
    this.data.meterId=row.meterId
    this.data.meterCode=row.meterCode
    this.data.meterName=row.meterName
    this.data.valveId=row.valveId
    this.data.status=row.status
    this.data.typeId=row.typeId
    this.data.createTime=row.createTime
    const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
    let res = await fetchHasNoMeterVpinformation()
    if (res.code === '200') {
    valvePlug = res.data;
    console.log('sdsd',res.data)
    valvePlugInformation.value = res.data.map(item=>{
      return{
        value:item.valveId,
        label:item.valveName
      }
    })
    }
    res = await fetchVpinformationById(row.valveId)
    if(res.code==='200'){
      console.log('default',res.data)
      let tmp = ref([])
      tmp={
        value:res.data.valveId,
        label:res.data.valveName
      }
    valvePlugInformation.value.push(tmp)
    console.log('success',valvePlugInformation.value)
    }

    this.show = true;
    loadingInstance.close()
  },
  async submit(){
    editCheck.value.validate(async (valid)=>{
      if(valid){
        console.log(this.data)
    let res = await editMeter(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '修改成功'
      })
      res = await getMeter()
      if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
      this.show = false;
      }
    }
    else {ElMessage({
        type: 'error',
        message : '修改失败'
      })}
      }else{
        ElMessage({
        type: 'error',
        message : '请输入9位数字设备编号'
      })
      }
    })
    
  }
})

async function deleteMet(id){
  let res = await deleteMeter({id})
  if(res.code=='200') {
      ElMessage({
        message:'删除成功',
        type:'success'
      })
    res = await getMeter()
    if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  }
}


onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await getMeter()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  res = await getMeterType()
  if (res.code === '200') {
    meterType.value = res.data;
  }
  res = await fetchHasNoMeterVpinformation()
  if (res.code === '200') {
    valvePlug = res.data;
    console.log('sdsd',res.data)
    valvePlugInformation.value = res.data.map(item=>{
      return{
        value:item.valveId,
        label:item.valveName
      }
    })
  }
  console.log('success',valvePlugInformation.value)
  loadingInstance.close()
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
  border: 1px solid #219ded0f;
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}
.drawer{
  background-color: #969696;
}
.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.addrSelect2 {
  position: relative;
  top: 3px;
  margin-left: -25px;
}

.roadName {
  position: relative;
  top: 3px;
  left: 410px;
}
.vblock{
  position: relative;
  top: -37px;
  left: 625px;
}
.addbutton{
  position:relative;
  left:-50%;
  top:3px;
}
.data-chart2 {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
.p-body {
  margin-top: 10px;
}
</style>
