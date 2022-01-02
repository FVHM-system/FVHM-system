import request from "../../../apis/3.0/request";

export const getMeterType = async () => {
  return await request.get('/meter/getallmetertypes', {
  })
}

export const addMeterType = async (addData) => {
  let res = await request.post('/meter/insertmetertype', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const editMeterType = async(addData) => {
  console.log(addData)
  let res = await request.put('/meter/updatemetertype', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const deleteMeterType = async ({ id }) => {
  return await request.delete('/meter/deletemetertype',{
    params: {
      typeId: id,
    },
  })
}
