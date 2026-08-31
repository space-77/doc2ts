/** @type {import('ts-jest').JestConfigWithTsJest} **/
module.exports = {
  testEnvironment: "node",
  // 仅运行 src 下的测试，避免匹配到 lib 构建产物里的测试副本
  roots: ["<rootDir>/src"],
  transform: {
    "^.+\.tsx?$": ["ts-jest",{}],
  },
};