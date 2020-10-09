import { getTranslate } from 'react-localize-redux';
import { store } from '../Store';

export const formatDate = (date) => {
	if (!date) {
		return ''
	}
	const d = date.slice(0, 10).split('-');
	return d[2] + '/' + d[1] + '/' + d[0]
}

export const formatTime = (date) => {
	if (!date) {
		return ''
	}

	const translate = getTranslate(store.getState().localize)
	const time = date.split("T")[1]

	if (!time) {
		return ''
	}

	const t = time.split(":")
	const hr = parseInt(t[0])

	return `${(hr % 12) || 12}:${t[1]} ${hr < 12 ? translate("AM") : translate("PM")}`
}

export const addToDate = (date, days) => {
	date = new Date(date);
	date.setDate(date.getDate() + days);
	return date
}
export const convertTimeFromNumber = (number) => {
	var hours = Math.floor(number / 60);
	var minutes = number % 60;
	return hours + ":" + minutes;
}

export const removeFromDate = (date, days) => {
	date = new Date(date);
	date.setDate(date.getDate() - days);
	return date
}

export const dateToLocalTimezone = (date, revert) => {
	Date.prototype.addHours = function (h) {
		this.setTime(this.getTime() + (h * 60 * 60 * 1000));
		return this;
	}
	let offset = new Date().getTimezoneOffset() / 60
	offset = revert ? offset : (-1 * offset)
	date = date.addHours(offset)
	return date
}