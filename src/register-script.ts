export const registerScript = (url: string): Promise<any> => {
  return new Promise<any>((resolve, reject) => {
    const scriptEl = document.createElement('script');
    scriptEl.onload = resolve;
    scriptEl.onerror = reject;
    scriptEl.src = url;
    document.body.appendChild(scriptEl);
  });
};
