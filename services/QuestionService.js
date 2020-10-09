import { GET, POST, DELETE } from '../utils/Network';

export const GetCustomersFillter = (onSucces, onFaluer) => {
    return GET('Question/Index', res => {
        const NewData = res.data.Data.map((value, index) => value.Customer)
        onSucces(NewData)
    }, err => {
        onFaluer(err)
    })
}
export const GetStatusList = (onSucces, onFaluer) => {
    return GET('Question/Status', res => {
        onSucces(res.data)
    }, err => {
        onFaluer(err)
    })
}
export const GetProudctList = (onSucces, onFaluer) => {
    return GET('Products/Simple', res => {
        onSucces(res.data.Data)
    }, err => {
        onFaluer(err)
    })
}
export const GetQuestionList = (onSucces, onFaluer) => {
    return GET('Question/Index', res => {
        onSucces(res.data.Data)
    }, err => {
        onFaluer(err)
    })
}
export const PostStatus = (DataObj, onSuccess, onFailure) => {
    return POST(`Question/Status?id=${DataObj.id}&status=${DataObj.status}`, {}, ress => { onSuccess(ress) }, err => { onFailure(err) })
}
export const GetQuestionById = (Id, onSucces, onFailure) => {
    return GET(`Question?id=${Id}`, res => {
        onSucces(res.data)
    }, err => {
        onFailure(err)
    })
}
export const SendAnswer = (data, onSucces, onFailure) => {
    return POST('Question/Answer', { ...data }, res => {
        onSucces(res)
    }, err => {
        onFailure(err)
    })
}
export const DeleteQuestion = (Id, onSucces, onFailure) => {
    DELETE(`Question?id=${Id}`, res => {
        onSucces(res)
    }, err => {
        onFailure(err)
    })
}
export const DeleteAnswer = (Id, onSucces, onFailure) => {
   return DELETE(`Question/Answer?answerId=${Id}`, res => {
        onSucces(res)
    }, err => {
        onFailure(err)
    })
}
//GET /v1/Question/Answer