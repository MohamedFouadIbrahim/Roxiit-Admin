import axios from 'axios';
import { types as InspectorReduxTypes } from '../redux/InspectorRedux.js';
import { store } from '../Store';
import { readBadgesFromResponseHeader } from './Badges.js';
import { CheckConnectivity, HandleInternalError, HandleNotFoundError, HandleFloodError, HandleValidationError, HandleLogicalError } from './Connectivity.js';
import RNFetchBlob from 'rn-fetch-blob';
import { Platform } from 'react-native';
import { types } from '../redux/NetworkRedux';

//export const DEFAULT_ROOT_URL_DEV = 'https://admin-api.dev-roxiit.com'
//export const DEFAULT_ROOT_URL_DIST = 'https://admin-api.dev-roxiit.com'
export const DEFAULT_ROOT_URL_DEV = 'http://console-api.dev-roxiit.com'
export const DEFAULT_ROOT_URL_DIST = 'http://console-api.roxiit.com'

//ProgressBar Functions
startLoading = () => store.dispatch({ type: types.SET_IS_LOADING, is_loading: true })
stopLoading = () => store.dispatch({ type: types.SET_IS_LOADING, is_loading: false })

// This function, in addition to handling when the response is a success/failure, it automatically handles other response codes.
export const HandleHttpResponses = (response, onSuccess, onFailure) => {

	stopLoading()

	if (response.status === 200) {
		readBadgesFromResponseHeader(response.headers)
		onSuccess && onSuccess(response);
	}
	else {
		CheckConnectivity()

		let onFailureReturn

		if (onFailure) {
			onFailureReturn = onFailure(response);
		}

		switch (response.status) {
			case 500: // INTERNAL SERVER ERROR
				{
					if (onFailureReturn !== true) {
						HandleInternalError(response)
					}
					break;
				}
			case 404: // NOT FOUND
				{
					if (onFailureReturn !== true) {
						HandleNotFoundError(response)
					}
					break;
				}
			case 429: // ANTI-FLOOD
				{
					if (onFailureReturn !== true) {
						HandleFloodError(response)
					}
					break;
				}
			case 406: // VALIDATION ERROR
				{
					if (onFailureReturn !== true) {
						HandleValidationError(response)
					}
					break;
				}
			case 203: // AUTH ERROR
				{
					if (store.getState().login.is_logged_in) {
						// Log out locally only
						// LoginReduxActions.setIsLoggedIn(store.dispatch, false, true)
						store.dispatch({ type: types.IS_LOGGED_IN, is_logged_in: false, do_not_call_api: true })
					}
					break;
				}
			case 400: // LOGICAL ERROR
				{
					if (onFailureReturn !== true) {
						HandleLogicalError(response)
					}
					break;
				}
			default:
				{
					alert(JSON.stringify(response))
				}
		}
	}
}

const InspectorCheck = (method, endpoint, response) => {
	if (store.getState().inspector.is_inspector_enabled) {
		store.dispatch({
			type: InspectorReduxTypes.LOG_INSPECTOR,
			log_item_message: `Network: ${method} ${endpoint} ${response.status}`,
			log_item_data: response,
		})

		store.dispatch({
			type: InspectorReduxTypes.SET_LAST_REQUEST_TIME,
			last_request_time: response.headers.srvrprocstime || null,
			last_query_count: response.headers.querycount || null,
		})
	}
}

const HTTP_REQUEST = (
	method, endpoint, post_data,
	onSuccess, onFailure,
	onUploadProgress,
	shouldAuthorize,
	contentType = "application/json; charset=utf-8") => {

	let _cancel
	startLoading();

	endpoint = ClearEmptyParameters(endpoint);

	axios({
		method,
		headers: shouldAuthorize || shouldAuthorize === undefined ? {
			"Content-Type": contentType,
			"access-token": store.getState().login.main_token,
			"tenant-token": store.getState().login.secondary_token,
		} : { "Content-Type": contentType },
		url: `${store.getState().server.root_url}/v1/${endpoint}`,
		data: post_data,
		cancelToken: new axios.CancelToken(function executor(c) {
			// An executor function receives a cancel function as a parameter
			_cancel = c
		}),
		onUploadProgress: function (prosessEvent) {
			var ProsessPersent = Math.round((prosessEvent.loaded * 100) / prosessEvent.total)
			if (typeof onUploadProgress === 'function') {
				onUploadProgress(ProsessPersent)
			}
		}
	}).then(function (response) {
		InspectorCheck(method, endpoint, response)

		HandleHttpResponses(
			response,
			onSuccess,
			onFailure);
	}).catch(function (error) {

		InspectorCheck(method, endpoint, error.response)

		if (error.response) {
			// The request was made and the server responded with a status code
			// that falls out of the range of 2xx
			HandleHttpResponses(
				error.response,
				onSuccess,
				onFailure);
		} else if (error.request) {
			// The request was made but no response was received
			// `error.request` is an instance of XMLHttpRequest in the browser and an instance of
			// http.ClientRequest in node.js
			CheckConnectivity()
			onFailure && onFailure(error);
		} else {
			// Something happened in setting up the request that triggered an Error
			CheckConnectivity()
			onFailure && onFailure(error);
		}
	});

	return _cancel
}

export const ClearEmptyParameters = (endpoint) => {
	try {
		let fixedUrl = endpoint;
		const paramsIndex = endpoint.indexOf('?');

		if (paramsIndex > -1)
			fixedUrl = endpoint.substr(0, paramsIndex);
		else
			return endpoint;

		var hash;
		var hashes = endpoint.slice(paramsIndex + 1).split('&').filter(a => a && a != null && a != undefined && a !== null && a !== undefined && a !== "" && a.trim().length > 0);
		for (var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=').filter(a => a && a != null && a != undefined && a !== null && a !== undefined && a !== "" && a.trim().length > 0);

			if (hash.length == 2/* valid param */) {
				if (fixedUrl.indexOf('?') > -1) {
					//endpoint already has a parameter 
					fixedUrl += "&" + hash[0].trim() + "=" + hash[1].trim();
				}
				else {
					fixedUrl += "?" + hash[0].trim() + "=" + hash[1].trim();
				}
			}
		}
		return fixedUrl;
	}
	catch{
		return endpoint;
	}
}

export const POST = (endpoint, post_data, onSuccess, onFailure, shouldAuthorize = true) => {
	return HTTP_REQUEST("post", endpoint, post_data, onSuccess, onFailure, shouldAuthorize);
}

export const GET = (endpoint, onSuccess, onFailure, shouldAuthorize = true) => {
	return HTTP_REQUEST("get", endpoint, null, onSuccess, onFailure, shouldAuthorize);
}

export const DELETE = (endpoint, onSuccess, onFailure, shouldAuthorize = true) => {
	return HTTP_REQUEST("delete", endpoint, null, onSuccess, onFailure, shouldAuthorize);
}

export const IMG = (endpoint, data, onSuccess, onFailure, onUploadProgress, shouldAuthorize = true) => {
	return HTTP_REQUEST("post", endpoint, data, onSuccess, onFailure, onUploadProgress, shouldAuthorize, "multipart/form-data");
}

export const GETHEADERFILE = (endpoint, onSuccess, onFailure, fileConfig, onDownLoadProgress) => {

	const dirs = RNFetchBlob.fs.dirs
	const { config } = RNFetchBlob

	config({
		path: (Platform.OS == 'ios' ? dirs.DocumentDir + '/' : `${dirs.DownloadDir}/`) + fileConfig.Name + "." + fileConfig.EXT,
	}).fetch('GET', `${store.getState().server.root_url}/v1/${endpoint}`, {
		"access-token": store.getState().login.main_token,
		"tenant-token": store.getState().login.secondary_token,
	}).progress((resecied, total) => {
		onDownLoadProgress && onDownLoadProgress(resecied / total)
	}).then((result) => {
		onSuccess && onSuccess(result)
	}).catch((err) => { onFailure && onFailure(err) })

}
export default { GET, POST, DELETE, IMG, GETHEADERFILE };