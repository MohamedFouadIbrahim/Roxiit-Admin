import { GET, DELETE, POST } from '../utils/Network'


export const GetAffiliateRole = (id, onSuccess, onFailure) => {
    return GET(`AffiliateRole?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const DeleteAffilateRole = (id, onSuccess, onFailure) => {
    DELETE(`AffiliateRole?id=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}

export const EditAffiliateRole = (data, onSuccess, onFailure) => {
    return POST('AffiliateRole', data, res => {
        onSuccess && onSuccess(res)
    }, err => {
        if (onFailure) {
            return onFailure(err)
        }
    })
}