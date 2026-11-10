#!/usr/bin/env node
// Keep one canonical implementation in the bootstrap payload.
// This entry point lets the Devkit repository use the same checker.
import "../../bootstrap/template/.devkit/scripts/repository-hygiene/check.mjs";
