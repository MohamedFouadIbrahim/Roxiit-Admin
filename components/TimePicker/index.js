import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import TimePicker from "react-native-24h-timepicker";
import CustomTouchable from '../CustomTouchable';

class TimePickers extends Component {
  constructor() {
    super();
    // this.state = {
    //   time: ""
    // };
  }
 
  onCancel() {
    this.TimePicker.close();
  }
 
  onConfirm(hour, minute) {
    this.setState({ time: `${hour}:${minute}` });
    this.TimePicker.close();
  }
 
  render() {
  
    return (
      <View style={styles.container}>
     
        <CustomTouchable
          onPress={() => this.TimePicker.open()}
          style={styles.button}
        >
          <Text style={styles.buttonText}>{this.props.fromAndTo}</Text>
        </CustomTouchable>
        <Text style={styles.text}>{this.props.timeTo || this.props.timeFrom}</Text>
        <TimePicker
          ref={ref => {
            this.TimePicker = ref;
          }}
          onCancel={() => this.onCancel()}
        
        
          onConfirm={this.props.onConfirming}
        />
      </View>
    );
  }
}
 
const styles = StyleSheet.create({
  container: {
   flex: 1,
    alignItems: "center",
    backgroundColor: "#fff",
    flexDirection : 'row',

    justifyContent: 'space-evenly',
 //   paddingTop: -100,
    paddingRight:190
  },
  text: {
    fontSize: 20,
  //  marginTop: 10
  },
  button: {
    backgroundColor: "#6495ED",
    //paddingVertical: 11,
   // paddingHorizontal: 17,
    borderRadius: 3,
    marginVertical: 50
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600"
  }
});
 
export default TimePickers;