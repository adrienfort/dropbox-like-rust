// const env = (name: string, default_value?: string, required = true): string => {
//   const value = import.meta.env[name];
//   if (value === undefined) {
//     if (required) throw new Error(`Env var ${name} is not set`);
//     if (default_value !== undefined) return default_value;
//   }
//   return value;
// };

// const BACKEND_URL = env("VITE_BACKEND_URL");
const BACKEND_URL = "http://localhost:8080";

export { BACKEND_URL };
