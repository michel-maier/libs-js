export default ({type, ...config}) => async data => (require('../utils/mutators')[type] || (() => x => x))(config)(data)