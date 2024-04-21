import path from "path";
import { ROOT_DIR } from "./constants";
import { type Aliases } from "../types/config";

type FormatImportOptions = {
    imp: string;
    origPath: string;
    versionedPath: string;
    version: string;
    aliases: Aliases;
};

export const formatImport = ({ imp, origPath, versionedPath, version, aliases }: FormatImportOptions) => {
    const match = imp.match(/import .+ from ('(?<path>[^']+)'|"(?<path2>[^"]+)")/);
    const prevPath = match?.groups?.path || match?.groups?.path2;

    if (!prevPath) return null;

    for (const [key, value] of Object.entries(aliases)) {
        const result = prevPath.match(key.replace("*", ".+"));
        if (result) {
            const relativeFromRootPath = prevPath.replace(key.replace("*", ""), value[0].replace("*", ""));

            const path1 = path.join(process.cwd(), versionedPath);
            const path2 = path
                .join(process.cwd(), relativeFromRootPath)
                .replaceAll(path.sep, "/")
                .replace(ROOT_DIR, `${ROOT_DIR}/versions/${version}`);
            const relativePath = path.relative(path.join(path1, ".."), path2);

            return { prevPath, newPath: relativePath.replaceAll(path.sep, "/") };
        }
    }

    if (prevPath.startsWith("/")) return null;

    const path1 = path.join(process.cwd(), origPath, prevPath).replaceAll(path.sep, "/");
    const path2 = path1.replace(ROOT_DIR, `${ROOT_DIR}/versions/${version}`);
    const relativePath = path.relative(path.join(process.cwd(), versionedPath), path2);
    return { prevPath, newPath: relativePath.replaceAll(path.sep, "/") };
};
