setTimeout(() => {
  const calendar = document.querySelector('[jscontroller="JjlYBf"]');
  console.log(calendar);
  if (calendar) {
    calendar.addEventListener("click", (event) => {
      setTimeout(() => {
        const dateElements = document.querySelectorAll(".ky6s2b");
        const date = new Date(dateElements[0].textContent.split(", ")[1]);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        console.log(month, day);
      }, 500);
    });
  }
}, 5000);
