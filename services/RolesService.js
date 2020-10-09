import { GET, DELETE, POST } from '../utils/Network';

export const GetRolesSimple = (onSuccess, onFailure) => {
	return GET(`Roles/Simple`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetRole = (id, language_id, onSuccess, onFailure) => {
	return GET(`Role?roleId=${id}${language_id ? `&languageId=${language_id}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteRole = (id, onSuccess, onFailure) => {
	DELETE(`Role?roleId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		if (onFailure) {
			return onFailure(err)
		}
	})
}

export const AddEditRole = (data, onSuccess, onFailure) => {
	return POST(`Role`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}