<template>
  <div class="p-page">
    <div class="p-header">
      <div class="p-name">
        <i @click="goBack" class="el-icon-back back"
           style="position:relative; font-size:30px; top:32px; cursor:pointer;"></i>
        <p class="page-name">编辑岗位 API 权限</p>
        <p style="position:relative; margin-left:50px; margin-top:15px;">
          当前岗位：{{ currentItem.roleName }}</p>
      </div>
      <div class="button">
        <el-button icon="el-icon-plus" @click="permissionFunc.selectAll"
                   style="margin-left: -230px">全选
        </el-button>
        <el-button icon="el-icon-minus" @click="permissionFunc.selectNone">全不选</el-button>
        <el-button type="primary" icon="el-icon-upload" @click="permissionFunc.save">保存</el-button>
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
        <el-table-column prop="name" label="权限名称" min-width="800"></el-table-column>
        <el-table-column fixed="right" label="选择权限" width="400">
          <template #default="scope">
            <el-button
                v-if="scope.row.roleId == id"
                icon="el-icon-check"
                type="success"
                @click="permissionFunc.unSelectRow(scope.row)"
            >已选择
            </el-button
            >
            <el-button v-if="scope.row.roleId != id" icon="el-icon-plus"
                       @click="permissionFunc.selectRow(scope.row)"
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
import {fetchPostById} from '/src/apis/2.0/post'
import {
  fetchApiListById,
  fetchApiListByNone,
  fetchMenuListById,
  saveApiByList,
  saveMenuByList,
} from '/src/apis/2.0/menu'
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
  await permissionFunc.search()
  hasChange.value = false
}

const goBack = () => {
  router.back()
}

const permissionFunc = {
  async search() {
    const r = await fetchApiListById({id: id.value})
    const genChildList = list => {
      const res = []
      list.forEach(item => {
        if (!item.pid) {
          res.push(item)
        }
      })
      list.forEach(item => {
        if (item.pid) {
          const it = res.find(it => it.id === item.pid)
          if (it) {
            it.children = (it.children || []).concat(item)
          }
        }
      })
      console.log('res', res)
      return res
    }
    tableData.value = genChildList(r || [])
    const it = await fetchPostById({id: id.value})
    currentItem.value = it || {}
  },
  selectRow(item) {
    const r = tableData.value
    let current
    for (let i = 0; i < r.length; i++) {
      const it = r[i]
      if (it.id === item.id) {
        current = it
        break
      }
      if (it.children) {
        for (let j = 0; j < it.children.length; j++) {
          const c = it.children[j]
          if (c.id === item.id) {
            current = c
            break
          }
        }
      }
      if (current) {
        break
      }
    }
    if (current) {
      current.roleId = id.value
      hasChange.value = true
    }
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
    permissionFunc.selectAllByObj(id.value)
  },
  selectNone() {
    permissionFunc.selectAllByObj(null)
  },
  unSelectRow(item) {
    const r = tableData.value
    let current
    for (let i = 0; i < r.length; i++) {
      const it = r[i]
      if (it.id === item.id) {
        current = it
        break
      }
      if (it.children) {
        for (let j = 0; j < it.children.length; j++) {
          const c = it.children[j]
          if (c.id === item.id) {
            current = c
            break
          }
        }
      }
      if (current) {
        break
      }
    }
    if (current) {
      current.roleId = null
      hasChange.value = true
    }
  },
  async save() {
    const genSaveList = list => {
      const res = []
      list.forEach(item => {
        res.push({
          id: item.id + '',
          roleId: item.roleId,
        })
        item.children &&
        item.children.forEach(it => {
          res.push({
            id: it.id + '',
            roleId: it.roleId,
          })
        })
      })
      return res.filter(item => item.roleId)
    }
    const res = await saveApiByList({
      id: id.value,
      list: genSaveList(tableData.value),
    })
    if (res.code === '200') {
      ElMessage({
        type: 'success',
        message: '操作成功！',
      })
      await reset()
    }
  },
}

onMounted(() => permissionFunc.search())
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
  margin-left: 100px;
  top: -50px;
}

.data-chart {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}
</style>
