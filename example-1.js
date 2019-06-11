/*

#### Задача 1

Создать класс `DB` который будет имплементировать `CRUD` модель.

- В качестве структуры данных использовать `Map`.
- Реализовать метод `create`, который принимает объект и валидирует его, в случае невалидности объекта – генерирует ошибку.
- Метод `create` возвращает `id`.
- При создании пользователя генерировать уникальный `id`, который является ключем для объекта пользователя в структуре `Map`
- Метод `read` принимает идентификатор пользователя, если такого пользователя нет возвращать `null`, а если есть возвращать объект пользователя с полем `id` внутри объекта.
- Если в метод `read` передать не строку то генерировать ошибку.
- Если в метод `read` не передать параметр то генерировать ошибку.
- Метод `readAll` возвращает массив пользователей.
- Генерировать ошибку если в метод `readAll` передан параметр.
- Метод `update` обновляет пользователя.
- Метод `update` принимает 2 обязательных параметра.
- Метод `update` генерирует ошибку если передан несуществующий `id`
- Метод `update` генерирует ошибку если передан `id` с типом не строка
- Метод `update` генерирует ошибку если второй параметр не валидный
- Метод `delete` удаляет пользователя
- Генерировать ошибку если передан в метод `delete` несуществующий или невалидный `id`

```javascript
const db = new DB();

const person = {
    name: 'Pitter', // обязательное поле с типом string
    age: 21, // обязательное поле с типом number
    country: 'ua', // обязательное поле с типом string
    salary: 500 // обязательное поле с типом number
};

const id = db.create(person);
const customer = db.read(id);
const customers = db.readAll(); // массив пользователей
db.update(id, { age: 22 }); // id
db.delete(id); // true
```

 */

class DB {
  constructor() {
    this.db = new Map();
  }

  create(obj) {
    this.validateObj(obj, true);
    const id = this.create_UUID();
    this.db.set(id, obj);
    return id;
  }

  validateObj(obj, strongValidation) {
      const schema = new Map([
        [
          'name',
          'string'
        ],
        [
          'age',
          'number'
        ],
        [
          'country',
          'string'
        ],
        [
          'salary',
          'number'
        ]
      ]);

      schema.forEach((type, key)=> {
        if (strongValidation && !obj[key]) {
          throw new Error(`Property ${key} is missing`);
        }
        const valueType = typeof obj[key];
        if (valueType !== 'undefined' && valueType !== type) {
          const message = `${key} has wrong type. Expected type ${type}, instead got ${valueType}`;
          throw new Error(message);
        }
      })
  }

  create_UUID() {
    let dt = new Date().getTime();
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = (dt + Math.random() * 16) % 16 | 0;
      dt = Math.floor(dt / 16);
      return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
    });
  }

  update(id, obj) {
    if (typeof id !== 'string') {
      throw new Error('Property id is not a string');
    }
    if (!this.db.has(id)) {
      throw new Error('User is undefined');
    }
    this.validateObj(obj, false);
    const newUser = Object.assign(this.db.get(id), obj);
    this.db.set(id, newUser);
  }

  delete(id) {
    if (typeof id !== 'string') {
      throw new Error('Property id is not a string');
    }
    if (!this.db.has(id)) {
      throw new Error('User is undefined');
    }
    this.db.delete(id);
  }

  read(id) {
    return this.db.get(id) || null;
  }

  readAll() {
    return this.db;
  }

}

const db = new DB();

const person = {
  name: 'Pitter', // обязательное поле с типом string
  age: 21, // обязательное поле с типом number
  country: 'ua', // обязательное поле с типом string
  salary: 500 // обязательное поле с типом number
};

const id = db.create(person);
const customer = db.read(id);
console.log('create', customer)
const customers = db.readAll(); // массив пользователей
console.log('Read all:', customers)
db.update(id, {age: 22}); // id
console.log('updated', db.read(id))
db.delete(id); // true
console.log('deleted', db.read(id))
