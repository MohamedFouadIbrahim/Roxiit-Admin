import { GET } from '../utils/Network';

export const getSessions = (onSuccess, onFailure) => {
	const target = 'Sessions'
	GET(target, res => {
		onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}