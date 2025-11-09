module.exports = [
"[project]/instrumentation-client.ts [instrumentation] (ecmascript, async loader)", ((__turbopack_context__) => {

__turbopack_context__.v((parentImport) => {
    return Promise.all([
  "server/chunks/5c022_posthog-js_dist_module_95273162.js",
  "server/chunks/_e6581b69._.js"
].map((chunk) => __turbopack_context__.l(chunk))).then(() => {
        return parentImport("[project]/instrumentation-client.ts [instrumentation] (ecmascript)");
    });
});
}),
];