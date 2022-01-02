<template>
  <div class="p-page">

    <div class="p-header">
      <p class="page-name">用户管理</p>
      <el-button class="addbutton" type="primary" @click="changeModal.add(true)">新增用户</el-button>
    </div>
    <el-scrollbar class="data-chart">
      <el-table
          :data="currentData"
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
      >
        <el-table-column prop="userName" label="用户名" width="280"></el-table-column>
        <el-table-column label="备注" min-width="280">
          <template #default="scope">
            {{ scope.row.description || '暂无备注' }}
          </template>
        </el-table-column>
        <el-table-column width="700px" label="操作" fixed="right">
          <template #default="scope">
            <!-- <el-button type="primary" @click="changeModal.editPost(true) && changeCurrentUser(scope.row)"
            >修改岗位</el-button
          > -->
            <el-button type="primary"
                       @click="changeModal.editDesc(true) && changeCurrentUser(scope.row)">修改备注
            </el-button>
            <el-button type="primary"
                       @click="changeModal.editPassword(true) && changeCurrentUser(scope.row)">修改密码
            </el-button>
            <el-popconfirm
                :title="'确认删除用户 “' + scope.row.userName + '” 吗？'"
                @confirm="userFunc.deleteUser(scope.row)"
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
    
    </el-scrollbar>

    <el-dialog v-model="modalState.add" title="新增用户" style="font-weight: 500">
      <el-form :model="form.add" :label-col="{ span: 6 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名" required>
          <el-input v-model="form.add.username"/>
        </el-form-item>
        <el-form-item label="密码" required>
          <el-input v-model="form.add.password"/>
        </el-form-item>
        <el-form-item label="备注">
          <el-input v-model="form.add.describe"/>
        </el-form-item>
        <el-button type="primary" @click="userFunc.addUser()">确定</el-button>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modalState.editDesc" title="修改备注">
      <el-form :model="form.editDesc" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="新备注">
          <el-input v-model="form.editDesc.desc"/>
        </el-form-item>
        <el-button type="primary" @click="userFunc.editDesc()">确定</el-button>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modalState.editPassword" title="修改密码">
      <el-form :model="form.editPassword" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input v-model="form.editPassword.password"/>
        </el-form-item>
        <el-button type="primary" @click="userFunc.editPassword()">确定</el-button>
      </el-form>
    </el-dialog>

  </div>

</template>

<script setup>
import {onMounted, reactive, ref, computed} from 'vue'
import {useStore} from 'vuex'
import {ElMessage} from 'element-plus'
import {
  addAccount,
  deleteAccount,
  editAccountPassword,
  editAccountDesc,
  editAccountPost,
  fetchAccountsList,
} from '/src/apis/account.js'

const tableData = ref([])
let currentPage = 1
let pageSize = 10
const currentUser = ref({})
const currentData = computed(() => {
  return tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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

const changeCurrentUser = user => {
  currentUser.value = user
  console.log('change', user)
}
const addForm = reactive({
  username: '',
  password: '',
  describe: '',
  post: '',
})
const editPasswordForm = reactive({
  password: '',
})
const editDescForm = reactive({
  desc: '',
})
const editPostForm = reactive({
  post: '',
})
const form = {
  add: addForm,
  editPassword: editPasswordForm,
  editPost: editPostForm,
  editDesc: editDescForm,
}

const modalState = reactive({
  add: false,
  editPassword: false,
  editDesc: false,
  editPost: false,
})

const changeModal = {
  add: e => (modalState.add = e),
  editPassword: e => (modalState.editPassword = e),
  editPost: e => (modalState.editPost = e),
  editDesc: e => (modalState.editDesc = e),
}

const helper = {
  alertSuccessAndRefresh(str) {
    ElMessage({
      type: 'success',
      message: str,
      center: true,
    })
    userFunc.fetchUser()
  },
}

const userFunc = {
  async fetchUser() {
    const data = (await fetchAccountsList()) || []
    tableData.value = data
  },
  async editPassword() {
    if (!editPasswordForm.password) {
      ElMessage({
        type: 'info',
        message: '密码不能为空',
      })
      return
    }
    const res = await editAccountPassword({
      id: currentUser.value.userId,
      name: currentUser.value.userName,
      desc: currentUser.value.description,
      password: editPasswordForm.password,
    })
    if (res) {
      helper.alertSuccessAndRefresh('修改密码成功！')
      editPasswordForm.password = ''
      changeModal.editPassword(false)
      this.fetchUser()
    }
  },
  async editDesc() {
    const res = await editAccountDesc({
      id: currentUser.value.userId,
      name: currentUser.value.userName,
      desc: editDescForm.desc,
      password: currentUser.value.passWord,
    })
    if (res) {
      helper.alertSuccessAndRefresh('修改备注成功！')
      editDescForm.desc = ''
      changeModal.editDesc(false)
      this.fetchUser()
    }
  },
  // async editPost() {
  //   const res = await editAccountPost({
  //     id: currentUser.value.userId,
  //     post: editPostForm.post,
  //   })
  //   if (res) {
  //     helper.alertSuccessAndRefresh('修改岗位成功！')
  //     editPostForm.post = ''
  //     changeModal.editPost(false)
  //     this.fetchUser()
  //   }
  // },
  async deleteUser({userId: id}) {
    const res = await deleteAccount({ids: id})
    if (res) {
      helper.alertSuccessAndRefresh('删除用户成功！')
      this.fetchUser()
    }
  },
  async addUser() {
    if (!addForm.username || !addForm.password) {
      ElMessage({
        type: 'info',
        message: '用户名和密码不能为空',
      })
      return
    }
    const res = await addAccount({
      ...addForm,
    })
    if (res) {
      helper.alertSuccessAndRefresh('新增用户成功！')
      addForm.username = ''
      addForm.password = ''
      changeModal.add(false)
      this.fetchUser()
    }
  },
}
onMounted(userFunc.fetchUser)
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
  margin-left: 100px;
  top: 8px;
}

.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>