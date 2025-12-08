// 防抖

const debounce = (func, delay) => {
  let timer = null;
  return function (...arg) {
    if (timer) clearTimeout(timer);
    timer = setTimeout(() => {
      func.call(this, ...arg);
    }, delay);
  };
};

const throller = (func, delay) => {
  let bef = 0;
  return function (...arg) {
    const now = new Date().getTime();
    if (now - bef > delay) {
      func.call(this, ...arg);
      bef = now;
    }
  };
};

// 深拷贝

const cloneDeep = (data, map = new Map()) => {
  if (typeof data !== 'object') return data;
  const cloneDeep = Array.isArray(data) ? [] : {};
  if (map.get(data)) {
    return map.get(data);
  }
  map.set(data, cloneDeep);
  for (key in data) {
    if (typeof data[key] === 'object') {
      cloneDeep[key] = cloneDeep(data[key]);
    } else {
      cloneDeep[key] = data[key];
    }
  }
  return cloneDeep;
};

// 数字转千分位

const formatNum = (num, split = ',') => {
  const arr = num.toString().split('');
  let result = '';
  let count = 0;
  for (let i = arr.length - 1; i >= 0; i--) {
    result = arr[i] + result;
    count++;
    if (count % 3 === 0 && i !== 0) {
      result = split + result;
    }
  }
  return result;
};

// 数组扁平化

const flat = arr => {
  return arr.reduce(
    (prev, item) => prev.concat(Array.isArray(item) ? flat(item) : item),
    []
  );
};
