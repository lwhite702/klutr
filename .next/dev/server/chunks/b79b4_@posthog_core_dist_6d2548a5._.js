module.exports = [
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/featureFlagUtils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createFlagsResponseFromFlagsAndPayloads",
    ()=>createFlagsResponseFromFlagsAndPayloads,
    "getFeatureFlagValue",
    ()=>getFeatureFlagValue,
    "getFlagDetailsFromFlagsAndPayloads",
    ()=>getFlagDetailsFromFlagsAndPayloads,
    "getFlagValuesFromFlags",
    ()=>getFlagValuesFromFlags,
    "getPayloadsFromFlags",
    ()=>getPayloadsFromFlags,
    "normalizeFlagsResponse",
    ()=>normalizeFlagsResponse,
    "parsePayload",
    ()=>parsePayload,
    "updateFlagValue",
    ()=>updateFlagValue
]);
const normalizeFlagsResponse = (flagsResponse)=>{
    if ('flags' in flagsResponse) {
        const featureFlags = getFlagValuesFromFlags(flagsResponse.flags);
        const featureFlagPayloads = getPayloadsFromFlags(flagsResponse.flags);
        return {
            ...flagsResponse,
            featureFlags,
            featureFlagPayloads
        };
    }
    {
        const featureFlags = flagsResponse.featureFlags ?? {};
        const featureFlagPayloads = Object.fromEntries(Object.entries(flagsResponse.featureFlagPayloads || {}).map(([k, v])=>[
                k,
                parsePayload(v)
            ]));
        const flags = Object.fromEntries(Object.entries(featureFlags).map(([key, value])=>[
                key,
                getFlagDetailFromFlagAndPayload(key, value, featureFlagPayloads[key])
            ]));
        return {
            ...flagsResponse,
            featureFlags,
            featureFlagPayloads,
            flags
        };
    }
};
function getFlagDetailFromFlagAndPayload(key, value, payload) {
    return {
        key: key,
        enabled: 'string' == typeof value ? true : value,
        variant: 'string' == typeof value ? value : void 0,
        reason: void 0,
        metadata: {
            id: void 0,
            version: void 0,
            payload: payload ? JSON.stringify(payload) : void 0,
            description: void 0
        }
    };
}
const getFlagValuesFromFlags = (flags)=>Object.fromEntries(Object.entries(flags ?? {}).map(([key, detail])=>[
            key,
            getFeatureFlagValue(detail)
        ]).filter(([, value])=>void 0 !== value));
const getPayloadsFromFlags = (flags)=>{
    const safeFlags = flags ?? {};
    return Object.fromEntries(Object.keys(safeFlags).filter((flag)=>{
        const details = safeFlags[flag];
        return details.enabled && details.metadata && void 0 !== details.metadata.payload;
    }).map((flag)=>{
        const payload = safeFlags[flag].metadata?.payload;
        return [
            flag,
            payload ? parsePayload(payload) : void 0
        ];
    }));
};
const getFlagDetailsFromFlagsAndPayloads = (flagsResponse)=>{
    const flags = flagsResponse.featureFlags ?? {};
    const payloads = flagsResponse.featureFlagPayloads ?? {};
    return Object.fromEntries(Object.entries(flags).map(([key, value])=>[
            key,
            {
                key: key,
                enabled: 'string' == typeof value ? true : value,
                variant: 'string' == typeof value ? value : void 0,
                reason: void 0,
                metadata: {
                    id: void 0,
                    version: void 0,
                    payload: payloads?.[key] ? JSON.stringify(payloads[key]) : void 0,
                    description: void 0
                }
            }
        ]));
};
const getFeatureFlagValue = (detail)=>void 0 === detail ? void 0 : detail.variant ?? detail.enabled;
const parsePayload = (response)=>{
    if ('string' != typeof response) return response;
    try {
        return JSON.parse(response);
    } catch  {
        return response;
    }
};
const createFlagsResponseFromFlagsAndPayloads = (featureFlags, featureFlagPayloads)=>{
    const allKeys = [
        ...new Set([
            ...Object.keys(featureFlags ?? {}),
            ...Object.keys(featureFlagPayloads ?? {})
        ])
    ];
    const enabledFlags = allKeys.filter((flag)=>!!featureFlags[flag] || !!featureFlagPayloads[flag]).reduce((res, key)=>(res[key] = featureFlags[key] ?? true, res), {});
    const flagDetails = {
        featureFlags: enabledFlags,
        featureFlagPayloads: featureFlagPayloads ?? {}
    };
    return normalizeFlagsResponse(flagDetails);
};
const updateFlagValue = (flag, value)=>({
        ...flag,
        enabled: getEnabledFromValue(value),
        variant: getVariantFromValue(value)
    });
function getEnabledFromValue(value) {
    return 'string' == typeof value ? true : value;
}
function getVariantFromValue(value) {
    return 'string' == typeof value ? value : void 0;
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

/*! For license information please see uuidv7.mjs.LICENSE.txt */ /**
 * uuidv7: An experimental implementation of the proposed UUID Version 7
 *
 * @license Apache-2.0
 * @copyright 2021-2023 LiosK
 * @packageDocumentation
 */ __turbopack_context__.s([
    "UUID",
    ()=>UUID,
    "V7Generator",
    ()=>V7Generator,
    "uuidv4",
    ()=>uuidv4,
    "uuidv4obj",
    ()=>uuidv4obj,
    "uuidv7",
    ()=>uuidv7,
    "uuidv7obj",
    ()=>uuidv7obj
]);
const DIGITS = "0123456789abcdef";
class UUID {
    constructor(bytes){
        this.bytes = bytes;
    }
    static ofInner(bytes) {
        if (16 === bytes.length) return new UUID(bytes);
        throw new TypeError("not 128-bit length");
    }
    static fromFieldsV7(unixTsMs, randA, randBHi, randBLo) {
        if (!Number.isInteger(unixTsMs) || !Number.isInteger(randA) || !Number.isInteger(randBHi) || !Number.isInteger(randBLo) || unixTsMs < 0 || randA < 0 || randBHi < 0 || randBLo < 0 || unixTsMs > 0xffffffffffff || randA > 0xfff || randBHi > 0x3fffffff || randBLo > 0xffffffff) throw new RangeError("invalid field value");
        const bytes = new Uint8Array(16);
        bytes[0] = unixTsMs / 2 ** 40;
        bytes[1] = unixTsMs / 2 ** 32;
        bytes[2] = unixTsMs / 2 ** 24;
        bytes[3] = unixTsMs / 2 ** 16;
        bytes[4] = unixTsMs / 256;
        bytes[5] = unixTsMs;
        bytes[6] = 0x70 | randA >>> 8;
        bytes[7] = randA;
        bytes[8] = 0x80 | randBHi >>> 24;
        bytes[9] = randBHi >>> 16;
        bytes[10] = randBHi >>> 8;
        bytes[11] = randBHi;
        bytes[12] = randBLo >>> 24;
        bytes[13] = randBLo >>> 16;
        bytes[14] = randBLo >>> 8;
        bytes[15] = randBLo;
        return new UUID(bytes);
    }
    static parse(uuid) {
        let hex;
        switch(uuid.length){
            case 32:
                hex = /^[0-9a-f]{32}$/i.exec(uuid)?.[0];
                break;
            case 36:
                hex = /^([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(uuid)?.slice(1, 6).join("");
                break;
            case 38:
                hex = /^\{([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})\}$/i.exec(uuid)?.slice(1, 6).join("");
                break;
            case 45:
                hex = /^urn:uuid:([0-9a-f]{8})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{4})-([0-9a-f]{12})$/i.exec(uuid)?.slice(1, 6).join("");
                break;
            default:
                break;
        }
        if (hex) {
            const inner = new Uint8Array(16);
            for(let i = 0; i < 16; i += 4){
                const n = parseInt(hex.substring(2 * i, 2 * i + 8), 16);
                inner[i + 0] = n >>> 24;
                inner[i + 1] = n >>> 16;
                inner[i + 2] = n >>> 8;
                inner[i + 3] = n;
            }
            return new UUID(inner);
        }
        throw new SyntaxError("could not parse UUID string");
    }
    toString() {
        let text = "";
        for(let i = 0; i < this.bytes.length; i++){
            text += DIGITS.charAt(this.bytes[i] >>> 4);
            text += DIGITS.charAt(0xf & this.bytes[i]);
            if (3 === i || 5 === i || 7 === i || 9 === i) text += "-";
        }
        return text;
    }
    toHex() {
        let text = "";
        for(let i = 0; i < this.bytes.length; i++){
            text += DIGITS.charAt(this.bytes[i] >>> 4);
            text += DIGITS.charAt(0xf & this.bytes[i]);
        }
        return text;
    }
    toJSON() {
        return this.toString();
    }
    getVariant() {
        const n = this.bytes[8] >>> 4;
        if (n < 0) throw new Error("unreachable");
        if (n <= 7) return this.bytes.every((e)=>0 === e) ? "NIL" : "VAR_0";
        if (n <= 11) return "VAR_10";
        if (n <= 13) return "VAR_110";
        if (n <= 15) return this.bytes.every((e)=>0xff === e) ? "MAX" : "VAR_RESERVED";
        else throw new Error("unreachable");
    }
    getVersion() {
        return "VAR_10" === this.getVariant() ? this.bytes[6] >>> 4 : void 0;
    }
    clone() {
        return new UUID(this.bytes.slice(0));
    }
    equals(other) {
        return 0 === this.compareTo(other);
    }
    compareTo(other) {
        for(let i = 0; i < 16; i++){
            const diff = this.bytes[i] - other.bytes[i];
            if (0 !== diff) return Math.sign(diff);
        }
        return 0;
    }
}
class V7Generator {
    constructor(randomNumberGenerator){
        this.timestamp = 0;
        this.counter = 0;
        this.random = randomNumberGenerator ?? getDefaultRandom();
    }
    generate() {
        return this.generateOrResetCore(Date.now(), 10000);
    }
    generateOrAbort() {
        return this.generateOrAbortCore(Date.now(), 10000);
    }
    generateOrResetCore(unixTsMs, rollbackAllowance) {
        let value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
        if (void 0 === value) {
            this.timestamp = 0;
            value = this.generateOrAbortCore(unixTsMs, rollbackAllowance);
        }
        return value;
    }
    generateOrAbortCore(unixTsMs, rollbackAllowance) {
        const MAX_COUNTER = 0x3ffffffffff;
        if (!Number.isInteger(unixTsMs) || unixTsMs < 1 || unixTsMs > 0xffffffffffff) throw new RangeError("`unixTsMs` must be a 48-bit positive integer");
        if (rollbackAllowance < 0 || rollbackAllowance > 0xffffffffffff) throw new RangeError("`rollbackAllowance` out of reasonable range");
        if (unixTsMs > this.timestamp) {
            this.timestamp = unixTsMs;
            this.resetCounter();
        } else {
            if (!(unixTsMs + rollbackAllowance >= this.timestamp)) return;
            this.counter++;
            if (this.counter > MAX_COUNTER) {
                this.timestamp++;
                this.resetCounter();
            }
        }
        return UUID.fromFieldsV7(this.timestamp, Math.trunc(this.counter / 2 ** 30), this.counter & 2 ** 30 - 1, this.random.nextUint32());
    }
    resetCounter() {
        this.counter = 0x400 * this.random.nextUint32() + (0x3ff & this.random.nextUint32());
    }
    generateV4() {
        const bytes = new Uint8Array(Uint32Array.of(this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32(), this.random.nextUint32()).buffer);
        bytes[6] = 0x40 | bytes[6] >>> 4;
        bytes[8] = 0x80 | bytes[8] >>> 2;
        return UUID.ofInner(bytes);
    }
}
const getDefaultRandom = ()=>({
        nextUint32: ()=>0x10000 * Math.trunc(0x10000 * Math.random()) + Math.trunc(0x10000 * Math.random())
    });
let defaultGenerator;
const uuidv7 = ()=>uuidv7obj().toString();
const uuidv7obj = ()=>(defaultGenerator || (defaultGenerator = new V7Generator())).generate();
const uuidv4 = ()=>uuidv4obj().toString();
const uuidv4obj = ()=>(defaultGenerator || (defaultGenerator = new V7Generator())).generateV4();
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bot-detection.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DEFAULT_BLOCKED_UA_STRS",
    ()=>DEFAULT_BLOCKED_UA_STRS,
    "isBlockedUA",
    ()=>isBlockedUA
]);
const DEFAULT_BLOCKED_UA_STRS = [
    'amazonbot',
    'amazonproductbot',
    'app.hypefactors.com',
    'applebot',
    'archive.org_bot',
    'awariobot',
    'backlinksextendedbot',
    'baiduspider',
    'bingbot',
    'bingpreview',
    'chrome-lighthouse',
    'dataforseobot',
    'deepscan',
    'duckduckbot',
    'facebookexternal',
    'facebookcatalog',
    'http://yandex.com/bots',
    'hubspot',
    'ia_archiver',
    'leikibot',
    'linkedinbot',
    'meta-externalagent',
    'mj12bot',
    'msnbot',
    'nessus',
    'petalbot',
    'pinterest',
    'prerender',
    'rogerbot',
    'screaming frog',
    'sebot-wa',
    'sitebulb',
    'slackbot',
    'slurp',
    'trendictionbot',
    'turnitin',
    'twitterbot',
    'vercel-screenshot',
    'vercelbot',
    'yahoo! slurp',
    'yandexbot',
    'zoombot',
    'bot.htm',
    'bot.php',
    '(bot;',
    'bot/',
    'crawler',
    'ahrefsbot',
    'ahrefssiteaudit',
    'semrushbot',
    'siteauditbot',
    'splitsignalbot',
    'gptbot',
    'oai-searchbot',
    'chatgpt-user',
    'perplexitybot',
    'better uptime bot',
    'sentryuptimebot',
    'uptimerobot',
    'headlesschrome',
    'cypress',
    'google-hoteladsverifier',
    'adsbot-google',
    'apis-google',
    'duplexweb-google',
    'feedfetcher-google',
    'google favicon',
    'google web preview',
    'google-read-aloud',
    'googlebot',
    'googleother',
    'google-cloudvertexbot',
    'googleweblight',
    'mediapartners-google',
    'storebot-google',
    'google-inspectiontool',
    'bytespider'
];
const isBlockedUA = function(ua, customBlockedUserAgents = []) {
    if (!ua) return false;
    const uaLower = ua.toLowerCase();
    return DEFAULT_BLOCKED_UA_STRS.concat(customBlockedUserAgents).some((blockedUA)=>{
        const blockedUaLower = blockedUA.toLowerCase();
        return -1 !== uaLower.indexOf(blockedUaLower);
    });
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/types.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ActionStepStringMatching",
    ()=>types_ActionStepStringMatching,
    "Compression",
    ()=>types_Compression,
    "PostHogPersistedProperty",
    ()=>types_PostHogPersistedProperty,
    "SurveyMatchType",
    ()=>types_SurveyMatchType,
    "SurveyPosition",
    ()=>types_SurveyPosition,
    "SurveyQuestionBranchingType",
    ()=>types_SurveyQuestionBranchingType,
    "SurveyQuestionDescriptionContentType",
    ()=>types_SurveyQuestionDescriptionContentType,
    "SurveyQuestionType",
    ()=>types_SurveyQuestionType,
    "SurveyRatingDisplay",
    ()=>types_SurveyRatingDisplay,
    "SurveyType",
    ()=>types_SurveyType,
    "SurveyWidgetType",
    ()=>types_SurveyWidgetType,
    "knownUnsafeEditableEvent",
    ()=>knownUnsafeEditableEvent
]);
var types_PostHogPersistedProperty = /*#__PURE__*/ function(PostHogPersistedProperty) {
    PostHogPersistedProperty["AnonymousId"] = "anonymous_id";
    PostHogPersistedProperty["DistinctId"] = "distinct_id";
    PostHogPersistedProperty["Props"] = "props";
    PostHogPersistedProperty["FeatureFlagDetails"] = "feature_flag_details";
    PostHogPersistedProperty["FeatureFlags"] = "feature_flags";
    PostHogPersistedProperty["FeatureFlagPayloads"] = "feature_flag_payloads";
    PostHogPersistedProperty["BootstrapFeatureFlagDetails"] = "bootstrap_feature_flag_details";
    PostHogPersistedProperty["BootstrapFeatureFlags"] = "bootstrap_feature_flags";
    PostHogPersistedProperty["BootstrapFeatureFlagPayloads"] = "bootstrap_feature_flag_payloads";
    PostHogPersistedProperty["OverrideFeatureFlags"] = "override_feature_flags";
    PostHogPersistedProperty["Queue"] = "queue";
    PostHogPersistedProperty["OptedOut"] = "opted_out";
    PostHogPersistedProperty["SessionId"] = "session_id";
    PostHogPersistedProperty["SessionStartTimestamp"] = "session_start_timestamp";
    PostHogPersistedProperty["SessionLastTimestamp"] = "session_timestamp";
    PostHogPersistedProperty["PersonProperties"] = "person_properties";
    PostHogPersistedProperty["GroupProperties"] = "group_properties";
    PostHogPersistedProperty["InstalledAppBuild"] = "installed_app_build";
    PostHogPersistedProperty["InstalledAppVersion"] = "installed_app_version";
    PostHogPersistedProperty["SessionReplay"] = "session_replay";
    PostHogPersistedProperty["SurveyLastSeenDate"] = "survey_last_seen_date";
    PostHogPersistedProperty["SurveysSeen"] = "surveys_seen";
    PostHogPersistedProperty["Surveys"] = "surveys";
    PostHogPersistedProperty["RemoteConfig"] = "remote_config";
    PostHogPersistedProperty["FlagsEndpointWasHit"] = "flags_endpoint_was_hit";
    return PostHogPersistedProperty;
}({});
var types_Compression = /*#__PURE__*/ function(Compression) {
    Compression["GZipJS"] = "gzip-js";
    Compression["Base64"] = "base64";
    return Compression;
}({});
var types_SurveyPosition = /*#__PURE__*/ function(SurveyPosition) {
    SurveyPosition["TopLeft"] = "top_left";
    SurveyPosition["TopCenter"] = "top_center";
    SurveyPosition["TopRight"] = "top_right";
    SurveyPosition["MiddleLeft"] = "middle_left";
    SurveyPosition["MiddleCenter"] = "middle_center";
    SurveyPosition["MiddleRight"] = "middle_right";
    SurveyPosition["Left"] = "left";
    SurveyPosition["Right"] = "right";
    SurveyPosition["Center"] = "center";
    return SurveyPosition;
}({});
var types_SurveyWidgetType = /*#__PURE__*/ function(SurveyWidgetType) {
    SurveyWidgetType["Button"] = "button";
    SurveyWidgetType["Tab"] = "tab";
    SurveyWidgetType["Selector"] = "selector";
    return SurveyWidgetType;
}({});
var types_SurveyType = /*#__PURE__*/ function(SurveyType) {
    SurveyType["Popover"] = "popover";
    SurveyType["API"] = "api";
    SurveyType["Widget"] = "widget";
    SurveyType["ExternalSurvey"] = "external_survey";
    return SurveyType;
}({});
var types_SurveyQuestionDescriptionContentType = /*#__PURE__*/ function(SurveyQuestionDescriptionContentType) {
    SurveyQuestionDescriptionContentType["Html"] = "html";
    SurveyQuestionDescriptionContentType["Text"] = "text";
    return SurveyQuestionDescriptionContentType;
}({});
var types_SurveyRatingDisplay = /*#__PURE__*/ function(SurveyRatingDisplay) {
    SurveyRatingDisplay["Number"] = "number";
    SurveyRatingDisplay["Emoji"] = "emoji";
    return SurveyRatingDisplay;
}({});
var types_SurveyQuestionType = /*#__PURE__*/ function(SurveyQuestionType) {
    SurveyQuestionType["Open"] = "open";
    SurveyQuestionType["MultipleChoice"] = "multiple_choice";
    SurveyQuestionType["SingleChoice"] = "single_choice";
    SurveyQuestionType["Rating"] = "rating";
    SurveyQuestionType["Link"] = "link";
    return SurveyQuestionType;
}({});
var types_SurveyQuestionBranchingType = /*#__PURE__*/ function(SurveyQuestionBranchingType) {
    SurveyQuestionBranchingType["NextQuestion"] = "next_question";
    SurveyQuestionBranchingType["End"] = "end";
    SurveyQuestionBranchingType["ResponseBased"] = "response_based";
    SurveyQuestionBranchingType["SpecificQuestion"] = "specific_question";
    return SurveyQuestionBranchingType;
}({});
var types_SurveyMatchType = /*#__PURE__*/ function(SurveyMatchType) {
    SurveyMatchType["Regex"] = "regex";
    SurveyMatchType["NotRegex"] = "not_regex";
    SurveyMatchType["Exact"] = "exact";
    SurveyMatchType["IsNot"] = "is_not";
    SurveyMatchType["Icontains"] = "icontains";
    SurveyMatchType["NotIcontains"] = "not_icontains";
    return SurveyMatchType;
}({});
var types_ActionStepStringMatching = /*#__PURE__*/ function(ActionStepStringMatching) {
    ActionStepStringMatching["Contains"] = "contains";
    ActionStepStringMatching["Exact"] = "exact";
    ActionStepStringMatching["Regex"] = "regex";
    return ActionStepStringMatching;
}({});
const knownUnsafeEditableEvent = [
    '$snapshot',
    '$pageview',
    '$pageleave',
    '$set',
    'survey dismissed',
    'survey sent',
    'survey shown',
    '$identify',
    '$groupidentify',
    '$create_alias',
    '$$client_ingestion_warning',
    '$web_experiment_applied',
    '$feature_enrollment_update',
    '$feature_flag_called'
];
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/string-utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "includes",
    ()=>includes,
    "isDistinctIdStringLike",
    ()=>isDistinctIdStringLike,
    "stripLeadingDollar",
    ()=>stripLeadingDollar,
    "trim",
    ()=>trim
]);
function includes(str, needle) {
    return -1 !== str.indexOf(needle);
}
const trim = function(str) {
    return str.trim();
};
const stripLeadingDollar = function(s) {
    return s.replace(/^\$/, '');
};
function isDistinctIdStringLike(value) {
    return [
        'distinct_id',
        'distinctid'
    ].includes(value.toLowerCase());
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "hasOwnProperty",
    ()=>type_utils_hasOwnProperty,
    "isArray",
    ()=>isArray,
    "isBoolean",
    ()=>isBoolean,
    "isBuiltin",
    ()=>isBuiltin,
    "isEmptyObject",
    ()=>isEmptyObject,
    "isEmptyString",
    ()=>isEmptyString,
    "isError",
    ()=>isError,
    "isErrorEvent",
    ()=>isErrorEvent,
    "isEvent",
    ()=>isEvent,
    "isFile",
    ()=>isFile,
    "isFormData",
    ()=>isFormData,
    "isFunction",
    ()=>isFunction,
    "isInstanceOf",
    ()=>isInstanceOf,
    "isKnownUnsafeEditableEvent",
    ()=>isKnownUnsafeEditableEvent,
    "isNativeFunction",
    ()=>isNativeFunction,
    "isNoLike",
    ()=>isNoLike,
    "isNull",
    ()=>isNull,
    "isNullish",
    ()=>isNullish,
    "isNumber",
    ()=>isNumber,
    "isObject",
    ()=>isObject,
    "isPlainError",
    ()=>isPlainError,
    "isPlainObject",
    ()=>isPlainObject,
    "isPrimitive",
    ()=>isPrimitive,
    "isString",
    ()=>isString,
    "isUndefined",
    ()=>isUndefined,
    "isYesLike",
    ()=>isYesLike,
    "noLikeValues",
    ()=>noLikeValues,
    "yesLikeValues",
    ()=>yesLikeValues
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/string-utils.mjs [app-route] (ecmascript)");
;
;
const nativeIsArray = Array.isArray;
const ObjProto = Object.prototype;
const type_utils_hasOwnProperty = ObjProto.hasOwnProperty;
const type_utils_toString = ObjProto.toString;
const isArray = nativeIsArray || function(obj) {
    return '[object Array]' === type_utils_toString.call(obj);
};
const isFunction = (x)=>'function' == typeof x;
const isNativeFunction = (x)=>isFunction(x) && -1 !== x.toString().indexOf('[native code]');
const isObject = (x)=>x === Object(x) && !isArray(x);
const isEmptyObject = (x)=>{
    if (isObject(x)) {
        for(const key in x)if (type_utils_hasOwnProperty.call(x, key)) return false;
        return true;
    }
    return false;
};
const isUndefined = (x)=>void 0 === x;
const isString = (x)=>'[object String]' == type_utils_toString.call(x);
const isEmptyString = (x)=>isString(x) && 0 === x.trim().length;
const isNull = (x)=>null === x;
const isNullish = (x)=>isUndefined(x) || isNull(x);
const isNumber = (x)=>'[object Number]' == type_utils_toString.call(x);
const isBoolean = (x)=>'[object Boolean]' === type_utils_toString.call(x);
const isFormData = (x)=>x instanceof FormData;
const isFile = (x)=>x instanceof File;
const isPlainError = (x)=>x instanceof Error;
const isKnownUnsafeEditableEvent = (x)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["includes"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["knownUnsafeEditableEvent"], x);
function isInstanceOf(candidate, base) {
    try {
        return candidate instanceof base;
    } catch  {
        return false;
    }
}
function isPrimitive(value) {
    return null === value || 'object' != typeof value;
}
function isBuiltin(candidate, className) {
    return Object.prototype.toString.call(candidate) === `[object ${className}]`;
}
function isError(candidate) {
    switch(Object.prototype.toString.call(candidate)){
        case '[object Error]':
        case '[object Exception]':
        case '[object DOMException]':
        case '[object DOMError]':
        case '[object WebAssembly.Exception]':
            return true;
        default:
            return isInstanceOf(candidate, Error);
    }
}
function isErrorEvent(event) {
    return isBuiltin(event, 'ErrorEvent');
}
function isEvent(candidate) {
    return !isUndefined(Event) && isInstanceOf(candidate, Event);
}
function isPlainObject(candidate) {
    return isBuiltin(candidate, 'Object');
}
const yesLikeValues = [
    true,
    'true',
    1,
    '1',
    'yes'
];
const isYesLike = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["includes"])(yesLikeValues, val);
const noLikeValues = [
    false,
    'false',
    0,
    '0',
    'no'
];
const isNoLike = (val)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["includes"])(noLikeValues, val);
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/number-utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clampToRange",
    ()=>clampToRange
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
function clampToRange(value, min, max, logger, fallbackValue) {
    if (min > max) {
        logger.warn('min cannot be greater than max.');
        min = max;
    }
    if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNumber"])(value)) if (value > max) {
        logger.warn(' cannot be  greater than max: ' + max + '. Using max value instead.');
        return max;
    } else {
        if (!(value < min)) return value;
        logger.warn(' cannot be less than min: ' + min + '. Using min value instead.');
        return min;
    }
    logger.warn(' must be a number. using max or fallback. max: ' + max + ', fallback: ' + fallbackValue);
    return clampToRange(fallbackValue || max, min, max, logger);
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bucketed-rate-limiter.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BucketedRateLimiter",
    ()=>BucketedRateLimiter
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/number-utils.mjs [app-route] (ecmascript)");
;
const ONE_DAY_IN_MS = 86400000;
class BucketedRateLimiter {
    constructor(options){
        this._buckets = {};
        this._onBucketRateLimited = options._onBucketRateLimited;
        this._bucketSize = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clampToRange"])(options.bucketSize, 0, 100, options._logger);
        this._refillRate = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clampToRange"])(options.refillRate, 0, this._bucketSize, options._logger);
        this._refillInterval = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clampToRange"])(options.refillInterval, 0, ONE_DAY_IN_MS, options._logger);
    }
    _applyRefill(bucket, now) {
        const elapsedMs = now - bucket.lastAccess;
        const refillIntervals = Math.floor(elapsedMs / this._refillInterval);
        if (refillIntervals > 0) {
            const tokensToAdd = refillIntervals * this._refillRate;
            bucket.tokens = Math.min(bucket.tokens + tokensToAdd, this._bucketSize);
            bucket.lastAccess = bucket.lastAccess + refillIntervals * this._refillInterval;
        }
    }
    consumeRateLimit(key) {
        const now = Date.now();
        const keyStr = String(key);
        let bucket = this._buckets[keyStr];
        if (bucket) this._applyRefill(bucket, now);
        else {
            bucket = {
                tokens: this._bucketSize,
                lastAccess: now
            };
            this._buckets[keyStr] = bucket;
        }
        if (0 === bucket.tokens) return true;
        bucket.tokens--;
        if (0 === bucket.tokens) this._onBucketRateLimited?.(key);
        return 0 === bucket.tokens;
    }
    stop() {
        this._buckets = {};
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/promise-queue.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PromiseQueue",
    ()=>PromiseQueue
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
;
class PromiseQueue {
    add(promise) {
        const promiseUUID = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])();
        this.promiseByIds[promiseUUID] = promise;
        promise.catch(()=>{}).finally(()=>{
            delete this.promiseByIds[promiseUUID];
        });
        return promise;
    }
    async join() {
        let promises = Object.values(this.promiseByIds);
        let length = promises.length;
        while(length > 0){
            await Promise.all(promises);
            promises = Object.values(this.promiseByIds);
            length = promises.length;
        }
    }
    get length() {
        return Object.keys(this.promiseByIds).length;
    }
    constructor(){
        this.promiseByIds = {};
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STRING_FORMAT",
    ()=>STRING_FORMAT,
    "allSettled",
    ()=>allSettled,
    "assert",
    ()=>assert,
    "currentISOTime",
    ()=>currentISOTime,
    "currentTimestamp",
    ()=>currentTimestamp,
    "getFetch",
    ()=>getFetch,
    "isError",
    ()=>isError,
    "isPromise",
    ()=>isPromise,
    "removeTrailingSlash",
    ()=>removeTrailingSlash,
    "retriable",
    ()=>retriable,
    "safeSetTimeout",
    ()=>safeSetTimeout
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bot-detection.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bucketed$2d$rate$2d$limiter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bucketed-rate-limiter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/number-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/string-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$promise$2d$queue$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/promise-queue.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
const STRING_FORMAT = 'utf8';
function assert(truthyValue, message) {
    if (!truthyValue || 'string' != typeof truthyValue || isEmpty(truthyValue)) throw new Error(message);
}
function isEmpty(truthyValue) {
    if (0 === truthyValue.trim().length) return true;
    return false;
}
function removeTrailingSlash(url) {
    return url?.replace(/\/+$/, '');
}
async function retriable(fn, props) {
    let lastError = null;
    for(let i = 0; i < props.retryCount + 1; i++){
        if (i > 0) await new Promise((r)=>setTimeout(r, props.retryDelay));
        try {
            const res = await fn();
            return res;
        } catch (e) {
            lastError = e;
            if (!props.retryCheck(e)) throw e;
        }
    }
    throw lastError;
}
function currentTimestamp() {
    return new Date().getTime();
}
function currentISOTime() {
    return new Date().toISOString();
}
function safeSetTimeout(fn, timeout) {
    const t = setTimeout(fn, timeout);
    t?.unref && t?.unref();
    return t;
}
const isPromise = (obj)=>obj && 'function' == typeof obj.then;
const isError = (x)=>x instanceof Error;
function getFetch() {
    return 'undefined' != typeof fetch ? fetch : void 0 !== globalThis.fetch ? globalThis.fetch : void 0;
}
function allSettled(promises) {
    return Promise.all(promises.map((p)=>(p ?? Promise.resolve()).then((value)=>({
                status: 'fulfilled',
                value
            }), (reason)=>({
                status: 'rejected',
                reason
            }))));
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/eventemitter.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "SimpleEventEmitter",
    ()=>SimpleEventEmitter
]);
class SimpleEventEmitter {
    constructor(){
        this.events = {};
        this.events = {};
    }
    on(event, listener) {
        if (!this.events[event]) this.events[event] = [];
        this.events[event].push(listener);
        return ()=>{
            this.events[event] = this.events[event].filter((x)=>x !== listener);
        };
    }
    emit(event, payload) {
        for (const listener of this.events[event] || [])listener(payload);
        for (const listener of this.events['*'] || [])listener(event, payload);
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/gzip.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "gzipCompress",
    ()=>gzipCompress,
    "isGzipSupported",
    ()=>isGzipSupported
]);
function isGzipSupported() {
    return 'CompressionStream' in globalThis;
}
async function gzipCompress(input, isDebug = true) {
    try {
        const dataStream = new Blob([
            input
        ], {
            type: 'text/plain'
        }).stream();
        const compressedStream = dataStream.pipeThrough(new CompressionStream('gzip'));
        return await new Response(compressedStream).blob();
    } catch (error) {
        if (isDebug) console.error('Failed to gzip compress data', error);
        return null;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/logger.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "_createLogger",
    ()=>_createLogger,
    "createLogger",
    ()=>createLogger
]);
function createConsole(consoleLike = console) {
    const lockedMethods = {
        log: consoleLike.log.bind(consoleLike),
        warn: consoleLike.warn.bind(consoleLike),
        error: consoleLike.error.bind(consoleLike),
        debug: consoleLike.debug.bind(consoleLike)
    };
    return lockedMethods;
}
const _createLogger = (prefix, maybeCall, consoleLike)=>{
    function _log(level, ...args) {
        maybeCall(()=>{
            const consoleMethod = consoleLike[level];
            consoleMethod(prefix, ...args);
        });
    }
    const logger = {
        info: (...args)=>{
            _log('log', ...args);
        },
        warn: (...args)=>{
            _log('warn', ...args);
        },
        error: (...args)=>{
            _log('error', ...args);
        },
        critical: (...args)=>{
            consoleLike['error'](prefix, ...args);
        },
        createLogger: (additionalPrefix)=>_createLogger(`${prefix} ${additionalPrefix}`, maybeCall, consoleLike)
    };
    return logger;
};
function createLogger(prefix, maybeCall) {
    return _createLogger(prefix, maybeCall, createConsole());
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core-stateless.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogCoreStateless",
    ()=>PostHogCoreStateless,
    "QuotaLimitedFeature",
    ()=>posthog_core_stateless_QuotaLimitedFeature,
    "logFlushError",
    ()=>logFlushError,
    "maybeAdd",
    ()=>maybeAdd
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$eventemitter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/eventemitter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/featureFlagUtils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$gzip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/gzip.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/logger.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$promise$2d$queue$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/promise-queue.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
class PostHogFetchHttpError extends Error {
    constructor(response, reqByteLength){
        super('HTTP error while fetching PostHog: status=' + response.status + ', reqByteLength=' + reqByteLength), this.response = response, this.reqByteLength = reqByteLength, this.name = 'PostHogFetchHttpError';
    }
    get status() {
        return this.response.status;
    }
    get text() {
        return this.response.text();
    }
    get json() {
        return this.response.json();
    }
}
class PostHogFetchNetworkError extends Error {
    constructor(error){
        super('Network error while fetching PostHog', error instanceof Error ? {
            cause: error
        } : {}), this.error = error, this.name = 'PostHogFetchNetworkError';
    }
}
const maybeAdd = (key, value)=>void 0 !== value ? {
        [key]: value
    } : {};
async function logFlushError(err) {
    if (err instanceof PostHogFetchHttpError) {
        let text = '';
        try {
            text = await err.text;
        } catch  {}
        console.error(`Error while flushing PostHog: message=${err.message}, response body=${text}`, err);
    } else console.error('Error while flushing PostHog', err);
    return Promise.resolve();
}
function isPostHogFetchError(err) {
    return 'object' == typeof err && (err instanceof PostHogFetchHttpError || err instanceof PostHogFetchNetworkError);
}
function isPostHogFetchContentTooLargeError(err) {
    return 'object' == typeof err && err instanceof PostHogFetchHttpError && 413 === err.status;
}
var posthog_core_stateless_QuotaLimitedFeature = /*#__PURE__*/ function(QuotaLimitedFeature) {
    QuotaLimitedFeature["FeatureFlags"] = "feature_flags";
    QuotaLimitedFeature["Recordings"] = "recordings";
    return QuotaLimitedFeature;
}({});
class PostHogCoreStateless {
    constructor(apiKey, options = {}){
        this.flushPromise = null;
        this.shutdownPromise = null;
        this.promiseQueue = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$promise$2d$queue$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromiseQueue"]();
        this._events = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$eventemitter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["SimpleEventEmitter"]();
        this._isInitialized = false;
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assert"])(apiKey, "You must pass your PostHog project's api key.");
        this.apiKey = apiKey;
        this.host = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["removeTrailingSlash"])(options.host || 'https://us.i.posthog.com');
        this.flushAt = options.flushAt ? Math.max(options.flushAt, 1) : 20;
        this.maxBatchSize = Math.max(this.flushAt, options.maxBatchSize ?? 100);
        this.maxQueueSize = Math.max(this.flushAt, options.maxQueueSize ?? 1000);
        this.flushInterval = options.flushInterval ?? 10000;
        this.preloadFeatureFlags = options.preloadFeatureFlags ?? true;
        this.defaultOptIn = options.defaultOptIn ?? true;
        this.disableSurveys = options.disableSurveys ?? false;
        this._retryOptions = {
            retryCount: options.fetchRetryCount ?? 3,
            retryDelay: options.fetchRetryDelay ?? 3000,
            retryCheck: isPostHogFetchError
        };
        this.requestTimeout = options.requestTimeout ?? 10000;
        this.featureFlagsRequestTimeoutMs = options.featureFlagsRequestTimeoutMs ?? 3000;
        this.remoteConfigRequestTimeoutMs = options.remoteConfigRequestTimeoutMs ?? 3000;
        this.disableGeoip = options.disableGeoip ?? true;
        this.disabled = options.disabled ?? false;
        this.historicalMigration = options?.historicalMigration ?? false;
        this.evaluationEnvironments = options?.evaluationEnvironments;
        this._initPromise = Promise.resolve();
        this._isInitialized = true;
        this._logger = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$logger$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createLogger"])('[PostHog]', this.logMsgIfDebug.bind(this));
        this.disableCompression = !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$gzip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isGzipSupported"])() || (options?.disableCompression ?? false);
    }
    logMsgIfDebug(fn) {
        if (this.isDebug) fn();
    }
    wrap(fn) {
        if (this.disabled) return void this._logger.warn('The client is disabled');
        if (this._isInitialized) return fn();
        this._initPromise.then(()=>fn());
    }
    getCommonEventProperties() {
        return {
            $lib: this.getLibraryId(),
            $lib_version: this.getLibraryVersion()
        };
    }
    get optedOut() {
        return this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OptedOut) ?? !this.defaultOptIn;
    }
    async optIn() {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OptedOut, false);
        });
    }
    async optOut() {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OptedOut, true);
        });
    }
    on(event, cb) {
        return this._events.on(event, cb);
    }
    debug(enabled = true) {
        this.removeDebugCallback?.();
        if (enabled) {
            const removeDebugCallback = this.on('*', (event, payload)=>this._logger.info(event, payload));
            this.removeDebugCallback = ()=>{
                removeDebugCallback();
                this.removeDebugCallback = void 0;
            };
        }
    }
    get isDebug() {
        return !!this.removeDebugCallback;
    }
    get isDisabled() {
        return this.disabled;
    }
    buildPayload(payload) {
        return {
            distinct_id: payload.distinct_id,
            event: payload.event,
            properties: {
                ...payload.properties || {},
                ...this.getCommonEventProperties()
            }
        };
    }
    addPendingPromise(promise) {
        return this.promiseQueue.add(promise);
    }
    identifyStateless(distinctId, properties, options) {
        this.wrap(()=>{
            const payload = {
                ...this.buildPayload({
                    distinct_id: distinctId,
                    event: '$identify',
                    properties
                })
            };
            this.enqueue('identify', payload, options);
        });
    }
    async identifyStatelessImmediate(distinctId, properties, options) {
        const payload = {
            ...this.buildPayload({
                distinct_id: distinctId,
                event: '$identify',
                properties
            })
        };
        await this.sendImmediate('identify', payload, options);
    }
    captureStateless(distinctId, event, properties, options) {
        this.wrap(()=>{
            const payload = this.buildPayload({
                distinct_id: distinctId,
                event,
                properties
            });
            this.enqueue('capture', payload, options);
        });
    }
    async captureStatelessImmediate(distinctId, event, properties, options) {
        const payload = this.buildPayload({
            distinct_id: distinctId,
            event,
            properties
        });
        await this.sendImmediate('capture', payload, options);
    }
    aliasStateless(alias, distinctId, properties, options) {
        this.wrap(()=>{
            const payload = this.buildPayload({
                event: '$create_alias',
                distinct_id: distinctId,
                properties: {
                    ...properties || {},
                    distinct_id: distinctId,
                    alias
                }
            });
            this.enqueue('alias', payload, options);
        });
    }
    async aliasStatelessImmediate(alias, distinctId, properties, options) {
        const payload = this.buildPayload({
            event: '$create_alias',
            distinct_id: distinctId,
            properties: {
                ...properties || {},
                distinct_id: distinctId,
                alias
            }
        });
        await this.sendImmediate('alias', payload, options);
    }
    groupIdentifyStateless(groupType, groupKey, groupProperties, options, distinctId, eventProperties) {
        this.wrap(()=>{
            const payload = this.buildPayload({
                distinct_id: distinctId || `$${groupType}_${groupKey}`,
                event: '$groupidentify',
                properties: {
                    $group_type: groupType,
                    $group_key: groupKey,
                    $group_set: groupProperties || {},
                    ...eventProperties || {}
                }
            });
            this.enqueue('capture', payload, options);
        });
    }
    async getRemoteConfig() {
        await this._initPromise;
        let host = this.host;
        if ('https://us.i.posthog.com' === host) host = 'https://us-assets.i.posthog.com';
        else if ('https://eu.i.posthog.com' === host) host = 'https://eu-assets.i.posthog.com';
        const url = `${host}/array/${this.apiKey}/config`;
        const fetchOptions = {
            method: 'GET',
            headers: {
                ...this.getCustomHeaders(),
                'Content-Type': 'application/json'
            }
        };
        return this.fetchWithRetry(url, fetchOptions, {
            retryCount: 0
        }, this.remoteConfigRequestTimeoutMs).then((response)=>response.json()).catch((error)=>{
            this._logger.error('Remote config could not be loaded', error);
            this._events.emit('error', error);
        });
    }
    async getFlags(distinctId, groups = {}, personProperties = {}, groupProperties = {}, extraPayload = {}, fetchConfig = true) {
        await this._initPromise;
        const configParam = fetchConfig ? '&config=true' : '';
        const url = `${this.host}/flags/?v=2${configParam}`;
        const requestData = {
            token: this.apiKey,
            distinct_id: distinctId,
            groups,
            person_properties: personProperties,
            group_properties: groupProperties,
            ...extraPayload
        };
        if (this.evaluationEnvironments && this.evaluationEnvironments.length > 0) requestData.evaluation_environments = this.evaluationEnvironments;
        const fetchOptions = {
            method: 'POST',
            headers: {
                ...this.getCustomHeaders(),
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestData)
        };
        this._logger.info('Flags URL', url);
        return this.fetchWithRetry(url, fetchOptions, {
            retryCount: 0
        }, this.featureFlagsRequestTimeoutMs).then((response)=>response.json()).then((response)=>(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeFlagsResponse"])(response)).catch((error)=>{
            this._events.emit('error', error);
        });
    }
    async getFeatureFlagStateless(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const flagDetailResponse = await this.getFeatureFlagDetailStateless(key, distinctId, groups, personProperties, groupProperties, disableGeoip);
        if (void 0 === flagDetailResponse) return {
            response: void 0,
            requestId: void 0
        };
        let response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFeatureFlagValue"])(flagDetailResponse.response);
        if (void 0 === response) response = false;
        return {
            response,
            requestId: flagDetailResponse.requestId
        };
    }
    async getFeatureFlagDetailStateless(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const flagsResponse = await this.getFeatureFlagDetailsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, [
            key
        ]);
        if (void 0 === flagsResponse) return;
        const featureFlags = flagsResponse.flags;
        const flagDetail = featureFlags[key];
        return {
            response: flagDetail,
            requestId: flagsResponse.requestId
        };
    }
    async getFeatureFlagPayloadStateless(key, distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip) {
        await this._initPromise;
        const payloads = await this.getFeatureFlagPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, [
            key
        ]);
        if (!payloads) return;
        const response = payloads[key];
        if (void 0 === response) return null;
        return response;
    }
    async getFeatureFlagPayloadsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip, flagKeysToEvaluate) {
        await this._initPromise;
        const payloads = (await this.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, flagKeysToEvaluate)).payloads;
        return payloads;
    }
    async getFeatureFlagsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip, flagKeysToEvaluate) {
        await this._initPromise;
        return await this.getFeatureFlagsAndPayloadsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, flagKeysToEvaluate);
    }
    async getFeatureFlagsAndPayloadsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip, flagKeysToEvaluate) {
        await this._initPromise;
        const featureFlagDetails = await this.getFeatureFlagDetailsStateless(distinctId, groups, personProperties, groupProperties, disableGeoip, flagKeysToEvaluate);
        if (!featureFlagDetails) return {
            flags: void 0,
            payloads: void 0,
            requestId: void 0
        };
        return {
            flags: featureFlagDetails.featureFlags,
            payloads: featureFlagDetails.featureFlagPayloads,
            requestId: featureFlagDetails.requestId
        };
    }
    async getFeatureFlagDetailsStateless(distinctId, groups = {}, personProperties = {}, groupProperties = {}, disableGeoip, flagKeysToEvaluate) {
        await this._initPromise;
        const extraPayload = {};
        if (disableGeoip ?? this.disableGeoip) extraPayload['geoip_disable'] = true;
        if (flagKeysToEvaluate) extraPayload['flag_keys_to_evaluate'] = flagKeysToEvaluate;
        const flagsResponse = await this.getFlags(distinctId, groups, personProperties, groupProperties, extraPayload);
        if (void 0 === flagsResponse) return;
        if (flagsResponse.errorsWhileComputingFlags) console.error('[FEATURE FLAGS] Error while computing feature flags, some flags may be missing or incorrect. Learn more at https://posthog.com/docs/feature-flags/best-practices');
        if (flagsResponse.quotaLimited?.includes("feature_flags")) {
            console.warn('[FEATURE FLAGS] Feature flags quota limit exceeded - feature flags unavailable. Learn more about billing limits at https://posthog.com/docs/billing/limits-alerts');
            return {
                flags: {},
                featureFlags: {},
                featureFlagPayloads: {},
                requestId: flagsResponse?.requestId
            };
        }
        return flagsResponse;
    }
    async getSurveysStateless() {
        await this._initPromise;
        if (true === this.disableSurveys) {
            this._logger.info('Loading surveys is disabled.');
            return [];
        }
        const url = `${this.host}/api/surveys/?token=${this.apiKey}`;
        const fetchOptions = {
            method: 'GET',
            headers: {
                ...this.getCustomHeaders(),
                'Content-Type': 'application/json'
            }
        };
        const response = await this.fetchWithRetry(url, fetchOptions).then((response)=>{
            if (200 !== response.status || !response.json) {
                const msg = `Surveys API could not be loaded: ${response.status}`;
                const error = new Error(msg);
                this._logger.error(error);
                this._events.emit('error', new Error(msg));
                return;
            }
            return response.json();
        }).catch((error)=>{
            this._logger.error('Surveys API could not be loaded', error);
            this._events.emit('error', error);
        });
        const newSurveys = response?.surveys;
        if (newSurveys) this._logger.info('Surveys fetched from API: ', JSON.stringify(newSurveys));
        return newSurveys ?? [];
    }
    get props() {
        if (!this._props) this._props = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Props);
        return this._props || {};
    }
    set props(val) {
        this._props = val;
    }
    async register(properties) {
        this.wrap(()=>{
            this.props = {
                ...this.props,
                ...properties
            };
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Props, this.props);
        });
    }
    async unregister(property) {
        this.wrap(()=>{
            delete this.props[property];
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Props, this.props);
        });
    }
    enqueue(type, _message, options) {
        this.wrap(()=>{
            if (this.optedOut) return void this._events.emit(type, "Library is disabled. Not sending event. To re-enable, call posthog.optIn()");
            const message = this.prepareMessage(type, _message, options);
            const queue = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue) || [];
            if (queue.length >= this.maxQueueSize) {
                queue.shift();
                this._logger.info('Queue is full, the oldest event is dropped.');
            }
            queue.push({
                message
            });
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue, queue);
            this._events.emit(type, message);
            if (queue.length >= this.flushAt) this.flushBackground();
            if (this.flushInterval && !this._flushTimer) this._flushTimer = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["safeSetTimeout"])(()=>this.flushBackground(), this.flushInterval);
        });
    }
    async sendImmediate(type, _message, options) {
        if (this.disabled) return void this._logger.warn('The client is disabled');
        if (!this._isInitialized) await this._initPromise;
        if (this.optedOut) return void this._events.emit(type, "Library is disabled. Not sending event. To re-enable, call posthog.optIn()");
        const data = {
            api_key: this.apiKey,
            batch: [
                this.prepareMessage(type, _message, options)
            ],
            sent_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentISOTime"])()
        };
        if (this.historicalMigration) data.historical_migration = true;
        const payload = JSON.stringify(data);
        const url = `${this.host}/batch/`;
        const gzippedPayload = this.disableCompression ? null : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$gzip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gzipCompress"])(payload, this.isDebug);
        const fetchOptions = {
            method: 'POST',
            headers: {
                ...this.getCustomHeaders(),
                'Content-Type': 'application/json',
                ...null !== gzippedPayload && {
                    'Content-Encoding': 'gzip'
                }
            },
            body: gzippedPayload || payload
        };
        try {
            await this.fetchWithRetry(url, fetchOptions);
        } catch (err) {
            this._events.emit('error', err);
        }
    }
    prepareMessage(type, _message, options) {
        const message = {
            ..._message,
            type: type,
            library: this.getLibraryId(),
            library_version: this.getLibraryVersion(),
            timestamp: options?.timestamp ? options?.timestamp : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentISOTime"])(),
            uuid: options?.uuid ? options.uuid : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])()
        };
        const addGeoipDisableProperty = options?.disableGeoip ?? this.disableGeoip;
        if (addGeoipDisableProperty) {
            if (!message.properties) message.properties = {};
            message['properties']['$geoip_disable'] = true;
        }
        if (message.distinctId) {
            message.distinct_id = message.distinctId;
            delete message.distinctId;
        }
        return message;
    }
    clearFlushTimer() {
        if (this._flushTimer) {
            clearTimeout(this._flushTimer);
            this._flushTimer = void 0;
        }
    }
    flushBackground() {
        this.flush().catch(async (err)=>{
            await logFlushError(err);
        });
    }
    async flush() {
        const nextFlushPromise = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["allSettled"])([
            this.flushPromise
        ]).then(()=>this._flush());
        this.flushPromise = nextFlushPromise;
        this.addPendingPromise(nextFlushPromise);
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["allSettled"])([
            nextFlushPromise
        ]).then(()=>{
            if (this.flushPromise === nextFlushPromise) this.flushPromise = null;
        });
        return nextFlushPromise;
    }
    getCustomHeaders() {
        const customUserAgent = this.getCustomUserAgent();
        const headers = {};
        if (customUserAgent && '' !== customUserAgent) headers['User-Agent'] = customUserAgent;
        return headers;
    }
    async _flush() {
        this.clearFlushTimer();
        await this._initPromise;
        let queue = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue) || [];
        if (!queue.length) return;
        const sentMessages = [];
        const originalQueueLength = queue.length;
        while(queue.length > 0 && sentMessages.length < originalQueueLength){
            const batchItems = queue.slice(0, this.maxBatchSize);
            const batchMessages = batchItems.map((item)=>item.message);
            const persistQueueChange = ()=>{
                const refreshedQueue = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue) || [];
                const newQueue = refreshedQueue.slice(batchItems.length);
                this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue, newQueue);
                queue = newQueue;
            };
            const data = {
                api_key: this.apiKey,
                batch: batchMessages,
                sent_at: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentISOTime"])()
            };
            if (this.historicalMigration) data.historical_migration = true;
            const payload = JSON.stringify(data);
            const url = `${this.host}/batch/`;
            const gzippedPayload = this.disableCompression ? null : await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$gzip$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["gzipCompress"])(payload, this.isDebug);
            const fetchOptions = {
                method: 'POST',
                headers: {
                    ...this.getCustomHeaders(),
                    'Content-Type': 'application/json',
                    ...null !== gzippedPayload && {
                        'Content-Encoding': 'gzip'
                    }
                },
                body: gzippedPayload || payload
            };
            const retryOptions = {
                retryCheck: (err)=>{
                    if (isPostHogFetchContentTooLargeError(err)) return false;
                    return isPostHogFetchError(err);
                }
            };
            try {
                await this.fetchWithRetry(url, fetchOptions, retryOptions);
            } catch (err) {
                if (isPostHogFetchContentTooLargeError(err) && batchMessages.length > 1) {
                    this.maxBatchSize = Math.max(1, Math.floor(batchMessages.length / 2));
                    this._logger.warn(`Received 413 when sending batch of size ${batchMessages.length}, reducing batch size to ${this.maxBatchSize}`);
                    continue;
                }
                if (!(err instanceof PostHogFetchNetworkError)) persistQueueChange();
                this._events.emit('error', err);
                throw err;
            }
            persistQueueChange();
            sentMessages.push(...batchMessages);
        }
        this._events.emit('flush', sentMessages);
    }
    async fetchWithRetry(url, options, retryOptions, requestTimeout) {
        AbortSignal.timeout ??= function(ms) {
            const ctrl = new AbortController();
            setTimeout(()=>ctrl.abort(), ms);
            return ctrl.signal;
        };
        const body = options.body ? options.body : '';
        let reqByteLength = -1;
        try {
            reqByteLength = body instanceof Blob ? body.size : Buffer.byteLength(body, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STRING_FORMAT"]);
        } catch  {
            if (body instanceof Blob) reqByteLength = body.size;
            else {
                const encoded = new TextEncoder().encode(body);
                reqByteLength = encoded.length;
            }
        }
        return await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["retriable"])(async ()=>{
            let res = null;
            try {
                res = await this.fetch(url, {
                    signal: AbortSignal.timeout(requestTimeout ?? this.requestTimeout),
                    ...options
                });
            } catch (e) {
                throw new PostHogFetchNetworkError(e);
            }
            const isNoCors = 'no-cors' === options.mode;
            if (!isNoCors && (res.status < 200 || res.status >= 400)) throw new PostHogFetchHttpError(res, reqByteLength);
            return res;
        }, {
            ...this._retryOptions,
            ...retryOptions
        });
    }
    async _shutdown(shutdownTimeoutMs = 30000) {
        await this._initPromise;
        let hasTimedOut = false;
        this.clearFlushTimer();
        const doShutdown = async ()=>{
            try {
                await this.promiseQueue.join();
                while(true){
                    const queue = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue) || [];
                    if (0 === queue.length) break;
                    await this.flush();
                    if (hasTimedOut) break;
                }
            } catch (e) {
                if (!isPostHogFetchError(e)) throw e;
                await logFlushError(e);
            }
        };
        return Promise.race([
            new Promise((_, reject)=>{
                (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["safeSetTimeout"])(()=>{
                    this._logger.error('Timed out while shutting down PostHog');
                    hasTimedOut = true;
                    reject('Timeout while shutting down PostHog. Some events may not have been sent.');
                }, shutdownTimeoutMs);
            }),
            doShutdown()
        ]);
    }
    async shutdown(shutdownTimeoutMs = 30000) {
        if (this.shutdownPromise) this._logger.warn('shutdown() called while already shutting down. shutdown() is meant to be called once before process exit - use flush() for per-request cleanup');
        else this.shutdownPromise = this._shutdown(shutdownTimeoutMs).finally(()=>{
            this.shutdownPromise = null;
        });
        return this.shutdownPromise;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PostHogCore",
    ()=>PostHogCore
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/featureFlagUtils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core-stateless.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
;
;
;
;
class PostHogCore extends __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogCoreStateless"] {
    constructor(apiKey, options){
        const disableGeoipOption = options?.disableGeoip ?? false;
        const featureFlagsRequestTimeoutMs = options?.featureFlagsRequestTimeoutMs ?? 10000;
        super(apiKey, {
            ...options,
            disableGeoip: disableGeoipOption,
            featureFlagsRequestTimeoutMs
        }), this.flagCallReported = {}, this._sessionMaxLengthSeconds = 86400, this.sessionProps = {};
        this.sendFeatureFlagEvent = options?.sendFeatureFlagEvent ?? true;
        this._sessionExpirationTimeSeconds = options?.sessionExpirationTimeSeconds ?? 1800;
    }
    setupBootstrap(options) {
        const bootstrap = options?.bootstrap;
        if (!bootstrap) return;
        if (bootstrap.distinctId) if (bootstrap.isIdentifiedId) {
            const distinctId = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].DistinctId);
            if (!distinctId) this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].DistinctId, bootstrap.distinctId);
        } else {
            const anonymousId = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].AnonymousId);
            if (!anonymousId) this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].AnonymousId, bootstrap.distinctId);
        }
        const bootstrapFeatureFlags = bootstrap.featureFlags;
        const bootstrapFeatureFlagPayloads = bootstrap.featureFlagPayloads ?? {};
        if (bootstrapFeatureFlags && Object.keys(bootstrapFeatureFlags).length) {
            const normalizedBootstrapFeatureFlagDetails = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFlagsResponseFromFlagsAndPayloads"])(bootstrapFeatureFlags, bootstrapFeatureFlagPayloads);
            if (Object.keys(normalizedBootstrapFeatureFlagDetails.flags).length > 0) {
                this.setBootstrappedFeatureFlagDetails(normalizedBootstrapFeatureFlagDetails);
                const currentFeatureFlagDetails = this.getKnownFeatureFlagDetails() || {
                    flags: {},
                    requestId: void 0
                };
                const newFeatureFlagDetails = {
                    flags: {
                        ...normalizedBootstrapFeatureFlagDetails.flags,
                        ...currentFeatureFlagDetails.flags
                    },
                    requestId: normalizedBootstrapFeatureFlagDetails.requestId
                };
                this.setKnownFeatureFlagDetails(newFeatureFlagDetails);
            }
        }
    }
    clearProps() {
        this.props = void 0;
        this.sessionProps = {};
        this.flagCallReported = {};
    }
    on(event, cb) {
        return this._events.on(event, cb);
    }
    reset(propertiesToKeep) {
        this.wrap(()=>{
            const allPropertiesToKeep = [
                __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Queue,
                ...propertiesToKeep || []
            ];
            this.clearProps();
            for (const key of Object.keys(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"]))if (!allPropertiesToKeep.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"][key])) this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"][key], null);
            this.reloadFeatureFlags();
        });
    }
    getCommonEventProperties() {
        const featureFlags = this.getFeatureFlags();
        const featureVariantProperties = {};
        if (featureFlags) for (const [feature, variant] of Object.entries(featureFlags))featureVariantProperties[`$feature/${feature}`] = variant;
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$active_feature_flags', featureFlags ? Object.keys(featureFlags) : void 0),
            ...featureVariantProperties,
            ...super.getCommonEventProperties()
        };
    }
    enrichProperties(properties) {
        return {
            ...this.props,
            ...this.sessionProps,
            ...properties || {},
            ...this.getCommonEventProperties(),
            $session_id: this.getSessionId()
        };
    }
    getSessionId() {
        if (!this._isInitialized) return '';
        let sessionId = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionId);
        const sessionLastTimestamp = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionLastTimestamp) || 0;
        const sessionStartTimestamp = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionStartTimestamp) || 0;
        const now = Date.now();
        const sessionLastDif = now - sessionLastTimestamp;
        const sessionStartDif = now - sessionStartTimestamp;
        if (!sessionId || sessionLastDif > 1000 * this._sessionExpirationTimeSeconds || sessionStartDif > 1000 * this._sessionMaxLengthSeconds) {
            sessionId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])();
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionId, sessionId);
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionStartTimestamp, now);
        }
        this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionLastTimestamp, now);
        return sessionId;
    }
    resetSessionId() {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionId, null);
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionLastTimestamp, null);
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionStartTimestamp, null);
        });
    }
    getAnonymousId() {
        if (!this._isInitialized) return '';
        let anonId = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].AnonymousId);
        if (!anonId) {
            anonId = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["uuidv7"])();
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].AnonymousId, anonId);
        }
        return anonId;
    }
    getDistinctId() {
        if (!this._isInitialized) return '';
        return this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].DistinctId) || this.getAnonymousId();
    }
    registerForSession(properties) {
        this.sessionProps = {
            ...this.sessionProps,
            ...properties
        };
    }
    unregisterForSession(property) {
        delete this.sessionProps[property];
    }
    identify(distinctId, properties, options) {
        this.wrap(()=>{
            const previousDistinctId = this.getDistinctId();
            distinctId = distinctId || previousDistinctId;
            if (properties?.$groups) this.groups(properties.$groups);
            const userPropsOnce = properties?.$set_once;
            delete properties?.$set_once;
            const userProps = properties?.$set || properties;
            const allProperties = this.enrichProperties({
                $anon_distinct_id: this.getAnonymousId(),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$set', userProps),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$set_once', userPropsOnce)
            });
            if (distinctId !== previousDistinctId) {
                this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].AnonymousId, previousDistinctId);
                this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].DistinctId, distinctId);
                this.reloadFeatureFlags();
            }
            super.identifyStateless(distinctId, allProperties, options);
        });
    }
    capture(event, properties, options) {
        this.wrap(()=>{
            const distinctId = this.getDistinctId();
            if (properties?.$groups) this.groups(properties.$groups);
            const allProperties = this.enrichProperties(properties);
            super.captureStateless(distinctId, event, allProperties, options);
        });
    }
    alias(alias) {
        this.wrap(()=>{
            const distinctId = this.getDistinctId();
            const allProperties = this.enrichProperties({});
            super.aliasStateless(alias, distinctId, allProperties);
        });
    }
    autocapture(eventType, elements, properties = {}, options) {
        this.wrap(()=>{
            const distinctId = this.getDistinctId();
            const payload = {
                distinct_id: distinctId,
                event: '$autocapture',
                properties: {
                    ...this.enrichProperties(properties),
                    $event_type: eventType,
                    $elements: elements
                }
            };
            this.enqueue('autocapture', payload, options);
        });
    }
    groups(groups) {
        this.wrap(()=>{
            const existingGroups = this.props.$groups || {};
            this.register({
                $groups: {
                    ...existingGroups,
                    ...groups
                }
            });
            if (Object.keys(groups).find((type)=>existingGroups[type] !== groups[type])) this.reloadFeatureFlags();
        });
    }
    group(groupType, groupKey, groupProperties, options) {
        this.wrap(()=>{
            this.groups({
                [groupType]: groupKey
            });
            if (groupProperties) this.groupIdentify(groupType, groupKey, groupProperties, options);
        });
    }
    groupIdentify(groupType, groupKey, groupProperties, options) {
        this.wrap(()=>{
            const distinctId = this.getDistinctId();
            const eventProperties = this.enrichProperties({});
            super.groupIdentifyStateless(groupType, groupKey, groupProperties, options, distinctId, eventProperties);
        });
    }
    setPersonPropertiesForFlags(properties) {
        this.wrap(()=>{
            const existingProperties = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].PersonProperties) || {};
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].PersonProperties, {
                ...existingProperties,
                ...properties
            });
        });
    }
    resetPersonPropertiesForFlags() {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].PersonProperties, null);
        });
    }
    setGroupPropertiesForFlags(properties) {
        this.wrap(()=>{
            const existingProperties = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].GroupProperties) || {};
            if (0 !== Object.keys(existingProperties).length) Object.keys(existingProperties).forEach((groupType)=>{
                existingProperties[groupType] = {
                    ...existingProperties[groupType],
                    ...properties[groupType]
                };
                delete properties[groupType];
            });
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].GroupProperties, {
                ...existingProperties,
                ...properties
            });
        });
    }
    resetGroupPropertiesForFlags() {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].GroupProperties, null);
        });
    }
    async remoteConfigAsync() {
        await this._initPromise;
        if (this._remoteConfigResponsePromise) return this._remoteConfigResponsePromise;
        return this._remoteConfigAsync();
    }
    async flagsAsync(sendAnonDistinctId = true, fetchConfig = true) {
        await this._initPromise;
        if (this._flagsResponsePromise) return this._flagsResponsePromise;
        return this._flagsAsync(sendAnonDistinctId, fetchConfig);
    }
    cacheSessionReplay(source, response) {
        const sessionReplay = response?.sessionRecording;
        if (sessionReplay) {
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionReplay, sessionReplay);
            this._logger.info(`Session replay config from ${source}: `, JSON.stringify(sessionReplay));
        } else if ('boolean' == typeof sessionReplay && false === sessionReplay) {
            this._logger.info(`Session replay config from ${source} disabled.`);
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].SessionReplay, null);
        }
    }
    async _remoteConfigAsync() {
        this._remoteConfigResponsePromise = this._initPromise.then(()=>{
            let remoteConfig = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].RemoteConfig);
            this._logger.info('Cached remote config: ', JSON.stringify(remoteConfig));
            return super.getRemoteConfig().then((response)=>{
                if (response) {
                    const remoteConfigWithoutSurveys = {
                        ...response
                    };
                    delete remoteConfigWithoutSurveys.surveys;
                    this._logger.info('Fetched remote config: ', JSON.stringify(remoteConfigWithoutSurveys));
                    if (false === this.disableSurveys) {
                        const surveys = response.surveys;
                        let hasSurveys = true;
                        if (Array.isArray(surveys)) this._logger.info('Surveys fetched from remote config: ', JSON.stringify(surveys));
                        else {
                            this._logger.info('There are no surveys.');
                            hasSurveys = false;
                        }
                        if (hasSurveys) this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Surveys, surveys);
                        else this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Surveys, null);
                    } else this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].Surveys, null);
                    this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].RemoteConfig, remoteConfigWithoutSurveys);
                    this.cacheSessionReplay('remote config', response);
                    if (false === response.hasFeatureFlags) {
                        this.setKnownFeatureFlagDetails({
                            flags: {}
                        });
                        this._logger.warn('Remote config has no feature flags, will not load feature flags.');
                    } else if (false !== this.preloadFeatureFlags) this.reloadFeatureFlags();
                    if (!response.supportedCompression?.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["Compression"].GZipJS)) this.disableCompression = true;
                    remoteConfig = response;
                }
                return remoteConfig;
            });
        }).finally(()=>{
            this._remoteConfigResponsePromise = void 0;
        });
        return this._remoteConfigResponsePromise;
    }
    async _flagsAsync(sendAnonDistinctId = true, fetchConfig = true) {
        this._flagsResponsePromise = this._initPromise.then(async ()=>{
            const distinctId = this.getDistinctId();
            const groups = this.props.$groups || {};
            const personProperties = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].PersonProperties) || {};
            const groupProperties = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].GroupProperties) || {};
            const extraProperties = {
                $anon_distinct_id: sendAnonDistinctId ? this.getAnonymousId() : void 0
            };
            const res = await super.getFlags(distinctId, groups, personProperties, groupProperties, extraProperties, fetchConfig);
            if (res?.quotaLimited?.includes(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["QuotaLimitedFeature"].FeatureFlags)) {
                this.setKnownFeatureFlagDetails(null);
                console.warn('[FEATURE FLAGS] Feature flags quota limit exceeded - unsetting all flags. Learn more about billing limits at https://posthog.com/docs/billing/limits-alerts');
                return res;
            }
            if (res?.featureFlags) {
                if (this.sendFeatureFlagEvent) this.flagCallReported = {};
                let newFeatureFlagDetails = res;
                if (res.errorsWhileComputingFlags) {
                    const currentFlagDetails = this.getKnownFeatureFlagDetails();
                    this._logger.info('Cached feature flags: ', JSON.stringify(currentFlagDetails));
                    newFeatureFlagDetails = {
                        ...res,
                        flags: {
                            ...currentFlagDetails?.flags,
                            ...res.flags
                        }
                    };
                }
                this.setKnownFeatureFlagDetails(newFeatureFlagDetails);
                this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FlagsEndpointWasHit, true);
                this.cacheSessionReplay('flags', res);
            }
            return res;
        }).finally(()=>{
            this._flagsResponsePromise = void 0;
        });
        return this._flagsResponsePromise;
    }
    setKnownFeatureFlagDetails(flagsResponse) {
        this.wrap(()=>{
            this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FeatureFlagDetails, flagsResponse);
            this._events.emit('featureflags', (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFlagValuesFromFlags"])(flagsResponse?.flags ?? {}));
        });
    }
    getKnownFeatureFlagDetails() {
        const storedDetails = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FeatureFlagDetails);
        if (!storedDetails) {
            const featureFlags = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FeatureFlags);
            const featureFlagPayloads = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FeatureFlagPayloads);
            if (void 0 === featureFlags && void 0 === featureFlagPayloads) return;
            return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFlagsResponseFromFlagsAndPayloads"])(featureFlags ?? {}, featureFlagPayloads ?? {});
        }
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeFlagsResponse"])(storedDetails);
    }
    getKnownFeatureFlags() {
        const featureFlagDetails = this.getKnownFeatureFlagDetails();
        if (!featureFlagDetails) return;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFlagValuesFromFlags"])(featureFlagDetails.flags);
    }
    getKnownFeatureFlagPayloads() {
        const featureFlagDetails = this.getKnownFeatureFlagDetails();
        if (!featureFlagDetails) return;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPayloadsFromFlags"])(featureFlagDetails.flags);
    }
    getBootstrappedFeatureFlagDetails() {
        const details = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].BootstrapFeatureFlagDetails);
        if (!details) return;
        return details;
    }
    setBootstrappedFeatureFlagDetails(details) {
        this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].BootstrapFeatureFlagDetails, details);
    }
    getBootstrappedFeatureFlags() {
        const details = this.getBootstrappedFeatureFlagDetails();
        if (!details) return;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFlagValuesFromFlags"])(details.flags);
    }
    getBootstrappedFeatureFlagPayloads() {
        const details = this.getBootstrappedFeatureFlagDetails();
        if (!details) return;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getPayloadsFromFlags"])(details.flags);
    }
    getFeatureFlag(key) {
        const details = this.getFeatureFlagDetails();
        if (!details) return;
        const featureFlag = details.flags[key];
        let response = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFeatureFlagValue"])(featureFlag);
        if (void 0 === response) response = false;
        if (this.sendFeatureFlagEvent && !this.flagCallReported[key]) {
            const bootstrappedResponse = this.getBootstrappedFeatureFlags()?.[key];
            const bootstrappedPayload = this.getBootstrappedFeatureFlagPayloads()?.[key];
            this.flagCallReported[key] = true;
            this.capture('$feature_flag_called', {
                $feature_flag: key,
                $feature_flag_response: response,
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_id', featureFlag?.metadata?.id),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_version', featureFlag?.metadata?.version),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_reason', featureFlag?.reason?.description ?? featureFlag?.reason?.code),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_bootstrapped_response', bootstrappedResponse),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_bootstrapped_payload', bootstrappedPayload),
                $used_bootstrap_value: !this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].FlagsEndpointWasHit),
                ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["maybeAdd"])('$feature_flag_request_id', details.requestId)
            });
        }
        return response;
    }
    getFeatureFlagPayload(key) {
        const payloads = this.getFeatureFlagPayloads();
        if (!payloads) return;
        const response = payloads[key];
        if (void 0 === response) return null;
        return response;
    }
    getFeatureFlagPayloads() {
        return this.getFeatureFlagDetails()?.featureFlagPayloads;
    }
    getFeatureFlags() {
        return this.getFeatureFlagDetails()?.featureFlags;
    }
    getFeatureFlagDetails() {
        let details = this.getKnownFeatureFlagDetails();
        const overriddenFlags = this.getPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OverrideFeatureFlags);
        if (!overriddenFlags) return details;
        details = details ?? {
            featureFlags: {},
            featureFlagPayloads: {},
            flags: {}
        };
        const flags = details.flags ?? {};
        for(const key in overriddenFlags)if (overriddenFlags[key]) flags[key] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["updateFlagValue"])(flags[key], overriddenFlags[key]);
        else delete flags[key];
        const result = {
            ...details,
            flags
        };
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["normalizeFlagsResponse"])(result);
    }
    getFeatureFlagsAndPayloads() {
        const flags = this.getFeatureFlags();
        const payloads = this.getFeatureFlagPayloads();
        return {
            flags,
            payloads
        };
    }
    isFeatureEnabled(key) {
        const response = this.getFeatureFlag(key);
        if (void 0 === response) return;
        return !!response;
    }
    reloadFeatureFlags(options) {
        this.flagsAsync(true).then((res)=>{
            options?.cb?.(void 0, res?.featureFlags);
        }).catch((e)=>{
            options?.cb?.(e, void 0);
            if (!options?.cb) this._logger.info('Error reloading feature flags', e);
        });
    }
    async reloadRemoteConfigAsync() {
        return await this.remoteConfigAsync();
    }
    async reloadFeatureFlagsAsync(sendAnonDistinctId) {
        return (await this.flagsAsync(sendAnonDistinctId ?? true))?.featureFlags;
    }
    onFeatureFlags(cb) {
        return this.on('featureflags', async ()=>{
            const flags = this.getFeatureFlags();
            if (flags) cb(flags);
        });
    }
    onFeatureFlag(key, cb) {
        return this.on('featureflags', async ()=>{
            const flagResponse = this.getFeatureFlag(key);
            if (void 0 !== flagResponse) cb(flagResponse);
        });
    }
    async overrideFeatureFlag(flags) {
        this.wrap(()=>{
            if (null === flags) return this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OverrideFeatureFlags, null);
            return this.setPersistedProperty(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PostHogPersistedProperty"].OverrideFeatureFlags, flags);
        });
    }
    captureException(error, additionalProperties) {
        const properties = {
            $exception_level: 'error',
            $exception_list: [
                {
                    type: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainError"])(error) ? error.name : 'Error',
                    value: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainError"])(error) ? error.message : error,
                    mechanism: {
                        handled: true,
                        synthetic: false
                    }
                }
            ],
            ...additionalProperties
        };
        this.capture('$exception', properties);
    }
    captureTraceFeedback(traceId, userFeedback) {
        this.capture('$ai_feedback', {
            $ai_feedback_text: userFeedback,
            $ai_trace_id: String(traceId)
        });
    }
    captureTraceMetric(traceId, metricName, metricValue) {
        this.capture('$ai_metric', {
            $ai_metric_name: metricName,
            $ai_metric_value: String(metricValue),
            $ai_trace_id: String(traceId)
        });
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/chunk-ids.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "getFilenameToChunkIdMap",
    ()=>getFilenameToChunkIdMap
]);
let parsedStackResults;
let lastKeysCount;
let cachedFilenameChunkIds;
function getFilenameToChunkIdMap(stackParser) {
    const chunkIdMap = globalThis._posthogChunkIds;
    if (!chunkIdMap) return;
    const chunkIdKeys = Object.keys(chunkIdMap);
    if (cachedFilenameChunkIds && chunkIdKeys.length === lastKeysCount) return cachedFilenameChunkIds;
    lastKeysCount = chunkIdKeys.length;
    cachedFilenameChunkIds = chunkIdKeys.reduce((acc, stackKey)=>{
        if (!parsedStackResults) parsedStackResults = {};
        const result = parsedStackResults[stackKey];
        if (result) acc[result[0]] = result[1];
        else {
            const parsedStack = stackParser(stackKey);
            for(let i = parsedStack.length - 1; i >= 0; i--){
                const stackFrame = parsedStack[i];
                const filename = stackFrame?.filename;
                const chunkId = chunkIdMap[stackKey];
                if (filename && chunkId) {
                    acc[filename] = chunkId;
                    parsedStackResults[stackKey] = [
                        filename,
                        chunkId
                    ];
                    break;
                }
            }
        }
        return acc;
    }, {});
    return cachedFilenameChunkIds;
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "UNKNOWN_FUNCTION",
    ()=>UNKNOWN_FUNCTION,
    "createFrame",
    ()=>createFrame
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
const UNKNOWN_FUNCTION = '?';
function createFrame(filename, func, lineno, colno) {
    const frame = {
        platform: "web:javascript",
        filename,
        function: '<anonymous>' === func ? UNKNOWN_FUNCTION : func,
        in_app: true
    };
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUndefined"])(lineno)) frame.lineno = lineno;
    if (!(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUndefined"])(colno)) frame.colno = colno;
    return frame;
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/safari.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractSafariExtensionDetails",
    ()=>extractSafariExtensionDetails
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
;
const extractSafariExtensionDetails = (func, filename)=>{
    const isSafariExtension = -1 !== func.indexOf('safari-extension');
    const isSafariWebExtension = -1 !== func.indexOf('safari-web-extension');
    return isSafariExtension || isSafariWebExtension ? [
        -1 !== func.indexOf('@') ? func.split('@')[0] : __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"],
        isSafariExtension ? `safari-extension:${filename}` : `safari-web-extension:${filename}`
    ] : [
        func,
        filename
    ];
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/chrome.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chromeStackLineParser",
    ()=>chromeStackLineParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$safari$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/safari.mjs [app-route] (ecmascript)");
;
;
const chromeRegexNoFnName = /^\s*at (\S+?)(?::(\d+))(?::(\d+))\s*$/i;
const chromeRegex = /^\s*at (?:(.+?\)(?: \[.+\])?|.*?) ?\((?:address at )?)?(?:async )?((?:<anonymous>|[-a-z]+:|.*bundle|\/)?.*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
const chromeEvalRegex = /\((\S*)(?::(\d+))(?::(\d+))\)/;
const chromeStackLineParser = (line)=>{
    const noFnParts = chromeRegexNoFnName.exec(line);
    if (noFnParts) {
        const [, filename, line, col] = noFnParts;
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(filename, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"], +line, +col);
    }
    const parts = chromeRegex.exec(line);
    if (parts) {
        const isEval = parts[2] && 0 === parts[2].indexOf('eval');
        if (isEval) {
            const subMatch = chromeEvalRegex.exec(parts[2]);
            if (subMatch) {
                parts[2] = subMatch[1];
                parts[3] = subMatch[2];
                parts[4] = subMatch[3];
            }
        }
        const [func, filename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$safari$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractSafariExtensionDetails"])(parts[1] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"], parts[2]);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(filename, func, parts[3] ? +parts[3] : void 0, parts[4] ? +parts[4] : void 0);
    }
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/winjs.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "winjsStackLineParser",
    ()=>winjsStackLineParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
;
const winjsRegex = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:[-a-z]+):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
const winjsStackLineParser = (line)=>{
    const parts = winjsRegex.exec(line);
    return parts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(parts[2], parts[1] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"], +parts[3], parts[4] ? +parts[4] : void 0) : void 0;
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/gecko.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "geckoStackLineParser",
    ()=>geckoStackLineParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$safari$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/safari.mjs [app-route] (ecmascript)");
;
;
const geckoREgex = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)?((?:[-a-z]+)?:\/.*?|\[native code\]|[^@]*(?:bundle|\d+\.js)|\/[\w\-. /=]+)(?::(\d+))?(?::(\d+))?\s*$/i;
const geckoEvalRegex = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
const geckoStackLineParser = (line)=>{
    const parts = geckoREgex.exec(line);
    if (parts) {
        const isEval = parts[3] && parts[3].indexOf(' > eval') > -1;
        if (isEval) {
            const subMatch = geckoEvalRegex.exec(parts[3]);
            if (subMatch) {
                parts[1] = parts[1] || 'eval';
                parts[3] = subMatch[1];
                parts[4] = subMatch[2];
                parts[5] = '';
            }
        }
        let filename = parts[3];
        let func = parts[1] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"];
        [func, filename] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$safari$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractSafariExtensionDetails"])(func, filename);
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(filename, func, parts[4] ? +parts[4] : void 0, parts[5] ? +parts[5] : void 0);
    }
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/opera.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "opera10StackLineParser",
    ()=>opera10StackLineParser,
    "opera11StackLineParser",
    ()=>opera11StackLineParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
;
const opera10Regex = / line (\d+).*script (?:in )?(\S+)(?:: in function (\S+))?$/i;
const opera10StackLineParser = (line)=>{
    const parts = opera10Regex.exec(line);
    return parts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(parts[2], parts[3] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"], +parts[1]) : void 0;
};
const opera11Regex = / line (\d+), column (\d+)\s*(?:in (?:<anonymous function: ([^>]+)>|([^)]+))\(.*\))? in (.*):\s*$/i;
const opera11StackLineParser = (line)=>{
    const parts = opera11Regex.exec(line);
    return parts ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createFrame"])(parts[5], parts[3] || parts[4] || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"], +parts[1], +parts[2]) : void 0;
};
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/node.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "nodeStackLineParser",
    ()=>nodeStackLineParser
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
;
const FILENAME_MATCH = /^\s*[-]{4,}$/;
const FULL_MATCH = /at (?:async )?(?:(.+?)\s+\()?(?:(.+):(\d+):(\d+)?|([^)]+))\)?/;
const nodeStackLineParser = (line)=>{
    const lineMatch = line.match(FULL_MATCH);
    if (lineMatch) {
        let object;
        let method;
        let functionName;
        let typeName;
        let methodName;
        if (lineMatch[1]) {
            functionName = lineMatch[1];
            let methodStart = functionName.lastIndexOf('.');
            if ('.' === functionName[methodStart - 1]) methodStart--;
            if (methodStart > 0) {
                object = functionName.slice(0, methodStart);
                method = functionName.slice(methodStart + 1);
                const objectEnd = object.indexOf('.Module');
                if (objectEnd > 0) {
                    functionName = functionName.slice(objectEnd + 1);
                    object = object.slice(0, objectEnd);
                }
            }
            typeName = void 0;
        }
        if (method) {
            typeName = object;
            methodName = method;
        }
        if ('<anonymous>' === method) {
            methodName = void 0;
            functionName = void 0;
        }
        if (void 0 === functionName) {
            methodName = methodName || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"];
            functionName = typeName ? `${typeName}.${methodName}` : methodName;
        }
        let filename = lineMatch[2]?.startsWith('file://') ? lineMatch[2].slice(7) : lineMatch[2];
        const isNative = 'native' === lineMatch[5];
        if (filename?.match(/\/[A-Z]:/)) filename = filename.slice(1);
        if (!filename && lineMatch[5] && !isNative) filename = lineMatch[5];
        return {
            filename: filename ? decodeURI(filename) : void 0,
            module: void 0,
            function: functionName,
            lineno: _parseIntOrUndefined(lineMatch[3]),
            colno: _parseIntOrUndefined(lineMatch[4]),
            in_app: filenameIsInApp(filename || '', isNative),
            platform: "node:javascript"
        };
    }
    if (line.match(FILENAME_MATCH)) return {
        filename: line,
        platform: "node:javascript"
    };
};
function filenameIsInApp(filename, isNative = false) {
    const isInternal = isNative || filename && !filename.startsWith('/') && !filename.match(/^[A-Z]:/) && !filename.startsWith('.') && !filename.match(/^[a-zA-Z]([a-zA-Z0-9.\-+])*:\/\//);
    return !isInternal && void 0 !== filename && !filename.includes('node_modules/');
}
function _parseIntOrUndefined(input) {
    return parseInt(input || '', 10) || void 0;
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "createStackParser",
    ()=>createStackParser,
    "reverseAndStripFrames",
    ()=>reverseAndStripFrames
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/base.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$chrome$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/chrome.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$winjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/winjs.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$gecko$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/gecko.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$opera$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/opera.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/node.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
const WEBPACK_ERROR_REGEXP = /\(error: (.*)\)/;
const STACKTRACE_FRAME_LIMIT = 50;
function reverseAndStripFrames(stack) {
    if (!stack.length) return [];
    const localStack = Array.from(stack);
    localStack.reverse();
    return localStack.slice(0, STACKTRACE_FRAME_LIMIT).map((frame)=>({
            ...frame,
            filename: frame.filename || getLastStackFrame(localStack).filename,
            function: frame.function || __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$base$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["UNKNOWN_FUNCTION"]
        }));
}
function getLastStackFrame(arr) {
    return arr[arr.length - 1] || {};
}
function createStackParser(...parsers) {
    return (stack, skipFirstLines = 0)=>{
        const frames = [];
        const lines = stack.split('\n');
        for(let i = skipFirstLines; i < lines.length; i++){
            const line = lines[i];
            if (line.length > 1024) continue;
            const cleanedLine = WEBPACK_ERROR_REGEXP.test(line) ? line.replace(WEBPACK_ERROR_REGEXP, '$1') : line;
            if (!cleanedLine.match(/\S*Error: /)) {
                for (const parser of parsers){
                    const frame = parser(cleanedLine);
                    if (frame) {
                        frames.push(frame);
                        break;
                    }
                }
                if (frames.length >= STACKTRACE_FRAME_LIMIT) break;
            }
        }
        return reverseAndStripFrames(frames);
    };
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/error-properties-builder.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorPropertiesBuilder",
    ()=>ErrorPropertiesBuilder
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$chunk$2d$ids$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/chunk-ids.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript) <locals>");
;
;
;
const MAX_CAUSE_RECURSION = 4;
class ErrorPropertiesBuilder {
    constructor(coercers = [], parsers = [], modifiers = []){
        this.coercers = coercers;
        this.modifiers = modifiers;
        this.stackParser = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStackParser"])(...parsers);
    }
    buildFromUnknown(input, hint = {}) {
        const providedMechanism = hint && hint.mechanism;
        const mechanism = providedMechanism || {
            handled: true,
            type: 'generic'
        };
        const coercingContext = this.buildCoercingContext(mechanism, hint, 0);
        const exceptionWithCause = coercingContext.apply(input);
        const parsingContext = this.buildParsingContext();
        const exceptionWithStack = this.parseStacktrace(exceptionWithCause, parsingContext);
        const exceptionList = this.convertToExceptionList(exceptionWithStack, mechanism);
        return {
            $exception_list: exceptionList,
            $exception_level: 'error'
        };
    }
    async modifyFrames(exceptionList) {
        for (const exc of exceptionList)if (exc.stacktrace && exc.stacktrace.frames && (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isArray"])(exc.stacktrace.frames)) exc.stacktrace.frames = await this.applyModifiers(exc.stacktrace.frames);
        return exceptionList;
    }
    coerceFallback(ctx) {
        return {
            type: 'Error',
            value: 'Unknown error',
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
    }
    parseStacktrace(err, ctx) {
        let cause;
        if (null != err.cause) cause = this.parseStacktrace(err.cause, ctx);
        let stack;
        if ('' != err.stack && null != err.stack) stack = this.applyChunkIds(this.stackParser(err.stack, err.synthetic ? 1 : 0), ctx.chunkIdMap);
        return {
            ...err,
            cause,
            stack
        };
    }
    applyChunkIds(frames, chunkIdMap) {
        return frames.map((frame)=>{
            if (frame.filename && chunkIdMap) frame.chunk_id = chunkIdMap[frame.filename];
            return frame;
        });
    }
    applyCoercers(input, ctx) {
        for (const adapter of this.coercers)if (adapter.match(input)) return adapter.coerce(input, ctx);
        return this.coerceFallback(ctx);
    }
    async applyModifiers(frames) {
        let newFrames = frames;
        for (const modifier of this.modifiers)newFrames = await modifier(newFrames);
        return newFrames;
    }
    convertToExceptionList(exceptionWithStack, mechanism) {
        const currentException = {
            type: exceptionWithStack.type,
            value: exceptionWithStack.value,
            mechanism: {
                type: mechanism.type ?? 'generic',
                handled: mechanism.handled ?? true,
                synthetic: exceptionWithStack.synthetic ?? false
            }
        };
        if (exceptionWithStack.stack) currentException.stacktrace = {
            type: 'raw',
            frames: exceptionWithStack.stack
        };
        const exceptionList = [
            currentException
        ];
        if (null != exceptionWithStack.cause) exceptionList.push(...this.convertToExceptionList(exceptionWithStack.cause, {
            ...mechanism,
            handled: true
        }));
        return exceptionList;
    }
    buildParsingContext() {
        const context = {
            chunkIdMap: (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$chunk$2d$ids$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["getFilenameToChunkIdMap"])(this.stackParser)
        };
        return context;
    }
    buildCoercingContext(mechanism, hint, depth = 0) {
        const coerce = (input, depth)=>{
            if (!(depth <= MAX_CAUSE_RECURSION)) return;
            {
                const ctx = this.buildCoercingContext(mechanism, hint, depth);
                return this.applyCoercers(input, ctx);
            }
        };
        const context = {
            ...hint,
            syntheticException: 0 == depth ? hint.syntheticException : void 0,
            mechanism,
            apply: (input)=>coerce(input, depth),
            next: (input)=>coerce(input, depth + 1)
        };
        return context;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/dom-exception-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DOMExceptionCoercer",
    ()=>DOMExceptionCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
class DOMExceptionCoercer {
    match(err) {
        return this.isDOMException(err) || this.isDOMError(err);
    }
    coerce(err, ctx) {
        const hasStack = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isString"])(err.stack);
        return {
            type: this.getType(err),
            value: this.getValue(err),
            stack: hasStack ? err.stack : void 0,
            cause: err.cause ? ctx.next(err.cause) : void 0,
            synthetic: false
        };
    }
    getType(candidate) {
        return this.isDOMError(candidate) ? 'DOMError' : 'DOMException';
    }
    getValue(err) {
        const name = err.name || (this.isDOMError(err) ? 'DOMError' : 'DOMException');
        const message = err.message ? `${name}: ${err.message}` : name;
        return message;
    }
    isDOMException(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBuiltin"])(err, 'DOMException');
    }
    isDOMError(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBuiltin"])(err, 'DOMError');
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorCoercer",
    ()=>ErrorCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
class ErrorCoercer {
    match(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainError"])(err);
    }
    coerce(err, ctx) {
        return {
            type: this.getType(err),
            value: this.getMessage(err, ctx),
            stack: this.getStack(err),
            cause: err.cause ? ctx.next(err.cause) : void 0,
            synthetic: false
        };
    }
    getType(err) {
        return err.name || err.constructor.name;
    }
    getMessage(err, _ctx) {
        const message = err.message;
        if (message.error && 'string' == typeof message.error.message) return String(message.error.message);
        return String(message);
    }
    getStack(err) {
        return err.stacktrace || err.stack || void 0;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-event-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorEventCoercer",
    ()=>ErrorEventCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
class ErrorEventCoercer {
    constructor(){}
    match(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isErrorEvent"])(err) && void 0 != err.error;
    }
    coerce(err, ctx) {
        const exceptionLike = ctx.apply(err.error);
        if (!exceptionLike) return {
            type: 'ErrorEvent',
            value: err.message,
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
        return exceptionLike;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/string-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "StringCoercer",
    ()=>StringCoercer
]);
const ERROR_TYPES_PATTERN = /^(?:[Uu]ncaught (?:exception: )?)?(?:((?:Eval|Internal|Range|Reference|Syntax|Type|URI|)Error): )?(.*)$/i;
class StringCoercer {
    match(input) {
        return 'string' == typeof input;
    }
    coerce(input, ctx) {
        const [type, value] = this.getInfos(input);
        return {
            type: type ?? 'Error',
            value: value ?? input,
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
    }
    getInfos(candidate) {
        let type = 'Error';
        let value = candidate;
        const groups = candidate.match(ERROR_TYPES_PATTERN);
        if (groups) {
            type = groups[1];
            value = groups[2];
        }
        return [
            type,
            value
        ];
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/types.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "severityLevels",
    ()=>severityLevels
]);
const severityLevels = [
    'fatal',
    'error',
    'warning',
    'log',
    'info',
    'debug'
];
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "extractExceptionKeysForMessage",
    ()=>extractExceptionKeysForMessage,
    "truncate",
    ()=>truncate
]);
function truncate(str, max = 0) {
    if ('string' != typeof str || 0 === max) return str;
    return str.length <= max ? str : `${str.slice(0, max)}...`;
}
function extractExceptionKeysForMessage(err, maxLength = 40) {
    const keys = Object.keys(err);
    keys.sort();
    if (!keys.length) return '[object has no keys]';
    for(let i = keys.length; i > 0; i--){
        const serialized = keys.slice(0, i).join(', ');
        if (!(serialized.length > maxLength)) {
            if (i === keys.length) return serialized;
            return serialized.length <= maxLength ? serialized : `${serialized.slice(0, maxLength)}...`;
        }
    }
    return '';
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/object-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ObjectCoercer",
    ()=>ObjectCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/utils.mjs [app-route] (ecmascript)");
;
;
;
class ObjectCoercer {
    match(candidate) {
        return 'object' == typeof candidate && null !== candidate;
    }
    coerce(candidate, ctx) {
        const errorProperty = this.getErrorPropertyFromObject(candidate);
        if (errorProperty) return ctx.apply(errorProperty);
        return {
            type: this.getType(candidate),
            value: this.getValue(candidate),
            stack: ctx.syntheticException?.stack,
            level: this.isSeverityLevel(candidate.level) ? candidate.level : 'error',
            synthetic: true
        };
    }
    getType(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEvent"])(err) ? err.constructor.name : 'Error';
    }
    getValue(err) {
        if ('name' in err && 'string' == typeof err.name) {
            let message = `'${err.name}' captured as exception`;
            if ('message' in err && 'string' == typeof err.message) message += ` with message: '${err.message}'`;
            return message;
        }
        if ('message' in err && 'string' == typeof err.message) return err.message;
        const className = this.getObjectClassName(err);
        const keys = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractExceptionKeysForMessage"])(err);
        return `${className && 'Object' !== className ? `'${className}'` : 'Object'} captured as exception with keys: ${keys}`;
    }
    isSeverityLevel(x) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isString"])(x) && !(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEmptyString"])(x) && __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["severityLevels"].indexOf(x) >= 0;
    }
    getErrorPropertyFromObject(obj) {
        for(const prop in obj)if (Object.prototype.hasOwnProperty.call(obj, prop)) {
            const value = obj[prop];
            if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isError"])(value)) return value;
        }
    }
    getObjectClassName(obj) {
        try {
            const prototype = Object.getPrototypeOf(obj);
            return prototype ? prototype.constructor.name : void 0;
        } catch (e) {
            return;
        }
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/event-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "EventCoercer",
    ()=>EventCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/utils.mjs [app-route] (ecmascript)");
;
;
class EventCoercer {
    match(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEvent"])(err);
    }
    coerce(evt, ctx) {
        const constructorName = evt.constructor.name;
        return {
            type: constructorName,
            value: `${constructorName} captured as exception with keys: ${(0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["extractExceptionKeysForMessage"])(evt)}`,
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/primitive-coercer.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PrimitiveCoercer",
    ()=>PrimitiveCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
class PrimitiveCoercer {
    match(candidate) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrimitive"])(candidate);
    }
    coerce(value, ctx) {
        return {
            type: 'Error',
            value: `Primitive value captured as exception: ${String(value)}`,
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/promise-rejection-event.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "PromiseRejectionEventCoercer",
    ()=>PromiseRejectionEventCoercer
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
;
class PromiseRejectionEventCoercer {
    match(err) {
        return (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBuiltin"])(err, 'PromiseRejectionEvent');
    }
    coerce(err, ctx) {
        const reason = this.getUnhandledRejectionReason(err);
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrimitive"])(reason)) return {
            type: 'UnhandledRejection',
            value: `Non-Error promise rejection captured with value: ${String(reason)}`,
            stack: ctx.syntheticException?.stack,
            synthetic: true
        };
        return ctx.apply(reason);
    }
    getUnhandledRejectionReason(error) {
        if ((0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrimitive"])(error)) return error;
        try {
            if ('reason' in error) return error.reason;
            if ('detail' in error && 'reason' in error.detail) return error.detail.reason;
        } catch  {}
        return error;
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$dom$2d$exception$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/dom-exception-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-event-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$string$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/string-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$object$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/object-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/event-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$primitive$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/primitive-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$promise$2d$rejection$2d$event$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/promise-rejection-event.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/utils.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ReduceableCache",
    ()=>ReduceableCache
]);
class ReduceableCache {
    constructor(_maxSize){
        this._maxSize = _maxSize;
        this._cache = new Map();
    }
    get(key) {
        const value = this._cache.get(key);
        if (void 0 === value) return;
        this._cache.delete(key);
        this._cache.set(key, value);
        return value;
    }
    set(key, value) {
        this._cache.set(key, value);
    }
    reduce() {
        while(this._cache.size >= this._maxSize){
            const value = this._cache.keys().next().value;
            if (value) this._cache.delete(value);
        }
    }
}
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$error$2d$properties$2d$builder$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/error-properties-builder.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/utils.mjs [app-route] (ecmascript)");
;
;
;
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "chromeStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$chrome$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chromeStackLineParser"],
    "createStackParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["createStackParser"],
    "geckoStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$gecko$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["geckoStackLineParser"],
    "nodeStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nodeStackLineParser"],
    "opera10StackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$opera$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["opera10StackLineParser"],
    "opera11StackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$opera$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["opera11StackLineParser"],
    "reverseAndStripFrames",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["reverseAndStripFrames"],
    "winjsStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$winjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["winjsStackLineParser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$chrome$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/chrome.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$winjs$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/winjs.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$gecko$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/gecko.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$opera$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/opera.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$node$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/node.mjs [app-route] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DOMExceptionCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$dom$2d$exception$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DOMExceptionCoercer"],
    "ErrorCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorCoercer"],
    "ErrorEventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorEventCoercer"],
    "EventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EventCoercer"],
    "ObjectCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$object$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectCoercer"],
    "PrimitiveCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$primitive$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrimitiveCoercer"],
    "PromiseRejectionEventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$promise$2d$rejection$2d$event$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromiseRejectionEventCoercer"],
    "StringCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$string$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StringCoercer"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$dom$2d$exception$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/dom-exception-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$error$2d$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/error-event-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$string$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/string-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$object$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/object-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$event$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/event-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$primitive$2d$coercer$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/primitive-coercer.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$promise$2d$rejection$2d$event$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/promise-rejection-event.mjs [app-route] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "DOMExceptionCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DOMExceptionCoercer"],
    "ErrorCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorCoercer"],
    "ErrorEventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorEventCoercer"],
    "ErrorPropertiesBuilder",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$error$2d$properties$2d$builder$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ErrorPropertiesBuilder"],
    "EventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["EventCoercer"],
    "ObjectCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ObjectCoercer"],
    "PrimitiveCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PrimitiveCoercer"],
    "PromiseRejectionEventCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromiseRejectionEventCoercer"],
    "ReduceableCache",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["ReduceableCache"],
    "StringCoercer",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["StringCoercer"],
    "chromeStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["chromeStackLineParser"],
    "createStackParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["createStackParser"],
    "geckoStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["geckoStackLineParser"],
    "nodeStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["nodeStackLineParser"],
    "opera10StackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["opera10StackLineParser"],
    "opera11StackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["opera11StackLineParser"],
    "reverseAndStripFrames",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["reverseAndStripFrames"],
    "winjsStackLineParser",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["winjsStackLineParser"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$error$2d$properties$2d$builder$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/error-properties-builder.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$parsers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/parsers/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$coercers$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/coercers/index.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/utils.mjs [app-route] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/index.mjs [app-route] (ecmascript) <locals>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$featureFlagUtils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/featureFlagUtils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$vendor$2f$uuidv7$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/vendor/uuidv7.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$posthog$2d$core$2d$stateless$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/posthog-core-stateless.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$types$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/types.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript)");
;
;
;
;
;
;
;
;
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript) <export * as ErrorTracking>", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "ErrorTracking",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$error$2d$tracking$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/error-tracking/index.mjs [app-route] (ecmascript)");
}),
"[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BucketedRateLimiter",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bucketed$2d$rate$2d$limiter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["BucketedRateLimiter"],
    "DEFAULT_BLOCKED_UA_STRS",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["DEFAULT_BLOCKED_UA_STRS"],
    "PromiseQueue",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$promise$2d$queue$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["PromiseQueue"],
    "STRING_FORMAT",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["STRING_FORMAT"],
    "allSettled",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["allSettled"],
    "assert",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["assert"],
    "clampToRange",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["clampToRange"],
    "currentISOTime",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentISOTime"],
    "currentTimestamp",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["currentTimestamp"],
    "getFetch",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getFetch"],
    "hasOwnProperty",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["hasOwnProperty"],
    "includes",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["includes"],
    "isArray",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isArray"],
    "isBlockedUA",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBlockedUA"],
    "isBoolean",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBoolean"],
    "isBuiltin",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isBuiltin"],
    "isDistinctIdStringLike",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isDistinctIdStringLike"],
    "isEmptyObject",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEmptyObject"],
    "isEmptyString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEmptyString"],
    "isError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isError"],
    "isErrorEvent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isErrorEvent"],
    "isEvent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isEvent"],
    "isFile",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFile"],
    "isFormData",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFormData"],
    "isFunction",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isFunction"],
    "isInstanceOf",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isInstanceOf"],
    "isKnownUnsafeEditableEvent",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isKnownUnsafeEditableEvent"],
    "isNativeFunction",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNativeFunction"],
    "isNoLike",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNoLike"],
    "isNull",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNull"],
    "isNullish",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNullish"],
    "isNumber",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isNumber"],
    "isObject",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isObject"],
    "isPlainError",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainError"],
    "isPlainObject",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPlainObject"],
    "isPrimitive",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isPrimitive"],
    "isPromise",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["isPromise"],
    "isString",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isString"],
    "isUndefined",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isUndefined"],
    "isYesLike",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["isYesLike"],
    "noLikeValues",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["noLikeValues"],
    "removeTrailingSlash",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["removeTrailingSlash"],
    "retriable",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["retriable"],
    "safeSetTimeout",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__["safeSetTimeout"],
    "stripLeadingDollar",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["stripLeadingDollar"],
    "trim",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["trim"],
    "yesLikeValues",
    ()=>__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__["yesLikeValues"]
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$index$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/index.mjs [app-route] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bot$2d$detection$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bot-detection.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$bucketed$2d$rate$2d$limiter$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/bucketed-rate-limiter.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$number$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/number-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$string$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/string-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$type$2d$utils$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/type-utils.mjs [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f2e$pnpm$2f40$posthog$2b$core$40$1$2e$5$2e$2$2f$node_modules$2f40$posthog$2f$core$2f$dist$2f$utils$2f$promise$2d$queue$2e$mjs__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/.pnpm/@posthog+core@1.5.2/node_modules/@posthog/core/dist/utils/promise-queue.mjs [app-route] (ecmascript)");
}),
];

//# sourceMappingURL=b79b4_%40posthog_core_dist_6d2548a5._.js.map