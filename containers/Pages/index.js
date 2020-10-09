import React, { Component } from "react";
import {
  ScrollView,
  View,
} from "react-native";
import CustomHeader from "../../components/CustomHeader/index.js";
import LazyContainer from "../../components/LazyContainer";
import { withLocalize } from "react-localize-redux";
import SettingsTitle from "../../components/Settings/SettingsTitle.js";
import ArrowItem from "../../components/ArrowItem/index.js";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import RemoteDataContainer from "../../components/RemoteDataContainer/index.js";
import PagesItem from "./PagesItem.js";
import CustomTouchable from '../../components/CustomTouchable';

class Pages extends Component {
  constructor(props) {
    super(props);
    this.state = {
      didFetchData: false
    };
  }

  componentWillUnmount() {
    this.cancelFetchData && this.cancelFetchData();
  }

  renderItem = ({ item }) => {
    return (
      <PagesItem
        item={item}
        onPress={this.onPressItem}
        onLongPress={this.onLongPressItem}
      />
    );
  };




  renderItemOne = ({ index, item }) => {
    // const { item, onPress, onLongPress, ...restProps } = this.props;
    const { Section, Pages } = item;
    let pageObjName = Pages.map(obj => obj.Name);
    let pageObjId = Pages.map(obj => obj.Id)
    return (

      <ScrollView >
        <SettingsTitle title={Section.Name} />
        {pageObjName.map((Name, i) => (
          <View key={i} >
            <ArrowItem
              onPress={() => {
                this.props.navigation.navigate("PageSetting", {
                  Id: Pages[i].Id,
                  onChildChange: this.onChildChange,
                  Name: Pages[i].Name
                });
              }}
              title={Name}
            />
          </View>
        ))}
      </ScrollView>

    );
  }




  render() {
    const { Sections } = this.state;

    return (
      <LazyContainer style={{ flex: 1, backgroundColor: "#F4F6F9" }}>
        <CustomHeader
          leftComponent="drawer"
          navigation={this.props.navigation}
          title={"Pages"}
        />

        <RemoteDataContainer
          url={"Page/Pages"}
          cacheName={"Pages"}
          onDataFetched={data => {
            this.setState({ data });
          }}
          updatedData={this.state.data}
          triggerRefresh={this.state.triggerRefresh}
          ItemSeparatorComponent={() => <ItemSeparator />}
          renderItem={this.renderItemOne}
          keyExtractor={(item, index) => `${index.toString()}`}
        />

      </LazyContainer>
    );
  }
}

export default withLocalize(Pages);
