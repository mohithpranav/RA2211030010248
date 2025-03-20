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
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
const BASE_URL = "http://20.244.56.144/test";
app.use(express_1.default.json());
app.use((0, cors_1.default)()); // Enable CORS for frontend requests
// ✅ Fetch all users
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/users`);
        res.json(response.data);
    }
    catch (error) {
        console.error("❌ Error fetching users:", error);
        res.status(500).json({
            error: (error === null || error === void 0 ? void 0 : error.isAxiosError)
                ? error.message
                : "Failed to fetch users",
        });
    }
}));
// ✅ Fetch posts by user
app.get("/users/:id/posts", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.params.id;
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/users/${userId}/posts`);
        res.json(response.data.posts);
    }
    catch (error) {
        console.error(`❌ Error fetching posts for user ${userId}:`, error);
        res.status(500).json({
            error: (error === null || error === void 0 ? void 0 : error.isAxiosError)
                ? error.message
                : "Failed to fetch posts",
        });
    }
}));
// ✅ Fetch comments for a post
app.get("/posts/:id/comments", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const postId = req.params.id;
    try {
        const response = yield axios_1.default.get(`${BASE_URL}/posts/${postId}/comments`);
        res.json(response.data.comments);
    }
    catch (error) {
        console.error(`❌ Error fetching comments for post ${postId}:`, error);
        res.status(500).json({
            error: (error === null || error === void 0 ? void 0 : error.isAxiosError)
                ? error.message
                : "Failed to fetch comments",
        });
    }
}));
// ✅ Aggregated feed: Fetch all users and their posts
app.get("/feed", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const usersResponse = yield axios_1.default.get(`${BASE_URL}/users`);
        const userIds = Object.keys(usersResponse.data.users);
        const postsPromises = userIds.map((userId) => __awaiter(void 0, void 0, void 0, function* () {
            try {
                const postsResponse = yield axios_1.default.get(`${BASE_URL}/users/${userId}/posts`);
                return postsResponse.data.posts;
            }
            catch (error) {
                console.warn(`⚠️ Failed to fetch posts for user ${userId}`);
                return []; // Return empty array instead of failing
            }
        }));
        const posts = (yield Promise.allSettled(postsPromises))
            .filter((p) => p.status === "fulfilled") // Only take successful responses
            .flatMap((p) => (p.status === "fulfilled" ? p.value : []));
        res.json(posts);
    }
    catch (error) {
        console.error("❌ Error fetching feed:", error);
        res.status(500).json({
            error: (error === null || error === void 0 ? void 0 : error.isAxiosError)
                ? error.message
                : "Failed to fetch feed",
        });
    }
}));
// ✅ Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
});
