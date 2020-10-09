import React, { Component } from "react";
import { ScrollView, KeyboardAvoidingView, Platform } from "react-native";
import { connect } from "react-redux";
import CustomHeader from "../../components/CustomHeader/index.js";
import LazyContainer from "../../components/LazyContainer";
import ItemSeparator from "../../components/ItemSeparator/index.js";
import HorizontalInput from "../../components/HorizontalInput/index.js";
import { withLocalize } from "react-localize-redux";
import HeaderSubmitButton from "../../components/HeaderSubmitButton/index.js";
import ArrowItem from "../../components/ArrowItem/index.js";

import {
  GetWarehouseBasicInfo,
  EditWarehouseBasicInfo
} from "../../services/WarehousesService";
import { SelectCountry, SelectCity } from "../../utils/Places.js";
import { STRING_LENGTH_LONG } from "../../constants/Config";
import { LongToast } from "../../utils/Toast.js";
class WarehouseBasicInfo extends Component {
  constructor(props) {
    super(props);

    const { Id } = this.props.route.params
    this.warehouseId = Id;

    this.state = {
      lockSubmit: false,
      didFetchData: false,
      isDateTimePickerVisible: false
    };

    this.lockSubmit = false;

    this.languageSelectorRef = React.createRef();
  }
  componentWillUnmount() {
    this.cancelFetchData && this.cancelFetchData();
    this.cancelFetchDataEditCustomerInfo &&
      this.cancelFetchDataEditCustomerInfo();
  }
  componentDidMount() {
    this.cancelFetchData = GetWarehouseBasicInfo(this.warehouseId, res => {
      this.setState({
        ...res.data,
        didFetchData: true
      });
    });
  }

  showDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: true });
  };

  hideDateTimePicker = () => {
    this.setState({ isDateTimePickerVisible: false });
  };

  submit = () => {
    if (this.lockSubmit) {
      return;
    }

    const { Name, Description, FilteredCountries, FilteredCities } = this.state;

    if (!Name || !Description) {
      return LongToast("CantHaveEmptyInputs")
    }

    this.setState({ lockSubmit: true });
    this.lockSubmit = true;

    this.cancelFetchDataEditCustomerInfo = EditWarehouseBasicInfo(
      {
        Id: this.warehouseId,
        Name,
        Description,
        FilteredCountries: FilteredCountries.map(item => item.Id),
        FilteredCities: FilteredCities.map(item => item.Id),
      },
      res => {
        this.setState({ didSucceed: true });
        this.props.route.params?.onChildChange &&
          this.props.route.params?.onChildChange();
        this.props.navigation.goBack();
      },
      err => {
        this.setState({ lockSubmit: false });
        this.lockSubmit = false;
      }
    );
  };

  renderContent = () => {
    if (this.state.didFetchData) {
      const {
        Name,
        Description,
        FilteredCities = [],
        FilteredCountries = []
      } = this.state;

      return (
        <ScrollView contentContainerStyle={{}}>
          <HorizontalInput
            maxLength={STRING_LENGTH_LONG}
            label="Name"
            value={Name}
            onChangeText={text => {
              this.setState({ Name: text });
            }}
          />

          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_LONG}
            label="Description"
            value={Description}
            onChangeText={text => {
              this.setState({ Description: text });
            }}
          />

          <ArrowItem
            onPress={() => {
              SelectCountry(this.props.navigation, item => {
                this.setState({ FilteredCountries: item, FilteredCities: [] });
              }, true, FilteredCountries);
            }}
            title={'Countries'}
            info={FilteredCountries && FilteredCountries.length >= 0 ? FilteredCountries.length : null}
          />

          <ItemSeparator />

          {FilteredCountries && FilteredCountries.length > 0 && (
            <ArrowItem
              onPress={() => {
                SelectCity(
                  this.props.navigation,
                  item => {
                    this.setState({ FilteredCities: item });
                  }, FilteredCountries.map(item => item.Id), true, FilteredCities, true
                );
              }}
              title={"Cities"}
              info={FilteredCities && FilteredCities.length >= 0 ? FilteredCities.length : null}
            />
          )}
        </ScrollView>
      );
    }
  };

  render() {
    return (
      <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
        <CustomHeader
          navigation={this.props.navigation}
          title={"BasicInfo"}
          rightComponent={
            <HeaderSubmitButton
              isLoading={this.state.lockSubmit}
              didSucceed={this.state.didSucceed}
              onPress={() => {
                this.submit();
              }}
            />
          }
        />
        {/* {
          Platform.OS == 'ios' ?

            <KeyboardAvoidingView behavior='padding' enabled
              style={{ flex: 1 }}
              keyboardVerticalOffset={40}
            >
              {this.renderContent()}
            </KeyboardAvoidingView> :

            this.renderContent()

        } */}

        {this.renderContent()}
      </LazyContainer>
    );
  }
}

const mapStateToProps = ({ language: { languages_data } }) => ({
  languages_data
});

export default connect(mapStateToProps)(withLocalize(WarehouseBasicInfo));
