import { GET } from '../utils/Network';

export const GetData = (url, onSuccess, onFailure) => {
	return GET(url, res => {
		onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetPaginatedData = (url, params, skip, length, onSuccess, onFailure) => {
	return GetData(`${url}?${params ? `${params}&` : ''}skip=${skip}&length=${length}`, onSuccess, onFailure)
}

