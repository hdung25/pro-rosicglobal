// Node resolve hook: lets build scripts import Vite-style extensionless
// modules from src/ (e.g. `import "./data"`). Used with `node --import`.
import { register } from "node:module";

register("data:text/javascript," + encodeURIComponent(`
export async function resolve(specifier, context, next) {
  try { return await next(specifier, context); }
  catch (error) {
    if (error?.code === "ERR_MODULE_NOT_FOUND" && specifier.startsWith(".") && !/\.[cm]?js$/.test(specifier))
      return next(specifier + ".js", context);
    throw error;
  }
}`));
