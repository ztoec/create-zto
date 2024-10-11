module.exports = {
  "extends": [
    "@commitlint/config-conventional"
  ],
  "rules": {
    "type-case": [
      2,
      "always",
      [
        "lower-case",
        "upper-case"
      ]
    ],
    "type-enum": [
      2,
      "always",
      [
        "workflow",
        "ci",
        "wip",
        "types",
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "perf",
        "test",
        "chore",
        "revert",
        "build"
      ]
    ]
  }
}