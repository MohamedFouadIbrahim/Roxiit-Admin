export const types = {
	ADD_CART_ITEM: 'ADD_CART_ITEM',
	REMOVE_CART_ITEM: 'REMOVE_CART_ITEM',
	UPDATE_CART_ITEM_OPTIONS: 'UPDATE_CART_ITEM_OPTIONS',
	INCREMENT_CART_ITEM_QUANTITY: 'INCREMENT_CART_ITEM_QUANTITY',
	DECREMENT_CART_ITEM_QUANTITY: 'DECREMENT_CART_ITEM_QUANTITY',
	EDIT_CART_ITEM_NOTE: 'EDIT_CART_ITEM_NOTE',
	EMPTY_CART: 'EMPTY_CART',
	REMOVE_CART_ITEM_BY_INDEX: 'REMOVE_CART_ITEM_BY_INDEX',
	UPDATE_CUSTOMER_INFO: 'UPDATE_CUSTOMER_INFO'
};

export const actions = {
	addCartItem: (dispatch, cart_item) => {
		dispatch({ type: types.ADD_CART_ITEM, cart_item });
	},
	removeCartItem: (dispatch, remove_id) => {
		dispatch({ type: types.REMOVE_CART_ITEM, remove_id })
	},
	removeCartItemByIndex: (dispatch, index) => {
		dispatch({ type: types.REMOVE_CART_ITEM_BY_INDEX, index })
	},
	updateCartItemOptions: (dispatch, change_id, options) => {
		dispatch({ type: types.UPDATE_CART_ITEM_OPTIONS, change_id, options })
	},
	incrementCartItemQuantity: (dispatch, change_id) => {
		dispatch({ type: types.INCREMENT_CART_ITEM_QUANTITY, change_id })
	},
	decrementCartItemQuantity: (dispatch, change_id) => {
		dispatch({ type: types.DECREMENT_CART_ITEM_QUANTITY, change_id })
	},
	editCartItemNote: (dispatch, change_id, note) => {
		dispatch({ type: types.EDIT_CART_ITEM_NOTE, change_id, note })
	},
	emptyCart: (dispatch) => {
		dispatch({ type: types.EMPTY_CART })
	},
	updateCustomerInfo: (dispatch, customer_info) => {
		dispatch({ type: types.UPDATE_CUSTOMER_INFO, customer_info })
	},
}


const initialState = {
	cart_items: [],
	customer_info: {}
}

export const reducer = (state = initialState, action) => {
	const {
		cart_item,
		remove_id,
		change_id,
		note,
		options,
		index,
		customer_info
	} = action;

	switch (action.type) {
		case types.ADD_CART_ITEM:
			return {
				...state,
				cart_items: [
					...state.cart_items,
					{
						...cart_item,
					}
				]
			};
		case types.REMOVE_CART_ITEM:
			return {
				...state,
				cart_items: state.cart_items.filter(item => item.Id !== remove_id),
			};
		case types.UPDATE_CART_ITEM_OPTIONS:
			return {
				...state,
				cart_items: state.cart_items.map(item => ({
					...item,
					Options: item.Id === change_id ? options : item.Options
				})),
			};
		case types.INCREMENT_CART_ITEM_QUANTITY:
			return {
				...state,
				cart_items: state.cart_items.map(item => ({
					...item,
					Qty: item.Id === change_id ? item.Qty + 1 : item.Qty
				})),
			};
		case types.DECREMENT_CART_ITEM_QUANTITY:
			return {
				...state,
				cart_items: state.cart_items.map(item => ({
					...item,
					Qty: item.Id === change_id ? item.Qty - 1 : item.Qty
				})),
			};
		case types.EDIT_CART_ITEM_NOTE:
			return {
				...state,
				cart_items: state.cart_items.map(item => ({
					...item,
					Note: item.Id === change_id ? note : item.Note
				})),
			};

		case types.REMOVE_CART_ITEM_BY_INDEX:
			return {
				...state,
				cart_items: [
					...state.cart_items.filter((item, currentIndex) => currentIndex != index)
				]
			}
		case types.UPDATE_CUSTOMER_INFO:
			return { ...state, customer_info }
		case types.EMPTY_CART:
			return {
				...state,
				...initialState,
				cart_items: []
			};
		default:
			return state
	}
}