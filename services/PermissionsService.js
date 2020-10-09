import { GET } from '../utils/Network';

export const GetPermissionsSimple = (language_id, onSuccess, onFailure) => {
	GET(`Permissions/Simple${language_id ? `?languageId=${language_id}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}