export const SelectEntity = (
	navigation,
	callback,
	destination_url,
	destination_params,
	search,
	selection = 1,
	selected_items = [],
	options,
) => {
	/*
		selection
		type: integer

		0 = disable selection, view only
		1 = select one
		2 = select multiple

	*/

	/*
		options
		type: object

		ListEmptyComponent
		itemTextColorModifier
		itemBgColorModifier
		forceSubmit
		initialData
		onSelectItem
		pagination
		reorder
	*/

	// CTRL+Shift+F "SelectEntity(" to see all use cases
	
	navigation.navigate('EntitySelector', {
		destination_url,
		destination_params,
		search,
		selection,
		selected_items,
		callback,
		options
	})
}

export const SelectMultiLevel = (navigation, callback, first_dest_url, second_dest_url, selection = 1, selected_items = [], options) => {
	/*
		- selection
		0 = disable selection, view only
		1 = select one
		2 = select multiple


		- second_dest_url
		If second_dest_url is null, first_dest_url will be used for all levels


		- options
		canSelectParents
	*/

	// CTRL+Shift+F "SelectMultiLevel(" to see all use cases

	navigation.navigate('MultiLevelSelector', {
		first_dest_url,
		second_dest_url,
		selection,
		selected_items,
		callback,
		options,
	})
}