import { DELETE, GET, POST, IMG } from '../utils/Network';

export const DeleteProductOptionGroup = (id, onSuccess, onFailure) => {
	DELETE(`ProductOption/Group?groupId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const CreateProductOptionGroup = (data, onSuccess, onFailure) => {
	return POST(`ProductOption/Group`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const CreateProductOptionGroupMember = ({ Id, LanguageId, Name, Description, value1, value2, value3, ProductOptionGroupId, Products, PriceChange }, onSuccess, onFailure) => {
	return POST(`ProductOptionGroup/Member`, {
		Id,
		LanguageId,
		Name,
		Description,
		value1, value2, value3,
		ProductOptionGroupId,
		Products,
		PriceChange
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetGroupMembers = (Id, onSuccess, onFailure) => {
	return GET(`ProductOptionGroup/Members/Simple?parentId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetGroup = ({ Id, languageId }, onSuccess, onFailure) => {
	return GET(`ProductOption/Group?groupId=${Id}${languageId ? `&languageId=${languageId}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const DeleteMember = (Id, onSuccess, onFailure) => {
	return DELETE(`ProductOptionGroup/Member?memberId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetMemberDetails = ({ Id, languageId }, onSuccess, onFailure) => {
	return GET(`ProductOptionGroup/Member?Id=${Id}${languageId ? `&languageId=${languageId}` : ""}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}
export const ReoderProductOption = (productId, optionGroupId, ProductOptionGroupId, onSuccess, onFailure) => {
	return POST(`Product/ProductOption/Order?productId=${productId}&optionGroupId=${optionGroupId}`, ProductOptionGroupId, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ReoderProductOptionGroup = (productId, productOptionGroupIds, onSuccess, onFailure) => {
	return POST(`Product/ProductOptionGroup/Order?productId=${productId}`, productOptionGroupIds, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const SetProductOptionDefault = (optionId, onSuccess, onFailure) => {
	return POST(`Product/ProductOption/Default?optionId=${optionId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}


export const removeProductOptionDefault = (optionId, onSuccess, onFailure) => {
	return DELETE(`Product/ProductOption/Default?optionId=${optionId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}
