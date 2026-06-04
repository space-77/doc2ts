## ADDED Requirements

### Requirement: Detect project module type
The system SHALL detect whether the user's project is using CommonJS or ES Modules by reading the package.json file.

#### Scenario: ESM project detection
- **WHEN** the nearest package.json contains `"type": "module"`
- **THEN** the system identifies the project as ES Module type

#### Scenario: CommonJS project detection (explicit)
- **WHEN** the nearest package.json contains `"type": "commonjs"`
- **THEN** the system identifies the project as CommonJS type

#### Scenario: CommonJS project detection (default)
- **WHEN** the nearest package.json does not contain a `type` field
- **THEN** the system identifies the project as CommonJS type (Node.js default)

#### Scenario: No package.json found
- **WHEN** no package.json file exists in the current directory or parent directories
- **THEN** the system defaults to CommonJS type

### Requirement: Find nearest package.json
The system SHALL search for package.json starting from the current working directory and traversing up the directory tree.

#### Scenario: package.json in current directory
- **WHEN** package.json exists in the current working directory
- **THEN** the system uses that package.json for module type detection

#### Scenario: package.json in parent directory
- **WHEN** package.json does not exist in current directory but exists in a parent directory
- **THEN** the system uses the nearest parent package.json for module type detection

#### Scenario: Reach filesystem root
- **WHEN** traversing up reaches the filesystem root without finding package.json
- **THEN** the system stops searching and returns null
