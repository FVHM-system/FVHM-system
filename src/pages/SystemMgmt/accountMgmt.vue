<template>
  <div class="p-page">

    <div class="p-header">
      <p class="page-name">用户管理</p>
      <el-button  type="success" @click="changeModal.add(true)" style="position:absolute;right:60px;top:30px">新增</el-button>
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
        <el-table-column prop="userName" label="用户名" width="200"></el-table-column>
        <el-table-column label="备注" min-width="200">
          <template #default="scope">
            {{ scope.row.description || '暂无备注' }}
          </template>
        </el-table-column>
        <el-table-column prop="phone" label="电话号码" width="200"></el-table-column>
        <el-table-column width="600px" label="操作" fixed="right">
          <template #default="scope">
            <!-- <el-button type="primary" @click="changeModal.editPost(true) && changeCurrentUser(scope.row)"
            >修改岗位</el-button
          > -->
            <el-button type="primary"
                       @click="changeModal.editName(true) && changeCurrentUser(scope.row)">修改用户名
            </el-button>
            <el-button type="primary"
                       @click="changeModal.editDesc(true) && changeCurrentUser(scope.row)">修改备注
            </el-button>
            <el-button type="primary"
                       @click="changeModal.editPhone(true) && changeCurrentUser(scope.row)">修改电话
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

    <el-dialog v-model="modalState.editName" title="修改用户名">
      <el-form :model="form.editDesc" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="新用户名">
          <el-input v-model="form.editName.name"/>
        </el-form-item>
        <el-popconfirm
                :title="'确认修改用户名吗？'"
                @confirm="userFunc.editName()"
            >
              <template #reference>
                <el-button type="primary">确定</el-button>
              </template>
        </el-popconfirm>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modalState.editDesc" title="修改备注">
      <el-form :model="form.editDesc" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="新备注">
          <el-input placeholder="可设为空" v-model="form.editDesc.desc"/>
        </el-form-item>
        <el-popconfirm
                :title="'确认修改用户 “' + currentUser.userName + '” 的备注吗？'"
                @confirm="userFunc.editDesc()"
            >
              <template #reference>
                <el-button type="primary">确定</el-button>
              </template>
        </el-popconfirm>

      </el-form>
    </el-dialog>

    <el-dialog v-model="modalState.editPhone" title="修改电话">
      <el-form :model="form.editDesc" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="新电话号码">
          <el-input placeholder="可设为空" v-model="form.editPhone.phone"/>
        </el-form-item>
        <el-popconfirm
                :title="'确认修改用户 “' + currentUser.userName + '” 的电话号码吗？'"
                @confirm="userFunc.editPhone()"
            >
              <template #reference>
                <el-button type="primary">确定</el-button>
              </template>
        </el-popconfirm>
      </el-form>
    </el-dialog>

    <el-dialog v-model="modalState.editPassword" title="修改密码">
      <el-form :model="form.editPassword" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }">
        <el-form-item label="用户名">
          {{ currentUser.userName }}
        </el-form-item>
        <el-form-item label="原密码" required>
          <el-input show-password v-model="form.editPassword.oldPassword"/>
        </el-form-item>
        <el-form-item label="新密码" required>
          <el-input show-password v-model="form.editPassword.password"/>
        </el-form-item>
        <el-form-item label="确认新密码" required>
          <el-input show-password v-model="form.editPassword.confirmPassword"/>
        </el-form-item>
        <el-popconfirm
                :title="'确认修改用户 “' + currentUser.userName + '” 的密码吗？'"
                @confirm="userFunc.editPassword()"
            >
              <template #reference>
                <el-button type="primary">确定</el-button>
              </template>
        </el-popconfirm>
      </el-form>
    </el-dialog>

  </div>

</template>

<script setup>
import {onMounted, reactive, ref, computed} from 'vue'
import {useStore} from 'vuex'
import {ElMessage, ElLoading} from 'element-plus'
import {
  addAccount,
  deleteAccount,
  editAccountName,
  editAccountPassword,
  editAccountDesc,
  editAccountPhone,
  editAccountPost,
  fetchAccountsList,
} from '/src/apis/account.js'
let tableHeight = window.innerHeight - 300
const tableData = ref([])
let currentPage = 1
let pageSize = 10
const currentUser = ref({})
let currentData = ref([])
let showpagination = ref(true)

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
  username: null,
  password: null,
  describe: null,
  phone: null,
  post: null,
})
const editPasswordForm = reactive({
  oldPassword:null,
  password: null,
  confirmPassword: null,
})

const editNameForm = reactive({
  name: null,
})

const editDescForm = reactive({
  desc: null,
})
const editPhoneForm = reactive({
  phone: null,
})
const editPostForm = reactive({
  post: null,
})
const form = {
  add: addForm,
  editName: editNameForm,
  editPassword: editPasswordForm,
  editPost: editPostForm,
  editDesc: editDescForm,
  editPhone: editPhoneForm,
}

const modalState = reactive({
  add: false,
  editName: false,
  editPassword: false,
  editDesc: false,
  editPost: false,
  editPhone: false,
})

const changeModal = {
  add: e => (modalState.add = e),
  editName: e => (modalState.editName = e),
  editPassword: e => (modalState.editPassword = e),
  editPost: e => (modalState.editPost = e),
  editDesc: e => (modalState.editDesc = e),
  editPhone: e => (modalState.editPhone = e),
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

  async editName() {
    if(!editNameForm.name){
      ElMessage({
        type: 'info',
        message: '用户名不能为空',
      })
      return
    }
    const res = await editAccountName({
      id: currentUser.value.userId,
      name: editNameForm.name
    })
    if (res) {
      helper.alertSuccessAndRefresh('修改用户名成功！')
      editNameForm.name = ''
      changeModal.editName(false)
      await this.fetchUser()
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  },

  async editPassword() {
    if (!editPasswordForm.oldPassword) {
      ElMessage({
        type: 'info',
        message: '原密码不能为空',
      })
      return
    }
    if (!editPasswordForm.password) {
      ElMessage({
        type: 'info',
        message: '密码不能为空',
      })
      return
    }
    if (!(editPasswordForm.password==editPasswordForm.confirmPassword)) {
      ElMessage({
        type: 'info',
        message: '两次输入的新密码不同',
      })
      return
    }
    const res = await editAccountPassword({
      id: currentUser.value.userId,
      oldPassword: editPasswordForm.oldPassword,
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
      await this.fetchUser()
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  },

  async editPhone() {
    const res = await editAccountPhone({
      id: currentUser.value.userId,
      phone: editPhoneForm.phone
    })
    if (res) {
      helper.alertSuccessAndRefresh('修改电话成功！')
      editPhoneForm.phone = ''
      changeModal.editPhone(false)
      await this.fetchUser()
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
      await this.fetchUser()
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
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
    console.log(addForm)
    const res = await addAccount({
      ...addForm,
    })
    if (res) {
      helper.alertSuccessAndRefresh('新增用户成功！')
      addForm.username = ''
      addForm.password = ''
      changeModal.add(false)
      await this.fetchUser()
      currentData.value = tableData.value.slice((currentPage - 1) * pageSize, currentPage * pageSize)
    }
  },
}

onMounted(async () => {
  const loadingInstance = ElLoading.service({target:document.getElementById("box"),fullscreen: false})
  await userFunc.fetchUser()
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
