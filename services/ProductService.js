import { DELETE, GET, POST, IMG } from '../utils/Network';
import { secondColor } from '../constants/Colors';
import * as mime from 'react-native-mime-types';
import { formatDate, formatTime } from '../utils/Date';
// import console = require('console');
// import console = require('console');

export const GetProductHome = (Id, onSuccess, onFailure) => {
	return GET(`Product/Home?productId=${Id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductDescription = (ProductId, languageId, onSuccess, onFailure) => {
	return GET(`Product/Description?productId=${ProductId}&languageId=${languageId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditProductDescription = ({ Id, Language, Name, ShortDescription, Description, HtmlDescription, SigninHtmlDescription }, onSuccess, onFailure) => {
	return POST(`Product/Description`, {
		Id,
		Language,
		Name,
		ShortDescription,
		Description,
		HtmlDescription,
		SigninHtmlDescription
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductPhysicalInfo = (ProductId, onSuccess, onFailure) => {
	return GET(`Product/PhysicalInfo?productId=${ProductId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductPricing = (ProductId, onSuccess, onFailure) => {
	return GET(`Product/Pricing?productId=${ProductId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductPricingHistory = (ProductId, onSuccess, onFailure) => {
	return GET(`Product/PricingHistory?productId=${ProductId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductOptions = (ProductId, onSuccess, onFailure) => {
	return GET(`Product/ProductOptions?productId=${ProductId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductOptionGroups = (languageId, onSuccess, onFailure) => {
	return GET(`ProductOption/Groups/Simple?languageId=${languageId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductOptionMembers = ({ groupId, languageId }, onSuccess, onFailure) => {
	return GET(`ProductOptionGroup/Members/Simple?parentId=${groupId}&languageId=${languageId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductOptionDetails = (optionId, langaugeId, onSuccess, onFailure) => {
	return GET(`Product/ProductOption?optionId=${optionId}${langaugeId ? `&langaugeId=${langaugeId}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductSettings = (productId, onSuccess, onFailure) => {
	return GET(`Product/Settings?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetProductFiles = (productId, onSuccess, onFailure) => {
	return GET(`Product/File?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditProductStatus = (data, onSuccess, onFailure) => {
	return POST('Product/Status', data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditProductVisibility = ({ productId, visibilityId }, onSuccess, onFailure) => {
	return POST(`Product/Visibility?productId=${productId}&visibilityId=${visibilityId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditProductSettings = ({ Id, selectedCategories, selectedEtags, BrandId, GenderId, EnableQuestions, EnableReview, HideAddToCart }, onSuccess, onFailure) => {
	return POST(`Product/Settings`, { Id, selectedCategories, selectedEtags, BrandId, GenderId, EnableQuestions, EnableReview, HideAddToCart }, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const EditProductPhysicalInfo = ({ Id, Weight, Length, Height, Width, LocalLocation, ManufacturerPartNumber, SKU }, onSuccess, onFailure) => {
	return POST(`Product/PhysicalInfo`, {
		Id,
		Weight,
		Length,
		Height,
		Width,
		LocalLocation,
		ManufacturerPartNumber,
		SKU
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddProduct = (data, onSuccess, onFailure, onUpoadImag) => {
	const {
		Images,
		...restData
	} = data

	return POST(`Product/New`, {
		...restData
	}, res => {

		if (Images.length > 0) {

			let formData = new FormData();

			for (let i = 0; i < Images.length; i++) {
				formData.append('sc', {
					uri: Images[i].picker_image_Path,
					name: `brand_img_${+ new Date()}.jpg`,
					type: 'image/jpg'
				});
			}

			IMG(`Product/Image/Many?productId=${res.data}`,
				formData,
				() => {
					onSuccess && onSuccess(res)
				},
				err => {
					onFailure && onFailure(err)
				}, (pro) => {
					onUpoadImag && onUpoadImag(pro)
				})

		} else {
			onSuccess && onSuccess(res)
		}
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})


}

export const AddProductMedia = ({ Images, productId }, onSuccess, onFailure, onProessUpload) => {
	if (Images.length > 0) {

		let formData = new FormData();

		for (let i = 0; i < Images.length; i++) {
			formData.append('sc', {
				uri: Images[i].picker_image_Path,
				name: `brand_img_${+ new Date()}.jpg`,
				type: 'image/jpg'
			});
		}
		IMG(`Product/Image/Many?productId=${productId}`,
			formData,
			(res) => {
				onSuccess && onSuccess(res)
			},
			err => {
				onFailure && onFailure(err)
			}, (pro) => {
				onProessUpload && onProessUpload(pro)
			})
	}
}

export const AddProductOptionImage = ({ Image, productOptionId }, onSuccess, onFailure, onProessUpload) => {
	let formData = new FormData();
	formData.append('sc', {
		uri: Image,
		name: `product_option_image_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});

	return IMG(`Product/ProductOption/Image?productOptionId=${productOptionId}`,
		formData,
		(res) => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		}, porss => {
			onProessUpload && onProessUpload(porss)
		})
}

export const uploadProductFile = ({ file, productId, fileType }, onSuccess, onFailure) => {
	// alert(mime.lookup(file.fileType))
	let formData = new FormData();
	formData.append('sc', {
		uri: file.uri,
		name: file.fileName,
		type: mime.lookup(file.fileType)
	});

	IMG(`Product/File?productId=${productId}&fileType=${fileType}`,
		formData,
		(res) => {
			onSuccess && onSuccess(res)
		},
		err => {
			onFailure && onFailure(err)
		})
}

export const DeleteProductMedia = ({ productId, imageId }, onSuccess, onFailure) => {
	return DELETE(`Product/Image?productId=${productId}&imageId=${imageId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProductOption = (optionId, onSuccess, onFailure) => {
	DELETE(`Product/ProductOption?optionId=${optionId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProductOptionImage = ({ productOptionId, imageId }, onSuccess, onFailure) => {
	DELETE(`Product/ProductOption/Image?productOptionId=${productOptionId}&imageId=${imageId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProductPriceStep = (stepId, onSuccess, onFailure) => {
	return DELETE(`Product/PriceStep?stepId=${stepId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProduct = (id, onSuccess, onFailure) => {
	DELETE(`Product?id=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProductDemoFile = (productId, onSuccess, onFailure) => {
	return DELETE(`Product/DemoFile?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const DeleteProductPurchaseFile = (productId, onSuccess, onFailure) => {
	return DELETE(`Product/PurchaseFile?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
/**
 *  "Id": 0,
  "ProductId": 0,
  "LowStepQty": 0,
  "HighStepQty": 0,
  "Price": 0
 */
export const AddProductPriceStep = ({ ProductId, LowStepQty, HighStepQty, Price, Id }, onSuccess, onFailure) => {
	return POST(`Product/PriceStep`, { Id, ProductId, LowStepQty, HighStepQty, Price }, res => {
		onSuccess && onSuccess(res)
	}, err => {
		return onFailure(err)
	})
}

export const EditProductPricing = (data, onSuccess, onFailure) => {
	return POST(`Product/Pricing`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		return onFailure(err)
	})
}

export const AddProductOption = (data, onSuccess, onFailure) => {
	return POST(`Product/ProductOption`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const ReorderProductMedia = (productId, Ids, onSuccess, onFailure) => {
	return POST(`Product/OrderImages?productId=${productId}`, Ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const ReorderProductOptionImages = (productOptionId, imagesId, onSuccess, onFailure) => {
	return POST(`Product/ProductOption/OrderImages?productOptionId=${productOptionId}`, imagesId, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}

export const EditProductFiles = ({ Id, AllowedNumberOfDaysForDownload, AllowedNumberOfDownloads }, imagesId, onSuccess, onFailure) => {
	return POST(`Product/FileSettings`, { Id, AllowedNumberOfDaysForDownload, AllowedNumberOfDownloads }, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(res)
	})
}


export const GETProductAnalytics = (productId, onSuccess, onFailure) => {
	return GET(`Product/Analytics?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}


export const PostWhereHouseProducts = (data, onSuccess, onFailure) => {

	return POST('Product/Warehouse', { ...data }, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}

export const GETProductNew = (onSuccess, onFailure) => {
	return GET(`Product/New`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const onAccept = (id, onSuccess, onFailure) => {

	return POST(`Product/Accept?productId=${id}`, {}, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}
export const onDecline = (id, onSuccess, onFailure) => {

	return POST(`Product/Reject?productId=${id}`, {}, res => { onSuccess && onSuccess(res) }, err => { onFailure && onFailure(err) })
}


export const GETRichTextDescription = (productId, languageId, type, onSuccess, onFailure) => {
	return GET(`Product/Description/RichText?productId=${productId}&languageId=${languageId}${type ? `&type=${type}` : ''}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddRichTextDescription = (data, onSuccess, onFailure) => {
	return POST(`Product/Description/RichText`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetProductCollection = (collectionId, onSuccess, onFailure) => {
	return GET(`Collection?collectionId=${collectionId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddEditProductCollection = (data, onSuccess, onFailure) => {
	return POST(`Collection`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetAllProducts = (onSuccess, onFailure) => {
	return GET(`Products`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}
export const DeleteProductCollection = (collectionId, onSuccess, onFailure) => {
	return DELETE(`Collection?collectionId=${collectionId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const AddRelationProductOption = (data, onSuccess, onFailure) => {
	return POST(`Product/ProductOption/Relation`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const DeleteRelationProductOption = (fromProductOption, toProductOption, onSuccess, onFailure) => {
	return DELETE(`Product/ProductOption/Relation?fromProductOption=${fromProductOption}&toProductOption=${toProductOption}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ProductHtmlEditor = (onSuccess, onFailure) => {
	return GET(`Product/HtmlEditor`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const ReorderProduct = (Ids, onSuccess, onFailure) => {
	return POST(`Product/Order`, Ids, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}

export const GetStatusHistory = (productId, onSuccess, onFailure) => {
	return GET(`Product/Status/History?productId=${productId}`, res => {

		const formatted_data = res.data.Data.map(({ Status: { Name, Id }, Date, Note }) => ({
			Id,
			title: Name,
			description: `${formatDate(Date)} ${formatTime(Date)}`,
			dotColor: secondColor,
			circleColor: secondColor,
			Note
		}))

		onSuccess && onSuccess(res, formatted_data)

	}, err => {
		onFailure && onFailure(err)
	})
}


export const GetAllCurrencies = (onSuccess, onFailure) => {
	return GET(`Currency/Tenant/Simple`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}


export const DeleteValidityExtend = (productId, onSuccess, onFailure) => {
	DELETE(`Product/Validity/Extend?productId=${productId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const AcceptValidityExtendRequest = (productId, days, onSuccess, onFailure) => {
	return POST(`Product/Validity/Extend?productId=${productId}&days=${days}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		onFailure && onFailure(err)
	})
}
