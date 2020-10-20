const Observable = {
  observers: [],
  addObserver(topic, observer) {
    this.observers[topic] || (this.observers[topic] = []);
    this.observers[topic].push(observer);
  },
  removeObserver(topic, observer) {
    if (!this.observers[topic]) {
      return;
    }
    const index = this.observers[topic].indexOf(observer);
    if (index) {
      this.observers[topic].splice(index, 1);
    }
  },
  notifyObservers(topic, message) {
    if (!this.observers[topic]) { return; }

    for (let i = this.observers[topic].length - 1; i >= 0; i -= 1) {
      this.observers[topic][i](message);
    }
  },
};

module.exports = Observable;
