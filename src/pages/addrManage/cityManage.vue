<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page2-name">城市管理</p>
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
          :data="cityList" style="margin-top:10px;width: 100%" size="medium" :height="tableHeight"
          empty-text=" " stripe :sort-method="sortDevName">
        <el-table-column prop="city" label="城市名" min-width="150" sortable="true"></el-table-column>
        <el-table-column fixed="right" label="操作" width="230">
          <template #default="scope">
            <el-button type="primary" @click="editModal.open(scope.row)" :disabled="buttonState">
              编辑
            </el-button>
            <el-button type="danger" @click="myFunc.delete(scope.row)" :disabled="buttonState">删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="p-foot"></div>
  </div>
  <el-dialog v-model="modalState" :title="modalTitle" center>
    <el-form :model="addForm" ref="addDta" :rules="addRules" label-width="100px" :inline="false">
      <el-form-item label="城市名" prop="name">
        <el-input v-model="addForm.name"></el-input>
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
import {ElMessageBox, ElMessage, ElLoading} from 'element-plus'
import {
  fetchCityList,
  AddCityInfoByConfig,
  editCityInfoByConfig,
  deleteCityInfoById
} from '../../apis/2.0/addr'
import {
  fetchAuthority,
  fetchUsername
} from '../../utils/mrWang'

let authority = ref('')
let buttonState = ref(false)//禁用按钮
let cityList = ref([])
let modal = ref()
let modalState = ref(false)
let mode = ref('')
let currentItem = ref()
let tableHeight = window.innerHeight - 240
let modalTitle = computed(() => {
  let res
  if (mode.value === 'add') {
    res = '新增城市'
  } else if (mode.value === 'edit') {
    res = '编辑城市'
  }
  return res
})
let sortDevName=(str1, str2)=>{
  let res = 0
       for (let i = 0; ;i++) {
  if (!str1[i] || !str2[i]) {
   res = str1.length - str2.length
   break
  }
  const char1 = str1[i]
  const char1Type = this.getChartType(char1)
  const char2 = str2[i]
  const char2Type = this.getChartType(char2)
  // 类型相同的逐个比较字符
  if (char1Type[0] === char2Type[0]) {
   if (char1 === char2) {
   continue
   } else {
   if (char1Type[0] === 'zh') {
    res = char1.localeCompare(char2)
   } else if (char1Type[0] === 'en') {
    res = char1.charCodeAt(0) - char2.charCodeAt(0)
   } else {
    res = char1 - char2
   }
   break
   }
  } else {
  // 类型不同的，直接用返回的数字相减
   res = char1Type[1] - char2Type[1]
   break
  }
   }
   return res
}
let getChartType=(char)=>{
  // 数字可按照排序的要求进行自定义，我这边产品的要求是
  // 数字（0->9）->大写字母（A->Z）->小写字母（a->z）->中文拼音（a->z）
   if (/^[\u4e00-\u9fa5]$/.test(char)) {
  return ['zh', 300]
   }
   if (/^[a-zA-Z]$/.test(char)) {
  return ['en', 200]
   }
   if (/^[0-9]$/.test(char)) {
  return ['number', 100]
   }
   return ['others', 999]
}
const valveNameCheck = (rule, value, callback) => {
  const nameCheck = /^[\u4e00-\u9fa5]+$/
  if (!value) {
    return callback(new Error('内容不能为空'))
  } else if (!nameCheck.test(value)) {
    return callback(new Error('内容格式错误(仅允许输入中文名称)'))
  }else if(cityNameList.find(i=>i.value===value)){
    return callback(new Error('区县名称重复！'))
  }
  else{
    callback()
  }
}
let addDta = ref()
let addRules = reactive({
  name: [
    {
      required: true,
      validator: valveNameCheck,
      trigger: 'blur',
    }
  ]
})
const addForm = reactive({
  name: '',
})
let cityNameList = {}
const myFunc = {
  async search() {
    const temp = await fetchCityList()
    cityList.value = temp
    cityNameList = temp.map(item=>{
      return{
        value:item.city
      }
    })
  },
  async add() {
    const r = await AddCityInfoByConfig({
      cityName: addForm.name,
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
    const r = await editCityInfoByConfig({
      cityId: currentItem.value.zoneId,
      cityName: addForm.name,
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
      const r = await deleteCityInfoById({id: item.zoneId})
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
  submit() {
    addDta.value.validate((valid) => {
      if (valid) {
        const r = myFunc.add()
        if (r) {
          this.changeState(false)
        }
      }
    })
  },
  cancel() {
    this.changeState(false)
  }
  ,
  open() {
    if(addDta.value) {
      addDta.value.clearValidate()
    }
    this.changeState(true)
    mode.value = 'add'
    addForm.name = ''
    addForm.addr = ''
    modal.value = addModal
  }
  ,
}
const editModal = {
  changeState(e) {
    modalState.value = e
  },
  state: modalState,
  async submit() {
    if (!addForm.name) {
      ElMessage({
        type: 'info',
        message: '名称不能为空',
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
    if(addDta.value) {
      addDta.value.clearValidate()
    }
    this.changeState(true)
    mode.value = 'edit'
    modal.value = editModal
    currentItem.value = item
    addForm.name = item.city
  },
}

onMounted(() => {
      const loadingInstance = ElLoading.service(
          {target: document.getElementById("box"), fullscreen: false})
      authority.value = fetchAuthority()
      if (authority.value === 'ROLE_ADMIN') {
        buttonState.value = false
      } else {
        buttonState.value = true
      }
      myFunc.search()
      loadingInstance.close()
    }
)
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
