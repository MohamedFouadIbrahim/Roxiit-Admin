export const GetOptionsPostModel = (options, onSuccess, onFailure) => {
	let PostOptions = []
	let RequiredUnselectedGroups = []

	options.forEach(item => {
		const isRequired = item.IsRequired

		switch (item.Type.Id) {
			case 1:
			case 2:
			case 3:
				const itemSelectedOptions = item.Members.filter(filterItem => filterItem.isSelected).map(mapItem => ({ 
					ProductOptionId: mapItem.Id,
					ExtraDetails1: mapItem.value1,
					ExtraDetails2: mapItem.value2,
					ExtraDetails3: mapItem.value3,
				}))

				if (itemSelectedOptions.length) {
					PostOptions = [
						...PostOptions,
						...itemSelectedOptions
					]
				}
				else if (isRequired) {
					RequiredUnselectedGroups.push(item.Name)
				}
				break;
			case 4:
			case 5:
			case 6:
			case 7:
			case 8:
			case 9:
				const firstMember = item.Members[0]

				if (firstMember.isSelected) {
					const { Id, value1, value2, value3 } = firstMember

					PostOptions.push({
						ProductOptionId: Id,
						ExtraDetails1: value1,
						ExtraDetails2: value2,
						ExtraDetails3: value3,
					})
				}
				else if (isRequired) {
					RequiredUnselectedGroups.push(item.Name)
				}
				break;
		}
	})

	if (RequiredUnselectedGroups.length) {
		onFailure && onFailure({ 
			required: RequiredUnselectedGroups 
		})
	}
	else {
		onSuccess && onSuccess({
			model: PostOptions,
		})
	}
}
