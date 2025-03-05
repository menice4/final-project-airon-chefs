export default async function fetchData() {
  // call up trivia API
  try {
    const response = await fetch("https://quiz-mania-ug0x.onrender.com/api/questions");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
