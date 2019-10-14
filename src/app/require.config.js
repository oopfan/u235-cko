// require.js looks for the following global when initializing
var require = {
    baseUrl: "../src",
    paths: {
        // [Scaffolded bindings will be inserted here. To retain this feature, don't remove this comment.]
        "crossroads":                     "../node_modules/crossroads/dist/crossroads.min",
        "hasher":                         "../node_modules/hasher/dist/js/hasher.min",
        "knockout":                       "../node_modules/knockout/build/output/knockout-latest",
        "signals":                        "../node_modules/signals/dist/signals.min",
        "text":                           "../node_modules/requirejs-text/text",
        "vector3d":                       "./core/vector3d",
        "matrix3d":                       "./core/matrix3d",
        "timekeeper":                     "./core/timekeeper",
        "utility":                        "./core/utility",
        "ko-modal-helper":                "./core/ko-modal-helper",
        "lrgb-exposure-calculator":       "./core/lrgb-exposure-calculator",
        "scroll-view":                    "./core/scroll-view",
        "astrocalc-v1-accumulator":       "./core/astrocalc-v1-accumulator",
        "astrocalc-v1-memory":            "./core/astrocalc-v1-memory",
        "astrocalc-v1-engine":            "./core/astrocalc-v1-engine",
        "astrocalc-v1-observatory":       "./core/astrocalc-v1-observatory",
        "astrocalc-v1-store":             "./core/astrocalc-v1-store",
        "astrocalc-v1-load":              "./core/astrocalc-v1-load",
        "astrocalc-v1-universal-time":    "./core/astrocalc-v1-universal-time",
        "astrocalc-v1-local-time":        "./core/astrocalc-v1-local-time",
        "astrocalc-v1-coordinates":       "./core/astrocalc-v1-coordinates",
        "astrocalc-v1-precession":        "./core/astrocalc-v1-precession",
        "astrocalc-v1-transformation":    "./core/astrocalc-v1-transformation",
        "astrocalc-v1-clear-all":         "./core/astrocalc-v1-clear-all"
    }
};
