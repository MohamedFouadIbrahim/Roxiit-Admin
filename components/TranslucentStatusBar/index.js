import { Component } from 'react'
import { StatusBar, Platform } from 'react-native'

export default class TranslucentStatusBar extends Component {
	componentDidMount() {
		setTimeout(() => {
			this.setStatusBarStyle()
		}, 5);
	}

	componentWillUnmount() {
		this.resetStatusBarStyle()
	}

	setStatusBarStyle = () => {
		StatusBar.setBarStyle('light-content', true);

		if (Platform.OS === 'android') {
			StatusBar.setBackgroundColor('transparent', true);
			StatusBar.setTranslucent(true);
		}
	}

	resetStatusBarStyle = () => {
		if (Platform.OS === 'android') {
			StatusBar.setTranslucent(false);
		}
	}

	render() {
		return (
			null
		)
	}
}