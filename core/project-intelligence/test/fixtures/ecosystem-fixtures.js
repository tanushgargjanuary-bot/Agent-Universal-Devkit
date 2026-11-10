const json = (value) => JSON.stringify(value, null, 2) + "\n";

export const ECOSYSTEM_FIXTURES = [
  {
    name: "node-express",
    expected: { ecosystems: ["node"], languages: ["JavaScript", "TypeScript"], frameworks: ["Express"], manifests: ["package.json"] },
    files: {
      "package.json": json({ name: "fixture-node", dependencies: { express: "^4.0.0" }, scripts: { test: "node --test" } }),
      "package-lock.json": json({ name: "fixture-node", lockfileVersion: 3 }),
      "src/index.ts": "export const ready = true;\n",
      "test/app.test.js": "import test from 'node:test';\n"
    }
  },
  {
    name: "python-fastapi",
    expected: { ecosystems: ["python"], languages: ["Python"], frameworks: ["FastAPI", "Pandas"], manifests: ["pyproject.toml", "requirements.txt"] },
    files: {
      "pyproject.toml": "[project]\nname = \"fixture-python\"\ndependencies = [\"fastapi>=0.1\", \"pandas>=2\"]\n",
      "requirements.txt": "fastapi>=0.1\npandas>=2\n",
      "uv.lock": "version = 1\n",
      "app/main.py": "from fastapi import FastAPI\n",
      "tests/test_app.py": "def test_app():\n    assert True\n"
    }
  },
  {
    name: "rust",
    expected: { ecosystems: ["rust"], languages: ["Rust"], frameworks: [], manifests: ["Cargo.toml"] },
    files: {
      "Cargo.toml": "[package]\nname = \"fixture-rust\"\nversion = \"0.1.0\"\nedition = \"2021\"\n",
      "Cargo.lock": "# generated fixture lockfile\n",
      "src/main.rs": "fn main() {}\n",
      "tests/smoke.rs": "#[test] fn smoke() {}\n"
    }
  },
  {
    name: "go",
    expected: { ecosystems: ["go"], languages: ["Go"], frameworks: [], manifests: ["go.mod"] },
    files: {
      "go.mod": "module example.invalid/fixture\n\ngo 1.22\n",
      "go.sum": "",
      "cmd/api/main.go": "package main\nfunc main() {}\n",
      "internal/api/api_test.go": "package api\n"
    }
  },
  {
    name: "jvm-maven-and-gradle",
    expected: { ecosystems: ["jvm"], languages: ["Java", "Kotlin"], frameworks: [], manifests: ["pom.xml", "build.gradle.kts"] },
    files: {
      "pom.xml": "<project><modelVersion>4.0.0</modelVersion></project>\n",
      "build.gradle.kts": "plugins { java }\n",
      "src/main/java/example/App.java": "package example; class App {}\n",
      "src/main/kotlin/example/Main.kt": "package example\nfun main() {}\n"
    }
  },
  {
    name: "dotnet",
    expected: { ecosystems: ["dotnet"], languages: ["C#"], frameworks: [], manifests: ["Sample.csproj"] },
    files: {
      "Sample.csproj": "<Project Sdk=\"Microsoft.NET.Sdk\"><PropertyGroup><TargetFramework>net8.0</TargetFramework></PropertyGroup></Project>\n",
      "Program.cs": "Console.WriteLine(\"ready\");\n",
      "Tests/SmokeTests.cs": "public class SmokeTests {}\n"
    }
  },
  {
    name: "php-composer",
    expected: { ecosystems: ["php"], languages: ["PHP"], frameworks: [], manifests: ["composer.json"] },
    files: {
      "composer.json": json({ name: "fixture/php", require: { php: "^8.2" } }),
      "composer.lock": json({ packages: [] }),
      "public/index.php": "<?php echo \"ready\";\n",
      "tests/SmokeTest.php": "<?php // fixture test\n"
    }
  },
  {
    name: "ruby-bundler",
    expected: { ecosystems: ["ruby"], languages: ["Ruby"], frameworks: [], manifests: ["Gemfile"] },
    files: {
      "Gemfile": "source \"https://rubygems.org\"\ngem \"rake\"\n",
      "Gemfile.lock": "GEM\n",
      "app.rb": "puts \"ready\"\n",
      "spec/app_spec.rb": "RSpec.describe \"app\" do; end\n"
    }
  },
  {
    name: "mixed-node-python-rust-workspace",
    expected: { ecosystems: ["node", "python", "rust"], languages: ["JavaScript", "Python", "Rust"], frameworks: ["Express", "FastAPI"], manifests: ["package.json", "pyproject.toml", "Cargo.toml"] },
    files: {
      "package.json": json({ name: "fixture-mixed", dependencies: { express: "^4.0.0" }, workspaces: ["apps/*"] }),
      "pyproject.toml": "[project]\nname = \"fixture-mixed-api\"\ndependencies = [\"fastapi\"]\n",
      "Cargo.toml": "[package]\nname = \"fixture-mixed-rust\"\nversion = \"0.1.0\"\n",
      "apps/web/package.json": json({ name: "web" }),
      "services/api/requirements.txt": "fastapi\n",
      "apps/web/src/index.js": "export const web = true;\n",
      "services/api/app.py": "from fastapi import FastAPI\n",
      "src/main.rs": "fn main() {}\n"
    }
  }
];
