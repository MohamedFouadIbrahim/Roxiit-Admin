import React, { Component } from 'react'
import { FlatList, Alert, Clipboard, View } from 'react-native'
import { connect } from 'react-redux'
import FontedText from '../../components/FontedText';
import SearchBar from '../../components/SearchBar';
import { screenWidth, screenHeight } from '../../constants/Metrics';
import { shadowStyle3 } from '../../constants/Style';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { mainTextColor } from '../../constants/Colors';
import CustomTouchable from '../../components/CustomTouchable';
class Inspector extends Component {
	constructor() {
		super()

		this.state = {
			filteredData: null,
		}
	}

	renderLogItem = ({ item, index }) => {
		const { message, data } = item

		return (
			<CustomTouchable
				onPress={() => {
					if (data) {
						const stringifiedData = JSON.stringify(data)

						Alert.alert(
							"",
							stringifiedData,
							[
								{ text: "DISMISS", onPress: () => { }, style: 'cancel' },
								{ text: "COPY TO CLIPBOARD", onPress: () => { Clipboard.setString(stringifiedData) }, },
							],
							{ cancelable: true }
						)
					}
				}}
				style={{
					paddingHorizontal: 20,
					paddingVertical: 15,
					flexDirection: 'row',
					alignItems: 'center',
					backgroundColor: 'white',
				}}>
				<FontedText style={{
					// color: '#3B3B4D'
					color: mainTextColor
				}}>{message}</FontedText>
			</CustomTouchable>
		)
	}

	renderSearch = () => {
		return (
			<SearchBar
				visible={true}
				hideShadow={true}
				autoFocus={false}
				interval={100}
				onSubmitEditing={(target_keyword) => {
					if (target_keyword) {
						const filteredData = this.props.inspector_logs.filter(item => item.message.toLowerCase().includes(target_keyword.toLowerCase()))
						this.setState({ filteredData })
					}
					else {
						this.setState({ filteredData: null })
					}
				}} />
		)
	}

	renderContent = () => {
		return (
			<FlatList
				data={this.state.filteredData ? this.state.filteredData : this.props.inspector_logs}
				renderItem={this.renderLogItem} />
		)
	}

	renderHeader = () => {
		return (
			<View
				style={{
					flexDirection: 'row',
					justifyContent: 'space-between',
					alignItems: 'center',
					paddingVertical: 10,
					paddingHorizontal: 15,
				}}>
				<CustomTouchable
					onPress={() => {
						const { setInspectorCollapsed } = this.props
						setInspectorCollapsed(true)
					}}
					style={{
						paddingVertical: 2,
						paddingHorizontal: 10,
					}}>
					<Ionicons name='ios-arrow-down' color='#888888' size={24} />
				</CustomTouchable>

				<CustomTouchable
					onPress={() => {
						const { setInspectorEnabled } = this.props
						setInspectorEnabled(false)
					}}
					style={{
						paddingVertical: 2,
						paddingHorizontal: 10,
					}}>
					<Ionicons name='md-close' color='#888888' size={24} />
				</CustomTouchable>
			</View>
		)
	}

	renderNetworkBenchmark = () => {
		const { last_request_time, last_query_count } = this.props

		if (last_request_time || last_query_count) {
			return (
				<View
					style={{
						position: 'absolute',
						top: 3,
						width: screenWidth / 2,
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							paddingVertical: 1,
							paddingHorizontal: 5,
							borderRadius: 10,
							backgroundColor: 'red',
						}}>
						<FontedText style={{ color: 'white', fontSize: 11, fontWeight: 'bold', }}>{last_request_time}{last_query_count ? `	•	${last_query_count}` : ''}</FontedText>
					</View>
				</View>
			)
		}
	}

	render() {
		if (this.props.is_inspector_enabled && this.props.is_developer) {
			if (this.props.is_inspector_collapsed) {
				return (
					<View
						style={{
							position: "absolute",
							bottom: 0,
							backgroundColor: 'white',
							width: screenWidth / 2,
							left: screenWidth / 4,
							zIndex: 1,
							borderTopRightRadius: 10,
							borderTopLeftRadius: 10,
							height: 25,
							...shadowStyle3,
						}}>
						<View
							style={{
								flexDirection: 'row',
								justifyContent: 'space-between',
								alignItems: 'center',
								paddingHorizontal: 15,
							}}>
							<CustomTouchable
								onPress={() => {
									const { setInspectorCollapsed } = this.props
									setInspectorCollapsed(false)
								}}
								style={{
								}}>
								<Ionicons name='ios-arrow-up' color='#888888' size={24} />
							</CustomTouchable>

							<CustomTouchable
								onPress={() => {
									const { setInspectorEnabled } = this.props
									setInspectorEnabled(false)
								}}
								style={{
								}}>
								<Ionicons name='md-close' color='#888888' size={24} />
							</CustomTouchable>



						</View>
						{this.renderNetworkBenchmark()}

					</View>
				)
			}
			else {
				return (
					<View
						style={{
							bottom: 0,
							backgroundColor: 'white',
							width: screenWidth,
							height: screenHeight,
							zIndex: 1,
							borderTopRightRadius: 25,
							borderTopLeftRadius: 25,
							...shadowStyle3,
						}}>
						{this.renderNetworkBenchmark()}
						{this.renderHeader()}
						{this.renderSearch()}
						{this.renderContent()}
					</View>
				)
			}
		}
		else {
			return null
		}
	}
}

const mapStateToProps = ({
	inspector: {
		is_developer,
		is_inspector_enabled,
		is_inspector_collapsed,
		inspector_logs,
		last_request_time,
		last_query_count,
	},
}) => ({
	is_developer,
	is_inspector_enabled,
	is_inspector_collapsed,
	inspector_logs,
	last_request_time,
	last_query_count,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setInspectorCollapsed,
			setInspectorEnabled,
		}
	} = require('../../redux/InspectorRedux.js');

	return {
		...ownProps,
		...stateProps,
		setInspectorCollapsed: (is_inspector_collapsed) => setInspectorCollapsed(dispatch, is_inspector_collapsed),
		setInspectorEnabled: (is_inspector_enabled) => setInspectorEnabled(dispatch, is_inspector_enabled),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(Inspector)