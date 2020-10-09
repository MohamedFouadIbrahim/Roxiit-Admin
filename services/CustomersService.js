import { DELETE, GET, POST } from '../utils/Network';

export const DeleteCustomer = (id, onSuccess, onFailure) => {
	return DELETE(`Customer?customerId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetCustomer = (id, onSuccess, onFailure) => {
	return GET(`Customer/FullInfo?customerId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetCustomerByPhone = (phone, onSuccess, onFailure) => {
	GET(`Customer/Search?customerPhone=${phone}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		if (err.status === 404) {
			return true
		}
		else {
			onFailure && onFailure(err)
		}
	})
}

export const GetCustomerAdress = (customerId, onSuccess, onFailure) => {
	return GET(`Address/ListSimple?customerId=${customerId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}



export const ChangeCustomerStatus = (customer_id, status_id, onSuccess, onFailure) => {
	return POST(`Customer/status?customerId=${customer_id}&status=${status_id}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeCustomerType = (customer_id, type_id, onSuccess, onFailure) => {
	return POST(`Customer/type?customerId=${customer_id}&type=${type_id}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeCustomerPassword = (id, password, onSuccess, onFailure) => {
	return POST(`Customer/ChangePassword`, {
		customerId: id,
		Password: password,
		PasswordConfirm: password,
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetCustomerInfo = (id, onSuccess, onFailure) => {
	return GET(`Customer/PerdonalInfo?customerId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditCustomerInfo = (data, onSuccess, onFailure) => {
	return POST(`Customer/PerdonalInfo`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
//////////////////////////////////////////////////////////////// Addresses Service

export const GetAdress = (adressId, onSuccess, onFailure) => {
	return GET(`Address?addressId=${adressId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetNewAdressForCustomer = (customerId, onSuccess, onFailure) => {
	return GET(`Address/New?customerId=${customerId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddEditAdress = (data, onSuccess, onFailure) => {
	return POST('Address', data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteAdress = (adressId, onSuccess, onFailure) => {
	return DELETE(`Address?addressId=${adressId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const SetDefaultAdress = (adressId, onSuccess, onFailure) => {
	return POST(`Address/Default?addressId=${adressId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetGenderStatus = (onSuccess, onFailure) => {
	return GET(`Gender/Simple`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const NewCustomer = (data, onSuccess, onFailure) => {
	return POST(`Customer/New`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})

};

export const GetCustomerStatus = (languageId, onSuccess, onFailure) => {
	return GET(`Customer/TypesList${languageId ? `?languageId=${languageId}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const UpdateBalance = (data, onSuccess, onFailure) => {
	return POST(`Customer/UpdateBalance`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})

};


export const TestNotificationForCustomer = (customerId, onSuccess, onFailure) => {
	return POST(`Customer/notification/test?customerId=${customerId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})

};
//900