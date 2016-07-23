// out sie common data
import React , { Component }from 'react';

export default class TipContent extends Component {

  constructor(props) {
    super(props);
    this.state = {};
    this.state.style = {
      display: 'block',
      position: 'fixed',
      // overflow: 'hidden', //fuck , 当初为什么脑子抽写了这么一破属性
      transform: 'translateY(10px)',
      opacity: 0,
      transition: 'transform ease .264s .1s, opacity ease 0.4s',
    };
    this.toggle = this.toggle.bind(this);

    this.hasComputtedOffset = false;
    this.size = {
      x: 0,
      y: 0,
    };

    this.offset = {
      x: 0,
      y: 0,
    };

    this.props.getShowFunction && this.props.getShowFunction(this.showTipContent.bind(this));
    this.props.getHideFunction && this.props.getHideFunction(this.hideTipContent.bind(this));
    //
    // rendering.push(TipId);
    //
    // onScroll(TipId,scrollFunction.bind(this));
    // // bind
    // onResize(TipId,resizeFunction.bind(this));
  }

  componentDidMount() {
    this.props.adjust(this.moveTipContent.bind(this));
    this.props.setToggleFunction(this.toggle.bind(this));
    this.measure();
    this.props.setMounted();

    // this.adjust();
    // test
  }

  componentWillReceiveProps(props) {
    if (props.degree != this.props.degree) {
      this.hasComputtedOffset = false;
    }
  }


  componentDidUpdate() {

  }

  setOffset(props = this.props) {
    this.setSize();
    var p = props.getTipTriggerPoistion();
    var c = 0;

    if (props.degree != 'auto') {
      c = props.degree * Math.PI / 180;
    }
    const SIN = Math.sin(c),
      COS = Math.cos(c),
      TAN = Math.tan(c),
      size = Object.assign({}, this.size),
      R = p.R + 8 + size.R,
      PI_2 = Math.PI / 2;

    var o = {x: SIN * R, y: -COS * R};
    var rectSIN = 0.5 * size.width / R;
    var recctCOS = 0.5 * size.height / R;
    // console.log(rectSIN);
    var whiteOffsetY = 0, whiteOffsetX = 0;
    if (rectSIN > Math.abs(SIN)) { //上方下方
      whiteOffsetY = Math.abs(COS) * R - size.height / 2 - p.height / 2 - 20;
      whiteOffsetX = whiteOffsetY * TAN;
      // console.log('上下')
    } else {
      whiteOffsetX = Math.abs(SIN) * R - size.width / 2 - p.width / 2 - 20;
      whiteOffsetY = whiteOffsetX / TAN;
      // console.log('左右');
    }
    if (SIN <= 0) {
      whiteOffsetX = 0 - whiteOffsetX;
    }
    if (COS >= 0) {
      whiteOffsetY = 0 - whiteOffsetY;
    }

    // console.log(`whiteOffsetX ${whiteOffsetX} whiteOffsetY ${whiteOffsetY}`);

    this.offset = {
      x: o.x - size.width / 2 - whiteOffsetX,
      y: o.y - size.height / 2 - whiteOffsetY,
    };
  }


  setSize() {
    var style = this.getStyle();
    var width = style.width || this.refs.parent.offsetWidth;
    var height = style.height || this.refs.parent.offsetHeight;
    var R = Math.sqrt(width * width + height * height) / 2;
    this.size = {
      width: width,
      height: height,
      R: R,
    };
    return this.size;
  }

  measure(props = this.props) {
    var c = this.refs.child;
    var width = 0, height = 0;

    if (!props.auto) {
      width = props.style.width || c.offsetWidth;
      height = props.style.height || c.offsetHeight;
    }
    else {

      var display = c._css('display');
      var visibility = c._css('hidden');
      c.style.display = 'block';
      c.style.visibility = 'hidden';
      var c_shadow = c.cloneNode(true);
      var c_shadowWrapper = document.createElement('div');
      c_shadowWrapper.style.opacity = 0;
      c_shadowWrapper.style.position = 'fixed';
      c_shadowWrapper.appendChild(c_shadow);
      document.body.appendChild(c_shadowWrapper);

      width = c_shadow.offsetWidth;
      height = c_shadow.offsetHeight;

      document.body.removeChild(c_shadowWrapper);

      c.style.display = display;
      c.style.visibility = visibility;
      //
      // document.removeChild(c_shadowWrapper);
    }




    this.setStyle({
      display: 'none',
      visibility: 'visible',
      width: width,
      height: height,
    });

  }


  toggle(flag) {
    if (flag) {
      this.showTipContent();
    } else {
      this.hideTipContent();
    }
  }

  showTipContent() {
    if (!this.hasComputtedOffset) {
      this.setOffset();
      this.hasComputtedOffset = true;
    }
    this.props.setShow(true);

    var position = this.props.getTipTriggerPoistion();
    this.moveTipContent();
    setTimeout(()=> {
      this.setStyle({
        opacity: 1,
        transform: 'translateY(0)',
      });
    }, 10);
  }


  moveTipContent() {
    var position = this.props.getTipTriggerPoistion();
    const {center} = position;
    var size = this.size;
    var newPostion = {x: center.x, y: center.y};

    var _final = {
      display: 'block',
      left: newPostion.x + this.offset.x,
      top: newPostion.y + this.offset.y,
    };

    this.setStyle(_final);
  }


  hideTipContent() {
    this.setStyle({
      opacity: 0,
      transform: 'translateY(-10px)',
    })
    this.props.setShow(false);
    setTimeout(()=> {
      this.setStyle({
        display: 'none',
      })
    }, 300)
  }


  getStyle() {
    return Object.assign({}, this.props.style, this.state.style);
  }

  setStyle(style) {
    var newStyle = Object.assign({}, this.props.style, this.state.style, style);
    this.setState({style: newStyle});
  }

  adjust() {
    const RATIO = 0.618;
    if (this.props.auto == true) {
      var rect = this.refs.child._css('width') * this.refs.child._css('height');
      var height = Math.sqrt(rect / RATIO), width = height / RATIO;
      this.setStyle({maxWidth: width, maxHeight: height});
    } else {
      // leave her alone!! yoyoyo
    }
  }

  render() {
    return (
      <div
        ref="parent"
        onMouseEnter={this.setHover.bind(this,true)}
        onMouseLeave={this.setHover.bind(this,false)}
        className={this.props.className || ""}
        style={this.getStyle()}>
        { React.cloneElement(this.props.children, {ref: 'child'}) }
      </div>
    )
  }

  setHover(flag) {
    if (flag) {
      this.props.setTipContentHover(flag);
    } else {
      setTimeout(()=> {
        this.props.setTipContentHover(flag);
      }, 500);
    }

  }
}
