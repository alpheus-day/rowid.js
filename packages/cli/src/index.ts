import type { RowIDWithConfigResult } from "rowid";

import type { Config } from "#/@types/config";

import { Command } from "commander";
import { RowIDWithConfig } from "rowid";

import { CHAT_LIST, RANDOMNESS_LENGTH } from "#/common";
import { isNumber } from "#/functions/isNumber";
import { readConfig } from "#/functions/readConfig";

import { version } from "../package.json";

(async (): Promise<void> => {
    try {
        // declarations
        const program: Command = new Command();
        const config: Config = await readConfig();

        const {
            RowID,
            encode,
            decode,
            generate,
            verify,
            getRandomness,
        }: RowIDWithConfigResult = RowIDWithConfig({
            charList: config.charList ?? CHAT_LIST,
            randomnessLength:
                (config.randomnessLength && isNumber(config.randomnessLength)
                    ? Number(config.randomnessLength)
                    : RANDOMNESS_LENGTH) ?? RANDOMNESS_LENGTH,
        });

        // RowID
        program
            .name("rowid")
            .description("RowID, a time-based unique ID solution")
            .version(
                `v${version}`,
                "-v, --version",
                "get the version of RowID CLI",
            )
            .option(
                "-r, --randomness <number>",
                "specify the number of randomness",
            )
            .action(async (args: { randomness: string }): Promise<void> => {
                try {
                    console.log(
                        RowID(
                            args.randomness
                                ? isNumber(args.randomness)
                                    ? Number(args.randomness)
                                    : void 0
                                : void 0,
                        ),
                    );
                } catch (e: unknown) {
                    console.error(e);
                }
            });

        // encode
        program
            .command("encode")
            .description("encode a date to RowID")
            .argument("<date>", "the date to encode")
            .action(async (date: string): Promise<void> => {
                try {
                    const _date: number = new Date(
                        isNumber(date) ? Number(date) : date,
                    ).getTime();
                    console.log(encode(_date));
                } catch (e: unknown) {
                    console.error(e);
                }
            });

        // decode
        program
            .command("decode")
            .description("decode a RowID to date")
            .argument("<encoded>", "the encoded to decode")
            .action(async (encoded: string): Promise<void> => {
                try {
                    console.log(decode(encoded));
                } catch (e: unknown) {
                    console.error(e);
                }
            });

        // generate
        program
            .command("generate")
            .description("generate a RowID")
            .argument("<date>", "the date to generate")
            .argument("[number]", "the number of randomness")
            .action(
                async (
                    date: string,
                    number: string | undefined,
                ): Promise<void> => {
                    try {
                        console.log(
                            JSON.stringify(
                                generate(
                                    new Date(
                                        isNumber(date) ? Number(date) : date,
                                    ).getTime(),
                                    number
                                        ? isNumber(number)
                                            ? Number(number)
                                            : void 0
                                        : void 0,
                                ),
                            ),
                        );
                    } catch (e: unknown) {
                        console.error(e);
                    }
                },
            );

        // verify
        program
            .command("verify")
            .description("verify a RowID")
            .argument("<encoded>", "the encoded to verify")
            .action(async (encoded: string): Promise<void> => {
                try {
                    console.log(JSON.stringify(verify(encoded)));
                } catch (e: unknown) {
                    console.error(e);
                }
            });

        // get randomness
        program
            .command("random")
            .description("generate randomness")
            .argument("<number>", "the number of randomness")
            .action(async (number: string): Promise<void> => {
                try {
                    console.log(
                        getRandomness(isNumber(number) ? Number(number) : 1),
                    );
                } catch (e: unknown) {
                    console.error(e);
                }
            });

        // parse
        await program.parseAsync();
    } catch (e: unknown) {
        console.log(e);
    }
})();
