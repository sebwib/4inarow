import { jsx, jsxs } from "react/jsx-runtime";
import { PassThrough } from "node:stream";
import { createReadableStreamFromReadable } from "@react-router/node";
import { ServerRouter, useMatches, useActionData, useLoaderData, useParams, useRouteError, Meta, Links, ScrollRestoration, Scripts, Outlet, isRouteErrorResponse } from "react-router";
import { isbot } from "isbot";
import { renderToPipeableStream } from "react-dom/server";
import { createElement, useState, useCallback } from "react";
const streamTimeout = 5e3;
function handleRequest(request, responseStatusCode, responseHeaders, routerContext, loadContext) {
  return new Promise((resolve, reject) => {
    let shellRendered = false;
    let userAgent = request.headers.get("user-agent");
    let readyOption = userAgent && isbot(userAgent) || routerContext.isSpaMode ? "onAllReady" : "onShellReady";
    const { pipe, abort } = renderToPipeableStream(
      /* @__PURE__ */ jsx(ServerRouter, { context: routerContext, url: request.url }),
      {
        [readyOption]() {
          shellRendered = true;
          const body = new PassThrough();
          const stream = createReadableStreamFromReadable(body);
          responseHeaders.set("Content-Type", "text/html");
          resolve(
            new Response(stream, {
              headers: responseHeaders,
              status: responseStatusCode
            })
          );
          pipe(body);
        },
        onShellError(error) {
          reject(error);
        },
        onError(error) {
          responseStatusCode = 500;
          if (shellRendered) {
            console.error(error);
          }
        }
      }
    );
    setTimeout(abort, streamTimeout + 1e3);
  });
}
const entryServer = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: handleRequest,
  streamTimeout
}, Symbol.toStringTag, { value: "Module" }));
function withComponentProps(Component) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      matches: useMatches()
    };
    return createElement(Component, props);
  };
}
function withErrorBoundaryProps(ErrorBoundary3) {
  return function Wrapped() {
    const props = {
      params: useParams(),
      loaderData: useLoaderData(),
      actionData: useActionData(),
      error: useRouteError()
    };
    return createElement(ErrorBoundary3, props);
  };
}
const links = () => [{
  rel: "preconnect",
  href: "https://fonts.googleapis.com"
}, {
  rel: "preconnect",
  href: "https://fonts.gstatic.com",
  crossOrigin: "anonymous"
}, {
  rel: "stylesheet",
  href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap"
}];
function Layout({
  children
}) {
  return /* @__PURE__ */ jsxs("html", {
    lang: "en",
    children: [/* @__PURE__ */ jsx("title", {
      children: "4 in a row"
    }), /* @__PURE__ */ jsxs("head", {
      children: [/* @__PURE__ */ jsx("meta", {
        charSet: "utf-8"
      }), /* @__PURE__ */ jsx("meta", {
        name: "viewport",
        content: "width=device-width, initial-scale=1"
      }), /* @__PURE__ */ jsx(Meta, {}), /* @__PURE__ */ jsx(Links, {})]
    }), /* @__PURE__ */ jsxs("body", {
      children: [children, /* @__PURE__ */ jsx(ScrollRestoration, {}), /* @__PURE__ */ jsx(Scripts, {})]
    })]
  });
}
const root = withComponentProps(function App() {
  return /* @__PURE__ */ jsx(Outlet, {});
});
const ErrorBoundary = withErrorBoundaryProps(function ErrorBoundary2({
  error
}) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack;
  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details = error.status === 404 ? "The requested page could not be found." : error.statusText || details;
  }
  return /* @__PURE__ */ jsxs("main", {
    className: "pt-16 p-4 container mx-auto",
    children: [/* @__PURE__ */ jsx("h1", {
      children: message
    }), /* @__PURE__ */ jsx("p", {
      children: details
    }), stack]
  });
});
const route0 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  ErrorBoundary,
  Layout,
  default: root,
  links
}, Symbol.toStringTag, { value: "Module" }));
const Game = () => {
  const [locked, setLocked] = useState(false);
  const [turn, setTurn] = useState("black");
  const [game, setGame] = useState([
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"],
    ["none", "none", "none", "none", "none", "none", "none"]
  ]);
  const [wins, setWins] = useState("none");
  const resetGame = () => {
    setLocked(false);
    setWins("none");
    setGame([
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"],
      ["none", "none", "none", "none", "none", "none", "none"]
    ]);
    setTurn("black");
  };
  const checkWin = (game2) => {
    for (let row = 0; row < game2.length; row++) {
      for (let col = 0; col < game2[row].length - 3; col++) {
        if (game2[row][col] === turn && game2[row][col + 1] === turn && game2[row][col + 2] === turn && game2[row][col + 3] === turn) {
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
    for (let col = 0; col < game2[0].length; col++) {
      for (let row = 0; row < game2.length - 3; row++) {
        if (game2[row][col] === turn && game2[row + 1][col] === turn && game2[row + 2][col] === turn && game2[row + 3][col] === turn) {
          setLocked(true);
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
    for (let row = 0; row < game2.length - 3; row++) {
      for (let col = 0; col < game2[row].length - 3; col++) {
        if (game2[row][col] === turn && game2[row + 1][col + 1] === turn && game2[row + 2][col + 2] === turn && game2[row + 3][col + 3] === turn) {
          setLocked(true);
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
        if (game2[row][col + 3] === turn && game2[row + 1][col + 2] === turn && game2[row + 2][col + 1] === turn && game2[row + 3][col] === turn) {
          setLocked(true);
          setTimeout(() => {
            setWins(turn);
          }, 700);
          return;
        }
      }
    }
  };
  const click = useCallback(
    (turn2, rowIndex, cellIndex) => {
      if (locked) {
        return;
      }
      const newGame = [...game];
      let didPlace = false;
      for (let i = game.length - 1; i >= 0; i--) {
        if (newGame[i][cellIndex] === "none") {
          newGame[i][cellIndex] = turn2;
          didPlace = true;
          break;
        }
      }
      if (!didPlace) {
        return;
      }
      setGame(newGame);
      checkWin(newGame);
      setTurn(turn2 === "black" ? "red" : "black");
    },
    [game, locked]
  );
  return /* @__PURE__ */ jsx(
    "div",
    {
      style: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        width: "100vw"
      },
      children: /* @__PURE__ */ jsxs(
        "div",
        {
          style: {
            position: "relative",
            width: "min(95vh, 95vw)",
            height: "min(95vh, 95vw)",
            display: "flex",
            flexDirection: "column"
          },
          children: [
            game.map((row, rowIndex) => /* @__PURE__ */ jsx(
              "div",
              {
                style: { display: "flex", width: "100%", height: "100%" },
                children: row.map((cell, cellIndex) => /* @__PURE__ */ jsx(
                  "div",
                  {
                    onClick: () => {
                      if (cell === "none") {
                        click(turn, rowIndex, cellIndex);
                      }
                    },
                    style: {
                      position: "relative",
                      width: 100 / row.length + "%",
                      height: "100%",
                      backgroundColor: "white",
                      border: "1px solid black"
                    },
                    children: cell !== "none" && /* @__PURE__ */ jsx(
                      "div",
                      {
                        style: {
                          animation: `fall ${rowIndex * 0.1}s`,
                          left: "5%",
                          top: "5%",
                          position: "absolute",
                          width: "90%",
                          height: "90%",
                          backgroundColor: cell,
                          borderRadius: "50%"
                        }
                      }
                    )
                  },
                  cellIndex
                ))
              },
              rowIndex
            )),
            wins !== "none" && /* @__PURE__ */ jsxs(
              "div",
              {
                style: {
                  animation: `fadeIn 0.8s`,
                  position: "absolute",
                  top: "0%",
                  left: "0%",
                  width: "100%",
                  height: "100%",
                  background: "rgba(0, 0, 0, 0.5)",
                  padding: 20,
                  borderRadius: 10,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center"
                },
                children: [
                  /* @__PURE__ */ jsxs(
                    "h1",
                    {
                      style: {
                        fontSize: 40,
                        textAlign: "center",
                        marginBottom: 20,
                        textTransform: "uppercase",
                        fontWeight: "bold",
                        color: wins,
                        textShadow: "-1px -1px 0 #FFF, 1px -1px 0 #FFF, -1px 1px 0 #FFF, 1px 1px 0 #FFF"
                      },
                      children: [
                        wins,
                        " wins!"
                      ]
                    }
                  ),
                  /* @__PURE__ */ jsx(
                    "button",
                    {
                      onClick: resetGame,
                      style: {
                        padding: 10,
                        backgroundColor: "black",
                        color: "white",
                        border: "none",
                        borderRadius: 5,
                        fontSize: 20
                      },
                      children: "Play again"
                    }
                  )
                ]
              }
            )
          ]
        }
      )
    }
  );
};
function meta({}) {
  return [{
    title: "New React Router App"
  }, {
    name: "description",
    content: "Welcome to React Router!"
  }];
}
const home = withComponentProps(function Home() {
  return /* @__PURE__ */ jsx(Game, {});
});
const route1 = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  default: home,
  meta
}, Symbol.toStringTag, { value: "Module" }));
const serverManifest = { "entry": { "module": "/4inarow/assets/entry.client-CrHes0rY.js", "imports": ["/4inarow/assets/chunk-KNED5TY2-BWNdqSdz.js"], "css": [] }, "routes": { "root": { "id": "root", "parentId": void 0, "path": "", "index": void 0, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": true, "module": "/4inarow/assets/root-DTRb0KLX.js", "imports": ["/4inarow/assets/chunk-KNED5TY2-BWNdqSdz.js", "/4inarow/assets/with-props-D3AO8slx.js"], "css": ["/4inarow/assets/root-B6DOjmoF.css"], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 }, "routes/home": { "id": "routes/home", "parentId": "root", "path": void 0, "index": true, "caseSensitive": void 0, "hasAction": false, "hasLoader": false, "hasClientAction": false, "hasClientLoader": false, "hasClientMiddleware": false, "hasErrorBoundary": false, "module": "/4inarow/assets/home-2MGhGdY0.js", "imports": ["/4inarow/assets/with-props-D3AO8slx.js", "/4inarow/assets/chunk-KNED5TY2-BWNdqSdz.js"], "css": [], "clientActionModule": void 0, "clientLoaderModule": void 0, "clientMiddlewareModule": void 0, "hydrateFallbackModule": void 0 } }, "url": "/4inarow/assets/manifest-28accd29.js", "version": "28accd29", "sri": void 0 };
const assetsBuildDirectory = "build/client";
const basename = "/";
const future = { "unstable_middleware": false, "unstable_optimizeDeps": false, "unstable_splitRouteModules": false, "unstable_subResourceIntegrity": false, "unstable_viteEnvironmentApi": false };
const ssr = true;
const isSpaMode = false;
const prerender = [];
const publicPath = "/4inarow/";
const entry = { module: entryServer };
const routes = {
  "root": {
    id: "root",
    parentId: void 0,
    path: "",
    index: void 0,
    caseSensitive: void 0,
    module: route0
  },
  "routes/home": {
    id: "routes/home",
    parentId: "root",
    path: void 0,
    index: true,
    caseSensitive: void 0,
    module: route1
  }
};
export {
  serverManifest as assets,
  assetsBuildDirectory,
  basename,
  entry,
  future,
  isSpaMode,
  prerender,
  publicPath,
  routes,
  ssr
};
