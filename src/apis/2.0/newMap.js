import request from './request'

export const fetchValveInfos = async()=>{
    return await request.Pget('/valveinfo/getvalveinfos')
}

