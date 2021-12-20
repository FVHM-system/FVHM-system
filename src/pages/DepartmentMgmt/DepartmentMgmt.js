import request from "../../apis/2.0/request";

export const getDepartment = async () => {
  return await request.get('/department/getdepartment', {
  })
}


export const addDepartment = async (addData) => {
  let res = await request.post('/department/insertdepartment', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const editDepartment = async(addData) => {
  console.log(addData)
  let res = await request.put('/department/updatedepartment', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const deleteDepartment = async ({ id }) => {
  return await request.delete('/department/deletedepartment',{
    params: {
      departmentId: id,
    },
  })
}