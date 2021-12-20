<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">单位管理</p>
      <el-button class="addbutton" type="primary" @click="addModal.open()">新增单位</el-button>
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
          <el-table-column fixed="left" label="单位ID" prop="applicantId" width="150px"/>
          <el-table-column fixed="left"  label="单位名称" prop="applicantName" width="250px"/>
          <el-table-column fixed="left"  label="法定代表人" prop="legalPerson" width="200px"/>
          <el-table-column fixed="left"  label="地址" prop="address" width="200px"/>
          <el-table-column fixed="left"  label="邮编" prop="code" width="150px"/>
          <el-table-column fixed="left"  label="联系人" prop="contactPerson" width="150px"/>
          <el-table-column fixed="left"  label="电话号码" prop="phone" width="200px"/>
          <el-table-column fixed="right" label="操作" width="400">
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
    </el-scrollbar>

    <el-dialog  v-model="addModal.show" title="新增部门">
      <el-form :inline="true">
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
        <el-form-item style="position:relative; left:16%;"  label="邮编" required>
            <el-input style="position:relative; width:86%" v-model="addModal.data.code">
          </el-input>
        </el-form-item>
        </div>
        <div>
          <el-form-item label="联系人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.contactPerson">
          </el-input>
          </el-form-item>
          <el-form-item style="position:relative; left:8%;" label="电话号码" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.phone" />
          </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑单位">
      <el-form :inline="true">
        <div>
        <el-form-item label="单位ID" required>
          <el-input disabled="true" style="position:relative; left:28%; width:108%" type="number" v-model.number="editModal.data.departmentId"  />
        </el-form-item>
        </div>
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
        <el-form-item style="position:relative; left:16%;"  label="邮编" required>
            <el-input style="position:relative; width:86%" v-model="editModal.data.code">
          </el-input>
        </el-form-item>
        </div>
        <div>
          <el-form-item label="联系人" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.contactPerson">
          </el-input>
          </el-form-item>
          <el-form-item style="position:relative; left:8%;" label="电话号码" required>
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
import {useStore} from 'vuex'
import { getApplicant, addApplicant, 
editApplicant, deleteApplicant } from "/src/pages/ApplicantMgmt/ApplicantMgmt.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage} from 'element-plus'

const store= useStore()
let input = ref('')
let tableData = ref([])

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
      this.show = false;
      }
    }
    else {ElMessage({
        type: 'error',
        message : '修改失败'
      })}
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
    }
  }
}


onMounted(async () => {
  mountedToArrPrototype()
  let res = await getApplicant()
  if (res.code === '200') {
    tableData.value = res.data;
  }
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