import React, { Component } from 'react'
import { FlatList, RefreshControl, View, Platform } from 'react-native'
import { mainColor, thinLineGray } from '../../constants/Colors';
import { withLocalize } from 'react-localize-redux';
import { GetPaginatedData, GetData } from '../../services/RemoteDataService';
import { connect } from 'react-redux'
import DraggableFlatList from 'react-native-draggable-flatlist'
import { LongToast } from '../../utils/Toast';
import TranslatedText from '../TranslatedText';
import FontedText from '../FontedText';
import { screenWidth, screenHeight } from '../../constants/Metrics';
import { largePagePadding, pagePadding, shadowStyle0 } from '../../constants/Style';

const MAX_CACHED_DATA_LENGTH = 5

class RemoteDataContainer extends Component {
	constructor(props) {
		super(props)

		this.state = {
			data: this.getInitialData(),
			isRefreshing: false,
			didFetchData: false,
		}

		this.lockFetching = false
		this.isRefreshing = false

		this.initPagination()
		this.minPageLength = 20

		this.defaultConfig = {
			pagination: true,
		}
	}

	componentDidMount() {
		const {
			pagination = this.defaultConfig.pagination,
		} = this.props

		if (pagination) {
			this.fetchPaginatedData()
		}
		else {
			this.fetchData()
		}
	}

	componentDidUpdate(prevProps) {
		if (this.props.updatedData !== prevProps.updatedData || this.props.shouldUpdateData !== prevProps.shouldUpdateData) {
			this.overwriteExistingData(this.props.updatedData)
		}

		if (this.props.triggerRefresh !== prevProps.triggerRefresh) {
			this.refresh()
		}

		if (this.props.params !== prevProps.params) {
			this.reload()
		}
	}

	componentWillUnmount() {
		if (this.cancelRequest) {
			this.cancelRequest()
		}
	}

	overwriteExistingData = (data) => {
		if (this.isCacheEnabled()) {
			this.updateCachedData(data)
		}

		this.setState({
			data
		})
	}

	reorderData = (e) => {
		const { data } = e

		if (this.isCacheEnabled()) {
			this.updateCachedData(data)
		}

		const { onMoveEnd } = this.props
		onMoveEnd(e)

		this.setState({
			data
		})
	}

	getInitialData = () => {
		const {
			cacheName,
			initialData,
		} = this.props

		if (initialData) {
			return initialData
		}
		else if (cacheName) {
			const {
				cached_data,
			} = this.props

			return cached_data[cacheName] || []
		}
		else {
			return []
		}
	}

	updateCachedData = (data) => {
		const {
			cacheName,
			cacheData,
		} = this.props

		cacheData(cacheName, data.slice(0, MAX_CACHED_DATA_LENGTH))
	}

	isCacheEnabled = () => {
		const {
			pagination = this.defaultConfig.pagination,
			cached_data,
			cacheName,
		} = this.props

		if (cacheName && (
			this.isRefreshing ||
			!pagination || (
				pagination && (
					this.currPage === 0 ||
					!cached_data[cacheName] ||
					cached_data[cacheName].length < MAX_CACHED_DATA_LENGTH
				)
			)
		)) {
			return true
		}
		return false
	}

	initPagination = () => {
		this.currPage = 0
		this.isLastPage = false
	}

	onBeforeFetchingData = () => {

		this.setState({ didFetchData: false })
		this.lockFetching = true
	}

	onDataFetched = (data, full_data) => {
		const {
			onDataFetched,
		} = this.props

		if (this.isCacheEnabled()) {
			this.updateCachedData(data)
		}

		this.setState({
			didFetchData: true,
			isRefreshing: false,
			data,
			full_data
		})

		this.isRefreshing = false


		onDataFetched && onDataFetched(data, full_data)

		this.lockFetching = false
	}

	fetchPaginatedData = () => {
		if (this.lockFetching) {
			return
		}

		const {
			url,
			params,
			cancelHandler,
		} = this.props

		if (!url || !url.length) {
			return
		}

		this.onBeforeFetchingData()

		const skippedItemsLength = this.minPageLength * this.currPage

		this.cancelRequest = GetPaginatedData(url, params, skippedItemsLength, this.minPageLength, res => {
			let fetchedData = res.data.Data

			const {
				itemModifier,
			} = this.props

			if (itemModifier) {
				fetchedData = fetchedData.map(item => itemModifier(item))
			}

			const mergedData = this.currPage === 0 ? fetchedData : [...this.state.data, ...fetchedData]

			this.isLastPage =
				fetchedData.length < this.minPageLength || res.data.TotalItemLength === mergedData.length
					? true : false

			this.onDataFetched(mergedData, res.data)
		})

		cancelHandler && cancelHandler(this.cancelRequest)
	}

	fetchData = () => {
		if (this.lockFetching) {
			return
		}

		const {
			url,
			params,
			cancelHandler,
		} = this.props

		if (!url || !url.length) {
			return
		}

		this.onBeforeFetchingData()

		this.cancelRequest = GetData(`${url}${params ? `?${params}` : ''}`, res => {
			let { Data } = res.data

			const {
				itemModifier,
			} = this.props

			if (itemModifier) {
				Data = Data.map(item => itemModifier(item))
			}

			this.onDataFetched(Data, res.data)
		})

		cancelHandler && cancelHandler(this.cancelRequest)
	}

	fetchNextPage = () => {
		if (this.lockFetching) {
			return
		}

		++this.currPage
		this.fetchPaginatedData()
	}

	onRefresh = () => {
		this.isRefreshing = true
		this.setState({ isRefreshing: true })
		this.initPagination()

		const {
			pagination = this.defaultConfig.pagination,
		} = this.props

		if (pagination) {
			this.fetchPaginatedData()
		}
		else {
			this.fetchData()
		}
	}

	refresh = () => {
		this.onRefresh()
	}

	reload = () => {
		this.onRefresh()
	}

	renderEmptyComponent = () => {
		const { ListEmptyComponent } = this.props

		if (!this.state.didFetchData) {
			return null
		}
		else if (ListEmptyComponent) {
			return ListEmptyComponent
		}
		else {
			return (
				<View
					style={{
						flex: 1,
						justifyContent: 'center',
						alignItems: 'center',
						marginTop: 60,
						paddingHorizontal: 30,
					}}>
					<TranslatedText style={{ fontSize: 22, marginTop: 15, }} text="NoContent" />
				</View>
			)
		}
	}

	getPaginationProps = () => {
		const {
			pagination = this.defaultConfig.pagination,
		} = this.props

		if (pagination) {
			return {
				onEndReachedThreshold: 0.5,
				onEndReached: () => {
					if (!this.isLastPage && this.state.didFetchData && !this.lockFetching)
						this.fetchNextPage()
				},
			}
		}
		else {
			return null
		}
	}

	getRefreshProps = () => {
		const {
			url,
		} = this.props

		if (url && url.length) {
			return {
				refreshControl: <RefreshControl
					colors={[mainColor]}
					tintColor={mainColor}
					refreshing={false}
					onRefresh={this.onRefresh} />
			}
		}
		else {
			return null
		}
	}

	renderFooterComponent = () => {

		const {
			renderFooterComponent,
			showCount,
			pagination = this.defaultConfig.pagination,
			draggable
		} = this.props

		const {
			didFetchData,
			full_data,
			data
		} = this.state

		if (!didFetchData || showCount == false || ((full_data.TotalItemLength ?? 0) == 0 && (data.length ?? 0) == 0)) {
			return null
		}
		else if (renderFooterComponent) {
			return renderFooterComponent
		}
		else {
			return (
				<View
					style={{
						flexDirection: 'row',
						justifyContent: 'space-between',
						backgroundColor: 'white',
						position: 'absolute',
						bottom: 5,
						left: 5,
						padding: 3,
						borderRadius: 6,
						...shadowStyle0
					}}>
					<TranslatedText text="ItemCount" style={{ fontSize: 10, fontWeight: 'bold' }} />
					<FontedText style={{ fontSize: 10, fontWeight: 'bold' }} >
						{full_data.TotalItemLength || data.length}
					</FontedText>
				</View>
			)
		}
	}

	render() {
		const { props } = this

		const {
			draggable,
			hideWhenEmpty,
			showCount
		} = props

		if (this.state.didFetchData && !this.state.data.length && hideWhenEmpty) {
			return null
		}
		else {
			if (draggable) {
				return (
					<View style={{ flex: 1, backgroundColor: 'white' }}>
						<DraggableFlatList
							removeClippedSubviews={true}
							{...this.getRefreshProps()}
							{...this.getPaginationProps()}
							{...props}
							ListEmptyComponent={this.renderEmptyComponent}
							data={this.state.data}
							onDragEnd={this.reorderData}
						/>
						{showCount != false && this.renderFooterComponent()}
					</View>
				)
			}
			else {
				return (
					<View style={{ flex: 1, backgroundColor: 'white' }} >
						<FlatList
							removeClippedSubviews={true}
							{...this.getRefreshProps()}
							{...this.getPaginationProps()}
							{...props}
							ListEmptyComponent={this.renderEmptyComponent}
							data={this.state.data}
						/>
						{showCount != false && this.renderFooterComponent()}
					</View>

				)
			}
		}
	}
}

const mapStateToProps = ({
	cache: {
		cached_data,
	},
}) => ({
	cached_data,
})

function mergeProps(stateProps, { dispatch }, ownProps) {
	const {
		actions: {
			cacheData,
		}
	} = require('../../redux/CacheRedux.js');

	return {
		...ownProps,
		...stateProps,
		cacheData: (name, data) => cacheData(dispatch, name, data),
	};
}

export default connect(mapStateToProps, undefined, mergeProps)(withLocalize(RemoteDataContainer))