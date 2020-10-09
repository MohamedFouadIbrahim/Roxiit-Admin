import React, { Component } from 'react'
import {  View, TextInput } from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import AntDesign from 'react-native-vector-icons/AntDesign'
import Entypo from 'react-native-vector-icons/Entypo'
import EvilIcons from 'react-native-vector-icons/EvilIcons'
import Feather from 'react-native-vector-icons/Feather'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import Foundation from 'react-native-vector-icons/Foundation'
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import Octicons from 'react-native-vector-icons/Octicons'
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons'
import Zocial from 'react-native-vector-icons/Zocial'
import Ionicons from 'react-native-vector-icons/Ionicons'
import { screenHeight, screenWidth } from '../../constants/Metrics';
import SearchBar from '../../components/SearchBar/index.js';
import RemoteDataContainer from '../../components/RemoteDataContainer/index.js';
import ItemSeparator from '../../components/ItemSeparator/index.js';
import FontedText from '../../components/FontedText/index.js';
import { SelectCurrencies, CurrencyOverwrite } from '../../services/CurrencyService.js';
import EditButton from '../../components/EditButton/index.js';
import Modal from "react-native-modal";
import TranslatedText from '../../components/TranslatedText/index';
import { secondColor } from '../../constants/Colors';
import RoundedCloseButton from '../../components/RoundedCloseButton/index.js';
import { withLocalize } from 'react-localize-redux';
import CurrencyListItem from './CurrencyListItem.js';
import { LongToast } from '../../utils/Toast.js';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import CustomTouchable from '../../components/CustomTouchable';

class CurrencyList extends Component {
	constructor(props) {
		super(props);
		this.state = {
			triggerRefresh: false,
			searchBarShown: false,
			searchingFor: '',
			isModalVisible: false,
			itemToOverWrite: "..",
		}
	}
	componentWillUnmount() {
		this.cancelFetchDataSelectCurrencies && this.cancelFetchDataSelectCurrencies()
		this.cancelFetchDataCurrencyOverwrite && this.cancelFetchDataCurrencyOverwrite()
	}
	overwritePrice = () => {
		this.cancelFetchDataCurrencyOverwrite = CurrencyOverwrite({ Id: this.state.itemToOverWrite.Id, OnUsdEqual: this.state.OnUsdEqual ? this.state.OnUsdEqual : 0 }, res => {
			this.toggleModal()
			this.onChildChange()
			LongToast('dataSaved')

			// this.setState({ triggerRefresh: true }, () => {
			// })
		})
	}
	toggleModal = () => {
		this.setState({ isModalVisible: !this.state.isModalVisible });
	};
	renderOverwriteModal = () => (
		<Modal style={{ flex: 1, justifyContent: 'flex-start', paddingTop: screenHeight / 4 }} onBackdropPress={this.toggleModal} onSwipeComplete={this.toggleModal} isVisible={this.state.isModalVisible}>
			<View style={{ backgroundColor: "#FFF", width: screenWidth - 40, borderRadius: 20 }}>
				<View style={{ marginTop: 10, marginRight: 10, alignItems: 'flex-end' }}>
					<RoundedCloseButton onPress={this.toggleModal} />
				</View>
				<View
					style={{
						padding: 20,
						justifyContent: 'center',
						alignItems: 'flex-start',
						flexDirection: 'row',
					}}>
					<TranslatedText style={{ flex: 1, textAlignVertical: 'center', height: 40 }} text={`How many ${this.state.itemToOverWrite.Symbol} in 1 usd ?`} />
					<TextInput
						style={[{
							flex: 1,
							fontSize: 15,
							textAlign: 'center',
							paddingLeft: 5,
							marginLeft: 0,
							textAlignVertical: 'center',
							height: 40
						}]}
						autoFocus
						keyboardType="numeric"
						// placeholder={`${this.state.itemToOverWrite.customPrice}`}
						value={`${this.state.itemToOverWrite.customPrice <= 0 ? '' : this.state.itemToOverWrite.customPrice}`}
						// defaultValue={`${this.state.itemToOverWrite.customPrice}`}
						onChangeText={(OnUsdEqual) => {

							this.setState(prevState => ({
								PrevOverprice: prevState.itemToOverWrite.customPrice,
								itemToOverWrite: {                   // object that we want to update
									...prevState.itemToOverWrite,    // keep all other key-value pairs
									customPrice: OnUsdEqual      // update the value of specific key
								},
								OnUsdEqual: OnUsdEqual
							}))
						}}
					/>
				</View>
				<CustomTouchable style={{ paddingVertical: 15, backgroundColor: secondColor, borderBottomEndRadius: 20, borderBottomLeftRadius: 20, justifyContent: "center", alignItems: "center" }} onPress={this.overwritePrice}>
					<FontedText style={{ color: "#FFF", textAlign: 'center', }}>{this.props.translate('overwrite')}</FontedText>
				</CustomTouchable>
			</View>

		</Modal>
	)
	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => { this.setState({ searchBarShown: !this.state.searchBarShown }) }}
				onSubmitEditing={(searchingFor) => {
					this.setState({ searchingFor })
				}} />
		)
	}
	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh })
	}

	componentDidUpdate(prevProps) {
		if (this.props.route.params?.triggerRefresh !== prevProps.route.params?.triggerRefresh) {
			this.onChildChange()
		}
	}

	renderIcon = (MobileIcon, MobileIconFamily) => {
		switch (MobileIconFamily) {
			case 'Ionicons':
				return <Ionicons style={{}} size={30} name={MobileIcon} />
			case 'AntDesign':
				return <AntDesign style={{}} size={30} name={MobileIcon} />
			case 'Entypo':
				return <Entypo style={{}} size={30} name={MobileIcon} />
			case 'EvilIcons':
				return <EvilIcons style={{}} size={30} name={MobileIcon} />
			case 'Feather':
				return <Feather style={{}} size={30} name={MobileIcon} />
			case 'FontAwesome':
				return <FontAwesome style={{}} size={30} name={MobileIcon} />
			case 'Foundation':
				return <Foundation style={{}} size={30} name={MobileIcon} />
			case 'MaterialCommunityIcons':
				return <MaterialCommunityIcons style={{}} size={30} name={MobileIcon} />
			case 'MaterialIcons':
				return <MaterialIcons style={{}} size={30} name={MobileIcon} />
			case 'Octicons':
				return <Octicons style={{}} size={30} name={MobileIcon} />
			case 'SimpleLineIcons':
				return <SimpleLineIcons style={{}} size={30} name={MobileIcon} />
			case 'Zocial':
				return <Zocial style={{}} size={30} name={MobileIcon} />

			default:
				return null
		}
	}

	toggleSelection = (Id) => {
		const copy_currencies = this.state.Currencies

		this.setState({
			Currencies: copy_currencies.map(item => {
				if (item.Id === Id) {
					return ({
						...item,
						isSelected: !item.isSelected
					})
				}
				else {
					return item
				}
			})
		})
	}

	onSave = () => {
		var Currencies = this.state.Currencies
		var Ids = []
		Currencies.map(item => {
			if (item.isSelected)
				Ids.push(item.Id)
		})

		this.lockSubmit = true
		this.setState({ lockSubmit: true })

		this.cancelFetchDataSelectCurrencies = SelectCurrencies(Ids, res => {
			this.lockSubmit = false
			this.setState({ lockSubmit: false })

			this.onChildChange()
			return LongToast('dataSaved')
		}, err => {
			this.lockSubmit = false
			this.setState({ lockSubmit: false })
		})
	}

	onPressItem = (item) => {
		this.setState({ itemToOverWrite: item }, this.toggleModal)
	}

	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	onSwitchValueChange = (item) => {
		const { Id } = item
		this.toggleSelection(Id)
	}

	renderItem = ({ item }) => {
		return (
			<CurrencyListItem
				item={item}
				onSwitchValueChange={this.onSwitchValueChange}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}

	renderOverwritebutton = (item) => {
		return (
			<View
				style={{
					justifyContent: 'center',
					alignItems: 'flex-end',
					height: '100%',
					padding: 20,
				}}>
				<EditButton onPress={() => {
					this.setState({ itemToOverWrite: item }, this.toggleModal)
				}} />
			</View>
		)
	}

	render() {
		const { translate } = this.props
		return (
			<LazyContainer style={{ flex: 1, }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="CurrencyList"
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							onPress={this.onSave}
						/>
					} />
				{this.renderOverwriteModal()}

				<RemoteDataContainer
					url={"Currency"}
					triggerRefresh={this.state.triggerRefresh}
					onDataFetched={(data) => {
						this.setState({ Currencies: data, })
					}}
					pagination={false}
					updatedData={this.state.Currencies}
					keyExtractor={({ Id }) => `${Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem} />
			</LazyContainer>
		)
	}
}

export default withLocalize(CurrencyList)