/*
  Simple Stack implementation used by the browser simulator.
  - items: internal array storing stack elements.
  - Methods are intentionally clear and small so students can follow easily.
*/
class Stack {
  constructor() {
    // start with an empty array
    this.items = [];
  }

  // Add an element to the top of the stack
  push(element) {
    this.items.push(element);
  }

  // Remove and return the top element. If empty, return "Underflow" (simple message).
  pop() {
    if (this.isEmpty()) {
      return "Underflow";
    }
    return this.items.pop();
  }

  // Look at the top element without removing it.
  peek() {
    if (this.isEmpty()) {
      return "No elements in stack";
    }
    return this.items[this.items.length - 1];
  }

  // Check whether the stack is empty
  isEmpty() {
    return this.items.length === 0;
  }

  // Return the number of items on the stack
  size() {
    return this.items.length;
  }

  // Remove all items from the stack
  clear() {
    this.items = [];
  }

  // Return a shallow copy of the internal array for safe reading
  toArray() {
    return [...this.items];
  }
}

export default Stack;
