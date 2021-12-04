import request from "../../../apis/3.0/request";

export const fetchFindData = async(num,name,address)=>{
  return await request.get('/valveinfo/findvalveinfosbyconditions', {
    params: {
      valveCode:num,
      valveName:name,
      address:address
    },
  })
}

