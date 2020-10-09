import { GET } from '../utils/Network';

export const GetCountries = (onSuccess, onFailure) => {
	GET(`Countries`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetMyLocation = (onSuccess, onFailure) => {
	GET(`MyLocation`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}