module.exports = function (from, to) {
    this.from = from;
    this.to = to;
    this.value = function () {
        return Math.floor(Math.random() * (this.to-this.from)) + this.from;
    }
}
