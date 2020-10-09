import React from 'react';
import LinearGradient from 'react-native-linear-gradient';
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import ConfirmModal from '../ConfirmModal/index';
import CustomTouchable from '../CustomTouchable';

export default class DeleteButtom extends React.Component {
	constructor(props) {
		super(props)
		this.confirmRef = React.createRef();
	}
	render() {
		return (
			<CustomTouchable
			style={this.props.style}
				// {... this.props}
				onPress={() => {
					this.confirmRef.current.show()
				}}
			>
				<LinearGradient
					start={{ x: 0, y: 0 }}
					end={{ x: 1, y: 1 }}
					colors={['#E83F94', '#F54E5E']}
					style={{
						height: 50,
						width: 50,
						borderRadius: 25,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<FontAwesome
						name={"trash-o"}
						size={21}
						color={'white'}
						style={{
							marginLeft: -1,
							paddingLeft: 0,
						}} />
				</LinearGradient>
				<ConfirmModal
					ref={this.confirmRef}
					onConfirm={this.props.onPress}
				/>
			</CustomTouchable>
		)
	}
}