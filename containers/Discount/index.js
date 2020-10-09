import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { Component } from 'react';
import { withLocalize } from 'react-localize-redux';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import LazyContainer from '../../components/LazyContainer';
import { mainColor, secondColor } from '../../constants/Colors';
import { AddEditDiscount, GetDiscount, IsCouponCodeDuplicated } from '../../services/DiscountsService';
import { getFilters } from '../../services/FilterService';
import { LongToast } from '../../utils/Toast';
import DiscountApplyFor from './DiscountApplyFor';
import DiscountFree from './DiscountFree';
import DiscountInfo from './DiscountInfo';
import DiscountRestriction from './DiscountRestriction';


class Discount extends Component {
	constructor(props) {
		super(props)

		if (this.props.route.params && this.props.route.params?.Id) {
			this.editMode = true
			this.discountId = this.props.route.params?.Id,
				this.defaultValues = {}
		}
		else {
			this.editMode = false
			this.didFetchData = false
			this.defaultValues = {
				BasicInfo: {
					Name: "",
					DiscountPercentage: "",
					DiscountAmount: "",
					MaximumDiscountAmount: "",
					MinOrderValue: "",
					LimitationTimes: "",
					ShowInWebsite: false,
					DefaultLimitation: {
						Id: 1,
						Name: "unlimeted "
					},
					CouponCode: this.generate_random_string(),
					DefaultDiscountType: {
						Id: 1,
						Name: "assigned to total "
					}
				},
				ApplyFor: {
					ApplyForChildCategory: false,
					ApplyForBrand: [],
					ApplyForProduct: [],
					ApplyForCategory: []
				},
				Restriction: {
					SpentAmountRestriction: "",
					CustomerRoleRestriction: [],
					CustomerRestriction: [],
					ToCountryRestriction: [],
					ShippingRestriction: [],
				},
				Free: {
					MaxFreeProductsPerSubStore: null,
					MaxFreeProducts: null,
					TimeBetweenFreeProducts: null,
					TimeBetweenFreeProductsPerSubStore: null,
					ValidatyFromApplyInDays: null,
					FreeProducts: []
				}
			}
		}

		this.state = {
			lockSubmit: false,
			didFetchData: false,
			...this.defaultValues,
		}

		this.BasicInfo = Object.assign({}, this.state.BasicInfo)
		this.Restriction = Object.assign({}, this.state.Restriction)
		this.Free = Object.assign({}, this.state.Free)
		this.lockSubmit = false
	}
	generate_random_string = () => {
		let random_string = '';
		let random_ascii;
		for (let i = 0; i < 10; i++) {
			random_ascii = Math.floor((Math.random() * 25) + 97);
			random_string += String.fromCharCode(random_ascii)
		}
		return random_string.toUpperCase()
	}

	componentWillUnmount() {
		this.cancelFetchDataGetDiscount && this.cancelFetchDataGetDiscount()
		this.cancelFetchDataAddEditDiscount && this.cancelFetchDataAddEditDiscount()
	}

	componentDidMount() {
		if (this.discountId) {
			this.cancelFetchDataGetDiscount = GetDiscount(this.discountId, res => {
				const {
					ApplyFor,
					Restriction,
					...restData
				} = res.data
				const {
					ApplyForChildCategory,
					ApplyForBrand,
					ApplyForCategory,
					ApplyForProduct,
				} = ApplyFor

				const {
					CustomerRoleRestriction,
					CustomerRestriction,
					SpentAmountRestriction,
					ToCountryRestriction,
					ShippingRestriction,
				} = Restriction

				this.BasicInfo = Object.assign({}, res.data.BasicInfo)

				this.Free = Object.assign({}, res.data.Free)
				this.Restriction = {
					SpentAmountRestriction,
					CustomerRoleRestriction: CustomerRoleRestriction,
					CustomerRestriction: CustomerRestriction,
					ToCountryRestriction: ToCountryRestriction,
				}
				this.didFetchData = true

				this.setState({
					...restData,
					ApplyFor: {
						ApplyForChildCategory,
						ApplyForBrand,
						ApplyForCategory,
						ApplyForProduct
					},
					Restriction: {
						SpentAmountRestriction,
						CustomerRoleRestriction: CustomerRoleRestriction,
						CustomerRestriction: CustomerRestriction,
						ToCountryRestriction: ToCountryRestriction,
					},
					didFetchData: true,
				})

			})
		}

		getFilters({
			discountTypes: true,
		}, res => {
			this.setState({
				BasicInfo: {
					...this.state.BasicInfo,
					DefaultDiscountType: res.data.DiscountTypeList[1]
				}
			})

			this.BasicInfo = {
				...this.BasicInfo,
				DefaultDiscountType: res.data.DiscountTypeList[1]
			}
		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}

		const { BasicInfo, ApplyFor, Restriction, Free } = this.state
		const { translate } = this.props

		const {
			RequiresCouponCode = false,
			IsCumulative = false,
			ShowInWebsite = false,
			DiscountType,
			DiscountLimitation,
			LimitationTimes,
			StartDateUtc,
			EndDateUtc,
			DefaultDiscountType,
			DefaultLimitation
		} = BasicInfo

		const {
			Name,
			DiscountPercentage,
			DiscountAmount,
			MaximumDiscountAmount,
			MinOrderValue,
			CouponCode,
		} = this.BasicInfo

		const {
			ApplyForChildCategory = false,
			ApplyForBrand,
			ApplyForCategory,
			ApplyForProduct,
		} = ApplyFor

		const {
			CustomerRoleRestriction,
			CustomerRestriction,
			ToCountryRestriction,
		} = Restriction

		const {
			SpentAmountRestriction
		} = this.Restriction

		const {
			FreeProducts
		} = Free

		const {
			MaxFreeProductsPerSubStore,
			MaxFreeProducts,
			TimeBetweenFreeProducts,
			TimeBetweenFreeProductsPerSubStore,
			ValidatyFromApplyInDays
		} = this.Free

		const DiscountLimitationFromScreen = DiscountLimitation ? DiscountLimitation.Id : 1

		if (!Name || !CouponCode || DiscountPercentage == null || !DiscountPercentage ||
			(DiscountLimitationFromScreen !== 1 && !LimitationTimes) || DiscountAmount < 0) {
			return LongToast('CantHaveEmptyInputs')
		}

		if (DiscountPercentage < 0 || DiscountAmount < 0 || MaximumDiscountAmount < 0 || LimitationTimes < 0 || SpentAmountRestriction < 0 || DiscountPercentage < 0 || MinOrderValue < 0) {
			return LongToast('NegativeValidation')
		}
		const StartDate = new Date(StartDateUtc)
		const EndDate = new Date(EndDateUtc)

		if (StartDate > EndDate) {
			return LongToast('DateValidation')
		}


		if (this.editMode) {
			this.setState({ lockSubmit: true })
			this.lockSubmit = true

			this.cancelFetchDataAddEditDiscount = AddEditDiscount({
				Id: this.discountId,
				Name,
				DiscountTypeId: DiscountType.Id,
				DiscountPercentage: DiscountPercentage >= 100 ? 100 : DiscountPercentage,
				DiscountAmount,
				MaximumDiscountAmount,
				MinOrderValue,
				ShowInWebsite,
				StartDateUtc,
				EndDateUtc,
				CouponCode,
				DiscountLimitationId: DiscountLimitation.Id,
				LimitationTimes: DiscountLimitation.Id === 1 ? 0 : LimitationTimes,
				ApplyForChildCategory,
				ApplyForBrand: ApplyForBrand.length ? ApplyForBrand.map(item => item.Id) : [],
				ApplyForProduct: ApplyForProduct.length ? ApplyForProduct.map(item => item.Id) : [],
				ApplyForCategory: ApplyForCategory.length ? ApplyForCategory.map(item => item.Id) : [],
				CustomerRoleRestriction: CustomerRoleRestriction ? CustomerRoleRestriction.map(item => item.Id) : [],
				CustomerRestriction: CustomerRestriction.length ? CustomerRestriction.map(item => item.Id) : [],
				SpentAmountRestriction,
				ToCountryRestriction: ToCountryRestriction.map(item => item.Id),
				MaxFreeProductsPerSubStore,
				MaxFreeProducts,
				TimeBetweenFreeProducts,
				TimeBetweenFreeProductsPerSubStore,
				ValidatyFromApplyInDays,
				FreeProducts: FreeProducts ? FreeProducts.map(item => item.Id) : []
			}, res => {
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {
				this.setState({ lockSubmit: false })
				this.lockSubmit = false

				if (err.status === 400) {
					LongToast('CouponCodeDuplicated')
					return true
				}
			})
		}
		else {
			this.setState({ lockSubmit: true })
			this.lockSubmit = true

			this.cancelFetchDataAddEditDiscount = AddEditDiscount({
				Id: 0,
				Name,
				DiscountTypeId: DiscountType ? DiscountType.Id : DefaultDiscountType.Id,
				DiscountPercentage: DiscountPercentage >= 100 ? 100 : DiscountPercentage,
				DiscountAmount,
				MaximumDiscountAmount,
				MinOrderValue,
				ShowInWebsite,
				StartDateUtc,
				EndDateUtc,
				CouponCode,
				DiscountLimitationId: DiscountLimitation ? DiscountLimitation.Id : DefaultLimitation.Id,
				LimitationTimes: this.handel(DiscountLimitation, LimitationTimes, DefaultLimitation),
				ApplyForChildCategory,
				ApplyForBrand: ApplyForBrand.length ? ApplyForBrand.map(item => item.Id) : [],
				ApplyForProduct: ApplyForProduct.length ? ApplyForProduct.map(item => item.Id) : [],
				ApplyForCategory: ApplyForCategory.length ? ApplyForCategory.map(item => item.Id) : [],
				CustomerRoleRestriction: CustomerRoleRestriction ? CustomerRoleRestriction.map(item => item.Id) : [],
				CustomerRestriction: CustomerRestriction.length ? CustomerRestriction.map(item => item.Id) : [],
				SpentAmountRestriction,
				ToCountryRestriction: ToCountryRestriction.map(item => item.Id),
				RequiresCouponCode,
				IsCumulative,
				MaxFreeProductsPerSubStore,
				MaxFreeProducts,
				TimeBetweenFreeProducts,
				TimeBetweenFreeProductsPerSubStore,
				ValidatyFromApplyInDays,
				FreeProducts: FreeProducts ? FreeProducts.map(item => item.Id) : []
			}, res => {
				this.setState({ didSucceed: true, })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, err => {

				this.setState({ lockSubmit: false })
				this.lockSubmit = false

				if (err.status === 400) {
					LongToast('CouponCodeDuplicated')
					return true
				}
			})
		}
	}
	handel = (DiscountLimitation, LimitationTimes, DefaultLimitation) => {
		if (DiscountLimitation) {
			if (DiscountLimitation.Id == 1) {
				return 0
			} else {
				return LimitationTimes
			}
		} else {
			return DefaultLimitation.Id
		}
	}
	checkCouponDuplication = (CouponCode, callback) => {
		if (this.props.navigation.isFocused() && !this.lockSubmit && CouponCode && CouponCode.length) {
			this.lockSubmit = true
			this.setState({ lockSubmit: true })

			IsCouponCodeDuplicated(this.props.discountId, CouponCode, (duplicated) => {
				callback && callback(duplicated)
				this.lockSubmit = false
				this.setState({ lockSubmit: false })
			}, this.cancelCouponDuplicationCheck)
		}
	}

	renderContent = () => {

		const {
			Name,
			DiscountPercentage,
			DiscountAmount,
			MaximumDiscountAmount,
			MinOrderValue,
			CouponCode,
			LimitationTimes
		} = this.BasicInfo

		const {
			SpentAmountRestriction
		} = this.Restriction

		const {
			MaxFreeProductsPerSubStore,
			MaxFreeProducts,
			TimeBetweenFreeProducts,
			TimeBetweenFreeProductsPerSubStore,
			ValidatyFromApplyInDays
		} = this.Free

		if ((this.state.didFetchData && this.didFetchData) || !this.editMode) {
			return (
				<DiscountTabNavigator
					screenProps={{
						stackNavigation: this.props.navigation,
						BasicInfo: {
							...this.state.BasicInfo,
							Name,
							DiscountPercentage,
							DiscountAmount,
							MaximumDiscountAmount,
							MinOrderValue,
							CouponCode,
							LimitationTimes
						},
						ApplyFor: this.state.ApplyFor,
						Free: {
							...this.state.Free,
							MaxFreeProductsPerSubStore,
							MaxFreeProducts,
							TimeBetweenFreeProducts,
							TimeBetweenFreeProductsPerSubStore,
							ValidatyFromApplyInDays,
						},
						Restriction: { ...this.state.Restriction, SpentAmountRestriction },
						onTabDataChange: this.onTabDataChange,
						checkCouponDuplication: this.checkCouponDuplication,
						translate: this.props.translate,
						discountId: this.discountId,
					}} />

			)
		}
	}

	onTabDataChange = (tab, data, setState = true) => {
		switch (tab) {
			case 0:
				if (setState) {
					this.setState({
						BasicInfo: {
							...data,
						}
					})
				} else {
					this.BasicInfo = {
						...data
					}
				}
				break;
			case 1:
				this.setState({
					ApplyFor: {
						...data,
					}
				})
				break;
			case 2:
				if (setState) {
					this.setState({
						Restriction: {
							...data,
						}
					})
				} else {
					this.Restriction = {
						...data
					}
				}
				break;
			case 3:
				if (setState) {
					this.setState({
						Free: {
							...data,
						}
					})
				} else {
					this.Free = {
						...data
					}
				}
				break;
			case null:           //if the change affects all the tabs               
				this.setState({
					...data,
				})
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: 'white' }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Discount"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}
			</LazyContainer>
		)
	}
}

const Tabs = createMaterialTopTabNavigator()

const DiscountTabNavigator = ({ screenProps, navigation, screenProps: { translate } }) => {

	const DiscountInfoTab = () => (
		<DiscountInfo
			data={screenProps.BasicInfo}
			discountId={screenProps.discountId}
			onTabDataChange={screenProps.onTabDataChange}
			checkCouponDuplication={screenProps.checkCouponDuplication}
			navigation={screenProps.stackNavigation}
			tabNavigation={navigation} />
	)

	const DiscountApplyForTab = () => (
		<DiscountApplyFor
			data={screenProps.ApplyFor}
			discountId={screenProps.discountId}
			onTabDataChange={screenProps.onTabDataChange}
			navigation={screenProps.stackNavigation}
			tabNavigation={navigation} />
	)


	const DiscountRestrictionTab = () => (
		<DiscountRestriction
			data={screenProps.Restriction}
			discountId={screenProps.discountId}
			onTabDataChange={screenProps.onTabDataChange}
			navigation={screenProps.stackNavigation}
			tabNavigation={navigation} />
	)

	const DiscountFreeTab = () => (
		<DiscountFree
			data={screenProps.Free}
			discountId={screenProps.discountId}
			onTabDataChange={screenProps.onTabDataChange}
			navigation={screenProps.stackNavigation}
			tabNavigation={navigation} />
	)

	return (
		<Tabs.Navigator
			lazy={true}
			tabBarOptions={{
				labelStyle: {
					fontSize: 12,
					color: mainColor,
				},
				indicatorStyle: {
					backgroundColor: secondColor,
				},
				style: {
					backgroundColor: 'white',
				}
			}}
		>

			<Tabs.Screen
				name='Info'
				component={DiscountInfoTab}
				options={{ title: translate('Info') }}
			/>

			<Tabs.Screen
				name='ApplyFor'
				component={DiscountApplyForTab}
				options={{
					title: translate('ApplyFor')
				}}
			/>

			<Tabs.Screen
				name='Restriction'
				component={DiscountRestrictionTab}
				options={{ title: translate('Restriction') }}
			/>

			<Tabs.Screen
				name='Free'
				component={DiscountFreeTab}
				options={{ title: translate('Free') }}
			/>

		</Tabs.Navigator>
	)
}

export default withLocalize(Discount)