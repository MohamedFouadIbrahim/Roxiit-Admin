import React, { Component } from 'react'
import { View, TextInput, I18nManager, Platform } from 'react-native'
import Feather from 'react-native-vector-icons/Feather'
import { secondColor, mainTextColor } from '../../constants/Colors.js';
import { withLocalize } from 'react-localize-redux';
import { shadowStyle1, largePagePadding, pagePadding } from '../../constants/Style.js';
import { headerHeight } from '../../components/CustomHeader/index';
import CustomTouchable from '../CustomTouchable';

class SearchBar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			searchingFor_UI: '',
		}
		this.Visible = false
		this.searchUpdateInterval = this.props.interval || 600
	}

	onSubmitEditing = (text) => {
		const { onSubmitEditing } = this.props

		onSubmitEditing && onSubmitEditing(text)
	}

	triggerSearch = () => {
		if (this._throttleTimeout) {
			clearTimeout(this._throttleTimeout)
		}

		this.onSubmitEditing(this.state.searchingFor_UI)
	}

	onSearch = (text) => {
		if (this._throttleTimeout) {
			clearTimeout(this._throttleTimeout)
		}

		this.setState({ searchingFor_UI: text })

		this._throttleTimeout = setTimeout(
			() => {
				this.onSubmitEditing(text)
			}, this.searchUpdateInterval)
	}
	onXpress = () => {
		 if (this.state.searchingFor_UI == '' || !this.state.searchingFor_UI) {
			 const { onPressClose } = this.props //for hide Serach with preess X
			onPressClose && onPressClose()
		 } 
		 this.setState({ searchingFor_UI: '' }, () => {
		 	this.triggerSearch()
		 })
	}
	render() {
		const {
			visible = false,
		} = this.props;
		if (!visible) {
			return null
		}
		const {
			translate,
			autoFocus = true,
			hideShadow,
		} = this.props
		this.Visible = visible
		return (
			<View
				style={[{
					paddingVertical: 5,
					paddingLeft: largePagePadding,
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'white',
					height: headerHeight
				}, hideShadow ? {} : { ...shadowStyle1 }]}>
				<Feather
					name={"search"}
					size={16}
					color={"#6C7B8A"}
					style={{
						marginRight: 20,
					}}
				/>

				<TextInput
					style={{
						flex: 1,
						fontSize: 16,
						// color: '#3B3B4D',
						color: mainTextColor,
						textAlign: I18nManager.isRTL ? 'right' : 'left',
						paddingLeft: 0,
						marginLeft: 0,
						paddingVertical: Platform.OS == 'ios' ? 10 : 0
					}}
					ref={(input) => this.searchInputRef = input}
					autoFocus={autoFocus}
					value={this.state.searchingFor_UI}
					onChangeText={(text) => this.onSearch(text)}
					onSubmitEditing={() => { this.triggerSearch() }}
					returnKeyType='search'
					placeholder={translate('Search')}
					placeholderTextColor={'#6C7B8A'}
					underlineColorAndroid='transparent'
					selectionColor={secondColor} />

				<CustomTouchable 
					style={{
						paddingLeft: pagePadding,
						paddingRight: largePagePadding,
						height: '100%',
						justifyContent: 'center',
					}}
					onPress={this.onXpress} >
					<Feather
						name={"x"}
						size={16}
						color={"#6C7B8A"} />
				</CustomTouchable>
			</View>
		)
	}
}

export default withLocalize(SearchBar)