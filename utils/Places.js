import { flags } from "../constants/Flags"

export const SelectCountry = (navigation, callback, multi_select = false, selected_items = []) => {
	navigation.navigate('EntitySelector', {
		destination_url: "Countries",
		destination_params: null,
		search: true,
		selection: multi_select ? 2 : 1,
		selected_items,
		callback,
	})
}

export const SelectCity = (navigation, callback, parent_id, multi_select = false, selected_items = [], search = true) => {
	// Note: parent_id can be an integer or an array of integers

	let destination_url, destination_params

	if (Array.isArray(parent_id)) {
		destination_url = "Cities/Array"
		destination_params = `${parent_id.map(item => `id=${item}`).join("&")}`
	}
	else {
		destination_url = "Cities"
		destination_params = `id=${parent_id}`
	}

	navigation.navigate('EntitySelector', {
		destination_url,
		destination_params,
		search,
		selection: multi_select ? 2 : 1,
		selected_items,
		callback,
	})
}

export const SelectArea = (navigation, callback, parent_id, multi_select = false, selected_items = [], search = true) => {
	// Note: parent_id can be an integer or an array of integers

	let destination_url, destination_params

	if (Array.isArray(parent_id)) {
		destination_url = "Areas/Array"
		destination_params = `${parent_id.map(item => `id=${item}`).join("&")}`
	}
	else {
		destination_url = "Areas"
		destination_params = `id=${parent_id}`
	}

	navigation.navigate('EntitySelector', {
		destination_url,
		destination_params,
		search,
		selection: multi_select ? 2 : 1,
		selected_items,
		callback,
	})
}

export const GetCountryFlag = (country_iso_alpha_2) => {
	const lowercase_code = country_iso_alpha_2 ? country_iso_alpha_2.toLowerCase() : "INVALID_COUNTRY_CODE"
	return flags[lowercase_code]
}
