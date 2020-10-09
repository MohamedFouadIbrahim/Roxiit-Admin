export const getActiveRouteName = (navigationState) => {
	if (!navigationState) {
		return null;
	}

	const route = navigationState.routes[navigationState.index];

	// dive into nested navigators
	if (route.routes) {
		return getActiveRouteName(route);
	}

	return route.routeName;
}