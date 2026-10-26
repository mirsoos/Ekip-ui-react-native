declare module 'react-dom' {
  export function createPortal(children: any, container: any, key?: any): any;
  const ReactDOM: any;
  export default ReactDOM;
}

declare module 'react-dom/client' {
  export function createRoot(container: any): any;
  export function hydrateRoot(container: any, children: any): any;
}
