import { createStore } from 'redux'
import { persistStore, persistReducer } from 'redux-persist'
import storage from '@react-native-community/async-storage';
// Middlewares
import AppReducers from './index';

const persistConfig = {
	key: 'root',
	storage,
	blacklist: [
		'locale',
		'localize',
		'network',
		'Filter',
		'inspector',
		'navigation',
	],
}

const persistedReducer = persistReducer(persistConfig, AppReducers)

export default () => {
	// let store = createStore(persistedReducer)
	let store = createStore(
    persistedReducer,
    {}, // initial state
  )
	let persistor = persistStore(store)
	return { store, persistor }
}