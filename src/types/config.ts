export type Aliases = Record<string, string[]>;

export type Version = {
    ref: string; // commit or branch
    version: string; // page sub path
};

export type Config = {
    git: {
        token: string;
        userName: string;
        projectName: string;
    };
    versionsDir: string;
    versions: Version[];
    aliases: Aliases;
};
