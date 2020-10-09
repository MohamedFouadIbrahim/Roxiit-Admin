import { createDeepLinkingHandler } from 'react-native-deep-link';
import { actions as LoginReduxActions } from '../redux/LoginRedux.js';
import { store } from '../Store.js';
import { EventRegister } from 'react-native-event-listeners'
import { LongToast } from './Toast.js';

const handleAutoLogin = ({ params: { email, password, mode } }) => () => {
	if (store.getState().login.is_logged_in) {
		LoginReduxActions.setIsLoggedIn(store.dispatch, false, false)
	}

	LongToast("PleaseWait")

	setTimeout(() => {
		EventRegister.emit('AutoLogin', {
			email,
			password,
			dev: mode === "dev" ? true : false,
		})
	}, 1000);
}

export const withDeepLinking = createDeepLinkingHandler([{
	name: 'roxiitadmin:',
	routes: [{
		expression: '/autologin/:email/password/:password/mode/:mode',
		callback: handleAutoLogin
	}]
}])