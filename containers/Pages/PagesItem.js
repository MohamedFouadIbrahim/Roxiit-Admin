import React, { PureComponent } from "react";
import { ScrollView } from "react-native";
import SettingsTitle from "../../components/Settings/SettingsTitle.js";
import ArrowItem from "../../components/ArrowItem/index.js";
import CustomTouchable from '../../components/CustomTouchable';

export default class PagesItem extends PureComponent {

  onChildChange = () => {
    this.props.route.params?.onChildChange && this.props.route.params?.onChildChange()
    this.fetchData()
  }

  render() {
    const { item, onPress, onLongPress, ...restProps } = this.props;
    const { Section, Pages } = item;
    let pageObjName = Pages.map(obj => obj.Name);
    let pageObjId = Pages.map(obj => obj.Id)

    return (
      <CustomTouchable
        // onPress={() => { onPress(item) }}
        // onLongPress={() => { onLongPress(item) }}
        {...restProps}
      >
        <ScrollView contentContainerStyle={{}}>
          <SettingsTitle title={Section.Name} />
          {pageObjName.map(Name => (
            <ArrowItem
              onPress={() => {

                this.props.navigation.navigate("SigninVerfiy", {
                  Id: pageObjId,
                  onChildChange: this.onChildChange
                });
              }}
              title={Name}
            // key={Name}
            />
          ))}
        </ScrollView>
      </CustomTouchable>
    );
  }
}
