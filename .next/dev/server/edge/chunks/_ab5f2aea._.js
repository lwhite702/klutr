(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push(["chunks/_ab5f2aea._.js",
"[project]/instrumentation.ts [instrumentation-edge] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "register",
    ()=>register
]);
async function register() {
    if (("TURBOPACK compile-time value", "edge") === 'nodejs') {
    // Server-side instrumentation can be added here if needed
    // For now, we only need client-side PostHog initialization
    }
    if (("TURBOPACK compile-time value", "edge") === 'edge') {
    // Edge runtime instrumentation can be added here if needed
    }
}
}),
"[project]/edge-wrapper.js { MODULE => \"[project]/instrumentation.ts [instrumentation-edge] (ecmascript)\" } [instrumentation-edge] (ecmascript)", ((__turbopack_context__, module, exports) => {

self._ENTRIES ||= {};
const modProm = Promise.resolve().then(()=>__turbopack_context__.i("[project]/instrumentation.ts [instrumentation-edge] (ecmascript)"));
modProm.catch(()=>{});
self._ENTRIES["middleware_instrumentation"] = new Proxy(modProm, {
    get (modProm, name) {
        if (name === "then") {
            return (res, rej)=>modProm.then(res, rej);
        }
        let result = (...args)=>modProm.then((mod)=>(0, mod[name])(...args));
        result.then = (res, rej)=>modProm.then((mod)=>mod[name]).then(res, rej);
        return result;
    }
});
}),
]);

//# sourceMappingURL=_ab5f2aea._.js.map