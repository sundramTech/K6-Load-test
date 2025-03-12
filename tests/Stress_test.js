export let options = {
  stages: [
    { duration: '10s', target: 50 },  // Ramp-up to 50 users
    { duration: '20s', target: 200 }, // Increase to 200 users
    { duration: '10s', target: 0 },   // Ramp-down
  ],
};

export default function () {
  http.get('https://jsonplaceholder.typicode.com/posts');
}