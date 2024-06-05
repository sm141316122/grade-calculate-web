// 讓button的功能都失效,防止送出表單
addEventListener("keypress", (e) => {
  if (e.key == "Enter") {
    e.preventDefault();
  }
});

let buttons = document.querySelectorAll("button");

buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    e.preventDefault();
  });
});

// Select 選擇後更換相對應的顏色
let selects = document.querySelectorAll("select.select");

selects.forEach((select) => {
  select.addEventListener("change", (e) => {
    setGPA(); // 計算成績
    changeColor(e.target);
  });
});

function changeColor(target) {
  if (target.value == "A" || target.value == "A-") {
    target.style.backgroundColor = "gold";
    target.style.color = "black";
  } else if (
    target.value == "B+" ||
    target.value == "B" ||
    target.value == "B-"
  ) {
    target.style.backgroundColor = "blue";
    target.style.color = "white";
  } else if (
    target.value == "C+" ||
    target.value == "C" ||
    target.value == "C-"
  ) {
    target.style.backgroundColor = "green";
    target.style.color = "white";
  } else if (
    target.value == "D+" ||
    target.value == "D" ||
    target.value == "D-"
  ) {
    target.style.backgroundColor = "brown";
    target.style.color = "white";
  } else if (target.value == "F") {
    target.style.backgroundColor = "gray";
    target.style.color = "white";
  } else {
    target.style.backgroundColor = "white";
    target.style.color = "black";
  }
}

// 計算成績"
function convertor(grade) {
  switch (grade) {
    case "A":
      return 4.0;
    case "A-":
      return 3.7;
    case "B+":
      return 3.4;
    case "B":
      return 3.0;
    case "B-":
      return 2.7;
    case "C+":
      return 2.4;
    case "C":
      return 2.0;
    case "C-":
      return 1.7;
    case "D+":
      return 1.4;
    case "D":
      return 1.0;
    case "D-":
      return 0.7;
    case "F":
      return 0.0;
    default:
      return 0;
  }
}

function setGPA() {
  let formLength = document.querySelectorAll("form").length;
  let credits = document.querySelectorAll(".class-credit");
  let selects = document.querySelectorAll("select");
  let sum = 0; // 計算GPA分子
  let creditSum = 0; // 計算GPA分母

  for (let i = 0; i < formLength; i++) {
    if (credits[i].value && selects[i].value) {
      sum += credits[i].valueAsNumber * convertor(selects[i].value);
      creditSum += credits[i].valueAsNumber;
      let result = (sum / creditSum).toFixed(2);
      let gpa = document.querySelector(".result h2");
      gpa.innerHTML = result;
    }
  }
  if (sum == 0 || creditSum == 0) {
    let gpa = document.querySelector(".result h2");
    gpa.innerHTML = "0.00";
  }
}

let credits = document.querySelectorAll(".class-credit");
credits.forEach((credit) => {
  credit.addEventListener("change", () => {
    setGPA();
  });
});

// 新增form
let addButton = document.querySelector(".plus");
addButton.addEventListener("click", () => {
  let newForm = document.querySelector("form").cloneNode(true);
  // 設定新增的form的CSS
  newForm.querySelector(".class-type").value = "";
  newForm.querySelector(".class-number").value = "";
  newForm.querySelector(".class-credit").value = "";
  newForm.querySelector("select").style.backgroundColor = "white";

  // 加入新增的Form
  let allInput = document.querySelector(".all-input");
  allInput.insertAdjacentElement("beforeend", newForm);

  // 設定新增的Form的動畫
  newForm.animate([{ transform: "scale(0)" }, { transform: "scale(1)" }], {
    duration: 400,
    easing: "ease-out",
  });

  // 設定新增的Form的監聽事件
  allInput = document.querySelectorAll("form");
  newForm = allInput[allInput.length - 1];
  newForm.querySelector(".class-credit").addEventListener("change", () => {
    setGPA();
  });
  newForm.querySelector("select").addEventListener("change", (e) => {
    setGPA();
    changeColor(e.target);
  });

  // 刪除新增的Form
  newForm.querySelector(".trash").addEventListener("click", (e) => {
    e.preventDefault();
    allInput = document.querySelectorAll("form div");
    if (allInput.length != 1) {
      newForm.classList.add("remove");
    } else {
      allInput[0].children[0].value = "";
      allInput[0].children[1].value = "";
      allInput[0].children[2].value = "";
      allInput[0].children[3].value = "";
      changeColor(allInput[0].children[3]);
    }
  });

  newForm.addEventListener("trasitionend", (e) => {
    e.target.remove();
    setGPA();
  });
});

// 刪除form
let allTrash = document.querySelectorAll(".trash");
allTrash.forEach((trash) => {
  trash.addEventListener("click", (e) => {
    allInput = document.querySelectorAll("form div");
    if (allInput.length != 1) {
      e.target.parentElement.parentElement.classList.add("remove");
    } else {
      allInput[0].children[0].value = "";
      allInput[0].children[1].value = "";
      allInput[0].children[2].value = "";
      allInput[0].children[3].value = "";
      changeColor(allInput[0].children[3]);
    }
  });
});

// 監聽動畫完成後刪除
allTrash.forEach((trash) => {
  let form = trash.parentElement.parentElement;
  form.addEventListener("transitionend", (e) => {
    e.target.remove();
    setGPA();
  });
});

// 排序
let btn1 = document.querySelector(".descending");
let bnt2 = document.querySelector(".asscending");

btn1.addEventListener("click", () => {
  handleSorting("descending");
});
bnt2.addEventListener("click", () => {
  handleSorting("asscending");
});

function handleSorting(direction) {
  let grades = document.querySelectorAll("form div");
  objectArray = [];

  for (let i = 0; i < grades.length; i++) {
    let class_name = grades[i].children[0].value;
    let class_number = grades[i].children[1].value;
    let class_credit = grades[i].children[2].value;
    let class_grade = grades[i].children[3].value;

    if (class_grade) {
      let object = {
        class_name,
        class_number,
        class_credit,
        class_grade,
        class_grade_number: convertor(class_grade),
      };
      objectArray.push(object);
    }
  }

  objectArray = mergeSort(objectArray);
  if (direction == "asscending") {
    objectArray.reverse();
  }
  grades.forEach((form) => {
    form.children[0].value = "";
    form.children[1].value = "";
    form.children[2].value = "";
    form.children[3].value = "";
    changeColor(form.children[3]);
  });

  for (let i = 0; i < objectArray.length; i++) {
    grades[i].children[0].value = objectArray[i].class_name;
    grades[i].children[1].value = objectArray[i].class_number;
    grades[i].children[2].value = objectArray[i].class_credit;
    grades[i].children[3].value = objectArray[i].class_grade;
    changeColor(grades[i].children[3]);
  }
}

function merge(a1, a2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < a1.length && j < a2.length) {
    if (a1[i].class_grade_number > a2[j].class_grade_number) {
      result.push(a1[i]);
      i++;
    } else {
      result.push(a2[j]);
      j++;
    }
  }
  while (i < a1.length) {
    result.push(a1[i]);
    i++;
  }
  while (j < a2.length) {
    result.push(a2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length == 0) {
    return;
  }
  if (arr.length == 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let left = arr.slice(0, middle);
    let right = arr.slice(middle, arr.length);
    return merge(mergeSort(left), mergeSort(right));
  }
}
