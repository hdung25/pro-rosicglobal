/**
 * Browser page translation (Chrome/Google Translate, Edge, Safari) replaces
 * text nodes with <font> wrappers behind React's back. When React later
 * removes or moves one of those nodes it throws "The node to be removed is
 * not a child of this node", and the whole page goes blank (customer item 12).
 *
 * Make the two DOM calls React relies on tolerant of that situation. This is
 * the approach recommended in facebook/react#11538.
 */
export function installTranslateGuard() {
  if (typeof Node !== "function" || !Node.prototype || Node.prototype.__rosicTranslateGuard) return;
  const removeChild = Node.prototype.removeChild;
  Node.prototype.removeChild = function guardedRemoveChild(child) {
    if (child.parentNode !== this) {
      // Translation moved the node; remove it from wherever it lives now.
      child.parentNode?.removeChild(child);
      return child;
    }
    return removeChild.call(this, child);
  };
  const insertBefore = Node.prototype.insertBefore;
  Node.prototype.insertBefore = function guardedInsertBefore(newNode, referenceNode) {
    if (referenceNode && referenceNode.parentNode !== this) {
      return insertBefore.call(this, newNode, null);
    }
    return insertBefore.call(this, newNode, referenceNode);
  };
  Object.defineProperty(Node.prototype, "__rosicTranslateGuard", { value: true });
}
