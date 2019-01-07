export default class Util {
    static generateId(type) {
        // Type can either be 'q' or 'o'
        return type + '-' + crypto.getRandomValues(new Uint32Array(4)).join('');
    }
}