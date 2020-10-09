import React, { Component } from "react";
import { View } from "react-native";
import LazyContainer from "../../components/LazyContainer";
import RemoteDataContainer from "../../components/RemoteDataContainer/index.js";
import { getFilters } from '../../services/FilterService.js';
import { largePagePadding, pagePadding, shadowStyle3 } from "../../constants/Style.js";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import Ionicons from "react-native-vector-icons/Ionicons";
import { withLocalize } from "react-localize-redux";
import AntDesign from "react-native-vector-icons/AntDesign";
import SearchBar from "../../components/SearchBar/index.js";
import { DeleteWarehouse, ReorderWarehouse } from '../../services/WarehousesService.js';
import CustomHeader, { secondHeaderIconSize, headerHeight } from '../../components/CustomHeader/index.js';
import Triangle from "react-native-triangle";
import CustomButton from "../../components/CustomButton/index.js";
import { SelectCountry, SelectCity } from "../../utils/Places.js";
import ArrowItem from "../../components/ArrowItem/index.js";
import WarehouseItem from "./WarehouseItem";
import CustomSelectorForDeleteAndEdit from '../../components/CustomSelectorForDeleteAndEdit/index';
import { LongToast } from "../../utils/Toast";
import CustomTouchable from '../../components/CustomTouchable';
import { isValidSearchKeyword } from "../../utils/Validation";

class Warehouses extends Component {
	constructor() {
		super();
		this.state = {
			data: null,
			triggerRefresh: false,
			showCustomSelectorForDeleteref: false,
			Loading: false,
			searchBarShown: false,
			isPopupVisible: false,
			searchingFor: "",

		};
	}

	componentWillUnmount() {
		//	this.cancelFetchData && this.cancelFetchData()
		this.cancelFetchDataDeleteCustomer && this.cancelFetchDataDeleteCustomer()
	}

	onPressItem = (item) => {
		this.setState({ isPopupVisible: false })

		const { Id } = item
		this.props.navigation.navigate("Warehouse", {
			Id,
			onChildChange: this.onChildChange
		});
	}

	// onLongPressItem = (item) => {

	// }
	onLongPressItem = (item) => {
		const { Id } = item
		this.DeleteOrEditId = Id
		this.setState({ showCustomSelectorForDeleteref: true })
	}

	renderItem = ({ item, drag, isActive }) => {
		return (
			<WarehouseItem
				item={item}
				move={drag}
				isActive={isActive}
				onPress={this.onPressItem}
				onLongPress={this.onLongPressItem} />
		)
	}



	onChildChange = () => {
		this.setState({ triggerRefresh: !this.state.triggerRefresh });
	};

	addParamsSeparator = params => {
		return params.length ? "&" : "";
	};

	getRequestParams = () => {
		let params = "";

		const { searchingFor, Status, Country, City } = this.state;

		if (isValidSearchKeyword(searchingFor)) {
			params += `${this.addParamsSeparator(params)}search=${searchingFor}`;
		}

		if (Status) {
			params += `${this.addParamsSeparator(params)}statusId=${Status.Id}`;
		}

		if (Country) {
			params += `${this.addParamsSeparator(params)}countryId=${Country.Id}`;
		}

		if (City) {
			params += `${this.addParamsSeparator(params)}cityId=${City.Id}`;
		}

		return params;
	};

	renderSearch = () => {
		return (
			<SearchBar
				visible={this.state.searchBarShown}
				onPressClose={() => {
					this.setState({ searchBarShown: !this.state.searchBarShown });
				}}
				onSubmitEditing={text => {
					this.setState({ searchingFor: text });
				}}
			/>
		);
	};

	hidePopup = () => {
		this.setState({ isPopupVisible: false });
	};
	onDataReordered = (data) => {
		ReorderWarehouse(data.map(item => item.Id))
	}

	renderPopup = () => {
		let { pos_y, pos_x, isPopupVisible } = this.state;

		if (!isPopupVisible || pos_x === undefined || pos_y === undefined) {
			return null;
		}

		// Can cause bugs on iOS?
		pos_x -= 29;

		const { translate } = this.props;
		const { Country, City, Status } = this.state;


		return (
			<View
				style={{
					position: "absolute",
					top: pos_y + headerHeight + 2,
					right: pos_x,
					backgroundColor: "white",
					borderRadius: 15,
					paddingVertical: largePagePadding,
					width: 250,
					...shadowStyle3
				}}
			>
				<Triangle
					width={14}
					height={10}
					color={"white"}
					direction={"up"}
					style={{
						position: "absolute",
						top: -10,
						right: pos_x + 40
					}}
				/>

				<ArrowItem
					onPress={() => {
						SelectCountry(this.props.navigation, item => {
							this.setState({ Country: item, City: null });
						});
					}}
					title={"Country"}
					info={Country ? Country.Name : translate("NoneSelected")}
					style={{ paddingHorizontal: largePagePadding }}
				/>



				{Country && (
					<View>
						<ArrowItem
							onPress={() => {
								SelectCity(
									this.props.navigation,
									item => {
										this.setState({ City: item });
									},
									Country.Id
								);
							}}
							title={"City"}
							info={City ? City.Name : translate("NoneSelected")}
							style={{ paddingHorizontal: largePagePadding }}
						/>


					</View>
				)}

				<CustomButton
					onPress={() => {
						this.hidePopup();
						this.setState({
							Country: null,
							City: null,
							Status: null,
						});
					}}
					style={{
						marginTop: pagePadding + 10,
						marginHorizontal: largePagePadding
					}}
					title="Clear"
				/>
			</View>
		);
	};

	render() {
		return (
			<LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
				<CustomHeader
					leftComponent="drawer"
					navigation={this.props.navigation}
					title="Warehouses"
					rightNumOfItems={3}
					rightComponent={
						<View
							style={{
								flexDirection: "row",
								alignItems: "center"
							}}>
							<CustomTouchable
								onPress={() => {
									this.setState({ searchBarShown: !this.state.searchBarShown });
								}}
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flex: 1
								}}
							>
								<Ionicons name={`ios-search`} size={24} color={"white"} />
							</CustomTouchable>

							<CustomTouchable
								onLayout={({
									nativeEvent: {
										layout: { x, y }
									}
								}) => {
									this.setState({ pos_x: x, pos_y: y });
								}}
								onPress={() => {
									this.setState({ isPopupVisible: !this.state.isPopupVisible });
								}}
								style={{
									flexDirection: "row",
									justifyContent: "center",
									alignItems: "center",
									flex: 1
								}}
							>
								<AntDesign name={`filter`} size={24} color={"white"} />
							</CustomTouchable>
							<CustomTouchable
								onPress={() => { this.props.navigation.navigate('AddWarehouse', { onChildChange: this.onChildChange }) }}
								style={{
									flexDirection: 'row',
									justifyContent: 'center',
									alignItems: 'center',
									flex: 1,
								}}>
								<Ionicons
									name={`ios-add`}
									size={secondHeaderIconSize}
									color={'white'} />
							</CustomTouchable>
						</View>
					}
				/>
				{this.renderSearch()}

				<RemoteDataContainer
					url={"Warehouses"}
					params={this.getRequestParams()}
					cacheName={"Warehouses"}
					draggable={true}
					onMoveEnd={({ data }) => { this.onDataReordered(data) }}
					onDataFetched={data => {
						this.setState({ data });
					}}
					updatedData={this.state.data}
					triggerRefresh={this.state.triggerRefresh}
					keyExtractor={(item, index) => `draggable-item-${item.Id}`}
					ItemSeparatorComponent={() => <ItemSeparator />}
					renderItem={this.renderItem}
				/>
				{this.renderPopup()}

				<CustomSelectorForDeleteAndEdit
					showCustomSelectorForDeleteref={this.state.showCustomSelectorForDeleteref}
					justForDelete={true}

					onCancelDelete={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onCancelConfirm={() => {
						this.setState({ showCustomSelectorForDeleteref: false })
					}}
					onDelete={() => {
						const { translate } = this.props
						this.setState({ Loading: true, showCustomSelectorForDeleteref: false })
						this.cancelFetchDataDeleteCustomer = DeleteWarehouse(this.DeleteOrEditId, () => {
							this.setState({
								data: this.state.data.filter(filterItem => filterItem.Id !== this.DeleteOrEditId),
								showCustomSelectorForDeleteref: false,
								Loading: false
							})
							LongToast('dataDeleted')
						}, () => {
							this.setState({ Loading: false })
						})
					}}
				/>
			</LazyContainer>
		);
	}
}

export default withLocalize(Warehouses);