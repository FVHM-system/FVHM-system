<template>
  <div class="p-page">

    <div class="p-header">
      <p class="page-name">岗位管理</p>
      <el-button  type="success" style="position:absolute;right:60px;top:30px" @click="() => addModal.changeState(true)">新增
      </el-button>
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
          :height="tableHeight"
      >
        <el-table-column prop="roleName" label="岗位名称" min-width="180"></el-table-column>
        <el-table-column prop="description" min-width="400" label="岗位描述"></el-table-column>
        <el-table-column label="操作" min-width="650" fixed="right">
          <template #default="scope">
            <el-button @click="postFunc.goAccount2Post(scope.row)" type="warning">分配用户</el-button>
            <el-button @click="postFunc.goPost(scope.row)" type="primary">菜单权限</el-button>
            <el-button @click="postFunc.goAccept(scope.row)" type="primary">API 权限</el-button>
            <el-button @click="editModal.changeState(true) || changeCurrent(scope.row)">修改信息
            </el-button>
            <el-popconfirm
                :title="'确认删除岗位 “' + scope.row.roleName + '” 吗？'"
                @confirm="postFunc.deletePost(scope.row)"
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

    <el-dialog v-model="modalState" title="新增岗位">
      <el-form :model="form" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="岗位名称" required>
          <el-input v-model="form.name"/>
        </el-form-item>
        <el-form-item label="岗位描述" required>
          <el-input v-model="form.desc"/>
        </el-form-item>
        <el-button type="primary" @click="postFunc.addPost()">确定</el-button>
      </el-form>
    </el-dialog>

    <el-dialog v-model="editState" title="修改岗位信息">
      <el-form :model="editForm" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="岗位名称" required>
          <el-input v-model="editForm.roleName"/>
        </el-form-item>
        <el-form-item label="岗位描述" required>
          <el-input v-model="editForm.description"/>
        </el-form-item>
        <el-button type="primary" @click="postFunc.editPost()">确定</el-button>
      </el-form>
    </el-dialog>

  </div>
</template>

<script setup>
import {onMounted, reactive, ref, computed} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import {ElMessage,ElLoading} from 'element-plus'
import {addPost, deletePost, editPostByConfig, fetchPostList} from '/src/apis/post.js'

const router = useRouter()
let tableHeight = window.innerHeight - 300
let currentData = ref([])
let showpagination = ref(true)
let currentPage = 1
let pageSize = 10
function handleSizeChange(val) {
  pageSize = val;
}
// 当前页
function handleCurrentChange(val) {
  currentPage = val;
  currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  console.log(currentPage)
}


const form = reactive({
  name: '',
  desc: '',
})
const editForm = reactive({
  roleName: '',
  description: '',
})
const tableData = ref([])
const modalState = ref(false)
const editState = ref(false)
const current = ref({})


const changeCurrent = c => {
  current.value = c
  editForm.roleName = c.roleName
  editForm.description = c.description
}
const addModal = {
  modalState,
  changeState(b) {
    this.modalState.value = b
    console.log('add')
  },
}
const editModal = {
  editState,
  changeState(b) {
    this.editState.value = b
    console.log('add')
  },
}
const helper = {
  alertSuccessAndRefresh(str) {
    ElMessage({
      type: 'success',
      message: str,
      center: true,
    })
    postFunc.fetchPost()
  },
}
const postFunc = {
  async addPost() {
    if (!form.name || !form.desc) {
      ElMessage({
        type: 'info',
        message: '岗位名和描述不能为空',
      })
      return
    }
    const res = await addPost({name: form.name, desc: form.desc})
    if (res) {
      helper.alertSuccessAndRefresh('新增岗位成功!')
      addModal.changeState(false)
      form.name = ''
      form.desc = ''
    }
  },
  async editPost() {
    if (!editForm.roleName || !editForm.description) {
      ElMessage({
        type: 'info',
        message: '岗位名和描述不能为空',
      })
      return
    }
    const res = await editPostByConfig({
      roleId: current.value.roleId,
      roleName: editForm.roleName,
      description: editForm.description,
    })
    if (res) {
      helper.alertSuccessAndRefresh('新增岗位成功!')
      editModal.changeState(false)
      editForm.roleName = ''
      editForm.description = ''
    }
  },
  async goPost({roleId: id}) {
    router.push({
      path: '/system_management/permissionManage',
      query: {
        id,
      },
    })
  },
  async goAccept({roleId: id}) {
    router.push({
      path: '/system_management/acceptMange',
      query: {
        id,
      },
    })
  },
  async goAccount2Post({roleId}) {
    router.push({
      path: '/system_management/accountPostManage',
      query: {
        id: roleId,
      },
    })
  },
  async deletePost({roleId: id}) {
    const res = await deletePost({id})
    if (res) {
      helper.alertSuccessAndRefresh('删除岗位成功')
    }
  },
  async fetchPost() {
    const data = (await fetchPostList()) || []
    // console.log("data", data)
    tableData.value = data
    currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
  },
}

onMounted(()=>{
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  postFunc.fetchPost()
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

.addbutton {
  position: relative;
  left: 85%;
  top: 8px;
}

.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>
