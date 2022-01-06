import request from './2.0/request'

export const addAccount = async ({ username, password, describe, phone }) => {
  return await request.Ppost('/user/register', {
    data: {
      name: username,
      password: password,
      description: describe,
      phone: phone
    },
  })
}

// 仍在使用的旧接口
export const fetchAccountsList = async () => {
  return await request.Pget('/user/getinfos')
}

export const deleteAccount = async ({ ids }) => {
  return await request.Pdelete('/user/deleteuser', {
    params: {
      idList: ids,
    },
  })
}

export const editAccountName = async ({ id, name }) => {
  return await request.Pput('/user/updateuser', {
    data: {
      userId: id,
      name: name,
    },
  })
}

export const editAccountDesc = async ({ id, name, desc, password }) => {
  return await request.Pput('/user/updateuser', {
    data: {
      userId: id,
      description: desc,
    },
  })
}

export const editAccountPhone = async ({ id, phone }) => {
  return await request.Pput('/user/updateuser', {
    data: {
      userId: id,
      phone: phone,
    },
  })
}

export const editAccountPost = async ({ id, post }) => {
  return await request.Pput('/user/updateuser', {
    data: {
      userId: id,
      post: post,
    },
  })
}

export const editAccountPassword = async ({ id, password }) => {
  return await request.Pput('/user/updateuser', {
    data: {
      userId: id,
      password: password,
    },
  })
}

// 仍在使用的旧接口
export const loginAccount = async ({ username, password }) => {
  return await request.post('/login', {
    data: {
      username,
      password,
    },
  })
}
