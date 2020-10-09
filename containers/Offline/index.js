import React, { Component } from 'react'
// import NetInfo from "@react-native-community/netinfo";
import FloatingNotice from '../../components/FloatingNotice';
import { connect } from 'react-redux'

class Offline extends Component {
	// componentDidMount() {
	// 	NetInfo.isConnected.addEventListener('connectionChange', this.handleConnectivityChange);
	// }

	// componentWillUnmount() {
	// 	NetInfo.isConnected.removeEventListener('connectionChange', this.handleConnectivityChange);
	// }

	handleConnectivityChange = isConnected => {
		if (isConnected) {
			const { setIsConnected } = this.props
			setIsConnected(true)
		}
	}

	render() {
		return (
			<FloatingNotice
				isVisible={!this.props.is_connected}
				title="noInternet"
				info="offlineNotice"
				button="tryAgain"
				image={require('../../assets/images/offline/offline.png')} />
		)
	}
}

const mapStateToProps = ({
	network: { is_connected },
}) => ({
	is_connected,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setIsConnected,
		}
	} = require('../../redux/NetworkRedux.js');

	return {
		...ownProps,
		...stateProps,
		setIsConnected: (is_connected) => setIsConnected(dispatch, is_connected),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(Offline)