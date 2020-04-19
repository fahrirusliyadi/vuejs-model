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
  const object = new TestModel({ a: 2 });

  t.is(object.a, 2);
});

test('$fill', (t) => {
  const object = new TestModel();

  object.$fill({ a: 2, c: 4 });

  t.is(object.a, 2);
  t.is(object.c, 8);
});

test('getter', (t) => {
  const object = new TestModel();
  object.b = 4;

  t.is(object.b, 5);
});

test('setter', (t) => {
  const object = new TestModel();
  object.c = 4;

  t.is(object.c, 8);
});

test('getter without setter', (t) => {
  const object = new TestModel();

  t.is(object.d, 4);
  t.throws(
    () => {
      object.d = 5;
    },
    { instanceOf: TypeError }
  );
});

test('setter without getter', (t) => {
  const object = new TestModel();
  object.e = 5;

  t.is(object.$get('e'), 5);
  t.is(object.e, undefined);
});
