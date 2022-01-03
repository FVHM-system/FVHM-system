<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">许可证管理</p>
      <div style="position:absolute;right:230px;top:50px">
      <el-input type="number" v-model.number="search.data.valveId" placeholder="根据阀栓ID进行搜索"
                  style="position:relative; left:15%; width: 180px"/>
      <el-input v-model="search.data.license" placeholder="根据许可证编号进行搜索"
                  style="position:relative; left:16%; width: 190px"/>
      <el-date-picker
          v-model="daterange"
          type="daterange"
          range-separator="至"
          start-placeholder="Start date"
          end-placeholder="End date"
          style="position:relative; left:17%; margin-top: 3px;margin-left: 10px"
          @change="transformSearchDate"
      />
      <el-button style="position:relative; left:18%" type="primary" @click="search.submit()">查询</el-button>
      <el-button style="position:relative; left:18%" type="info" @click="reset()">重置</el-button>
      <el-button style="position:relative; left:18%; margin-top: 3px;margin-left: 10px" type="success" @click="addModal.open()">新增</el-button>
      </div>
    </div>
    <div class="p-body" id="box">
        <el-table
            :data=currentData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
            :height="tableHeight"
        >
          <el-table-column fixed="left"  label="许可证编号" prop="license" min-width="120px"/>
          <el-table-column fixed="left"  label="阀栓名称" prop="valveName" min-width="300px"/>
          <el-table-column fixed="left"  label="颁发时间" prop="startTime" min-width="120px"/>
          <el-table-column fixed="left"  label="许可用水量" prop="licenseVolume" min-width="120px" />
          <el-table-column fixed="left"  label="可用性" prop="available" min-width="110px">
            <template #default="scope">
              <el-tag :type="statusFormate(scope.row)">{{['不可用','可用'][scope.row.available]}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column fixed="left"  label="颁发部门" prop="departmentName" width="160px"/>
          <el-table-column fixed="right" label="操作" width="300">
            <template #default="scope">
              <el-button @click="editModal.open(scope.row)">修改</el-button>
              <el-popconfirm
              :title="'确认删除许可证 ' + scope.row.license + ' 吗？'"
              @confirm="deleteLic(scope.row.id)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>

      <div class="pagination-out">
      <div class="pagination-in">
        <el-pagination
            v-if="showpagination"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            layout="total, prev, pager, next"
            style="margin-top: 10px;"
            :total="tableData.length">
        </el-pagination>
      </div>
    </div>
    </div>
    <el-dialog  v-model="addModal.show" title="新增许可证">
      <el-form :inline="true">
        <div>
        <el-form-item label="许可证编号" required>
          <el-input style="width:110%" v-model="addModal.data.license" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="对应阀栓" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="addModal.data.valveId" placeholder="请选择">
          <el-option
              v-for="item in valvePlugInformation"
              :key="item.valveId"
              :label="item.valveId + ' - ' + item.valveName"
              :value="item.valveId">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="颁发时间" required>
          <el-date-picker
          style="position:relative; left:6%"
          type="date"
          v-model="addModal.data.startTime"
          placeholder="选择日期"
          @change="transformAddDate()"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="许可用水量" required>
          <el-input type="number" style="width:110%" v-model.number="addModal.data.licenseVolume" />
        </el-form-item>
        <el-form-item style="position:relative; left:8%" label="可用性" required>
            <el-select style="position:relative; left:8%" v-model="addModal.data.available" placeholder="请选择">
            <el-option
              v-for="item in availableoption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="颁发部门" required>
            <el-select style="position:relative; left:6%; width:103%" v-model="addModal.data.departmentId" placeholder="请选择">
            <el-option
              v-for="item in deptoption"
              :key="item.departmentId"
              :label="item.departmentId + ' - ' + item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑许可证">
      <el-form :inline="true">
        <div>
        <el-form-item label="许可证编号" required>
          <el-input style="width:110%" v-model="editModal.data.license" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="对应阀栓" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.valveId" placeholder="请选择">
          <el-option
              v-for="item in valvePlugInformation"
              :key="item.valveId"
              :label="item.valveId + ' - ' + item.valveName"
              :value="item.valveId">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="颁发时间" required>
          <el-date-picker
          style="position:relative; left:6%"
          type="date"
          v-model="editModal.data.startTime"
          placeholder="选择日期"
          @change="transformEditDate()"
          value-format="yyyy-MM-dd">
          </el-date-picker>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="许可用水量" required>
          <el-input type="number" style="width:110%" v-model.number="editModal.data.licenseVolume" />
        </el-form-item>
        <el-form-item style="position:relative; left:8%" label="可用性" required>
            <el-select style="position:relative; left:8%" v-model="editModal.data.available" placeholder="请选择">
            <el-option
              v-for="item in availableoption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="颁发部门" required>
            <el-select style="position:relative; left:6%; width:103%" v-model="editModal.data.departmentId" placeholder="请选择">
            <el-option
              v-for="item in deptoption"
              :key="item.departmentId"
              :label="item.departmentId + ' - ' + item.departmentName"
              :value="item.departmentId">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="editModal.submit()" >确定</el-button>
    </el-dialog>

  </div>
</template>
<script setup>
import {defineComponent, onMounted, ref,toRefs,reactive, computed} from 'vue'
import {useStore} from 'vuex'
import { fetchLicense, searchLicense, addLicense,
deleteLicense, editLicense, fetchDepartments } from "./util/licenseMgmt.js"
import {fetchVpinformation} from "../valveInformation/util/vpinformation.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessageBox,ElLoading, ElMessage} from 'element-plus'
import { licenseStates } from "../../utils/transform";
let showpagination = ref(true)
const store= useStore()
let date=ref()
let valvePlugInformation=ref()
let input = ref('')
let options = ref([])
let tableData = ref([])
let currentPage = 1
let pageSize = 10
let currentData = ref([])
let tableHeight = window.innerHeight - 310
let availableoption = ref([
  {
    value: 1,
    label: '可用'
  },
  {
    value: 0,
    label: '不可用'
  }
])
let deptoption = ref()

function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
	//if(hasTime){
		//return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
	//}else{
		return [year, month, day].join('-');
	//}
}

function handleSizeChange(val) {
  pageSize = val;
}


const statusFormate = function (row){
  return ['danger','success'][row.available]
}

let daterange = ref([])
const search = reactive({
  data:{
    valveId:null,
    license:null,
    start:null,
    end:null,
  },
  async submit(){
    const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
    let res = await searchLicense(this.data)
    loadingInstance.close()
    if (res.code == '200'){
      tableData.value = res.data;
      console.log(res.data)
      currentData.value = tableData.value.slice(0, pageSize)
    }
    else {ElMessage({
        type: 'error',
        message : '搜索失败'
      })}
  }
})

async function reset(){
  search.data.valveId=null
  search.data.license=null
  daterange.value=[]
  search.data.start=null
  search.data.end=null
  showpagination.value = false
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await searchLicense(this.data)
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
    valveId: '',
    license:'',
    startTime:'',
    licenseVolume:'',
    available:'',
    departmentId:'',
  },
  open(){
    this.show = true;
  },
  async submit(){
    let res = await addLicense(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '添加成功'
      })
      this.data.id=''
      this.data.valveId=''
      this.data.license=''
      this.data.startTime=''
      this.data.licenseVolume=''
      this.data.available=''
      this.data.departmentId=''
      res = await fetchLicense()
      if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
    valveId: '',
    license:'',
    startTime:'',
    licenseVolume:'',
    available:'',
    departmentId:'',
  },
  open(row){
    this.data.id=row.id
    this.data.valveId=row.valveId
    this.data.license=row.license
    this.data.startTime=row.startTime
    this.data.licenseVolume=row.licenseVolume
    this.data.available=row.available
    this.data.departmentId=row.departmentId
    this.show = true;
  },
  async submit(){
    console.log(this.data)
    let res = await editLicense(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '修改成功'
      })
      const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
      res = await fetchLicense()
      loadingInstance.close()
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
  }
})

async function deleteLic(id){
  let res = await deleteLicense({id})
  if(res.code=='200') {
      ElMessage({
        message:'删除成功',
        type:'success'
      })
    res = await fetchLicense()
    if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  }
}

function transformAddDate(){
  addModal.data.startTime=dateFormatter(addModal.data.startTime)
}

function transformEditDate(){
  editModal.data.startTime=dateFormatter(editModal.data.startTime)
}

function transformSearchDate(){
  search.data.start=dateFormatter(daterange.value[0])
  search.data.end=dateFormatter(daterange.value[1])
  console.log(search.data.start)
  console.log(search.data.end)
}

onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await fetchLicense()
  if (res.code === '200') {
    tableData.value = res.data;
  }
  if (tableData.value.length < pageSize) {
    currentData.value = tableData.value
  } else {
    currentData.value = tableData.value.slice(0, pageSize)
  }
  res = await fetchVpinformation()
  if (res.code === '200') {
    valvePlugInformation.value = res.data;
  }
  res = await fetchDepartments()
  if (res.code === '200') {
    deptoption.value = res.data;
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
</style>
