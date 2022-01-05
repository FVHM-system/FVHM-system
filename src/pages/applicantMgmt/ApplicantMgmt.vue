<template>
  <div class="p-page2">
    <div class="p2-header" >
      <p class="page2-name">单位管理</p>
      <div style="position:absolute;right:250px;top:30px">
      <el-input v-model="search.data.applicantName" placeholder="根据单位名称进行搜索"
                  style="position:relative; left:25%; width: 200px"/>
      <el-input v-model="search.data.address" placeholder="根据地址进行搜索(支持模糊查找)"
                  style="position:relative; left:26%; width: 250px"/>
      <el-button style="position:relative; left:28%" type="primary" @click="search.submit()">查询</el-button>
      <el-button style="position:relative; left:28%" type="info" @click="reset()">重置</el-button>
      <el-button style="position:relative; left:28%" type="success" @click="addModal.open()">新增</el-button>
      </div>
    </div>
    <div id="box" class="p-body">
        <el-table
            :data=currentData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
            :height="tableHeight"
        >
          <el-table-column fixed="left"  label="单位名称" prop="applicantName" min-width="150px"/>
          <el-table-column fixed="left"  label="法定代表人" prop="legalPerson" min-width="150px"/>
          <el-table-column fixed="left"  label="地址" prop="address" min-width="250px"/>
          <el-table-column fixed="left"  label="邮编" prop="code" min-width="150px"/>
          <el-table-column fixed="left"  label="联系人" prop="contactPerson" min-width="150px"/>
          <el-table-column fixed="left"  label="电话号码" prop="phone" min-width="200px"/>
          <el-table-column fixed="right" label="操作" min-width="200">
            <template #default="scope">
              <el-button @click="editModal.open(scope.row)">修改</el-button>
              <el-popconfirm
              :title="'确认删除单位 ' + scope.row.applicantName + ' 吗？'"
              @confirm="deleteApp(scope.row.applicantId)"
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



    <el-dialog  v-model="addModal.show" title="新增部门">
      <el-form :rules="addRule" ref="addCheck" :model="addModal.data" :inline="true">
        <div>
        <el-form-item label="单位名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.applicantName">
          </el-input>
        </el-form-item>
        <el-form-item style="position:relative; left:5%;" label="法定代表人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.legalPerson" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="单位地址" required>
            <el-input style="position:relative; left:6%; width:150%" v-model="addModal.data.address">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" style="position:relative; left:16%;"  label="邮编" required>
            <el-input style="position:relative; width:86%" v-model="addModal.data.code">
          </el-input>
        </el-form-item>
        </div>
        <div>
          <el-form-item label="联系人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.contactPerson">
          </el-input>
          </el-form-item>
          <el-form-item prop="phone" style="position:relative; left:8%;" label="电话号码" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.phone" />
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑单位">
      <el-form :rules="addRule" ref="editCheck" :model="editModal.data" :inline="true">

        <div>
        <el-form-item label="单位名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.applicantName">
          </el-input>
        </el-form-item>
        <el-form-item style="position:relative; left:5%;" label="法定代表人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.legalPerson" />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="单位地址" required>
            <el-input style="position:relative; left:6%; width:150%" v-model="editModal.data.address">
          </el-input>
        </el-form-item>
        <el-form-item prop="code" style="position:relative; left:16%;"  label="邮编" required>
            <el-input style="position:relative; width:86%" v-model="editModal.data.code">
          </el-input>
        </el-form-item>
        </div>
        <div>
          <el-form-item label="联系人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.contactPerson">
          </el-input>
          </el-form-item>
          <el-form-item prop="phone" style="position:relative; left:8%;" label="电话号码" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.phone" />
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="editModal.submit()" >确定</el-button>
    </el-dialog>

  </div>
</template>
<script setup>
import {defineComponent, onMounted, ref,toRefs,reactive, computed} from 'vue'
import { ElLoading } from 'element-plus'
import {useStore} from 'vuex'
import { getApplicant, searchApplicant, addApplicant,
editApplicant, deleteApplicant } from "./util/ApplicantMgmt.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage} from 'element-plus'
let showpagination = ref(true)
const store= useStore()
let input = ref('')
let tableData = ref([])
let currentPage = 1
let pageSize = 10
let currentData = ref([])
let tableHeight = window.innerHeight - 310
let addCheck=ref(null)
let editCheck=ref(null)

const addRule=reactive({
  code:[
    {
      required: true,
      message: '请输入6位邮编',
      trigger: 'blur',
      type: 'string',
      pattern: /^[0-9]+$/,
      //pattern: /^[\u4e00-\u9fa5]+$/,
      len:6,
    }
  ],
  phone:[
    {
      required: true,
      message: '请输入固定电话号码(XXXX-XXXXXXX，XXXX-XXXXXXXX，XXX-XXXXXXX，XXX-XXXXXXXX，XXXXXXX，XXXXXXXX)',
      trigger: 'blur',
      type: 'string',
      pattern: /^(\d3,4\d3,4|\d{3,4}-)?\d{7,8}$/,
      //pattern: /^[\u4e00-\u9fa5]+$/,
    }
  ],
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

const search = reactive({
  data:{
    applicantName:null,
    address:null,
  },
  async submit(){
    let res = await searchApplicant(this.data)
    if (res.code == '200'){
      if(res.data.length!==0){
        ElMessage({
          type: 'success',
          message : '查询成功'
        })
        tableData.value = res.data;
      }
      else {
        ElMessage({
          type: 'warning',
          message : '尚无当前所查数据'
        })
      }
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
  search.data.applicantName=null
  search.data.address=null
  showpagination.value = false
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await getApplicant()
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
    applicantName: '',
    legalPerson:'',
    address:'',
    code:'',
    contactPerson:'',
    phone:'',
  },
  open(){
    this.show = true;
  },
  async submit(){
    addCheck.value.validate(async (valid)=>{
      if(valid){
        if( !this.data.applicantName || !this.data.legalPerson ){
      ElMessage({
        type: 'error',
        message : '不能为空'
      })
      return
    }
    let res = await addApplicant(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '添加成功'
      })
      this.data.applicantName=''
      this.data.legalPerson=''
      this.data.address=''
      this.data.code=''
      this.data.contactPerson=''
      this.data.phone=''
      res = await getApplicant()
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
      else{
        ElMessage({
        type: 'error',
        message : '请输入正确的邮编和固定电话号码'
      })
      }
    })
    
  
  }
})

const editModal = reactive({
  show : false,
  data : {
    applicantId: '',
    applicantName: '',
    legalPerson:'',
    address:'',
    code:'',
    contactPerson:'',
    phone:'',
  },
  open(row){
    this.data.applicantId=row.applicantId
    this.data.applicantName=row.applicantName
    this.data.legalPerson=row.legalPerson
    this.data.address=row.address
    this.data.code=row.code
    this.data.contactPerson=row.contactPerson
    this.data.phone=row.phone
    this.show = true;
  },
  async submit(){
    editCheck.value.validate(async (valid)=>{
      if(valid){
        console.log(this.data)
    let res = await editApplicant(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '修改成功'
      })
      res = await getApplicant()
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
        message : '请输入正确的邮编和固定电话号码'
      })
      }
    })
    
  }
})

async function deleteApp(id){
  let res = await deleteApplicant({id})
  if(res.code=='200') {
      ElMessage({
        message:'删除成功',
        type:'success'
      })
    res = await getApplicant()
    if (res.code === '200') {
      tableData.value = res.data;
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  }
}


onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  let res = await getApplicant()
  if (res.code === '200') {
    tableData.value = res.data;
    currentData.value = tableData.value.slice(0, pageSize)
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

body {
  margin: 0;
}
.p-body {
  margin-top: 10px;
}
</style>
