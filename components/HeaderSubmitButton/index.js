import React, { PureComponent } from 'react'
import { View, ActivityIndicator } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { headerButtonPadding } from '../CustomHeader';
import { withLocalize } from 'react-localize-redux';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../CustomTouchable';

class HeaderSubmitButton extends PureComponent {
	componentDidUpdate(prevProps) {
		if (this.props.didSucceed !== prevProps.didSucceed && this.props.didSucceed) {
			LongToast('DoneSuccessfully')
		}
	}

	render() {
		const { style, color, isLoading, ...otherProps } = this.props

		if (isLoading) {
			return (
				<View
					style={[{
						justifyContent: 'center',
						alignItems: 'center',
					}, style]}>
					<ActivityIndicator size="small" color={color ? color : 'white'} />
				</View>
			)
		}
		else {
			return (
				<View
					style={{
						flexDirection: 'row',
						paddingVertical: 9,
					}}>
					<CustomTouchable
						style={[{
							justifyContent: 'center',
							alignItems: 'center',
							padding: headerButtonPadding,
							flex: 1,
						}, style]}
						{...otherProps}>
						<Ionicons
							name={`md-checkmark`}
							size={18}
							color={color ? color : 'white'} />
					</CustomTouchable>
				</View>
			)
		}
	}
}

export default withLocalize(HeaderSubmitButton)