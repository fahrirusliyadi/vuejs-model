Base Vue.js model class with reactive attributes.

# Installation

```bash
# with yarn
yarn add @fahrirusliyadi/vuejs-model

# or with npm
npm install @fahrirusliyadi/vuejs-model
```

# Usage

```js
import Model from '@fahrirusliyadi/vuejs-model';

class Post extends Model {
  // Define model's attributes.
  get $attributes() {
    return ['id', 'title', 'published_at'];
  }

  // Mutator example.
  set id(value) {
    this.$set('id', Number(value));
  }

  // Accessor example.
  get published_at() {
    return new Date(this.$get('published_at')).toLocaleDateString('en-US');
  }
}

const post = new Post({
  id: '1',
  title: 'Hello World',
  published_at: '2020-05-06',
});

console.log(post.id); // 1
console.log(post.title); // "Hello World"
console.log(post.published_at); // "5/6/2020"

post.id = '2';
post.title = 'Good Morning';
console.log(post.id); // 2
console.log(post.title); // "Good Morning"
```

# Instance Methods

## \$get(key)

Get an attribute value.

**Arguments**

- `{String} key` Attribute key.

**Returns**

- `{*}` Attribute value.

## \$set(key, value)

Set an attribute value.

**Arguments**

- `{String} key` Attribute key.
- `{*} value` Attribute value.

## \$fill(attributes)

Fill the model with attribute values.

**Arguments**

- `{Object} attributes` Attributes to fill.

## toJSON()

Return a copy of the model's attributes object.

**Returns**

- `{Object}` Attributes.
