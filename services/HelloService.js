import { GET } from '../utils/Network';

export const GetHello = (onSuccess, onFailure) => {
	GET(`Hello`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetGoLiveScore = (onSuccess, onFailure) => {
	GET(`GoLiveScore`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
