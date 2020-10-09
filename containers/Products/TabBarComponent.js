import React, { Component } from 'react';
import { View, StyleSheet, Platform, TouchableWithoutFeedback } from 'react-native';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import LinearGradient from 'react-native-linear-gradient';
import FontedText from '../../components/FontedText';
import CustomTouchable from '../../components/CustomTouchable';

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
				justifyContent:'center',
				paddingTop: 0
			},
			android: {
				justifyContent: 'center',
			},
		}),
	}
});

export default class TabBarComponent extends Component {
	onPress = (key) => {
		this.props.jumpTo(key);
	}

	render() {
		const {
			navigation,
			renderIcon,
			activeTintColor,
			inactiveTintColor,
		} = this.props;

		const { routes } = navigation.state;

		return (
			<View style={styles.tabbar}>
				<View 
					style={{
						backgroundColor: 'white',
						width: 100,
						height: 130,
						borderRadius: 65,
						position: 'absolute',
						top: -45,
						transform: [
							{ scaleX: 1.3 }
						]
					}} />

				{routes && routes.map((route, index) => {
					const focused = index === navigation.state.index;
					const tintColor = focused ? activeTintColor : inactiveTintColor;

					if (route.key === "CAMERA") {
						return (
							<CustomTouchable
								key={route.key}
								style={{
									marginTop: -45,
									width: 80,
									height: 80,
									borderRadius: 40,
									backgroundColor: '#4048EF',
									justifyContent: 'center',
									alignItems: 'center',
								}}
								onPress={this.onPress.bind(this, route.key)}>
								<LinearGradient
									start={{ x: 0, y: 0 }}
									end={{ x: 1, y: 1 }}
									colors={['#4048EF', '#5A7BEF']}
									style={{
										borderRadius: 40,
										justifyContent: 'center',
										alignItems: 'center',
									}}>
									<SimpleLineIcons color={'white'} name='camera' size={25} />
								</LinearGradient>
							</CustomTouchable>
						)
					}
					else {
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

									<FontedText 
										style={{ 
											color: tintColor, 
											textAlign: 'center', 
											fontSize: 10, 
											marginTop: 1 
										}}>{route.key}</FontedText>
								</View>
							</TouchableWithoutFeedback>
						);
					}
				})}

			</View>
		);
	}
}