import React, { Component, PureComponent } from 'react'
import { FlatList, View, Platform } from 'react-native'
import { connect } from 'react-redux'
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import TranslatedText from '../../components/TranslatedText';
import { screenWidth } from '../../constants/Metrics';
import { shadowStyle0, largePagePadding, largeBorderRadius, pagePadding } from '../../constants/Style';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Feather from 'react-native-vector-icons/Feather'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import Entypo from "react-native-vector-icons/Entypo";
import { secondColor } from '../../constants/Colors';
import GoLive from '../GoLive';
import { IsScreenPermitted, IsUserPermitted } from '../../utils/Permissions';
import CustomTouchable from '../../components/CustomTouchable';
import FontedText from '../../components/FontedText';
import { store } from '../../Store';
import { loadProductPenddingSoundAndPlay } from '../../utils/Sounds';
import { GetDashboard } from '../../services/Dashboard';
import Index from '../Courier/Index';
import { AcceptOrder, DeclineOrder } from '../../services/OrdersService';
import { LongToast } from '../../utils/Toast';
import RoxiitRefrence from '../../containers/RoxiitRefrence';
import ItemSeparator from '../../components/ItemSeparator/index.js';

const numColumns = 3
const itemWidth = screenWidth / numColumns
const itemPadding = largePagePadding
const iconContainerWidth = (itemWidth - itemPadding) * 0.6
const iconSize = Platform.isPad ? 32 : 20
const iconContainerRadius = iconContainerWidth / 2

class Home extends Component {

	constructor(props) {
		super(props)

		this.state = {
			Orders: [],
			Total: 0
		}
		const allBadges = store.getState().badges.badges_data

		this.sourceRoutes = [
			{
				key: "Products",
				IconComponent: SimpleLineIcons,
				iconName: "bag",
				badges: allBadges['Products']
			},
			{
				key: "Orders",
				IconComponent: AntDesign,
				iconName: "profile",
				badges: allBadges['Orders']
			},
			{
				key: "Categories",
				IconComponent: SimpleLineIcons,
				iconName: "layers",
			},
			{
				key: "Inbox",
				IconComponent: SimpleLineIcons,
				iconName: "drawer",
				badges: allBadges['Inbox']
			},
			{
				key: "Customers",
				IconComponent: AntDesign,
				iconName: "solution1",
			},
			{
				key: "Users",
				IconComponent: SimpleLineIcons,
				iconName: "people",
			},
			{
				key: "Settings",
				IconComponent: SimpleLineIcons,
				iconName: "settings",
				badges: allBadges['Settings'],
				children: [
					{
						key: "StoreProfile",
						IconComponent: AntDesign,
						iconName: "isv",
					},
					{
						key: "Pages",
						IconComponent: AntDesign,
						iconName: "edit",
					},
					{
						key: "Roles",
						IconComponent: SimpleLineIcons,
						iconName: "user-following",
					},
					{
						key: "CurrencyList",
						IconComponent: SimpleLineIcons,
						iconName: "wallet",
					},
					{
						key: "ManagePlaces",
						IconComponent: MaterialIcons,
						iconName: "place",
						children: [
							{
								key: "Countries",
								IconComponent: MaterialCommunityIcons,
								iconName: "home-city",
							},
							{
								key: "Cities",
								IconComponent: MaterialCommunityIcons,
								iconName: "city",
							},
							{
								key: "Areas",
								IconComponent: MaterialCommunityIcons,
								iconName: "city",
							},
						]
					},
					{
						key: "AppTranslation",
						IconComponent: MaterialIcons,
						iconName: "translate",
					},
					{
						key: "AdminTranslation",
						IconComponent: MaterialIcons,
						iconName: "translate",
						developer: true,
					},
					{
						key: "OrdersStatus",
						IconComponent: AntDesign,
						iconName: "profile",
					},
				],
			},
			{
				key: "Resources",
				IconComponent: AntDesign,
				iconName: "database",
				children: [
					{
						key: "Discounts",
						IconComponent: Feather,
						iconName: "percent",
					},
					{
						key: "Articles",
						IconComponent: AntDesign,
						iconName: "copy1",
					},
					{
						key: "Brands",
						IconComponent: AntDesign,
						iconName: "isv",
					},
					{
						key: "Affiliate",
						IconComponent: AntDesign,
						iconName: "addusergroup",
					},
					{
						key: "ImportArea",
						IconComponent: SimpleLineIcons,
						iconName: "doc",
					},
					{
						key: "ETags",
						IconComponent: AntDesign,
						iconName: "tagso",
					},
				],
			},
			{
				key: "Store",
				IconComponent: AntDesign,
				iconName: "isv",
				children: [
					{
						key: "Questions",
						IconComponent: AntDesign,
						iconName: "question",
						badges: allBadges['Questions']
					},
					{
						key: "Reviews",
						IconComponent: SimpleLineIcons,
						iconName: "star",
						badges: allBadges['Reviews']
					},
					{
						key: "ProductOptions",
						IconComponent: SimpleLineIcons,
						iconName: "equalizer",
					},
					{
						key: "Warehouses",
						IconComponent: Feather,
						iconName: "truck",
					},
					{
						key: "Courier",
						IconComponent: Feather,
						iconName: "truck",
					},
					{
						key: "Payment",
						IconComponent: AntDesign,
						iconName: "creditcard",
						badges: allBadges['Payment']
					},
					{
						key: "Stores",
						IconComponent: MaterialCommunityIcons,
						iconName: "home-group",
					},
					{
						key: "NotificationTemplates",
						IconComponent: AntDesign,
						iconName: "notification",
					},
					{
						key: "PopUps",
						IconComponent: Entypo,
						iconName: "popup",
					},
				],
			},
			{
				key: "POS",
				IconComponent: FontAwesome5,
				iconName: "cash-register",
			},
			{
				key: "Analytics",
				IconComponent: SimpleLineIcons,
				iconName: "chart",
				badges: allBadges['Analytics']
			},
			{
				key: "Drivers",
				IconComponent: Feather,
				iconName: "truck",
			},
			// {
			// 	key: "QRCodeGenerator",
			// 	IconComponent: MaterialCommunityIcons,
			// 	iconName: "qrcode",
			// },
		]


	}

	componentDidMount() {
		this.parent = this.props.route.params?.parent
		if (this.parent) {
			const children = this.findRouteChildren(this.parent, this.sourceRoutes)
			this.sourceRoutes = children
			this.disableHeader = true
		}
		else {
			this.disableHeader = false
			this.navigateToStartupScreen()
		}
		this.finalRoutes = this.sourceRoutes.filter(this.isScreenAllowed)

		this.setState({
			displayHeader: !this.disableHeader,
			didFetchData: false
		})
		if (!this.disableHeader) {
			this.fetchData()
		}

		this.fetchPenddingOrderInHome()
	}

	fetchPenddingOrderInHome = () => {
		if (this.props.PendingOrderInHome.Value >= 1) {

			// avoid run multiple time
			if (!global.interval) {

				//at the very first open
				this.GetDashBoadrRequest(false)

				global.interval = 1;
			}

			//update every 15 sec
			let homePenddingIntervalId = setInterval(() => {
				//Stop when there is another interval in PendingOrders Screen
				if (global.penddingIntervalId)
					return;

				this.GetDashBoadrRequest(true)
			}, 15000)
			clearInterval(global.homePenddingIntervalId)//clear any old interval
			global.homePenddingIntervalId = homePenddingIntervalId
		}
	}

	GetDashBoadrRequest = (playSound) => {
		GetDashboard(res => {
			const {
				PendingOrders: {
					Orders,
					Total
				}
			} = res.data
			this.setState({
				Orders,
				Total
			})
			if (Orders.length >= 1 && playSound == true && !this.props.mutePenddingSound) {
				loadProductPenddingSoundAndPlay()
			}
		})
	}

	onChildChange = () => {
		const {
			is_logged_in
		} = this.props
		if (is_logged_in) {
			GetDashboard(res => {
				const {
					PendingOrders: {
						Orders,
						Total
					}
				} = res.data

				this.setState({
					Orders,
					Total
				})
			})
		}
	}

	//accept pending order
	onAcceptItem = (Item) => {
		const { Id } = Item

		AcceptOrder(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
			GetDashBoadrRequest(false)
		})
	}

	//decline pending order
	onDeclineItem = (Item) => {
		const { Id } = Item

		DeclineOrder(Id, res => {
			this.onChildChange()
			LongToast('dataSaved')
			GetDashBoadrRequest(false)
		})
	}

	renderMuteIcons = () => {
		//only shown for super permission
		if (!IsUserPermitted(1 /*super permission */)) return null;

		const { Orders } = this.state
		const {
			mutePenddingSound, setMutePenddingSound
		} = this.props

		if (Orders && Orders.length) {
			return (
				<CustomTouchable
					style={{
						padding: pagePadding / 2,
						backgroundColor: "#eee",
						position: "absolute",
						top: 0,
						left: 0,
						zIndex: 3, // works on ios
						elevation: 3, // works on android
						...shadowStyle0,
					}} onPress={() => {

						if (mutePenddingSound) {
							setMutePenddingSound(false)
						} else {
							setMutePenddingSound(true)
						}
					}} >
					{mutePenddingSound ? <MaterialCommunityIcons name='volume-mute' size={25} /> : <MaterialCommunityIcons name='volume-high' size={25} />}

				</CustomTouchable>
			)
		}
	}
	//top pending order
	renderPenddingOrder = () => {
		const { Orders } = this.state
		const { AcceptRejectOrderFromIndex } = this.props

		return (
			<View>
				{this.renderMuteIcons()}
				<FlatList
					data={Orders}
					keyExtractor={({ Id }) => `${Id}`}
					contentContainerStyle={{
						flexGrow: 1,
						paddingBottom: Orders && Orders.length >= 1 ? 25 : 0,//no empty padding when no items
					}}
					renderItem={({ item, index }) => {

						const { Name, Id } = item

						return (
							<CustomTouchable
								onPress={() => {
									this.props.navigation.navigate('Order', {
										Id,
										onChildChange: this.onChildChange
									})
								}}>
								<FontedText style={{
									paddingHorizontal: 5,
									color: 'black',
									paddingVertical: 8,
									textAlign: 'center',
								}}>{Name}</FontedText>

								{AcceptRejectOrderFromIndex && AcceptRejectOrderFromIndex.Value ? < View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: largePagePadding }} >
									<CustomTouchable
										onPress={() => this.onAcceptItem(item.item)}
										style={{
											width: screenWidth / 2.5,
											justifyContent: 'center',
											alignItems: 'center',
											paddingHorizontal: 10,
											paddingVertical: 6,
											backgroundColor: '#009688',
											borderRadius: largeBorderRadius,
											marginTop: 5,
										}}>
										<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Accept' />
									</CustomTouchable>

									<CustomTouchable
										onPress={() => { this.onDeclineItem(item.item) }}
										style={{
											width: screenWidth / 2.5,
											justifyContent: 'center',
											alignItems: 'center',
											paddingHorizontal: 10,
											paddingVertical: 6,
											backgroundColor: '#F44336',
											borderRadius: largeBorderRadius,
											marginTop: 5,
										}}>
										<TranslatedText style={{ color: 'white', fontSize: 12, }} text='Decline' />
									</CustomTouchable>
								</View> :
									<ItemSeparator />
								}
							</ CustomTouchable>
						)

					}}
				/>
			</View>
		)
	}

	findRouteChildren = (route, routes) => {
		let children = []

		routes.forEach(item => {
			if (item.key === route) {
				children = item.children
			}
			else if (item.children) {
				const foundChildren = this.findRouteChildren(route, item.children)

				if (foundChildren.length) {
					children = foundChildren
				}
			}
		})

		return children
	}

	//permissions filter
	isScreenAllowed = (item) => {
		if (!this.props.is_developer && item.developer) {
			return false
		}

		if (!this.props.permissions.includes(1) && !IsScreenPermitted(item.key)) {
			return false
		}

		if (item.children && !item.children.filter(child => this.isScreenAllowed(child)).length) {
			return false
		}

		return true
	}

	//go back home page
	navigateToStartupScreen = () => {
		const { StartupPage } = this.props

		if (StartupPage && StartupPage.Value && IsScreenPermitted(StartupPage.Value)) {
			this.props.navigation.navigate(StartupPage.Value)
		}
	}

	//go live score
	fetchData = () => {

		this.setState({
			// GoliveScore,
			didFetchData: true
		})

	}

	//vavigate to iner page
	onPressItem = (item) => {
		const {
			soon,
		} = item

		if (!soon) {
			const {
				children,
				key,
			} = item

			if (children && children.length) {
				this.props.navigation.push("Home", {
					parent: key,
				})
			}
			else {
				this.props.navigation.navigate(key, {})
			}
		}
	}

	renderItem = ({ item }) => {
		const {
			badges_data
		} = this.props
		return (
			<HomeItem
				item={{ ...item, badges: badges_data[item.key] }}
				onPress={this.onPressItem}
				style={{
					flex: 1,
					height: itemWidth,
					padding: itemPadding,
					justifyContent: 'center',
					alignItems: 'center',
				}} />
		)
	}

	renderHeader = () => {
		const { displayHeader, didFetchData, GoliveScore } = this.state

		if (!displayHeader || GoliveScore >= 100 || !didFetchData) {
			return null
		}
		else {

			return (
				<GoLive
					Presentge={GoliveScore}
					progress={GoliveScore * 0.01}
					onPress={() => { this.props.navigation.navigate('GoLiveDetails') }}
					onClose={() => { this.setState({ displayHeader: false }) }}
				/>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
				{/* <NavigationEvents
					onDidFocus={() => {
						this.setState({ refresh: true })
						this.fetchData()
					}} /> */}

				<CustomHeader
					leftComponent={this.parent ? "back" : "drawer"}
					navigation={this.props.navigation}
					title={this.parent || "Home"} />

				{/* load pending orders only in home page */}
				{!this.parent && this.renderPenddingOrder()}

				<FlatList
					numColumns={3}
					extraData={this.state}
					data={this.finalRoutes}
					// ListHeaderComponent={this.renderHeader()}
					renderItem={this.renderItem} />

			</LazyContainer>
		)
	}
}

class HomeItem extends PureComponent {

	render() {
		const { item, onPress, ...restProps } = this.props
		const { key, soon, iconName, IconComponent, badges } = item

		return (
			<CustomTouchable
				onPress={() => { onPress(item) }}
				{...restProps}>

				<View
					style={{
						backgroundColor: 'white',
						width: iconContainerWidth,
						height: iconContainerWidth,
						borderRadius: iconContainerRadius,
						justifyContent: 'center',
						alignItems: 'center',

						...shadowStyle0,
					}}>
					<IconComponent color={'#444444'} name={iconName} size={iconSize} />

					{badges && badges > 0 ? <View
						style={{
							backgroundColor: secondColor,
							paddingHorizontal: 2,
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 10,
							position: 'absolute',
							top: -5,
							right: 0,
						}}
					>
						<FontedText style={{
							color: 'white',
							fontSize: 11,
						}} > {badges} </FontedText>
					</View> : null}

					{soon ? <View
						style={{
							backgroundColor: secondColor,
							padding: 3,
							justifyContent: 'center',
							alignItems: 'center',
							borderRadius: 7,
							position: 'absolute',
							top: -5,
							right: -5,
						}}>
						<TranslatedText
							style={{
								color: 'white',
								fontSize: 11,
							}}
							text={"Soon"} />
					</View> : null}
				</View>

				<TranslatedText
					style={{
						color: '#555555',
						fontSize: 15,
						marginTop: 5,
						textAlign: 'center',
					}}
					text={key} />
			</CustomTouchable>
		)
	}
}

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			setMutePenddingSound
		}
	} = require('../../redux/LoginRedux.js');

	return {
		...ownProps,
		...stateProps,
		setMutePenddingSound: (mutePenddingSound) => setMutePenddingSound(dispatch, mutePenddingSound)
	};
}

const mapStateToProps = ({
	inspector: {
		is_developer,
	},
	user: {
		permissions,
	},
	badges: {
		badges_data
	},
	login: {
		hello_data,
		is_logged_in,
		mutePenddingSound
	},
	runtime_config: {
		runtime_config: {
			screens: {
				Admin_Page_0_0: {
					StartupPage,
					PendingOrderInHome,
					AcceptRejectOrderFromIndex,
				},
			},
		},
	},
}) => ({
	mutePenddingSound,
	PendingOrderInHome,
	AcceptRejectOrderFromIndex,
	is_logged_in,
	is_developer,
	permissions,
	StartupPage,
	hello_data,
	badges_data
})

export default connect(mapStateToProps, undefined, mergeProps)(Home)