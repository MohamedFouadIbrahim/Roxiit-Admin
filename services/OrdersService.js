import { POST, GET, DELETE, IMG } from '../utils/Network';
import { secondColor } from '../constants/Colors';
import * as mime from 'react-native-mime-types';
import { formatDate, formatTime } from '../utils/Date';

export const ChangeOrderStatus = (data, onSuccess, onFailure) => {
	POST(`Order/Status`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderStatusList = (onSuccess, onFailure) => {
	GET(`Order/StatusList`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderPricing = (data, onSuccess, onFailure) => {
	POST(`Order/EstPricing`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderCheckout = (onSuccess, onFailure) => {
	GET(`Order/Checkout`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderSummary = (id, onSuccess, onFailure) => {
	GET(`Order/Summary?orderId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderDetails = (id, onSuccess, onFailure) => {
	GET(`Order/Summary/Details?orderId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const OrderPlace = (data, onSuccess, onFailure) => {
	POST(`Order/Place`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const OrderPlaceExtension = (endpoint_extension, data, onSuccess, onFailure) => {
	POST(`Order/Place/${endpoint_extension}`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const Getproductoptions = (ProudctId, onSuccess, onFailure) => {
	GET(`ProductOptionGroup/Product?productId=${ProudctId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const ChangeOrderPricing = (data, onSuccess, onFailure) => {
	POST(`Order/Pricing`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditOrderSummaryDetails = (data, onSuccess, onFailure) => {
	POST(`Order/Summary/Details`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderHistory = (id, onSuccess, onFailure) => {
	GET(`Order/History?orderId=${id}`, res => {
		if (onSuccess) {
			const formatted_data = res.data.Data.map(({ Id, Status: { Name }, CreatedUtc, User, Note }) => ({
				Id,
				title: Name,
				description: User ? `${User.Name} \n \n${formatDate(CreatedUtc)}  ${formatTime(CreatedUtc)}` : `${formatDate(CreatedUtc)} ${formatTime(CreatedUtc)}`,
				dotColor: secondColor,
				circleColor: secondColor,
				Note
			}))

			onSuccess(res, formatted_data)
		}
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteOrderItem = (id, update_price, onSuccess, onFailure) => {
	return DELETE(`Order/OrderLine?orderLineId=${id}&updateOrderPrice=${update_price}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeOrderItemQuantity = (id, quantity, update_price, onSuccess, onFailure) => {
	POST(`Order/OrderLine/Qty?orderLineId=${id}&qty=${quantity}&updateOrderPrice=${update_price}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddEditOrderItem = (updateOrderPrice, data, onSuccess, onFailure) => {
	POST(`Order/OrderLine?updateOrderPrice=${updateOrderPrice}`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ChangeDriverStatus = (user_id, driver_status_id, onSuccess, onFailure) => {
	POST(`User/DriverStatus`, {
		UserId: user_id,
		DrvierStatusId: driver_status_id
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetDriverList = (onSuccess, onFailure) => {
	return GET(`User/Drivers`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddDriverToOrder = (orderId, driverId, onSuccess, onFailure) => {
	return POST(`Order/Driver?orderId=${orderId}&driverId=${driverId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AcceptOrder = (orderId, onSuccess, onFailure) => {
	GET(`Order/Accept?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeclineOrder = (orderId, onSuccess, onFailure) => {
	GET(`Order/Reject?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetChat = (customerId, orderId, onSuccess, onFailure) => {
	GET(`Order/Chats?customerId=${customerId}&orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const SendFile = (orderId, customerId, file, onSuccess, onFailure, onUpoadFile) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: file.uri,
		name: file.name,
		type: file.type
	});

	IMG(`Order/Chat/File?orderId=${orderId}&customerId=${customerId}`, formData, (res) => {

		onSuccess && onSuccess(res)

	}, err => {

		onFailure && onFailure(err)

	}, (pro) => {

		onUpoadFile && onUpoadFile(pro)

	})
}

export const SendFileWithoutOrder = (customerId, file, onSuccess, onFailure, onUpoadFile) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: file.uri,
		name: file.name,
		type: file.type
	});

	IMG(`Customer/Chat/File?customerId=${customerId}`, formData, (res) => {

		onSuccess && onSuccess(res)

	}, err => {

		onFailure && onFailure(err)

	}, (pro) => {

		onUpoadFile && onUpoadFile(pro)

	})
}
export const SendMsg = (data, onSuccess, onFailure) => {
	POST(`Order/Chat`, data, res => {
		onSuccess && onSuccess(res)

	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetChatForCustomer = (customerId, onSuccess, onFailure) => {
	GET(`Customer/Chats?customerId=${customerId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
//POST /v1/
export const SendMsgForCustomer = (data, onSuccess, onFailure) => {
	POST(`Customer/Chat`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AcceptOrderDriver = (Id, onSuccess, onFailure) => {
	GET(`Order/Driver/Accept?orderId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeclineOrderDriver = (Id, onSuccess, onFailure) => {
	GET(`Order/Driver/Reject?orderId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const SetOrderLocation = (orderId, lat, lng, onSuccess, onFailure) => {

	POST(`Order/Location?orderId=${orderId}&lat=${lat}&lng=${lng}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetQRCode = (onSuccess, onFailure) => {
	GET(`QrCode/List`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const CancelOrder = (orderId, onSuccess, onFailure) => {
	POST(`Order/Cancel?orderId=${orderId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const orderBulk = (data, onSuccess, onFailure) => {
	POST(`Order/Bulk`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteReminder = (reminderId, onSuccess, onFailure) => {
	DELETE(`Order/Reminder?reminderId=${reminderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddReminder = (data, onSuccess, onFailure) => {
	POST(`Order/Reminder`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetInvoice = (orderId, onSuccess, onFailure) => {
	GET(`Order/Invoice?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderNote = (orderId, onSuccess, onFailure) => {
	GET(`Order/Note?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddOrderNote = (data, onSuccess, onFailure) => {
	POST(`Order/Note?orderId`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteOrder = (orderId, onSuccess, onFailure) => {
	return DELETE(`Order?orderId=${orderId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetOrderDates = (id, onSuccess, onFailure) => {
	GET(`Order/Dates?orderId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const EditOrderDates = (data, onSuccess, onFailure) => {
	POST(`Order/Dates`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}