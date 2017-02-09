export const registry = [];

export default function(name, {component}) {
  registry.push({
    name,
    component
  });
}
