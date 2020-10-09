import configureStore from './redux/configureStore';

const { persistor, store } = configureStore();
export { store };
export { persistor }