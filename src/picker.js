import React, { Component } from "react";
import {
  ColorPropType,
  Platform,
  StyleSheet,
  View,
  ViewPropTypes as RNViewPropTypes,
  Text
} from "react-native";
import PropTypes from "prop-types";
import WheelCurvedPicker from "./WheelCurvedPicker";

const isIos = Platform.OS === "ios";

const ViewPropTypes = RNViewPropTypes || View.propTypes;

const PickerItem = WheelCurvedPicker.Item;

const styles = StyleSheet.create({
  picker: {
    backgroundColor: "#d3d3d3",
    height: 220
  }
});

export default class Picker extends Component {
  static propTypes = {
    textColor: ColorPropType,
    textSize: PropTypes.number,
    itemSpace: PropTypes.number,
    itemStyle: ViewPropTypes.style,
    onValueChange: PropTypes.func.isRequired,
    pickerData: PropTypes.array.isRequired,
    style: ViewPropTypes.style,
    selectedValue: PropTypes.any
  };

  static defaultProps = {
    textColor: "#333",
    textSize: 26,
    itemSpace: 20,
    itemStyle: null,
    style: null
  };

  state = {
    selectedValue: this.props.selectedValue
  };

  _allowUpdate = true;

  componentWillReceiveProps = nextProps => {
    if (
      !isIos &&
      !!nextProps.selectedValue &&
      nextProps.selectedValue !== this.props.selectedValue
    ) {
      this._allowUpdate = false;
      this._timer = setTimeout(() => (this._allowUpdate = true), 200);
      this.setState({ selectedValue: nextProps.selectedValue });
    }
  };

  componentWillUnmount = () => {
    clearTimeout(this._timeout);
    this._timeout = 0;
  };

  handleChange = selectedValue => {
    if (this._allowUpdate) {
      this.setState({ selectedValue });
      this.props.onValueChange(selectedValue);
    }
  };

  render() {
    const { pickerData, style, ...props } = this.props;

    return (
      <WheelCurvedPicker
        {...props}
        style={[styles.picker, style]}
        selectedValue={
          isIos ? this.props.selectedValue : this.state.selectedValue
        }
        onValueChange={this.handleChange}
      >
        {pickerData.map((data, index) => (
          <PickerItem
            key={index}
            value={typeof data.value !== "undefined" ? data.value : data}
            label={
              typeof data.label !== "undefined" ? data.label : data.toString()
            }
          />
        ))}
      </WheelCurvedPicker>
    );
  }

  getValue() {
    return this.state.selectedValue;
  }
}
