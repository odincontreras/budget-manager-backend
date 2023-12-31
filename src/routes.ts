import express from "express";
import fs from "fs";
import path from "path";

const routes = express.Router();

const addRoutes = async () => {
  const modulesPath = path.join(process.cwd(), "src", "modules");
  const appPath = path.join(process.cwd(), "src", "index");

  const modules = fs.readdirSync(modulesPath);

  const fileExtension = path.extname(appPath);

  for (const module of modules) {
    const routerPath = path.join(
      `${modulesPath}`,
      `${module}`,
      `${module}.routes.${fileExtension}`,
    );

    const existRouterPath = fs.existsSync(routerPath);

    if (existRouterPath) {
      const fileContent = fs.readFileSync(routerPath, "utf-8");

      // Check for export default router statement
      const exportDefaultRouterRegex = /export\sdefault\srouter/;
      if (exportDefaultRouterRegex.test(fileContent)) {
        import(routerPath).then((moduleRouter) => {
          routes.use(`/${module}`, moduleRouter.default);
        });
      }
    }
  }
};

addRoutes();

export default routes;
