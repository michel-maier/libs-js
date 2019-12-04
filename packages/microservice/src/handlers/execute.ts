import {Executor, Config} from "..";

export default {
    pattern: 'execute{FullType}',
    factory: (_, c: Config) => async (event: { params: { id, input }}) =>
        (await (<Executor>c.execute)('execute', {id: event.params.id, item: await (await (<Executor>c.execute)('get', {id: event.params.id})).res.result, data: event.params.input})).res.result
    ,
}