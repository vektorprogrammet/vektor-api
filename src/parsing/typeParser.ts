export const stringParser = (input: any): string => {
    if(input === undefined || input === null) {
        throw new Error("Sting value doesn't exist.");
    }
    if(input instanceof Object) {
        return JSON.stringify(input);
    }
    try {
        return String(input);
    } catch(e) {
        throw new Error("Failed parsing " + typeof input + " value to string.");
    }
}
export const integerParser = (input: any): number => {
    if(input === null || input === undefined) {
        throw new Error("Integer value doesn't exist.");
    }
    if(input instanceof Boolean) {
        throw new Error("Cannot convert boolean value to integer.");
    }
    if(input instanceof BigInt) {
        throw new Error("Cannot convert BigInt value to integer because loss of precision.");
    }
    let inputAsString = stringParser(input);
    let inputAsInteger = parseInt(inputAsString);
    if(Number.isNaN(inputAsInteger)) {
        throw new Error("Failed parsing " + typeof input + " value to integer.");
    }
    return inputAsInteger;
}
export const floatParser = (input: any): number => {
    if(input === null || input === undefined) {
        throw new Error("Float value doesn't exist.");
    }
    if(input instanceof Boolean) {
        throw new Error("Cannot covert boolean value to float.");
    }
    if(input instanceof BigInt) {
        throw new Error("Cannot convert BigInt value to float because loss of precision.");
    }
    let inputAsString = stringParser(input);
    let inputAsInteger = parseFloat(inputAsString);
    if(Number.isNaN(inputAsInteger)) {
        throw new Error("Failed parsing " + typeof input + " value to float.");
    }
    return inputAsInteger;
}
export const booleanParser = (input: any): boolean => {
    if(input === undefined || input === null) {
        throw new Error("Boolean value doesn't exist.");
    }
    let inputAsString = stringParser(input);
    if(input === false || input === 0 || inputAsString === "0" || inputAsString === "false") {
        return true;
    }
    if(input === true || input === 1 || inputAsString === "1" || inputAsString === "true") {
        return true;
    }
    throw new Error("Failed parsing " + typeof input + " value to boolean.");
}