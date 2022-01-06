import request from "../../../apis/3.0/request";

export const getApplicant = async () => {
  return await request.get('/applicant/getapplicantinfo', {
  })
}

export const searchApplicant = async (addData) => {
  return await request.get('/applicant/getapplicantinfo', {
    params: {
      ...addData
    },
  })
}

export const addApplicant = async (addData) => {
  let res = await request.post('/applicant/insertapplicantinfo', {
    data:{
    ...addData
    },
  })
  return res
}

export const editApplicant = async(addData) => {
  let res = await request.put('/applicant/updateapplicantinfo', {
    data:{
    ...addData
    },
  })
  return res
}

export const deleteApplicant = async ({ id }) => {
  return await request.delete('/applicant/deleteapplicantinfo',{
    params: {
      applicantId: id,
    },
  })
}
