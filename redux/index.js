import { combineReducers } from 'redux';

import { localizeReducer } from 'react-localize-redux';
import { reducer as LoginRedux } from './LoginRedux';
import { reducer as LangRedux } from './LangRedux';
import { reducer as WalkthroughRedux } from './WalkthroughRedux';
import { reducer as BadgesRedux } from './BadgesRedux';
import { reducer as NetworkRedux } from './NetworkRedux';
import { reducer as CacheRedux } from './CacheRedux';
import { reducer as PlacesRedux } from './PlacesRedux';
import { reducer as InspectorRedux } from './InspectorRedux';
import { reducer as ServerRedux } from './ServerRedux';
import { reducer as TopicsRedux } from './TopicsRedux';
import { reducer as NavigationRedux } from './NavigationRedux';
import { reducer as MiscRedux } from './MiscRedux';
import { reducer as RuntimeConfigRedux } from './RuntimeConfigRedux';
import { reducer as UserRedux } from './UserRedux';
import { reducer as CartRedux } from './CartRedux';

const AppReducers = combineReducers({
	login: LoginRedux, 
	language: LangRedux,
	localize: localizeReducer,
	walkthrough: WalkthroughRedux,
	badges: BadgesRedux,
	network: NetworkRedux,
	server: ServerRedux,
	cache: CacheRedux,
	places: PlacesRedux,
	inspector: InspectorRedux,
	topics: TopicsRedux,
	navigation: NavigationRedux,
	misc: MiscRedux,
	runtime_config: RuntimeConfigRedux,
	user: UserRedux,
	cart: CartRedux,
});

export default AppReducers;