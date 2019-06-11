/*
#### Задача 2

Улучшить класс `DB` из предыдущей задачи.

- Добавить метод `find` который будет возвращать массив пользователей которые удовлетворяют условие переданому в качестве параметра.
- Генерировать ошибку если query не валидный.
- Поля `name` и `country` ищут 100% cовпадание
- Поля `age` и `salary` принимают объект в котором должны быть или 2 параметра `min` и `max` или хотя-бы один из них.
- Возвращать пустой массив если не удалось найти пользователей которые удовлетворяют объект запроса.

```javascript
const query = {
    country: 'ua',
    age: {
        min: 21
    },
    salary: {
        min: 300,
        max: 600
    }
};
const customers = db.find(query); // массив пользователей
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

  find(query) {
    const schema = {
      name: (value, query) => {
        return value === query;
      },
      country: (value, query) => {
        return value === query;
      },
      age: (value, query) => {
        const min = query.min || Number.NEGATIVE_INFINITY;
        const max = query.max || Number.POSITIVE_INFINITY;
        return value >= min && value <= max;
      },
      salary: (value, query) => {
        const min = query.min || Number.NEGATIVE_INFINITY;
        const max = query.max || Number.POSITIVE_INFINITY;
        return value >= min && value <= max;
      },
    };
    let customers = [];
    this.db.forEach((value, key) => {
      let match = true;
      for (const queryKey in query) {
        match = schema[queryKey] && schema[queryKey](value[queryKey], query[queryKey]);
        if (!match) {
          break;
        }
      }
      match && customers.push(value);
    });
    return customers;
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

const query = {
  country: 'ua',
  age: {
    min: 21
  },
  salary: {
    min: 300,
    max: 600
  }
};
const customers = db.find(query); // массив пользователей
console.log(customers)
