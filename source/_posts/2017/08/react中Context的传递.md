---
title: react中Context的传递
comments: true
date: 2017-08-22 00:58:52
tags:
categories:
---
ccontext的传递方向是由定义了根数据源的组件向子组件传递，父级

+ 通过getChildContext（Class）在context上定义要传递给子级的数据
+ 通过组件（Class）的childContextTypes定义传递给子级数据的数据类型

上上级组件传递的context数据可以被上级组件同key的context数据所替换，比如：
```javascript
// App
import React from "react";
import PropTypes from "prop-types";
import Parent from "./Parent";
import Child from "./Child";

class App extends React.Component {
  getChildContext() {
    return {
      from: "this is from App"
    };
  }

  render() {
    console.log("App_Context-->", this.context);
    return (
      <div className="container">
        <Parent>
          <Child />
        </Parent>
      </div>
    );
  }
}

App.childContextTypes = {
  from: PropTypes.string
};

App.contextTypes = {
  from: PropTypes.string,
};

export default App


```

<!-- more -->

```javascript
// Parent
import React from "react";
import PropTypes from "prop-types";

class Parent extends React.Component {
  getChildContext() {
    return {
      from: "this is from Parent",
    };
  }
  render() {
    console.log("Parent_Context-->", this.context);    
    return (
      <div className="parent">
        this is parent
        <hr />
        {this.props.children}
      </div>
    );
  }
}

Parent.childContextTypes = {
  from: PropTypes.string,
};

Parent.contextTypes = {
  from: PropTypes.string,
};

export default Parent;

```
```javascript
// Child
import React from "react";
import PropTypes from "prop-types";

class Child extends React.Component {
  render() {
    console.log("Child_Context-->", this.context);    
    return <div className="children">this is children</div>;
  }
}

Child.contextTypes = {
  from: PropTypes.string,
};

export default Child;

```

>输出：

![IMAGE](FEE0A2D90674336598067AB2FBC4B836.jpg)


如果要将Child组件的父级组件直接挂载在Dom上，Child组件是拿不到App或者Parent组件传递过来的context，比如将上述的Parent.js改写为：
```javascript
// Parent
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class Parent extends React.Component {
  getChildContext() {
    return {
      from: "this is from Parent"
    };
  }

  componentDidMount() {
    var div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(
      <div className="parent">
        this is parent
        <hr />
        {this.props.children}
      </div>,
      div
    );
  }
  render() {
    console.log("Parent_Context-->", this.context);
    return null;
  }
}

Parent.childContextTypes = {
  from: PropTypes.string
};

Parent.contextTypes = {
  from: PropTypes.string
};

export default Parent;

```

>输出：

![IMAGE](D8D4D1B9E864D394E7A385BC0519FC5F.jpg)

此时在Child组件中就获取不到父级传递下来的context，组件的构成如下：
![IMAGE](DD5DB2169E1E226970E770FEB9AE466D.jpg)

>如图可知App中申明的context，只能在其子组件中被访问，而Parent组件中通过ReactDom.render的方式挂载到body上，此时挂载的组件已经不再是App的子组件了，所以也就不能访问到App的context了

虽然无法直接获取App中的context，但render中返回null的Parent组件，可以访问App的context，所以可以借助Parent组件，将其作为一个中间件，比如：
```javascript
// Parent
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";

class Parent extends React.Component {
  componentDidMount() {
    var div = document.createElement("div");
    document.body.appendChild(div);
    ReactDOM.render(
      <div className="parent">
        this is parent
        <hr />
        <MiddleWare context={this.context}>{this.props.children}</MiddleWare>
      </div>,
      div
    );
  }
  render() {
    console.log("Parent_Context-->", this.context);
    return null;
  }
}

Parent.contextTypes = {
  from: PropTypes.string
};

export default Parent;

class MiddleWare extends React.Component {
  getChildContext() {
    return {
      from: this.props.context.from,
      desc: "deal with middleware"
    };
  }
  render() {
    return this.props.children;
  }
}

MiddleWare.childContextTypes = {
  from: PropTypes.string,
  desc: PropTypes.string
};

```

>输出：

![IMAGE](4B8E52CB8953B9379356DBEB6635B0F1.jpg)