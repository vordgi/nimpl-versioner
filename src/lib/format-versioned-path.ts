import { APP_DIR, PAGES_DIR, ROOT_DIR } from "./constants";

export const formatVersionedPath = (filePath: string, versionsDir: string, version: string): string | null => {
    if (filePath.startsWith(APP_DIR)) {
        return filePath.replace(APP_DIR, `${APP_DIR}/${versionsDir}/${version}`);
    } else if (filePath.startsWith(PAGES_DIR)) {
        return filePath.replace(PAGES_DIR, `${PAGES_DIR}/${versionsDir}/${version}`);
    } else if (filePath.startsWith(ROOT_DIR)) {
        return filePath.replace(ROOT_DIR, `${ROOT_DIR}/${versionsDir}/${version}`);
    }

    return null;
};
