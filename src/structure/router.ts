import { Application } from "express";
import type { HttpMethod, RouterOptions } from "../typings";
import { getFiles, getMethods, pathToRoute } from "../utils/utils";
import path from "path";
import { ServerContext } from "../utils/constants";
import colors from "../utils/colors";
export class XRouter {
  public useHooks: boolean;
  public dir?: string;
  public catchAllRoutes?: string;
  private app: Application;
  constructor({ dir, app, hooks, catchAllRoutes }: RouterOptions) {
    this.useHooks = hooks ?? false;
    this.dir = dir;
    this.catchAllRoutes = catchAllRoutes;
    this.app = app;
    this.#buildRoutes();
  }

  #initHooks() {
    try {
      if (!this.dir)
        throw new Error("[Error: XRouter] The dir path is missing in class");
      for (const method of getMethods(this.dir)) {
        switch (method.method) {
          case "GET":
            {
              let count: number = 0;
              for (const file of getFiles(method.path)) {
                this.#registerRoute("get", file.filePath, true);
                count++;
                console.log(
                  colors.green(
                    `Added ${count} GET ${count > 1 ? "Routes" : "Route"}`
                  )
                );
              }
            }
            break;

          case "POST":
            {
              let count: number = 0;
              for (const file of getFiles(method.path)) {
                this.#registerRoute("post", file.filePath, true);
                count++;
                console.log(
                  colors.green(
                    `Added ${count} POST ${count > 1 ? "Routes" : "Route"}`
                  )
                );
              }
            }
            break;
          case "PATCH":
            {
              let count: number = 0;
              for (const file of getFiles(method.path)) {
                this.#registerRoute("patch", file.filePath, true);
                count++;
                console.log(
                  colors.green(
                    `Added ${count} PATCH ${count > 1 ? "Routes" : "Route"}`
                  )
                );
              }
            }
            break;
          case "PUT":
            {
              let count: number = 0;
              for (const file of getFiles(method.path)) {
                this.#registerRoute("put", file.filePath, true);
                count++;
                console.log(
                  colors.green(
                    `Added ${count} PUT ${count > 1 ? "Routes" : "Route"}`
                  )
                );
              }
            }
            break;
          case "DELETE":
            {
              let count: number = 0;
              for (const file of getFiles(method.path)) {
                this.#registerRoute("delete", file.filePath, true);
                count++;
                console.log(
                  colors.green(
                    `Added ${count} DELETE ${count > 1 ? "Routes" : "Route"}`
                  )
                );
              }
            }
            break;
        }
      }
    } catch (error) {
      console.error(
        colors.red("[Error: XError] Error while initlizing Hooks Routes"),
        error
      );
    }
  }

  #initRoutes() {
    if (!this.dir)
      throw new Error("[Error: XRouter] The dir path is missing in class");

    let count: number = 0;
    try {
      for (const method of getMethods(this.dir)) {
        switch (method.method) {
          case "GET":
            for (const file of getFiles(method.path)) {
              this.#registerRoute("get", file.filePath);
              count++;
              console.log(
                colors.green(
                  `Added ${count} GET ${count > 1 ? "Routes" : "Route"}`
                )
              );
            }
            break;

          case "POST":
            for (const file of getFiles(method.path)) {
              this.#registerRoute("post", file.filePath);
              count++;
              console.log(
                colors.green(
                  `Added ${count} POST ${count > 1 ? "Routes" : "Route"}`
                )
              );
            }
            break;
          case "PATCH":
            for (const file of getFiles(method.path)) {
              this.#registerRoute("patch", file.filePath);
              count++;
              console.log(
                colors.green(
                  `Added ${count} PATCH ${count > 1 ? "Routes" : "Route"}`
                )
              );
            }
            break;
          case "PUT":
            for (const file of getFiles(method.path)) {
              this.#registerRoute("put", file.filePath);
              count++;
              console.log(
                colors.green(
                  `Added ${count} PUT ${count > 1 ? "Routes" : "Route"}`
                )
              );
            }
            break;
          case "DELETE":
            for (const file of getFiles(method.path)) {
              this.#registerRoute("delete", file.filePath);
              count++;
              console.log(
                colors.green(
                  `Added ${count} DELETE ${count > 1 ? "Routes" : "Route"}`
                )
              );
            }
            break;
        }
      }
    } catch (error) {
      return console.error(
        colors.red("[Error: XError] Error while initlizing Routes"),
        error
      );
    }
  }
  #registerRoute(method: HttpMethod, methodPath: string, hooks?: boolean) {
    if (!this.dir)
      throw new Error("[Error: XRouter] The dir path is missing in class");
    try {
      for (const info of getFiles(methodPath, true)) {
        const file = require(info.filePath);
        if (!file) {
          console.warn(
            `[Warn: XRouter]: ${path.basename(
              info.filePath,
              path.extname(info.filePath)
            )} is Missing to Export Handler`
          );
          continue;
        }

        const run = file.default;
        if (!run) {
          console.warn(
            `[Warn: XRouter]: ${path.basename(
              info.filePath,
              path.extname(info.filePath)
            )} is Missing to Export Handler`
          );
          continue;
        }
        const route = pathToRoute(
          info.filePath
            .substring(this.dir.indexOf("Routes") + "Routes".length)
            .replace(`${method.toUpperCase()}`, "/")
        );
        if (hooks)
          this.app
            .route(route)
            [method](async (req, res, next) =>
              ServerContext.run({ request: req, response: res, next }, run)
            );
        else
          this.app
            .route(route)
            [method](async (req, res, next) => run(req, res, next));
      }
    } catch (error) {
      return console.error(
        colors.red("[Error: XError] Error while registering Routes"),
        error
      );
    }
  }

  #initAllRoutes(path: string) {
    if (!this.catchAllRoutes)
      throw new Error("[Error: XRouter] The dir path is missing in class");
    try {
      for (const files of getFiles(path, true)) {
        const run = require(files.filePath);
        const route = pathToRoute(
          files.filePath.substring(path.indexOf("Routeset") + "Routeset".length)
        );

        if (run.GET) {
          this.#registerCatchAll("get", route, run);
        }
        if (run.POST) {
          this.#registerCatchAll("post", route, run);
        }
        if (run.PUT) {
          this.#registerCatchAll("put", route, run);
        }
        if (run.PATCH) {
          this.#registerCatchAll("patch", route, run);
        }
        if (run.DELETE) {
          this.#registerCatchAll("delete", route, run);
        }
      }
    } catch (error) {
      return console.debug(
        colors.red("[Error: XError] Error while registering catch Routes"),
        error
      );
    }
  }

  #registerCatchAll(method: HttpMethod, route: string, file: any) {
    if (this.useHooks) {
      this.app
        .route(route)
        ["get"](async (req, res, next) =>
          ServerContext.run({ request: req, response: res, next }, file[method.toUpperCase()])
        );
    } else {
      this.app
        .route(route)
        ["get"](async (req, res, next) => file[method.toUpperCase()](req, res, next));
    }
  }
  #buildRoutes() {
    if (this.catchAllRoutes) this.#initAllRoutes(this.catchAllRoutes);
    if (this.useHooks && this.dir) this.#initHooks();
    else if (this.dir) this.#initRoutes();
  }
}
