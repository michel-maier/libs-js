import {readFileSync, readdirSync} from 'fs';
import YAML from 'yaml';

export const parseTextFile = (path: string) => readFileSync(path, 'utf8');
export const parseMarkdownFile = (path: string) => parseTextFile(path);
export const parseListFile = (path: string) => parseTextFile(path).trim().split(/\n/g).map(x => x ? x.trim() : '').filter(x => !!x && 0 < x.length && ('#' !== x.slice(0, 1)));
export const parseYamlFile = (path: string) => YAML.parse(parseTextFile(path), {prettyErrors: true});
export const parseJsonFile = (path: string) => JSON.parse(parseTextFile(path));
export const parseJsFile = (path: string) => require(path);

export const parserMap = {
    txt: parseTextFile,
    yml: parseYamlFile,
    yaml: parseYamlFile,
    js: parseJsFile,
    json: parseJsonFile,
    md: parseMarkdownFile,
    lst: parseListFile,
};

export const dir2obj = (dir: string, options: any = {}) => readdirSync(dir, {withFileTypes: true}).reduce(
    (acc, e) => {
        const path = `${dir}/${e.name}`;
        if ('.' === e.name.slice(0, 1) && !!options && !!options.ignoreDots) return acc;
        if (e.isDirectory()) {
            acc[e.name] = {...(acc[e.name] || {}), ...dir2obj(path, options)};
        } else {
            const ext = e.name.replace(/^(.*)\.([^.]+)$/, '$2').toLowerCase();
            const k = e.name.replace(/\.[^.]+$/, '');
            const rootMode = '_' === k;
            if (parserMap[ext]) {
                try {
                    const v = parserMap[ext](path);
                    if (Array.isArray(v)) {
                        if (rootMode) acc = v;
                        else acc[k] = v;
                    } else if (null === v) {
                        if (rootMode) acc = v;
                        else acc[k] = v;
                    } else if ('object' === typeof v) {
                        if (rootMode) {
                            if ('object' === typeof acc) acc = {...acc, ...v};
                            else acc = v;
                        } else {
                            if ('object' === typeof acc[k]) acc[k] = {...acc[k], ...v};
                            else acc[k] = v;
                        }
                    } else {
                        acc[k] = v;
                    }
                } catch (e) {
                    throw new Error(`${path}: ${e.message}`);
                }
            }
        }
        return acc;
    },
    {}
);

export default dir2obj