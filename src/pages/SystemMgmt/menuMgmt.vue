<template>
  <div class="p-page">

    <div class="p-header">
      <p class="page-name">菜单管理</p>
      <el-button  type="success" style="position:absolute;right:60px;top:30px" @click="modal.open()">新增</el-button>
    </div>
    <div class="data-chart2" id="box">
      <el-table
          id="box"
          :data="currentData"
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          row-key="frontendMenuId"
          default-expand-all
          :tree-props="{ children: 'children' }"
          :height="tableHeight"
      >
        <el-table-column prop="frontendMenuName" label="菜单名称" min-width="240"></el-table-column>
        <el-table-column prop="description" label="菜单描述" min-width="240"></el-table-column>
        <el-table-column prop="frontendMenuUrl" label="相关链接" min-width="220"></el-table-column>
        <el-table-column prop="frontendMenuSort" label="排序编号" min-width="120"></el-table-column>
        <el-table-column label="操作" width="350" fixed="right">
          <template #default="scope">
            <el-button v-if="!scope.row.pid" type="primary" icon="el-icon-plus"
                       @click="addModal.open(scope.row)"
            >新增子菜单
            </el-button
            >
            <el-button @click="editModal.open(scope.row)">编辑</el-button>
            <el-popconfirm
                :title="'确认删除菜单 “' + scope.row.frontendMenuName + '” 吗？此操作无法恢复，建议由开发人员执行。'"
                @confirm="menuFunc.delete(scope.row)"
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
            :current-page="currentPage"
            :page-sizes="[10, 20, 30, 50, 100]"
            :page-size="pageSize"
            style="margin-top: 10px;"
            :total="tableData.length">
        </el-pagination>
      </div>
    </div>

    <el-dialog v-model="modalState" :title="modalTitle" style="font-weight: 500">
      <el-form :model="form" label-width="100px" :inline="false">
        <el-form-item label="菜单名称" required>
          <el-input v-model="form.name" style="width: 330px"></el-input>
        </el-form-item>
        <el-form-item label="菜单描述" required>
          <el-input v-model="form.desc" style="width: 330px"></el-input>
        </el-form-item>
        <el-form-item label="相关链接" required>
          <el-input v-model="form.link"></el-input>
        </el-form-item>
        <el-form-item label="排序编号" required>
          <el-input v-model="form.sort" type="number" style="width: 330px"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button type="primary" @click="modal.submit()">保存</el-button>
        <el-button @click="modal.cancel()">取消</el-button>
      </template>
    </el-dialog>
  </div>

</template>

<script setup>
import {ref, onMounted, reactive, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage,ElLoading} from 'element-plus'
import {fetchPostById} from '/src/apis/2.0/post.js'
import {
  addMenuByConfig,
  deleteMenuById,
  editMenuByConfig,
  fetchMenuListByNone
} from '/src/apis/2.0/menu.js'
import {routerConfigs} from '/src/router'
let tableHeight = window.innerHeight - 310
const router = useRouter()
const route = useRoute()
const form = reactive({
  name: '',
  desc: '',
  link: '',
  sort: 0,
})
const editForm = reactive({
  roleName: '',
  description: '',
})
const mode = ref('')
const currentItem = ref({})
const tableData = ref([])
let originData
const modalState = ref(false)
const current = ref({})
let currentPage = 1
let pageSize = 10
let showpagination = ref(true)
let currentData = ref([])

function handleSizeChange(val) {
  pageSize = val;
}
// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  console.log(currentPage)
}

const id = computed(() => route.query.id)

const goBack = () => router.back()

const modalTitle = computed(() => {
  let res = ''
  if (mode.value === 'normal') {
    res = '新增菜单'
  } else if (mode.value === 'add') {
    res = '新增子菜单'
  } else if (mode.value === 'edit') {
    res = '编辑菜单'
  }
  return res
})

const changeCurrent = c => {
  current.value = c
  editForm.roleName = c.roleName
  editForm.description = c.description
}
const validateUrl = url => {
  const res = routerConfigs.findIndex(item => item.path === url)
  if (res < 0) {
    ElMessage({
      type: 'error',
      message: '相关链接不正确',
    })
    return false
  }
  return true
}
const validateSort = sort => {
  const res = originData
  .filter(item => (mode.value === 'edit' ? item.frontendMenuId !== currentItem.value.frontendMenuId
      : true))
  .findIndex(item => item.frontendMenuSort == sort)
  if (res >= 0) {
    ElMessage({
      type: 'error',
      message: '排序编号有重复',
    })
    return false
  }
  return true
}
const validate = () => {
  if (!form.desc || !form.sort || !form.name || !form.link) {
    ElMessage({
      type: 'info',
      message: '必须项不能为空',
    })
    return
  }
  let url = form.link
  let sort = form.sort
  if (mode.value === 'add') {
    url = (currentItem.value.frontendMenuUrl || '') + url
  }
  return (mode.value === 'add' ? validateUrl(url) : true) && validateSort(sort)
}
const modal = {
  modalState,
  changeState(b) {
    this.modalState.value = b
    console.log('add')
  },
  open() {
    mode.value = 'normal'
    form.name = ''
    form.link = ''
    form.sort = ''
    form.desc = ''
    this.changeState(true)
  },
  async submit() {
    let res
    if (!validate()) {
      return
    }
    if (mode.value === 'normal') {
      res = await addMenuByConfig({
        description: form.desc,
        frontendMenuName: form.name,
        frontendMenuSort: form.sort,
        frontendMenuUrl: form.link,
      })
    } else if (mode.value === 'edit') {
      res = await editMenuByConfig({
        description: form.desc,
        frontendMenuId: currentItem.value.frontendMenuId,
        pid: currentItem.value.pid,
        frontendMenuSort: form.sort,
        frontendMenuUrl: form.link,
        frontendMenuName: form.name,
      })
    } else if (mode.value === 'add') {
      res = await addMenuByConfig({
        description: form.desc,
        frontendMenuName: form.name,
        frontendMenuSort: form.sort,
        frontendMenuUrl: form.link,
        pid: currentItem.value.frontendMenuId,
      })
    }
    if (res && res.code === '200') {
      helper.alertSuccessAndRefresh('操作成功')
      this.changeState(false)
    }
  },
  cancel() {
    this.changeState(false)
  },
}
const editModal = {
  open(item) {
    currentItem.value = item
    mode.value = 'edit'
    form.name = item.frontendMenuName
    form.link = item.frontendMenuUrl
    form.sort = item.frontendMenuSort
    form.desc = item.description
    modal.changeState(true)
  },
}
const addModal = {
  open(item) {
    currentItem.value = item
    mode.value = 'add'
    form.name = ''
    form.link = ''
    form.sort = ''
    form.desc = ''
    modal.changeState(true)
  },
}

const helper = {
  alertSuccessAndRefresh(str) {
    ElMessage({
      type: 'success',
      message: str,
      center: true,
    })
    menuFunc.search()
  },
}
const menuFunc = {
  async search() {
    // const it = await fetchPostById({ id: id.value })
    // currentItem.value = it || {}
    const r = await fetchMenuListByNone()
    const genChildList = list => {
      const res = []
      list.forEach(item => {
        if (!item.pid) {
          res.push(item)
        }
      })
      list.forEach(item => {
        if (item.pid) {
          const it = res.find(it => it.frontendMenuId === item.pid)
          if (it) {
            it.children = (it.children || []).concat(item)
          }
        }
      })
      return res
    }
    tableData.value = genChildList(r)
    originData = r
    currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  },
  async delete({frontendMenuId: id}) {
    const res = await deleteMenuById({id})
    if (res.code === '200') {
      menuFunc.search()
      helper.alertSuccessAndRefresh('删除成功')
    }
  },
}

onMounted(async () => {
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  await menuFunc.search()
  currentData.value = tableData.value.slice(0, pageSize)
  loadingInstance.close()
  })

</script>

<style lang="scss" scoped>
.p-page {
  width: 100%;
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



.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>
