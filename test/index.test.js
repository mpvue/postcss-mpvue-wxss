var postcss = require('postcss');

var plugin = require('../');

function run(input, output, opts) {
  return postcss([plugin(opts)]).process(input)
    .then(result => {
      expect(result.css).toEqual(output);
      expect(result.warnings().length).toBe(0);
    });
}

it('test cleanComments', () => {
  const input = `
    /* Comments */`;
  const output = ``;
  const options = {};
  return run(input, output, options);
});

it('test cleanSelector', () => {
  const input = `
    * {
      margin: 100px
    }
    *,:after,:before{
      box-sizing:inherit;
    }`;
  const output = ``;
  const options = {};
  return run(input, output, options);
});

it('test cleanSelector with options', () => {
  const input = `
    * {
      margin: 100px
    }
    aaa {
      margin: 100px
    }
    bbb {
      margin: 100px
    }`;
  const output = ``;
  const options = {
    cleanSelector: ['aaa', 'bbb', '*']
  };
  return run(input, output, options);
});

it('test remToRpx', () => {
  const input = `
    .container {
      width: 50rem;
      font-size: 24.4rem
    }`;
  const output = `
    .container {
      width: 5000rpx;
      font-size: 2440rpx
    }`;
  const options = {};
  return run(input, output, options);
});

it('test remToRpx with options', () => {
  const input = `
    .container {
      width: 50rem;
      font-size: 24.4rem
    }`;
  const output = `
    .container {
      width: 50rpx;
      font-size: 24.4rpx
    }`;
  const options = {
    remToRpx: 1
  };
  return run(input, output, options);
});

it('test replaceTagSelector', () => {
  const input = `
    div {
      width: 50rpx;
    }
    ul li {
      width: 50rpx;
    }
    ul>li {
      width: 50rpx;
    }
    .input-box {
      border: 1px solid red;
    }
    view {
      width: 50rpx;
    }`;
  const output = `
    ._div {
      width: 50rpx;
    }
    ._ul ._li {
      width: 50rpx;
    }
    ._ul>._li {
      width: 50rpx;
    }
    .input-box {
      border: 1px solid red;
    }
    view {
      width: 50rpx;
    }`;
  const options = {};
  return run(input, output, options);
});

it('test replaceTagSelector with options', () => {
  const input = `
    aaa {
      width: 50rpx;
    }
    bbb {
      width: 60rpx;
    }`;
  const output = `
    ._aaa {
      width: 50rpx;
    }
    ccc, .ddd {
      width: 60rpx;
    }`;
  const options = {
    replaceTagSelector: {
      aaa: 'replaceToClass',
      bbb: 'ccc, .ddd'
    }
  };
  return run(input, output, options);
});

it('test readme', () => {
  const input = `
    /* 被清理 */
    * {
      margin: 100px
    }

    /* 保持原样 */
    view {
      width: 50rpx;
    }
    .container {
      width: 7.5rem;
      font-size: .24rem
    }

    /* Web 标签转换 */
    div {
      width: 50rpx;
    }
    ul li {
      width: 50rpx;
    }
    body {
      width: 50rpx;
    }`;
  const output = `
    view {
      width: 50rpx;
    }
    .container {
      width: 750rpx;
      font-size: 24rpx
    }
    ._div {
      width: 50rpx;
    }
    ._ul ._li {
      width: 50rpx;
    }
    page {
      width: 50rpx;
    }`;
  const options = {};
  return run(input, output, options);
});
