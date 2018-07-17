module.exports = {
  isRegExp: function (arg) {
    return Object.prototype.toString.call(arg) === '[object RegExp]';
  }
}
