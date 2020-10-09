import React, { Component } from 'react'
import { View } from 'react-native'
import LazyContainer from '../../components/LazyContainer';
import CustomHeader from '../../components/CustomHeader';
import AnalyticsItem from './AnalyticsItem';
import RemoteDataContainer from '../../components/RemoteDataContainer';
import Ionicons from 'react-native-vector-icons/Ionicons'
import { pagePadding } from '../../constants/Style';
import { mainColor } from '../../constants/Colors';
import CustomDatePicker from '../../components/CustomDatePicker';
import { formatDate } from '../../utils/Date';
import FontedText from '../../components/FontedText';
import CustomTouchable from '../../components/CustomTouchable';
import CustomSelector from '../../components/CustomSelector';
import ItemSeparator from '../../components/ItemSeparator';
import ArrowItem from '../../components/ArrowItem';
import { connect } from 'react-redux';
import { getFilters } from '../../services/FilterService.js';
import { withLocalize } from 'react-localize-redux';

class Analytics extends Component {
	constructor() {
		super()

		const dateLastMonth = new Date();
		dateLastMonth.setDate(dateLastMonth.getDate() - 30);

		this.state = {
			isFromDatePickerVisible: false,
			from: dateLastMonth.toISOString(),
			to: new Date().toISOString()
		}
		this.subStoreSelectorRef = React.createRef()
	}

	componentDidMount() {
		this.cancelFetchData = getFilters({
			subStores: true,
		}, res => {
			this.setState({
				...res.data,
				didFetchData: true,
			})
		})
	}

	renderItem = ({ item }) => {
		return (
			<AnalyticsItem
				item={item} />
		)
	}

	showFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: true });
	}

	hideFromDateTimePicker = () => {
		this.setState({ isFromDatePickerVisible: false });
	}

	showToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: true });
	}

	hideToDateTimePicker = () => {
		this.setState({ isToDatePickerVisible: false });
	}

	renderDatePickers = () => {
		const { from, to } = this.state

		if (from && to) {
			return (
				<View
					style={{
						backgroundColor: 'white',
						flexDirection: 'row',
						borderBottomColor: '#aaaaaa',
						borderBottomWidth: 0.5,
					}}>
					<CustomTouchable
						onPress={() => {
							this.showFromDateTimePicker()
						}}
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'flex-start',
							paddingLeft: pagePadding,
						}}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<FontedText style={{ color: mainColor }}>{formatDate(from)}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={24}
								color={mainColor}
								style={{
									marginLeft: 5,
								}} />
						</View>
					</CustomTouchable>

					<View
						style={{
							flex: 1.5,
							justifyContent: 'center',
							alignItems: 'center',
							paddingVertical: pagePadding,
						}}>
						<Ionicons
							name={"ios-arrow-round-forward"}
							size={26}
							color={mainColor} />
					</View>

					<CustomTouchable
						onPress={() => {
							this.showToDateTimePicker()
						}}
						style={{
							flex: 2,
							justifyContent: 'center',
							alignItems: 'flex-end',
							paddingRight: pagePadding,
						}}>
						<View
							style={{
								flexDirection: 'row',
								alignItems: 'center',
							}}>
							<FontedText style={{ color: mainColor }}>{formatDate(to)}</FontedText>

							<Ionicons
								name={"md-arrow-dropdown"}
								size={24}
								color={mainColor}
								style={{
									marginLeft: 5,
								}} />
						</View>
					</CustomTouchable>
				</View>
			)
		}
	}

	addParamsSeparator = (params) => {
		return params.length ? '&' : ''
	}
	
	getRequestParams = () => {
		const { from, to, SubStore } = this.state

		let params = ''

		if (from && to) {
			params += `${this.addParamsSeparator(params)}from=${from}&to=${to}`
		}

		if (SubStore) {
			params += `${this.addParamsSeparator(params)}subStoreId=${SubStore.Id}`
		}
		return params
	}

	render() {
		const { from, to, isFromDatePickerVisible, isToDatePickerVisible, SubStore, didFetchData, SubStores } = this.state

		const {
			StoreTypeId,
		} = this.props.hello_data

		const { translate } = this.props

		if (!didFetchData) {
			return null
		}

		return (
			<LazyContainer
				style={{
					flex: 1,
					backgroundColor: 'white'
				}}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Analytics" />

				{this.renderDatePickers()}

				{StoreTypeId == 3 && <View>
					<ItemSeparator />

					<ArrowItem
						style={{ paddingHorizontal: pagePadding }}
						onPress={() => {
							this.subStoreSelectorRef.current.show()
						}}
						title={'SubStore'}
						info={SubStore ? SubStore.Name : translate('NoneSelected')} />

					<ItemSeparator />
				</View>}

				<RemoteDataContainer
					url={"Analytics"}
					params={this.getRequestParams()}
					cacheName={"analytics"}
					pagination={false}
					keyExtractor={({ Title, Type }) => `${Title}${Type}`}
					renderItem={this.renderItem} />

				{from && <CustomDatePicker
					isVisible={isFromDatePickerVisible}
					date={from}
					onDatePicked={(date) => {
						this.setState({
							from: date,
						})

						this.hideFromDateTimePicker()
					}}
					onCancel={this.hideFromDateTimePicker} />}

				{to && <CustomDatePicker
					isVisible={isToDatePickerVisible}
					date={to}
					onDatePicked={(date) => {
						this.setState({
							to: date,
						})

						this.hideToDateTimePicker()
					}}
					onCancel={this.hideToDateTimePicker} />}

				{SubStores && <CustomSelector
					ref={this.subStoreSelectorRef}
					options={SubStores.map(item => item.Name)}
					onSelect={(index) => { this.setState({ SubStore: SubStores[index] }) }}
					onDismiss={() => { }}
				/>}

			</LazyContainer>
		);
	}
}


const mapStateToProps = ({
	login: {
		hello_data
	},
}) => ({
	hello_data,
})

export default connect(mapStateToProps)(withLocalize(Analytics))