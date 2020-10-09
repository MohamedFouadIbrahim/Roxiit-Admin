export const types = {
	SET_USER_PERMISSIONS: 'SET_USER_PERMISSIONS',
	CLEAR_USER_PERMISSIONS: 'CLEAR_USER_PERMISSIONS',
};

export const actions = {
	setUserPermissions: (dispatch, permissions) => {
		dispatch({ type: types.SET_USER_PERMISSIONS, permissions })
	},
	clearUserPermissions: (dispatch) => {
		dispatch({ type: types.CLEAR_USER_PERMISSIONS })
	},
};

const initialState = {
	permissions: [],
}

export const reducer = (state = initialState, action) => {
	const { permissions } = action;

	switch (action.type) {
		case types.SET_USER_PERMISSIONS:
			return { ...state, permissions };
		case types.CLEAR_USER_PERMISSIONS:
			return { ...state, permissions: [] };
		default: 
			return state
	}
}