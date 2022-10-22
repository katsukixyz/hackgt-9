setTimeout(() => {
  const calendar = document.querySelector('[jscontroller="JjlYBf"]');
  console.log(calendar);
  if (calendar) {
    calendar.addEventListener("click", (event) => {
      setTimeout(() => {
        const dateElements = document.querySelectorAll(".ky6s2b");
        console.log(dateElements);
      }, 500);
    });
  }
}, 5000);
