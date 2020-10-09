import { CommonActions } from '@react-navigation/native';

export const processPressedNotification = (notification, navigation, is_root = true) => {
	const { _data } = notification

	if (_data && _data.type === "navigation") {
		const { routeName, params } = _data
		parsedParams = params && params.length ? JSON.parse(params) : undefined

		if (is_root) {

			if (routeName == 'OrderChat') {

				if (parsedParams.NavigateTo == 'OrderTab') {

					navigation.current.navigate('OrderChat', {
						orderId: parsedParams.orderId,
						CustomerId: parsedParams.CustomerId,
						fromCustomer: false,
						profileIcon: {
							Id: parsedParams.orderId,
							navigateTo: 'Order'
						}
					})

				} else if (parsedParams.NavigateTo == 'CustomerTab') {
					navigation.current.navigate('OrderChat', {
						orderId: null,
						CustomerId: parsedParams.Id,
						fromCustomer: true,
						profileIcon: {
							Id: parsedParams.Id,
							navigateTo: 'Customer'
						}
					}
					)
				}
			} else if (routeName == 'Order') {

				navigation.current.navigate('Order',
					{
						Id: parsedParams.Id
					})
			}
			else if (routeName == 'OrderTrackingHistory') {
				navigation.current.navigate('OrderHistory', parsedParams)

			} else if (routeName == 'Product') {
				navigation.current.navigate('Product',
					{
						ProductId: parsedParams.Id,
						Type: parsedParams.Type
					})

			} else {
				navigation.current.navigate(routeName, parsedParams)
			}

		}
		else {

			if (routeName == 'OrderChat') {

				if (parsedParams.NavigateTo == 'OrderTab') {

					navigation.navigate('OrderChat', {
						orderId: parsedParams.orderId,
						CustomerId: parsedParams.CustomerId,
						fromCustomer: false,
						profileIcon: {
							Id: parsedParams.orderId,
							navigateTo: 'Order'
						}
					})

				} else if (parsedParams.NavigateTo == 'CustomerTab') {

					navigation.navigate('OrderChat', {
						orderId: null,
						CustomerId: parsedParams.Id,
						fromCustomer: true,
						profileIcon: {
							Id: parsedParams.Id,
							navigateTo: 'Customer'
						}
					}
					)
				}
			} else if (routeName == 'Order') {
				navigation.navigate('Order',
					{
						Id: parsedParams.Id
					})
			} else if (routeName == 'Product') {

				navigation.navigate('Product',
					{
						ProductId: parsedParams.Id,
						Type: parsedParams.Type
					})

			} else if (routeName == 'OrderTrackingHistory') {
				navigation.navigate('OrderHistory', parsedParams)

			} else {
				navigation.navigate(routeName, parsedParams)
			}
		}
	}
}