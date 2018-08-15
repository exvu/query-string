import { query, } from '../lib';


let data = {
  a: '/asfas?',
  b: [
    1, 3,
    {
      a: 1,
      b: [
        1,
        3,
        {
          a: '/asfas?',
          b: [
            1, 3,
            {
              a: 1,
              b: [
                1,
                3,

              ]
            }
          ],
          c: 'c?',
          d: {
            d: 1
          }
        }
      ]
    }
  ],
  c: 'c?',
  d: {
    d: 1
  }
};

let str = query.stringify(data);
console.log(str)

console.log(query.parse(str));