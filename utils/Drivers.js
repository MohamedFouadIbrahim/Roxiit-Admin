import { orangeColor, greenColor, redColor } from '../constants/Colors.js';
import { store } from '../Store.js';
import { LongToast } from './Toast.js';

export const getDriverTextColor = (status) => {
	return "white"
}

export const getDriverBgColor = (status) => {
	switch (status) {
		case 2:
			return greenColor
		case 3:
			return redColor
		default:
			return orangeColor
	}
}

export const isValidDriverSelection = (item) => {
	const RestrictAssignmentToOnlineDriver = store.getState().runtime_config.runtime_config.screens.Admin_Page_0_0.RestrictAssignmentToOnlineDriver.Value

	if (item.Status.Id !== 2 && RestrictAssignmentToOnlineDriver) {
		LongToast("CantSelectDriver")
		return true
	}

	return false
}