import React from 'react';
import { withLocalize } from 'react-localize-redux';
import { ScrollView, View } from 'react-native';
import ArrowItem from '../../components/ArrowItem/index';
import HorizontalInput from '../../components/HorizontalInput/index';
import ItemSeparator from '../../components/ItemSeparator/index';
import LazyContainer from '../../components/LazyContainer/index';
import { STRING_LENGTH_MEDIUM, STRING_LENGTH_SHORT } from '../../constants/Config';
import { SelectEntity } from '../../utils/EntitySelector';
import { SelectArea, SelectCity, SelectCountry } from '../../utils/Places.js';
import { LongToast } from '../../utils/Toast';
import CustomSelector from '../../components/CustomSelector';

class AddAdvanceSettings extends React.Component {
	constructor(props) {

		super(props);

		this.WhereHousesSelectorRef = React.createRef()
		this.languagesRef = React.createRef();
		this.lockSubmitc = false

		this.TabIndex = 0

	}


	RenderCountryOrCity = () => {
		const { To_Country, To_City, To_Area } = this.props.route.params.data
		const { onTabDataChange } = this.props
		const { translate } = this.props

		return (
			<View>

				<ArrowItem //To Country
					onPress={() => {
						SelectCountry(this.props.navigation, To_Country => {
							onTabDataChange(this.TabIndex, {
								...this.props.route.params.data,
								To_Country
							})
						}, true, To_Country)
					}}
					title={'ToCountry'}
					info={To_Country.length > 0 ? To_Country.length : translate('NoneSelected')}
				/>

				<ArrowItem //To City
					onPress={() => {

						if (!To_Country.length) {
							LongToast("SelectCountryFirst")
							return
						}

						SelectCity(this.props.navigation, To_City => {
							onTabDataChange(this.TabIndex, {
								...this.props.route.params.data,
								To_City
							})
						}, To_Country.map(item => item.Id), true, To_City, true)
					}}
					title={'ToCity'}
					info={To_City.length > 0 ? To_City.length : translate('NoneSelected')}
				/>

				<ArrowItem //To Area
					onPress={() => {

						if (!To_Country.length) {
							LongToast("SelectCityFirst")
							return
						}

						SelectArea(this.props.navigation, To_Area => {

							onTabDataChange(this.TabIndex, {
								...this.props.route.params.data,
								To_Area
							})

						}, To_City.map(item => item.Id), true, To_Area, true)
					}}
					title={'ToArea'}
					info={To_Area.length > 0 ? To_Area.length : translate('NoneSelected')}
				/>

			</View>
		)
	}

	render() {

		const {
			KgPrice,
			Fixed_Price,
			Name,
			Warehouses,
			EstimatedDeliveryTime,
			ChangeToLanguage,
			Language,
			languages_data,
		} = this.props.route.params.data
		const {
			onTabDataChange,
			onSelectLanguage,
		} = this.props.route.params

		const { translate } = this.props

		return (
			<LazyContainer
				style={{
					flex: 1
				}}>

				<ScrollView>
					<ArrowItem
						onPress={() => {
							this.languagesRef.current.show()
						}}
						title={'Language'}
						info={ChangeToLanguage ? ChangeToLanguage.label : Language.label} />

					<ItemSeparator />

					<ArrowItem
						onPress={() => {
							SelectEntity(this.props.navigation, Warehouses => {
								onTabDataChange(this.TabIndex, {
									...this.props.route.params.data,
									Warehouses
								})
							}, 'Warehouses/Simple', null, false, 2, Warehouses)
						}}
						title={'Warehouses'}
						info={Warehouses.length || translate('NoneSelected')} />

					<View style={{ marginTop: 10 }} >
						<HorizontalInput
							maxLength={STRING_LENGTH_MEDIUM}
							value={Name}
							label='Name'
							onChangeText={(Name) => {
								onTabDataChange(this.TabIndex, {
									...this.props.route.params.data,
									Name
								})
							}} />

						<ItemSeparator />

						<HorizontalInput
							keyboardType="numeric"
							maxLength={STRING_LENGTH_SHORT}
							value={Fixed_Price != null ? String(Fixed_Price) : null}
							label='FixedPrice'
							onChangeText={(Fixed_Price) => {
								onTabDataChange(this.TabIndex, {
									...this.props.route.params.data,
									Fixed_Price
								})
							}} />

						<ItemSeparator />

						<HorizontalInput
							maxLength={STRING_LENGTH_SHORT}
							value={KgPrice != null ? String(KgPrice) : null}
							keyboardType="numeric"
							label='KgPrice'
							onChangeText={(KgPrice) => {
								onTabDataChange(this.TabIndex, {
									...this.props.route.params.data,
									KgPrice
								})
								// this.setState({ KgPrice: e })
							}} />

						<ItemSeparator />

						<HorizontalInput
							value={EstimatedDeliveryTime}
							label='EstimatedDeliveryTime'
							onChangeText={(EstimatedDeliveryTime) => {
								onTabDataChange(this.TabIndex, {
									...this.props.route.params.data,
									EstimatedDeliveryTime
								})
							}} />

						<ItemSeparator />

					</View>
					{this.RenderCountryOrCity()}

				</ScrollView>

				{languages_data && <CustomSelector
					ref={this.languagesRef}
					options={languages_data.map(item => item.label)}
					onSelect={(index) => { onSelectLanguage(index) }}
					onDismiss={() => { }}
				/>}

			</LazyContainer>
		)
	}
}

export default withLocalize(AddAdvanceSettings)