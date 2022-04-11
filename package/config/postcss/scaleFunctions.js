const scale = Object.entries({
  '0.5': '0.125rem',
  '1':   '0.25rem',
  '1.5': '0.375rem',
  '2':   '0.5rem',
  '2.5': '0.625rem',
  '3':   '0.75rem',
  '3.5': '0.875rem',
  '4':   '1rem',
  '5':   '1.25rem',
  '6':   '1.5rem',
  '7':   '1.75rem',
  '8':   '2rem',
  '9':   '2.25rem',
  '10':  '2.5rem',
  '11':  '2.75rem',
  '12':  '3rem',
  '14':  '3.5rem',
  '16':  '4rem',
  '20':  '5rem',
  '24':  '6rem',
  '28':  '7rem',
  '32':  '8rem',
  '36':  '9rem',
  '40':  '10rem',
  '44':  '11rem',
  '48':  '12rem',
  '52':  '13rem',
  '56':  '14rem',
  '60':  '15rem',
  '64':  '16rem',
  '72':  '18rem',
  '80':  '20rem',
  '96':  '24rem'
}).reduce((result, e) => {
  const [key, value] = e;
  return {
    ...result,
    [key]: value,
    [`-${key}`]: `-${value}`
  };
}, {});

const rounded = {
  'sm': '0.125rem',
  'base': '0.25rem',
  'md': '0.375rem',
  'lg': '0.5rem',
  'xl': '0.75rem',
  '2xl': '1em',
  '3xl': '1.5rem',
  'full': '9999px'
};

module.exports = require('postcss-functions')({
  functions: {
    rounded: loopUpFunction(rounded, 'rounded'),
    size: loopUpFunction(scale, 'size'),
    space: loopUpFunction(scale, 'space')
  }
});

function loopUpFunction(map, name) {
  return function(key = 'base') {
    if (!map[key]) {
      throw new Error(`Unknown ${name} ${key}`);
    }

    return map[key];
  }
}
