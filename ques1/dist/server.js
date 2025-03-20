"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const app = (0, express_1.default)();
const PORT = 9876;
const WINDOW_SIZE = 10;
const TEST_SERVER_BASE_URL = "http://20.244.56.144/test";
const NUMBER_TYPES = {
    p: "primes",
    f: "fibo",
    e: "even",
    r: "rand",
};
let numberWindow = [];
function fetchNumbers(url) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Use Promise.race to enforce the 500ms timeout
            const response = yield Promise.race([
                axios_1.default.get(url, { timeout: 500 }),
                new Promise((_, reject) => setTimeout(() => reject(new Error("Request Timeout")), 500)),
            ]);
            const numbers = response.data.numbers;
            return Array.isArray(numbers) ? numbers : [];
        }
        catch (error) {
            if (error instanceof Error) {
                console.error("API fetch failed:", error.message);
            }
            else {
                console.error("API fetch failed with an unknown error:", error);
            }
            return [];
        }
    });
}
app.get("/numbers/:numberId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const numberId = req.params.numberId;
    if (!(numberId in NUMBER_TYPES)) {
        return res
            .status(400)
            .json({ error: "Invalid number type. Use 'p', 'f', 'e', or 'r'." });
    }
    const url = `${TEST_SERVER_BASE_URL}/${NUMBER_TYPES[numberId]}`;
    const newNumbers = yield fetchNumbers(url);
    // Use a Set to efficiently filter out duplicates
    const uniqueNumbers = newNumbers.filter((num) => !new Set(numberWindow).has(num));
    // Maintain a sliding window of WINDOW_SIZE
    numberWindow = [...numberWindow, ...uniqueNumbers].slice(-WINDOW_SIZE);
    // Compute the average
    const avg = numberWindow.length > 0
        ? (numberWindow.reduce((sum, num) => sum + num, 0) /
            numberWindow.length).toFixed(2)
        : "0.00";
    res.json({
        windowPrevState: numberWindow.slice(0, -uniqueNumbers.length),
        windowCurrState: numberWindow,
        numbers: newNumbers,
        avg: parseFloat(avg),
    });
}));
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
