import request from "../../../apis/3.0/request";

export const fetchFindData = async(valveType,valveStatus,address)=>{
  return await request.get('/valveinfo/findvalveinfosbyconditions', {
    params: {
      valveType:valveType,
      status:valveStatus,
      address:address
    },
  })
}

