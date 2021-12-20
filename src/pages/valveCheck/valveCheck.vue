<template>
  <div class="p-page">
    <div class="p-header">
      <p class="page-name">巡视安排</p>
      <el-col :span="8">
        <el-input v-model="input1" placeholder="请输入巡视人" style="margin-left: 170px;top:3px;width: 150px"/>
      </el-col>
        <el-select v-model="input2" placeholder="选择状态" style="margin-left:10px;width: 120px;margin-top: 3px">
          <el-option
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :value="item.value"
          >
          </el-option>
        </el-select>
        <el-date-picker
            v-model="value1"
            type="datetimerange"
            range-separator="至"
            start-placeholder="Start date"
            end-placeholder="End date"
            style="margin-top: 3px;margin-left: 10px"
        >
        </el-date-picker>
      <div class="button-group">
        <el-button v-model="search" type="primary" @click="dataSearch">查询</el-button>
        <el-button type="primary" @click="addModal.open()">新增</el-button>
        <el-button type="info" @click="reload">重置</el-button>
        <el-button type="primary" @click="exportCSV">导出</el-button>
      </div>
    </div>
    <el-scrollbar >
        <el-table
            :data=tableData
            :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
            :cell-style="{'text-align':'center'}"
            :row-style="{fontSize:'16px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
            style="width: 100%"
        >
          <el-table-column label="任务编号" prop="id" width="120px"/>
          <el-table-column label="任务道路" prop="zoneName" width="120px"/>
          <el-table-column label="巡视人" prop="people" width="120px"/>
          <el-table-column label="电话号码" prop="phone" width="200px"/>
          <el-table-column label="完成状态" prop="complete"  width="200px"/>
          <el-table-column label="创建时间" prop="createTime" width="200px"/>
          <el-table-column label="任务时间" prop="inspectTime" width="200px"/>
          <el-table-column label="备注" prop="remark" width="200px"/>
          <el-table-column fixed="right" label="操作" width="300">
            <template #default="scope">
              <el-button type="primary" @click="editModal.open(scope.row)">编辑</el-button>
              <el-button type="primary" @click="detailModal.open(scope.row)">详情</el-button>
              <el-button type="danger" @click="myFunc.delete(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
    </el-scrollbar>
  </div>
  <el-dialog v-model="editState" :title="modalTitle"  center>
        <el-form :model="addForm" label-width="100px" :inline="false">
        <!-- <el-form-item label="任务阀栓" required>
            <el-select v-model="addForm.zoneId" clearable style="width: 330px" placeholder="请选择">
            <el-option v-for="item in roadList" :key="item.zoneId" :label="item.road" :value="item.zoneId"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="巡视人" required>
            <el-input v-model="addForm.people" style="width: 360px"></el-input>
        </el-form-item>
        <el-form-item label="电话号码" required>
            <el-input v-model="addForm.phone" style="width: 360px"></el-input>
        </el-form-item>
        <!-- <el-form-item label="完成状态" required>
            <el-select v-model="addForm.complete" clearable style="width: 330px" placeholder="请选择">
            <el-option v-for="item in status" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item> -->
        <el-form-item label="任务时间" >
            <el-date-picker
                    v-model="addForm.inspectTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" >
            <el-input v-model="addForm.remark" style="width: 360px"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="modal.submit()">保存</el-button>
        <el-button @click="modal.cancel()">取消</el-button>
        </template>
   </el-dialog>
  <el-dialog v-model="detailState" :title="modalTitle"  center width="65%">
    <el-button type="primary" class="detail-btn">新增任务阀栓</el-button>
    <el-table 
      :data="taskData"
      :header-cell-style="{background:'#EFF7FD', fontFamily:'Helvetica,Arial,sans-serif',fontSize:'17px',
          color:'#219DEDF2',fontWeight:500,'text-align':'center'}"
      :cell-style="{'text-align':'center'}"
      :row-style="{fontSize:'14px',color:'#606266',fontFamily:'Helvetica,Arial,sans-serif'}"
      style="width: 100%"
      height="350"
    >
      <el-table-column label="阀栓编号" prop="valveId" width="60px"/>
      <el-table-column label="阀栓名" prop="valveName" width="150px"/>
      <el-table-column label="地址" prop="address" width="180px"/>
      <el-table-column label="完成状态" prop="complete" width="60px"/>
      <el-table-column label="完成时间" prop="completeTime" width="160px"/>
      <el-table-column label="备注" prop="remark" width="120px"/>
      <el-table-column  label="操作" width="180px">
            <template #default="scope">
              <el-button type="primary" @click="valveDetail.detailEdit(scope.row)">编辑</el-button>
              <el-button type="danger" >删除</el-button>
            </template>
      </el-table-column>
    </el-table>
  </el-dialog>
  <el-dialog v-model="editDetailState" title="编辑"  center>
        <el-form :model="detailForm" label-width="100px" :inline="false">
        <el-form-item label="完成状态" required>
            <el-select v-model="detailForm.complete" clearable style="width: 330px" placeholder="请选择">
            <el-option v-for="item in status" :key="item.label" :label="item.label" :value="item.value"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="完成时间" >
            <el-date-picker
                    v-model="detailForm.completeTime"
                    value-format="yyyy-MM-dd HH:mm:ss"
                    type="datetime"
                    placeholder="请选择"
                    >
            </el-date-picker>
        </el-form-item>
        <el-form-item label="备注" >
            <el-input v-model="detailForm.remark" style="width: 360px"></el-input>
        </el-form-item>
        </el-form>
        <template #footer>
        <el-button type="primary" class="search-btn" @click="valveDetail.submitEdit()">保存</el-button>
        <el-button @click="valveDetail.detailCancel()">取消</el-button>
        </template>
   </el-dialog>
</template>

<script setup>
import { onMounted, ref,  reactive, computed} from 'vue'
import { exportExcel } from '../../utils/exportExcel'
import {
    fetchCheckInfo,
    fetchCheckInfoByConfig,
    deleteCheck,
    addCheck,
    updateCheck,
    fetchCheckDetail,
    changeDetail 
} from '../../apis/2.0/newCheck'
import {fetchRoadList} from '../../apis/2.0/addr'
import { ElMessageBox, ElMessage } from 'element-plus'
import dayjs from 'dayjs'
const status = [
  {
    value: 1,
    label: '已完成',
  },
  {
    value: 0,
    label: '未完成',
  },
]
let input1 = ref('')
let input2 = ref('')
let value1 = ref('')
let tableData = ref([])
let taskData=ref([])
let editState = ref(false)
let detailState=ref(false)
let modalState=ref(false)
let editDetailState=ref(false)
let roadList=ref([])
let mode=ref('')
let modal = ref()
let modalTitle = computed(() => {
    let res
    if (mode.value === 'add') {
      res = '新增巡视任务'
    } else if (mode.value === 'edit') {
      res = '编辑巡视任务'
    } else if(mode.value==='detail'){
      res='任务详情'
    }
    return res
  })
const addForm = reactive({
    taskId: '',
    zoneId:'',
    people: '', 
    phone: '',
    createTime: '',
    inspectTime:'',
    complete: '',
    remark:''
  })
const detailForm = reactive({
  id:'',
  complete: '',
  completeTime: '',
  remark:''
})



const valveDetail={
    async detailAdd(item){

    },
    async detailEdit(item){
      editDetailState.value=true
      detailForm.id=item.id
      detailForm.complete=item.complete
      detailForm.completeTime=item.completeTime
      detailForm.remark=item.remark
    },
    async detailDelete(item){

    },
    detailCancel(){
      editDetailState.value=false
    },
    async submitEdit(){
      console.log("id",detailForm.id)
      console.log("完成状态",detailForm.complete)
      console.log("完成时间",dayjs(detailForm.completeTime).format('YYYY-MM-DD HH:mm:ss'))
      console.log("备注",detailForm.remark)
      const r=await changeDetail({
        id:detailForm.id,
        complete:detailForm.complete,
        remark:detailForm.remark,
        completeTime:dayjs(detailForm.completeTime).format('YYYY-MM-DD HH:mm:ss'),
      })
      if (r.code === '200') {
        ElMessage({
          type: 'success',
          message: '操作成功!',
        })
        const res1=await fetchCheckDetail({taskId: addForm.taskId})//刷新表格数据
        taskData.value=res1.data
      }
      this.detailCancel()
    }
}

function exportCSV() {
    const excel = {}
    excel.props = [
      {
        label: '任务编号',
        name: 'id',
      },
      {
        label: '任务道路',
        name: 'zoneName',
      },
      {
        label: '巡视人',
        name: 'people',
      },
      {
        label: '电话号码',
        name: 'phone',
      },
      {
        label: '完成状态',
        name: 'complete',
      },
      {
        label:'创建时间',
        name:'createTime',
      },
      {
        label: '任务时间',
        name: 'inspectTime',
      },
      {
        label: '备注',
        name: 'remark',
      },
    ]
    excel.body = tableData.value
    excel.fileName = '巡视任务表'
    exportExcel(excel)
  }
async function dataSearch(){
    console.log("value1",value1.value)
    let res
    if(value1.value===''){
        res=await fetchCheckInfoByConfig({
        people: input1.value,
        complete: input2.value,
      })
    }
    else{
          res=await fetchCheckInfoByConfig({
          people: input1.value,
          complete: input2.value,
          startTime:dayjs(value1.value[0]).format('YYYY-MM-DD HH:mm:ss'),
          endTime:dayjs(value1.value[1]).format('YYYY-MM-DD HH:mm:ss'),
      })
    }
    console.log("people",input1.value)
    console.log("complete",input2.value)
    console.log("startTime",dayjs(value1.value[0]).format('YYYY-MM-DD HH:mm:ss'))
    console.log("endTime",dayjs(value1.value[1]).format('YYYY-MM-DD HH:mm:ss'))

    if(res.code==='200' && res.data.length!==0){
    ElMessage({
      type: 'success',
      message: '查询成功！',
    })
    tableData.value = res.data;
    console.log("all data",res.data)
    }
    else {
        ElMessage({
        type: 'error',
        message: '数据未找到！',
        })
    }

}
const myFunc={
        async search(){
          let res = await fetchCheckInfo()
          tableData.value = res.data; 
          console.log("所有信息",tableData.value)
          const temp1=await fetchRoadList()
          roadList.value=temp1
        },
        async add() {

            const r = await addCheck({
              id: addForm.id,
              zoneId: addForm.zoneId,
              people: addForm.people,
              phone: addForm.phone,
              createTime: dayjs(addForm.createTime).format('YYYY-MM-DD HH:mm:ss'),
              inspectTime: dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'),
              complete: addForm.complete,
              remark: addForm.remark
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
            const r = await updateCheck({
                id: addForm.id,
                //zoneId: addForm.zoneId,
                people: addForm.people,
                phone: addForm.phone,
                createTime: dayjs(addForm.createTime).format('YYYY-MM-DD HH:mm:ss'),
                inspectTime: dayjs(addForm.inspectTime).format('YYYY-MM-DD HH:mm:ss'),
                //complete: addForm.complete,
                remark: addForm.remark
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
                const r = await deleteCheck({ inspectId: item.id })
                if (r.code === '200') {
                    this.search()
                    ElMessage({
                    type: 'success',
                    message: '删除成功!',
                    })
                }
                })
                .catch(() => {})
        },
  }
    const addModal = {
        changeState(e) {
        modalState.value = e
        },
        state: modalState,
        async submit() {
        if (!addForm.people || !addForm.phone ||!addForm.zoneId||!addForm.complete) {
            ElMessage({
            type: 'info',
            message: '必要信息不能为空',
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
        addForm.zoneId = ''
        addForm.people = ''
        addForm.phone=''
        addForm.createTime=''
        addForm.inspectTime=''
        addForm.complete=''
        addForm.remark=''
        modal.value = addModal
        },
    }

    const editModal = {
    changeState(e) {
        editState.value = e
    },
    state: editState,
    async submit() {
        if (!addForm.people || !addForm.phone) {
        ElMessage({
            type: 'info',
            message: '必要信息不能为空',
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
        addForm.id=item.id
        addForm.zoneId = item.zoneId
        addForm.people = item.people
        addForm.phone=item.phone
        addForm.createTime=item.createTime
        addForm.inspectTime=item.inspectTime
        addForm.complete=item.complete
        addForm.remark=item.remark
        console.log("hahahaha",item.zoneId)
    },
    }
    const detailModal={
        changeState(e) {
          detailState.value = e
        },
        state: detailState,
        cancel() {
          this.changeState(false)
        },
        async open(item) {
        const res1=await fetchCheckDetail({taskId: item.taskId})
        taskData.value=res1.data
        this.changeState(true)
        mode.value = 'detail'
        modal.value = detailModal
        addForm.taskId=item.taskId
        addForm.zoneId = item.zoneId
        addForm.people = item.people
        addForm.phone=item.phone
        addForm.createTime=item.createTime,
        addForm.inspectTime=item.inspectTime,
        addForm.complete=item.complete
        addForm.remark=item.remark
        console.log("hahahaha",item.zoneId)
        },
    }
const reload = async function () {
    location.reload()
}
const statusFormate = function (row){
  const targetStatus = status.find(i => i.value === row.complete)
  return targetStatus.label;
}

onMounted(async () => {
  myFunc.search()
})
</script>

<style lang="scss" scoped>
.button-group{
  position: relative;
  margin-top: -40px;
  margin-left: 950px;
  width: 400px;
}

.detail-btn{
  position: relative;
  left: 82.5%;
  top: -15px;
}
</style>