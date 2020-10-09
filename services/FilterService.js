import { GET } from '../utils/Network';

export const getFilters = (params, onSuccess, onFailure) => {
	let getParams = []
	Object.entries(params).forEach(([key, value]) => getParams.push(`${key}=${value}`))

	return GET(`Filters?${getParams.join("&")}`,
		res => {
			let filteredData = res.data
			Object.keys(filteredData).forEach((key) => (filteredData[key] == null) && delete filteredData[key]);
			res.data = filteredData
			onSuccess && onSuccess(res)
		}, err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err)
		})
}