---
title: mvc与mvp与mvvm
date: 2019-02-12 13:58:44
tags:
---

# MVC
```javascript
// view
function View(controller) {
  var target = $('#some-element')[0]
  this.render = function (model) {
    target.innerText = model.getValue()
  }
  target.addEventListener('click', controller.click)
}
// model
function Model() {
  var _value = 0
  var registerViews = []
  this.register = function (viewInstance) {
    registerViews.push(viewInstance)
  }
  this.notify = function () {
    var self = this
    registerViews.forEach(function (viewInstance) {
      viewInstance.render(self)
    })
  }
  this.add = function () {
    _value += 1
  }
  this.getValue = function () {
    return _value
  }
}
// controller
function Controller() {
  var model, view
  this.init = function () {
    model = new Model()
    view = new View(this)
    model.register(view)
    model.notify()
    setTimeout(function () {
      view.render({ getValue: function () { return 1000 } })
    }, 1000)
  }
  this.click = function () {
    model.add()
    model.notify()
  }
}
// 调用
var controller = new Controller()
controller.init()
```

**总结**
1. mvc模式中model层可以直接通知view层重新渲染视图
2. 仅由controller层发起model层的修改
3. 代码的执行入口是controller
4. controller内部维护着model层和view层之间的关系——同步视图和数据
5. controller可以通过model层使view层重新渲染，也可以直接使view层重新渲染

<!-- more -->

# MVP
```javascript
// view
function View() {
  var target = $("#some-element")[0];
  this.init = function() {
    const presenter = new Presenter(this);
    target.addEventListener("click", presenter.click);
  };
  this.render = function(model) {
    target.innerText = model.getValue();
  };
}
// model
function Model() {
  var _value = 0;
  this.add = function() {
    _value += 1;
  };
  this.getValue = function() {
    return _value;
  };
}
// presenter
function Presenter(view) {
  var model = new Model();
  view.render(model);

  this.click = function() {
    model.add();
    view.render(model);
  };
  setTimeout(function() {
    view.render({
      getValue: function() {
        return 1000;
      }
    });
  }, 1000);
}
// 调用
var view = new View();
view.init();

```

**总结**
1. MVP模式中model层很纯粹，仅修改和存储数据，在内部不与view层有牵连
2. 仅由presenter层发起view层的重新渲染
3. 仅由presenter层发起model层的修改
4. 代码的执行入口是view
5. presenter内部维护着model层和view层之间的关系——同步视图和数据


# MVVM

```javascript

// view
function View(vm) {
  var target = $('#some-element')[0]
  this.render = function (model) {
    target.innerText = model.getValue()
  }
  target.addEventListener('input', vm.input)
}
// model
function Model(vm) {
  var _value = 0
  var data = {}
  Object.defineProperty(data, 'value', {
    get: function () { return _value },
    set: function (nextValue) {
      vm.notify(nextValue)
      _value = nextValue
    }
  })
  this.change = function (nextValue) {
    data.value = nextValue
  }
  this.getValue = function () {
    return _value
  }
}
// viewmodel
function ViewModel() {
  var model, view, needRespond = true
  this.init = function () {
    view = new View(this)
    model = new Model(this)
    view.render(model)
  }
  this.input = function (e) {
    model.change(e.target.value)
  }
  this.notify = function (nextValue) {
    if (needRespond) {
      console.log('new value:', nextValue)
      view.render(model)
    }
  }
}
// 调用
var vm = new ViewModel()
vm.init()
```

**总结**
1. MVVM模式中model层和view层通过viewmodel层关联，通过viewmodel层同步视图和数据
2. 仅由viewmodel层发起view层的重新渲染
3. view层的修改可以被viewmodel层感知到
4. model层的修改可以被viewmodel层感知到
5. 代码的执行入口是viewmodel