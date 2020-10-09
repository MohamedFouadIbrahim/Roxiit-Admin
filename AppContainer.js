import { NavigationContainer } from '@react-navigation/native';
import React, { Component } from 'react';
import { Platform, View } from 'react-native';
import firebase from 'react-native-firebase';
import Inspector from './containers/Inspector';
import Offline from './containers/Offline';
import FloodServerError from './containers/ServerRedirects/FloodServerError';
import InternalServerError from './containers/ServerRedirects/InternalServerError';
import NotFoundServerError from './containers/ServerRedirects/NotFoundServerError';
import Hello from './Hello';
import RootNavigation from './navigation/RootNavigation';
import { processPressedNotification } from './utils/Notifications';

class AppContainer extends Component {
	constructor() {
		super()

		this.state = {
			loadedHello: false,
		}

		this.didInitNotifications = false
		this._navigator = React.createRef();
	}

	componentDidUpdate() {
		if (!this.didInitNotifications) {
			if (this._navigator) {
				// Clear badge
				firebase.notifications().setBadge(0);

				// Check permission and listen for notifications
				this.checkFCMPermission()
				this.didInitNotifications = true
			}
		}
	}

	componentWillUnmount() {
		// Remove listeners

		this.notificationOpenedListener && this.notificationOpenedListener();
		this.notificationListener && this.notificationListener();
	}

	checkFCMPermission = () => {

		firebase.messaging().hasPermission()
			.then(enabled => {
				if (enabled) {
					// User has permissions
					this.listenForNotifications()
				}
				else {
					firebase.messaging().requestPermission()
						.then(() => {
							// User has authorised
							this.listenForNotifications()
						})
						.catch(() => {
						});
				}
			});
	}

	createFCMChannelForApp = () => {
		const channel = new firebase.notifications.Android.Channel('roxiit-admin-channel', 'RoxiitAdmin Channel', firebase.notifications.Android.Importance.Max).setDescription('RoxiitAdmin Application FCM Channel');
		firebase.notifications().android.createChannel(channel);
	}

	listenForNotifications = () => {
		this.createFCMChannelForApp();

		firebase.notifications().getInitialNotification()
			.then((notificationOpen/*: NotificationOpen*/) => {
				if (notificationOpen) {
					// App was opened by a notification
					// Get the action triggered by the notification being opened
					//const action = notificationOpen.action;
					// Get information about the notification that was opened
					const notification/*: Notification*/ = notificationOpen.notification;

					this.onPressNotification(notification)
				}
			});

		this.notificationListener = firebase.notifications().onNotification((notification/*: Notification*/) => {
			// Process your notification as required
			if (Platform.OS === 'android') {
				notification.android.setChannelId('roxiit-admin-channel');
				notification.android.setAutoCancel(true);
			}
			else {
				notification.setNotificationId(new Date().valueOf().toString())
					.setSound("default")

				notification.ios.badge = 1
			}
			firebase.notifications().displayNotification(notification)
		});

		this.notificationOpenedListener = firebase.notifications().onNotificationOpened((notificationOpen/*: NotificationOpen*/) => {
			// Get the action triggered by the notification being opened
			//const action = notificationOpen.action;
			// Get information about the notification that was opened
			const notification/*: Notification*/ = notificationOpen.notification;

			this.onPressNotification(notification)
		});
	}

	onPressNotification = (notification) => {
		processPressedNotification(notification, this._navigator, true)
	}

	renderContent = () => {
		if (this.state.loadedHello) {
			return (
				<View style={{ flex: 1 }}>
					<RootNavigation />

					<Inspector />

					<InternalServerError />
					<FloodServerError />
					<NotFoundServerError />

					<Offline />
				</View>
			)
		}
	}

	render() {
		return (
			<NavigationContainer ref={this._navigator}>
				<View style={{ flex: 1 }}>
					<Hello
						onFinish={() => { this.setState({ loadedHello: true }) }} />

					{this.renderContent()}
				</View>
			</NavigationContainer>
		)

	}
}

export default AppContainer