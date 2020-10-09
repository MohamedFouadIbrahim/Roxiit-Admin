import { store } from '../Store'

const ScreensPermissions = {
	Products: [1, 2],
	ProductOptions: [1, 2],
	Brands: [1, 16],
	Articles: [1, 16],
	ETags: [1, 16],
	Categories: [1, 4],
	CurrencyList: [1, 17],
	Customers: [1, 6],
	Discounts: [1, 5],
	Payment: [1, 19],
	Roles: [1, 13],
	Courier: [1, 18],
	Stories: [1, 7],
	AppTranslation: [1, 14],
	AdminTranslation: [1, 14],
	Warehouses: [1, 15],
	Reviews: [1, 12],
	Orders: [1, 3],
	Questions: [1, 11],
	Analytics: [1, 9],
	StoreProfile: [1, 10],
	Pages: [1, 10],
	Users: [1, 8],
	Inbox: [1, 20],
	Drivers: [1, 21],
	POS: [1, 22],
	QRCodeGenerator: [1, 23],
	NotificationTemplates: [1, 24],
	ManagePlaces: [1, 25],
	ImportArea: [1, 26],
	Pages: [1, 27],
	Affiliate: [1, 28],
	SubStoreProfile: [1, 30],
	TenantSettings: [1, 31]
}

export const IsScreenPermitted = (screen) => {
	const permissions = store.getState().user.permissions

	if (!ScreensPermissions[screen] || permissions.some(item => ScreensPermissions[screen].includes(item))) {
		return true
	}

	return false
}

export const IsUserPermitted = (permissionId) => {

	const permissions = store.getState().user.permissions

	if (permissions.includes(permissionId)) {
		return true
	}

	return false

}