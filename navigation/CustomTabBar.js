import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback, FlatList } from 'react-native';
import TranslatedText from '../components/TranslatedText';
import { largeBorderRadius, shadowStyle2 } from '../constants/Style';
import { darkColor, secondColor } from '../constants/Colors';
import FontedText from '../components/FontedText';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import { connect } from 'react-redux'
import { IsScreenPermitted } from '../utils/Permissions';
import CustomTouchable from '../components/CustomTouchable';
const styles = StyleSheet.create({
	tabbar: {
		height: 50,
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center',
		borderTopWidth: 1,
		borderTopColor: '#eee',
		backgroundColor: '#fff'
	},
	tab: {
		alignSelf: 'stretch',
		flex: 1,
		alignItems: 'center',
		...Platform.select({
			ios: {
				justifyContent: 'center',
				paddingTop: 0
			},
			android: {
				justifyContent: 'center',
			},
		}),
	}
});

class CustomTabBar extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isMenuShown: false,
			menu_items: [
				{
					id: 1,
					icon: 'options',
					name: 'Screen #1',
				},
				{
					id: 2,
					icon: 'options',
					name: 'Screen #2',
				},
				{
					id: 3,
					icon: 'options',
					name: 'Screen #3',
				},
				{
					id: 4,
					icon: 'options',
					name: 'Screen #4',
				},
			]
		}

		const {
			navigation,
			state
		} = this.props

		let { routes } = state
		routes = routes.map((item, index) => ({ ...item, id: index }))

		let displayedTabsIds = []

		const isSuperUser = this.props.permissions.includes(1)

		if (isSuperUser) {
			displayedTabsIds = routes.map(item => item.id)
		}
		else {
			let filteredItems = []

			routes.forEach(item => {
				if (item.key === "Home" || IsScreenPermitted(item.key)) {
					displayedTabsIds.push(item.id)
					filteredItems.push(item)
				}
			})

			routes = filteredItems
		}

		this.routes = routes
		this.displayedTabsIds = displayedTabsIds
	}

	onPress = (key) => {
		if (key === "More") {
			this.setState({ isMenuShown: !this.state.isMenuShown })
		}
		else {
			if (this.state.isMenuShown) {
				this.setState({ isMenuShown: false })
			}

			this.props.jumpTo(key);
		}
	}

	renderMenuItem = (item) => {
		const { icon, name } = item

		return (
			<CustomTouchable
				onPress={() => { this.setState({ isMenuShown: false }) }}
				style={{
					paddingVertical: 20,
					paddingHorizontal: 30,
					flexDirection: 'row',
					alignItems: 'center',
				}}>
				<SimpleLineIcons color={darkColor} name={icon} size={20} />

				<FontedText
					style={{
						marginLeft: 15,
						color: darkColor,
						fontWeight: 'normal',
						fontSize: 14
					}}>{name}</FontedText>
			</CustomTouchable>
		)
	}

	renderMoreMenu = () => {
		if (this.state.isMenuShown) {
			return (
				<FlatList
					style={{
						position: 'absolute',
						top: -(this.state.menu_items.length * 65),
						right: 15,
						borderRadius: largeBorderRadius,
						backgroundColor: 'white',
						...shadowStyle2,
					}}
					ItemSeparatorComponent={() => <View style={{ height: 1, backgroundColor: '#f3f4f5' }} />}
					keyExtractor={item => `${item.id}`}
					data={this.state.menu_items}
					renderItem={({ item }) => this.renderMenuItem(item)} />
			)
		}
	}

	renderBadge = (count) => {
		if (count > 0) {
			return (
				<View
					style={{
						position: 'absolute',
						top: -10,
						right: 15,
						justifyContent: 'center',
						alignItems: 'center',
						width: 18,
						height: 18,
						borderRadius: 7,
						backgroundColor: secondColor,
					}}>
					<FontedText style={{ color: 'white', fontSize: 12 }}>{count}</FontedText>
				</View>
			)
		}
	}

	render() {
		const {
			navigation,
			renderIcon,
			activeTintColor,
			inactiveTintColor,
			badges_data,
			userId,
			state
		} = this.props;

		const { routes, displayedTabsIds } = this

		return (
			<View style={styles.tabbar}>
				{routes && routes.map((route, index) => {
					let currentIndex = 0

					if (displayedTabsIds.includes(state.index)) {
						currentIndex = state.index
					}

					const focused = route.id === currentIndex
					const tintColor = focused ? activeTintColor : inactiveTintColor;
					const badgeCount = badges_data[route.key]

					// We Will Hide share App For 11@tashfier.com

					if (route.key == 'MyApp') {
						return null
					}

					return (
						<TouchableWithoutFeedback
							key={route.key}
							style={styles.tab}
							onPress={this.onPress.bind(this, route.key)}>
							<View
								style={styles.tab}>
								{renderIcon({
									route,
									index,
									focused,
									tintColor
								})}

								<TranslatedText
									style={{
										color: tintColor,
										textAlign: 'center',
										fontSize: 10,
										marginTop: 1,
										fontWeight: 'normal',
									}}
									text={route.key} />

								{this.renderBadge(badgeCount)}
							</View>
						</TouchableWithoutFeedback>
					);
				})}

				{this.renderMoreMenu()}
			</View>
		);
	}
}

const mapStateToProps = ({
	badges: {
		badges_data
	},
	user: {
		permissions,
	},
	login: {
		userId
	}
}) => ({
	userId,
	badges_data,
	permissions,
})

export default connect(mapStateToProps)(CustomTabBar)