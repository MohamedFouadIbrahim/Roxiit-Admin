export const types = {
	SET_BADGES_DATA: 'SET_BADGES_DATA',
	CLEAR_BADGES_DATA: 'CLEAR_BADGES_DATA',
};

export const actions = {
	setBadgesData: (dispatch, badges_data) => {
		dispatch({ type: types.SET_BADGES_DATA, badges_data })
	},
	clearBadgesData: (dispatch) => {
		dispatch({ type: types.CLEAR_BADGES_DATA })
	},
};

const initialState = {
	badges_data: {
		Orders: 0,
		Inbox: 0,
		Questions: 0,
		Reviews: 0,
		Notifications: 0,
		Shipping: 0,
		Payments: 0,
		Analytics: 0,
		Settings: 0,
		Services: 0,
		Price_ask: 0,
	},
}

export const reducer = (state = initialState, action) => {
	const { badges_data } = action;

	switch (action.type) {
		case types.SET_BADGES_DATA:
			return { ...state, badges_data };
		case types.CLEAR_BADGES_DATA:
			return { ...state, ...initialState };
		default: 
			return state
	}
}