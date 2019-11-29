import {ErrorSerialization, Map} from '..';
import SerializableErrorInterface from "./SerializableErrorInterface";

export default class InvokeError extends Error implements SerializableErrorInterface {
    protected type: string;
    protected operation: string;
    protected dsn: string;
    protected requestPayload: Map;
    protected responsePayload: {errorType: string, errorMessage: string};
    constructor(type, operation, dsn, requestPayload, responsePayload) {
        super(`Invoking operation '${operation}' on service '${type}' raise an error when invoking '${dsn}': ${responsePayload.errorMessage} (errorType: ${responsePayload.errorType})`);
        this.type = type;
        this.operation = operation;
        this.dsn = dsn;
        this.requestPayload = requestPayload;
        this.responsePayload = responsePayload;
    }
    getType(): string {
        return this.type;
    }
    getOperation(): string {
        return this.operation;
    }
    getDsn(): string {
        return this.dsn;
    }
    getRequestPayload(): Map {
        return this.requestPayload;
    }
    getResponsePayload(): {errorType: string, errorMessage: string} {
        return this.responsePayload;
    }
    serialize(): ErrorSerialization {
        return {
            errorType: 'invoke',
            message: this.message,
            data: {},
            errorInfo: {
                type: this.type,
                operation: this.operation,
                dsn: this.dsn,
            }
        }
    }
}