import Tip, {TipContent, TipShowTrigger} from './index';
import React from 'react';
import ReactDOM from 'react-dom';

class TipTest extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      degree: 0
    };
    this.funcs = {};
  }

  componentDidMount() {
    this.changeDegree();
    // this.funcs.show && this.funcs.show();
  }

  render() {
    return (
      <div>
        <Tip degree={50}>
          <TipContent
            style={{width:600,height:300,border:'2px solid #000',}}
            key="tipContent"
            degree={this.state.degree}
          >
            <div>
                <span>
                  参数
                  array (Array): The array to inspect.
                  [isSorted] (boolean): Specify the array is sorted.
                  [iteratee] (Function|Object|string): The function invoked per iteration.
                  [thisArg] (*): The this binding of iteratee.
                </span>
              <img src="https://www.google.com.vn/images/nav_logo242_hr.png"/>
            </div>
          </TipContent>
          <TipShowTrigger key="TipShowTrigger"
                          style={{borderRadius:20, backgroundColor:'#ddd', overflow:'hidden', width:25, height:25,lineHeight:'25px',textAlign:'center',fontSize: 14,cursor:'pointer',marginLeft:550,marginTop:400}}>
            <span>?</span>
          </TipShowTrigger>
        </Tip>

        <Tip toggle={this.clickToggle.bind(this)} onMounted={this.showTip.bind(this)}>
          <TipContent
            style={{width:200,height:200,border:'2px solid #000',}}
            key="tipContent"
            degree={60}
            getShowFunction={this.setFunc.bind(this,'show')}
            getHideFunction={this.setFunc.bind(this,'hide')}
          >
            <div>
                <span>
                  参数
                  array (Array): The array to inspect.
                  [isSorted] (boolean): Specify the array is sorted.
                  [iteratee] (Function|Object|string): The function invoked per iteration.
                  [thisArg] (*): The this binding of iteratee.
                </span>
              <button onClick={this.hideTip.bind(this)}>hide</button>
            </div>
          </TipContent>
          <TipShowTrigger key="TipShowTrigger"
                          style={{borderRadius:20, backgroundColor:'#ddd', overflow:'hidden', width:25, height:25,lineHeight:'25px',textAlign:'center',fontSize: 14,cursor:'pointer',marginLeft:100,top:100}}>
            <span>?</span>
          </TipShowTrigger>
        </Tip>


        <Tip style={{float:'right'}}>
          <TipContent key="tipContent" auto={true} degree={180}>
            <div style={{float:'left'}}>
                <span>
                  参数
                  array (Array): The array to inspect.
                  [isSorted] (boolean): Specify the array is sorted.
                  [iteratee] (Function|Object|string): The function invoked per iteration.
                  [thisArg] (*): The this binding of iteratee.
                </span>
              <img src="https://www.google.com.vn/images/nav_logo242_hr.png"/>
            </div>
          </TipContent>
          <TipShowTrigger key="TipShowTrigger"
                          style={{borderRadius:20, backgroundColor:'#ddd', overflow:'hidden', width:25, height:25,lineHeight:'25px',textAlign:'center',fontSize: 14,cursor:'pointer'}}>
            <span>?</span>
          </TipShowTrigger>
        </Tip>
      </div>
    );
  }

  clickToggle(state, type) {
    switch (type) {
      case 'click':
        console.log(` click : ${state.click}`);
        if (state.click % 2 == 1) {
          this.showTip();
        } else {
          this.hideTip();
        }
        return false;
        break;
      case 'hover':
        return false;
    }


  }

  changeDegree() {
    // setInterval(()=>{
    //   // this.setState({degree:this.state.degree+30});
    //   console.log(this.state.degree);
    // },3000)
  }

  showTip() {
    console.log('showTip');
    this.funcs.show && this.funcs.show();
  }

  hideTip() {
    this.funcs.hide && this.funcs.hide();
  }

  setFunc(funcName, func) {
    this.funcs[funcName] = func;
  }

}

ReactDOM.render(<TipTest/>,document.getElementById('root'));