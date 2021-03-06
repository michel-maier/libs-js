const chars = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];

export const fingerprint = ({fields = [], algorithm = undefined, separator = '|'}: {fields: string[], algorithm?: string|undefined, separator?: string}) => query =>
    require('./services/crypto').default.hash(fields.map(k => (query.data || {})[k] || query[k]).join(separator), algorithm)
;
export const user_id = () => ({user}: any = {}) => (user && user.id) ? user.id : undefined;
export const token = ({size = 16}) => () => require('rand-token').uid(size);
export const uuid = () => () => require('uuid').v4();
export const now = () => () => new Date().valueOf();
export const ref_attribute_field = ({key, prefix, sourceField}) => ({data, contextData}) => {
    if (!data) return '**unchanged**';
    if (key in data) {
        if (('**clear**' === data[key]) || (undefined === data[key])) {
            return '**clear**';
        }
        if (!data[key]) return '**unchanged**';
        return (contextData[`${prefix}.${data[key]}`] || {})[sourceField] || undefined;
    }
    return '**unchanged**'
};
export const empty = () => () => undefined;
export const value = ({value}) => () => value;
export const ccdd = () => () => {
    const t: (string|number)[] = [];
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const cccddd = () => () => {
    const t: (string|number)[] = [];
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(chars[Math.floor(Math.random() * chars.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const dddd = () => () => {
    const t: (number)[] = [];
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const ddddd = () => () => {
    const t: (number)[] = [];
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const dddddd = () => () => {
    const t: (number)[] = [];
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};
export const dddddddd = () => () => {
    const t: (number)[] = [];
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    t.push(digits[Math.floor(Math.random() * digits.length)]);
    return t.join('');
};