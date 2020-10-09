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
import { SelectCountry, SelectCity, SelectArea } from "../../utils/Places.js";
import {
  EditWarehouseAddress,
  GetWarehouseAddress
} from "../../services/WarehousesService";
import { parsePhone } from "../../utils/Phone.js";
import { isValidMobileNumber } from "../../utils/Validation.js";
import PhoneInput from "../../components/PhoneInput/index.js";
import {
  STRING_LENGTH_LONG,
  STRING_LENGTH_MEDIUM
} from "../../constants/Config";
import { LongToast } from "../../utils/Toast.js";
class WarehouseAddress extends Component {
  constructor(props) {
    super(props);

    const { Id } = this.props.route.params
    this.warehouseId = Id;
 
    this.state = {
      lockSubmit: false,
      didFetchData: false
    };

    this.lockSubmit = false;
  }
  componentWillUnmount() {
    this.cancelFetchData && this.cancelFetchData();
    this.cancelFetchDataEditCustomerInfo &&
      this.cancelFetchDataEditCustomerInfo();
  }
  componentDidMount() {
    this.cancelFetchData = GetWarehouseAddress(this.warehouseId, res => {
      const { Phone1, Phone2, ...restData } = res.data;

      const { NumberCountry, NationalNumber } = parsePhone(String(Phone1));
      const { NumberCountryTwo, NationalNumberTwo } = parsePhone(String(Phone2));

      this.setState({
        ...restData,

        Phone: NationalNumber,
        PhoneCountry: NumberCountry,
        PhoneTwo: NationalNumberTwo,
        PhoneCountryTwo: NumberCountryTwo,

        didFetchData: true
      });
    });
  }

  submit = () => {
    if (this.lockSubmit) {
      return;
    }
    const {
      PhoneCountry,

      PhoneCountryTwo,
      Email1,
      Email2,
      Country,
      City,
      Area,

      Address1,
      Address2,

      PostCode
    } = this.state;

    let { Phone, PhoneTwo } = this.state;

    if (!Phone || !Email1 || !Country || !City || !Address1 || !Area ) {
      return LongToast("CantHaveEmptyInputs")
    }

    Phone = Phone[0] === "0" ? Phone.substr(1) : Phone;

    if (!Phone || !isValidMobileNumber(`${PhoneCountry.PhoneCode}${Phone}`)) {
      LongToast("InvalidPhone")
      return;
    }
    PhoneTwo = PhoneTwo[0] === "0" ? PhoneTwo.substr(1) : PhoneTwo;

    if (PhoneTwo.length > 0 && !isValidMobileNumber(`${PhoneCountryTwo.PhoneCode}${PhoneTwo}`)) {
      // alert(PhoneTwo)
      LongToast("InvalidPhone")
      return;
    }


    this.setState({ lockSubmit: true });
    this.lockSubmit = true;

    this.cancelFetchDataEditCustomerInfo = EditWarehouseAddress(
      {
        Id: this.warehouseId,
        Phone1: `${PhoneCountry.PhoneCode}${Phone}`,
        Phone2: PhoneTwo.length > 0 ? `${PhoneCountryTwo.PhoneCode}${PhoneTwo}` : '',
        Email1,
        Email2,
        Country: Country.Id,
        City: City ? City.Id : null,
        Area: Area ? Area.Id : null,
        // AreaText: Area ? Area.Name : "",
        Address1: Address1 ? Address1 : null,
        Address2: Address2 ? Address2 : null,
        PostCode
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
        Phone,
        PhoneCountry,
        PhoneTwo,
        PhoneCountryTwo,
        Email1,
        Email2,
        Country,
        City,
        Area,
        Address1,
        Address2,
        PostCode
      } = this.state;

      return (
        <ScrollView contentContainerStyle={{}}>
          <PhoneInput
            countryId={PhoneCountry ? PhoneCountry.Id : undefined}
            onPressFlag={() => {
              SelectCountry(this.props.navigation, item => {
                this.setState({ PhoneCountry: item });
              });
            }}
            value={Phone}
            onChangeText={text => {
              this.setState({ Phone: text });
            }}
          />

          <ItemSeparator />
          <PhoneInput
            countryId={PhoneCountryTwo ? PhoneCountryTwo.Id : undefined}
            onPressFlag={() => {
              SelectCountry(this.props.navigation, item => {
                this.setState({ PhoneCountryTwo: item });
              });
            }}
            value={PhoneTwo ? PhoneTwo : null}
            onChangeText={text => {
              this.setState({ PhoneTwo: text });
            }}
          />

          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_LONG}
            label="Email1"
            value={Email1}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({ Email1: text });
            }}
          />

          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_LONG}
            label="Email2"
            value={Email2}
            keyboardType="email-address"
            onChangeText={text => {
              this.setState({ Email2: text });
            }}
          />
          <ItemSeparator />

          <ArrowItem
            onPress={() => {
              SelectCountry(this.props.navigation, item => {
                this.setState({ Country: item, City: null });
              });
            }}
            title={"Country"}
            info={Country ? Country.Name : null}
          />

          {Country && (
            <ArrowItem
              onPress={() => {
                SelectCity(
                  this.props.navigation,
                  item => {
                    this.setState({ City: item });
                  },
                  Country.Id
                );
              }}
              title={"City"}
              info={City ? City.Name : null}
            />
          )}

          {City && (
            <ArrowItem
              onPress={() => {
                SelectArea(
                  this.props.navigation,
                  item => {
                    this.setState({ Area: item });
                  },
                  City.Id
                );
              }}
              title={"Area"}
              info={Area ? Area.Name : null}
            />
          )}
          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_MEDIUM}
            label="Address1"
            value={Address1}
            onChangeText={text => {
              this.setState({ Address1: text });
            }}
          />

          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_MEDIUM}
            label="Address2"
            value={Address2}
            onChangeText={text => {
              this.setState({ Address2: text });
            }}
          />

          <ItemSeparator />

          <HorizontalInput
            maxLength={STRING_LENGTH_MEDIUM}
            label="PostCode"
            value={PostCode}
            onChangeText={text => {
              this.setState({ PostCode: text });
            }}
          />
        </ScrollView>
      );
    }
  };

  render() {
    return (
      <LazyContainer style={{ flex: 1, backgroundColor: "#FFF" }}>
        <CustomHeader
          navigation={this.props.navigation}
          title={"Address"}
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

        {/* {this.renderContent()} */}
        {Platform.OS == 'ios' ?
          <KeyboardAvoidingView behavior='padding' enabled
            style={{ flex: 1 }}
            keyboardVerticalOffset={40}
          >
            {this.renderContent()}
          </KeyboardAvoidingView> :
          this.renderContent()
        }
      </LazyContainer>
    );
  }
}

const mapStateToProps = ({ language: { languages_data } }) => ({
  languages_data
});

export default connect(mapStateToProps)(withLocalize(WarehouseAddress));
