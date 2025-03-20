import express, { Request, Response } from "express";

const app = express();
const PORT = 3000;

const generatePrimes = (limit: number): number[] => {
  const primes: number[] = [];
  for (let num = 2; num <= limit; num++) {
    let isPrime = true;
    for (let i = 2; i * i <= num; i++) {
      if (num % i === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(num);
  }
  return primes;
};

const generateFibonacci = (limit: number): number[] => {
  const fib: number[] = [0, 1];
  while (true) {
    const next = fib[fib.length - 1] + fib[fib.length - 2];
    if (next > limit) break;
    fib.push(next);
  }
  return fib;
};

const generateEvenNumbers = (limit: number): number[] => {
  return Array.from({ length: Math.floor(limit / 2) }, (_, i) => (i + 1) * 2);
};

const generateRandomNumbers = (limit: number, count: number = 10): number[] => {
  return Array.from(
    { length: count },
    () => Math.floor(Math.random() * limit) + 1
  );
};

app.get("/numbers/:type", (req: Request, res: Response): void => {
  const { type } = req.params;
  const limit = 100; // Set a limit for number generation
  let numbers: number[] = [];

  switch (type) {
    case "primes":
      numbers = generatePrimes(limit);
      break;
    case "fibonacci":
      numbers = generateFibonacci(limit);
      break;
    case "even":
      numbers = generateEvenNumbers(limit);
      break;
    case "random":
      numbers = generateRandomNumbers(limit);
      break;
    default:
      res.status(400).json({ error: "Invalid number type" });
      return; // Ensure no further execution
  }

  res.json({ numbers });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
