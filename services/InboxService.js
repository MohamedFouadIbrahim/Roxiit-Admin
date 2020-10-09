import { DELETE } from '../utils/Network';

export const DeleteOrderInbox = (orderId, onSuccess, onFailure) => {
	return DELETE(`Orders/Inbox?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteCustomerInbox = (customerId, onSuccess, onFailure) => {
	return DELETE(`Customers/Inbox?customerId=${customerId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteUserInbox = (userId, onSuccess, onFailure) => {
	return DELETE(`Users/Inbox?userId=${userId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
