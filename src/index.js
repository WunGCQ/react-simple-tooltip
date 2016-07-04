Node.prototype._css = function (attr, value) {
  if (value != null && typeof value != "undefined") {
    if (typeof value != "")
      this.style[attr] = value;

    return this;//返回本对象，方便链式调用~
  }
  else {
    if (this.style[attr]) {
      //若样式存在于html中,优先获取
      return this.style[attr];
    }
    else if (document.defaultView && document.defaultView.getComputedStyle) {
      //W3C标准方法获取CSS属性最终样式(同于CSS优先级)
      //注意,此法属性原格式(text-align)获取的,故要转换一下
      attr = attr.replace(/([A-Z])/g, '-$1').toLowerCase();
      //获取样式对象并获取属性值
      return document.defaultView.getComputedStyle(this, null).getPropertyValue(attr);
    } else if (this.currentStyle) {
      //IE下获取CSS属性最终样式(同于CSS优先级)
      return this.currentStyle.getpropertyValue(attr);
    } else {
      return null;
    }
  }
};

export TipContent from './tip';
export TipShowTrigger from './tipShowTrigger';

//to check if the tip trigger is visible
const visibleY = function (el) {
  var rect = el.getBoundingClientRect(), top = rect.top, height = rect.height,
    el = el.parentNode;
  do {
    rect = el.getBoundingClientRect();
    if (top <= rect.bottom === false) return false;
    // Check if the element is out of view due to a container scrolling
    if ((top + height) <= rect.top) return false;
    el = el.parentNode;
  } while (el != document.body);
  // Check its within the document viewport
  return top <= document.documentElement.clientHeight && top >= 0;
};

const getScrollParent = function (el) {
  var res = [];
  var node = el;

  while (node != document.childNodes[0]) {
    //  console.log(`${node.parentNode.scrollHeight} ?? ${node.parentNode.offsetHeight}`);
    if (node.parentNode.scrollHeight != node.parentNode.offsetHeight) {
      res.push(node.parentNode);
    }
    node = node.parentNode;
  }
  return res;
};



export default class Tip extends React.Component {
  constructor(props) {
    var degree = 0;
    React.Children.forEach(props.children, (child)=> {
      if (child.key == 'tipContent') {
        degree = child.props.degree || props.degree || 0;
      }
    });
    // props.degree = degree;
    super(props);
    this.parentScrollViews = [];

    //子组件方法
    this.adjustTipPosition = null;
    this.triggerFuntion = null;
    this.getTipTriggerPoistionFunction = null;
    this.toggleFunction = null;
    this.asyncGetTriggerPosition = null;

    this.state = {
      tipStyle: {
        top: 0,
        left: 0,
        show: false,
      },
      mounted: {
        tip: false,
        trigger: false,
      },
      degree: degree,
      show: false,
      tipContentHover: false,
      tipTriggerHover: false,
      click: 0,
    }
  }

  componentDidMount() {
    this.bindWindowResize();
    this.parentScrollViews = getScrollParent(this.refs.tipContainer);
    this.bindParentNodeScroll();
  }


  componentWillUnmount() {
    this.parentScrollViews[i].removeEventListener('scroll', this.checkTipVisible.bind(this));
    window.removeEventListener('resize', this.onResize.bind(this));
  }

  checkTipVisible() {
    console.log(visibleY(this.refs.tipContainer));
  }

  bindWindowResize() {
    window.addEventListener('resize', this.onResize.bind(this));
  }

  bindParentNodeScroll() {
    for (var i = 0; i < this.parentScrollViews.length; ++i) {
      this.parentScrollViews[i].addEventListener('scroll', ()=> {
        this.onResize();
      });
    }
    window.addEventListener('scroll', ()=> {
      this.onResize();
    });
  }


  adjust(func) {
    this.adjustTipPosition = func;
  }

  trigger(func) {
    this.triggerFuntion = func;
  }

  getTipTriggerPoistion(func) {
    this.getTipTriggerPoistionFunction = func;
  }

  tipTriggerPosition() {
    return this.getTipTriggerPoistionFunction();
  }

  setPosition() {

  }


  setOnContentMount(func) {
    this.onContentMountFunction = func;
  }

  onContentMount() {
    this.onTriggerMount
  }

  setOnTriggerMount(func) {
    this.onTriggerMountFunction = func;
  }

  onTriggerMount() {
    this.onTriggerMountFunction && this.onTriggerMountFunction();
  }

  setMounted(name) {
    this.state.mounted[name] = true;
    if (this.state.mounted.tip && this.state.mounted.trigger) {
      this.props.onMounted && this.props.onMounted();
    }
  }


  onResize() {
    // this.adjustTipPosition && this.adjustTipPosition();
    if (this.state.show) {
      this.adjustTipPosition();
    }
  }

  setClick() {
    this.state.click++;
    this.setToggle({click: this.state.click}, 'click');
  }

  setTipContentHover(flag) {
    this.setToggle({tipContentHover: flag}, 'hover');
  }

  setTipTriggerHover(flag) {
    this.setToggle({tipTriggerHover: flag}, 'hover');
  }


  setToggleFunction(func) {
    this.toggleFunction = func;
  }

  setToggle(arg, type) {
    var nowState = Object.assign({}, this.state, arg);
    this.setState(nowState);

    var res = (nowState.tipTriggerHover || nowState.tipContentHover);
    var userAllow = true;

    if (this.props.toggle) {
      userAllow = this.props.toggle(nowState, type);
    }
    console.log(userAllow);
    if (userAllow) {
      this.setState(Object.assign(nowState, {show: res}));
      this.toggleFunction && this.toggleFunction(res, nowState);
    }
  }

  setShow(ifShow) {
    this.setState({show: ifShow});
  }


  getChildren() {
    return React.Children.map(this.props.children,
      (child) => {
        if (child.key == 'tipContent') {

          return React.cloneElement(child, {
            adjust: this.adjust.bind(this),
            tipStyle: this.state.tipStyle,
            degree: child.props.degree || 'auto',
            setMounted: this.setMounted.bind(this, 'tip'),
            setTipContentHover: this.setTipContentHover.bind(this),
            setToggleFunction: this.setToggleFunction.bind(this),
            getTipTriggerPoistion: this.tipTriggerPosition.bind(this),
            setShow: this.setShow.bind(this),
          });
        } else {
          return React.cloneElement(child, {
            trigger: this.trigger.bind(this),
            setClick: this.setClick.bind(this),
            setMounted: this.setMounted.bind(this, 'trigger'),
            getTipTriggerPoistion: this.getTipTriggerPoistion.bind(this),
            setTipTriggerHover: this.setTipTriggerHover.bind(this),
            setShow: this.setShow.bind(this),
          });
        }
      });
  }

  render() {
    return (
      <div
        className={this.props.className || ""}
        style={this.props.style || {} }
        ref="tipContainer">
        {this.getChildren()}
      </div>
    )
  }
}
