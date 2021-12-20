<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">部门管理</p>
      <el-button class="addbutton" type="primary" @click="addModal.open()">新增部门</el-button>
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
          <el-table-column fixed="left" label="ID" prop="departmentId" width="200px"/>
          <el-table-column fixed="left"  label="部门名称" prop="departmentName" width="300px"/>
          <el-table-column fixed="left" label="部门单位类型" prop="departmentType" width="200px">
            <template #default="scope">
              {{['市区','区县','乡镇','村庄'][scope.row.departmentType-1]}}
            </template>
          </el-table-column>
          <el-table-column fixed="left"  label="部门地址" prop="address" width="500px"/>
          <el-table-column fixed="right" label="操作" width="400">
            <template #default="scope">
              <el-button @click="editModal.open(scope.row)">修改</el-button>
              <el-popconfirm
              :title="'确认删除部门 ' + scope.row.departmentName + ' 吗？'"
              @confirm="deleteDept(scope.row.departmentId)"
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
        <el-form-item label="部门名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="addModal.data.departmentName">
          </el-input>
        </el-form-item>
        <el-form-item style="position:relative; left:5%;" label="部门类型" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="addModal.data.departmentType">
            <el-option v-for="item in departmentType" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="机构地址" required>
            <el-input style="position:relative; left:6%; width:268%" v-model="addModal.data.address" placeholder="请选择">
          </el-input>
        </el-form-item>
        </div>
      </el-form>
      <el-button type="primary"  @click="addModal.submit()" >确定</el-button>
    </el-dialog>

    <el-dialog  v-model="editModal.show" title="编辑部门">
      <el-form :inline="true">
        <div>
        <el-form-item label="ID" required>
          <el-input disabled="true" style="position:relative; left:28%; width:108%" type="number" v-model.number="editModal.data.departmentId"  />
        </el-form-item>
        </div>
        <div>
        <el-form-item label="部门名称" required>
          <el-input style="position:relative; left:6%; width:108%" v-model="editModal.data.departmentName" placeholder="请选择">
          </el-input>
        </el-form-item>
        <el-form-item style="position:relative; left:5%;" label="部门类型" required>
          <el-select style="position:relative; left:6%; width:101%" v-model="editModal.data.departmentType" placeholder="请选择">
            <el-option v-for="item in departmentType" :key="item.value" :value="item.value" :label="item.label">
            </el-option>
          </el-select>
        </el-form-item>
        </div>
        <div>
        <el-form-item label="机构地址" required>
            <el-input style="position:relative; left:6%; width:268%" v-model="editModal.data.address" placeholder="请选择">
          </el-input>
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
import { getDepartment, addDepartment, 
editDepartment, deleteDepartment } from "/src/pages/DepartmentMgmt/DepartmentMgmt.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage} from 'element-plus'

const store= useStore()
let date=ref()
let valvePlugInformation=ref()
let input = ref('')
let tableData = ref([])

let departmentType = ref([])
departmentType.value=[
  {
    value:1,
    label:'市区'
  },
  {
    value:2,
    label:'区县'
  },
  {
    value:3,
    label:'乡镇'
  },
  {
    value:4,
    label:'村庄'
  }
]


const addModal = reactive({
  show : false,
  data : {
    departmentId: '',
    departmentName: '',
    departmentType:'',
    address:'',
  },
  open(){
    this.show = true;
  },
  async submit(){
    if( !this.data.departmentName || !this.data.departmentType ){
      ElMessage({
        type: 'error',
        message : '不能为空'
      })
      return
    }
    let res = await addDepartment(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '添加成功'
      })
      this.data.departmentId=''
      this.data.departmentName=''
      this.data.departmentType=''
      this.data.address=''
      res = await getDepartment()
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
    departmentId: '',
    departmentName: '',
    departmentType:'',
    address:'',
  },
  open(row){
    this.data.departmentId=row.departmentId
    this.data.departmentName=row.departmentName
    this.data.departmentType=row.departmentType
    this.data.address=row.address
    this.show = true;
  },
  async submit(){
    console.log(this.data)
    let res = await editDepartment(this.data)
    console.log(res)
    if (res.code == '200'){
      ElMessage({
        type: 'success',
        message : '修改成功'
      })
      res = await getDepartment()
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

async function deleteDept(id){
  let res = await deleteDepartment({id})
  if(res.code=='200') {
      ElMessage({
        message:'删除成功',
        type:'success'
      })
    res = await getDepartment()
    if (res.code === '200') {
      tableData.value = res.data;
    }
  }
}


onMounted(async () => {
  mountedToArrPrototype()
  let res = await getDepartment()
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