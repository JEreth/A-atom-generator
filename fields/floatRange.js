module.exports = function (from, to, decimals) {
    this.from = from;
    this.to = to;
    this.value = function () {
        return (Math.random() * (this.to-this.from) + this.from).toFixed(decimals);
    }
}
