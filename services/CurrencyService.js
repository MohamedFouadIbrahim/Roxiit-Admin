import { DELETE, GET, POST, IMG } from '../utils/Network';

export const SelectCurrencies = (Ids, onSuccess, onFailure) => {
  return POST('Currency/Select', Ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const CurrencyOverwrite = ({ Id, OnUsdEqual }, onSuccess, onFailure) => {
	return POST('Currency/Overwrite', { Id, OnUsdEqual }, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}