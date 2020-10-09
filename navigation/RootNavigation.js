import React, { Component, Fragment } from 'react';
import { SafeAreaView } from 'react-native'
import { connect } from 'react-redux';
import withForwardedRef from 'react-with-forwarded-ref'
import AppNavigator from './AppNavigator';
import AuthNavigator from './AuthNavigator';
import { withDeepLinking } from '../utils/DeepLinking';

class RootNavigation extends Component {
	render() {
		const { is_logged_in, forwardedRef } = this.props
		
		if (is_logged_in) {
			return (
				<Fragment>
					<SafeAreaView style={{ flex:0, backgroundColor: "#111111" }} />
					<SafeAreaView style={{ flex:1, backgroundColor: '#FFF' }}>
						<AppNavigator 
							ref={forwardedRef} />
					</SafeAreaView>
				</Fragment>
			)
		}
		else {
			return <AuthNavigator />
		}
	}
}

const mapStateToProps = ({
	login: { is_logged_in },
}) => ({
	is_logged_in
})

export default connect(mapStateToProps, undefined, undefined, { forwardRef: true })(withForwardedRef(withDeepLinking(RootNavigation)))