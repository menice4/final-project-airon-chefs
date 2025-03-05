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
}