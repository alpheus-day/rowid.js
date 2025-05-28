import * as path from "node:path";

import { execa } from "execa";
import { describe, expect, it } from "vitest";

const CLI: string = path.resolve(
    process.cwd(),
    "node_modules",
    ".bin",
    "rowid",
);

describe("RowID CLI tests", (): void => {
    // rowid -v
    it("should show version with -v", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["-v"]);
        expect(stdout.startsWith("v")).toBe(true);
    });

    it("should show version with --version", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["--version"]);
        expect(stdout.startsWith("v")).toBe(true);
    });

    // rowid
    it("should generate a RowID", async (): Promise<void> => {
        const { stdout } = await execa(CLI);
        expect(typeof stdout).toBe("string");
        expect(stdout.length).toBe(10 + 22);
    });

    it("should generate a RowID with specified number using param -r", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["-r", "6"]);
        expect(typeof stdout).toBe("string");
        expect(stdout.length).toBe(10 + 6);
    });

    it("should generate a RowID with specified number using param --randomness", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["--randomness", "12"]);
        expect(typeof stdout).toBe("string");
        expect(stdout.length).toBe(10 + 12);
    });

    // rowid encode
    it("should encode a date to a RowID", async (): Promise<void> => {
        const { stdout } = await execa(CLI, [
            "encode",
            "2099-01-01T00:00:00.000Z",
        ]);
        expect(typeof stdout).toBe("string");
        expect(stdout.length).toBe(10);
    });

    it("should encode a number to a RowID", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["encode", "1718351445"]);
        expect(typeof stdout).toBe("string");
        expect(stdout.length).toBe(10);
    });

    // rowid decode
    it("should decode from a RowID", async (): Promise<void> => {
        const { stdout: rowid } = await execa(CLI, [
            "encode",
            "2099-01-01T00:00:00.000Z",
        ]);
        const { stdout } = await execa(CLI, ["decode", rowid]);
        expect(typeof stdout).toBe("string");
        expect(new Date(stdout).toISOString()).toBe("2099-01-01T00:00:00.000Z");
    });

    // rowid generate
    it("should generate a RowID with specified date", async (): Promise<void> => {
        const { stdout } = await execa(CLI, [
            "generate",
            "2099-01-01T00:00:00.000Z",
        ]);
        const json: { success: boolean; result: string } = JSON.parse(stdout);
        expect(json.success).toBe(true);
        expect(json.result.length).toBe(10 + 22);
    });

    it("should generate a RowID with specified number", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["generate", "1718351445"]);
        const json: { success: boolean; result: string } = JSON.parse(stdout);
        expect(json.success).toBe(true);
        expect(json.result.length).toBe(10 + 22);
    });

    it("should generate a RowID with specified date and randomness", async (): Promise<void> => {
        const { stdout } = await execa(CLI, [
            "generate",
            "2099-01-01T00:00:00.000Z",
            "6",
        ]);
        const json: { success: boolean; result: string } = JSON.parse(stdout);
        expect(json.success).toBe(true);
        expect(json.result.length).toBe(10 + 6);
    });

    // rowid verify
    it("should verify a RowID", async (): Promise<void> => {
        const { stdout: rowid } = await execa(CLI, [
            "encode",
            "9999-01-01T00:00:00.000Z",
        ]);
        const { stdout } = await execa(CLI, ["verify", rowid]);
        const json: { success: boolean; result: string; natural: boolean } =
            JSON.parse(stdout);
        expect(json.success).toBe(true);
        expect(new Date(json.result).toISOString()).toBe(
            "9999-01-01T00:00:00.000Z",
        );
        expect(json.natural).toBe(false);
    });

    // rowid random
    it("should generate 1 randomness with alphabet input", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["random", "ABC"]);
        expect(stdout.length).toBe(1);
    });

    it("should generate 1 randomness", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["random", "1"]);
        expect(stdout.length).toBe(1);
    });

    it("should generate 10 randomness", async (): Promise<void> => {
        const { stdout } = await execa(CLI, ["random", "10"]);
        expect(stdout.length).toBe(10);
    });
});
