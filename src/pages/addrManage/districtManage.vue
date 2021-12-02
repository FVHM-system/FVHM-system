<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page2-name">区县管理</p>
      <div class="p-operation">
        <div class="p-row">
          <div class="op-flex">
            <el-button
                type="primary"
                icon="el-icon-plus"
                @click="addModal.open()"
            >
              新增区县
            </el-button>
          </div>
        </div>
      </div>
    </div>
    <div class="p-body">
      <el-table
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          :data="districtList" style="margin-top:10px;width: 100%" size="medium" stripe>
        <el-table-column prop="district" label="区县名" min-width="150"></el-table-column>
        <el-table-column prop="city" sortable label="所属城市" min-width="150"></el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button type="primary" @click="editModal.open(scope.row)">编辑</el-button>
            <el-button type="danger" @click="myFunc.delete(scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="p-foot"></div>
  </div>
  <el-dialog v-model="modalState" :title="modalTitle" center>
    <el-form :model="addForm" label-width="100px" :inline="false">
      <el-form-item label="区县名" required>
        <el-input v-model="addForm.name" style="width: 360px"></el-input>
      </el-form-item>
      <el-form-item label="所属城市" required>
        <el-select v-model="addForm.zoneId" clearable style="width: 330px" placeholder="请选择">
          <el-option v-for="item in cityList" :key="item.zoneId" :label="item.city"
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
import {ElMessageBox, ElMessage} from 'element-plus'
import {
  fetchCityList,
  fetchDistrictList,
  AddDistrictInfoByConfig,
  editDistrictInfoByConfig,
  deleteDistrictInfoById
} from '../../apis/2.0/addr'

let districtList = ref([])
let cityList = ref([])
let modal = ref()
let modalState = ref(false)
let mode = ref('')
let currentItem = ref()
let modalTitle = computed(() => {
  let res
  if (mode.value === 'add') {
    res = '新增区县'
  } else if (mode.value === 'edit') {
    res = '编辑区县'
  }
  return res
})
const addForm = reactive({
  name: '',
  zoneId: '',
})
const myFunc = {
  async search() {
    const temp1 = await fetchDistrictList()
    districtList.value = temp1
    const temp2 = await fetchCityList()
    cityList.value = temp2
  },
  async add() {
    const r = await AddDistrictInfoByConfig({
      cityId: addForm.zoneId,
      districtName: addForm.name,
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
    const r = await editDistrictInfoByConfig({
      districtId: currentItem.value.zoneId,
      districtName: addForm.name,
      cityId: addForm.zoneId,
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
      const r = await deleteDistrictInfoById({id: item.zoneId})
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
    addForm.name = item.district
    addForm.zoneId = item.pid
  },
}

onMounted(() => {
  myFunc.search()
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