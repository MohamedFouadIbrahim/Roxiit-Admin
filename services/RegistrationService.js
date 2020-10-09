import { POST } from '../utils/Network';
import { getFCMToken } from '../utils/FCM';

export const LoginUser = (data, onSuccess, onFailure) => {
	getFCMToken((fcmToken, didSucceed) => {
		const target = 'AdminUser/Signin'
		const body = {
			...data,
			fcm: fcmToken,
		}

		POST(target, body, res => {
			// alert(JSON.stringify(res.data))
			if (didSucceed) {
				//firebase.messaging().subscribeToTopic('users');
				//firebase.messaging().subscribeToTopic('all');
			}

			onSuccess(res)
		}, err => {
			if (onFailure) {
				return onFailure(err)
			}
		}, false)
	})
}

export const PasswordForget = (email, onSuccess, onFailure) => {
	POST(`AdminUser/Password/Forget`, {
		AccountLogin: email,
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		// onFailure && 
		onFailure(err)
		return true
	})
}

export const PasswordValidate = (email, token, onSuccess, onFailure) => {
	POST(`AdminUser/Password/ValidateResetToken`, {
		AccountLogin: email,
		PasswordResetToken: token,
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const PasswordReset = (email, token, password, onSuccess, onFailure) => {
	POST(`AdminUser/Password/Reset`, {
		PasswordResetToken: token,
		AccountLogin: email,
		Password: password,
		PasswordConfirmation: password
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}