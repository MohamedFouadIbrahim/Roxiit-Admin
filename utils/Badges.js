import { types } from '../redux/BadgesRedux.js';
import { store } from '../Store';

export const readBadgesFromResponseHeader = (response_header) => {
	const badges_header = response_header.badges

	if (badges_header) {
		// const split_data = badges_header.split(",").map(Number);
		const badges_header_JsonFormat = JSON.parse(response_header.badges)

		const badges_data = {
			Orders: badges_header_JsonFormat.order,
			Products: badges_header_JsonFormat.product,
			Inbox: badges_header_JsonFormat.inbox,
			Questions: badges_header_JsonFormat.question,
			Reviews: badges_header_JsonFormat.review,
			Notifications: badges_header_JsonFormat.notification,
			Shipping: badges_header_JsonFormat.shipping,
			Payment: badges_header_JsonFormat.payment,
			Analytics: badges_header_JsonFormat.analytic,
			Settings: badges_header_JsonFormat.setting,
			Services: badges_header_JsonFormat.service,
			Price_ask: badges_header_JsonFormat.price_ask,
			inboxordr: badges_header_JsonFormat.inboxOrdr,
			inboxCustmr: badges_header_JsonFormat.inboxCustmr,
			inboxUsr: badges_header_JsonFormat.inboxUsr
		}

		store.dispatch({ type: types.SET_BADGES_DATA, badges_data })
	}
}