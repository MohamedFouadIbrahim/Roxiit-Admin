export const types = {
	SET_DRIVER_STATUS_LIST: 'SET_DRIVER_STATUS_LIST',
};

export const actions = {
	setDriverStatusList: (dispatch, driver_status_list) => {
		dispatch({ type: types.SET_DRIVER_STATUS_LIST, driver_status_list })
	},
};

const initialState = {
	driver_status_list: [],
}

export const reducer = (state = initialState, action) => {
	const { driver_status_list } = action;

	switch (action.type) {
		case types.SET_DRIVER_STATUS_LIST:
			return { ...state, driver_status_list };
		default: 
			return state
	}
}