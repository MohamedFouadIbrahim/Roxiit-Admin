import { types } from '../redux/NetworkRedux';
import { Alert, Clipboard } from 'react-native'
import { store } from '../Store';
// import NetInfo from "@react-native-community/netinfo";
import { isDevelopmentMode } from '../constants/Config';
import { LongToast } from './Toast';

export const CheckConnectivity = () => {

	// NetInfo.isConnected.fetch().then(isConnected => {
	// 	if (!isConnected) {
	// 		store.dispatch({ type: types.SET_IS_CONNECTED, is_connected: false })
	// 	}
	// });

}

const DisplayDetailsAlert = (details) => {
	const errorDetails = JSON.stringify(details)

	Alert.alert(
		"ErrorDetails",
		errorDetails,
		[
			{ text: "DISMISS", onPress: () => { }, style: 'cancel' },
			{ text: "COPY TO CLIPBOARD", onPress: () => { Clipboard.setString(errorDetails) }, },
		],
		{ cancelable: true }
	)
}

export const HandleInternalError = (response) => {
	if (isDevelopmentMode) {
		DisplayDetailsAlert(response.data.ErrorDetails)
	}
	else {
		store.dispatch({ type: types.SET_IS_INTERNAL_ERROR, is_internal_error: true })
	}
}

export const HandleNotFoundError = (response) => {
	if (isDevelopmentMode) {
		DisplayDetailsAlert(response.data.ErrorDetails)
	}
	else {
		store.dispatch({ type: types.SET_IS_NOT_FOUND_ERROR, is_not_found_error: true })
	}
}

export const HandleFloodError = (response) => {
	if (isDevelopmentMode) {
		DisplayDetailsAlert(response.data.ErrorDetails)
	}
	else {
		store.dispatch({ type: types.SET_IS_FLOOD_ERROR, is_flood_error: true })
	}
}

export const HandleValidationError = (response) => {
	if (isDevelopmentMode) {
		DisplayDetailsAlert(response.data.ErrorDetails)
	}
	else {
		LongToast(response.data.Message, false)
	}
}

export const HandleLogicalError = (response) => {
	if (isDevelopmentMode) {
		DisplayDetailsAlert(response.data.ErrorDetails)
	}
	else {
		LongToast(response.data.Message, false)
	}
}