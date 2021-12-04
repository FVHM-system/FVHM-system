import request from "../../../apis/2.0/request";

export const fetchLicense = async () => {
  return await request.get('/license/getlicenseinfo', {
  })
}

export const fetchDepartments = async () => {
  return await request.get('/department/getdepartmentinfo', {
  })
}

export const addLicense = async (addData) => {
  let res = await request.post('/license/insertlicenseinfo', {
    data:{
      ...addData
    },
  })
  console.log(res)
  return res
}

export const editLicense = async(addData) => {
  console.log(addData)
  let res = await request.put('/license/updatelicenseinfo', {
    data:{
      ...addData
    },
  })
  console.log(res)
  return res
}

export const deleteLicense = async ({ id }) => {
  return await request.delete('/license/deletelicenseinfo',{
    params: {
      licenseId: id,
    },
  })
}