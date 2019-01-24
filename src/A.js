/**
 * A class
 */
class B {
  /**
   * Add numbers
   * @param {Number} a
   * @param {Number} b
   * @return {Number}
   */
  add(a, b) {
    return a + b;
  }
}

/**
 * A B class
 */
class A extends B {
  /**
   * Sub numbers
   * @param {Number} a
   * @param {Number} b
   * @return {Number}
   */
  sub(a, b) {
    return a - b;
  }
}

module.exports = A;
