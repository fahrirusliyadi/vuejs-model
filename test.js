import test from 'ava';
import Model from './src/model';

class TestModel extends Model {
  get $attributes() {
    return ['a', 'b', 'c'];
  }

  get b() {
    return this.$get('b') + 1;
  }

  /* eslint-disable-next-line accessor-pairs */
  set c(value) {
    this.$set('c', value * 2);
  }

  get d() {
    return 4;
  }

  /* eslint-disable-next-line accessor-pairs */
  set e(value) {
    this.$set('e', value);
  }
}

test('constructor', (t) => {
  const instance = new TestModel({ a: 2 });

  t.is(instance.a, 2);
});

test('$fill', (t) => {
  const instance = new TestModel();

  instance.$fill({ a: 2, c: 4 });

  t.is(instance.a, 2);
  t.is(instance.c, 8);
});

test('getter', (t) => {
  const instance = new TestModel();
  instance.b = 4;

  t.is(instance.b, 5);
});

test('setter', (t) => {
  const instance = new TestModel();
  instance.c = 4;

  t.is(instance.c, 8);
});

test('getter without setter', (t) => {
  const instance = new TestModel();

  t.is(instance.d, 4);
  t.throws(
    () => {
      instance.d = 5;
    },
    { instanceOf: TypeError }
  );
});

test('setter without getter', (t) => {
  const instance = new TestModel();
  instance.e = 5;

  t.is(instance.$get('e'), 5);
  t.is(instance.e, undefined);
});

test('$toObject', (t) => {
  const instance = new TestModel({ a: 1 });

  t.deepEqual(instance.$toObject(), { a: 1, b: undefined, c: undefined });
});
