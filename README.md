# react-simple-tooltip
a simple simple tooltip based on react.

example

```javascript
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
```

###Usage

  this component shall use Tip, TipContent, TipShowTrigger together. You can see the structure in the example above.
  
  your code will mostly looks like this:
  
  ```javascript
    <Tip>
      <TipContent key="tipContent"> //the key props is important, you cannot remove that~
        <Your-Tip/> 
      </TipContent>
      <TipShowTrigger key="tipShowTrigger">  //the key props is important, you cannot remove that~ 
        <Your-Tip-Show-Trigger>
          this component usually means the "?" or "more" icon
        </Your-Tip-Show-Trigger>
      </TipShowTrigger>
    </Tip>  
  ```
  
  this component toggles when user hover the TipContent and TipShowTrigger.
  
  
  Please follow these tips when using this component:
  1. you should pass `degree` props from 0 to 360 to tell the `<TipContent>` about the relative poistion with the `TipShowTrigger`. 
  2. you can pass the `onMounted` props function which will be called when these component is mounted and the `<TipContent>` component offset was computed.
  3. you can get the show/hide function by pass props `getShowFunction` and `getHideFunction`, the hide/show function will be passed as callback in your function.example:
  
  your TipContent component:
  ``` javascript
  (<TipContent
            style={{width:200,height:200,border:'2px solid #000',}}
            key="tipContent"
            degree={60}
            getShowFunction={this.setFunc.bind(this,'show')}
            getHideFunction={this.setFunc.bind(this,'hide')}
          >)
          
  ```
  your outer code:
  ``` javascript
    class controller extends React.Component {
      constructor(props){
        super(props);
        this.func = {
          show : null,
          hide : null,
        }
      }
      render(){
        return (
              <Tip onMounted={this.tipMounted.bind(this)}>
                <TipContent 
                key="tipContent" //the key props is important, you cannot remove that~
                degree={60}
                getShowFunction={this.setFunc.bind(this,'show')}
                getHideFunction={this.setFunc.bind(this,'hide')}> 
                  <Your-Tip/> 
                </TipContent>
                <TipShowTrigger key="tipShowTrigger">  //the key props is important, you cannot remove that~ 
                  <Your-Tip-Show-Trigger>
                    this component usually means the "?" or "more" icon
                  </Your-Tip-Show-Trigger>
                </TipShowTrigger>
              </Tip>
        )
      }
      ...
      
      tipMounted(){
        this.func.show && this.func.show(); // show the tip when tip mounted.
      }
      setFunc(funcName, func){
        this.func[funcName] = func;
      }
    }
  ```
  
4. you can also pass a `toggle` function which receive the component `state` param and the default trigger `type`, this function shall return a value(`boolean`), which means if the developer allow the tip to do the default ation according to the `state`.  Actually, developer can make your own toggle priciple by using `getShowFunction` and `getHideFunction` to get toggle ation `hide` and `show`, then you can manually hide and show your tip according to the `state` object.example:

``` javascript
  clickToggle(state, type) {
    switch (type) {
      case 'click':
        console.log(` click : ${state.click}`);
        var isTipShowedWhenClickEven = (state.click % 2) && state.show;
        if ( isTipShowedWhenClickEven ) {
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
```

5. you can pass `style` and className to either `Tip`,`TipContent` or `TipShowTrigger` component;   
  
