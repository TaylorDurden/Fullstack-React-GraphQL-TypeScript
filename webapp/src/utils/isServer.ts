export const isServer = () => typeof window === 'undefined'; // window is undenfined means that this is the server not the browser