import request from "../../../apis/3.0/request";

export const getMeter = async () => {
  return await request.get('/meter/getmeterinfos', {
  })
}

export const getMeterById = async (id) => {
  return await request.get('/meter/getmeterinfobycode', {
    params: {
      meterCode: id,
    },
  })
}

export const addMeter = async (addData) => {
  console.log(addData)
  let res = await request.post('/meter/insertmeterinfo', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const editMeter = async(addData) => {
  console.log(addData)
  let res = await request.put('/meter/updatemeterinfo', {
    data:{
    ...addData
    },
  })
  console.log(res)
  return res
}

export const deleteMeter = async ({ id }) => {
  return await request.delete('/meter/deletemeterinfo',{
    params: {
      meterId: id,
    },
  })
}
