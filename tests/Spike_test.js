export let options = {
  stages: [
    { duration: '5s', target: 10 },   // Normal traffic
    { duration: '5s', target: 500 },  // Sudden spike
    { duration: '10s', target: 10 },  // Drop back
  ],
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
}