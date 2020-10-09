import React, { Component } from 'react'
import { ScrollView, KeyboardAvoidingView, Platform, View } from 'react-native'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import LazyContainer from '../../components/LazyContainer'
import ItemSeparator from '../../components/ItemSeparator/index.js';
import HorizontalInput from '../../components/HorizontalInput/index.js';
import ArrowItem from '../../components/ArrowItem/index.js';
import SwitchItem from '../../components/SwitchItem';
import { getFilters } from '../../services/FilterService';
import CustomSelector from '../../components/CustomSelector';
import CustomDatePicker from '../../components/CustomDatePicker';
import { formatDate } from '../../utils/Date';
import { withLocalize } from 'react-localize-redux';
import { largePagePadding } from '../../constants/Style';
import CustomButton from '../../components/CustomButton';
import { SelectEntity } from '../../utils/EntitySelector';
import { STRING_LENGTH_MEDIUM, STRING_LENGTH_SHORT } from '../../constants/Config';
import { LongToast } from '../../utils/Toast';
import { mainColor } from '../../constants/Colors';


class DiscountInfo extends Component {
	constructor(props) {
		super(props)

		this.state = {
			isDateTimePickerVisible: false,
			editingStartDate: false,
		}

		this.tabIndex = 0

		this.discountTypesSelector = React.createRef()
		this.discountLimitationsSelector = React.createRef()

	}
	componentWillUnmount() {
		this.cancelFetchDiscountLimitations && this.cancelFetchDiscountLimitations()
		this.cancelFetchDiscountTypes && this.cancelFetchDiscountTypes()
	}

	componentDidMount() {

		const {
			Name,
			DiscountPercentage,
			DiscountAmount,
			MaximumDiscountAmount,
			MinOrderValue,
			CouponCode,
			LimitationTimes
		} = this.props.data

		this.setState({
			Name,
			DiscountPercentage,
			DiscountAmount,
			MaximumDiscountAmount,
			MinOrderValue,
			CouponCode,
			LimitationTimes
		})
	}

	showDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: true });
	}

	hideDateTimePicker = () => {
		this.setState({ isDateTimePickerVisible: false });
	}


	renderContent = () => {

		const {
			DiscountType,
			DiscountLimitation,
			// IsCumulative,
			ShowInWebsite,

			StartDateUtc,
			EndDateUtc,
			DefaultLimitation,
			DefaultDiscountType,
		} = this.props.data

		const {
			Name,
			DiscountPercentage,
			DiscountAmount,
			MaximumDiscountAmount,
			MinOrderValue,
			CouponCode,
			LimitationTimes
		} = this.state


		return (
			<ScrollView
				contentContainerStyle={{

				}}
				style={{
					flex: 1
				}}
			>
				<HorizontalInput
					maxLength={STRING_LENGTH_MEDIUM}
					label="Name"
					value={Name}
					onChangeText={(text) => {
						this.setState({
							Name: text,
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								Name: text,
							}, false)
						})
					}} />

				<ItemSeparator />

				<HorizontalInput
					label="DiscountPercentage"
					keyboardType="numeric"
					value={DiscountPercentage != null ? DiscountPercentage > 100 ? String(100) : String(DiscountPercentage) : null}
					onChangeText={(text) => {
						this.setState({
							DiscountPercentage: text
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								DiscountPercentage: text,
							}, false)
						})
					}} />

				<ItemSeparator />

				<HorizontalInput
					label="DiscountAmount"
					keyboardType="numeric"
					value={DiscountAmount != null ? String(DiscountAmount) : null}
					onChangeText={(text) => {
						this.setState({
							DiscountAmount: text
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
							}, false)
						})
					}} />

				<ItemSeparator />

				<HorizontalInput
					label="MaximumDiscountAmount"
					keyboardType="numeric"
					value={MaximumDiscountAmount != null ? String(MaximumDiscountAmount) : null}
					onChangeText={(text) => {
						this.setState({
							MaximumDiscountAmount: text
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								MaximumDiscountAmount: text,
							}, false)
						})

					}} />

				<ItemSeparator />

				<HorizontalInput
					label="MinOrderValue"
					keyboardType="numeric"
					value={MinOrderValue != null ? String(MinOrderValue) : null}
					onChangeText={(text) => {
						this.setState({
							MinOrderValue: text
						}, () => {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								MinOrderValue: text,
							}, false)
						})

					}} />

				<ItemSeparator />

				<View>

					<HorizontalInput
						maxLength={STRING_LENGTH_SHORT}
						label="CouponCode"
						value={CouponCode}
						style={{ paddingRight: 30 }}
						onChangeText={(text) => {
							this.setState({
								CouponCode: text
							}, () => {
								this.props.onTabDataChange(this.tabIndex, {
									...this.props.data,
									CouponCode: text,
								}, false)
							})
						}}
						onBlur={() => {
							this.cancelFetchData = this.props.checkCouponDuplication(CouponCode, duplicated => {
								if (duplicated) {
									LongToast('CouponCodeDuplicated')
									this.setState({
										CouponCode: ""
									}, () => {
										this.props.onTabDataChange(this.tabIndex, {
											...this.props.data,
											CouponCode: "",
										}, false)
									})

								}
							})
						}} />

					<MaterialCommunityIcons
						name='qrcode'
						style={{ position: 'absolute', right: 20, top: 20, }}
						size={30}
						color={mainColor}
						onPress={() => {
							this.props.navigation.navigate('DiscountQRCode', {
								QRCode: CouponCode
							})
						}}
					/>

				</View>

				<ItemSeparator />

				<SwitchItem
					title="ShowInWebsite"
					value={ShowInWebsite}
					onValueChange={(value) => {
						this.props.onTabDataChange(this.tabIndex, {
							...this.props.data,
							ShowInWebsite: value,
						})
					}} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.cancelFetchDiscountTypes = getFilters({
							discountTypes: true,
						}, res => {
							this.setState({
								...res.data,
							})
							this.discountTypesSelector.current.show()
						})
					}}
					title={'DiscountType'}
					info={DiscountType ? DiscountType.Name : DefaultDiscountType.Name}
				/>

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.cancelFetchDiscountLimitations = getFilters({
							discountLimitations: true,
						}, res => {
							this.setState({
								...res.data,
							})
							this.discountLimitationsSelector.current.show()
						})
					}}
					title={'DiscountLimitation'}
					info={DiscountLimitation ? DiscountLimitation.Name : DefaultLimitation.Name}
				/>

				<ItemSeparator />

				{DiscountLimitation && DiscountLimitation.Id !== 1 ?
					<HorizontalInput
						label="LimitationTimes"
						keyboardType="numeric"
						value={`${LimitationTimes}`}
						onChangeText={(text) => {
							this.setState({
								LimitationTimes: text,
							}, () => {
								this.props.onTabDataChange(this.tabIndex, {
									...this.props.data,
									LimitationTimes: text,
								}, false)
							})

						}} /> : null
				}


				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.setState({ editingStartDate: true, })
						this.showDateTimePicker()
					}}
					title={'StartDate'}
					info={formatDate(StartDateUtc)} />

				<ItemSeparator />

				<ArrowItem
					onPress={() => {
						this.setState({ editingStartDate: false, })
						this.showDateTimePicker()
					}}
					title={'EndDate'}
					info={formatDate(EndDateUtc)} />

				{this.props.discountId && <CustomButton
					onPress={() => {
						SelectEntity(this.props.navigation,
							() => { },
							`Discount/Products`,
							`discountId=${this.props.discountId}`,
							true,
							0
						)
					}}
					style={{
						margin: largePagePadding,
					}}
					title='Products' />}
			</ScrollView>
		)
	}

	render() {
		const {
			DiscountLimitations,
			DiscountTypeList,
			editingStartDate,
			isDateTimePickerVisible,
		} = this.state

		const {
			StartDateUtc,
			EndDateUtc,
		} = this.props.data
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "white" }}>
				{
					Platform.OS == 'ios' ?

						<KeyboardAvoidingView behavior='padding' enabled
							style={{ flex: 1 }}
							keyboardVerticalOffset={120}
						>
							{this.renderContent()}
						</KeyboardAvoidingView> :
						this.renderContent()
				}

				{DiscountTypeList && <CustomSelector
					ref={this.discountTypesSelector}
					options={DiscountTypeList.map(item => item.Name)}
					onSelect={(index) => {
						this.props.onTabDataChange(this.tabIndex, {
							...this.props.data,
							DiscountType: DiscountTypeList[index],
						})
					}}
					onDismiss={() => { }}
				/>}

				{DiscountLimitations && <CustomSelector
					ref={this.discountLimitationsSelector}
					options={DiscountLimitations.map(item => item.Name)}
					onSelect={(index) => {
						this.props.onTabDataChange(this.tabIndex, {
							...this.props.data,
							DiscountLimitation: DiscountLimitations[index],
						})
					}}
					onDismiss={() => { }}
				/>}

				<CustomDatePicker
					isVisible={isDateTimePickerVisible}
					date={editingStartDate ? StartDateUtc : EndDateUtc}
					onDatePicked={(date) => {
						if (editingStartDate) {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								StartDateUtc: date,
							})
						}
						else {
							this.props.onTabDataChange(this.tabIndex, {
								...this.props.data,
								EndDateUtc: date,
							})
						}

						this.hideDateTimePicker()
					}}
					onCancel={this.hideDateTimePicker} />
			</LazyContainer>
		)
	}
}

export default withLocalize(DiscountInfo)