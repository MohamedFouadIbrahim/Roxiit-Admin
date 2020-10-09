import React, { Component } from 'react';
import {
	View,
	ActivityIndicator,
	StyleSheet
} from 'react-native';
import { connect } from 'react-redux'
import { mainColor } from '../../constants/Colors';


class LazyContainer extends Component {
	state = { isMounting: true };

	componentDidMount() {
		requestAnimationFrame(() => { this.setState({ isMounting: false }) });
	}

	componentDidUpdate() {
		const { setIsMounting } = this.props

		if (this.state.isMounting) {
			setIsMounting(true)
		}

		else {
			setIsMounting(false)
		}
	}
	render() {

		if (this.state.isMounting) {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						backgroundColor: 'white'
					}}>
					<ActivityIndicator size="large" color={mainColor} />
				</View>
			);
		}

		const {
			style,
			children,
			...props
		} = this.props;

		return (
			<View
				style={[{ backgroundColor: 'white' }, style]}
				{...props}
			>
				{children}
			</View>
		);
	}
};

const styles = StyleSheet.create({
	loadingContainer: {
		backgroundColor: 'white',
		justifyContent: 'center',
		flex: 1,
		alignItems: 'center',
	},
});


function mergeProps(stateProps, { dispatch }, ownProps) {

	const {
		actions: {
			setIsMounting,
		}
	} = require('../../redux/NetworkRedux');

	return {
		...ownProps,
		...stateProps,
		setIsMounting: (is_mounting) => setIsMounting(dispatch, is_mounting),
	};
}

export default connect(undefined, undefined, mergeProps)(LazyContainer)