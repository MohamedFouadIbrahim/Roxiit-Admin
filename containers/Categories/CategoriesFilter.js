import React, { Component } from 'react'
import {
	ScrollView,
	View,
	Text,
	ActivityIndicator,
} from 'react-native'
import CustomHeader from '../../components/CustomHeader/index.js';
import LazyContainer from '../../components/LazyContainer'
import { withLocalize } from 'react-localize-redux';
import HeaderSubmitButton from '../../components/HeaderSubmitButton/index.js';
import { getFilters } from '../../services/FilterService.js';
import { largePagePadding } from '../../constants/Style.js';
import CustomButton from '../../components/CustomButton/index.js';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import { screenHeight } from '../../constants/Metrics';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import SearchBar from '../../components/SearchBar/index.js';
import FontedText from '../../components/FontedText/index.js';
import CustomTouchable from '../../components/CustomTouchable';

class CategoriesFilter extends Component {
	constructor(props) {
		super(props)
		this.state = {
			didFetchData: true,
			Languages: [],
			Categories: [],
			showLanguagePicker: false,
			showCategoriesPicker: false,
			fetchingFilters: true,
			selectedLanguage: {
				Id: null,
				Name: ""
			},
			selectedCategory: {
				Id: null,
				Name: ""
			},
			qry: this.props.searchQry,
		}
	}

	componentDidMount() {
		this.getFilterDropDowns()
	}
	componentWillUnmount() {
		this.cancelFetchData && this.cancelFetchData()
	}



	getFilterDropDowns = () => {
		this.cancelFetchData = getFilters({ languages: true, categories: true }, (res) => {
			var Languages = res.data.Languages
			var Categories = res.data.Categories

			this.setState({ Languages, Categories, }, () => {
				this.setState({ fetchingFilters: false })
			})
		});
	}

	selectLanguage = (Id) => {
		var Languages = this.state.Languages;
		var selectedLanguage = this.state.selectedLanguage
		Languages.map((item) => {
			if (item.Id == Id) {
				item.selected = true
				selectedLanguage = item
			} else {
				item.selected = false
			}
		})
		this.setState({ Languages, selectedLanguage }, () => {
			this.setState({ showLanguagePicker: false })
		})
	}

	selectProductType = (Id) => {
		var Categories = this.state.Categories;
		var selectedCategory = this.state.selectedCategory
		Categories.map((item) => {
			if (item.Id == Id) {
				item.selected = true
				selectedCategory = item
			} else {
				item.selected = false
			}
		})
		this.setState({ Categories, selectedCategory }, () => {
			this.setState({ showCategoriesPicker: false })
		})
	}

	clearPickers = () => {
		this.setState({
			Languages: this.state.Languages.map(item => { return { Id: item.Id, Name: item.Name, selected: false } }),
			Categories: this.state.Categories.map(item => { return { Id: item.Id, Name: item.Name, selected: false } }),
			selectedLanguage: { Id: null, Name: "" },
			selectedCategory: { Id: null, Name: "" },
			showLanguagePicker: false,
			showCategoriesPicker: false,
			qry: ""
		})
	}

	renderCategoriesPicker = () => {
		return (
			<>
				<View
					style={{
						flexDirection: "row",
						alignItems: "center",
						justifyContent: "space-between",
						marginTop: 30,
						paddingHorizontal: largePagePadding,
					}}>
					<View style={{}}>
						<Text style={{ paddingRight: 10, fontSize: 18, fontWeight: '300' }}>Select Category</Text>
						<Text style={{ paddingRight: 10, fontSize: 15, color: 'grey', }}>{this.state.selectedCategory.Name}</Text>
					</View>

					<CustomButton
						onPress={this.clearPickers}
						style={{
						}}
						title='Clear' />
				</View>
				{this.state.fetchingFilters ?
					<ActivityIndicator />
					:
					<ScrollView
						contentContainerStyle={{
							width: '100%',
							paddingLeft: largePagePadding,
							marginBottom: largePagePadding
						}}
						nestedScrollEnabled={true}>
						{
							this.state.Categories.map((item, index) => (
								<CustomTouchable activeOpacity={.5} onPress={() => this.selectProductType(item.Id)} key={`{${index}}`} style={{ flex: 1, paddingTop: 18, flexDirection: 'row', alignItems: 'center' }}>
									<MaterialCommunityIcons size={17} color='#916bff' name={item.selected ? 'checkbox-marked' : 'checkbox-blank-outline'} style={{ marginRight: 8 }} />
									<FontedText style={{ fontSize: 17 }}>{item.Name}</FontedText>
								</CustomTouchable>
							))
						}
					</ScrollView>}
			</>
		)
	}

	submit = () => {
		const {
			selectedLanguage,
			selectedCategory,
			qry
		} = this.state
		var params = "";
		if (selectedCategory.Id)
			params += `parentId=${selectedCategory.Id}`
		if (selectedLanguage.Id)
			params += `${params.length > 0 ? '&' : ''}languageId=${selectedLanguage.Id}`
		if (qry && qry.length > 0)
			params += `${params.length > 0 ? '&' : ''}search=${qry}`

			const callback = this.props.route.params?.callback
			callback && callback(params)
			this.props.navigation.goBack()
	}

	onPricesChange = (prices) => {
		this.setState({
			MinPrice: prices[0],
			MaxPrice: prices[1],
		})
	}

	renderContent = () => {
		if (this.state.didFetchData) {
			return (
				<ScrollView style={{ flex: 1, backgroundColor: "#FFF", }}>
					<SearchBar
						visible={true}
						hideShadow={true}
						autoFocus={false}
						interval={100}
						onSubmitEditing={(qry) => {
							if (qry) {
								this.setState({ qry })
							}
							else {
								this.setState({ qry: null })
							}
						}} />

					{this.renderCategoriesPicker()}
				</ScrollView>
			)
		}
	}

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					navigation={this.props.navigation}
					title={"Filters"}
					rightComponent={
						<HeaderSubmitButton
							isLoading={this.state.lockSubmit}
							onPress={() => { this.submit() }} />
					} />

				{this.renderContent()}

			</LazyContainer>
		)
	}
}

export default withLocalize(CategoriesFilter)