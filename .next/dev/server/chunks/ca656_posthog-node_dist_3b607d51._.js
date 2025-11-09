module.exports = [
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/module.node.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createModulerModifier",
    ()=>createModulerModifier
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
function createModulerModifier() {
    const getModuleFromFileName = createGetModuleFromFilename();
    return async (frames)=>{
        for (const frame of frames)frame.module = getModuleFromFileName(frame.filename);
        return frames;
    };
}
function createGetModuleFromFilename(basePath = process.argv[1] ? (0, __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["dirname"])(process.argv[1]) : process.cwd(), isWindows = '\\' === __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["sep"]) {
    const normalizedBase = isWindows ? normalizeWindowsPath(basePath) : basePath;
    return (filename)=>{
        if (!filename) return;
        const normalizedFilename = isWindows ? normalizeWindowsPath(filename) : filename;
        let { dir, base: file, ext } = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["posix"].parse(normalizedFilename);
        if ('.js' === ext || '.mjs' === ext || '.cjs' === ext) file = file.slice(0, -1 * ext.length);
        const decodedFile = decodeURIComponent(file);
        if (!dir) dir = '.';
        const n = dir.lastIndexOf('/node_modules');
        if (n > -1) return `${dir.slice(n + 14).replace(/\//g, '.')}:${decodedFile}`;
        if (dir.startsWith(normalizedBase)) {
            const moduleName = dir.slice(normalizedBase.length + 1).replace(/\//g, '.');
            return moduleName ? `${moduleName}:${decodedFile}` : decodedFile;
        }
        return decodedFile;
    };
}
function normalizeWindowsPath(path) {
    return path.replace(/^[A-Z]:/, '').replace(/\\/g, '/');
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/context-lines.node.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "MAX_CONTEXTLINES_COLNO",
    ()=>MAX_CONTEXTLINES_COLNO,
    "MAX_CONTEXTLINES_LINENO",
    ()=>MAX_CONTEXTLINES_LINENO,
    "addSourceContext",
    ()=>addSourceContext
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <export * as ErrorTracking>");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:fs [external] (node:fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$readline__$5b$external$5d$__$28$node$3a$readline$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:readline [external] (node:readline, cjs)");
;
;
;
const LRU_FILE_CONTENTS_CACHE = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].ReduceableCache(25);
const LRU_FILE_CONTENTS_FS_READ_FAILED = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].ReduceableCache(20);
const DEFAULT_LINES_OF_CONTEXT = 7;
const MAX_CONTEXTLINES_COLNO = 1000;
const MAX_CONTEXTLINES_LINENO = 10000;
async function addSourceContext(frames) {
    const filesToLines = {};
    for(let i = frames.length - 1; i >= 0; i--){
        const frame = frames[i];
        const filename = frame?.filename;
        if (!frame || 'string' != typeof filename || 'number' != typeof frame.lineno || shouldSkipContextLinesForFile(filename) || shouldSkipContextLinesForFrame(frame)) continue;
        const filesToLinesOutput = filesToLines[filename];
        if (!filesToLinesOutput) filesToLines[filename] = [];
        filesToLines[filename].push(frame.lineno);
    }
    const files = Object.keys(filesToLines);
    if (0 == files.length) return frames;
    const readlinePromises = [];
    for (const file of files){
        if (LRU_FILE_CONTENTS_FS_READ_FAILED.get(file)) continue;
        const filesToLineRanges = filesToLines[file];
        if (!filesToLineRanges) continue;
        filesToLineRanges.sort((a, b)=>a - b);
        const ranges = makeLineReaderRanges(filesToLineRanges);
        if (ranges.every((r)=>rangeExistsInContentCache(file, r))) continue;
        const cache = emplace(LRU_FILE_CONTENTS_CACHE, file, {});
        readlinePromises.push(getContextLinesFromFile(file, ranges, cache));
    }
    await Promise.all(readlinePromises).catch(()=>{});
    if (frames && frames.length > 0) addSourceContextToFrames(frames, LRU_FILE_CONTENTS_CACHE);
    LRU_FILE_CONTENTS_CACHE.reduce();
    return frames;
}
function getContextLinesFromFile(path, ranges, output) {
    return new Promise((resolve)=>{
        const stream = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$fs__$5b$external$5d$__$28$node$3a$fs$2c$__cjs$29$__["createReadStream"])(path);
        const lineReaded = (0, __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$readline__$5b$external$5d$__$28$node$3a$readline$2c$__cjs$29$__["createInterface"])({
            input: stream
        });
        function destroyStreamAndResolve() {
            stream.destroy();
            resolve();
        }
        let lineNumber = 0;
        let currentRangeIndex = 0;
        const range = ranges[currentRangeIndex];
        if (void 0 === range) return void destroyStreamAndResolve();
        let rangeStart = range[0];
        let rangeEnd = range[1];
        function onStreamError() {
            LRU_FILE_CONTENTS_FS_READ_FAILED.set(path, 1);
            lineReaded.close();
            lineReaded.removeAllListeners();
            destroyStreamAndResolve();
        }
        stream.on('error', onStreamError);
        lineReaded.on('error', onStreamError);
        lineReaded.on('close', destroyStreamAndResolve);
        lineReaded.on('line', (line)=>{
            lineNumber++;
            if (lineNumber < rangeStart) return;
            output[lineNumber] = snipLine(line, 0);
            if (lineNumber >= rangeEnd) {
                if (currentRangeIndex === ranges.length - 1) {
                    lineReaded.close();
                    lineReaded.removeAllListeners();
                    return;
                }
                currentRangeIndex++;
                const range = ranges[currentRangeIndex];
                if (void 0 === range) {
                    lineReaded.close();
                    lineReaded.removeAllListeners();
                    return;
                }
                rangeStart = range[0];
                rangeEnd = range[1];
            }
        });
    });
}
function addSourceContextToFrames(frames, cache) {
    for (const frame of frames)if (frame.filename && void 0 === frame.context_line && 'number' == typeof frame.lineno) {
        const contents = cache.get(frame.filename);
        if (void 0 === contents) continue;
        addContextToFrame(frame.lineno, frame, contents);
    }
}
function addContextToFrame(lineno, frame, contents) {
    if (void 0 === frame.lineno || void 0 === contents) return;
    frame.pre_context = [];
    for(let i = makeRangeStart(lineno); i < lineno; i++){
        const line = contents[i];
        if (void 0 === line) return void clearLineContext(frame);
        frame.pre_context.push(line);
    }
    if (void 0 === contents[lineno]) return void clearLineContext(frame);
    frame.context_line = contents[lineno];
    const end = makeRangeEnd(lineno);
    frame.post_context = [];
    for(let i = lineno + 1; i <= end; i++){
        const line = contents[i];
        if (void 0 === line) break;
        frame.post_context.push(line);
    }
}
function clearLineContext(frame) {
    delete frame.pre_context;
    delete frame.context_line;
    delete frame.post_context;
}
function shouldSkipContextLinesForFile(path) {
    return path.startsWith('node:') || path.endsWith('.min.js') || path.endsWith('.min.cjs') || path.endsWith('.min.mjs') || path.startsWith('data:');
}
function shouldSkipContextLinesForFrame(frame) {
    if (void 0 !== frame.lineno && frame.lineno > MAX_CONTEXTLINES_LINENO) return true;
    if (void 0 !== frame.colno && frame.colno > MAX_CONTEXTLINES_COLNO) return true;
    return false;
}
function rangeExistsInContentCache(file, range) {
    const contents = LRU_FILE_CONTENTS_CACHE.get(file);
    if (void 0 === contents) return false;
    for(let i = range[0]; i <= range[1]; i++)if (void 0 === contents[i]) return false;
    return true;
}
function makeLineReaderRanges(lines) {
    if (!lines.length) return [];
    let i = 0;
    const line = lines[0];
    if ('number' != typeof line) return [];
    let current = makeContextRange(line);
    const out = [];
    while(true){
        if (i === lines.length - 1) {
            out.push(current);
            break;
        }
        const next = lines[i + 1];
        if ('number' != typeof next) break;
        if (next <= current[1]) current[1] = next + DEFAULT_LINES_OF_CONTEXT;
        else {
            out.push(current);
            current = makeContextRange(next);
        }
        i++;
    }
    return out;
}
function makeContextRange(line) {
    return [
        makeRangeStart(line),
        makeRangeEnd(line)
    ];
}
function makeRangeStart(line) {
    return Math.max(1, line - DEFAULT_LINES_OF_CONTEXT);
}
function makeRangeEnd(line) {
    return line + DEFAULT_LINES_OF_CONTEXT;
}
function emplace(map, key, contents) {
    const value = map.get(key);
    if (void 0 === value) {
        map.set(key, contents);
        return contents;
    }
    return value;
}
function snipLine(line, colno) {
    let newLine = line;
    const lineLength = newLine.length;
    if (lineLength <= 150) return newLine;
    if (colno > lineLength) colno = lineLength;
    let start = Math.max(colno - 60, 0);
    if (start < 5) start = 0;
    let end = Math.min(start + 140, lineLength);
    if (end > lineLength - 5) end = lineLength;
    if (end === lineLength) start = Math.max(end - 140, 0);
    newLine = newLine.slice(start, end);
    if (start > 0) newLine = `...${newLine}`;
    if (end < lineLength) newLine += '...';
    return newLine;
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/autocapture.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "addUncaughtExceptionListener",
    ()=>addUncaughtExceptionListener,
    "addUnhandledRejectionListener",
    ()=>addUnhandledRejectionListener
]);
function makeUncaughtExceptionHandler(captureFn, onFatalFn) {
    let calledFatalError = false;
    return Object.assign((error)=>{
        const userProvidedListenersCount = /*TURBOPACK member replacement*/ __turbopack_context__.g.process.listeners('uncaughtException').filter((listener)=>'domainUncaughtExceptionClear' !== listener.name && true !== listener._posthogErrorHandler).length;
        const processWouldExit = 0 === userProvidedListenersCount;
        captureFn(error, {
            mechanism: {
                type: 'onuncaughtexception',
                handled: false
            }
        });
        if (!calledFatalError && processWouldExit) {
            calledFatalError = true;
            onFatalFn(error);
        }
    }, {
        _posthogErrorHandler: true
    });
}
function addUncaughtExceptionListener(captureFn, onFatalFn) {
    /*TURBOPACK member replacement*/ __turbopack_context__.g.process.on('uncaughtException', makeUncaughtExceptionHandler(captureFn, onFatalFn));
}
function addUnhandledRejectionListener(captureFn) {
    /*TURBOPACK member replacement*/ __turbopack_context__.g.process.on('unhandledRejection', (reason)=>captureFn(reason, {
            mechanism: {
                type: 'onunhandledrejection',
                handled: false
            }
        }));
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>ErrorTracking
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$autocapture$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/autocapture.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bucketed$2d$rate$2d$limiter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bucketed-rate-limiter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
;
;
const SHUTDOWN_TIMEOUT = 2000;
class ErrorTracking {
    constructor(client, options, _logger){
        this.client = client;
        this._exceptionAutocaptureEnabled = options.enableExceptionAutocapture || false;
        this._logger = _logger;
        this._rateLimiter = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bucketed$2d$rate$2d$limiter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BucketedRateLimiter"]({
            refillRate: 1,
            bucketSize: 10,
            refillInterval: 10000,
            _logger: this._logger
        });
        this.startAutocaptureIfEnabled();
    }
    static async buildEventMessage(error, hint, distinctId, additionalProperties) {
        const properties = {
            ...additionalProperties
        };
        if (!distinctId) properties.$process_person_profile = false;
        const exceptionProperties = this.errorPropertiesBuilder.buildFromUnknown(error, hint);
        exceptionProperties.$exception_list = await this.errorPropertiesBuilder.modifyFrames(exceptionProperties.$exception_list);
        return {
            event: '$exception',
            distinctId: distinctId || (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])(),
            properties: {
                ...exceptionProperties,
                ...properties
            }
        };
    }
    startAutocaptureIfEnabled() {
        if (this.isEnabled()) {
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$autocapture$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addUncaughtExceptionListener"])(this.onException.bind(this), this.onFatalError.bind(this));
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$autocapture$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addUnhandledRejectionListener"])(this.onException.bind(this));
        }
    }
    onException(exception, hint) {
        this.client.addPendingPromise((async ()=>{
            const eventMessage = await ErrorTracking.buildEventMessage(exception, hint);
            const exceptionProperties = eventMessage.properties;
            const exceptionType = exceptionProperties?.$exception_list[0]?.type ?? 'Exception';
            const isRateLimited = this._rateLimiter.consumeRateLimit(exceptionType);
            if (isRateLimited) return void this._logger.info('Skipping exception capture because of client rate limiting.', {
                exception: exceptionType
            });
            return this.client.capture(eventMessage);
        })());
    }
    async onFatalError(exception) {
        console.error(exception);
        await this.client.shutdown(SHUTDOWN_TIMEOUT);
        process.exit(1);
    }
    isEnabled() {
        return !this.client.isDisabled && this._exceptionAutocaptureEnabled;
    }
    shutdown() {
        this._rateLimiter.stop();
    }
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/version.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "version",
    ()=>version
]);
const version = '5.11.2';
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/feature-flags/crypto.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hashSHA1",
    ()=>hashSHA1
]);
async function hashSHA1(text) {
    const subtle = globalThis.crypto?.subtle;
    if (!subtle) throw new Error('SubtleCrypto API not available');
    const hashBuffer = await subtle.digest('SHA-1', new TextEncoder().encode(text));
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((byte)=>byte.toString(16).padStart(2, '0')).join('');
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/feature-flags/feature-flags.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ClientError",
    ()=>ClientError,
    "FeatureFlagsPoller",
    ()=>FeatureFlagsPoller,
    "InconclusiveMatchError",
    ()=>InconclusiveMatchError,
    "RequiresServerEvaluation",
    ()=>RequiresServerEvaluation,
    "matchProperty",
    ()=>matchProperty,
    "relativeDateParseForFeatureFlagMatching",
    ()=>relativeDateParseForFeatureFlagMatching
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$crypto$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/feature-flags/crypto.mjs [app-route] (ecmascript)");
;
;
const SIXTY_SECONDS = 60000;
const LONG_SCALE = 0xfffffffffffffff;
const NULL_VALUES_ALLOWED_OPERATORS = [
    'is_not'
];
class ClientError extends Error {
    constructor(message){
        super();
        Error.captureStackTrace(this, this.constructor);
        this.name = 'ClientError';
        this.message = message;
        Object.setPrototypeOf(this, ClientError.prototype);
    }
}
class InconclusiveMatchError extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, InconclusiveMatchError.prototype);
    }
}
class RequiresServerEvaluation extends Error {
    constructor(message){
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
        Object.setPrototypeOf(this, RequiresServerEvaluation.prototype);
    }
}
class FeatureFlagsPoller {
    constructor({ pollingInterval, personalApiKey, projectApiKey, timeout, host, customHeaders, ...options }){
        this.debugMode = false;
        this.shouldBeginExponentialBackoff = false;
        this.backOffCount = 0;
        this.pollingInterval = pollingInterval;
        this.personalApiKey = personalApiKey;
        this.featureFlags = [];
        this.featureFlagsByKey = {};
        this.groupTypeMapping = {};
        this.cohorts = {};
        this.loadedSuccessfullyOnce = false;
        this.timeout = timeout;
        this.projectApiKey = projectApiKey;
        this.host = host;
        this.poller = void 0;
        this.fetch = options.fetch || fetch;
        this.onError = options.onError;
        this.customHeaders = customHeaders;
        this.onLoad = options.onLoad;
        this.loadFeatureFlags();
    }
    debug(enabled = true) {
        this.debugMode = enabled;
    }
    logMsgIfDebug(fn) {
        if (this.debugMode) fn();
    }
    async getFeatureFlag(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}) {
        await this.loadFeatureFlags();
        let response;
        let featureFlag;
        if (!this.loadedSuccessfullyOnce) return response;
        featureFlag = this.featureFlagsByKey[key];
        if (void 0 !== featureFlag) try {
            const result = await this.computeFlagAndPayloadLocally(featureFlag, distinctId, groups, personProperties, groupProperties);
            response = result.value;
            this.logMsgIfDebug(()=>console.debug(`Successfully computed flag locally: ${key} -> ${response}`));
        } catch (e) {
            if (e instanceof RequiresServerEvaluation || e instanceof InconclusiveMatchError) this.logMsgIfDebug(()=>console.debug(`${e.name} when computing flag locally: ${key}: ${e.message}`));
            else if (e instanceof Error) this.onError?.(new Error(`Error computing flag locally: ${key}: ${e}`));
        }
        return response;
    }
    async getAllFlagsAndPayloads(distinctId, groups = {}, personProperties = {}, groupProperties = {}, flagKeysToExplicitlyEvaluate) {
        await this.loadFeatureFlags();
        const response = {};
        const payloads = {};
        let fallbackToFlags = 0 == this.featureFlags.length;
        const flagsToEvaluate = flagKeysToExplicitlyEvaluate ? flagKeysToExplicitlyEvaluate.map((key)=>this.featureFlagsByKey[key]).filter(Boolean) : this.featureFlags;
        const sharedEvaluationCache = {};
        await Promise.all(flagsToEvaluate.map(async (flag)=>{
            try {
                const { value: matchValue, payload: matchPayload } = await this.computeFlagAndPayloadLocally(flag, distinctId, groups, personProperties, groupProperties, void 0, sharedEvaluationCache);
                response[flag.key] = matchValue;
                if (matchPayload) payloads[flag.key] = matchPayload;
            } catch (e) {
                if (e instanceof RequiresServerEvaluation || e instanceof InconclusiveMatchError) this.logMsgIfDebug(()=>console.debug(`${e.name} when computing flag locally: ${flag.key}: ${e.message}`));
                else if (e instanceof Error) this.onError?.(new Error(`Error computing flag locally: ${flag.key}: ${e}`));
                fallbackToFlags = true;
            }
        }));
        return {
            response,
            payloads,
            fallbackToFlags
        };
    }
    async computeFlagAndPayloadLocally(flag, distinctId, groups = {}, personProperties = {}, groupProperties = {}, matchValue, evaluationCache, skipLoadCheck = false) {
        if (!skipLoadCheck) await this.loadFeatureFlags();
        if (!this.loadedSuccessfullyOnce) return {
            value: false,
            payload: null
        };
        let flagValue;
        flagValue = void 0 !== matchValue ? matchValue : await this.computeFlagValueLocally(flag, distinctId, groups, personProperties, groupProperties, evaluationCache);
        const payload = this.getFeatureFlagPayload(flag.key, flagValue);
        return {
            value: flagValue,
            payload
        };
    }
    async computeFlagValueLocally(flag, distinctId, groups = {}, personProperties = {}, groupProperties = {}, evaluationCache = {}) {
        if (flag.ensure_experience_continuity) throw new InconclusiveMatchError('Flag has experience continuity enabled');
        if (!flag.active) return false;
        const flagFilters = flag.filters || {};
        const aggregation_group_type_index = flagFilters.aggregation_group_type_index;
        if (void 0 == aggregation_group_type_index) return await this.matchFeatureFlagProperties(flag, distinctId, personProperties, evaluationCache);
        {
            const groupName = this.groupTypeMapping[String(aggregation_group_type_index)];
            if (!groupName) {
                this.logMsgIfDebug(()=>console.warn(`[FEATURE FLAGS] Unknown group type index ${aggregation_group_type_index} for feature flag ${flag.key}`));
                throw new InconclusiveMatchError('Flag has unknown group type index');
            }
            if (!(groupName in groups)) {
                this.logMsgIfDebug(()=>console.warn(`[FEATURE FLAGS] Can't compute group feature flag: ${flag.key} without group names passed in`));
                return false;
            }
            const focusedGroupProperties = groupProperties[groupName];
            return await this.matchFeatureFlagProperties(flag, groups[groupName], focusedGroupProperties, evaluationCache);
        }
    }
    getFeatureFlagPayload(key, flagValue) {
        let payload = null;
        if (false !== flagValue && null != flagValue) {
            if ('boolean' == typeof flagValue) payload = this.featureFlagsByKey?.[key]?.filters?.payloads?.[flagValue.toString()] || null;
            else if ('string' == typeof flagValue) payload = this.featureFlagsByKey?.[key]?.filters?.payloads?.[flagValue] || null;
            if (null != payload) {
                if ('object' == typeof payload) return payload;
                if ('string' == typeof payload) try {
                    return JSON.parse(payload);
                } catch  {}
                return payload;
            }
        }
        return null;
    }
    async evaluateFlagDependency(property, distinctId, properties, evaluationCache) {
        const targetFlagKey = property.key;
        if (!this.featureFlagsByKey) throw new InconclusiveMatchError('Feature flags not available for dependency evaluation');
        if (!('dependency_chain' in property)) throw new InconclusiveMatchError(`Flag dependency property for '${targetFlagKey}' is missing required 'dependency_chain' field`);
        const dependencyChain = property.dependency_chain;
        if (!Array.isArray(dependencyChain)) throw new InconclusiveMatchError(`Flag dependency property for '${targetFlagKey}' has an invalid 'dependency_chain' (expected array, got ${typeof dependencyChain})`);
        if (0 === dependencyChain.length) throw new InconclusiveMatchError(`Circular dependency detected for flag '${targetFlagKey}' (empty dependency chain)`);
        for (const depFlagKey of dependencyChain){
            if (!(depFlagKey in evaluationCache)) {
                const depFlag = this.featureFlagsByKey[depFlagKey];
                if (depFlag) if (depFlag.active) try {
                    const depResult = await this.matchFeatureFlagProperties(depFlag, distinctId, properties, evaluationCache);
                    evaluationCache[depFlagKey] = depResult;
                } catch (error) {
                    throw new InconclusiveMatchError(`Error evaluating flag dependency '${depFlagKey}' for flag '${targetFlagKey}': ${error}`);
                }
                else evaluationCache[depFlagKey] = false;
                else throw new InconclusiveMatchError(`Missing flag dependency '${depFlagKey}' for flag '${targetFlagKey}'`);
            }
            const cachedResult = evaluationCache[depFlagKey];
            if (null == cachedResult) throw new InconclusiveMatchError(`Dependency '${depFlagKey}' could not be evaluated`);
        }
        const targetFlagValue = evaluationCache[targetFlagKey];
        return this.flagEvaluatesToExpectedValue(property.value, targetFlagValue);
    }
    flagEvaluatesToExpectedValue(expectedValue, flagValue) {
        if ('boolean' == typeof expectedValue) return expectedValue === flagValue || 'string' == typeof flagValue && '' !== flagValue && true === expectedValue;
        if ('string' == typeof expectedValue) return flagValue === expectedValue;
        return false;
    }
    async matchFeatureFlagProperties(flag, distinctId, properties, evaluationCache = {}) {
        const flagFilters = flag.filters || {};
        const flagConditions = flagFilters.groups || [];
        let isInconclusive = false;
        let result;
        for (const condition of flagConditions)try {
            if (await this.isConditionMatch(flag, distinctId, condition, properties, evaluationCache)) {
                const variantOverride = condition.variant;
                const flagVariants = flagFilters.multivariate?.variants || [];
                result = variantOverride && flagVariants.some((variant)=>variant.key === variantOverride) ? variantOverride : await this.getMatchingVariant(flag, distinctId) || true;
                break;
            }
        } catch (e) {
            if (e instanceof RequiresServerEvaluation) throw e;
            if (e instanceof InconclusiveMatchError) isInconclusive = true;
            else throw e;
        }
        if (void 0 !== result) return result;
        if (isInconclusive) throw new InconclusiveMatchError("Can't determine if feature flag is enabled or not with given properties");
        return false;
    }
    async isConditionMatch(flag, distinctId, condition, properties, evaluationCache = {}) {
        const rolloutPercentage = condition.rollout_percentage;
        const warnFunction = (msg)=>{
            this.logMsgIfDebug(()=>console.warn(msg));
        };
        if ((condition.properties || []).length > 0) {
            for (const prop of condition.properties){
                const propertyType = prop.type;
                let matches = false;
                matches = 'cohort' === propertyType ? matchCohort(prop, properties, this.cohorts, this.debugMode) : 'flag' === propertyType ? await this.evaluateFlagDependency(prop, distinctId, properties, evaluationCache) : matchProperty(prop, properties, warnFunction);
                if (!matches) return false;
            }
            if (void 0 == rolloutPercentage) return true;
        }
        if (void 0 != rolloutPercentage && await _hash(flag.key, distinctId) > rolloutPercentage / 100.0) return false;
        return true;
    }
    async getMatchingVariant(flag, distinctId) {
        const hashValue = await _hash(flag.key, distinctId, 'variant');
        const matchingVariant = this.variantLookupTable(flag).find((variant)=>hashValue >= variant.valueMin && hashValue < variant.valueMax);
        if (matchingVariant) return matchingVariant.key;
    }
    variantLookupTable(flag) {
        const lookupTable = [];
        let valueMin = 0;
        let valueMax = 0;
        const flagFilters = flag.filters || {};
        const multivariates = flagFilters.multivariate?.variants || [];
        multivariates.forEach((variant)=>{
            valueMax = valueMin + variant.rollout_percentage / 100.0;
            lookupTable.push({
                valueMin,
                valueMax,
                key: variant.key
            });
            valueMin = valueMax;
        });
        return lookupTable;
    }
    async loadFeatureFlags(forceReload = false) {
        if (!this.loadedSuccessfullyOnce || forceReload) await this._loadFeatureFlags();
    }
    isLocalEvaluationReady() {
        return (this.loadedSuccessfullyOnce ?? false) && (this.featureFlags?.length ?? 0) > 0;
    }
    getPollingInterval() {
        if (!this.shouldBeginExponentialBackoff) return this.pollingInterval;
        return Math.min(SIXTY_SECONDS, this.pollingInterval * 2 ** this.backOffCount);
    }
    async _loadFeatureFlags() {
        if (this.poller) {
            clearTimeout(this.poller);
            this.poller = void 0;
        }
        this.poller = setTimeout(()=>this._loadFeatureFlags(), this.getPollingInterval());
        try {
            const res = await this._requestFeatureFlagDefinitions();
            if (!res) return;
            switch(res.status){
                case 401:
                    this.shouldBeginExponentialBackoff = true;
                    this.backOffCount += 1;
                    throw new ClientError(`Your project key or personal API key is invalid. Setting next polling interval to ${this.getPollingInterval()}ms. More information: https://posthog.com/docs/api#rate-limiting`);
                case 402:
                    console.warn('[FEATURE FLAGS] Feature flags quota limit exceeded - unsetting all local flags. Learn more about billing limits at https://posthog.com/docs/billing/limits-alerts');
                    this.featureFlags = [];
                    this.featureFlagsByKey = {};
                    this.groupTypeMapping = {};
                    this.cohorts = {};
                    return;
                case 403:
                    this.shouldBeginExponentialBackoff = true;
                    this.backOffCount += 1;
                    throw new ClientError(`Your personal API key does not have permission to fetch feature flag definitions for local evaluation. Setting next polling interval to ${this.getPollingInterval()}ms. Are you sure you're using the correct personal and Project API key pair? More information: https://posthog.com/docs/api/overview`);
                case 429:
                    this.shouldBeginExponentialBackoff = true;
                    this.backOffCount += 1;
                    throw new ClientError(`You are being rate limited. Setting next polling interval to ${this.getPollingInterval()}ms. More information: https://posthog.com/docs/api#rate-limiting`);
                case 200:
                    {
                        const responseJson = await res.json() ?? {};
                        if (!('flags' in responseJson)) return void this.onError?.(new Error(`Invalid response when getting feature flags: ${JSON.stringify(responseJson)}`));
                        this.featureFlags = responseJson.flags ?? [];
                        this.featureFlagsByKey = this.featureFlags.reduce((acc, curr)=>(acc[curr.key] = curr, acc), {});
                        this.groupTypeMapping = responseJson.group_type_mapping || {};
                        this.cohorts = responseJson.cohorts || {};
                        this.loadedSuccessfullyOnce = true;
                        this.shouldBeginExponentialBackoff = false;
                        this.backOffCount = 0;
                        this.onLoad?.(this.featureFlags.length);
                        break;
                    }
                default:
                    return;
            }
        } catch (err) {
            if (err instanceof ClientError) this.onError?.(err);
        }
    }
    getPersonalApiKeyRequestOptions(method = 'GET') {
        return {
            method,
            headers: {
                ...this.customHeaders,
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.personalApiKey}`
            }
        };
    }
    async _requestFeatureFlagDefinitions() {
        const url = `${this.host}/api/feature_flag/local_evaluation?token=${this.projectApiKey}&send_cohorts`;
        const options = this.getPersonalApiKeyRequestOptions();
        let abortTimeout = null;
        if (this.timeout && 'number' == typeof this.timeout) {
            const controller = new AbortController();
            abortTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeSetTimeout"])(()=>{
                controller.abort();
            }, this.timeout);
            options.signal = controller.signal;
        }
        try {
            return await this.fetch(url, options);
        } finally{
            clearTimeout(abortTimeout);
        }
    }
    stopPoller() {
        clearTimeout(this.poller);
    }
}
async function _hash(key, distinctId, salt = '') {
    const hashString = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$crypto$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hashSHA1"])(`${key}.${distinctId}${salt}`);
    return parseInt(hashString.slice(0, 15), 16) / LONG_SCALE;
}
function matchProperty(property, propertyValues, warnFunction) {
    const key = property.key;
    const value = property.value;
    const operator = property.operator || 'exact';
    if (key in propertyValues) {
        if ('is_not_set' === operator) throw new InconclusiveMatchError("Operator is_not_set is not supported");
    } else throw new InconclusiveMatchError(`Property ${key} not found in propertyValues`);
    const overrideValue = propertyValues[key];
    if (null == overrideValue && !NULL_VALUES_ALLOWED_OPERATORS.includes(operator)) {
        if (warnFunction) warnFunction(`Property ${key} cannot have a value of null/undefined with the ${operator} operator`);
        return false;
    }
    function computeExactMatch(value, overrideValue) {
        if (Array.isArray(value)) return value.map((val)=>String(val).toLowerCase()).includes(String(overrideValue).toLowerCase());
        return String(value).toLowerCase() === String(overrideValue).toLowerCase();
    }
    function compare(lhs, rhs, operator) {
        if ('gt' === operator) return lhs > rhs;
        if ('gte' === operator) return lhs >= rhs;
        if ('lt' === operator) return lhs < rhs;
        if ('lte' === operator) return lhs <= rhs;
        throw new Error(`Invalid operator: ${operator}`);
    }
    switch(operator){
        case 'exact':
            return computeExactMatch(value, overrideValue);
        case 'is_not':
            return !computeExactMatch(value, overrideValue);
        case 'is_set':
            return key in propertyValues;
        case 'icontains':
            return String(overrideValue).toLowerCase().includes(String(value).toLowerCase());
        case 'not_icontains':
            return !String(overrideValue).toLowerCase().includes(String(value).toLowerCase());
        case 'regex':
            return isValidRegex(String(value)) && null !== String(overrideValue).match(String(value));
        case 'not_regex':
            return isValidRegex(String(value)) && null === String(overrideValue).match(String(value));
        case 'gt':
        case 'gte':
        case 'lt':
        case 'lte':
            {
                let parsedValue = 'number' == typeof value ? value : null;
                if ('string' == typeof value) try {
                    parsedValue = parseFloat(value);
                } catch (err) {}
                if (null == parsedValue || null == overrideValue) return compare(String(overrideValue), String(value), operator);
                if ('string' == typeof overrideValue) return compare(overrideValue, String(value), operator);
                return compare(overrideValue, parsedValue, operator);
            }
        case 'is_date_after':
        case 'is_date_before':
            {
                if ('boolean' == typeof value) throw new InconclusiveMatchError("Date operations cannot be performed on boolean values");
                let parsedDate = relativeDateParseForFeatureFlagMatching(String(value));
                if (null == parsedDate) parsedDate = convertToDateTime(value);
                if (null == parsedDate) throw new InconclusiveMatchError(`Invalid date: ${value}`);
                const overrideDate = convertToDateTime(overrideValue);
                if ([
                    'is_date_before'
                ].includes(operator)) return overrideDate < parsedDate;
                return overrideDate > parsedDate;
            }
        default:
            throw new InconclusiveMatchError(`Unknown operator: ${operator}`);
    }
}
function checkCohortExists(cohortId, cohortProperties) {
    if (!(cohortId in cohortProperties)) throw new RequiresServerEvaluation(`cohort ${cohortId} not found in local cohorts - likely a static cohort that requires server evaluation`);
}
function matchCohort(property, propertyValues, cohortProperties, debugMode = false) {
    const cohortId = String(property.value);
    checkCohortExists(cohortId, cohortProperties);
    const propertyGroup = cohortProperties[cohortId];
    return matchPropertyGroup(propertyGroup, propertyValues, cohortProperties, debugMode);
}
function matchPropertyGroup(propertyGroup, propertyValues, cohortProperties, debugMode = false) {
    if (!propertyGroup) return true;
    const propertyGroupType = propertyGroup.type;
    const properties = propertyGroup.values;
    if (!properties || 0 === properties.length) return true;
    let errorMatchingLocally = false;
    if ('values' in properties[0]) {
        for (const prop of properties)try {
            const matches = matchPropertyGroup(prop, propertyValues, cohortProperties, debugMode);
            if ('AND' === propertyGroupType) {
                if (!matches) return false;
            } else if (matches) return true;
        } catch (err) {
            if (err instanceof RequiresServerEvaluation) throw err;
            if (err instanceof InconclusiveMatchError) {
                if (debugMode) console.debug(`Failed to compute property ${prop} locally: ${err}`);
                errorMatchingLocally = true;
            } else throw err;
        }
        if (errorMatchingLocally) throw new InconclusiveMatchError("Can't match cohort without a given cohort property value");
        return 'AND' === propertyGroupType;
    }
    for (const prop of properties)try {
        let matches;
        if ('cohort' === prop.type) matches = matchCohort(prop, propertyValues, cohortProperties, debugMode);
        else if ('flag' === prop.type) {
            if (debugMode) console.warn(`[FEATURE FLAGS] Flag dependency filters are not supported in local evaluation. Skipping condition with dependency on flag '${prop.key || 'unknown'}'`);
            continue;
        } else matches = matchProperty(prop, propertyValues);
        const negation = prop.negation || false;
        if ('AND' === propertyGroupType) {
            if (!matches && !negation) return false;
            if (matches && negation) return false;
        } else {
            if (matches && !negation) return true;
            if (!matches && negation) return true;
        }
    } catch (err) {
        if (err instanceof RequiresServerEvaluation) throw err;
        if (err instanceof InconclusiveMatchError) {
            if (debugMode) console.debug(`Failed to compute property ${prop} locally: ${err}`);
            errorMatchingLocally = true;
        } else throw err;
    }
    if (errorMatchingLocally) throw new InconclusiveMatchError("can't match cohort without a given cohort property value");
    return 'AND' === propertyGroupType;
}
function isValidRegex(regex) {
    try {
        new RegExp(regex);
        return true;
    } catch (err) {
        return false;
    }
}
function convertToDateTime(value) {
    if (value instanceof Date) return value;
    if ('string' == typeof value || 'number' == typeof value) {
        const date = new Date(value);
        if (!isNaN(date.valueOf())) return date;
        throw new InconclusiveMatchError(`${value} is in an invalid date format`);
    }
    throw new InconclusiveMatchError(`The date provided ${value} must be a string, number, or date object`);
}
function relativeDateParseForFeatureFlagMatching(value) {
    const regex = /^-?(?<number>[0-9]+)(?<interval>[a-z])$/;
    const match = value.match(regex);
    const parsedDt = new Date(new Date().toISOString());
    if (!match) return null;
    {
        if (!match.groups) return null;
        const number = parseInt(match.groups['number']);
        if (number >= 10000) return null;
        const interval = match.groups['interval'];
        if ('h' == interval) parsedDt.setUTCHours(parsedDt.getUTCHours() - number);
        else if ('d' == interval) parsedDt.setUTCDate(parsedDt.getUTCDate() - number);
        else if ('w' == interval) parsedDt.setUTCDate(parsedDt.getUTCDate() - 7 * number);
        else if ('m' == interval) parsedDt.setUTCMonth(parsedDt.getUTCMonth() - number);
        else {
            if ('y' != interval) return null;
            parsedDt.setUTCFullYear(parsedDt.getUTCFullYear() - number);
        }
        return parsedDt;
    }
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/storage-memory.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogMemoryStorage",
    ()=>PostHogMemoryStorage
]);
class PostHogMemoryStorage {
    getProperty(key) {
        return this._memoryStorage[key];
    }
    setProperty(key, value) {
        this._memoryStorage[key] = null !== value ? value : void 0;
    }
    constructor(){
        this._memoryStorage = {};
    }
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/client.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogBackendClient",
    ()=>PostHogBackendClient
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$version$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/version.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core-stateless.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/featureFlagUtils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bot-detection.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$feature$2d$flags$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/feature-flags/feature-flags.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$storage$2d$memory$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/storage-memory.mjs [app-route] (ecmascript)");
;
;
;
;
;
const MINIMUM_POLLING_INTERVAL = 100;
const THIRTY_SECONDS = 30000;
const MAX_CACHE_SIZE = 50000;
class PostHogBackendClient extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogCoreStateless"] {
    constructor(apiKey, options = {}){
        super(apiKey, options), this._memoryStorage = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$storage$2d$memory$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogMemoryStorage"]();
        this.options = options;
        this.options.featureFlagsPollingInterval = 'number' == typeof options.featureFlagsPollingInterval ? Math.max(options.featureFlagsPollingInterval, MINIMUM_POLLING_INTERVAL) : THIRTY_SECONDS;
        if (options.personalApiKey) {
            if (options.personalApiKey.includes('phc_')) throw new Error('Your Personal API key is invalid. These keys are prefixed with "phx_" and can be created in PostHog project settings.');
            const shouldEnableLocalEvaluation = false !== options.enableLocalEvaluation;
            if (shouldEnableLocalEvaluation) this.featureFlagsPoller = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$feature$2d$flags$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["FeatureFlagsPoller"]({
                pollingInterval: this.options.featureFlagsPollingInterval,
                personalApiKey: options.personalApiKey,
                projectApiKey: apiKey,
                timeout: options.requestTimeout ?? 10000,
                host: this.host,
                fetch: options.fetch,
                onError: (err)=>{
                    this._events.emit('error', err);
                },
                onLoad: (count)=>{
                    this._events.emit('localEvaluationFlagsLoaded', count);
                },
                customHeaders: this.getCustomHeaders()
            });
        }
        this.errorTracking = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"](this, options, this._logger);
        this.distinctIdHasSentFlagCalls = {};
        this.maxCacheSize = options.maxCacheSize || MAX_CACHE_SIZE;
    }
    getPersistedProperty(key) {
        return this._memoryStorage.getProperty(key);
    }
    setPersistedProperty(key, value) {
        return this._memoryStorage.setProperty(key, value);
    }
    fetch(url, options) {
        return this.options.fetch ? this.options.fetch(url, options) : fetch(url, options);
    }
    getLibraryVersion() {
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$version$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["version"];
    }
    getCustomUserAgent() {
        return `${this.getLibraryId()}/${this.getLibraryVersion()}`;
    }
    enable() {
        return super.optIn();
    }
    disable() {
        return super.optOut();
    }
    debug(enabled = true) {
        super.debug(enabled);
        this.featureFlagsPoller?.debug(enabled);
    }
    capture(props) {
        if ('string' == typeof props) this._logger.warn('Called capture() with a string as the first argument when an object was expected.');
        this.addPendingPromise(this.prepareEventMessage(props).then(({ distinctId, event, properties, options })=>super.captureStateless(distinctId, event, properties, {
                timestamp: options.timestamp,
                disableGeoip: options.disableGeoip,
                uuid: options.uuid
            })).catch((err)=>{
            if (err) console.error(err);
        }));
    }
    async captureImmediate(props) {
        if ('string' == typeof props) this._logger.warn('Called captureImmediate() with a string as the first argument when an object was expected.');
        return this.addPendingPromise(this.prepareEventMessage(props).then(({ distinctId, event, properties, options })=>super.captureStatelessImmediate(distinctId, event, properties, {
                timestamp: options.timestamp,
                disableGeoip: options.disableGeoip,
                uuid: options.uuid
            })).catch((err)=>{
            if (err) console.error(err);
        }));
    }
    identify({ distinctId, properties, disableGeoip }) {
        const userPropsOnce = properties?.$set_once;
        delete properties?.$set_once;
        const userProps = properties?.$set || properties;
        super.identifyStateless(distinctId, {
            $set: userProps,
            $set_once: userPropsOnce
        }, {
            disableGeoip
        });
    }
    async identifyImmediate({ distinctId, properties, disableGeoip }) {
        const userPropsOnce = properties?.$set_once;
        delete properties?.$set_once;
        const userProps = properties?.$set || properties;
        await super.identifyStatelessImmediate(distinctId, {
            $set: userProps,
            $set_once: userPropsOnce
        }, {
            disableGeoip
        });
    }
    alias(data) {
        super.aliasStateless(data.alias, data.distinctId, void 0, {
            disableGeoip: data.disableGeoip
        });
    }
    async aliasImmediate(data) {
        await super.aliasStatelessImmediate(data.alias, data.distinctId, void 0, {
            disableGeoip: data.disableGeoip
        });
    }
    isLocalEvaluationReady() {
        return this.featureFlagsPoller?.isLocalEvaluationReady() ?? false;
    }
    async waitForLocalEvaluationReady(timeoutMs = THIRTY_SECONDS) {
        if (this.isLocalEvaluationReady()) return true;
        if (void 0 === this.featureFlagsPoller) return false;
        return new Promise((resolve)=>{
            const timeout = setTimeout(()=>{
                cleanup();
                resolve(false);
            }, timeoutMs);
            const cleanup = this._events.on('localEvaluationFlagsLoaded', (count)=>{
                clearTimeout(timeout);
                cleanup();
                resolve(count > 0);
            });
        });
    }
    async getFeatureFlag(key, distinctId, options) {
        const { groups, disableGeoip } = options || {};
        let { onlyEvaluateLocally, sendFeatureFlagEvents, personProperties, groupProperties } = options || {};
        const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
        personProperties = adjustedProperties.allPersonProperties;
        groupProperties = adjustedProperties.allGroupProperties;
        if (void 0 == onlyEvaluateLocally) onlyEvaluateLocally = false;
        if (void 0 == sendFeatureFlagEvents) sendFeatureFlagEvents = this.options.sendFeatureFlagEvent ?? true;
        let response = await this.featureFlagsPoller?.getFeatureFlag(key, distinctId, groups, personProperties, groupProperties);
        const flagWasLocallyEvaluated = void 0 !== response;
        let requestId;
        let flagDetail;
        if (!flagWasLocallyEvaluated && !onlyEvaluateLocally) {
            const remoteResponse = await super.getFeatureFlagDetailStateless(key, distinctId, groups, personProperties, groupProperties, disableGeoip);
            if (void 0 === remoteResponse) return;
            flagDetail = remoteResponse.response;
            response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFeatureFlagValue"])(flagDetail);
            requestId = remoteResponse?.requestId;
        }
        const featureFlagReportedKey = `${key}_${response}`;
        if (sendFeatureFlagEvents && (!(distinctId in this.distinctIdHasSentFlagCalls) || !this.distinctIdHasSentFlagCalls[distinctId].includes(featureFlagReportedKey))) {
            if (Object.keys(this.distinctIdHasSentFlagCalls).length >= this.maxCacheSize) this.distinctIdHasSentFlagCalls = {};
            if (Array.isArray(this.distinctIdHasSentFlagCalls[distinctId])) this.distinctIdHasSentFlagCalls[distinctId].push(featureFlagReportedKey);
            else this.distinctIdHasSentFlagCalls[distinctId] = [
                featureFlagReportedKey
            ];
            this.capture({
                distinctId,
                event: '$feature_flag_called',
                properties: {
                    $feature_flag: key,
                    $feature_flag_response: response,
                    $feature_flag_id: flagDetail?.metadata?.id,
                    $feature_flag_version: flagDetail?.metadata?.version,
                    $feature_flag_reason: flagDetail?.reason?.description ?? flagDetail?.reason?.code,
                    locally_evaluated: flagWasLocallyEvaluated,
                    [`$feature/${key}`]: response,
                    $feature_flag_request_id: requestId
                },
                groups,
                disableGeoip
            });
        }
        return response;
    }
    async getFeatureFlagPayload(key, distinctId, matchValue, options) {
        const { groups, disableGeoip } = options || {};
        let { onlyEvaluateLocally, personProperties, groupProperties } = options || {};
        const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
        personProperties = adjustedProperties.allPersonProperties;
        groupProperties = adjustedProperties.allGroupProperties;
        let response;
        const localEvaluationEnabled = void 0 !== this.featureFlagsPoller;
        if (localEvaluationEnabled) {
            await this.featureFlagsPoller?.loadFeatureFlags();
            const flag = this.featureFlagsPoller?.featureFlagsByKey[key];
            if (flag) try {
                const result = await this.featureFlagsPoller?.computeFlagAndPayloadLocally(flag, distinctId, groups, personProperties, groupProperties, matchValue);
                if (result) {
                    matchValue = result.value;
                    response = result.payload;
                }
            } catch (e) {
                if (e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$feature$2d$flags$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["RequiresServerEvaluation"] || e instanceof __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$feature$2d$flags$2f$feature$2d$flags$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["InconclusiveMatchError"]) this._logger?.info(`${e.name} when computing flag locally: ${flag.key}: ${e.message}`);
                else throw e;
            }
        }
        if (void 0 == onlyEvaluateLocally) onlyEvaluateLocally = false;
        const payloadWasLocallyEvaluated = void 0 !== response;
        if (!payloadWasLocallyEvaluated && !onlyEvaluateLocally) response = await super.getFeatureFlagPayloadStateless(key, distinctId, groups, personProperties, groupProperties, disableGeoip);
        return response;
    }
    async getRemoteConfigPayload(flagKey) {
        if (!this.options.personalApiKey) throw new Error('Personal API key is required for remote config payload decryption');
        const response = await this._requestRemoteConfigPayload(flagKey);
        if (!response) return;
        const parsed = await response.json();
        if ('string' == typeof parsed) try {
            return JSON.parse(parsed);
        } catch (e) {}
        return parsed;
    }
    async isFeatureEnabled(key, distinctId, options) {
        const feat = await this.getFeatureFlag(key, distinctId, options);
        if (void 0 === feat) return;
        return !!feat || false;
    }
    async getAllFlags(distinctId, options) {
        const response = await this.getAllFlagsAndPayloads(distinctId, options);
        return response.featureFlags || {};
    }
    async getAllFlagsAndPayloads(distinctId, options) {
        const { groups, disableGeoip, flagKeys } = options || {};
        let { onlyEvaluateLocally, personProperties, groupProperties } = options || {};
        const adjustedProperties = this.addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties);
        personProperties = adjustedProperties.allPersonProperties;
        groupProperties = adjustedProperties.allGroupProperties;
        if (void 0 == onlyEvaluateLocally) onlyEvaluateLocally = false;
        const localEvaluationResult = await this.featureFlagsPoller?.getAllFlagsAndPayloads(distinctId, groups, personProperties, groupProperties, flagKeys);
        let featureFlags = {};
        let featureFlagPayloads = {};
        let fallbackToFlags = true;
        if (localEvaluationResult) {
            featureFlags = localEvaluationResult.response;
            featureFlagPayloads = localEvaluationResult.payloads;
            fallbackToFlags = localEvaluationResult.fallbackToFlags;
        }
        if (fallbackToFlags && !onlyEvaluateLocally) {
            const remoteEvaluationResult = await super.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, flagKeys);
            featureFlags = {
                ...featureFlags,
                ...remoteEvaluationResult.flags || {}
            };
            featureFlagPayloads = {
                ...featureFlagPayloads,
                ...remoteEvaluationResult.payloads || {}
            };
        }
        return {
            featureFlags,
            featureFlagPayloads
        };
    }
    groupIdentify({ groupType, groupKey, properties, distinctId, disableGeoip }) {
        super.groupIdentifyStateless(groupType, groupKey, properties, {
            disableGeoip
        }, distinctId);
    }
    async reloadFeatureFlags() {
        await this.featureFlagsPoller?.loadFeatureFlags(true);
    }
    async _shutdown(shutdownTimeoutMs) {
        this.featureFlagsPoller?.stopPoller();
        this.errorTracking.shutdown();
        return super._shutdown(shutdownTimeoutMs);
    }
    async _requestRemoteConfigPayload(flagKey) {
        if (!this.options.personalApiKey) return;
        const url = `${this.host}/api/projects/@current/feature_flags/${flagKey}/remote_config?token=${encodeURIComponent(this.apiKey)}`;
        const options = {
            method: 'GET',
            headers: {
                ...this.getCustomHeaders(),
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.options.personalApiKey}`
            }
        };
        let abortTimeout = null;
        if (this.options.requestTimeout && 'number' == typeof this.options.requestTimeout) {
            const controller = new AbortController();
            abortTimeout = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["safeSetTimeout"])(()=>{
                controller.abort();
            }, this.options.requestTimeout);
            options.signal = controller.signal;
        }
        try {
            return await this.fetch(url, options);
        } catch (error) {
            this._events.emit('error', error);
            return;
        } finally{
            if (abortTimeout) clearTimeout(abortTimeout);
        }
    }
    extractPropertiesFromEvent(eventProperties, groups) {
        if (!eventProperties) return {
            personProperties: {},
            groupProperties: {}
        };
        const personProperties = {};
        const groupProperties = {};
        for (const [key, value] of Object.entries(eventProperties))if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainObject"])(value) && groups && key in groups) {
            const groupProps = {};
            for (const [groupKey, groupValue] of Object.entries(value))groupProps[String(groupKey)] = String(groupValue);
            groupProperties[String(key)] = groupProps;
        } else personProperties[String(key)] = String(value);
        return {
            personProperties,
            groupProperties
        };
    }
    async getFeatureFlagsForEvent(distinctId, groups, disableGeoip, sendFeatureFlagsOptions) {
        const finalPersonProperties = sendFeatureFlagsOptions?.personProperties || {};
        const finalGroupProperties = sendFeatureFlagsOptions?.groupProperties || {};
        const flagKeys = sendFeatureFlagsOptions?.flagKeys;
        const onlyEvaluateLocally = sendFeatureFlagsOptions?.onlyEvaluateLocally ?? false;
        if (onlyEvaluateLocally) if (!((this.featureFlagsPoller?.featureFlags?.length || 0) > 0)) return {};
        else {
            const groupsWithStringValues = {};
            for (const [key, value] of Object.entries(groups || {}))groupsWithStringValues[key] = String(value);
            return await this.getAllFlags(distinctId, {
                groups: groupsWithStringValues,
                personProperties: finalPersonProperties,
                groupProperties: finalGroupProperties,
                disableGeoip,
                onlyEvaluateLocally: true,
                flagKeys
            });
        }
        if ((this.featureFlagsPoller?.featureFlags?.length || 0) > 0) {
            const groupsWithStringValues = {};
            for (const [key, value] of Object.entries(groups || {}))groupsWithStringValues[key] = String(value);
            return await this.getAllFlags(distinctId, {
                groups: groupsWithStringValues,
                personProperties: finalPersonProperties,
                groupProperties: finalGroupProperties,
                disableGeoip,
                onlyEvaluateLocally: true,
                flagKeys
            });
        }
        return (await super.getFeatureFlagsStateless(distinctId, groups, finalPersonProperties, finalGroupProperties, disableGeoip)).flags;
    }
    addLocalPersonAndGroupProperties(distinctId, groups, personProperties, groupProperties) {
        const allPersonProperties = {
            distinct_id: distinctId,
            ...personProperties || {}
        };
        const allGroupProperties = {};
        if (groups) for (const groupName of Object.keys(groups))allGroupProperties[groupName] = {
            $group_key: groups[groupName],
            ...groupProperties?.[groupName] || {}
        };
        return {
            allPersonProperties,
            allGroupProperties
        };
    }
    captureException(error, distinctId, additionalProperties) {
        const syntheticException = new Error('PostHog syntheticException');
        this.addPendingPromise(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].buildEventMessage(error, {
            syntheticException
        }, distinctId, additionalProperties).then((msg)=>this.capture(msg)));
    }
    async captureExceptionImmediate(error, distinctId, additionalProperties) {
        const syntheticException = new Error('PostHog syntheticException');
        this.addPendingPromise(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].buildEventMessage(error, {
            syntheticException
        }, distinctId, additionalProperties).then((msg)=>this.captureImmediate(msg)));
    }
    async prepareEventMessage(props) {
        const { distinctId, event, properties, groups, sendFeatureFlags, timestamp, disableGeoip, uuid } = props;
        const eventMessage = this._runBeforeSend({
            distinctId,
            event,
            properties,
            groups,
            sendFeatureFlags,
            timestamp,
            disableGeoip,
            uuid
        });
        if (!eventMessage) return Promise.reject(null);
        const eventProperties = await Promise.resolve().then(async ()=>{
            if (sendFeatureFlags) {
                const sendFeatureFlagsOptions = 'object' == typeof sendFeatureFlags ? sendFeatureFlags : void 0;
                return await this.getFeatureFlagsForEvent(distinctId, groups, disableGeoip, sendFeatureFlagsOptions);
            }
            return {};
        }).then((flags)=>{
            const additionalProperties = {};
            if (flags) for (const [feature, variant] of Object.entries(flags))additionalProperties[`$feature/${feature}`] = variant;
            const activeFlags = Object.keys(flags || {}).filter((flag)=>flags?.[flag] !== false).sort();
            if (activeFlags.length > 0) additionalProperties['$active_feature_flags'] = activeFlags;
            return additionalProperties;
        }).catch(()=>({})).then((additionalProperties)=>{
            const props = {
                ...additionalProperties,
                ...eventMessage.properties || {},
                $groups: eventMessage.groups || groups
            };
            return props;
        });
        if ('$pageview' === eventMessage.event && this.options.__preview_capture_bot_pageviews && 'string' == typeof eventProperties.$raw_user_agent) {
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBlockedUA"])(eventProperties.$raw_user_agent, this.options.custom_blocked_useragents || [])) {
                eventMessage.event = '$bot_pageview';
                eventProperties.$browser_type = 'bot';
            }
        }
        return {
            distinctId: eventMessage.distinctId,
            event: eventMessage.event,
            properties: eventProperties,
            options: {
                timestamp: eventMessage.timestamp,
                disableGeoip: eventMessage.disableGeoip,
                uuid: eventMessage.uuid
            }
        };
    }
    _runBeforeSend(eventMessage) {
        const beforeSend = this.options.before_send;
        if (!beforeSend) return eventMessage;
        const fns = Array.isArray(beforeSend) ? beforeSend : [
            beforeSend
        ];
        let result = eventMessage;
        for (const fn of fns){
            result = fn(result);
            if (!result) {
                this._logger.info(`Event '${eventMessage.event}' was rejected in beforeSend function`);
                return null;
            }
            if (!result.properties || 0 === Object.keys(result.properties).length) {
                const message = `Event '${result.event}' has no properties after beforeSend function, this is likely an error.`;
                this._logger.warn(message);
            }
        }
        return result;
    }
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/sentry-integration.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogSentryIntegration",
    ()=>PostHogSentryIntegration,
    "createEventProcessor",
    ()=>createEventProcessor,
    "sentryIntegration",
    ()=>sentryIntegration
]);
const NAME = 'posthog-node';
function createEventProcessor(_posthog, { organization, projectId, prefix, severityAllowList = [
    'error'
], sendExceptionsToPostHog = true } = {}) {
    return (event)=>{
        const shouldProcessLevel = '*' === severityAllowList || severityAllowList.includes(event.level);
        if (!shouldProcessLevel) return event;
        if (!event.tags) event.tags = {};
        const userId = event.tags[PostHogSentryIntegration.POSTHOG_ID_TAG];
        if (void 0 === userId) return event;
        const uiHost = _posthog.options.host ?? 'https://us.i.posthog.com';
        const personUrl = new URL(`/project/${_posthog.apiKey}/person/${userId}`, uiHost).toString();
        event.tags['PostHog Person URL'] = personUrl;
        const exceptions = event.exception?.values || [];
        const exceptionList = exceptions.map((exception)=>({
                ...exception,
                stacktrace: exception.stacktrace ? {
                    ...exception.stacktrace,
                    type: 'raw',
                    frames: (exception.stacktrace.frames || []).map((frame)=>({
                            ...frame,
                            platform: "node:javascript"
                        }))
                } : void 0
            }));
        const properties = {
            $exception_message: exceptions[0]?.value || event.message,
            $exception_type: exceptions[0]?.type,
            $exception_level: event.level,
            $exception_list: exceptionList,
            $sentry_event_id: event.event_id,
            $sentry_exception: event.exception,
            $sentry_exception_message: exceptions[0]?.value || event.message,
            $sentry_exception_type: exceptions[0]?.type,
            $sentry_tags: event.tags
        };
        if (organization && projectId) properties['$sentry_url'] = (prefix || 'https://sentry.io/organizations/') + organization + '/issues/?project=' + projectId + '&query=' + event.event_id;
        if (sendExceptionsToPostHog) _posthog.capture({
            event: '$exception',
            distinctId: userId,
            properties
        });
        return event;
    };
}
function sentryIntegration(_posthog, options) {
    const processor = createEventProcessor(_posthog, options);
    return {
        name: NAME,
        processEvent (event) {
            return processor(event);
        }
    };
}
class PostHogSentryIntegration {
    static #_ = this.POSTHOG_ID_TAG = 'posthog_distinct_id';
    constructor(_posthog, organization, prefix, severityAllowList, sendExceptionsToPostHog){
        this.name = NAME;
        this.name = NAME;
        this.setupOnce = function(addGlobalEventProcessor, getCurrentHub) {
            const projectId = getCurrentHub()?.getClient()?.getDsn()?.projectId;
            addGlobalEventProcessor(createEventProcessor(_posthog, {
                organization,
                projectId,
                prefix,
                severityAllowList,
                sendExceptionsToPostHog: sendExceptionsToPostHog ?? true
            }));
        };
    }
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/express.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "setupExpressErrorHandler",
    ()=>setupExpressErrorHandler
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/index.mjs [app-route] (ecmascript)");
;
;
function setupExpressErrorHandler(_posthog, app) {
    app.use((error, _, __, next)=>{
        const hint = {
            mechanism: {
                type: 'middleware',
                handled: false
            }
        };
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].buildEventMessage(error, hint, (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])(), {
            $process_person_profile: false
        }).then((msg)=>_posthog.capture(msg));
        next(error);
    });
}
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/types.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/exports.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$sentry$2d$integration$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/sentry-integration.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$express$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/express.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/types.mjs [app-route] (ecmascript)");
;
;
;
}),
"[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/entrypoints/index.node.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHog",
    ()=>PostHog
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$modifiers$2f$module$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/module.node.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$modifiers$2f$context$2d$lines$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/modifiers/context-lines.node.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/extensions/error-tracking/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/client.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <export * as ErrorTracking>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$exports$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/posthog-node@5.11.2/node_modules/posthog-node/dist/exports.mjs [app-route] (ecmascript) <locals>");
;
;
;
;
;
;
__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].errorPropertiesBuilder = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].ErrorPropertiesBuilder([
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].EventCoercer(),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].ErrorCoercer(),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].ObjectCoercer(),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].StringCoercer(),
    new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].PrimitiveCoercer()
], [
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$export__$2a$__as__ErrorTracking$3e$__["ErrorTracking"].nodeStackLineParser
], [
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$modifiers$2f$module$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createModulerModifier"])(),
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$extensions$2f$error$2d$tracking$2f$modifiers$2f$context$2d$lines$2e$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["addSourceContext"]
]);
class PostHog extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f$posthog$2d$node$40$5$2e$11$2e$2$2f$node_modules$2f$posthog$2d$node$2f$dist$2f$client$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogBackendClient"] {
    getLibraryId() {
        return 'posthog-node';
    }
}
;
}),
];

//# sourceMappingURL=ca656_posthog-node_dist_3b607d51._.js.map