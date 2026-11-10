# Curated External Resource Catalog

This is the human-readable index. Full structured records live in
`catalog/resources.yaml`. The SQLite registry in `core/resource-registry/`
stores larger working sets and duplicate-review history.

All entries are candidates. Inclusion is not endorsement. Review licensing,
maintenance, security, compatibility, and task fit before approving or using
any resource.

## General engineering references

| Resource | Main value | Qualification |
|---|---|---|
| [Awesome](https://github.com/sindresorhus/awesome) | Topic-specific curated indexes | Discovery source only; verify individual projects. |
| [TheAlgorithms/Python](https://github.com/TheAlgorithms/Python) | Algorithm and data-structure examples | Educational reference, not production-ready by default. |
| [Build Your Own X](https://github.com/codecrafters-io/build-your-own-x) | Build systems from first principles | Tutorials can have project-specific rights. |
| [Free for Dev](https://github.com/ripienaar/free-for-dev) | Developer services with free tiers | Pricing and limits change often. |
| [Free Programming Books](https://github.com/EbookFoundation/free-programming-books) | Programming books | Verify rights and availability for each linked work. |
| [Developer Roadmap](https://github.com/nilbuild/developer-roadmap) | Role and topic learning paths | Supplied shortened URL resolved to this repository; verify continuity before approval. |
| [OSSU Computer Science](https://github.com/ossu/computer-science) | Structured CS curriculum | Verify current course availability. |
| [Engineering Blogs](https://github.com/kilimchoi/engineering-blogs) | Engineering blogs and case studies | Link index, not vetted guidance. |
| [System Design Primer](https://github.com/donnemartin/system-design-primer) | System design study | Cross-check design claims against current practice. |
| [Public APIs](https://github.com/public-apis/public-apis) | API discovery | Validate terms, uptime, rate limits, and data rights. |
| [Open Source Alternatives](https://github.com/btw-so/open-source-alternatives) | Open alternatives discovery | Check maturity and feature parity. |
| [Papers We Love](https://github.com/papers-we-love/papers-we-love) | Foundational CS papers | Paper rights differ from repository license. |
| [Best Websites a Programmer Should Visit](https://github.com/sdmg15/Best-websites-a-programmer-should-visit) | Programming websites index | Archived; retain as historical discovery only. |
| [LLMs From Scratch](https://github.com/rasbt/LLMs-from-scratch) | LLM internals | Check version and dependencies. |
| [ML From Scratch](https://github.com/eriklindernoren/ML-From-Scratch) | Educational ML implementations | Validate algorithms and numerical assumptions. |
| [Made With ML](https://github.com/GokuMohandas/Made-With-ML) | ML engineering and MLOps | Verify current framework versions. |

## Security, learning, and AI engineering

| Resource | Main value | Qualification |
|---|---|---|
| [OWASP ASVS](https://github.com/OWASP/ASVS) | Application security requirements | Use as a baseline, not proof of security. |
| [OWASP Cheat Sheet Series](https://github.com/OWASP/CheatSheetSeries) | Secure-development guidance | Select controls for the real threat model. |
| [Project Based Learning](https://github.com/practical-tutorials/project-based-learning) | Build real projects | Tutorial quality varies. |
| [Coding Interview University](https://github.com/jwasham/coding-interview-university) | CS and interview study plan | Learning resource, not a hiring guarantee. |
| [Generative AI for Beginners](https://github.com/microsoft/generative-ai-for-beginners) | GenAI application lessons | Provider APIs can change. |
| [Trail of Bits Skills](https://github.com/trailofbits/skills) | Agent-assisted security work | Inspect individual skill instructions before use. |

## Agent workflows, memory, and control surfaces

| Resource | Main value | Why it is relevant |
|---|---|---|
| [GitHub Spec Kit](https://github.com/github/spec-kit) | Spec-driven and composable agent workflows | Strong reference for process definitions, templates, quality gates, and extension points. |
| [Matt Pocock Skills](https://github.com/mattpocock/skills) | Engineering and productivity skills | Evaluate individual skills for TDD, code review, domain modelling, and architecture. Avoid duplicate installation. |
| [Claude-Mem](https://github.com/thedotmack/claude-mem) | Cross-session agent memory | Reference for observation capture and progressive retrieval; review telemetry and storage boundaries. |
| [OpenMausBot](https://github.com/milind-soni/OpenMausBot) | Local-first agent team workspace and MCP control plane | Compare with Devkit orchestration; do not clone its desktop app. |
| [T3 Code](https://github.com/pingdotgg/t3code) | Multi-harness agent control surface | Useful for interoperability and UX patterns; not itself an agent harness. |
| [Scrapling](https://github.com/D4Vinci/Scrapling) | HTTP/browser acquisition and parsing | Optional research connector; browser extras need sandboxing. |
| [NVIDIA Auto Ontology](https://github.com/NVIDIA/auto-ontology) | Semantic ontology and grounded data context | Optional enterprise integration; substantial infrastructure and model requirements. |

## Frontend specialist

| Resource | Main value | Qualification |
|---|---|---|
| [Hallmark](https://github.com/Nutlope/hallmark) | Frontend design skill, accessibility floor, visual checks | Optional for frontend tasks only. Compare skill-level overlap before adopting. |

## Explicit exclusions

- [Ziwei Doushu](https://github.com/Renhuai123/ziwei-doushu): astrology-specific charting system. Not a general Devkit engineering capability.
- [Claude Code Game Studios](https://github.com/Donchitos/Claude-Code-Game-Studios): game-development agent template. Too domain-specific for the core catalog; revisit only for game-development specialisation.
- Google Engineering Practices: repository archived. Its documents may still be useful as a historical reference.

## Rules

- Discovery candidates are not approved recommendations.
- Do not equate stars with quality.
- Verify upstream activity, releases, advisories, license, and terms.
- A repository license does not automatically cover linked books, papers, photos, datasets, APIs, or websites.
- Do not copy or execute catalog content automatically.
- Compare capabilities at the component or skill level, not only at repository level.
- Mark stale entries; do not silently delete them.
