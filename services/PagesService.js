import { DELETE, GET, POST, IMG } from "../utils/Network";
// import console = require("console");
// import console = require("console");
// import console = require("console");

export const GetPages = (onSuccess, onFailure) => {
	return GET(`Page/Pages`, res => {
		onSuccess && onSuccess(res);
	},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};

// GET /v1/Page/Config
export const GetPage = (id, onSuccess, onFailure) => {
	return GET(`Page/Config?pageId=${id}`, res => {
		onSuccess && onSuccess(res);
	},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};

export const PostPageSetting = (id, data, onSuccess, onFailure) => {
	return POST(`Page/Config?pageId=${id}`, data, res => {
		onSuccess && onSuccess(res);
	},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};


export const ResetSetting = (id, onSuccess, onFailure) => {
	return POST(`Page/Reset?pageId=${id}`, {}, res => {
		onSuccess && onSuccess(res);
	},
		err => {
			// Do something special if this request fails or ignore
			onFailure && onFailure(err);
		}
	);
};



export const PostListImage = (id, propertyName, Image, onSuccess, onFailure, onUpoadImag) => {

	let formData = new FormData();

	formData.append('sc', {
		uri: Image,
		name: `page_img_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});

	return IMG(`Page/Image/Reorder?pageId=${id}&propertyName=${propertyName}`,
		formData,
		() => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		}, (pro) => {
			onUpoadImag && onUpoadImag(pro)
		})

};

export const PostOneImage = (id, propertyName, title = null, description = null, Image, PageV, PageValue1, PageValue2, onSuccess, onFailure, onUpoadImag) => {

	let formData = new FormData();

	formData.append('sc', {
		uri: Image,
		name: `page_img_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});

	return IMG(`Page/Image?pageId=${id}&propertyName=${propertyName}${title ? `&title=${title}` : ''}${description ? `&description=${description}` : ''}${PageV ? `&pageV=${PageV}` : ''}${PageValue1 ? `&pageValue1=${PageValue1}` : ''}${PageValue2 ? `pageValue2=${PageValue2}` : ''}`,
		formData,
		(res) => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		}, (pro) => {
			onUpoadImag && onUpoadImag(pro)
		})

};

export const DeleteImage = (Pageid, imageId, propertyName, onSuccess, onFailure) => {
	DELETE(`Page/Image?pageId=${Pageid}&imageId=${imageId}&propertyName=${propertyName}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ReOrderImage = (pageId, imageIds, propertyName, onSuccess, onFailure) => {
	POST(`Page/Images/Reorder?pageId=${pageId}&propertyName=${propertyName}`, imageIds, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const UploadFile = (file, pageId, propertyName, onSuccess, onFailure, UploadProscess) => {

	let formData = new FormData();
	formData.append('sc', {
		uri: file.FileUrl,
		name: file.FileName,
		type: file.type
	});

	IMG(`Page/File?pageId=${pageId}&propertyName=${propertyName}`, formData, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	}, process => {
		UploadProscess && UploadProscess(process)
	})
}