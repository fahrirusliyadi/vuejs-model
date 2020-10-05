import Vue from 'vue';

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
   * @deprecated Use toJSON instead.
   * @returns {Object}
   */
  $toObject() {
    console.warn(`$toObject is deprecated, use toJSON instead.`);
    return this.toJSON();
  }

  /**
   * Return a copy of the model's attributes object.
   *
   * @returns {Object}
   */
  toJSON() {
    const clone = (value) => {
      if (value instanceof Model) {
        return value.toJSON();
      }

      if (Array.isArray(value)) {
        return value.reduce((result, value) => {
          result.push(clone(value));
          return result;
        }, []);
      }

      return value;
    };

    return Object.entries(this._attributes).reduce((result, [key, value]) => {
      result[key] = clone(value);
      return result;
    }, {});
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

    Object.defineProperty(this, '_attributes', { enumerable: false });

    for (const key of this.$attributes) {
      const classDescriptor = this._getClassPropertyDescriptor(key);
      const descriptor = {
        get: () => this.$get(key),
        set: (value) => {
          this.$set(key, value);
        },
        enumerable: true,
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

  /**
   * Get property descriptor from child class.
   *
   * @param {String} name Property name.
   * @returns {Object}
   */
  _getClassPropertyDescriptor(name) {
    let proto = Object.getPrototypeOf(this);

    while (proto) {
      const descriptor = Object.getOwnPropertyDescriptor(proto, name);

      if (descriptor) {
        return descriptor;
      }

      proto = Object.getPrototypeOf(proto);
    }
  }
}
