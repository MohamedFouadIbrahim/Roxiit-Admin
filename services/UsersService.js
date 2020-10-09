import { DELETE, GET, POST, IMG } from '../utils/Network';

export const DeleteUser = (id, onSuccess, onFailure) => {
	DELETE(`User?userId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetUser = (id, onSuccess, onFailure) => {
	return GET(`User/Home?userId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const UserDriverReport = (userId, from, to, onSuccess, onFailure) => {
	return POST(`Driver/Report?userId=${userId}&from=${from}&to=${to}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})

}

export const LogoutUser = (id, onSuccess, onFailure) => {
	POST(`User/Signout?userId=${id}`, {}, res => {

		//Delete Pending Intervals (in home page and pendding orders list)
		clearInterval(global.penddingIntervalId)
		clearInterval(global.homePenddingIntervalId)
		global.penddingIntervalId = null
		global.interval = null
		global.homePenddingIntervalId = null

		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeUserLanguage = (user_id, language_id, onSuccess, onFailure) => {
	POST(`User/Language`, {
		LanguageId: language_id,
		UserId: user_id
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeUserImage = (user_id, image, onSuccess, onFailure, onUploadProgress) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: image,
		name: `user_img_${+ new Date()}.jpg`,
		type: 'image/jpg'
	});

	IMG(`User/Image?userId=${user_id}`,
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

export const GetUserInfo = (id, onSuccess, onFailure) => {
	GET(`User/PersonalInfo?userId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditUserInfo = (data, onSuccess, onFailure) => {
	POST(`User/PersonalInfo`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const ChangeUserPassword = (id, password, onSuccess, onFailure) => {
	POST(`User/ChangePassword`, {
		userId: id,
		Password: password,
		PasswordConfirm: password,
	}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetUserNotificationPreferences = (id, onSuccess, onFailure) => {
	GET(`User/Notifications-preferences?userId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditUserNotificationPreferences = (data, onSuccess, onFailure) => {
	POST(`User/Notifications-preferences`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const GetUserPermissions = (id, onSuccess, onFailure) => {
	GET(`User/Security?userId=${id}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const EditUserPermissions = (data, onSuccess, onFailure) => {
	POST(`User/Security`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const AddNewUser = (data, onSuccess, onFailure) => {
	POST(`User/New`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		//onFailure && 
		onFailure(err)
		return true
	})
}

export const GetUserChat = (UserId, onSuccess, onFailure) => {
	GET(`User/Chats?userId=${UserId}`, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}

export const SendMsgForUser = (data, onSuccess, onFailure) => {
	POST(`User/Chat`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const TimeZoneForUser = (data, onSuccess, onFailure) => {
	POST(`User/Timezone`, data, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}


export const SendFileForUser = (UserId, file, onSuccess, onFailure, onUpoadFile) => {
	let formData = new FormData();

	formData.append('sc', {
		uri: file.uri,
		name: file.name,
		type: file.type
	});

	IMG(`User/Chat/File?userId=${UserId}`, formData, (res) => {

		onSuccess && onSuccess(res)

	}, err => {

		onFailure && onFailure(err)

	}, (pro) => {

		onUpoadFile && onUpoadFile(pro)

	})
}


export const TestNotificationForUser = (UserId, onSuccess, onFailure) => {
	POST(`User/notification/test?UserId=${UserId}`, {}, res => {
		onSuccess && onSuccess(res)
	}, err => {
		// Do something special if this request fails or ignore
		onFailure && onFailure(err)
	})
}
