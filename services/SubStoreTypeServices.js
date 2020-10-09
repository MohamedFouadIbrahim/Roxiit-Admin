import { GET, DELETE, POST } from '../utils/Network'


export const GetSubStoreType = (id, onSuccess, onFailure) => {
    return GET(`SubStoreType?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const DeleteSubStoreType = (id, onSuccess, onFailure) => {
    DELETE(`SubStoreType?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const EditSubStoreType = (data, onSuccess, onFailure) => {
    return POST('SubStoreType', data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        if (onFailure) {
            return onFailure(err)
        }
    })
}

export const SetAsDefault = (id, onSuccess, onFailure) => {
    return POST(`SubStoreType/Default?Id=${id}`, id, res => {
        onSuccess && onSuccess(res)
    }, err => {
        if (onFailure) {
            return onFailure(err)
        }
    })
}

export const GetSubStoreTypes = (onSuccess, onFailure) => {
    return GET(`SubStoreTypes`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        onFailure && onFailure(err)
    })
}