import { GET } from '../utils/Network';

export const GetRuntimeConfig = (onSuccess, onFailure) => {
	GET(`Config/RunTime`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}