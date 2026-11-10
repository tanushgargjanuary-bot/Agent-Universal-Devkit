# README Demonstration Standard

A repository README must show what the project does. A new user should not need to inspect the entire source tree to understand the product.

## Required outcome

Every new repository and every major user-facing feature must include at least one real, useful demonstration in its README. A prose claim such as "fast", "secure", or "easy to use" is not a demonstration.

**Default to the highest-quality suitable animated GIF for a short, visually demonstrable workflow.** Agents must make an active attempt to capture the real application or command in use. Show a complete path from input to meaningful result. Do not replace this with a static mock-up just because a GIF takes more work.

Choose another format when it communicates the real behaviour better:

1. **Screenshots:** static interfaces, detailed states, dashboards, output, or visual results.
2. **Video:** longer workflows, audio, or motion that cannot be shown clearly in a short GIF.
3. **Interactive demo:** a working live demo, Storybook, playground, notebook, API explorer, or browser example when interaction materially improves understanding.
4. **CLI and developer tools:** a real terminal recording, a reproducible command with representative output, or a runnable example.
5. **Libraries and APIs:** a working code sample, request/response pair, generated documentation, or executable example.
6. **Data and research projects:** a real plot, notebook, sample analysis, or reproducible report.
7. **Infrastructure and systems:** an accurate architecture, deployment, or data-flow diagram, plus a working command or environment example where possible.

At least one tangible demonstration artifact or runnable alternative must appear in the README. An animated GIF is not mandatory when it is technically infeasible, unsafe, inaccessible, or a poor fit. In that case, the agent must state the reason and provide the best project-appropriate alternative. Do not block a valid non-visual project on an unsuitable GIF.

## Quality requirements

- Capture the actual working project and its current behaviour. Do not fabricate screens, output, data, performance, or features.
- Show a complete, useful user journey. Avoid a decorative logo animation that does not demonstrate the product.
- Keep text readable. Crop unnecessary desktop areas. Use a stable viewport and legible font size.
- Keep GIF duration and file size reasonable. Optimise dimensions, frame rate, palette, and loop. Aim below 10 MB where practical, but never sacrifice readability to meet a size target.
- Prefer a hosted video over a huge or unreadable GIF.
- Use representative data. Remove secrets, personal data, private URLs, access tokens, and internal production details.
- Add meaningful alt text, a short caption, and exact reproduction steps.
- Verify every local asset path and external link. Open the final media and check that it loads and shows the intended result.
- Keep the README useful when images or external services fail. Include text steps and commands.

## README placement

Put a **Demo**, **Screenshots**, or **Examples** section near the top, after the project summary and before long setup details.

Include the real GIF, screenshot, video, interactive demo link, or project-appropriate alternative; one sentence that explains it; a live demo or runnable example link when one exists; and a quick-start path so readers can reproduce the result.

## Safe example pattern

Use real paths and verified destinations. This is a pattern only; replace the descriptive text and asset path with resources created for the project.

```markdown
## Demo

![Describe the actual workflow shown](docs/assets/actual-workflow.gif)

The demo shows [the real user action] and [the real result].

[Run it locally](#quick-start)
```

Never leave placeholder assets, example.com URLs, dead links, or unverified claims in a finished README.

## Interactive content and platform limits

A GitHub README is not a general-purpose application host. Do not rely on custom JavaScript, arbitrary HTML scripts, or embedded applications that the platform blocks. Link to a separately hosted, working interactive experience when needed. Keep the README readable without the interactive service.

Do not publish a live demo until its access controls, data handling, costs, and exposed functionality are reviewed. A demo must not provide access to private systems or production data.

## Completion checklist

1. Identify the main user workflow and select the best demonstration format.
2. Run the project and confirm the demonstrated path works, where safe and possible.
3. For short visual workflows, actively attempt to capture the highest-quality suitable animated GIF.
4. If another format is better or a GIF is not feasible, record the reason and create the strongest valid alternative.
5. Add the asset or runnable alternative to the README near the top.
6. Add useful alt text, a caption, and reproduction steps.
7. Open the final asset and test every link. Check readability and file size.
8. Record the format, reproduction method, and any limitation in the work log.

If the project cannot reasonably produce a visual or interactive demonstration, the agent must state why and add the best available alternative, such as a tested terminal transcript, runnable code example, API example, notebook, plot, or architecture diagram.

DEVKIT's initial repo-scan detects a limited set of README media and demo-link signals. It can report when no recognised signal is present. It does not render images, inspect visual quality, verify external links, prove that a demo is functional, or detect every valid README format. Human or agent review remains required.
