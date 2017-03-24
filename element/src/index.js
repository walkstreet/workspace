import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  charset: 'UTF-8',
  'html': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'body': {
    'margin': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }],
    'padding': [{ 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }, { 'unit': 'px', 'value': 0 }]
  },
  'body': {
    'color': '#333',
    'backgroundColor': '#f0f0f0',
    'fontFamily': '"Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif'
  },
  'fade-enter-active': {
    'transition': 'opacity .5s ease'
  },
  'fade-leave-active': {
    'transition': 'opacity .5s ease'
  },
  'fade-enter': {
    'opacity': '0'
  },
  'fade-leave-active': {
    'opacity': '0'
  },
  'child-view': {
    'position': 'absolute',
    'width': [{ 'unit': '%H', 'value': 1 }],
    'transition': 'all 0.5s cubic-bezier(0.55, 0, 0.1, 1)',
    'zIndex': '1'
  },
  'slide-left-enter': {
    'opacity': '0',
    'WebkitTransform': 'translate(30px, 0)',
    'transform': 'translate(30px, 0)'
  },
  'slide-right-leave-active': {
    'opacity': '0',
    'WebkitTransform': 'translate(30px, 0)',
    'transform': 'translate(30px, 0)'
  },
  'slide-left-leave-active': {
    'opacity': '0',
    'WebkitTransform': 'translate(-30px, 0)',
    'transform': 'translate(-30px, 0)'
  },
  'slide-right-enter': {
    'opacity': '0',
    'WebkitTransform': 'translate(-30px, 0)',
    'transform': 'translate(-30px, 0)'
  },
  'slide-left': {
    'opacity': '1',
    'WebkitTransform': 'translate(0, 0)',
    'transform': 'translate(0, 0)'
  },
  'slide-right': {
    'opacity': '1',
    'WebkitTransform': 'translate(0, 0)',
    'transform': 'translate(0, 0)'
  },
  'flex': {
    'display': '-ms-flexbox',
    'display': 'flex',
    'MsFlexFlow': 'row wrap',
    'flexFlow': 'row wrap'
  },
  'flex-center': {
    'MsFlexPack': 'center',
    'justifyContent': 'center',
    'MsFlexAlign': 'center',
    'alignItems': 'center'
  },
  'text-right': {
    'textAlign': 'right'
  },
  'text-left': {
    'textAlign': 'left'
  },
  'text-center': {
    'textAlign': 'center'
  },
  'breadcrumb': {
    'padding': [{ 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 10 }, { 'unit': 'px', 'value': 20 }, { 'unit': 'px', 'value': 10 }],
    'borderBottom': [{ 'unit': 'px', 'value': 1 }, { 'unit': 'string', 'value': 'solid' }, { 'unit': 'string', 'value': '#f0f0f0' }],
    'backgroundColor': '#ffffff'
  }
});
