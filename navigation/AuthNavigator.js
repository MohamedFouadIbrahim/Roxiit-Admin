import React, { Component } from 'react';
import { connect } from 'react-redux';
import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native';
import Login from '../containers/Login';
import PasswordReset from '../containers/PasswordReset';
import PasswordValidation from '../containers/PasswordValidation';
import ChangePassword from '../containers/ChangePassword';
import Walkthrough from '../containers/Walkthrough'

const Auth_Navigator = createStackNavigator();

const Auth = () => (
	<Auth_Navigator.Navigator headerMode='none' >
		<Auth_Navigator.Screen name='Login' component={Login} />
		<Auth_Navigator.Screen name='PasswordReset' component={PasswordReset} />
		<Auth_Navigator.Screen name='PasswordValidation' component={PasswordValidation} />
		<Auth_Navigator.Screen name='ChangePassword' component={ChangePassword} />
	</Auth_Navigator.Navigator>
)


const WalkthroughStack_Navigator = createStackNavigator();

const WalkthroughStack = () => (
	<WalkthroughStack_Navigator.Navigator headerMode='none' >
		<WalkthroughStack_Navigator.Screen name='Walkthrough' component={Walkthrough} />
	</WalkthroughStack_Navigator.Navigator>
)

class AuthNavigator extends Component {
	render() {
		const { viewedWalkthrough } = this.props

		if (viewedWalkthrough) {
			return <Auth />
		}
		else {
			return <WalkthroughStack />
		}
	}
}

const mapStateToProps = ({
	login: { is_logged_in },
	walkthrough: { viewedWalkthrough }
}) => ({
	is_logged_in,
	viewedWalkthrough
})

export default connect(mapStateToProps)(AuthNavigator)