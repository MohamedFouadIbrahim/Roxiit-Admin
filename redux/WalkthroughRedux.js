export const types = {
	VIEWED_WALKTHROUGH: 'VIEWED_WALKTHROUGH',
};

export const actions = {
	viewWalkthrough: (dispatch, viewedWalkthrough) => {
		dispatch({ type: types.VIEWED_WALKTHROUGH, viewedWalkthrough })
	},
};

const initialState = {
	viewedWalkthrough: false
}

export const reducer = (state = initialState, action) => {
	const { viewedWalkthrough } = action;
	switch (action.type) {
		case types.VIEWED_WALKTHROUGH:
		return { ...state, viewedWalkthrough };
		default: 
			return state
	}
}