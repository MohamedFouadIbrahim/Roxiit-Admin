import { DELETE, GET, POST } from '../utils/Network';

export const PayMentMethods = (onSuccess, onFailure) => {
    GET('PaymentMethods/Simple', res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}

export const GetPayMentMethodConfig = (paymentMethodId, ProviderId, onSuccess, onFailure) => {
    GET(`PaymentMethod/Config?paymentMethodId=${paymentMethodId}${ProviderId ? `&ProviderId=${ProviderId}` : ''}`, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}

export const PostPayMentMethodConfig = (data, onSuccess, onFailure) => {
    POST('PaymentMethod/Config', data, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}


export const DeletePayMentMethodConfig = (paymentMethodId, ProviderId, onSuccess, onFailure) => {
    DELETE(`PaymentMethod/Config?paymentMethodId=${paymentMethodId}${ProviderId ? `&ProviderId=${ProviderId}` : ''}`, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}