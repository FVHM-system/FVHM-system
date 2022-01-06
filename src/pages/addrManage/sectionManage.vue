<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page2-name">路段管理</p>
      <div class="p-operation">
        <div class="p-row">
            <el-button
                type="success"
                @click="addModal.open()"
                :disabled="buttonState"
                style="position:absolute;right:60px;top:30px"
            >
              新增
            </el-button>
        </div>
      </div>
    </div>
    <div class="p-body" id="box">
      <el-table
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          :data="sectionList" :height="tableHeight" empty-text=" " style="margin-top:10px;width: 100%" size="medium" stripe>
        <el-table-column prop="section" sortable label="路段名" min-width="150"></el-table-column>
        <el-table-column prop="road" sortable label="所属道路" min-width="150"></el-table-column>
        <el-table-column prop="village" sortable label="所属村庄" min-width="150"></el-table-column>
        <el-table-column prop="town" sortable label="所属乡镇" min-width="150"></el-table-column>
        <el-table-column prop="district" sortable label="所属区县" min-width="150"></el-table-column>
        <el-table-column prop="city" sortable label="所属城市" min-width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button type="primary" @click="editModal.open(scope.row)" :disabled="buttonState">编辑</el-button>
            <el-button type="danger" @click="myFunc.delete(scope.row)" :disabled="buttonState">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
  <el-dialog v-model="modalState" :title="modalTitle" center>
    <el-form :rules="addRule" ref="check" :model="addForm" label-width="100px" :inline="false">
      <div style="display:flex;flex-dirction:row;align-items:centre;width:100%">
      <el-form-item prop="name1" label="路段名">
        <el-input v-model="addForm.name1"/>
      </el-form-item>
      <p style="margin-top:10px;margin-left:10px;margin-right:10px;">—</p>
      <el-form-item style="margin-left:-100px;" prop="name2" >
        <el-input v-model="addForm.name2"/>
      </el-form-item>
      </div>
      <el-form-item prop="zoneId" label="所属道路">
        <el-select v-model="addForm.zoneId" clearable style="width: 617px" placeholder="请选择">
          <el-option v-for="item in roadList" :key="item.zoneId" :label="item.road"
                     :value="item.zoneId"></el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button type="primary" class="search-btn" @click="modal.submit()">保存</el-button>
      <el-button @click="modal.cancel()">取消</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import {ref, onMounted, computed, reactive} from 'vue'
import {functions} from 'lodash'
import {ElMessageBox, ElMessage,ElLoading} from 'element-plus'
import {
  fetchRoadList,
  fetchSectionList,
  AddSectionInfoByConfig,
  editSectionInfoByConfig,
  deleteSectionInfoById
} from '../../apis/2.0/addr'
import {
  fetchAuthority ,
  fetchUsername
} from '../../utils/mrWang'

let authority=ref('')
let buttonState=ref(false)//禁用按钮
let sectionList=ref([])
let roadList = ref([])
let modal = ref()
let modalState = ref(false)
let mode = ref('')
let currentItem = ref()
let tableHeight = window.innerHeight - 240
let check=ref(null)
let temp6

const addRule=reactive({
  name1:[
    {
      required: true,
      message: '请输入路段名',
      trigger: 'blur',
      type: 'string',
      pattern: /^[\u4e00-\u9fa5]+$/,
    }
  ],
  name2:[
    {
      required: true,
      message: '请输入路段名',
      trigger: 'blur',
      type: 'string',
      pattern: /^[\u4e00-\u9fa5]+$/,
    }
  ],
  zoneId:[
    {
      required: true,
      message: '请选择所属道路',
      trigger: 'blur',
    }
  ],
})
let modalTitle = computed(() => {
  let res
  if (mode.value === 'add') {
    res = '新增路段'
  } else if (mode.value === 'edit') {
    res = '编辑路段'
  }
  return res
})
function handleSizeChange(val) {
  pageSize = val;
}
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
}
const addForm = reactive({
  name: '',
  name1:'',
  name2:'',
  zoneId: '',
})
const myFunc = {
  async search() {
    temp6 = await fetchSectionList()
    sectionList.value = temp6
    const temp1 = await fetchRoadList()
    roadList.value = temp1
  },
  async add() {
    const r = await AddSectionInfoByConfig({
      roadId: addForm.zoneId,
      sectionName: addForm.name1+"-"+addForm.name2,
    })
    if (r.code === '200') {
      ElMessage({
        type: 'success',
        message: '操作成功!',
      })
      this.search()
      return true
    }
    return false
  },
  async edit() {
    const r = await editSectionInfoByConfig({
      sectionId: currentItem.value.zoneId,
      sectionName: addForm.name1+"-"+addForm.name2,
      roadId: addForm.zoneId,
    })
    if (r.code === '200') {
      ElMessage({
        type: 'success',
        message: '操作成功!',
      })
      this.search()
      return true
    }
    return false
  },
  async delete(item) {
    ElMessageBox.confirm('此操作将永久删除, 是否继续?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning',
    })
    .then(async () => {
      const r = await deleteSectionInfoById({id: item.zoneId})
      if (r.code === '200') {
        this.search()
        ElMessage({
          type: 'success',
          message: '删除成功!',
        })
      }
    })
    .catch(() => {
    })
  },
}
const addModal = {
  changeState(e) {
    modalState.value = e
  },
  state: modalState,
  async submit() {
    for(let i=0;i<temp6.length;i++){
      if(temp6[i].pid===addForm.zoneId && temp6[i].section===addForm.name1+'-'+addForm.name2){
        ElMessage({
              type: 'info',
              message: '路段名重复',
          })
          return
      }else if(temp6[i].pid===addForm.zoneId && temp6[i].section===addForm.name2+'-'+addForm.name1){
        ElMessage({
              type: 'info',
              message: '路段名重复',
          })
          return
      }
    }
    check.value.validate(async (valid)=>{
      if(valid){
    if (!addForm.name1 ||!addForm.name2 || !addForm.zoneId) {
      ElMessage({
        type: 'info',
        message: '名称或地址不能为空',
      })
      return
    }
    const r = await myFunc.add()
    if (r) {
      this.changeState(false)
    }
    }
    })
  },
  cancel() {
    this.changeState(false)
  },
  open() {
    if(check.value) {
      check.value.clearValidate()
    }
    this.changeState(true)
    mode.value = 'add'
    addForm.name = ''
    addForm.name1 = ''
    addForm.name2 = ''
    addForm.zoneId = ''
    modal.value = addModal
  },
}
const editModal = {
  changeState(e) {
    modalState.value = e//
  },
  state: modalState,
  async submit() {
    for(let i=0;i<temp6.length;i++){
      if(temp6[i].pid===addForm.zoneId && temp6[i].section===addForm.name1+'-'+addForm.name2){
        ElMessage({
              type: 'info',
              message: '路段名重复',
          })
          return
      }else if(temp6[i].pid===addForm.zoneId && temp6[i].section===addForm.name2+'-'+addForm.name1){
        ElMessage({
              type: 'info',
              message: '路段名重复',
          })
          return
      }
    }
    check.value.validate(async (valid)=>{
      if(valid){
    if (!addForm.name1 ||!addForm.name2   || !addForm.zoneId) {
      ElMessage({
        type: 'info',
        message: '名称或地址不能为空',
      })
      return
    }
    const r = await myFunc.edit()
    if (r) {
      this.changeState(false)
    }
    }
    })
  },
  cancel() {
    this.changeState(false)
  },
  open(item) {
    if(check.value) {
      check.value.clearValidate()
    }
    this.changeState(true)
    mode.value = 'edit'
    modal.value = editModal
    currentItem.value = item
    addForm.name = item.section
    addForm.name1 = item.section.split('-')[0]
    addForm.name2 = item.section.split('-')[1]
    addForm.zoneId = item.pid
  },
}

onMounted(() => {
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  authority.value=fetchAuthority()
  if(authority.value==='ROLE_ADMIN'){
    buttonState.value=false
  }else{
    buttonState.value=true
  }
  myFunc.search()
  loadingInstance.close()
})
</script>

<style lang="scss" scoped>
// .op-flex {
//   display: flex;
//   position: relative;
//   top: 4px;
//   right: -1100px;
//   width: 1000px;

//   .margin-right {
//     position: relative;
//     margin-left: 20px;
//   }

//   .search {
//     position: relative;
//     margin-left: 20px;

//   }
// }

.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}


</style>
