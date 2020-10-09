import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { ActivityIndicator } from 'react-native';
import { connect } from 'react-redux';
import CustomHeader from '../../components/CustomHeader';
import HeaderSubmitButton from '../../components/HeaderSubmitButton';
import { mainColor, secondColor } from '../../constants/Colors';
import { getFilters } from '../../services/FilterService';
import { AddProduct, GETProductNew } from '../../services/ProductService';
import { LongToast } from '../../utils/Toast';
import NewProductRequiredFeild from './NewProductRequiredFeild';
import NewProudctOptionalFeild from './NewProudctOptionalFeild';



class NewProductIndex extends React.Component {
	constructor(props) {
		super(props)

		const { languages_data, currLang } = this.props
		const selectedCategories = this.props.route.params?.Categories || []

		this.defaultValues = {
			Currency: this.props.Currency,
			Required: {
				Language: languages_data.find(item => item.code === currLang),
				Images: [],
				Name: null,
				AltName: null,
				ShortDescription: null,
				Price: null,
				SalePrice: null,
				RealPrice: null,
				prossesEvent: 0
			},
			Optional: {
				Description: null,
				Type: null,
				visibility: null,
				status: null,
				Warehouse: null,
				selectedCategories: selectedCategories && selectedCategories.length ? selectedCategories : [],
				SubStore: null,
				selectedOptions: [],
				ExtraPrice: null,
			}
		}

		this.state = {
			...this.defaultValues,
			lockSubmit: false,
			didFetchData: false,
		}
		this.lockSubmit = false

		this.Required = Object.assign({}, this.state.Required) // this is for Keyboard Hide Issue We will Store Data Here insted Of State To Avoid Rerender The Component
	}

	componentDidMount() {
		this.cancelFetchDatagetFilters = getFilters({
			productStatus: true,
			productVisibility: true,
			productTypes: true,
			subStores: true
		}, res => {

			GETProductNew(resPro => {

				const {
					ProductTypes,
					ProductVisibility,
					ProductStatus,
					SubStores
				} = res.data

				const { Warehouses } = resPro.data
				this.setState({
					Optional: {
						...this.state.Optional,
						ProductTypes,
						ProductVisibility,
						ProductStatus,
						SubStores,
						Warehouses: Warehouses.map(item => ({ ...item, IsSelected: false })),
					},
					didFetchData: true
				})
			})

		})
	}

	submit = () => {
		if (this.lockSubmit) {
			return
		}


		const {
			Language,
			Images,
			Name,
			Price,
			SalePrice,
			AltName,
			ShortDescription,
			RealPrice
		} = this.state.Required

		const {
			Description,
			Type,
			status,
			visibility,
			selectedCategories,
			Warehouses,
			SubStore,
			selectedOptions,
			ProductTypes,
			ProductVisibility,
			ProductStatus,
			ExtraPrice,
		} = this.state.Optional

		const { Currency } = this.state
		if (!Name || !Price || !Language) {
			return LongToast('CantHaveEmptyInputs')
		}
		else if (SalePrice && Number.isNaN(parseFloat(SalePrice.toString()))) {
			LongToast('EnterVaildSalePrice')
			return
		} else if (RealPrice && Number.isNaN(parseFloat(RealPrice.toString()))) {
			LongToast('EnterVaildRealPrice')
			return
		}
		else {
			this.setState({ lockSubmit: true, uploadingImage: true, prossesEvent: 0 })

			this.cancelFetchDataAddProduct = AddProduct({
				Status: status ? status.Id : ProductStatus.find(item => item.Id == 4).Id,
				Visibility: visibility ? visibility.Id : ProductVisibility.find(item => item.Id == 1).Id,
				Type: Type ? Type.Id : ProductTypes.find(item => item.Id == 1).Id,
				Name,
				ShortDescription,
				Description,
				Price: parseFloat(Price.toString()),
				RealPrice: RealPrice ? parseFloat(RealPrice.toString()) : null,
				selectedCategories: selectedCategories && selectedCategories.length ? selectedCategories.map(item => item.Id) : [],
				languageId: Language.key,
				SalePrice: SalePrice ? parseFloat(SalePrice.toString()) : null,
				SubStoreId: SubStore ? SubStore.Id : null,
				Warehouses,
				AltName,
				Images: Images,
				OptionMembers: selectedOptions.map(item => item.Id),
				ExtraPrice: ExtraPrice ? parseFloat(ExtraPrice.toString()) : null,
				Currency: Currency.Id
			}, res => {
				this.setState({ lockSubmit: false })
				this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
				this.props.navigation.goBack()
			}, (err) => {
				const NewImage = this.state.Required.Images.map(item => ({ ...item, IsLoading: false, prossesEvent: 0 }))
				this.setState({ lockSubmit: false, Required: { ...this.state.Required, Images: NewImage } })
				this.lockSubmit = false
			}, (prossesEvent) => {
				this.setState({ Required: { ...this.state.Required, prossesEvent: prossesEvent * 0.01 }, lockSubmit: true })
				const NewImage = this.state.Required.Images.map(item => ({ ...item, IsLoading: true, prossesEvent: prossesEvent * 0.01 }))
				this.setState({ Required: { ...this.state.Required, Images: NewImage } })
			})
		}

	}

	onTabDataChange = (tab, data, setState = true) => {
		switch (tab) {
			case 0:
				this.setState({
					Required: {
						...data
					}
				})
				break;

			case 1:
				this.setState({
					Optional: {
						...data,
					}
				})
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


		if (!this.state.didFetchData) {
			return <ActivityIndicator style={{ justifyContent: 'center', alignItems: 'center', alignSelf: 'center', flex: 1 }} color={mainColor} size='large' />

		}
		return (
			<>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Products"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							didSucceed={this.state.didSucceed}
							onPress={() => { this.submit() }} />
					} />

				<NewProductTabNavigator
					style={{ flex: 1 }}
					screenProps={{
						stackNavigation: this.props.navigation,
						Required: {
							...this.state.Required,
						},
						Optional: { ...this.state.Optional, Language: this.state.Required.Language },
						onTabDataChange: this.onTabDataChange,
						translate: this.props.translate,
						lockSubmit: this.state.lockSubmit,
						Currency: this.state.Currency,
					}}
				/>


			</>
		)
	}
}

const Tab = createMaterialTopTabNavigator()

const NewProductTabNavigator = ({ screenProps, navigation, screenProps: { translate } }) => {



	return (
		<Tab.Navigator
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
			}
			}
		>
			<Tab.Screen name='Required'
				options={{
					title: translate('Required')
				}}
			>
				{() => {
					return (
						<NewProductRequiredFeild
							lockSubmit={screenProps.lockSubmit}
							data={screenProps.Required}
							onTabDataChange={screenProps.onTabDataChange}
							navigation={screenProps.stackNavigation}
							tabNavigation={navigation}
							Currency={screenProps.Currency}
						/>
					)
				}}
			</Tab.Screen>

			<Tab.Screen name='Optional'
				options={{
					title: translate('Optional')
				}}
			>
				{() => {
					return (
						<NewProudctOptionalFeild
							lockSubmit={screenProps.lockSubmit}
							data={screenProps.Optional}
							onTabDataChange={screenProps.onTabDataChange}
							navigation={screenProps.stackNavigation}
							tabNavigation={navigation}
							Currency={screenProps.Currency}
						/>
					)
				}}
			</Tab.Screen>


		</Tab.Navigator >
	)
}

const mapStateToProps = ({
	language: {
		languages_data,
		currLang
	},
	login: {
		Currency,
	},
}) => ({
	languages_data,
	currLang,
	Currency
})

export default connect(mapStateToProps)(withLocalize(NewProductIndex))