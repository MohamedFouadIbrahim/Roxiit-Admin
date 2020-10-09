import React from 'react';
import {
	ScrollView,
	View,
	Linking,
	ImageBackground,
	Platform,
	I18nManager,
	SafeAreaView,
	FlatList
} from 'react-native'
import { connect } from 'react-redux'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { mainColor, redColor, secondColor, mainTextColor } from '../constants/Colors';
import { pagePadding, largeBorderRadius, largePagePadding } from '../constants/Style';
import CircularImage from '../components/CircularImage';
// import {  DrawerItems } from 'react-navigation';
import { DrawerItemList } from '@react-navigation/drawer';
import { withLocalize } from 'react-localize-redux';
import FontedText from '../components/FontedText/index';
import DeviceInfo from 'react-native-device-info'
import { ChangeDriverStatus } from '../services/OrdersService';
import Ionicons from 'react-native-vector-icons/Ionicons'
import CustomSelector from '../components/CustomSelector';
import { IsScreenPermitted } from '../utils/Permissions';
import CustomTouchable from '../components/CustomTouchable';
import RoxiitRefrence from '../containers/RoxiitRefrence';
import { getDriverTextColor, getDriverBgColor } from '../utils/Drivers';
import * as Progress from 'react-native-progress';
import { StackActions, CommonActions } from '@react-navigation/native';

const CircularBar = ({ progress, style }) => (
	<Progress.Circle
		color={secondColor}
		size={30}
		style={style}
		progress={progress * 0.01}
		thickness={1.5}
		borderWidth={0.5}
		showsText={true}
		textStyle={{
			fontSize: 9
		}}
		formatText={() => `${progress}%`}
	/>
)

class CustomDrawerContent extends React.Component {
	constructor(props) {
		super(props)

		this.statusSelectorRef = React.createRef();

		const {
			permissions,
			userId
		} = this.props

		let { items } = this.props

		if (!permissions.includes(1)) {
			items = items.filter((item, index) => index === 0 || IsScreenPermitted(item.name.replace("_Drawer", "")))
		}

		const {
			GoliveScore
		} = this.props.hello_data


		if (GoliveScore >= 100) {
			items = items.filter(item => item.name != 'GoLivee_Drawer')
		}

		// We Will Hide share App For 11@tashfier.com

		if (userId == 1) {
			items = items.filter(item => item.name != 'MyApp_Drawer')
		}

		this.items = items
	}

	renderAdditinalComponentToDrawerItem = (route) => {

		const {
			GoliveScore
		} = this.props.hello_data

		const target = route.replace("_Drawer", "")

		if (target == 'GoLivee') {

			return (
				<CircularBar progress={GoliveScore} />
			)
		}

	}

	onDrawerItemPress = (route) => {
		const {
			navigation,
			setIsLoggedIn
		} = this.props


		const target = route.replace("_Drawer", "")

		// Close drawer first to fix a delay bug

		navigation.closeDrawer()

		if (target == 'Logout') {
			setIsLoggedIn(false)
			return;
		}


		else if (target == 'Home') {
			//reset routes/navigation to Home
			navigation.dispatch(
				CommonActions.reset({
					index: 1,
					routes: [
						{ name: 'Home' },
					],
				})
			);

			return;
		}

		// Then navigate
		setTimeout(() => {
			navigation.navigate(target)
		}, 0);

	}

	renderDrawerItem = ({ item, index }) => {

		const {
			descriptors
		} = this.props

		const {
			key,
			name
		} = item

		const {
			drawerIcon,
			drawerLabel,
		} = descriptors[key].options

		return (
			<CustomTouchable
				onPress={() => {
					this.onDrawerItemPress(name)
				}}

				style={{
					flex: 1,
					flexDirection: 'row',
					alignItems: 'center',
					paddingVertical: largePagePadding,
					// borderBottomWidth: 1,
					// borderBottomColor: '#d6d6d6',
					marginHorizontal: largePagePadding
				}}>
				{drawerIcon()}

				<View
					style={{
						flex: 1,
						flexDirection: 'row',
						alignItems: 'center',
						justifyContent: 'space-between'
					}}>

					<FontedText
						style={{
							marginLeft: largePagePadding,
							fontSize: 14,
							color: mainTextColor
						}}
					>
						{drawerLabel}
					</FontedText>

					{this.renderAdditinalComponentToDrawerItem(name)}
					<SimpleLineIcons name={I18nManager.isRTL ? 'arrow-left' : 'arrow-right'} />
				</View>

			</CustomTouchable>
		)
	}

	renderDrawerItems = () => {
		return (
			<FlatList
				data={this.items}
				renderItem={this.renderDrawerItem}
				// keyExtractor={({ item, index }) => String(index)}
				keyExtractor={(item, index) => String(index)}
			/>
		)
	}
	render() {
		const { is_developer, user_data, translate, setIsLoggedIn, hello_data, driver_status_list, ...restProps } = this.props
		const { FirstName, SecondeName, LoginAccount, Image: { ImageUrl }, DriverStatus, Id: UserID } = user_data
		const { StoreName, StoreLogo } = hello_data
		const { items } = this

		return (
			<>
				<ScrollView>
					<SafeAreaView
						style={{ backgroundColor: 'white', flex: 1, marginBottom: 40 }}
						forceInset={{ top: Platform.OS == 'ios' ? 'never' : 'always', horizontal: 'never', }}>
						<View style={{ justifyContent: 'center', alignItems: 'center', }}>
							<ImageBackground
								source={require('../assets/images/drawer/drawer_top_image.jpg')}
								resizeMode={"cover"}
								style={{
									flex: 1,
									height: 150,
									width: '100%',
									backgroundColor: mainColor,
								}}>
								<View
									style={{
										position: 'absolute',
										top: pagePadding,
										paddingHorizontal: 20,
										width: '100%',
										flexDirection: 'row',
										justifyContent: 'space-between',
									}}>
									<View
										style={{
										}}>
										<FontedText
											style={{
												color: 'white',
												fontSize: 9,
											}}>v {DeviceInfo.getVersion()}</FontedText>
									</View>

									<View
										style={{
											flexDirection: 'row',
											alignItems: 'center',
										}}>
										{is_developer && <CustomTouchable
											onPress={() => {
												const { setInspectorEnabled } = this.props
												setInspectorEnabled(true)
											}}
											style={{
												padding: 5,
												marginRight: 10,
											}}>
											<SimpleLineIcons name='wrench' color={'white'} size={22} />
										</CustomTouchable>}
									</View>
								</View>

								<CircularImage
									style={{
										position: 'absolute',
										bottom: 40,
										left: 20,
									}}
									source={{ uri: ImageUrl }}
									size={60} />

								<CircularImage
									style={{
										position: 'absolute',
										bottom: 40,
										left: 90,
									}}
									source={{ uri: StoreLogo.ImageUrl }}
									size={60} />
								<FontedText style={{
									position: 'absolute',
									bottom: 10,
									left: 22,
									color: '#d6d6d6'
								}} >
									{StoreName}
								</FontedText>

							</ImageBackground>

							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('UserHome', {
										Id: UserID,
									});
								}}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									paddingHorizontal: 20,
									paddingVertical: 15,
									borderBottomColor: '#d6d6d6',
									borderBottomWidth: 1,
								}}>
								<View
									style={{
										flex: 1,
										justifyContent: 'center',
									}}>
									<FontedText
										numberOfLines={1}
										ellipsizeMode="middle"
										style={{ color: '#333333' }}>{FirstName} {SecondeName}</FontedText>
									<FontedText
										numberOfLines={1}
										ellipsizeMode="middle"
										style={{ color: '#808080' }}>{LoginAccount}
									</FontedText>
								</View>

								<Ionicons
									name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
									size={18}
									color={'#333333'}
									style={{
										marginLeft: 15,
									}} />
							</CustomTouchable>

							{DriverStatus.Id !== 1 && <View
								style={{
									justifyContent: 'center',
									paddingVertical: 15,
									paddingHorizontal: 20,
									borderBottomColor: '#d6d6d6',
									borderBottomWidth: 1,
									width: '100%',
								}}>
								<CustomTouchable
									onPress={() => {
										this.statusSelectorRef.current.show()
									}}
									style={{
										flexDirection: 'row',
										justifyContent: 'center',
										alignItems: 'center',
										paddingHorizontal: 10,
										paddingVertical: 6,
										backgroundColor: getDriverBgColor(DriverStatus.Id),
										borderRadius: largeBorderRadius,
										alignSelf: 'flex-start',
									}}>
									<FontedText style={{ color: getDriverTextColor(DriverStatus.Id), fontSize: 11, }}>{DriverStatus.Name}</FontedText>

									<Ionicons
										name={"md-arrow-dropdown"}
										size={18}
										color={'white'}
										style={{
											marginLeft: 5,
										}} />
								</CustomTouchable>
							</View>}
						</View>

						{this.renderDrawerItems()}

						{driver_status_list && <CustomSelector
							ref={this.statusSelectorRef}
							options={driver_status_list.map(item => item.Name)}
							onSelect={(index) => {
								const item = driver_status_list[index]

								this.props.setUserData({
									...this.props.user_data,
									DriverStatus: item,
								})

								ChangeDriverStatus(UserID, item.Id)
							}}
							onDismiss={() => { }}
						/>}
					</SafeAreaView>
				</ScrollView>

				<View style={{
					position: 'absolute',
					bottom: 1,
					backgroundColor: 'white',
					flex: 1,
					paddingLeft: 50
				}} >
					<RoxiitRefrence />
				</View>

			</>
		);
	}
}
const mapStateToProps = ({
	inspector: {
		is_developer,
		is_inspector_enabled,
	},
	login: {
		user_data,
		hello_data,
		userId
	},
	misc: {
		driver_status_list,
	},
	user: {
		permissions,
	},
}) => ({
	is_developer,
	is_inspector_enabled,
	user_data,
	hello_data,
	driver_status_list,
	permissions,
	userId
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setInspectorEnabled,
		}
	} = require('../redux/InspectorRedux.js');

	const {
		actions: {
			setIsLoggedIn,
			setUserData,
		}
	} = require('../redux/LoginRedux.js');

	return {
		...ownProps,
		...stateProps,
		setInspectorEnabled: (is_inspector_enabled) => setInspectorEnabled(dispatch, is_inspector_enabled),
		setIsLoggedIn: (is_logged_in) => setIsLoggedIn(dispatch, is_logged_in),
		setUserData: (user_data) => setUserData(dispatch, user_data),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(withLocalize(CustomDrawerContent))