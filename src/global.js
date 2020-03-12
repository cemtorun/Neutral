const API_KEY_BACKEND_URL = "https://zharry.ca/dev/Neutral/api_key.php";

const DB = {
    name: "neutral_db",
    version: "0.1.1",
    desc: "Neutral's Database for Category Mapping",
    size: 4 * 1024 * 1024
};

function findASINfromURL(url) {
    const REGEX = /.*\/(dp|product)\/([A-Za-z0-9]+)/g;
    const ASIN_REGEX_GROUPS = REGEX.exec(url);
    if (!ASIN_REGEX_GROUPS || !ASIN_REGEX_GROUPS[2])
        return;
    return ASIN_REGEX_GROUPS[2];
}

function _$(num) {
    return displayNumber(num, 2);
}
function _int(num) {
    return displayNumber(num, 0);
}
function _kg(num) {
    return displayNumber(num, 3);
}
function _L(num) {
    return displayNumber(num, 3)
}

function displayNumber(num, digits = 2) {
    if (Number.isInteger(num)) {
        return num;
    }
    return num.toFixed(digits);
}