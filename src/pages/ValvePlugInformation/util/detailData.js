import request from "../../../apis/3.0/request";

export const fetchDetailData = async (valveId) => {
  return await request.get('/valveinfo/getvalveinfobyvalveid', {
    params: {
      valveId:valveId,
    },
  })
}
