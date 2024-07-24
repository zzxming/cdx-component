export const cloneNode = <T extends HTMLElement>(node: T, content: string) => {
  const copy = node.cloneNode(false) as T;
  copy.style.width = getComputedStyle(node).width;
  copy.style.position = 'fixed';
  copy.style.zIndex = '-9999';
  copy.style.top = '-9999px';
  copy.style.left = '-9999px';
  copy.style.minHeight = 'auto';
  copy.innerHTML = content;
  document.body.appendChild(copy);
  return copy;
};
