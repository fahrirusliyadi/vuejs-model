import Vue from 'vue';
import cloneDeep from 'lodash/cloneDeep';

export default class Model {
  /**
   * @param {Object} attributes
   */
  constructor(attributes = {}) {
    this._defineAttributes();
    this.$fill(attributes);
  }

  /**
   * Attribute names.
   *
   * @returns {Array}
   */
  get $attributes() {
    return [];
  }

  /**
   * Fill the model with attribute values.
   *
   * @param {Object} attributes
   */
  $fill(attributes) {
    for (const [key, value] of Object.entries(attributes)) {
      this[key] = value;
    }
  }

  /**
   * Set an attribute value.
   *
   * @param {String} key
   * @param {*} value
   */
  $set(key, value) {
    Vue.set(this._attributes, key, value);
  }

  /**
   * Get an attribute value.
   *
   * @param {String} key
   * @returns {*}
   */
  $get(key) {
    return this._attributes[key];
  }

  /**
   * Convert the model instance to an object.
   * 
   @returns {Object}
   */
  $toObject() {
    return cloneDeep(this._attributes);
  }

  /**
   * Define public attributes.
   */
  _defineAttributes() {
    const defaults = this.$attributes.reduce((object, key) => {
      object[key] = undefined;
      return object;
    }, {});
    this._attributes = Vue.observable(defaults);

    for (const key of this.$attributes) {
      const classDescriptor = Object.getOwnPropertyDescriptor(
        Object.getPrototypeOf(this),
        key
      );
      const descriptor = {
        get: () => this.$get(key),
        set: (value) => {
          this.$set(key, value);
        },
      };

      if (classDescriptor) {
        // Skip if both already defined in class.
        if (classDescriptor.get && classDescriptor.set) {
          continue;
        }

        descriptor.get = classDescriptor.get || descriptor.get;
        descriptor.set = classDescriptor.set || descriptor.set;
      }

      Object.defineProperty(this, key, descriptor);
    }
  }
}
