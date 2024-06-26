##### 原型与原型链

原型：prototype，只要创建了一个函数，就会为这个函数创建一个 prototype 属性(指向原型对象)
原型对象：自动获取一个名为 constructor 属性，指向构造函数
\_\_proto\_\_：每个对象上会有\_\_proto\_\_属性，通过这个属性访问对象的原型

构造函数、原型和实例的关系：每个构造函数都有一个原型对象(Person.prototype)，原型有一个属性指回构造函数(Person.prototype.constructor === Person)，实例有一个内部指针指向原型(person1.\_\_proto\_\_ === Person.prototype)

当访问对象的某个属性时，首先会在自身查找，没有的话就会在原型上查找：

person1.\_\_proto\_\_ === Person.prototype
Person.prototype.\_\_proto\_\_ === Object.prototype
Object.prototype.\_\_proto\_\_ === null
