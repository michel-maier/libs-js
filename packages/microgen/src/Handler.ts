import TestFile, {TestFileConfig} from './TestFile';
import stringifyObject from 'stringify-object';

export type HandlerConfig = {
    name: string,
    type: string,
    middlewares: string[],
    params: {[key: string]: any},
    test?: TestFileConfig,
    vars: {[key: string]: any},
    directory: string,
    custom?: boolean,
};

export default class Handler {
    public readonly name: string;
    public readonly type: string;
    public readonly middlewares: string[];
    public readonly params: {[key: string]: any};
    public readonly vars: {[key: string]: any};
    public readonly test: TestFile|undefined;
    public readonly directory: string;
    public readonly custom: boolean;
    constructor({name, type, middlewares = [], params = {}, directory, custom = false, vars = {}, test = undefined}: HandlerConfig) {
        this.name = name;
        this.type = type;
        this.params = {o: name, ...params};
        this.middlewares = middlewares;
        this.vars = vars;
        this.directory = directory;
        this.custom = !!custom;
        this.test = this.enrichTest(test);
    }
    enrichTest(test: TestFileConfig|undefined): TestFile|undefined {
        const addedGroups: {[key: string]: any} = {};
        if (0 <= this.middlewares.indexOf('warmup')) {
            addedGroups.warmup = {
                tests: [{name: 'warmup call', type: 'handler-call', config: {event: {warm: true}, expected: {status: 'success', code: 1000, message: 'warmed'}}}],
            };
        }
        if (!!Object.keys(addedGroups).length) {
            if (!test) test = <{[key: string]: any}>{};
            test.groups = <any>Object.entries(addedGroups).reduce((acc, [k, v]: [string, any[]]) => {
                if (!acc[k]) acc[k] = {};
                acc[k] = {...acc[k], ...v, tests: (acc[k].tests || [].concat((<any>v).tests || []))};
                return acc;
            }, test.groups || <any>{});
        }
        return !!test ? new TestFile(test) : undefined;
    }
    async generate(vars: any = {}): Promise<{[key: string]: Function}> {
        if (this.custom) return {};
        const fnName = vars.fnName || `fn`;
        const realMiddlewares = this.middlewares.map((m, i) => `m${i + 1}`);
        //const offsetDir = this.directory ? this.directory.split('/').map(() => '..').join('/') : '.';
        const pre_init = [
            `const cf = ${stringifyObject(this.params, {indent: '', inlineCharacterLimit: 1024, singleQuotes: true})};`,
            ...this.middlewares.map((m, i) =>
                `const m${i + 1} = require('@ohoareau/microlib/lib/middlewares/${m}').default(cf);`
            ),
        ].join("\n");
        const post_init = [
            `const hn = require('@ohoareau/microlib/lib/utils/fn2hn').default(${fnName}, [${realMiddlewares.join(', ')}]${this.vars.paramsKey ? ', {params: true}' : ''});`,
        ].join("\n");
        vars = {
            ...this.vars,
            ...this.params,
            pre_init,
            post_init,
            fnName,
            ...vars,
            directory: this.directory,
        };
        const files = {
            [`${this.directory ? `${this.directory}/` : ''}${this.name}.js`]: ({renderFile}) => renderFile(`handlers/${this.type}.js.ejs`, vars),
        };
        if (this.test) {
            files[`__tests__/${this.directory ? `${this.directory}/` : ''}${this.name}.test.js`] = ({renderFile}) => renderFile(`tests/handler.test.js.ejs`, {...vars, test: this.test});
        }
        return files;
    }
}