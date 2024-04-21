import fs from "fs";
import path from "path";
import { formatImport } from "./format-import";
import { type Aliases } from "../types/config";

type CloneFileOptions = {
    url: string;
    origPath: string;
    versionedPath: string;
    version: string;
    gitToken: string;
    aliases: Aliases;
};

export const cloneFile = async ({ origPath, url, version, versionedPath, gitToken, aliases }: CloneFileOptions) => {
    try {
        const dataResp = await fetch(url, {
            headers: {
                Authorization: `token ${gitToken}`,
            },
        });
        const data = await dataResp.json();
        let content = Buffer.from(data.content, "base64").toString("utf8");

        const imports = content.match(/import .+ from ('[^']+'|"[^"]+")/gm);
        imports?.forEach((imp) => {
            const pathDiff = formatImport({ imp, origPath, versionedPath, version, aliases });
            if (pathDiff) {
                const { prevPath, newPath } = pathDiff;
                content = content.replace(prevPath, newPath);
            }
        });
        const fileDir = path.dirname(versionedPath);

        if (!fs.existsSync(fileDir)) fs.mkdirSync(fileDir, { recursive: true });

        fs.writeFileSync(versionedPath, content, "utf-8");
    } catch (err) {
        console.error(`Error on file cloning "${versionedPath}": \n`, err);
    }
};
