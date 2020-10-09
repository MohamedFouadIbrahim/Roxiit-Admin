import React, { Component } from 'react'
import { View, ActivityIndicator, Text, FlatList, I18nManager, EventEmitter } from 'react-native'
import { connect } from 'react-redux'
import LazyContainer from '../../components/LazyContainer';
import { screenWidth } from '../../constants/Metrics';
import { mainColor } from '../../constants/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CustomHeader from '../../components/CustomHeader';
import { GetProductHome } from '../../services/ProductService';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { EventRegister } from 'react-native-event-listeners'
import ProductDescription from './ProductDescription';
import ProductPhysicalInfo from './ProductPhysicalInfo';
import ProductMedia from './ProductMedia';
import ProductPricing from './ProductPricing';
import ProductOptions from './ProductOptions';
import ProductHome from './ProductHome';
import ProductSettings from './ProductSettings';
import ProductFiles from './ProductFiles';
import { getFilters } from '../../services/FilterService';
import { withLocalize } from 'react-localize-redux';
import ProductAnalystic from './ProductAnalystic';
import ProductWherehouses from './ProductWherehouses';
import CustomTouchable from '../../components/CustomTouchable';
import ProudctCollection from './ProductCollection';
import ProductOrders from './ProductOrders';
import ProductStatusHistory from './ProductStatusHistory';

class Product extends Component {
	constructor(props) {
		super(props);

		const { translate, ShowProductWarehouse } = props
		const { Type } = this.props.route.params
		let tabItems = [
			{ Id: '0', Name: translate('Home'), selected: true },
			{ Id: '1', Name: translate('Pricing') },
			{ Id: '2', Name: translate('Physical') },
			{ Id: '3', Name: translate('Settings') },
			{ Id: '4', Name: translate('Description') },
			{ Id: '5', Name: translate('Files') },
			{ Id: '6', Name: translate('Media') },
			{ Id: '7', Name: translate('Options') },
			{ Id: '8', Name: translate('Analystic') },
			{ Id: '9', Name: translate('Warehouses') },
			{ Id: '11', Name: translate('Orders') },
			{ Id: '12', Name: translate('StatusHistory') },
		]

		if (Type && Type.Id == 5) {
			tabItems.push({
				Id: '10',
				Name: translate('Collection')
			})
		}

		this.state = {
			product: null,
			fetching: true,
			submitting: false,
			tabPosition: 1,
			selectedTab: '0',
			tabItems,
			currentTabIndex: 0,
			// TabWidth: 1,
			isAddOptionGroupVisible: false,
			isAddPhotosVisible: false,
			ProudctCollectionID: null,
			isOneProudctCollectionVisible: false,
			isNewProductInputsVisible: false
		}

		this.listener = EventRegister.addEventListener('submitting', (submitting) => {
			this.setState({ submitting })
		})

		this.AddOptionGroupListener = EventRegister.addEventListener('isAddOptionGroupVisible', (isAddOptionGroupVisible) => {
			this.setState({ isAddOptionGroupVisible })
		})

		this.isAddPhotosVisibleListener = EventRegister.addEventListener('isAddPhotosVisible', (isAddPhotosVisible) => {
			this.setState({ isAddPhotosVisible })
		})

		this.isOneProudctCollectionVisibleListListener = EventRegister.addEventListener('isOneProudctCollectionVisible', (isOneProudctCollectionVisible) => {
			this.setState({ isOneProudctCollectionVisible })
		})

		this.isNewProductInputsVisibleListener = EventRegister.addEventListener('isNewProductInputsVisible', (isNewProductInputsVisible) => {
			this.setState({ isNewProductInputsVisible })
		})
	}

	componentDidMount() {
		this.fetchHomeContent()
		// this.fetchFilters();
	}
	componentDidUpdate(prevProps) {
		
		if (this.props.route.params?.ProductId !== prevProps.route.params?.ProductId) {
			// this.fetchHomeContent()
			this.fetchFilters();
		}
	}

	fetchFilters = () => {
		this.cancelFetchDatagetFilters = getFilters({ productStatus: true, productVisibility: true }, res => {
			this.setState({ filters: res.data, }, this.fetchHomeContent)
		})
	}

	fetchHomeContent = () => {
		var Id = this.props.route.params?.ProductId
		this.cancelFetchDataGetProductHome = GetProductHome(Id, res => {
			this.setState({ product: res.data, selectedStatus: res.data.Status, selectedVisibility: res.data.Visibility }, () => {
				this.setState({ fetching: false })
			})
		}, err => {
			// alert('err')
		})
	}

	componentWillUnmount() {
		EventRegister.removeEventListener(this.listener)
		EventRegister.removeEventListener(this.AddOptionGroupListener)
		EventRegister.removeEventListener(this.isAddPhotosVisibleListener)
		EventRegister.removeEventListener(this.isOneProudctCollectionVisibleListListener)
		EventRegister.removeEventListener(this.isNewProductInputsVisibleListener)
		this.cancelFetchDataGetProductHome && this.cancelFetchDataGetProductHome()
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	}

	onViewableItemsChanged = ({ viewableItems, changed }) => {
		// if(typeof viewableItems[viewableItems.length].index != 'undefined')
		this.setState({ currentTabIndex: viewableItems[0].index })
	}

	selectTab = (Id) => {
		var tabItems = this.state.tabItems
		tabItems.map((light) => {
			if (light.Id == Id)
				light.selected = true;
			else
				light.selected = false;
		})
		// this.lightsRef.scrollToIndex({index: Id, animated: true});
		this.setState({ tabItems, selectedTab: Id, })
	}

	renderTabContent = () => {
		const { product, isOneProudctCollectionVisible, isNewProductInputsVisible } = this.state;
		const { navigation } = this.props;
		switch (this.state.selectedTab) {
			case '0':
				return <ProductHome product={product} navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '4':
				return <ProductDescription navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '2':
				return <ProductPhysicalInfo navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '6':
				return <ProductMedia navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '1':
				return <ProductPricing product={product} navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '7':
				return <ProductOptions product={product} navigation={navigation} ProductId={this.props.route.params?.ProductId} isNewProductInputsVisible={isNewProductInputsVisible} />
			case '3':
				return <ProductSettings navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '5':
				return <ProductFiles navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '8':
				return <ProductAnalystic navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '9':
				return <ProductWherehouses navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			case '10':
				return <ProudctCollection navigation={navigation} ProductId={this.props.route.params?.ProductId} isOneProudctCollectionVisible={isOneProudctCollectionVisible} />
			case '11':
				return <ProductOrders navigation={navigation} ProductId={this.props.route.params?.ProductId} isOneProudctCollectionVisible={isOneProudctCollectionVisible} />
			case '12':
				return <ProductStatusHistory navigation={navigation} ProductId={this.props.route.params?.ProductId} />
			default:
				return null
		}
	}

	submit = () => {
		EventRegister.emit('currentPost', String(this.state.selectedTab))
	}

	handleScroll = (event) => {
		if (this.state.tabPosition == 0 && event.nativeEvent.contentOffset.y >= 100) {
			this.setState({ tabPosition: 1 }, () => {
				// this.refs.tabContent.scrollTo({x: 0, y: 1, animated: false})
				setTimeout(() => this.refs.tabContent.scrollTo({ x: 0, y: 1, animated: false }), 100)
			})
		}
		if (this.state.tabPosition == 1 && event.nativeEvent.contentOffset.y === 0.0) {
			this.setState({ tabPosition: 0 })
		}
		// else {
		// 	this.setState({ tabPosition: 0 })
		// }
	}

	render() {
		const { product } = this.state
		if (product == null) {
			return (
				<View style={{
					backgroundColor: 'white',
					justifyContent: 'center',
					flex: 1,
					alignItems: 'center',
				}}>
					<ActivityIndicator size="large" color={mainColor} />
				</View>
			)
		} else {
			return (
				<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
					<CustomHeader
						navigation={this.props.navigation}
						rightNumOfItems={1}
						rightComponent={
							<View style={{ flexDirection: 'row', alignItems: 'center', }}>
								{
									this.state.selectedTab == '7' || this.state.selectedTab == '6' ?
										<>
											{
												this.state.isAddOptionGroupVisible ?
													this.state.isAddPhotosVisible ?
														this.state.submitting ?
															<CustomTouchable style={{
																flexDirection: 'row',
																justifyContent: 'center',
																alignItems: 'center',
																flex: 1,
															}} onPress={() => {
																EventRegister.emit('uploadOptionImage', true)
															}} >
																<Ionicons name='ios-add-circle-outline' size={18} color='#FFF' />
															</CustomTouchable> :
															<CustomTouchable style={{
																flexDirection: 'row',
																justifyContent: 'center',
																alignItems: 'center',
																flex: 1,
															}} onPress={() => {
																EventRegister.emit('uploadOptionImage', true)
															}} >
																<Ionicons name='ios-add-circle-outline' size={18} color='#FFF' />
															</CustomTouchable>
														: null
													:
													this.state.submitting && this.state.selectedTab != '6' ? <ActivityIndicator /> :
														<CustomTouchable style={{
															flexDirection: 'row',
															justifyContent: 'center',
															alignItems: 'center',
															flex: 1,
														}} onPress={() => {
															if (this.state.selectedTab == '6') {
																EventRegister.emit('uploadMedia', true)
															} else {
																if (this.state.isAddPhotosVisible) {
																	EventRegister.emit('uploadOptionImage', true)
																} else {
																	this.setState({ isAddOptionGroupVisible: true }, () => EventRegister.emit('isAddOptionGroupVisible', true))
																}
															}
														}} >
															<Ionicons name='ios-add-circle-outline' size={18} color='#FFF' />
														</CustomTouchable>
											}
											{
												this.state.isAddOptionGroupVisible && this.state.selectedTab == '7' && this.state.isAddPhotosVisible == false ?
													<HeaderSubmitButton
														style={{ flex: 1 }}
														isLoading={this.state.submitting}
														onPress={this.submit} /> : null
											}
										</>
										:
										// hide save button on some tabs
										this.state.selectedTab == '0' || this.state.selectedTab == '6' || this.state.selectedTab == '12' ?
											null
											: this.state.selectedTab == '10' ? this.state.selectedTab == '10' && this.state.isOneProudctCollectionVisible ?
												<HeaderSubmitButton
													isLoading={this.state.submitting}
													onPress={this.submit} /> :
												<CustomTouchable style={{
													flexDirection: 'row',
													justifyContent: 'center',
													alignItems: 'center',
													flex: 1,
												}} onPress={() => {
													EventRegister.emit('isOneProudctCollectionVisible', true)
												}} >
													<Ionicons name='ios-add-circle-outline' size={18} color='#FFF' />
												</CustomTouchable>
												:
												this.state.selectedTab == '11' ? null :
													<HeaderSubmitButton
														isLoading={this.state.submitting}
														onPress={this.submit} />
								}
							</View>
						}
						title="Products" />

					<View style={{
						width: screenWidth,
						height: 51,
						marginTop: 0,
						backgroundColor: mainColor,
						flexDirection: "row",
						shadowColor: "#000",
						shadowOffset: {
							width: 0,
							height: 1,
						},
						shadowOpacity: 0.20,
						shadowRadius: 1.41,
						elevation: 2,
						zIndex: 4
					}}>
						<View style={{ flex: this.state.currentTabIndex > 0 ? 0.1 : 0, justifyContent: "center", alignItems: "center", height: 50 }}>
							{
								this.state.currentTabIndex > 0 ?
									<CustomTouchable style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={() => {
										this.setState({ currentTabIndex: this.state.currentTabIndex - 1 }, () => {
											this.lightsRef.scrollToIndex({ index: this.state.currentTabIndex, animated: true });
										})
									}}>
										<Ionicons name={I18nManager.isRTL ? 'ios-arrow-forward' : "ios-arrow-back"} size={18} color="#FFF" />
									</CustomTouchable>
									: null
							}
						</View>
						<View style={{ flex: 1, width: screenWidth, height: 50, }}>
							<FlatList
								style={{ flex: 1, }}
								ref={(ref) => { this.lightsRef = ref; }}
								data={this.state.tabItems}
								extraData={this.state}
								keyExtractor={(item) => item.Id}
								showsHorizontalScrollIndicator={false}
								initialScrollIndex={0}
								onViewableItemsChanged={this.onViewableItemsChanged}
								viewabilityConfig={{
									itemVisiblePercentThreshold: 10
								}}
								horizontal
								// pagingEnabled
								renderItem={({ item }) => (
									<CustomTouchable onPress={() => this.selectTab(item.Id)} style={{ width: screenWidth / 4, justifyContent: "center", alignItems: "center", flex: 1 }}>
										<Text style={{ fontSize: 16, color: "#FFF", fontWeight: item.selected ? "bold" : "normal", opacity: item.selected ? 1 : .7 }}>{item.Name}</Text>
									</CustomTouchable>
								)}
							/>
						</View>
						<View style={{ flex: 0.1, justifyContent: "center", alignItems: "center", height: 50 }}>
							{
								this.state.currentTabIndex < this.state.tabItems.length - 3 ?
									<CustomTouchable style={{ width: "100%", height: "100%", justifyContent: "center", alignItems: "center" }} onPress={() => {
										this.setState({ currentTabIndex: this.state.currentTabIndex + 1 }, () => {
											this.lightsRef.scrollToIndex({ index: this.state.currentTabIndex, animated: true });
										})
									}}>
										<Ionicons name={I18nManager.isRTL ? 'ios-arrow-back' : "ios-arrow-forward"} size={18} color="#FFF" />
									</CustomTouchable>
									: null
							}
						</View>
					</View>
					<View style={{ flex: 1, }} >
						<View style={{ width: screenWidth, flex: 1 }}>
							{this.renderTabContent()}
						</View>
					</View>
				</LazyContainer>
			)
		}
	}
}

const mapStateToProps = ({
	runtime_config: {
		runtime_config: {
			screens: {
				Product_Details_09_5: {
					ShowProductWarehouse,
				},
			},
		},
	},
}) => ({
	ShowProductWarehouse,
})

export default connect(mapStateToProps)(withLocalize(Product))
