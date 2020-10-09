import { GET, POST, DELETE } from '../utils/Network';
export const GetCourierById = (id, onSuccess, onFailure) => {
	return GET(`Courier/Config?courierId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
export const DeleteCourier = (id, onSuccess, onFailure) => {
	DELETE(`Courier?id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
export const UpdateCourier = (Data, onSuccess, onFailure) => {
	return POST('Courier/Config', {
		...Data
	}, (res) => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}

export const getAdvancedSettingById = (id, onSuccess, onFailure) => {
	return GET(`Courier/AdvancedSetting?${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const getAdvancedSettingListById = (id, onSuccess, onFailure) => {
	return GET(`Courier/AdvancedSettings/List?courierId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddAdvancedSettings = (data, onSuccess, onFailure) => {
	return POST('Courier/AdvancedSetting', { ...data }, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetAdvancedSetting = (CourierId, AdvancedSettingId, LanguageId, onSuccess, onFailure) => {
	return GET(`Courier/AdvancedSetting?courierId=${CourierId}&Id=${AdvancedSettingId}${LanguageId ? `&languageId=${LanguageId}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}

export const GetShippingSpeed = (onSuccess, onFailure) => {
	GET('Couriers/ShippingSpeeds', res => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}
export const GetWereHousesAdress = (id, onSuccess, onFailure) => {
	GET(`Warehouse/Address?Id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}
export const GetCoueierType = (onSuccess, onFailure) => {
	GET(`Couriers/CourierTypes`, res => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}
export const DeleteAdvancedSetting = (id, onSuccess, onFailure) => {
	DELETE(`Courier/AdvancedSetting?id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => { onFailure && onFailure(err) })
}
