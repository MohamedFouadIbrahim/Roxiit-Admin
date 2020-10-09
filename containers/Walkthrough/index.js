import React, { Component } from 'react'
import { Platform, Image, View, I18nManager } from 'react-native'
import Ionicons from 'react-native-vector-icons/Ionicons'
import LazyContainer from '../../components/LazyContainer';
import LinearGradient from 'react-native-linear-gradient';
import Swiper from 'react-native-swiper';
import { screenWidth } from '../../constants/Metrics';
import actions from '../../redux/actions'
import { connect } from 'react-redux';
import { withLocalize } from "react-localize-redux";
import TranslatedText from '../../components/TranslatedText';
import TranslucentStatusBar from '../../components/TranslucentStatusBar';
import CustomTouchable from '../../components/CustomTouchable';
const imageWidth = screenWidth

class Walkthrough extends Component {
	constructor() {
		super();

		this.currIndex = 0
		this.maxIndex = 7

		this.state = {
			swiperData: [
				{
					id: 1,
					key: "WalkthroughBodyContent1",
					image: require('../../assets/images/walkthrough/1.png'),
				},
				{
					id: 2,
					key: "WalkthroughBodyContent2",
					image: require('../../assets/images/walkthrough/2.png'),
				},
				{
					id: 3,
					key: "WalkthroughBodyContent3",
					image: require('../../assets/images/walkthrough/3.png'),
				},
				{
					id: 4,
					key: "WalkthroughBodyContent4",
					image: require('../../assets/images/walkthrough/4.png'),
				},
				{
					id: 5,
					key: "WalkthroughBodyContent5",
					image: require('../../assets/images/walkthrough/5.png'),
				},
				{
					id: 6,
					key: "WalkthroughBodyContent6",
					image: require('../../assets/images/walkthrough/6.png'),
				},
				{
					id: 7,
					key: "WalkthroughBodyContent7",
					image: require('../../assets/images/walkthrough/7.png'),
				},
				{
					id: 8,
					key: "WalkthroughBodyContent8",
					image: require('../../assets/images/walkthrough/8.png'),
				},
			]
		};
	}

	render() {
		const { viewWalkthrough } = this.props
		return (
			<LazyContainer style={{ flex: 1 }}>
				<TranslucentStatusBar />

				<LinearGradient
					start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}
					colors={['#4048EF', '#5A7BEF']}
					style={{ flex: 1, paddingTop: screenWidth * 0.10, paddingBottom: screenWidth * 0.10 }}>
					<View
						style={{
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingHorizontal: 15,
						}}>
						<CustomTouchable
							onPress={() => viewWalkthrough(true)}
							style={{
								paddingHorizontal: 15,
							}}>
							<TranslatedText
								style={{ color: 'rgba(255,255,255,0.85)', }}
								text="skip"
								uppercase={false} />
						</CustomTouchable>
					</View>

					<Swiper
						ref={ref => this.swiperRef = ref}
						paginationStyle={{
							flexDirection: I18nManager.isRTL ? Platform.OS === 'ios' ? 'row' : 'row-reverse' : 'row',
							bottom: 7
						}}
						showsButtons={false}
						autoplay={false}
						loop={false}
						autoplayTimeout={5}
						onIndexChanged={(index) => {
							this.currIndex = index
						}}
						activeDot={
							<Image
								source={require("../../assets/images/walkthrough/dot_inside_circle.png")}
								style={{
									width: 15,
									height: 15,
									opacity: 0.9,

									marginLeft: 3,
									marginRight: 3,
									marginTop: 3,
									marginBottom: 3,
								}} />
						}
						dot={
							<View
								style={{
									backgroundColor: 'rgba(255,255,255,.3)',
									width: 8,
									height: 8,
									borderRadius: 4,
									marginLeft: 3,
									marginRight: 3,
									marginTop: 3,
									marginBottom: 3,
								}} />
						} >
						{
							this.state.swiperData.map((item, index) => {
								return (
									<View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-between', width: imageWidth }} key={index}>
										<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
											<Image
												style={{ width: imageWidth, }}
												source={item.image}
												resizeMode="contain" />
										</View>

										<TranslatedText
											style={{
												fontSize: 13,
												color: 'white',
												textAlign: 'center',
												marginHorizontal: screenWidth * 0.1,
												marginBottom: 70,
											}}
											text={item.key} />
									</View>
								)
							})
						}
					</Swiper>

					<View
						style={{
							position: 'absolute',
							bottom: 25,
							width: screenWidth,
							flexDirection: 'row',
							justifyContent: 'space-between',
							alignItems: 'center',
							paddingHorizontal: screenWidth * 0.05
						}}>
						<CustomTouchable
							onPress={() => {
								if (this.currIndex > 0) {
									this.swiperRef.scrollBy(-1, true)
								}
							}}
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								width: 46,
								height: 46,
								borderRadius: 23,
								backgroundColor: '#6883f5',
								alignSelf: 'center'
							}}>
							<Ionicons name='ios-arrow-round-back' color='white' size={25} />
						</CustomTouchable>

						<CustomTouchable
							onPress={() => {
								if (this.currIndex < this.maxIndex) {
									this.swiperRef.scrollBy(1, true)
								}
								if (this.currIndex == 3) {
									viewWalkthrough(true)
								}
							}}
							style={{
								justifyContent: 'center',
								alignItems: 'center',
								paddingVertical: 9,
								paddingHorizontal: 35,
								borderRadius: 30,
								backgroundColor: '#362c72',
								alignSelf: 'center'
							}}>
							<Ionicons name='ios-arrow-round-forward' color='white' size={25} />
						</CustomTouchable>
					</View>
				</LinearGradient>
			</LazyContainer>
		)
	}
}

function mergeProps(stateProps, { dispatch }, ownProps) {
	return {
		...ownProps,
		...stateProps,
		viewWalkthrough: (viewedWalkthrough) => actions.viewWalkthrough(dispatch, viewedWalkthrough),
	};
}

export default connect(undefined, undefined, mergeProps)(withLocalize(Walkthrough))