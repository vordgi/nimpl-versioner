#! /usr/bin/env node

import path from "path";
import fs from "fs";
import { type Config } from "./types/config";
import { formatVersionedPath } from "./lib/format-versioned-path";
import { cloneFile } from "./lib/clone-file";

const versionize = async () => {
    const configPath = path.join(process.cwd(), "./versioner.config");
    if (!fs.readdirSync(process.cwd()).find((name) => name.startsWith("versioner.config"))) {
        throw new Error(`Can not find configuration file at "${configPath}"`);
    }

    const config: Config = await import(configPath);

    for await (const versionData of config.versions) {
        try {
            const dataResp = await fetch(
                `https://api.github.com/repos/${config.git.userName}/${config.git.projectName}/git/trees/${versionData.ref}?recursive=true`,
                {
                    headers: {
                        Authorization: `token ${config.git.token}`,
                    },
                },
            );
            const data = await dataResp.json();
            for await (const fileData of data.tree) {
                const { path: filePath, url, type } = fileData;

                if (type !== "blob" || filePath.match("_app") || filePath.match("_document") || filePath.match("_meta"))
                    continue;

                const versionedPath = formatVersionedPath(filePath, config.versionsDir, versionData.version);

                if (!versionedPath) continue;

                await cloneFile({
                    url,
                    origPath: filePath,
                    versionedPath,
                    version: versionData.version,
                    gitToken: config.git.token,
                    aliases: config.aliases,
                });
            }
        } catch (e) {
            console.error(`Error for "${versionData.version}: \n"`, e);
        }
    }
};

versionize();
