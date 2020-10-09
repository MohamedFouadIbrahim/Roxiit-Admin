import React, { Component } from 'react'
import { ScrollView, View, ImageBackground } from 'react-native'
import { connect } from 'react-redux'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import SettingsTitle from '../../components/Settings/SettingsTitle.js';
import SettingsItem from '../../components/Settings/SettingsItem.js';
import SettingsSeparator from '../../components/Settings/SettingsSeparator.js';
import { largePagePadding, pagePadding, largeBorderRadius } from '../../constants/Style.js';
import FontedText from '../../components/FontedText/index.js';
import { ChangeCustomerType, ChangeCustomerStatus } from '../../services/CustomersService.js';
import { GetWarehouse } from "../../services/WarehousesService";
import { getFilters } from '../../services/FilterService.js';
import LinearGradient from 'react-native-linear-gradient';
import { SelectEntity } from '../../utils/EntitySelector';
import { EditWarehouseUsers } from '../../services/WarehousesService.js';
import { GetMyCurrentPostion, GpsPermisiton } from '../../utils/Location';
import { LongToast } from '../../utils/Toast.js';

class Warehouse extends Component {
	constructor(props) {
		super(props)

		const { Id } = this.props.route.params

		this.warehouseId = Id;

		this.state = {
			didFetchData: false,
			// loc
		}

		this.statusSelectorRef = React.createRef();
		this.typeSelectorRef = React.createRef();
	}
	componentWillUnmount() {
		this.cancelFetchDataGetCustomer && this.cancelFetchDataGetCustomer()
		this.cancelFetchDataChangeCustomerType && this.cancelFetchDataChangeCustomerType()
		this.cancelFetchDataChangeCustomerStatus && this.cancelFetchDataChangeCustomerStatus()
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
	onGetMyLocation = async () => {

		await GpsPermisiton(() => {

			GetMyCurrentPostion((data) => {

				this.setState({
					latitude: data.latitude,
					longitude: data.longitude,
					errorLocation: false
				})

			}, err => {
				this.setState({ errorLocation: true, latitude: 0, longitude: 0 })
			})

		}, () => { this.setState({ latitude: 0, longitude: 0 }) }, () => { this.setState({ latitude: 0, longitude: 0 }) })
	}
	fetchData = () => {
		const { warehouseId } = this
		this.cancelFetchDataGetCustomer = GetWarehouse(warehouseId, res => {

			const { latitude, longitude } = res.data

			if (latitude == null && longitude == null) {

				this.setState({
					...res.data,
					didFetchData: true
				}, () => {
					this.onGetMyLocation()
				})

			} else {

				this.setState({
					...res.data,
					didFetchData: true,
				})

			}

		})
	}

	submitUsers = (data) => {
		if (this.lockSubmitUsers) {
			return
		}

		this.lockSubmitUsers = true

		const {
			role,
			//data
			// Name, isSelected , Id
		} = this.state;



		this.cancelFetchDataEditCustomerInfo = EditWarehouseUsers(this.warehouseId,
			data,
			res => {
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange();
				this.lockSubmitUsers = false
			},
			err => {
				this.lockSubmitUsers = false;
			})
	}


	renderHeader = () => {
		const { Name, Country, City, isOpen } = this.state;


		return (
			<ImageBackground
				blurRadius={5}
				style={{ flex: 1, }}
			//	source={{ uri: this.state.didFetchData ? this.state.Media.ImageUrl : 'https://' }}
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

						<FontedText style={{ color: '#FFF', textAlign: 'center' }}>{Name}</FontedText>
						<FontedText style={{ color: '#e6f0f7' }}>{City ? `${City.Name}, ` : ''}{Country ? Country.Name : ''}</FontedText>
					</View>

					{isOpen && <View

						style={{
							flexDirection: 'row',
							position: 'absolute',
							top: pagePadding,
							right: pagePadding,
							justifyContent: 'center',
							alignItems: 'center',
							paddingHorizontal: 10,
							paddingVertical: 6,
							backgroundColor: "#32CD32",
							borderRadius: largeBorderRadius,
						}}>
						<FontedText style={{ color: 'white', fontSize: 11, }}>Open</FontedText>

					</View>}
				</LinearGradient>
			</ImageBackground>
		)
	}


	onChangeType = (Type) => {
		this.setState({ Type })
		this.cancelFetchDataChangeCustomerType = ChangeCustomerType(this.customerId, Type.Id, res => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		})
	}

	onChangeStatus = (Status) => {
		this.setState({ Status })
		this.cancelFetchDataChangeCustomerStatus = ChangeCustomerStatus(this.customerId, Status.Id, res => {
			this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		})
	}

	onChildChange = () => {
		this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
		this.fetchData()
	}

	render() {
		const { CustomerTypes, CustomerStatus, isOpen, Data } = this.state
		const { translate, ShowProductWarehouse } = this.props

		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Warehouse"} />

				<ScrollView
					contentContainerStyle={{

					}}>
					{this.renderHeader()}

					<SettingsTitle title={"Info"} />
					<SettingsItem
						onPress={() => {
							this.props.navigation.navigate('WarehouseBasicInfo', {
								Id: this.warehouseId,
								onChildChange: this.onChildChange,
							})
						}}
						info="BasicInfo" />

					<SettingsSeparator />

					<SettingsItem
						onPress={() => {
							this.props.navigation.navigate('WarehouseAddress', {
								Id: this.warehouseId,
								onChildChange: this.onChildChange,
							})
						}}
						info="Address" />

					<SettingsSeparator />

					<SettingsItem
						onPress={() => {
							this.props.navigation.navigate('WarehouseWorkinghours', {
								Id: this.warehouseId,
								onChildChange: this.onChildChange,
							})
						}}
						info="WorkingHours" />

					<SettingsSeparator />

					<SettingsItem
						onPress={() => {
							SelectEntity(this.props.navigation, data => {
								this.submitUsers(data);
							}, `Warehouse/Users`, `warehouseId=${this.warehouseId}`, false, 2, [])
						}}
						info="Users" />

					<SettingsSeparator />

					<SettingsItem
						onPress={() => {
							const { latitude, longitude, Id } = this.state


							if (latitude == null && longitude == null) {

								this.onGetMyLocation().then(() => {
									if (this.state.errorLocation) {
										this.setState({ errorLocation: false })
										LongToast('Gps')
									}
								}).then(() => {
									this.props.navigation.navigate('WherehousesCheckIn', {
										latitude,
										longitude,
										Id,
										onChildChange: this.fetchData
									})
								})

							} else {
								this.props.navigation.navigate('WherehousesCheckIn', {
									latitude,
									longitude,
									Id,
									onChildChange: this.fetchData
								})
							}

						}}
						info="GpsCheckin" />

					{ShowProductWarehouse && ShowProductWarehouse.Value && <View>
						<SettingsSeparator />

						<SettingsItem
							onPress={() => {

								const { Id } = this.state
								this.props.navigation.navigate('WherehouseProudcts', {
									Id,
									onChildChange: this.fetchData
								})
							}}
							info="Products" />
					</View>}
				</ScrollView>
			</LazyContainer>
		)
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

export default connect(mapStateToProps)(withLocalize(Warehouse))