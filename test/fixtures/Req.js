module.exports = function Req() {
  this._fields = [];
  this.field = (...args) => {
    this._fields.push(args);
    return this;
  };
};
