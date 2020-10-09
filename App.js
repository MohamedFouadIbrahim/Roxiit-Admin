import 'react-native-gesture-handler';
import React from 'react';
import { LocalizeProvider } from 'react-localize-redux';
import { setJSExceptionHandler, setNativeExceptionHandler } from "react-native-exception-handler";
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/es/integration/react';
import AppContainer from './AppContainer';
import { persistor, store } from './Store.js'
import { ReportJSException, ReportNativeException } from './services/ExceptionService';
// Export the store, so we can use it outside React components (where we can't connect)
// I don't know if there's a better way to achieve that..
// April 10, 2019: I think there's now with React hooks, have to check that out...
const onBeforeLift = () => {
	// Take some action before the gate lifts
}



setJSExceptionHandler((e, isFatal) => {
	ReportJSException(e.name, e.message, isFatal)
});

setNativeExceptionHandler(errorString => {
	ReportNativeException(errorString)
});


class App extends React.Component {

	render() {
		return (
			<Provider store={store}>
				<PersistGate
					loading={null}
					onBeforeLift={onBeforeLift}
					persistor={persistor}>
					<LocalizeProvider store={store}>
						<AppContainer store={store} />
					</LocalizeProvider>
				</PersistGate>
			</Provider>
		)
	}

}

export default App