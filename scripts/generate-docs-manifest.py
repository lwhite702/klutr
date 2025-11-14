#!/usr/bin/env python3

"""
Scans repo for markdown and docs-like files and produces docs/manifest.json.

Usage:
  python3 scripts/generate-docs-manifest.py --out docs/manifest.json
"""

import os, json, argparse, datetime

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

EXTERNAL_KEYWORDS = ["getting-started", "support", "faq", "features", "how-to", "guide", "tutorial"]

INTERNAL_KEYWORDS = ["deploy", "deployment", "doppler", "sre", "runbook", "internal", "reports", "architecture", "migrations"]

def classify(path):
    p = path.lower()
    
    for k in INTERNAL_KEYWORDS:
        if k in p:
            return "internal"
    
    for k in EXTERNAL_KEYWORDS:
        if k in p:
            return "external"
    
    # fallback - heuristics
    if p.startswith("docs/") or p.startswith("mintlify/") or "support" in p or "faq" in p:
        return "external"
    
    return "internal"

def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--out", default="docs/manifest.json")
    args = parser.parse_args()
    
    results = []
    
    for dirpath, _, filenames in os.walk(ROOT):
        # Skip node_modules, .next, and other build artifacts
        if any(skip in dirpath for skip in ["node_modules", ".next", ".git", "dist", "build"]):
            continue
            
        for fn in filenames:
            if fn.endswith((".md", ".markdown", ".mdx")):
                full = os.path.join(dirpath, fn)
                rel = os.path.relpath(full, ROOT)
                
                category = classify(rel)
                
                # recommended target
                if category == "external":
                    target = os.path.join("docs", "external", os.path.basename(rel))
                else:
                    target = os.path.join("docs", "internal", os.path.basename(rel))
                
                results.append({
                    "path": rel.replace("\\","/"),
                    "target": target.replace("\\","/"),
                    "category": category
                })
    
    manifest = {
        "generated_at": datetime.datetime.utcnow().isoformat()+"Z",
        "summary": "Auto-generated docs manifest",
        "files": results
    }
    
    outdir = os.path.dirname(args.out)
    if outdir and not os.path.exists(outdir):
        os.makedirs(outdir)
    
    with open(args.out, "w") as fh:
        json.dump(manifest, fh, indent=2)
    
    print("Wrote manifest to", args.out)
    print(f"Found {len(results)} files")

if __name__ == "__main__":
    main()

