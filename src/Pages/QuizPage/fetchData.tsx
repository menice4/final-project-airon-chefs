// Define the Question type
type Question = {
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
  type: string;
  difficulty: string;
  category: string;
};

// Fallback questions to use when API fails
const fallbackQuestions: Question[] = [
  {
    question: "What is the capital of France?",
    correct_answer: "Paris",
    incorrect_answers: ["London", "Berlin", "Madrid"],
    type: "multiple",
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "Which planet is known as the Red Planet?",
    correct_answer: "Mars",
    incorrect_answers: ["Venus", "Jupiter", "Mercury"],
    type: "multiple",
    difficulty: "easy",
    category: "Science",
  },
  {
    question: "Who wrote 'Romeo and Juliet'?",
    correct_answer: "William Shakespeare",
    incorrect_answers: ["Charles Dickens", "Jane Austen", "Mark Twain"],
    type: "multiple",
    difficulty: "easy",
    category: "Literature",
  },
  {
    question: "What is the largest ocean on Earth?",
    correct_answer: "Pacific Ocean",
    incorrect_answers: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean"],
    type: "multiple",
    difficulty: "easy",
    category: "Geography",
  },
  {
    question: "Which element has the chemical symbol 'O'?",
    correct_answer: "Oxygen",
    incorrect_answers: ["Gold", "Osmium", "Tungsten"],
    type: "multiple",
    difficulty: "easy",
    category: "Science",
  },
];

export default async function fetchData(): Promise<Question[]> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch("http://localhost:8082/api/questions", {
      signal: controller.signal,
    }).finally(() => clearTimeout(timeoutId));

    if (!response.ok) {
      console.warn(`API returned status: ${response.status}`);
      return fallbackQuestions;
    }

    const text = await response.text();

    // Debug the response
    console.log("API Response text length:", text.length);
    console.log(
      "API Response sample:",
      text.substring(0, 100) + (text.length > 100 ? "..." : "")
    );

    if (!text || text.trim() === "") {
      console.warn("Empty response from API");
      return fallbackQuestions;
    }

    try {
      const data = JSON.parse(text);

      if (!Array.isArray(data) || data.length === 0) {
        console.warn("API didn't return a valid question array");
        return fallbackQuestions;
      }

      return data;
    } catch (jsonError) {
      console.error("JSON parsing error:", jsonError);
      return fallbackQuestions;
    }
  } catch (error) {
    console.error("Error fetching data:", error);
    return fallbackQuestions;
  }
}
