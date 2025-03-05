export default async function fetchData() {
  // call up trivia API
  try {
    const response = await fetch("https://opentdb.com/api.php?amount=10");
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
  }
}
