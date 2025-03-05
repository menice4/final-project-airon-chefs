import { Link } from "react-router-dom";
import fetchData from "./fetchData";
import { useEffect } from "react";

export default function QuizPage() {
  useEffect(() => {
    async function getData() {
      try {
        const data = await fetchData();
        console.log(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }
    getData();
  }, []);
    return (
    <div>
      <h1>Welcome to the Quiz</h1>
      <p>Placeholder Question</p>
      <Link to="/end">Finish</Link>
    </div>
  );
}


