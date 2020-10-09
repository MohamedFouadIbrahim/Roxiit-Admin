import firebase from 'react-native-firebase';
import { store } from '../Store';
import { actions as TopicsReduxActions } from '../redux/TopicsRedux.js';

export const getFCMToken = (callback) => {
	firebase.messaging().getToken()
		.then(fcmToken => {
			if (fcmToken) {
				callback(fcmToken, true);
			} else {
				callback("ERROR: FCM TOKEN NOT FOUND", false)
			}
		});
}

export const subscribeToTopic = (topic) => {
	firebase.messaging().subscribeToTopic(topic);
}

export const unsubscribeFromTopic = (topic) => {
	firebase.messaging().unsubscribeFromTopic(topic);
}

export const unsubscribeFromAllTopics = (callback) => {
	const pushNsTopicsUnsubscribe = store.getState().topics.subscribed_topics

	if (pushNsTopicsUnsubscribe && pushNsTopicsUnsubscribe.length) {
		pushNsTopicsUnsubscribe.split(",").forEach(item => {
			unsubscribeFromTopic(item)
		})
	}

	TopicsReduxActions.setSubscribedTopics(store.dispatch, null)
	callback && callback()
}