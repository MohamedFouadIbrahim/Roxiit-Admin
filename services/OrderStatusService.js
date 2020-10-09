import { POST, DELETE, GET } from "../utils/Network"

export const ReorderStatus = (Ids, onSuccess, onFailure) => {
    return POST(`OrderStatus/Reorder`, Ids, res => {
        onSuccess && onSuccess(res)
    }, err => {
        onFailure && onFailure(err)
    })
}

export const DeleteOrderStatus = (id, onSuccess, onFailure) => {
    DELETE(`OrderStatus?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}


export const GetOrderStatus = (id, language_id, onSuccess, onFailure) => {
    return GET(`OrderStatus?Id=${id}${language_id ? `&languageId=${language_id}` : ''}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}


export const GetThemeList = (language_id, onSuccess, onFailure) => {
    return GET(`Order/StatusThemeList?${language_id ? `&languageId=${language_id}` : ''}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}


export const EditOrderStatus = (data, onSuccess, onFailure) => {
    return POST('OrderStatus', data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        onFailure && onFailure(err)
    })
}