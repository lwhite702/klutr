(globalThis.TURBOPACK || (globalThis.TURBOPACK = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/app/app/stacks/page.tsx [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

import { jsxDEV as _jsxDEV } from "react/jsx-dev-runtime";
var _s = __turbopack_context__.k.signature();
"use client";
import { useState, useRef } from "react";
import { AppShell } from "@/components/layout/AppShell";
import { PageHeader } from "@/components/ui/PageHeader";
import { CardGrid } from "@/components/ui/CardGrid";
import { ItemCard } from "@/components/ui/ItemCard";
import { SectionSummary } from "@/components/ui/SectionSummary";
import { TourCallout } from "@/components/tour/TourCallout";
import { useSectionOnboarding } from "@/lib/hooks/useSectionOnboarding";
import { getOnboardingSteps } from "@/lib/onboardingSteps";
import { Button } from "@/components/ui/button";
import { mockStacks } from "@/lib/mockData";
export default function SmartStacksPage() {
    _s();
    const [stacks, setStacks] = useState(mockStacks);
    const stacksRef = useRef(null);
    const tagsRef = useRef(null);
    const onboarding = useSectionOnboarding({
        section: "stacks",
        steps: getOnboardingSteps("stacks").map({
            "SmartStacksPage.useSectionOnboarding[onboarding]": (step, idx)=>{
                if (idx === 0) return {
                    ...step,
                    targetRef: stacksRef
                };
                if (idx === 1) return {
                    ...step,
                    targetRef: tagsRef
                };
                return step;
            }
        }["SmartStacksPage.useSectionOnboarding[onboarding]"])
    });
    const handleStackClick = (stackName)=>{
        console.log("TODO: Navigate to stack detail", stackName);
        // For now, navigate to a mock stack detail page
        window.location.href = `/app/stacks/${stackName.toLowerCase().replace(/\s+/g, "-")}`;
    };
    const handleStackFavorite = (stackId)=>{
        console.log("TODO: Toggle favorite for stack", stackId);
        setStacks(stacks.map((stack)=>stack.id === stackId ? {
                ...stack,
                pinned: !stack.pinned
            } : stack));
    };
    return /*#__PURE__*/ _jsxDEV(AppShell, {
        activeRoute: "/app/stacks",
        children: /*#__PURE__*/ _jsxDEV("div", {
            className: "max-w-5xl mx-auto space-y-6",
            children: [
                /*#__PURE__*/ _jsxDEV(PageHeader, {
                    title: "Stacks",
                    description: "Your saved collections.",
                    actions: !onboarding.active && /*#__PURE__*/ _jsxDEV(Button, {
                        variant: "outline",
                        size: "sm",
                        onClick: onboarding.startOnboarding,
                        children: "Take tour"
                    }, void 0, false, {
                        fileName: "[project]/app/app/stacks/page.tsx",
                        lineNumber: 54,
                        columnNumber: 15
                    }, void 0)
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 49,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV(SectionSummary, {
                    section: "stacks",
                    summary: "Collections of related notes organized by tags and categories. Pin important stacks for quick access."
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 65,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    ref: stacksRef,
                    "data-onboarding": "stacks",
                    className: "relative",
                    children: onboarding.active && onboarding.currentStep && onboarding.step === 0 && /*#__PURE__*/ _jsxDEV(TourCallout, {
                        title: onboarding.currentStep.title,
                        description: onboarding.currentStep.description,
                        position: onboarding.currentStep.position,
                        onNext: onboarding.nextStep,
                        onClose: onboarding.endOnboarding,
                        showNext: !onboarding.isLastStep
                    }, void 0, false, {
                        fileName: "[project]/app/app/stacks/page.tsx",
                        lineNumber: 74,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 70,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV("div", {
                    ref: tagsRef,
                    "data-onboarding": "tags",
                    className: "relative",
                    children: onboarding.active && onboarding.currentStep && onboarding.step === 1 && /*#__PURE__*/ _jsxDEV(TourCallout, {
                        title: onboarding.currentStep.title,
                        description: onboarding.currentStep.description,
                        position: onboarding.currentStep.position,
                        onNext: onboarding.nextStep,
                        onClose: onboarding.endOnboarding,
                        showNext: !onboarding.isLastStep
                    }, void 0, false, {
                        fileName: "[project]/app/app/stacks/page.tsx",
                        lineNumber: 89,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 85,
                    columnNumber: 9
                }, this),
                /*#__PURE__*/ _jsxDEV(CardGrid, {
                    children: stacks.map((stack)=>/*#__PURE__*/ _jsxDEV(ItemCard, {
                            title: stack.name,
                            description: stack.description,
                            tags: stack.tags,
                            pinned: stack.pinned,
                            onClick: ()=>handleStackClick(stack.name),
                            onFavorite: ()=>handleStackFavorite(stack.id)
                        }, stack.id, false, {
                            fileName: "[project]/app/app/stacks/page.tsx",
                            lineNumber: 102,
                            columnNumber: 13
                        }, this))
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 100,
                    columnNumber: 9
                }, this),
                onboarding.active && onboarding.currentStep && onboarding.step === 2 && /*#__PURE__*/ _jsxDEV("div", {
                    className: "relative",
                    "data-onboarding": "pin-button",
                    children: /*#__PURE__*/ _jsxDEV(TourCallout, {
                        title: onboarding.currentStep.title,
                        description: onboarding.currentStep.description,
                        position: onboarding.currentStep.position,
                        onNext: onboarding.nextStep,
                        onClose: onboarding.endOnboarding,
                        showNext: !onboarding.isLastStep
                    }, void 0, false, {
                        fileName: "[project]/app/app/stacks/page.tsx",
                        lineNumber: 118,
                        columnNumber: 15
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 117,
                    columnNumber: 13
                }, this),
                stacks.length === 0 && /*#__PURE__*/ _jsxDEV("div", {
                    className: "text-center py-12 text-muted-foreground",
                    children: /*#__PURE__*/ _jsxDEV("p", {
                        children: 'No stacks yet. Create some notes and run "Re-cluster now" to generate stacks.'
                    }, void 0, false, {
                        fileName: "[project]/app/app/stacks/page.tsx",
                        lineNumber: 131,
                        columnNumber: 13
                    }, this)
                }, void 0, false, {
                    fileName: "[project]/app/app/stacks/page.tsx",
                    lineNumber: 130,
                    columnNumber: 11
                }, this)
            ]
        }, void 0, true, {
            fileName: "[project]/app/app/stacks/page.tsx",
            lineNumber: 48,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/app/app/stacks/page.tsx",
        lineNumber: 47,
        columnNumber: 5
    }, this);
}
_s(SmartStacksPage, "n2HVPUU7ejHqC5FVJQ2C7H+XE8Q=", false, function() {
    return [
        useSectionOnboarding
    ];
});
_c = SmartStacksPage;
var _c;
__turbopack_context__.k.register(_c, "SmartStacksPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=app_app_stacks_page_tsx_4598337c._.js.map