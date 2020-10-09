import React, { Component } from 'react'
import { View, Platform, StatusBar } from 'react-native'

export default class EmptyScreen extends Component {
	constructor(props) {
	super(props) ;
	this.setStatusBarStyle()
	}
	componentDidMount () {
		this.props.navigation.openDrawer();
	}



	componentWillUnmount() {
		this.resetStatusBarStyle()
	}

	setStatusBarStyle = () => {
		StatusBar.setBarStyle('dark-content', true);

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

	render () {
		return (
			<View />
		)
	}
} 