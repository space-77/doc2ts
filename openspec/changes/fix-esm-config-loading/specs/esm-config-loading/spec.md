## ADDED Requirements

### Requirement: Generate module-appropriate temporary config file
The system SHALL generate temporary configuration files with extensions that match the detected module type.

#### Scenario: Generate .mjs for ESM projects
- **WHEN** the project is detected as ES Module type
- **THEN** the temporary config file MUST use the .mjs extension

#### Scenario: Generate .cjs for CommonJS projects
- **WHEN** the project is detected as CommonJS type
- **THEN** the temporary config file MUST use the .cjs extension

#### Scenario: Transpile to appropriate module format
- **WHEN** transpiling TypeScript config to JavaScript
- **THEN** the output module format MUST match the detected project type (ES2015 for ESM, CommonJS for CJS)

### Requirement: Load config using appropriate method
The system SHALL use the correct loading mechanism based on the module type.

#### Scenario: Load ESM config with dynamic import
- **WHEN** loading a .mjs temporary config file
- **THEN** the system MUST use dynamic import() to load the module

#### Scenario: Load CommonJS config with require
- **WHEN** loading a .cjs temporary config file
- **THEN** the system MUST use require() to load the module

#### Scenario: Extract default export from ESM
- **WHEN** loading an ESM module via dynamic import
- **THEN** the system SHALL access the .default property to get the config object

#### Scenario: Extract default export from CommonJS
- **WHEN** loading a CommonJS module via require
- **THEN** the system SHALL access the .default property to get the config object

### Requirement: Clean up temporary files
The system SHALL delete temporary configuration files after loading, regardless of module type.

#### Scenario: Clean up .mjs file on success
- **WHEN** an ESM config file is successfully loaded
- **THEN** the .mjs temporary file MUST be deleted

#### Scenario: Clean up .cjs file on success
- **WHEN** a CommonJS config file is successfully loaded
- **THEN** the .cjs temporary file MUST be deleted

#### Scenario: Clean up on failure
- **WHEN** config loading fails with an error
- **THEN** the temporary file MUST still be deleted in the finally block

### Requirement: Maintain backward compatibility
The system SHALL maintain existing behavior for CommonJS projects.

#### Scenario: No behavioral change for existing CommonJS users
- **WHEN** a project does not have `"type": "module"` in package.json
- **THEN** the config loading behavior MUST be identical to the previous version

#### Scenario: Same API surface
- **WHEN** the getConfig function is called
- **THEN** the function signature and return type MUST remain unchanged
