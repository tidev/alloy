// TODO We need to determine the current platform and insert it here!
// Basically very similar to inlining env vars as here: https://github.com/babel/babel/blob/4c371132ae7321f6d08567eab54a59049e07f246/packages/babel-plugin-transform-inline-environment-variables/src/index.js
export default function ({ types: t }) {
  return {
    visitor: {
      MemberExpression(path) {
        if (path.get("object").matchesPattern("Ti(tanium).Platform.(os)name")) {
          path.replaceWith(t.valueToNode('platform.name'));
        }
      }
    }
  };
}
