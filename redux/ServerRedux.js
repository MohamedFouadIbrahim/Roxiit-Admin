export const types = {
	SET_ROOT_URL: 'SET_ROOT_URL',
};

export const actions = {
	setRootURL: (dispatch, root_url) => {
		dispatch({ type: types.SET_ROOT_URL, root_url })
	},
};

const initialState = {
	root_url: undefined,
}

export const reducer = (state = initialState, action) => {
	const { 
		root_url,
	} = action;

	switch (action.type) {
		case types.SET_ROOT_URL:
			return { ...state, root_url };
		default: 
			return state
	}
}