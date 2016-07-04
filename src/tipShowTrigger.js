import React from 'react';
export default class TipShowTrigger extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div
        className={this.props.className || ""}
        onMouseEnter={this.setHover.bind(this,true)}
        onMouseLeave={this.setHover.bind(this,false)}
        onClick={this.props.setClick}
        style={this.getStyle()}
      >
        {React.cloneElement(this.props.children, {ref: 'icon'})}
      </div>
    )
  }

  getStyle() {
    return Object.assign({}, {zIndex: 1000}, this.props.style);
  }

  componentDidMount() {
    this.props.getTipTriggerPoistion(this.getTipPositionAndSize.bind(this));
    this.props.setMounted();
  }

  setHover(flag) {
    if (flag) {
      this.props.setTipTriggerHover(flag);
    } else {
      setTimeout(()=> {
        this.props.setTipTriggerHover(flag);
      }, 240);
    }
  }

  getTipPositionAndSize() {
    var rect = this.refs.icon.getBoundingClientRect();
    var res = {
      top: rect.top,
      left: rect.left,
      width: this.refs.icon.offsetWidth,
      height: this.refs.icon.offsetHeight,
    };

    //中心位置坐标
    res.center = {
      x: res.left + res.width / 2,
      y: res.top + res.height / 2,
    };
    //同心圆半径
    res.R = Math.sqrt(res.width * res.width + res.height * res.height) / 2;
    return res;
  }
}
