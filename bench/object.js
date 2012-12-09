var Benchmark = require('benchmark');
var assert = require('assert');
try { _ = require('lodash'); } catch (e) {};

// obj1: 5 sting keys and values
obj1 = {'a': 'a', 'b': 'b', 'c': 'c', 'd': 'd', 'e': 'e'};

// obj2: 5 integer keys and values
obj2 = {1: 1, 2: 2, 3: 3, 4: 4, 5: 5};

// obj3: 1000 string keys and values
obj3 = {};
for (var i = 0; i < 1000; i++) {
  obj3['_' + i] = '_' + i;
}

// obj4: 1000 integer keys and values
obj4 = {};
for (var i = 0; i < 1000; i++) {
  obj4[i] = i;
}

arr1 = [1, 2, 3, 4, 5];
arr2 = [];
for (var i = 0; i < 1000; i++) {
  arr2.push(i);
}

// regular for(var i in obj) cloner
regular = function(obj) { var result = {}; for(var i in obj) result[i] = obj[i]; return result; };
assert.deepEqual(obj1, regular(obj1));

// regular cloner with own checks
regular_own = function(obj) { var result = {}; for(var i in obj) if (obj.hasOwnProperty(i)) result[i] = obj[i]; return result; };
assert.deepEqual(obj1, regular_own(obj1));

// regular cloner with own checks
regular_keys = function(obj) { var result = {}; var props = Object.keys(obj); for(var i = 0, l = props.length; i < l; i++) result[i] = obj[i]; return result; };
assert.deepEqual(obj1, regular_own(obj1));

// static cloner
function createStatic(obj) {
  var parts = [];
  for (var j in obj) if (obj.hasOwnProperty(j)) {
    parts.push('"' + j + '": obj["' + j + '"]');
  }
  var code = 'return {' + parts.join(',') + '}';
  return new Function('obj', code);
}
static1 = createStatic(obj1);
static2 = createStatic(obj2);
static3 = createStatic(obj3);
static4 = createStatic(obj4);
assert.deepEqual(obj1, static1(obj1));

var Cloner = require('..').Cloner;
cloner = new Cloner(false);

var suite = new Benchmark.Suite;
suite.on('cycle', function(event) {
  console.log(String(event.target));
});
suite.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').pluck('name'));
});

suite.add('obj1 for in                  ', 'regular(obj1)');
suite.add('obj1 for in hasOwnProperty   ', 'regular_own(obj1)');
suite.add('obj1 for Object.keys         ', 'regular_keys(obj1)');
suite.add('obj1 static cloner           ', 'static1(obj1)');
suite.add('obj1 lodash _.clone          ', '_.clone(obj1, false)');
suite.add('obj1 node-v8-clone cloner    ', 'cloner.clone(obj1)');

suite.add('obj2 for in                  ', 'regular(obj2)');
suite.add('obj2 for in hasOwnProperty   ', 'regular_own(obj2)');
suite.add('obj2 for Object.keys         ', 'regular_keys(obj2)');
suite.add('obj2 static cloner           ', 'static2(obj2)');
suite.add('obj2 lodash _.clone          ', '_.clone(obj2, false)');
suite.add('obj2 node-v8-clone cloner    ', 'cloner.clone(obj2)');

suite.add('obj3 for in                  ', 'regular(obj3)');
suite.add('obj3 for in hasOwnProperty   ', 'regular_own(obj3)');
suite.add('obj3 for Object.keys         ', 'regular_keys(obj3)');
suite.add('obj3 static cloner           ', 'static3(obj3)');
suite.add('obj3 lodash _.clone          ', '_.clone(obj3, false)');
suite.add('obj3 node-v8-clone cloner    ', 'cloner.clone(obj3)');

suite.add('obj4 for in                  ', 'regular(obj4)');
suite.add('obj4 for in hasOwnProperty   ', 'regular_own(obj4)');
suite.add('obj4 for Object.keys         ', 'regular_keys(obj4)');
suite.add('obj4 static cloner           ', 'static4(obj4)');
suite.add('obj4 lodash _.clone          ', '_.clone(obj4, false)');
suite.add('obj4 node-v8-clone cloner    ', 'cloner.clone(obj4)');

suite.run({ 'async': true });