const $ = document.querySelector.bind(document);
const getBtn = $("#get");
console.log(getBtn);
const postBtn = $("#post");
const print = $("#print");

getBtn.onclick = async (event) => {
  const result = await fetch("http://localhost:4000/v1/posts", {
    method: "GET",
  });
  const data = await result.json();
  try {
    print.innerHTML = JSON.stringify(data);
  } catch (error) {
    console.log(error);
  }
};

postBtn.onclick = async (event) => {
  const name = "Nguyen Di Dan";
  const age = 21;
  const id = Math.random().toString();
  const result = await fetch("http://localhost:4000/v1/posts", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: "Create successfully",
      id: id,
      name: name,
      age: age,
    }),
  });
  const data = await result.json();
  try {
    print.innerHTML = JSON.stringify(data);
  } catch (error) {
    console.log(error);
  }
};
