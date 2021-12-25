
import request from "../3.0/request";

export const fetchCheckInfo=async()=>{
    return await request.get('/inspect/getinspectinfos')
}

export const fetchPeopleList=async({role})=>{
    return await request.get('/user/findinspectpeople',{
        params:{
            role,
        },
    })
}

export const fetchCheckInfoByConfig=async({roadId,status,people,startTime,endTime,complete})=>{
    return await request.get('/inspect/findinspectinfo',{
        params:{
            roadId,
            status,
            people,
            startTime,
            endTime,
            complete
        },
    })
}

export const fetchCheckDetail=async({taskId})=>{
    return await request.get('/inspect/gettaskdetail',{
        params:{
            taskId,
        },
    })
}

export const updateCheck=async({taskId,peopleId,inspectTime,createTime,remark})=>{
    return await request.put('/inspect/updateinspecttask',{
        data:{
            taskId,
            peopleId,
            inspectTime,
            createTime,
            remark,
        },
    })
}//????

export const addMissionValves=async({taskId,valveIds})=>{
    return await request.post('/inspect/insertinspectvalves',{
        params:{
            taskId,
        },
        data: valveIds,
    })
}

export const deleteMissionValves=async({id})=>{
    return await request.delete('/inspect/deleteinspectvalve',{
        params:{
            id,
        },
    })
}

export const changeDetail=async({id,complete,remark,completeTime})=>{
    return await request.put('/inspect/updatecomplete',{
        params:{
            id,
            complete,
            remark,
            completeTime,
        },
    })
}

export const deleteCheck=async({taskId})=>{
    return await request.delete('/inspect/deleteinspectinfo',{
        params:{
            taskId,
        },
    })
}

export const addCheck=async({peopleId,valveIds,inspectTime,createTime})=>{
    return await request.post('/inspect/insertinspectinfo',{
        data:{
            peopleId,
            valveIds,
            inspectTime,
            createTime,
        },
    })
}

