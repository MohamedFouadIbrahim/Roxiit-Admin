import { DELETE, GET, IMG, POST } from '../utils/Network';

export const GetProfile = (onSuccess, onFailure) => {
	return GET('Tenant/Profile', res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetCurrency = (onSuccess, onFailure) => {
	return GET('Currency/Tenant/Simple', res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetTheme = (onSuccess, onFailure) => {
	return GET('Theme/AllThemes', res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const PostStory = (data, onSuccess, onFailure) => {
	return POST('Tenant/Profile', data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ChangeStoreImage = (image, onSuccess, onFailure, onUploadProgress) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: image,
		name: `store_img_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});
	IMG('Tenant/Image',
		formData,
		res => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		}, (re) => {
			onUploadProgress && onUploadProgress(re)
		})
}


export const GetStoreListing = (LnagId, onSuccess, onFailure) => {
	return GET(`StoreListing${LnagId ? `?languageId=${LnagId}` : ''}  `, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}


export const PostStoreListing = (data, onSuccess, onFailure) => {
	return POST('StoreListing', data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetStoreStyle = (onSuccess, onFailure) => {
	return GET('Tenant/Design', res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

//SubStore Service : 

export const PostStoreStyle = (data, onSuccess, onFailure) => {
	return POST('Tenant/Design', data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ChangeSubStoreImage = (id, image, onSuccess, onFailure, onUploadProgress) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: image,
		name: `subStore_img_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});
	return IMG(`Tenant/SubStore/Image?subStoreId=${id}`,
		formData,
		res => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		}, (re) => {
			onUploadProgress && onUploadProgress(re)
		})
}



export const GetSubStoreProfile = (id, onSuccess, onFailure) => {
	return GET(`Tenant/SubStore?id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}



export const EditSubStoreProfile = (data, onSuccess, onFailure) => {
	return POST(`Tenant/SubStore`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddSubStoreProfile = (data, image, onSuccess, onFailure, onUploadProgress) => {
	POST(`Tenant/SubStore`, data, res => {
		const Id = res.data
		if (image) {
			let formData = new FormData();

			formData.append('sc', {
				uri: image,
				name: `subStore_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});

			return IMG(`Tenant/SubStore/Image?subStoreId=${Id}`,
				formData,
				res => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				}, (re) => {
					onUploadProgress && onUploadProgress(re)
				})
		} else { onSuccess && onSuccess(res) }

	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetTenantSettings = (onSuccess, onFailure) => {
	return GET(`Tenant/Setting`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddTenantSettings = (data, onSuccess, onFailure) => {
	return POST(`Tenant/Setting`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}
