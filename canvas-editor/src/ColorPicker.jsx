// src/ColorPicker.js
import React from 'react';
import { SketchPicker } from 'react-color';

const ColorPicker = ({ color, onChange }) => {
  return (
    <SketchPicker color={color} onChangeComplete={onChange} />
  );
}

export default ColorPicker;
