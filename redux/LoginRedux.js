import { POST, DEFAULT_ROOT_URL_DEV, DEFAULT_ROOT_URL_DIST } from "../utils/Network";
import { types as CacheReduxTypes } from '../redux/CacheRedux.js';
import { types as InspectorReduxTypes } from '../redux/InspectorRedux.js';
import { types as ServerReduxTypes } from '../redux/ServerRedux.js';
import { types as PlacesReduxTypes } from '../redux/PlacesRedux.js';
import { types as BadgesReduxTypes } from '../redux/BadgesRedux.js';
import { types as CartReduxReduxTypes } from '../redux/CartRedux';
import { types as UserReduxTypes } from '../redux/UserRedux.js';
import { isDevelopmentMode } from "../constants/Config";
import { unsubscribeFromAllTopics } from "../utils/FCM";

export const types = {
	IS_LOGGED_IN: 'IS_LOGGED_IN',
	DID_NEVER_LOGIN: 'DID_NEVER_LOGIN',
	SET_MAIN_TOKEN: 'SET_MAIN_TOKEN',
	SET_SECONDARY_TOKEN: 'SET_SECONDARY_TOKEN',
	SET_USER_ID: 'SET_USER_ID',
	SET_USER_DATA: 'SET_USER_DATA',
	SET_HELLO_DATA: 'SET_HELLO_DATA',
	SET_COUNTRY_ID: 'SET_COUNTRY_ID',
	SET_CITY: 'SET_CITY',
	SET_CURRENCY: 'SET_CURRENCY',
	SET_IS_DRIVER: 'SET_IS_DRIVER',
	SET_MUTE_SOUND: 'SET_MUTE_SOUND'
};

function ClearCache(dispatch) {
	dispatch({ type: CacheReduxTypes.CLEAR_ALL_CACHED_DATA })
	dispatch({ type: CartReduxReduxTypes.UPDATE_CUSTOMER_INFO, customer_info: {} })
	dispatch({ type: InspectorReduxTypes.SET_IS_DEVELOPER, is_developer: false })
	dispatch({ type: InspectorReduxTypes.CLEAR_INSPECTOR_LOG })
	dispatch({ type: BadgesReduxTypes.CLEAR_BADGES_DATA })
	dispatch({ type: ServerReduxTypes.SET_ROOT_URL, root_url: isDevelopmentMode ? DEFAULT_ROOT_URL_DEV : DEFAULT_ROOT_URL_DIST })
	dispatch({ type: PlacesReduxTypes.SET_COUNTRIES, countries: [] })
	dispatch({ type: PlacesReduxTypes.SET_COUNTRIES_VERSION, countries_version: null })
	dispatch({ type: types.SET_MAIN_TOKEN, main_token: null })
	dispatch({ type: types.SET_SECONDARY_TOKEN, secondary_token: null })
	dispatch({ type: types.SET_USER_ID, userId: null })
	dispatch({ type: types.SET_USER_DATA, user_data: null })
	dispatch({ type: types.SET_HELLO_DATA, hello_data: null })
	dispatch({ type: types.SET_CURRENCY, Currency: null })
	dispatch({ type: UserReduxTypes.CLEAR_USER_PERMISSIONS })
	dispatch({ type: CartReduxReduxTypes.EMPTY_CART })
	dispatch({ type: types.SET_IS_DRIVER, isDriver: false })
	dispatch({ type: types.SET_MUTE_SOUND, mutePenddingSound: false })
	//Delete Pending Intervals
	clearInterval(global.penddingIntervalId)
	clearInterval(global.homePenddingIntervalId)
	global.penddingIntervalId = null
	global.interval = null
}

export const actions = {
	setIsLoggedIn: (dispatch, is_logged_in, do_not_call_api = false) => {
		if (!is_logged_in) {
			unsubscribeFromAllTopics(() => {
				if (!do_not_call_api) {
					POST('Signout', {}, res => {
						dispatch({ type: types.IS_LOGGED_IN, is_logged_in })
						ClearCache(dispatch)
					}, err => {
						dispatch({ type: types.IS_LOGGED_IN, is_logged_in })
						ClearCache(dispatch)
					});
				}
				else {
					dispatch({ type: types.IS_LOGGED_IN, is_logged_in })
					ClearCache(dispatch)
				}
			})

		}
		else {
			dispatch({ type: types.IS_LOGGED_IN, is_logged_in })
		}
	},
	setDidNeverLogin: (dispatch, did_never_log_in) => {
		dispatch({ type: types.DID_NEVER_LOGIN, did_never_log_in })
	},
	setMainToken: (dispatch, main_token) => {
		dispatch({ type: types.SET_MAIN_TOKEN, main_token })
	},
	setSecondaryToken: (dispatch, secondary_token) => {
		dispatch({ type: types.SET_SECONDARY_TOKEN, secondary_token })
	},
	setUserID: (dispatch, userId) => {
		dispatch({ type: types.SET_USER_ID, userId })
	},
	setUserData: (dispatch, user_data) => {
		dispatch({ type: types.SET_USER_DATA, user_data })
	},
	setHelloData: (dispatch, hello_data) => {
		dispatch({ type: types.SET_HELLO_DATA, hello_data })
	},
	setCountryId: (dispatch, country_id) => {
		dispatch({ type: types.SET_COUNTRY_ID, country_id })
	},
	setCity: (dispatch, city) => {
		dispatch({ type: types.SET_CITY, city })
	},
	setCurrency: (dispatch, Currency) => {
		dispatch({ type: types.SET_CURRENCY, Currency })
	},
	setIsDriver: (dispatch, isDriver) => {
		dispatch({ type: types.SET_IS_DRIVER, isDriver })
	},
	setMutePenddingSound: (dispatch, mutePenddingSound) => {
		dispatch({ type: types.SET_MUTE_SOUND, mutePenddingSound })
	}
};


const initialState = {
	did_never_log_in: true,
	is_logged_in: false,
	main_token: null,
	secondary_token: null,
	userId: null,
	user_data: null,
	country_id: null,
	Currency: { Id: 0, Name: ',,' },
	city: null,
	isDriver: false,
	mutePenddingSound: false
}

export const reducer = (state = initialState, action) => {
	const {
		is_logged_in,
		main_token,
		secondary_token,
		did_never_log_in,
		userId,
		user_data,
		hello_data,
		country_id,
		Currency,
		city,
		isDriver,
		mutePenddingSound
	} = action;

	switch (action.type) {
		case types.IS_LOGGED_IN:
			return { ...state, is_logged_in };
		case types.DID_NEVER_LOGIN:
			return { ...state, did_never_log_in };
		case types.SET_MAIN_TOKEN:
			return { ...state, main_token };
		case types.SET_SECONDARY_TOKEN:
			return { ...state, secondary_token };
		case types.SET_USER_ID:
			return { ...state, userId };
		case types.SET_USER_DATA:
			return { ...state, user_data };
		case types.SET_HELLO_DATA:
			return { ...state, hello_data };
		case types.SET_COUNTRY_ID:
			return { ...state, country_id };
		case types.SET_CITY:
			return { ...state, city };
		case types.SET_CURRENCY:
			return { ...state, Currency };
		case types.SET_IS_DRIVER:
			return { ...state, isDriver };
		case types.SET_MUTE_SOUND:
			return { ...state, mutePenddingSound };
		default:
			return state
	}
}