export const types = {
	LOG_NAVIGATION: 'LOG_NAVIGATION',
};

export const actions = {
	logNavigation: (dispatch, route_name) => {
		dispatch({ type: types.LOG_NAVIGATION, route_name })
	},
};

const initialState = {
	navigation_logs: [],
}

export const reducer = (state = initialState, action) => {
	const {
		route_name,
	} = action;

	switch (action.type) {
		case types.LOG_NAVIGATION:
			let updated_logs = state.navigation_logs

			updated_logs.unshift({
				key: `${updated_logs.length}`,
				route: route_name,
				date: new Date().toISOString(),
			})

			if (updated_logs.length > 10) {
				updated_logs.pop()
			}

			return { ...state, navigation_logs: updated_logs };
		default: 
			return state
	}
}