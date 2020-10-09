import { DELETE } from '../utils/Network';

export const DeleteSubStore = (id, onSuccess, onFailure) => {
    DELETE(`Tenant/SubStore?subStoreId=${id}`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}