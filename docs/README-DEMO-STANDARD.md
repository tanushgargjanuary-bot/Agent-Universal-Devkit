# README Demonstration Standard

## Purpose
A repository README must show what the project does. A new user should not need to inspect the entire source tree to understand the product.

This standard applies to new repositories, substantial new projects, and major user-facing features in repositories managed by DEVKIT.

## Required outcome
Every new project must make a serious attempt to include at least one real, useful demonstration in its README. Choose the format that best fits the project:

1. **Animated GIF — preferred for short workflows.** Capture the real application or command in use. Show a complete, understandable path from input to result.
2. **Screenshots — preferred for static interfaces and detailed states.** Show the real interface, output, architecture, or result.
3. **Video — use when motion, audio, or a longer workflow cannot be shown clearly in a GIF.** Link or embed it through a host supported by the repository platform.
4. **Interactive demo — use when interaction materially improves understanding.** Examples include a live demo, Storybook, playground, notebook, API explorer, or browser-based example. Link to a working destination.
5. **Project-appropriate alternative.** For CLI tools, show a terminal recording or realistic command/output example. For libraries and APIs, show a runnable example and request/response. For data or ML projects, show a real plot, notebook, or evaluation output. For infrastructure, show a useful architecture or deployment view.

An animated GIF is not mandatory when it is a poor fit. A screenshot, video, interactive demo, terminal capture, notebook, or runnable example is acceptable when it communicates the real behaviour better.

## Capture quality
- Capture the actual working project, not a mock-up of an unimplemented feature.
- Show the primary user journey. Prefer one short, complete workflow over a long montage.
- Use a clean viewport, readable text, sensible cropping, and consistent scale.
- Remove desktop clutter and avoid unnecessary cursor movement or pauses.
- Use synthetic or public-safe data. Never expose credentials, tokens, private URLs, personal data, customer data, or internal hostnames.
- Add useful alt text and a short caption. Explain what the viewer should notice.
- Optimise GIF dimensions, frame rate, palette, and duration. Aim for a short loop and a file below 10 MB where practical. Do not sacrifice readability to hit a size target.
- Prefer a video link over a huge or unreadable GIF.
- Store local assets in a clear location such as `docs/assets/` or `assets/`. Use relative links where possible.
- Keep the README useful if images fail to load. Include text steps and commands.

## README placement
Put a **Demo** or **Screenshots** section near the top, after the project summary and before long setup details.

Include the GIF, screenshot, video, interactive demo link, or project-appropriate alternative; one sentence that describes it; a live demo or runnable example link when one exists; and a quick-start path so readers can reproduce the result.

Example:

```md
## Demo

![Animated demonstration of the main workflow](docs/assets/main-workflow.gif)

The demo shows how a user submits a task and reviews the generated result.

[Try the live demo](https://example.com/demo) · [Run it locally](#quick-start)
```

Replace the example URL and asset with verified project resources. Never leave placeholder links in a finished README.

## Interactive content and platform limits
A GitHub README is not a general-purpose application host. Do not rely on custom JavaScript, arbitrary HTML scripts, or embedded applications that the platform blocks. Link to a separately hosted, working interactive experience when needed. Keep the README readable without the interactive service.

Do not publish a live demo until its access controls, data handling, costs, and exposed functionality are reviewed. A demo must not provide access to private systems or production data.

## Definition of done
Before declaring a new project or major user-facing feature complete, the agent must:
1. Run the project and confirm the demonstrated path works, where safe and possible.
2. Capture the highest-quality suitable demo artifact.
3. Add it to the README with useful alt text, caption, and reproduction instructions.
4. Check that all local assets exist and links are correct.
5. Check that the GIF or media is legible and reasonably sized.
6. Confirm the media contains no secrets or private data.
7. Record the demo format and any limitation in the work log.

If the project cannot reasonably produce a visual or interactive demonstration, the agent must state why and add the best available alternative, such as a tested terminal transcript, runnable code example, API example, notebook, or architecture diagram. Do not block a valid non-visual project on an unsuitable GIF.

## Automated checks and limitations
DEVKIT's initial repo-scan detects a limited set of README media and demo-link signals. It can report when no recognised signal is present. It does not render images, inspect visual quality, verify external links, prove that a demo is functional, or detect every valid README format. Human or agent review remains required.
