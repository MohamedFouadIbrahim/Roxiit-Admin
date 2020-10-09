import { DELETE, GET, POST } from '../utils/Network';

export const DeleteDiscount = (id, onSuccess, onFailure) => {
 	DELETE(`Discount?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetDiscount = (id, onSuccess, onFailure) => {
	return	GET(`Discount?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddEditDiscount = (data, onSuccess, onFailure) => {
	return	POST(`Discount`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		if (onFailure) {
			return onFailure(err)
		}
	})
}

export const IsCouponCodeDuplicated = (id, code, callback) => {
 return	GET(`Discount/CheckCouponDuplicated?couponCode=${code}${id ? `&discountId=${id}` : ''}`, res => {
		callback && callback(res.data)
	}, err => {
		// Do something special if this request fails or ignore
		callback && callback(false)
	})
}