import { getTranslate } from 'react-localize-redux';
import { store } from '../Store';

export const ExternalTranslate = (message) => {
	const translate = getTranslate(store.getState().localize)
	return translate(message)
}