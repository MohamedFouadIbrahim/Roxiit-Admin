import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View } from 'react-native';
import FontedText from '../components/FontedText';
import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import AddNewCustomer from '../containers/AddNewCustomer/index';
import AddUser from '../containers/AddUser';
import AddWarehouse from '../containers/AddWarehouse';
import Affiliate from '../containers/Affiliate';
import AffiliateRole from '../containers/Affiliate/AffiliateRole';
import AffiliateRoles from '../containers/Affiliate/AffiliateRoles';
import Analytics from '../containers/Analytics';
import Article from '../containers/Article';
import Articles from '../containers/Articles';
import Brand from '../containers/Brand';
import Brands from '../containers/Brands';
import Categories from '../containers/Categories';
import Category from '../containers/Categories/Category';
import CategoriesFilter from '../containers/Categories/CategoriesFilter';
import CategoryReorder from '../containers/Categories/CategoryReorder';
import CategoryReorderInHomePage from '../containers/Categories/CategoryReorderInHomePage';
import newCategory from '../containers/Categories/newCategory';
import Checkout from '../containers/Checkout';
import { darkColor, secondColor, mainColor } from '../constants/Colors';
import CourierConfigrations from '../containers/Checkout/CourierConfigrations';
import AddAdvanceSettings from '../containers/Courier/AddAdvanceSettings';
import AdvanceSettings from '../containers/Courier/AdvanceSettings';
import AdvanceSettingsTab from '../containers/Courier/AdvanceSettingsTab';
import CourierConfig from '../containers/Courier/ConfigTab';
import CourierIndex from '../containers/Courier/Index';
import CurrencyList from '../containers/CurrencyList';
import Customer from '../containers/Customer';
import CustomerAddress from '../containers/Customer/CustomerAddress';
import AddressIndex from '../containers/Customer/CustomerAddressindex';
import CustomerAffiliate from '../containers/Customer/CustomerAffiliate';
import CustomerChangePassword from '../containers/Customer/CustomerChangePassword';
import CustomerPersonalInfo from '../containers/Customer/CustomerPersonalInfo';
import Customers from '../containers/Customers';
import Discount from '../containers/Discount';
import DiscountQRCode from '../containers/Discount/DiscountQRCode';
import Discounts from '../containers/Discounts';
import DiscountsFilters from '../containers/Discounts/DiscountsFilters';
import EditTranslation from '../containers/EditTranslation';
import EntitySelector from '../containers/EntitySelector';
import EtagScreen from '../containers/ETag/index';
import ETags from '../containers/ETags';
import GoLiveDetails from '../containers/GoLive/Details';
import Home from '../containers/Home';
import HtmlTextEditor from '../containers/HtmlTextEditor';
import IconSelector from '../containers/IconSelector';
import ImportProductsCatrgories from '../containers/ImportProductsCatrgories';
import ProductConfig from '../containers/ImportProductsCatrgories/ProductConfig';
import ProductConfirm from '../containers/ImportProductsCatrgories/ProductConfirm';
import StockConfig from '../containers/ImportProductsCatrgories/StockConfig';
import CustomTabBar from './CustomTabBar';
import Inbox from '../containers/Inbox/index';
import Area from '../containers/ManagePlaces/Area';
import Areas from '../containers/ManagePlaces/Areas';
import Cities from '../containers/ManagePlaces/Cities';
import City from '../containers/ManagePlaces/City';
import Countries from '../containers/ManagePlaces/Countries';
import MultiLevelSelector from '../containers/MultiLevelSelector';
import MyApp from '../containers/MyApp';
import Notifications from '../containers/Notifications';
import Order from '../containers/Order';
import OrderChat from '../containers/Order/OrderChat';
import OrderDetails from '../containers/Order/OrderDetails';
import OrderHistory from '../containers/Order/OrderHistory';
import OrderItem from '../containers/Order/OrderItem';
import OrderItems from '../containers/Order/OrderItems';
import OrderNote from '../containers/Order/OrderNote';
import Reminder from '../containers/Order/Reminder';
import Orders from '../containers/Orders';
import OrderLocation from '../containers/Orders/OrderLocation';
import OrdersFilters from '../containers/Orders/OrdersFilters';
import Pages from '../containers/Pages/index';
import PageConfigType from '../containers/Pages/PageConfigType';
import PageSetting from '../containers/Pages/PageSetting';
import PaymentConfig from '../containers/PaymentConfig/index';
import PaymentMethods from '../containers/PaymentMethods/index';
import PayMentMethodItem from '../containers/PaymentMethods/PayMentMethodItem';
import PopUp from "../containers/PopUp";
import PopUps from "../containers/PopUps";
import POS from '../containers/POS';
import ProductOptionGroup from '../containers/ProductOptionGroup';
import ProductOptionMembers from '../containers/ProductOptionMembers';
import editMember from '../containers/ProductOptionMembers/editMember';
import ProductOptions from '../containers/ProductOptions';
import optionGroup from '../containers/ProductOptionGroup/optionGroup'
import Products from '../containers/Products';
import EmptyScreen from '../containers/Products/EmptyScreen';
import newProduct from '../containers/Products/NewProductIndex';
import NewProductWherehouses from '../containers/Products/NewProductWherehouses';
import Product from '../containers/Products/Product';
import ProductReorder from '../containers/Products/ProductReorder';
import ProductsFilters from '../containers/Products/ProductsFilters';
import PushNotification from '../containers/PushNotification';
import PushNotificationHistory from '../containers/PushNotification/PushNotificationHistory';
import PushNotifications from '../containers/PushNotifications';
import QRCodeGenerator from '../containers/QRCodeGenerator';
import QuestionsIndex from '../containers/Questions/index';
import Questions from '../containers/Questions/Questions';
import Index from '../containers/Reviews/index';
import Review from '../containers/Reviews/Review';
import Role from '../containers/Role';
import Roles from '../containers/Roles';
import Sessions from "../containers/Sessions";
import Lnaguages from '../containers/StoreProfile/Lnaguages';
import Store from '../containers/StoreProfile/Store';
import StoreList from "../containers/StoreProfile/StoreList";
import StoreStyle from "../containers/StoreProfile/StoreStyle";
import SubStoreMap from '../containers/StoreProfile/SubStoreMap';
import SubStoreProfile from '../containers/StoreProfile/SubStoreProfile';
import TenantSettings from '../containers/StoreProfile/TenantSettings';
import Stores from '../containers/Stores';
import SubStoreTypes from '../containers/Stores/SubStoreTypes';
import SubStoreType from '../containers/Stores/SubStoreType'
import Translation from "../containers/Translation";
import User from '../containers/User';
import DriverReport from '../containers/User/DriverReport';
import UserChangePassword from '../containers/User/UserChangePassword';
import UserNotificationPreferences from '../containers/User/UserNotificationPreferences';
import UserPermissions from '../containers/User/UserPermissions';
import UserPersonalInfo from '../containers/User/UserPersonalInfo';
import Users from '../containers/Users';
import Warehouse from '../containers/Warehouse/index';
import WarehouseAddress from "../containers/Warehouse/WarehouseAddress";
import WarehouseBasicInfo from '../containers/Warehouse/WarehouseBasicInfo';
import WarehouseUsers from "../containers/Warehouse/WarehouseUsers";
import WarehouseWorkinghours from '../containers/Warehouse/WarehouseWorkinghours';
import WherehouseProudcts from '../containers/Warehouse/WherehouseProudcts';
import WherehousesCheckIn from '../containers/Warehouse/WherehousesCheckIn';
import Warehouses from '../containers/Warehouses/index';
import { connect } from 'react-redux';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons'
import OrdersStatus from '../containers/OrdersStatus';
import OrderStatus from '../containers/OrdersStatus/OrderStatus';


const TranslationScreen = (props) => (
	<Translation translationType={"App"} {...props} />
)

const AdminTranslationScreen = (props) => (
	<Translation translationType={"Admin"} {...props} />
)

const DriverOrder = (props) => (
	<Orders isDriverMode={true} {...props} />
)


const OrdersScreen = (props) => (
	<Orders isDriverMode={false} {...props} />
)

const Inbox_Stack_Navigator = createStackNavigator();

const Inbox_Stack = () => (
	<Inbox_Stack_Navigator.Navigator headerMode='none' >
		<Inbox_Stack_Navigator.Screen name='Inbox' component={Inbox} />
		<Inbox_Stack_Navigator.Screen name='Customers' component={Customers} />
		<Inbox_Stack_Navigator.Screen name='Customer' component={Customer} />
		<Inbox_Stack_Navigator.Screen name='AddNewCustomer' component={AddNewCustomer} />
		<Inbox_Stack_Navigator.Screen name='CustomerChangePassword' component={CustomerChangePassword} />
		<Inbox_Stack_Navigator.Screen name='CustomerPersonalInfo' component={CustomerPersonalInfo} />
		<Inbox_Stack_Navigator.Screen name='CustomerAffiliate' component={CustomerAffiliate} />
		<Inbox_Stack_Navigator.Screen name='Chat' component={OrderChat} />
		<Inbox_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
		<Inbox_Stack_Navigator.Screen name='AddressIndex' component={AddressIndex} />

		<Inbox_Stack_Navigator.Screen name='Orders' component={OrdersScreen} />
		<Inbox_Stack_Navigator.Screen name='CustomerAddress' component={CustomerAddress} />
		<Inbox_Stack_Navigator.Screen name='Order' component={Order} />
		<Inbox_Stack_Navigator.Screen name='OrderDetails' component={OrderDetails} />
		<Inbox_Stack_Navigator.Screen name='OrdersFilters' component={OrdersFilters} />
		<Inbox_Stack_Navigator.Screen name='OrderHistory' component={OrderHistory} />
		<Inbox_Stack_Navigator.Screen name='OrderItems' component={OrderItems} />
		<Inbox_Stack_Navigator.Screen name='OrderItem' component={OrderItem} />
		<Inbox_Stack_Navigator.Screen name='OrderChat' component={OrderChat} />
		<Inbox_Stack_Navigator.Screen name='POS' component={POS} />
		<Inbox_Stack_Navigator.Screen name='OrderLocation' component={OrderLocation} />
		<Inbox_Stack_Navigator.Screen name='Reminder' component={Reminder} />
		<Inbox_Stack_Navigator.Screen name='OrderNote' component={OrderNote} />

		<Inbox_Stack_Navigator.Screen name='UserHome' component={User} />
		<Inbox_Stack_Navigator.Screen name='UserPersonalInfo' component={UserPersonalInfo} />
		<Inbox_Stack_Navigator.Screen name='UserChangePassword' component={UserChangePassword} />
		<Inbox_Stack_Navigator.Screen name='UserNotificationPreferences' component={UserNotificationPreferences} />
		<Inbox_Stack_Navigator.Screen name='UserPermissions' component={UserPermissions} />

		<Inbox_Stack_Navigator.Screen name='Users' component={Users} />
		<Inbox_Stack_Navigator.Screen name='AddUser' component={AddUser} />
		<Inbox_Stack_Navigator.Screen name='DriverReport' component={DriverReport} />
		<Inbox_Stack_Navigator.Screen name='Checkout' component={Checkout} />
		<Inbox_Stack_Navigator.Screen name='CourierConfigrations' component={CourierConfigrations} />

	</Inbox_Stack_Navigator.Navigator>
)

const Orders_Stack_Navigator = createStackNavigator();


const Orders_Stack = () => (
	<Orders_Stack_Navigator.Navigator headerMode='none' >
		<Orders_Stack_Navigator.Screen name='Orders' component={OrdersScreen} />
		<Orders_Stack_Navigator.Screen name='Order' component={Order} />
		<Orders_Stack_Navigator.Screen name='OrderDetails' component={OrderDetails} />
		<Orders_Stack_Navigator.Screen name='OrdersFilters' component={OrdersFilters} />
		<Orders_Stack_Navigator.Screen name='OrderHistory' component={OrderHistory} />
		<Orders_Stack_Navigator.Screen name='OrderItems' component={OrderItems} />
		<Orders_Stack_Navigator.Screen name='OrderItem' component={OrderItem} />
		<Orders_Stack_Navigator.Screen name='OrderChat' component={OrderChat} />
		<Orders_Stack_Navigator.Screen name='POS' component={POS} />
		<Orders_Stack_Navigator.Screen name='OrderLocation' component={OrderLocation} />
		<Orders_Stack_Navigator.Screen name='Reminder' component={Reminder} />
		<Orders_Stack_Navigator.Screen name='OrderNote' component={OrderNote} />
		<Orders_Stack_Navigator.Screen name='Customers' component={Customers} />
		<Orders_Stack_Navigator.Screen name='Customer' component={Customer} />
		<Orders_Stack_Navigator.Screen name='AddNewCustomer' component={AddNewCustomer} />
		<Orders_Stack_Navigator.Screen name='CustomerChangePassword' component={CustomerChangePassword} />
		<Orders_Stack_Navigator.Screen name='CustomerPersonalInfo' component={CustomerPersonalInfo} />
		<Orders_Stack_Navigator.Screen name='CustomerAffiliate' component={CustomerAffiliate} />
		<Orders_Stack_Navigator.Screen name='Chat' component={OrderChat} />
		<Orders_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
		<Orders_Stack_Navigator.Screen name='CustomerAddress' component={CustomerAddress} />
		<Orders_Stack_Navigator.Screen name='AddressIndex' component={AddressIndex} />
		<Orders_Stack_Navigator.Screen name='Checkout' component={Checkout} />
		<Orders_Stack_Navigator.Screen name='CourierConfigrations' component={CourierConfigrations} />
	</Orders_Stack_Navigator.Navigator>
)

const ProductsStack_Navigator = createStackNavigator();

const ProductsStack = () => (
	<ProductsStack_Navigator.Navigator headerMode='none' >
		<ProductsStack_Navigator.Screen name='Products' component={Products} />
		<ProductsStack_Navigator.Screen name='Product' component={Product} />
		<ProductsStack_Navigator.Screen name='EmptyScreen' component={EmptyScreen} />
		<ProductsStack_Navigator.Screen name='ProductsFilters' component={ProductsFilters} />
		<ProductsStack_Navigator.Screen name='QuestionsIndex' component={QuestionsIndex} />
		<ProductsStack_Navigator.Screen name='Questions' component={Questions} />
		<ProductsStack_Navigator.Screen name='Reviews' component={Index} />
		<ProductsStack_Navigator.Screen name='Review' component={Review} />
		<ProductsStack_Navigator.Screen name='MultiLevelSelector' component={MultiLevelSelector} />
		<ProductsStack_Navigator.Screen name='newProduct' component={newProduct} />
		<ProductsStack_Navigator.Screen name='NewProductWherehouses' component={NewProductWherehouses} />
		<ProductsStack_Navigator.Screen name='HtmlTextEditor' component={HtmlTextEditor} />
		<ProductsStack_Navigator.Screen name='ProductReorder' component={ProductReorder} />
		<ProductsStack_Navigator.Screen name='Stores' component={Stores} />
		<ProductsStack_Navigator.Screen name='Users' component={Users} />
		<ProductsStack_Navigator.Screen name='SubStoreProfile' component={SubStoreProfile} />
		<ProductsStack_Navigator.Screen name='SubStoreTypes' component={SubStoreTypes} />

		<ProductsStack_Navigator.Screen name='Customers' component={Customers} />
		<ProductsStack_Navigator.Screen name='Customer' component={Customer} />
		<ProductsStack_Navigator.Screen name='AddNewCustomer' component={AddNewCustomer} />
		<ProductsStack_Navigator.Screen name='CustomerChangePassword' component={CustomerChangePassword} />
		<ProductsStack_Navigator.Screen name='CustomerPersonalInfo' component={CustomerPersonalInfo} />
		<ProductsStack_Navigator.Screen name='CustomerAffiliate' component={CustomerAffiliate} />
		<ProductsStack_Navigator.Screen name='Chat' component={OrderChat} />
		<ProductsStack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
		<ProductsStack_Navigator.Screen name='CustomerAddress' component={CustomerAddress} />
		<ProductsStack_Navigator.Screen name='AddressIndex' component={AddressIndex} />

		<ProductsStack_Navigator.Screen name='Orders' component={OrdersScreen} />
		<ProductsStack_Navigator.Screen name='OrdersFilters' component={OrdersFilters} />
		<ProductsStack_Navigator.Screen name='Order' component={Order} />
		<ProductsStack_Navigator.Screen name='OrderDetails' component={OrderDetails} />
		<ProductsStack_Navigator.Screen name='OrderHistory' component={OrderHistory} />
		<ProductsStack_Navigator.Screen name='OrderItems' component={OrderItems} />
		<ProductsStack_Navigator.Screen name='OrderItem' component={OrderItem} />
		<ProductsStack_Navigator.Screen name='OrderChat' component={OrderChat} />
		<ProductsStack_Navigator.Screen name='POS' component={POS} />
		<ProductsStack_Navigator.Screen name='OrderLocation' component={OrderLocation} />
		<ProductsStack_Navigator.Screen name='Reminder' component={Reminder} />
		<ProductsStack_Navigator.Screen name='OrderNote' component={OrderNote} />
		<ProductsStack_Navigator.Screen name='Checkout' component={Checkout} />
		<ProductsStack_Navigator.Screen name='CourierConfigrations' component={CourierConfigrations} />
	</ProductsStack_Navigator.Navigator>
)

const AppUrl_Stack_Navigator = createStackNavigator()

const AppUrl_Stack = () => (
	<AppUrl_Stack_Navigator.Navigator headerMode='none' >
		<AppUrl_Stack_Navigator.Screen name='MyApp' component={MyApp} />
	</AppUrl_Stack_Navigator.Navigator>
)

const Home_Stack_Navigator = createStackNavigator();

const Home_Stack = () => (
	<Home_Stack_Navigator.Navigator headerMode='none' >
		<Home_Stack_Navigator.Screen name='Home' component={Home} />
		<Home_Stack_Navigator.Screen name='AddAdvanceSettings' component={AddAdvanceSettings} />
		<Home_Stack_Navigator.Screen name='AddressIndex' component={AddressIndex} />
		<Home_Stack_Navigator.Screen name='AddNewCustomer' component={AddNewCustomer} />
		<Home_Stack_Navigator.Screen name='AdminTranslation' component={AdminTranslationScreen} />
		<Home_Stack_Navigator.Screen name='AddUser' component={AddUser} />
		<Home_Stack_Navigator.Screen name='AddWarehouse' component={AddWarehouse} />
		<Home_Stack_Navigator.Screen name='AdvanceSettings' component={AdvanceSettings} />
		<Home_Stack_Navigator.Screen name='AdvanceSettingsTab' component={AdvanceSettingsTab} />
		<Home_Stack_Navigator.Screen name='Affiliate' component={Affiliate} />
		<Home_Stack_Navigator.Screen name='AffiliateRoles' component={AffiliateRoles} />
		<Home_Stack_Navigator.Screen name='AffiliateRoleScreen' component={AffiliateRole} />
		<Home_Stack_Navigator.Screen name='AppTranslation' component={TranslationScreen} />
		<Home_Stack_Navigator.Screen name='Area' component={Area} />
		<Home_Stack_Navigator.Screen name='Areas' component={Areas} />
		<Home_Stack_Navigator.Screen name='Article' component={Article} />
		<Home_Stack_Navigator.Screen name='Articles' component={Articles} />

		<Home_Stack_Navigator.Screen name='Brand' component={Brand} />
		<Home_Stack_Navigator.Screen name='Brands' component={Brands} />

		<Home_Stack_Navigator.Screen name='Categories' component={Categories} />
		<Home_Stack_Navigator.Screen name='CategoriesFilter' component={CategoriesFilter} />
		<Home_Stack_Navigator.Screen name='CategoriesScreen' component={Categories} />
		<Home_Stack_Navigator.Screen name='CategoryReorder' component={CategoryReorder} />
		<Home_Stack_Navigator.Screen name='CategoryReorderInHomePage' component={CategoryReorderInHomePage} />
		<Home_Stack_Navigator.Screen name='CategoryScreen' component={Category} />
		<Home_Stack_Navigator.Screen name='Chat' component={OrderChat} />
		<Home_Stack_Navigator.Screen name='Checkout' component={Checkout} />
		<Home_Stack_Navigator.Screen name='Cities' component={Cities} />
		<Home_Stack_Navigator.Screen name='City' component={City} />
		<Home_Stack_Navigator.Screen name='Countries' component={Countries} />
		<Home_Stack_Navigator.Screen name='Courier' component={CourierIndex} />
		<Home_Stack_Navigator.Screen name='CourierConfig' component={CourierConfig} />
		<Home_Stack_Navigator.Screen name='CourierConfigrations' component={CourierConfigrations} />
		<Home_Stack_Navigator.Screen name='CurrencyList' component={CurrencyList} />
		<Home_Stack_Navigator.Screen name='Customer' component={Customer} />
		<Home_Stack_Navigator.Screen name='CustomerAddress' component={CustomerAddress} />
		<Home_Stack_Navigator.Screen name='CustomerAffiliate' component={CustomerAffiliate} />
		<Home_Stack_Navigator.Screen name='CustomerChangePassword' component={CustomerChangePassword} />
		<Home_Stack_Navigator.Screen name='CustomerPersonalInfo' component={CustomerPersonalInfo} />
		<Home_Stack_Navigator.Screen name='Customers' component={Customers} />


		<Home_Stack_Navigator.Screen name='Discount' component={Discount} />
		<Home_Stack_Navigator.Screen name='DiscountQRCode' component={DiscountQRCode} />
		<Home_Stack_Navigator.Screen name='Discounts' component={Discounts} />
		<Home_Stack_Navigator.Screen name='DiscountsFilters' component={DiscountsFilters} />
		<Home_Stack_Navigator.Screen name='DriverReport' component={DriverReport} />
		<Home_Stack_Navigator.Screen name='Drivers' component={DriverOrder} />

		<Home_Stack_Navigator.Screen name='editMember' component={editMember} />
		<Home_Stack_Navigator.Screen name='EditTranslation' component={EditTranslation} />
		<Home_Stack_Navigator.Screen name='EmptyScreen' component={EmptyScreen} />
		<Home_Stack_Navigator.Screen name='EntitySelector' component={EntitySelector} />
		<Home_Stack_Navigator.Screen name='ETags' component={ETags} />
		<Home_Stack_Navigator.Screen name='EtagScreen' component={EtagScreen} />

		<Home_Stack_Navigator.Screen name='GoLiveBrands' component={Brands} />
		<Home_Stack_Navigator.Screen name='GoLiveCategories' component={Categories} />
		<Home_Stack_Navigator.Screen name='GoLiveCourierIndex' component={CourierIndex} />
		<Home_Stack_Navigator.Screen name='GoLiveDetails' component={GoLiveDetails} />
		<Home_Stack_Navigator.Screen name='GoLivePages' component={Pages} />
		<Home_Stack_Navigator.Screen name='GoLivePaymentMethods' component={PaymentMethods} />
		<Home_Stack_Navigator.Screen name='GoLiveProducts' component={Products} />
		<Home_Stack_Navigator.Screen name='GoLiveStore' component={Store} />
		<Home_Stack_Navigator.Screen name='GoLiveStoreList' component={StoreList} />
		<Home_Stack_Navigator.Screen name='GoLiveStoreStyle' component={StoreStyle} />

		<Home_Stack_Navigator.Screen name='HtmlTextEditor' component={HtmlTextEditor} />

		<Home_Stack_Navigator.Screen name='IconSelector' component={IconSelector} />
		<Home_Stack_Navigator.Screen name='ImportArea' component={ImportProductsCatrgories} />
		<Home_Stack_Navigator.Screen name='ImportProductsCatrgories' component={ImportProductsCatrgories} />
		<Home_Stack_Navigator.Screen name='Inbox' component={Inbox} />

		<Home_Stack_Navigator.Screen name='Lnaguages' component={Lnaguages} />

		<Home_Stack_Navigator.Screen name='MultiLevelSelector' component={MultiLevelSelector} />

		<Home_Stack_Navigator.Screen name='newCategory' component={newCategory} />
		<Home_Stack_Navigator.Screen name='newProduct' component={newProduct} />
		<Home_Stack_Navigator.Screen name='newProduct_Alt' component={newProduct} />
		<Home_Stack_Navigator.Screen name='NewProductWherehouses' component={NewProductWherehouses} />
		<Home_Stack_Navigator.Screen name='Notifications' component={Notifications} />
		<Home_Stack_Navigator.Screen name='NotificationTemplates' component={PushNotifications} />
		<Home_Stack_Navigator.Screen name='PushNotification' component={PushNotification} />
		<Home_Stack_Navigator.Screen name='PushNotificationHistory' component={PushNotificationHistory} />

		<Home_Stack_Navigator.Screen name='optionGroup' component={optionGroup} />
		<Home_Stack_Navigator.Screen name='Order' component={Order} />
		<Home_Stack_Navigator.Screen name='OrderChat' component={OrderChat} />
		<Home_Stack_Navigator.Screen name='OrderDetails' component={OrderDetails} />
		<Home_Stack_Navigator.Screen name='OrdersFilters' component={OrdersFilters} />
		<Home_Stack_Navigator.Screen name='OrderHistory' component={OrderHistory} />
		<Home_Stack_Navigator.Screen name='OrderItem' component={OrderItem} />
		<Home_Stack_Navigator.Screen name='OrderItems' component={OrderItems} />
		<Home_Stack_Navigator.Screen name='OrderLocation' component={OrderLocation} />
		<Home_Stack_Navigator.Screen name='OrderNote' component={OrderNote} />
		<Home_Stack_Navigator.Screen name='Orders' component={OrdersScreen} />

		<Home_Stack_Navigator.Screen name='PageConfigType' component={PageConfigType} />
		<Home_Stack_Navigator.Screen name='Pages' component={Pages} />
		<Home_Stack_Navigator.Screen name='PageSetting' component={PageSetting} />
		<Home_Stack_Navigator.Screen name='Payment' component={PaymentMethods} />
		<Home_Stack_Navigator.Screen name='PaymentConfig' component={PaymentConfig} />
		<Home_Stack_Navigator.Screen name='PayMentMethodItem' component={PayMentMethodItem} />
		<Home_Stack_Navigator.Screen name='PopUp' component={PopUp} />
		<Home_Stack_Navigator.Screen name='PopUps' component={PopUps} />
		<Home_Stack_Navigator.Screen name='POS' component={POS} />
		<Home_Stack_Navigator.Screen name='Product' component={Product} />
		<Home_Stack_Navigator.Screen name='ProductConfig' component={ProductConfig} />
		<Home_Stack_Navigator.Screen name='ProductConfirm' component={ProductConfirm} />
		<Home_Stack_Navigator.Screen name='ProductsFilters' component={ProductsFilters} />
		<Home_Stack_Navigator.Screen name='ProductOptionGroup' component={ProductOptionGroup} />
		<Home_Stack_Navigator.Screen name='ProductOptionMembers' component={ProductOptionMembers} />
		<Home_Stack_Navigator.Screen name='ProductOptions' component={ProductOptions} />
		<Home_Stack_Navigator.Screen name='ProductReorder' component={ProductReorder} />
		<Home_Stack_Navigator.Screen name='Products' component={Products} />

		<Home_Stack_Navigator.Screen name='QRCodeGenerator' component={QRCodeGenerator} />
		<Home_Stack_Navigator.Screen name='Questions' component={QuestionsIndex} />
		<Home_Stack_Navigator.Screen name='QuestionsIndex' component={QuestionsIndex} />
		<Home_Stack_Navigator.Screen name='Question' component={Questions} />

		<Home_Stack_Navigator.Screen name='Reminder' component={Reminder} />
		<Home_Stack_Navigator.Screen name='Review' component={Review} />
		<Home_Stack_Navigator.Screen name='Reviews' component={Index} />
		<Home_Stack_Navigator.Screen name='Role' component={Role} />
		<Home_Stack_Navigator.Screen name='Roles' component={Roles} />

		<Home_Stack_Navigator.Screen name='Sessions' component={Sessions} />
		<Home_Stack_Navigator.Screen name='StockConfig' component={StockConfig} />
		<Home_Stack_Navigator.Screen name='Store' component={Store} />
		<Home_Stack_Navigator.Screen name='StoreList' component={StoreList} />
		<Home_Stack_Navigator.Screen name='StoreProfile' component={Store} />
		<Home_Stack_Navigator.Screen name='Stores' component={Stores} />
		<Home_Stack_Navigator.Screen name='StoreStyle' component={StoreStyle} />
		<Home_Stack_Navigator.Screen name='SubStoreMap' component={SubStoreMap} />
		<Home_Stack_Navigator.Screen name='SubStoreProfile' component={SubStoreProfile} />
		<Home_Stack_Navigator.Screen name='SubStoreType' component={SubStoreType} />
		<Home_Stack_Navigator.Screen name='SubStoreTypes' component={SubStoreTypes} />

		<Home_Stack_Navigator.Screen name='TenantSettings' component={TenantSettings} />

		<Home_Stack_Navigator.Screen name='UserChangePassword' component={UserChangePassword} />
		<Home_Stack_Navigator.Screen name='UserHome' component={User} />
		<Home_Stack_Navigator.Screen name='UserHomeOnly' component={User} />
		<Home_Stack_Navigator.Screen name='UserNotificationPreferences' component={UserNotificationPreferences} />
		<Home_Stack_Navigator.Screen name='UserPermissions' component={UserPermissions} />
		<Home_Stack_Navigator.Screen name='UserPersonalInfo' component={UserPersonalInfo} />
		<Home_Stack_Navigator.Screen name='Users' component={Users} />

		<Home_Stack_Navigator.Screen name='Warehouse' component={Warehouse} />
		<Home_Stack_Navigator.Screen name='WarehouseAddress' component={WarehouseAddress} />
		<Home_Stack_Navigator.Screen name='WarehouseBasicInfo' component={WarehouseBasicInfo} />
		<Home_Stack_Navigator.Screen name='WherehouseProudcts' component={WherehouseProudcts} />
		<Home_Stack_Navigator.Screen name='Warehouses' component={Warehouses} />
		<Home_Stack_Navigator.Screen name='WherehousesCheckIn' component={WherehousesCheckIn} />
		<Home_Stack_Navigator.Screen name='WarehouseUsers' component={WarehouseUsers} />
		<Home_Stack_Navigator.Screen name='WarehouseWorkinghours' component={WarehouseWorkinghours} />
		<Home_Stack_Navigator.Screen name='OrdersStatus' component={OrdersStatus} />
		<Home_Stack_Navigator.Screen name='OrderStatus' component={OrderStatus} />
		<Home_Stack_Navigator.Screen name='MyApp' component={AppUrl_Stack} />


	</Home_Stack_Navigator.Navigator>
)


const tabBarIconSize = 18

const Tab = createBottomTabNavigator();

// badge on the bottom navigation bar icon
const renderBadge = (count) => {
	if (count > 0) {
		return (
			<View
				style={{
					position: 'absolute',
					top: -15,
					left: 15,
					justifyContent: 'center',
					alignItems: 'center',
					width: 18,
					height: 18,
					borderRadius: 7,
					backgroundColor: secondColor,
				}}>
				<FontedText style={{ color: 'white', fontSize: 12 }}>{count}</FontedText>
			</View>
		)
	}
}

// bottom navigation bar + badge on the top of the icons
const Add = (props) => {
	const { badges_data } = props
	return (
		<Tab.Navigator tabBarOptions={{
			activeTintColor: secondColor,
			style: {
				height: 47,
				paddingBottom: 4,
				paddingTop: 4,
			}
		}} >
			<Tab.Screen
				name='Home'
				component={Home_Stack}
				options={{
					tabBarIcon: ({ tintColor, focused }) => {
						return (
							<View>
								<SimpleLineIcons color={focused ? secondColor : tintColor} name='home' size={tabBarIconSize} />
								{renderBadge(badges_data['Home'])}
							</View>
						)
					}
				}}
			/>

			<Tab.Screen
				name='Products'
				component={ProductsStack}
				options={{
					tabBarIcon: ({ tintColor, focused }) => {
						return (
							<View>
								<SimpleLineIcons color={focused ? secondColor : tintColor} name='bag' size={tabBarIconSize} />
								{renderBadge(badges_data['Products'])}
							</View>
						)
					}
				}}
			/>

			<Tab.Screen
				name='Orders'
				component={Orders_Stack}
				options={{
					tabBarIcon: ({ tintColor, focused }) => {
						return (
							<View>
								<SimpleLineIcons color={focused ? secondColor : tintColor} name='layers' size={tabBarIconSize} />
								{renderBadge(badges_data['Orders'])}
							</View>
						)
					}
				}}
			/>

			<Tab.Screen
				name='Inbox'
				component={Inbox_Stack}
				options={{
					tabBarIcon: ({ tintColor, focused }) => {
						return (
							<View>
								<SimpleLineIcons color={focused ? secondColor : tintColor} name='drawer' size={tabBarIconSize} />
								{renderBadge(badges_data['Inbox'])}
							</View>
						)
					}
				}}
			/>

			<Tab.Screen
				name='Analytics'
				component={Analytics}
				options={{
					tabBarIcon: ({ tintColor, focused }) => {
						return (
							<View>
								<SimpleLineIcons color={focused ? secondColor : tintColor} name='chart' size={tabBarIconSize} />
								{renderBadge(badges_data['Analytics'])}
							</View>
						)
					}
				}}
			/>

		</Tab.Navigator>
	)
}

const mapStateToProps = ({
	badges: {
		badges_data
	},
}) => ({
	badges_data,
})

export default connect(mapStateToProps)(Add)