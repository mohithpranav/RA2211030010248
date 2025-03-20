import express, { Request, Response } from "express";
import axios from "axios";
import cors from "cors";

const app = express();
const PORT = process.env.PORT || 3000;
const BASE_URL = "http://20.244.56.144/test";

app.use(express.json());
app.use(cors());

interface UserResponse {
  users: Record<string, string>;
}

interface Post {
  id: number;
  userId: number;
  content: string;
}

interface Comment {
  id: number;
  postId: number;
  content: string;
}

interface UserResponse {
  users: Record<string, string>;
}

app.get("/users", async (req: Request, res: Response) => {
  try {
    const response = await axios.get<UserResponse>(`${BASE_URL}/users`);
    res.json(response.data);
  } catch (error) {
    console.error(" Error fetching users:", error);
    res.status(500).json({
      error: (error as any)?.isAxiosError
        ? (error as any).message
        : "Failed to fetch users",
    });
  }
});

app.get("/users/:id/posts", async (req: Request, res: Response) => {
  const userId = req.params.id;
  try {
    const response = await axios.get<{ posts: Post[] }>(
      `${BASE_URL}/users/${userId}/posts`
    );
    res.json(response.data.posts);
  } catch (error) {
    console.error(`Error fetching posts for user ${userId}:`, error);
    res.status(500).json({
      error: (error as any)?.isAxiosError
        ? (error as any).message
        : "Failed to fetch posts",
    });
  }
});

app.get("/posts/:id/comments", async (req: Request, res: Response) => {
  const postId = req.params.id;
  try {
    const response = await axios.get<{ comments: Comment[] }>(
      `${BASE_URL}/posts/${postId}/comments`
    );
    res.json(response.data.comments);
  } catch (error) {
    console.error(` Error fetching comments for post ${postId}:`, error);
    res.status(500).json({
      error: (error as any)?.isAxiosError
        ? (error as any).message
        : "Failed to fetch comments",
    });
  }
});

app.get("/feed", async (req: Request, res: Response) => {
  try {
    const usersResponse = await axios.get<UserResponse>(`${BASE_URL}/users`);
    const userIds = Object.keys(usersResponse.data.users);

    const postsPromises = userIds.map(async (userId) => {
      try {
        const postsResponse = await axios.get<{ posts: Post[] }>(
          `${BASE_URL}/users/${userId}/posts`
        );
        return postsResponse.data.posts;
      } catch (error) {
        console.warn(` Failed to fetch posts for user ${userId}`);
        return [];
      }
    });

    const posts = (await Promise.allSettled(postsPromises))
      .filter((p) => p.status === "fulfilled")
      .flatMap((p) => (p.status === "fulfilled" ? p.value : []));

    res.json(posts);
  } catch (error) {
    console.error(" Error fetching feed:", error);
    res.status(500).json({
      error: (error as any)?.isAxiosError
        ? (error as any).message
        : "Failed to fetch feed",
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
