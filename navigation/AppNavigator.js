import React, { Component } from 'react';
import { Platform, I18nManager } from 'react-native'
import { createStackNavigator } from '@react-navigation/stack'
import { createDrawerNavigator } from '@react-navigation/drawer'
import withForwardedRef from 'react-with-forwarded-ref'
import { connect } from 'react-redux';
import { getActiveRouteName } from '../utils/Navigation';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Entypo from 'react-native-vector-icons/Entypo'
import Feather from 'react-native-vector-icons/Feather'
import MainTabNavigator from './MainTabNavigator';
// import CustomDrawerContent from './CustomDrawerContent';
// import TextEditor from '../containers/TextEditor';
import Categories from '../containers/Categories'
import Category from '../containers/Categories/Category'
import newCategory from '../containers/Categories/newCategory'
import CategoriesFilter from '../containers/Categories/CategoriesFilter'
import Users from '../containers/Users';
import User from '../containers/User';
import UserPersonalInfo from '../containers/User/UserPersonalInfo';
import UserChangePassword from '../containers/User/UserChangePassword';
import UserNotificationPreferences from '../containers/User/UserNotificationPreferences';
import UserPermissions from '../containers/User/UserPermissions';
// import UserLoginHistory from '../containers/User/UserLoginHistory';
import AddUser from '../containers/AddUser';
import MyApp from '../containers/MyApp';
import Discounts from '../containers/Discounts';
import DiscountsFilters from '../containers/Discounts/DiscountsFilters';
import EntitySelector from '../containers/EntitySelector';
import Discount from '../containers/Discount';
import { redColor, mainTextColor } from '../constants/Colors';
import GoLiveDetails from '../containers/GoLive/Details';
import { color } from 'react-native-reanimated';
import { ExternalTranslate } from '../utils/Translate';
import CustomDrawerContent from './CustomDrawerContent';
import PushNotification from '../containers/PushNotification';
import PushNotifications from '../containers/PushNotifications';
import PushNotificationHistory from '../containers/PushNotification/PushNotificationHistory';

// const AppUrl_Stack_Navigator = createStackNavigator()

// const AppUrl_Stack = () => (
// 	<AppUrl_Stack_Navigator.Navigator headerMode='none' >
// 		<AppUrl_Stack_Navigator.Screen name='MyApp' component={MyApp} />
// 	</AppUrl_Stack_Navigator.Navigator>
// )

// const GoLive_Stack_Navigator = createStackNavigator()

// const GoLive_Stack = () => (
// 	<GoLive_Stack_Navigator.Navigator headerMode='none' >
// 		<GoLive_Stack_Navigator.Screen name='GoLiveDetails' component={GoLiveDetails} />
// 	</GoLive_Stack_Navigator.Navigator>
// )


// const Users_Stack_Navigator = createStackNavigator()

// const Users_Stack = () => (
// 	<Users_Stack_Navigator.Navigator headerMode='none' >
// 		<Users_Stack_Navigator.Screen name='Users' component={Users} />
// 		<Users_Stack_Navigator.Screen name='UserHome' component={User} />
// 		<Users_Stack_Navigator.Screen name='UserPersonalInfo' component={UserPersonalInfo} />
// 		<Users_Stack_Navigator.Screen name='UserChangePassword' component={UserChangePassword} />
// 		<Users_Stack_Navigator.Screen name='UserNotificationPreferences' component={UserNotificationPreferences} />
// 		<Users_Stack_Navigator.Screen name='UserPermissions' component={UserPermissions} />
// 		<Users_Stack_Navigator.Screen name='AddUser' component={AddUser} />
// 		<Users_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
// 	</Users_Stack_Navigator.Navigator>
// )

// const Discounts_Stack_Navigator = createStackNavigator()

// const Discounts_Stack = () => (
// 	<Discounts_Stack_Navigator.Navigator headerMode='none' >
// 		<Discounts_Stack_Navigator.Screen name='Discounts' component={Discounts} />
// 		<Discounts_Stack_Navigator.Screen name='Discount' component={Discount} />
// 		<Discounts_Stack_Navigator.Screen name='DiscountsFilters' component={DiscountsFilters} />
// 		<Discounts_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
// 	</Discounts_Stack_Navigator.Navigator>
// )


// const CategoriesStack_Navigator = createStackNavigator()

// const CategoriesStack = () => (
// 	<CategoriesStack_Navigator.Navigator headerMode='none' >
// 		<CategoriesStack_Navigator.Screen name='Categories' component={Categories} />
// 		<CategoriesStack_Navigator.Screen name='CategoriesScreen' component={Categories} />
// 		<CategoriesStack_Navigator.Screen name='CategoryScreen' component={Category} />
// 		<CategoriesStack_Navigator.Screen name='newCategory' component={newCategory} />
// 		<CategoriesStack_Navigator.Screen name='CategoriesFilter' component={CategoriesFilter} />
// 	</CategoriesStack_Navigator.Navigator>
// )


// const PushNotification_Stack_Navigator = createStackNavigator();

// const PushNotification_Stack = () => (
// 	<PushNotification_Stack_Navigator.Navigator headerMode='none' >
// 		<PushNotification_Stack_Navigator.Screen name='PushNotifications' component={PushNotifications} />
// 		<PushNotification_Stack_Navigator.Screen name='PushNotification' component={PushNotification} />
// 		<PushNotification_Stack_Navigator.Screen name='PushNotificationHistory' component={PushNotificationHistory} />
// 		<PushNotification_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />

// 	</PushNotification_Stack_Navigator.Navigator>
// )

const DrawerNavigator = createDrawerNavigator()

const renderScreens = () => {
	return Object.keys(appDrawerNavigatorItems).map((key, index) => {
		const item = appDrawerNavigatorItems[key]
		return (
			<DrawerNavigator.Screen
				key={index}
				name={item.name}
				component={item.component}
				options={{
					drawerIcon: () => item.icon(mainTextColor),
					drawerLabel: ExternalTranslate(item.label)
				}}
			/>
		)
	})
}

const Drawer = (props) => (
	<DrawerNavigator.Navigator
		initialRouteName='Home_Drawer'
		drawerPosition={Platform.OS == 'ios' ? 'left' : I18nManager.isRTL ? 'right' : 'left'}
		drawerContentOptions={{
			activeBackgroundColor: 'transparent',
			activeTintColor: '#444444',
			inactiveTintColor: '#444444',
			labelStyle: {
				fontWeight: 'normal',
			}
		}}
		drawerContent={(props) => <CustomDrawerContent {...props} items={props.state.routes} />}
	>
		{renderScreens()}
	</DrawerNavigator.Navigator>
)

export const appDrawerNavigatorItems = {
	/*
		- The route key must end with "_Drawer"
		- Route names are auto translated after auto removal of "_Drawer"
		- So for example if you're adding a route "Users_Drawer", you have 
		to make sure a translation for "Users" exists in constants\Languages.js
	*/
	"Home_Drawer": {
		name: "Home_Drawer",
		label: "Home",
		icon: (color) => <SimpleLineIcons name='home' color={color} size={20} />,
		component: MainTabNavigator
	},
	"Users_Drawer": {
		name: "Users_Drawer",
		label: "Users",
		icon: (color) => <SimpleLineIcons name='people' color={color} size={20} />,
		component: MainTabNavigator
	},
	"Notifications_Drawer": {
		name: "Notifications_Drawer",
		label: "Notifications",
		icon: (color) => <SimpleLineIcons name='bell' color={color} size={20} />,
		component: MainTabNavigator
	},
	"Discounts_Drawer": {
		name: "Discounts_Drawer",
		label: "Discounts",
		icon: (color) => <Feather name='percent' color={color} size={20} />,
		component: MainTabNavigator
	},
	"Categories_Drawer": {
		name: "Categories_Drawer",
		label: "Categories",
		icon: (color) => <SimpleLineIcons name='layers' color={color} size={20} />,
		component: MainTabNavigator
	},
	"GoLivee_Drawer": {
		name: "GoLivee_Drawer",
		label: "GoLivee",
		icon: (color) => <Entypo color={color} size={20} name={Platform.OS == 'android' ? 'google-play' : 'app-store'} />,
		component: MainTabNavigator
	},
	"MyApp_Drawer": {
		name: "MyApp_Drawer",
		label: "MyApp",
		icon: (color) => <SimpleLineIcons name='link' color={color} size={20} />,
		component: MainTabNavigator
	},
	"Logout_Drawer": {
		name: "Logout_Drawer",
		label: "Logout",
		icon: (color) => <SimpleLineIcons name='logout' color={redColor} size={20} />,
		component: MainTabNavigator
	},
}

class AppNavigator extends Component {
	render() {

		return (
			<Drawer
				ref={this.props.forwardedRef}
				onNavigationStateChange={(prevState, currentState, action) => {
					const currentScreen = getActiveRouteName(currentState);
					const prevScreen = getActiveRouteName(prevState);

					if (prevScreen !== currentScreen) {
						let getParams = []

						if (action && action.params) {
							Object.entries(action.params).forEach(([key, value]) => {
								if (typeof value !== 'function') {
									getParams.push(`${key}=${value}`)
								}
							})
						}

						const { logNavigation } = this.props
						logNavigation(`${currentScreen}${getParams.length ? `?${getParams.join("&")}` : ''}`)
					}
				}} />
		)
	}
}

const mapStateToProps = ({
	login: {
		userId
	}
}) => ({
	userId
})
function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			logNavigation,
		}
	} = require('../redux/NavigationRedux.js');

	return {
		...ownProps,
		...stateProps,
		logNavigation: (route_name) => logNavigation(dispatch, route_name),
	};
}

export default connect(mapStateToProps, undefined, mergeProps, { forwardRef: true })(withForwardedRef(AppNavigator))