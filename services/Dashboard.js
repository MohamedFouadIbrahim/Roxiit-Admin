import { GET } from '../utils/Network'

export const GetDashboard = (onSuccess, onFailure) => {
    return GET(`Dashboard`, res => {
        onSuccess && onSuccess(res)
    }, err => {
        // Do something special if this request fails or ignore
        onFailure && onFailure(err)
    })
}
