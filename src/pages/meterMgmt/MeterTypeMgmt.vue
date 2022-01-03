<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">设备型号管理</p>
      <el-button  type="success" style="position:absolute;right:60px;top:30px" @click="addModal.open()">新增</el-button>
    </div>
      <div class="p-body" id="box">
        <el-table
            :data=tableData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
            :height="tableHeight"
        >
          <el-table-column fixed="left" label="ID" prop="id" min-width="100px"/>
          <el-table-column fixed="left"  label="型号编号" prop="meterNo" min-width="150px"/>
          <el-table-column fixed="left"  label="类型名称" prop="meterNoName" min-width="150px"/>
          <el-table-column fixed="left" label="用途" prop="meterType" min-width="150px">
            <template #default="scope">
              {{['流量计','压力计'][scope.row.meterType-1]}}
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="水表口径" prop="meterCaliber" min-width="120px" />
          <el-table-column fixed="left" label="带阀控" prop="meterVc" min-width="120px">
            <template #default="scope">
              {{['是','否'][scope.row.meterVc-1]}}
            </template>
          </el-table-column>
          <el-table-column fixed="left" label="创建时间" prop="createTime" min-width="250px" />
          <el-table-column  label="操作" min-width="200">
            <template #default="scope">
              <el-button @click="editModal.open(scope.row)">修改</el-button>
              <el-popconfirm
              :title="'确认删除设备 ' + scope.row.meterCode + ' 吗？'"
              @confirm="deleteMetType(scope.row.id)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
    <el-dialog  v-model="addModal.show" title="新增类型">
      <el-form :inline="true">
        <div>
        <el-form-item label="型号编号" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.meterNo">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="类型名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.meterNoName">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="用途" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="addModal.data.meterType" placeholder="请选择">
          <el-option
              v-for="item in meterType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="水表口径" required>
            <el-input type="number" style="width:110%" v-model.number="addModal.data.meterCaliber" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="带阀栓控制" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="addModal.data.meterVc">
            <el-option v-for="item in meterVc" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="创建时间" required>
          <el-date-picker
          v-model="addModal.data.createTime"
          type="datetime"
          placeholder="选择日期时间"
          @change="transformAddDate()">
          </el-date-picker>
        </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑类型">
        <el-form :inline="true">
        <div>
        <el-form-item label="型号编号" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.meterNo">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="类型名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.meterNoName">
          </el-input>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="用途" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.meterType" placeholder="请选择">
          <el-option
              v-for="item in meterType"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="水表口径" required>
            <el-input type="number" style="width:110%" v-model.number="editModal.data.meterCaliber" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="带阀栓控制" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.meterVc">
            <el-option v-for="item in meterVc" :key="item.value" :value="item.value" :label="item.label">
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
          @change="transformAddDate()">
          </el-date-picker>
        </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="editModal.submit()" >确定</el-button>
    </el-dialog>

  </div>
</template>
<script setup>
import {defineComponent, onMounted, ref,toRefs,reactive, computed} from 'vue'
import {ElLoading} from 'element-plus'
import {useStore} from 'vuex'
import { getMeterType, addMeterType,
editMeterType, deleteMeterType } from "./util/MeterTypeMgmt.js"
import {fetchVpinformation} from "../valveInformation/util/vpinformation.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage} from 'element-plus'

const store= useStore()
let date=ref()
let valvePlugInformation=ref()
let input = ref('')
let tableData = ref([])
let tableHeight = window.innerHeight - 240

let meterVc = ref([])
meterVc.value=[
  {
    value:1,
    label:'是'
  },
  {
    value:2,
    label:'否'
  }
]

let meterType = ref([])
meterType.value=[
  {
    value:1,
    label:'流量计'
  },
  {
    value:2,
    label:'压力计'
  }
]


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

const addModal = reactive({
  show : false,
  data : {
    meterNo: '',
    meterNoName: '',
    meterType:'',
    meterCaliber:'',
    meterVc:'',
    createTime:'',
  },
  open(){
    this.show = true;
  },
  async submit(){
    if( !this.data.meterNo || !this.data.meterNoName ){
      ElMessage({
        type: 'error',
        message : '不能为空'
      })
      return
    }
    let res = await addMeterType(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '添加成功'
      })
      this.data.meterNo=''
      this.data.meterNoName=''
      this.data.meterType=''
      this.data.meterCaliber=''
      this.data.meterVc=''
      this.data.createTime=''
      res = await getMeterType()
      if (res.code === '200') {
      tableData.value = res.data;
      this.show = false;
      }
    }
    else {ElMessage({
        type: 'error',
        message : '添加失败'
      })}
  }
})

const editModal = reactive({
  show : false,
  data : {
    id: '',
    meterNo: '',
    meterNoName: '',
    meterType:'',
    meterCaliber:'',
    meterVc:'',
    createTime:'',
  },
  open(row){
    this.data.id=row.id
    this.data.meterNo=row.meterNo
    this.data.meterNoName=row.meterNoName
    this.data.meterType=row.meterType
    this.data.meterCaliber=row.meterCaliber
    this.data.meterVc=row.meterVc
    this.data.createTime=row.createTime
    this.show = true;
  },
  async submit(){
    console.log(this.data)
    let res = await editMeterType(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '修改成功'
      })
      res = await getMeterType()
      if (res.code === '200') {
      tableData.value = res.data;
      this.show = false;
      }
    }
    else {ElMessage({
        type: 'error',
        message : '修改失败'
      })}
  }
})

async function deleteMetType(id){
  let res = await deleteMeterType({id})
  if(res.code=='200') {
      ElMessage({
        message:'删除成功',
        type:'success'
      })
    res = await getMeterType()
    if (res.code === '200') {
      tableData.value = res.data;
    }
  }
}


onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: true})
  let res = await getMeterType()
  if (res.code === '200') {
    tableData.value = res.data;
  }
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
  left:80%;
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
