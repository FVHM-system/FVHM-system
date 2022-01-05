<template>
  <div class="p-page2">
    <div class="p2-header">
      <p class="page2-name">设备型号管理</p>
      <el-button type="success" style="position:absolute;right:60px;top:30px"
                 @click="addShow=true">新增
      </el-button>
    </div>
    <div class="p-body" id="box">
      <el-table
          :data=tableData
          :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
          :cell-style="{'text-align':'center'}"
          :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
          style="width: 100%"
          :height="tableHeight"
      >
        <el-table-column fixed="left" label="类型编号" prop="meterNo" min-width="150px"/>
        <el-table-column fixed="left" label="类型名称" prop="meterNoName" min-width="150px"/>
        <el-table-column fixed="left" label="用途" prop="meterType" min-width="150px">
          <template #default="scope">
            {{ ['流量计', '压力计'][scope.row.meterType - 1] }}
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="水表口径" prop="meterCaliber" min-width="120px"/>
        <el-table-column fixed="left" label="带阀控" prop="meterVc" min-width="120px">
          <template #default="scope">
            {{ ['是', '否'][scope.row.meterVc - 1] }}
          </template>
        </el-table-column>
        <el-table-column fixed="left" label="创建时间" prop="createTime" min-width="250px"/>
        <el-table-column label="操作" min-width="200">
          <template #default="scope">
            <el-button @click="editModal.open(scope.row)">修改</el-button>
            <el-popconfirm
                :title="'是否确认删除该设备？'"
                @confirm="deleteMetType(scope.row.id)"
            >
              <template #reference>
                <el-button type="danger">删除</el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-dialog v-model="addShow" title="新增类型">
      <el-form :model="addFormData" :rules="addRules" ref="addForm" :inline="true">
        <div style="display: flex;flex-direction: row">
          <div>
            <el-form-item prop="meterNo" label="型号编号">
              <el-input style="width: 220px" v-model="addFormData.meterNo">
              </el-input>
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-form-item label="类型名称" prop="meterNoName">
              <el-input style="width: 220px" v-model="addFormData.meterNoName">
              </el-input>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;flex-direction: row;white-space: pre">
          <div>
            <el-form-item prop="meterType" label="用       途" >
              <el-select v-model="addFormData.meterType" style="width: 220px" placeholder="请选择">
                <el-option
                    v-for="item in meterType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="margin-left: 20px">
            <el-form-item prop="meterCaliber" label="水表口径" >
              <el-input style="width: 220px" v-model="addFormData.meterCaliber"/>
            </el-form-item>
          </div>
        </div>
        <div style="display: flex;white-space:pre;flex-direction: row">
          <div>
            <el-form-item prop="meterVc" label="阀       控" >
              <el-select style="width: 220px" v-model="addFormData.meterVc">
                <el-option v-for="item in meterVc" :key="item.value" :value="item.value"
                           :label="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </div>
          <div style="display: flex;flex-direction: row;margin-left: 20px;">
            <el-form-item prop="createTime" style="width: 220px" label="创建时间" >
              <el-date-picker
                  v-model="addFormData.createTime"
                  type="datetime"
                  placeholder="选择日期时间"
                  value-format="YYYY-MM-DD HH:mm:ss">
              </el-date-picker>
            </el-form-item>
          </div>
        </div>
      </el-form>
      <el-footer style="text-align: end;">
        <el-button type="primary" @click="addSubmit">确定</el-button>
      </el-footer>
    </el-dialog>

    <el-dialog width="25%" v-model="editModal.show" title="编辑类型">
      <el-form :inline="true">
        <div>
          <el-form-item label="型号编号" required>
            <el-input style="position:relative; left:6%; width:108%"
                      v-model="editModal.data.meterNo">
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="类型名称" required>
            <el-input style="position:relative; left:6%; width:108%"
                      v-model="editModal.data.meterNoName">
            </el-input>
          </el-form-item>
        </div>
        <div>
          <el-form-item style="white-space: pre" label="用       途" required>
            <el-select style="position:relative; left:6%; width:101%"
                       v-model="editModal.data.meterType" placeholder="请选择">
              <el-option
                  v-for="item in meterType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="水表口径" required>
            <el-input type="number" style="position:relative; left:6%; width:110%"
                      v-model.number="editModal.data.meterCaliber"/>
          </el-form-item>
        </div>
        <div>
          <el-form-item style="white-space: pre" label="阀       控" required>
            <el-select style="position:relative; left:6%; width:101%"
                       v-model="editModal.data.meterVc">
              <el-option v-for="item in meterVc" :key="item.value" :value="item.value"
                         :label="item.label">
              </el-option>
            </el-select>
          </el-form-item>
        </div>
        <div>
          <el-form-item label="创建时间" required>
            <el-date-picker
                v-model="editModal.data.createTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择日期时间"
                style="position:relative; left:6%; "
                @change="transformAddDate()">
            </el-date-picker>
          </el-form-item>
        </div>
      </el-form>
      <div style="text-align: end">
        <el-button type="primary" @click="editModal.submit()">确定</el-button>
      </div>
    </el-dialog>

  </div>
</template>
<script setup>
import {defineComponent, onMounted, ref, toRefs, reactive, computed} from 'vue'
import {ElLoading} from 'element-plus'
import {useStore} from 'vuex'
import {
  getMeterType, addMeterType,
  editMeterType, deleteMeterType
} from "./util/MeterTypeMgmt.js"
import {fetchVpinformation} from "../valveInformation/util/vpinformation.js"
import {mountedToArrPrototype} from "../../mock"
import {ElMessage} from 'element-plus'

const store = useStore()
let date = ref()
let valvePlugInformation = ref()
let input = ref('')
let tableData = ref([])
let tableHeight = window.innerHeight - 240
let addForm = ref()
let addShow = ref(false)
let meterVc = ref([])
let valveCodee = ref({})
meterVc.value = [
  {
    value: 1,
    label: '是'
  },
  {
    value: 2,
    label: '否'
  }
]
let addFormData = reactive({
  id: '',
  meterNo: '',
  meterNoName: '',
  meterType: '',
  meterCaliber: '',
  meterVc: '',
  createTime: '',
})
const validateFloat = (rule, value, callback) => {
  const age = /^[0-9]*$/
  if (!value) {
    return callback(new Error('数值不能为空'))
  } else if (!age.test(value)) {
    return callback(new Error('输入格式错误'))
  } else {
    callback();
  }
};
const valveCodeCheck = (rule, value, callback) => {
  const nameCheck = /^[\u4e00-\u9fa5]+$/
  if (!value) {
    return callback(new Error('请输入类型编号'))
  } else if (valveCodee.find(i => i.value === value)) {
    return callback(new Error('类型编号重复'))
  } else if(nameCheck.test(value)){
    return callback(new Error('不允许输入中文字段'))
  } else {
    callback()
  }
}
let addRules = reactive({
  meterNo: [
    {
      required: true,
      validator: valveCodeCheck,
      trigger: 'blur',
    }
  ],
  meterNoName: [
    {
      required: true,
      message: '请输入类型名称',
      trigger: 'blur',
    }
  ],
  meterType: [
    {
      required: true,
      message: '请输入用途',
      trigger: 'blur',
    }
  ],
  meterCaliber: [
    {
      required: true,
      validator: validateFloat,
      trigger: 'blur',
    }
  ],
  meterVc: [
    {
      required: true,
      message: '请选择是否带有阀控',
      trigger: 'blur',
    }
  ],
  createTime: [
    {
      required: true,
      message: '请选择创建时间',
      trigger: 'blur',
    }
  ],
})
async function addSubmit() {
  addForm.value.validate(async (valid) => {
    if (valid) {
      let res = await addMeterType(addFormData)
      if (res.code === '200') {
        ElMessage({
          type: 'success',
          message: '添加成功'
        })
        addShow.value = false
        const loadingInstance = ElLoading.service(
            {target: document.getElementById("box"), fullscreen: true})
        let res = await getMeterType()
        if (res.code === '200') {
          tableData.value = res.data;
        }
        loadingInstance.close()
        }
      } else {
        ElMessage({
          type: 'error',
          message: '修改失败'
        })
      }
  })
}

let meterType = ref([])
meterType.value = [
  {
    value: 1,
    label: '流量计'
  },
  {
    value: 2,
    label: '压力计'
  }
]

const statusFormate = function (i) {
  return ['danger', 'success'][i]
}

function dateFormatter(str) {//默认返回yyyy-MM-dd HH-mm-ss
  var hasTime = arguments[1] != false ? true : false;//可传第二个参数false，返回yyyy-MM-dd
  var d = new Date(str);
  var year = d.getFullYear();
  var month = (d.getMonth() + 1) < 10 ? '0' + (d.getMonth() + 1) : (d.getMonth() + 1);
  var day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
  var hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
  var minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
  var second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds();
  if (hasTime) {
    return [year, month, day].join('-') + " " + [hour, minute, second].join(':');
  } else {
    return [year, month, day].join('-');
  }
}

function transformEditDate() {
  editModal.data.createTime = dateFormatter(editModal.data.createTime)
}

const editModal = reactive({
  show: false,
  data: {
    id: '',
    meterNo: '',
    meterNoName: '',
    meterType: '',
    meterCaliber: '',
    meterVc: '',
    createTime: '',
  },
  open(row) {
    this.data.id = row.id
    this.data.meterNo = row.meterNo
    this.data.meterNoName = row.meterNoName
    this.data.meterType = row.meterType
    this.data.meterCaliber = row.meterCaliber
    this.data.meterVc = row.meterVc
    this.data.createTime = row.createTime
    this.show = true;
  },
  async submit() {
    console.log(this.data)
    let res = await editMeterType(this.data)
    console.log(res)
    if (res.code == '200') {
      ElMessage({
        type: 'success',
        message: '修改成功'
      })
      res = await getMeterType()
      if (res.code === '200') {
        tableData.value = res.data;
        this.show = false;
      }
    } else {
      ElMessage({
        type: 'error',
        message: '修改失败'
      })
    }
  }
})

async function deleteMetType(id) {
  let res = await deleteMeterType({id})
  if (res.code == '200') {
    ElMessage({
      message: '删除成功',
      type: 'success'
    })
    res = await getMeterType()
    if (res.code === '200') {
      tableData.value = res.data;
    }
  }
}

onMounted(async () => {
  mountedToArrPrototype()
  const loadingInstance = ElLoading.service(
      {target: document.getElementById("box"), fullscreen: true})
  let res = await getMeterType()
  if (res.code === '200') {
    tableData.value = res.data;
    valveCodee = res.data.map(item=>{
      return{
        value:item.meterNo
      }
    })
  }
  loadingInstance.close()
})

</script>
<style>
.p-page2 {
  width: 100%;
  height: calc(100vh - 120px);
  overflow-y: scroll;
  overflow-x: hidden;
  margin: 0;
}

.p2-header {
  border: 1px solid #219ded0f;
  background-color: #219ded0d;
  width: 100%;
  height: 100px;
  border: 1px solid #219ded0f;
}

.drawer {
  background-color: #969696;
}

.page2-name {
  font-size: 20px;
  font-weight: 700;
  top: 35px;
  left: 20px;
  position: relative;
}

.addrSelect2 {
  position: relative;
  top: 3px;
  margin-left: -25px;
}

.roadName {
  position: relative;
  top: 3px;
  left: 410px;
}

.vblock {
  position: relative;
  top: -37px;
  left: 625px;
}

.addbutton {
  position: relative;
  left: 80%;
  top: 3px;
}

.data-chart2 {
  position: relative;
  top: 10px;
  overflow-y: hidden;
}

.p-body {
  margin-top: 10px;
}
</style>
