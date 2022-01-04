<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page2-name">村庄管理</p>
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
      <el-table :data="villageList"
                style="margin-top:10px;width: 100%"
                :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
                :cell-style="{'text-align':'center'}"
                :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
                size="medium" :height="tableHeight" empty-text=" " stripe>
        <el-table-column prop="village" sortable label="村庄名" min-width="150"></el-table-column>
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
    <div class="p-foot"></div>
  </div>
  <el-dialog v-model="modalState" :title="modalTitle" center>
    <el-form :model="addForm" label-width="100px" :inline="false">
      <el-form-item label="村庄名" required>
        <el-input v-model="addForm.name"></el-input>
      </el-form-item>
      <el-form-item label="所属乡镇" required>
        <el-select v-model="addForm.zoneId" clearable style="width: 617px" placeholder="请选择">
          <el-option v-for="item in townList" :key="item.zoneId" :label="item.town"
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
  fetchCityList,
  fetchDistrictList,
  fetchTownList,
  fetchVillageList,
  AddVillageInfoByConfig,
  editVillageInfoByConfig,
  deleteVillageInfoById
} from '../../apis/2.0/addr'
import {
  fetchAuthority ,
  fetchUsername
} from '../../utils/mrWang'

let authority=ref('')
let buttonState=ref(false)//禁用按钮
let villageList = ref([])
let townList = ref([])
let districtList = ref([])
let cityList = ref([])
let modal = ref()
let modalState = ref(false)
let mode = ref('')
let currentItem = ref()
let tableHeight = window.innerHeight - 240
let modalTitle = computed(() => {
  let res
  if (mode.value === 'add') {
    res = '新增村庄'
  } else if (mode.value === 'edit') {
    res = '编辑村庄'
  }
  return res
})
const addForm = reactive({
  name: '',
  zoneId: '',
})
const myFunc = {
  async search() {
    const temp1 = await fetchVillageList()
    villageList.value = temp1
    const temp2 = await fetchCityList()
    cityList.value = temp2
    const temp3 = await fetchDistrictList()
    districtList.value = temp3
    const temp4 = await fetchTownList()
    townList.value = temp4
  },
  async add() {
    const r = await AddVillageInfoByConfig({
      townId: addForm.zoneId,
      villageName: addForm.name,
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
    const r = await editVillageInfoByConfig({
      villageId: currentItem.value.zoneId,
      villageName: addForm.name,
      townId: addForm.zoneId,
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
      const r = await deleteVillageInfoById({id: item.zoneId})
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
    if (!addForm.name || !addForm.zoneId) {
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
  },
  cancel() {
    this.changeState(false)
  },
  open() {
    this.changeState(true)
    mode.value = 'add'
    addForm.name = ''
    addForm.zoneId = ''
    modal.value = addModal
  },
}
const editModal = {
  changeState(e) {
    modalState.value = e
  },
  state: modalState,
  async submit() {
    if (!addForm.name || !addForm.zoneId) {
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
  },
  cancel() {
    this.changeState(false)
  },
  open(item) {
    this.changeState(true)
    mode.value = 'edit'
    modal.value = editModal
    currentItem.value = item
    addForm.name = item.village
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
.op-flex {
  display: flex;
  position: relative;
  top: 4px;
  right: -1100px;
  width: 1000px;

  .margin-right {
    position: relative;
    margin-left: 20px;
  }

  .search {
    position: relative;
    margin-left: 20px;

  }
}

.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}


</style>
