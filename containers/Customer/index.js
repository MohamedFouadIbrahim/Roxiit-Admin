import React, { Component } from 'react'
import { ScrollView, View, ImageBackground, I18nManager } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import CustomSelector from '../../components/CustomSelector/index.js';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';
import { largePagePadding, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import FontedText from '../../components/FontedText/index.js';
import CircularImage from '../../components/CircularImage/index.js';
import { GetCustomer, ChangeCustomerType, ChangeCustomerStatus, TestNotificationForCustomer } from '../../services/CustomersService.js';
import { formatDate } from '../../utils/Date.js';
import { getFilters } from '../../services/FilterService.js';
import { mainColor, grayColor, secondTextColor, mainTextColor } from '../../constants/Colors.js';
import TranslatedText from '../../components/TranslatedText/index.js';
import Ionicons from 'react-native-vector-icons/Ionicons'
import LinearGradient from 'react-native-linear-gradient';
import { IsScreenPermitted } from '../../utils/Permissions.js';
import { LongToast } from '../../utils/Toast';
import CustomTouchable from '../../components/CustomTouchable';
import { connect } from 'react-redux';
import CustomAddModal from '../../components/CustomAddModal';
import ConfirmModal from '../../components/ConfirmModal';
import { UpdateBalance } from '../../services/CustomersService';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import { PhoneCall, Whatsapp } from '../../utils/Call.js';
import AntDesign from 'react-native-vector-icons/AntDesign'
import FontAwesome from 'react-native-vector-icons/FontAwesome'

class Customer extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params
		this.customerId = Id

		this.state = {
			didFetchData: false,
			showModal: false,
			lockSubmit: false,
			VirtualMoneyInModal: null
		}

		this.lockSubmit = false
		this.statusSelectorRef = React.createRef();
		this.typeSelectorRef = React.createRef();
		this.testNotififcation = React.createRef()
		this.isOrdersPermitted = IsScreenPermitted("Orders")
	}

	componentWillUnmount() {
		this.cancelFetchDataGetCustomer && this.cancelFetchDataGetCustomer()
		this.cancelFetchDatagetFilters && this.cancelFetchDatagetFilters()
	}

	componentDidMount() {
		this.cancelFetchDatagetFilters = getFilters({
			customerTypes: true,
			customerStatus: true
		}, res => {
			const {
				CustomerTypes,
				CustomerStatus,
			} = res.data

			this.setState({
				CustomerTypes,
				CustomerStatus,
			})
		})

		this.fetchData()
	}

	fetchData = () => {
		const { customerId } = this

		this.cancelFetchDataGetCustomer = GetCustomer(customerId, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	renderImage = () => {
		const imageSize = 110

		if (!this.state.didFetchData) {
			return (
				<View
					style={{
						alignSelf: 'center',
						justifyContent: 'center',
						alignItems: 'center',
						marginBottom: largePagePadding,
					}}>
					<CircularImage
						uri={'https://'}
						size={imageSize} />
				</View>
			)
		}

		const { ImageUrl } = this.state.Media

		return (
			<View
				style={{
					alignSelf: 'center',
					justifyContent: 'center',
					alignItems: 'center',
					marginBottom: largePagePadding,
				}}>
				<CircularImage
					uri={ImageUrl}
					size={imageSize} />
			</View>
		)
	}

	hideModal = () => {
		this.setState({ showModal: false, VirtualMoneyInModal: this.state.VirtualMoney })
	}

	showModal = () => {
		this.setState({ showModal: true, VirtualMoneyInModal: this.state.VirtualMoney })
	}

	renderModal = () => {
		const {
			showModal,
			VirtualMoney,
			VirtualMoneyInModal
		} = this.state

		return (
			<CustomAddModal
				Edit={true}
				onBackdropPress={() => { this.hideModal() }}
				isVisible={showModal}
				loading={this.state.lockSubmit}
				RoundedCloseButtonPress={() => { this.hideModal() }}
				onSubmit={() => {

					if (!VirtualMoneyInModal) {
						return LongToast('CantHaveEmptyInputs')
					}

					this.lockSubmit = true
					this.setState({ lockSubmit: true })

					UpdateBalance({
						customerId: this.customerId,
						amount: VirtualMoneyInModal
					}, res => {

						this.lockSubmit = false
						this.setState({ lockSubmit: false, VirtualMoney: VirtualMoneyInModal, showModal: false })
						LongToast('dataSaved')
					}, err => {

						this.lockSubmit = false
						this.setState({ lockSubmit: false })

					})
				}}
			>

				<HorizontalInput
					label="VirtualMoney"
					value={VirtualMoneyInModal ? `${VirtualMoneyInModal}` : null}
					keyboardType='numeric'
					onChangeText={text => {
						this.setState({ VirtualMoneyInModal: text });
					}}
				/>

			</CustomAddModal>
		)
	}

	renderHeader = () => {
		const { FullName, Country, City, CreatedUtc, ordersCount, ordersValue, VirtualMoney, Type, Status, AffiliateCode, FromCustomer, AffiliateFrom } = this.state
		const { Currency } = this.props

		return (
			<ImageBackground
				blurRadius={5}
				style={{ flex: 1, }}
				source={{ uri: this.state.didFetchData ? this.state.Media.ImageUrl : 'https://' }}
			>
				<LinearGradient
					colors={['rgba(0, 0, 0, .1)', 'rgba(0, 0, 0, .6)', 'rgba(0, 0, 0, 1)']}
					style={{
						flex: 1,
						paddingVertical: largePagePadding,
					}}>

					<View
						style={{
							justifyContent: 'center',
							alignItems: 'center',
							padding: largePagePadding,
						}}>
						{this.renderImage()}
						<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{FullName}</FontedText>
						<FontedText style={{ color: '#e6f0f7' }}>{City && City.Name ? `${City.Name}, ` : ''}{Country && Country.Name ? Country.Name : ''}</FontedText>
						<FontedText style={{ color: '#e6f0f7' }}>{CreatedUtc ? formatDate(CreatedUtc) : ''}</FontedText>
					</View>

					<View
						style={{
							flexDirection: 'row',
						}}>
						<View
							style={{
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
								padding: largePagePadding,
							}}>
							<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{`${VirtualMoney} ${Currency.Name}`}</FontedText>
							<TranslatedText style={{ color: '#e6f0f7', textAlign: 'center' }} text="VirtualMoney" />
						</View>

						<View
							style={{
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
								padding: largePagePadding,
							}}>
							<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{`${ordersValue} ${Currency.Name}`}</FontedText>
							<TranslatedText style={{ color: '#e6f0f7', textAlign: 'center' }} text="Spent" />
						</View>

						<View
							style={{
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
								padding: largePagePadding,
							}}>
							<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{ordersCount}</FontedText>
							<TranslatedText style={{ color: '#e6f0f7', textAlign: 'center' }} text="Orders" />
						</View>

						<View
							style={{
								flex: 1,
								justifyContent: 'flex-start',
								alignItems: 'center',
								padding: largePagePadding,
							}}>
							<FontedText style={{ color: '#FFF', textAlign: 'center', fontSize: 10 }}>{AffiliateCode}</FontedText>
							<TranslatedText style={{ color: '#e6f0f7', textAlign: 'center' }} text="AFFCode" />
						</View>

					</View>

					{Type && <CustomTouchable
						onPress={() => {
							this.typeSelectorRef.current.show()
						}}
						style={{
							flexDirection: 'row',
							position: 'absolute',
							top: pagePadding,
							left: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: mainColor,
							borderRadius: largeBorderRadius,
						}}>
						<FontedText style={{ color: 'white', fontSize: 11, }}>{Type.Name.slice(0, 10)}</FontedText>

						<Ionicons
							name={"md-arrow-dropdown"}
							size={18}
							color={'white'}
							style={{
								marginLeft: 5,
							}} />
					</CustomTouchable>}

					{Status && <CustomTouchable
						onPress={() => {
							this.statusSelectorRef.current.show()
						}}
						style={{
							flexDirection: 'row',
							position: 'absolute',
							top: pagePadding,
							right: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: mainColor,
							borderRadius: largeBorderRadius,
						}}>
						<FontedText style={{ color: 'white', fontSize: 11, }}>{Status.Name.slice(0, 10)}</FontedText>

						<Ionicons
							name={"md-arrow-dropdown"}
							size={18}
							color={'white'}
							style={{
								marginLeft: 5,
							}} />
					</CustomTouchable>}

					{AffiliateFrom && (AffiliateFrom.Id != 0 || AffiliateFrom.Id > 0) && <CustomTouchable
						onPress={() => {

							const { onChildChange } = this.props.route.params
							this.props.navigation.push('Customer', {
								Id: AffiliateFrom.Id,
								onChildChange
							})

						}}
						style={{
							flexDirection: 'row',
							position: 'absolute',
							top: pagePadding + 40,
							left: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: mainColor,
							borderRadius: largeBorderRadius,
						}}>
						<TranslatedText style={{ color: 'white', fontSize: 11, }} text={'From'} />
						<FontedText style={{ color: 'white', fontSize: 11, }}>{`: ${AffiliateFrom.Name.slice(0, 10)}`}</FontedText>
						<Ionicons
							name={I18nManager.isRTL ? 'md-arrow-dropleft' : "md-arrow-dropright"}
							size={18}
							color={'white'}
							style={{
								marginLeft: 5,
							}} />
					</CustomTouchable>}

				</LinearGradient>
			</ImageBackground>
		)
	}


	onChangeType = (Type) => {
		this.setState({ Type })
		ChangeCustomerType(this.customerId, Type.Id, res => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		})
	}

	onChangeStatus = (Status) => {
		this.setState({ Status })
		ChangeCustomerStatus(this.customerId, Status.Id, res => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		})
	}

	onChildChange = () => {
		this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		this.fetchData()
	}

	render() {
		const { CustomerTypes, CustomerStatus, ActivePhone } = this.state

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Customer"} />

				<ScrollView
					contentContainerStyle={{

					}}>
					{this.renderHeader()}
					{this.renderModal()}
					<SettingsTitle title={"Info"} />
					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('CustomerPersonalInfo', {
								Id: this.customerId,
								onChildChange: this.onChildChange,
							})
						}}
						title="PersonalInfo" />

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('CustomerChangePassword', {
								Id: this.customerId,
							})
						}}
						title="ChangePassword" />

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('AddressIndex', {
								Id: this.customerId
							})
						}}
						title="Address" />

					<SettingsSeparator />

					<CustomTouchable style={{
						paddingVertical: 15,
						paddingHorizontal: largePagePadding,
						flexDirection: 'row',
						justifyContent: 'space-between',
						alignItems: 'center',
						backgroundColor: 'white'
					}} onPress={() => {
						this.props.navigation.navigate('Chat', {
							fromCustomer: true,
							CustomerId: this.customerId,
						})
					}}
					>
						<View style={{
							justifyContent: 'center',
						}}>
							<TranslatedText style={{
								color: secondTextColor
							}} text={"Chat"} />
						</View>
						<View style={{
							flexDirection: 'row',
							alignItems: 'center',
							paddingLeft: 10,
						}}>
							{ActivePhone != null && ActivePhone != '' ?
								<CustomTouchable onPress={() => PhoneCall(ActivePhone)}>
									<AntDesign
										style={{
											marginHorizontal: 10,
										}}
										name={'phone'}
										size={20}
										color={mainTextColor}
									/>
								</CustomTouchable> : null}


							{ActivePhone != null && ActivePhone != '' ?
								<CustomTouchable onPress={() => Whatsapp(ActivePhone)}>
									<FontAwesome
										style={{
											marginHorizontal: 10,
										}}
										name={'whatsapp'}
										size={20}
										color={mainTextColor}
									/>
								</CustomTouchable> : null}

							<Ionicons
								style={{
									marginLeft: 10,
								}}
								name={I18nManager.isRTL ? 'ios-arrow-back' : 'ios-arrow-forward'}
								size={20}
								color={mainTextColor}
							/>
						</View>
					</CustomTouchable>

					<SettingsSeparator />

					<ArrowItem
						onPress={() => this.showModal()}
						title="UpdateVirtualMoney" />

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.testNotififcation.current.show()
						}}
						title="TestNotification"
					/>

					<SettingsSeparator />

					<ArrowItem
						onPress={() => {
							this.props.navigation.navigate('CustomerAffiliate', { Id: this.customerId })
						}}
						title="Affiliate"
					/>

					<SettingsTitle title={"Store"} />

					{this.isOrdersPermitted && <View>
						<ArrowItem
							onPress={() => {
								this.props.navigation.push('Orders', { Id: this.customerId })
							}}
							title="Orders" />

						<SettingsSeparator />
					</View>}

				</ScrollView>

				{CustomerTypes && <CustomSelector
					ref={this.typeSelectorRef}
					options={CustomerTypes.map(item => item.Name)}
					onSelect={(index) => { this.onChangeType(CustomerTypes[index]) }}
					onDismiss={() => { }}
				/>}

				{CustomerStatus && <CustomSelector
					ref={this.statusSelectorRef}
					options={CustomerStatus.map(item => item.Name)}
					onSelect={(index) => { this.onChangeStatus(CustomerStatus[index]) }}
					onDismiss={() => { }}
				/>}

				<ConfirmModal
					ref={this.testNotififcation}
					onConfirm={() => {
						TestNotificationForCustomer(this.customerId, res => {
							LongToast('TwoPushnotificaitonhavebeensent')
						})
					}}
				/>
			</LazyContainer>
		)
	}
}

const mapStateToProps = ({
	login: {
		Currency,
	},
}) => ({
	Currency
})

export default connect(mapStateToProps)(withLocalize(Customer))