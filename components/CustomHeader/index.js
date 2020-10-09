import React, { Component } from 'react';
import { View, StatusBar, I18nManager, Platform } from 'react-native'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { mainColor, thirdColor } from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons'
import TranslatedText from '../TranslatedText';
import { screenWidth } from '../../constants/Metrics';
import { CommonActions } from '@react-navigation/native';
import FontedText from '../FontedText';
import CustomTouchable from '../CustomTouchable';
import ProgressBar from '../ProgressBar';
import { connect } from 'react-redux';

export const headerIconSize = 20
export const secondHeaderIconSize = 28
export const headerButtonPadding = 5
export const headerFontSize = 16
export const headerLargeFontSize = 34

const defaultColor = 'white'
export const headerHeight = Platform.OS === 'ios' ? 56 : 56 // 56 + 25

class CustomHeader extends Component {

	renderLeftComponent = () => {
		const {
			color = defaultColor,
			leftComponent = "back",
			navigation,
		} = this.props

		if (leftComponent === "drawer") {
			return (
				<CustomTouchable
					onPress={() => { navigation.toggleDrawer() }}
					style={{
						justifyContent: 'center',
						alignItems: 'center',
						padding: 15,
					}}>
					<SimpleLineIcons name="menu" color={color} size={headerIconSize} />
				</CustomTouchable>
			)
		}
		else if (leftComponent === "back") {
			return (
				<CustomTouchable
					onPress={() => {
						this.props.navigation.dispatch(CommonActions.goBack())
						this.props.onBack && this.props.onBack()
					}}
					style={{
						flexDirection: 'row',
						justifyContent: 'center',
						alignItems: 'center',
						paddingHorizontal: 15,
						paddingVertical: 8,
					}}>
					<Ionicons
						name={`ios-arrow-round-${I18nManager.isRTL ? 'forward' : 'back'}`}
						size={secondHeaderIconSize}
						color={color} />
				</CustomTouchable>
			)
		}
		else if (leftComponent) {
			return leftComponent
		}
	}

	renderMiddleComponent = () => {
		const {
			middleComponent,
			title,
			subTitle,
			color = defaultColor,
		} = this.props

		if (middleComponent) {
			return middleComponent
		}
		else {
			return (
				<View
					style={{}}>
					<TranslatedText style={{ color: color, textAlign: 'center', }} text={title} />
					{subTitle && <FontedText style={{ color: color, textAlign: 'center', fontSize: 12, }}>{subTitle}</FontedText>}
				</View>
			)
		}
	}
	rightComponentContainerWidth(headerHeight, rightNumOfItems) { // this method for control the width of container rightComponenr header if you want add 3 icons 
		if (rightNumOfItems == 1) {
			return headerHeight
		} else if (rightNumOfItems == 2) {
			return headerHeight * 1.5
		} else if (rightNumOfItems == 3) {
			return headerHeight * 2
		} else {
			headerHeight
		}

	}
	render() {
		const {
			backgroundColor = mainColor,
			androidStatusBarColor = thirdColor,
			iosBarStyle = 'light-content',
			rightComponent,
			translucent = false,
			rightNumOfItems = 1,
			is_loading,
			is_mounting,
		} = this.props

		return ([
			<StatusBar
				key={0}
				backgroundColor={androidStatusBarColor}
				barStyle={iosBarStyle}
				translucent={translucent} />,
			<View
				pointerEvents="none"
				key={2}
				style={{
					position: 'absolute',
					width: '100%',
					height: headerHeight,
					zIndex: 1,
					//backgroundColor: 'red',
					justifyContent: 'center',
					alignItems: 'center',
				}}>
				{this.renderMiddleComponent()}
			</View>,
			<View
				key={1}
				style={{
					flexDirection: 'row',
					backgroundColor: backgroundColor,
					height: headerHeight,
					//backgroundColor: 'red',
					alignItems: "center",
					justifyContent: 'space-between',
					width: '100%',
				}}>
				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						width: headerHeight,
						height: headerHeight,
						zIndex: 2,
						//backgroundColor: 'red'
					}}>
					{this.renderLeftComponent()}
				</View>

				{/*
				<View
					style={{
						flex: 1,
						backgroundColor: 'red',
						justifyContent: 'center',
						alignItems: 'center',
					}}>
					{this.renderMiddleComponent()}
				</View>
				*/}

				<View
					style={{
						alignItems: 'center',
						justifyContent: 'center',
						width: this.rightComponentContainerWidth(headerHeight, rightNumOfItems),
						//backgroundColor: 'red',
						height: headerHeight,
						paddingRight: rightNumOfItems > 1 ? 10 : 0,
						zIndex: 2,
					}}>
					{rightComponent}
				</View>
				<View
					style={{
						zIndex: 2,
						position: 'absolute',
						bottom: 0,
						width: "100%"
					}}>
					{(is_loading || is_mounting) && <ProgressBar
						width="100%"
						size={30}
						isContinuous={true}
						height={3}
						borderRadius={0}
						borderWidth={0}
						indeterminateAnimationDuration={900}
					/>}
				</View>
			</View>
		])
	}
}


const mapStateToProps = ({
	network: { is_loading, is_mounting },
}) => ({
	is_loading,
	is_mounting,
})

export default connect(mapStateToProps)(CustomHeader)