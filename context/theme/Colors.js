const commonColor = {
  commonWhite: '#FFFFFF',
  commonBlack: '#000000',
  activeColor: '#DE5E69',
  deactiveColor: '#DE5E6950',
  boxActiveColor: '#DE5E6940',
};

const light = {
  themeColor: '#FFFFFF',
  white: '#000000',
  sky: '#DE5E69',
  gray: 'gray',
  textColor: '#000000',
  backgroundColor: '#FFFFFF',
  ...commonColor,
};

const dark = {
  themeColor: '#000000',
  white: '#FFFFFF',
  sky: '#831a23',
  gray: 'white',
  textColor: '#FFFFFF',
  backgroundColor: '#000000',
  ...commonColor,
};

export default {light, dark};
