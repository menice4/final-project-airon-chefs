import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import fetchData from "./fetchData";

type Question = {
  question: string;
};

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        setQuestions(data);
      } catch (error) {
        setError(error as Error);
      } finally {
        setLoading(false);
      }
    }
    getData();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      <h1>Welcome to the Quiz</h1>
      <ul>
        {questions.map((question, index) => (
          <li key={index}>{question.question}</li>
        ))}
      </ul>
      <Link to="/end">Finish</Link>
    </div>
  );
}


