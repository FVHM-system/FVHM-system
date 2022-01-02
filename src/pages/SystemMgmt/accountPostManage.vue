<template>
  <div class="p-page">
    <div class="p-header">
      <div class="p-name">
        <i @click="goBack" class="el-icon-back back"
           style="position:relative; font-size:30px; top:32px; cursor:pointer;"></i>
        <p class="page-name">分配岗位用户</p>
        <p style="position:relative; margin-left:50px; margin-top:15px;">
          当前岗位：{{ currentItem.roleName }}</p>
      </div>

      <div class="button">
        <el-button icon="el-icon-plus" @click="postFunc.selectAll" style="margin-left: -230px">全选
        </el-button>
        <el-button icon="el-icon-minus" @click="postFunc.selectNone">全不选</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="postFunc.save">保存</el-button>
        <el-button @click="reset">取消配置</el-button>
      </div>

    </div>
    <div class="p-body">
      <el-table
          :data="accountList"
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          stripe
          default-expand-all
          :tree-props="{ children: 'children' }"
      >
        <el-table-column prop="name" label="用户名" min-width="800"></el-table-column>
        <el-table-column fixed="right" label="选择用户" width="400">
          <template #default="scope">
            <el-button
                v-if="scope.row.roleId == id"
                icon="el-icon-check"
                type="success"
                @click="postFunc.unSelectRow(scope.row)"
            >已选择
            </el-button
            >
            <el-button v-if="scope.row.roleId != id" icon="el-icon-plus"
                       @click="postFunc.selectRow(scope.row)"
            >未选择
            </el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>
  </div>
</template>

<script setup>
import {computed, nextTick, onMounted, reactive, ref, watch, watchEffect} from 'vue'
import {ElMessage} from 'element-plus'
import {useStore} from 'vuex'
import {fetchAccountsListById, fetchPostById, saveAccount2PostByList} from '/src/apis/2.0/post'
import {AddTownInfoByConfig, deleteTownInfoById} from '/src/apis/2.0/addr'
import {useRoute, useRouter} from 'vue-router'

const store = useStore()
const route = useRoute()
const router = useRouter()

const tableData = ref([])
const currentItem = ref({})
const perPage = ref(20)
const currentPage = ref(1)
const hasChange = ref(false)

const handleSizeChange = size => (perPage.value = size)
const handleCurrentChange = current => (currentPage.value = current)

const accountList = computed(() => {
  // const page = currentPage.value
  // const offset = perPage.value * (page - 1)
  // return (tableData.value || []).slice(offset, offset + perPage.value)
  return tableData.value
})
const total = computed(() => (tableData.value || []).length)
const id = computed(() => route.query.id)

const reset = async () => {
  await postFunc.search()
  hasChange.value = false
}

const goBack = () => {
  router.back()
}

const postFunc = {
  async search() {
    const id = route.query.id
    const r = await fetchAccountsListById({id})
    tableData.value = r || []
    const it = await fetchPostById({id})
    currentItem.value = it || {}
  },
  selectAllByObj(o) {
    const r = tableData.value
    for (let i = 0; i < r.length; i++) {
      const it = r[i]
      it.roleId = o
      if (it.children) {
        for (let j = 0; j < it.children.length; j++) {
          const c = it.children[j]
          c.roleId = o
        }
      }
    }
    hasChange.value = true
  },
  selectAll() {
    postFunc.selectAllByObj(id.value)
  },
  selectNone() {
    postFunc.selectAllByObj(null)
  },
  selectRow(item) {
    const r = tableData.value
    const i = r.findIndex(it => item.id === it.id)
    if (i >= 0) {
      r[i].roleId = id.value
      hasChange.value = true
    }
  },
  unSelectRow(item) {
    const r = tableData.value
    const i = r.findIndex(it => item.id === it.id)
    if (i >= 0) {
      r[i].roleId = null
      hasChange.value = true
    }
  },
  async save() {
    const genSaveList = list => {
      return list
      .map(item => ({
        id: item.id + '',
        roleId: item.roleId,
      }))
      .filter(item => item.roleId)
    }
    const res = await saveAccount2PostByList({
      id: id.value,
      list: genSaveList(tableData.value),
    })
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '操作成功！',
      })
      reset()
    }
  },
}

onMounted(() => postFunc.search())
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
  top: 4px;
  left: 50px;
  position: relative;
}

.button {
  position: relative;
  left: 85%;
  bottom: 50%;
}

.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>
