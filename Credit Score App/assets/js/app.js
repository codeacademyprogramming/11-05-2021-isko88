buildTable();
function buildTable(filtertype = false) {
  fetch("https://isko88.github.io/creditdata.json")
    .then((response) => response.json())
    .then((data) => {
      // clear table
      const maintableTR = document.querySelectorAll(
        "section.table table tbody tr"
      );
      let h = false;
      maintableTR.forEach((tr) => {
        if (!h) {
          h = true;
        } else {
          tr.remove();
        }
      });
      switch (filtertype) {
        case "Active Loans":
          data = FilterActiveLoans(data);
          break;
        case "Default":
          data = Default_Filter(data);
          break;
        default:
          break;
      }

      let cnt = 0;
      for (const index in data) {
        cnt++;
        if (Object.hasOwnProperty.call(data, index)) {
          const customer_data = data[index];
          const customer_id = customer_data["id"];
          const customer_img = customer_data["img"];
          const customer_name = customer_data["name"];
          const customer_surname = customer_data["surname"];
          const customer_salary = customer_data["salary"]["value"];
          const res = customer_data["loans"].find(
            (info) => info["closed"] == false
          );
          const hasActiveLoan = res != undefined ? true : false;
          let isActiveLoan;
          if (hasActiveLoan) {
            isActiveLoan =
              '<div class="active-loan">' +
              "          <ul>" +
              "              <li data-translate='active'>Active</li>" +
              "          </ul>" +
              "      </div>";
          } else {
            isActiveLoan =
              '<div class="inactive-loan">' +
              "        <ul>" +
              "            <li data-translate='inactive'>Inactive</li>" +
              "        </ul>" +
              "    </div>";
          }
          let total_pay = 0;
          customer_data["loans"].forEach((data) => {
            if (!data["closed"]) {
              total_pay += data["perMonth"]["value"];
            }
          });

          let can_next_loan = total_pay < customer_salary * 0.45 ? true : false;
          if (can_next_loan) {
            can_next_loan = "Green_Light_Icon.svg";
          } else {
            can_next_loan = "Red_Light_Icon.svg";
          }
          const trInnerHtml =
            "              <td>" +
            cnt +
            "</td>" +
            '              <td class="customer-photo"><img src="  ' +
            customer_img +
            '  " alt="user photo"></td>' +
            "              <td>" +
            customer_name +
            " " +
            customer_surname +
            "</td>" +
            "              <td>" +
            customer_salary +
            ` (${customer_data["salary"]["currency"]})` +
            "</td>" +
            "              <td>" +
            isActiveLoan +
            "</td>" +
            "              <td class='text-center'>" +
            total_pay +
            "</td>" +
            "              <td class='text-center opacity'>" +
            `<img src='./assets/images/icons/${can_next_loan}' alt='icon' width="25px" height="25px" ` +
            "</td>";
          const tr = document.createElement("tr");
          tr.setAttribute("data-id", customer_id);
          tr.addEventListener("click", function () {
            const modaltbody = document.querySelectorAll(
              "#CustomerModal table tbody tr"
            );
            let j = false;
            modaltbody.forEach((tr) => {
              if (!j) {
                j = true;
              } else {
                tr.remove();
              }
            });
            const clickedCustomerID = this.getAttribute("data-id");
            if (customer_data["id"] == clickedCustomerID) {
              let i = 1;
              const customerPhotoURL = customer_data["img"];
              const customerFullName =
                customer_data["name"] + " " + customer_data["surname"];
              document.querySelector(
                "#current-customer-photo"
              ).src = customerPhotoURL;
              document.querySelector(
                "#current-customer-fullname"
              ).innerText = customerFullName;
              customer_data["loans"].forEach((loan) => {
                const loaner = loan["loaner"];
                const amount = loan["amount"]["value"];
                let isActive = loan["closed"];
                const monthlyPay = loan["perMonth"]["value"];
                const dueAmount = loan["dueAmount"]["value"];
                const startDate = loan["loanPeriod"]["start"];
                const endDate = loan["loanPeriod"]["end"];

                if (!isActive) {
                  isActive =
                    '<div class="active-loan">' +
                    "          <ul>" +
                    "              <li>Active</li>" +
                    "          </ul>" +
                    "      </div>";
                } else {
                  isActive =
                    '<div class="inactive-loan">' +
                    "        <ul>" +
                    "            <li>Inactive</li>" +
                    "        </ul>" +
                    "    </div>";
                }

                const ModalTR = document.createElement("tr");
                ModalTR.innerHTML =
                  `<td>${i++}</td>` +
                  `                    <td>${loaner}</td>` +
                  `                    <td>${amount}</td>` +
                  `                    <td>${isActive}</td>` +
                  `                    <td>${monthlyPay}</td>` +
                  `                    <td>${dueAmount}</td>` +
                  `                    <td>${startDate}</td>` +
                  `                    <td>${endDate}</td>`;

                document
                  .querySelector("#CustomerModal table tbody")
                  .append(ModalTR);
                document.querySelector("#CustomerModal").style.display =
                  "block";
                document.querySelector("#CustomerModal").style.opacity = "1";
              });
            }
          });
          tr.innerHTML = trInnerHtml;
          document.querySelector("section.table table tbody").append(tr);
        }
      }
    });
}

function FilterByFullName() {
  let input, filter, table, tr, td, i, txtValue;
  input = document.querySelector("#search-input");
  filter = input.value.toLowerCase();
  table = document.querySelector("section.table table");
  tr = table.querySelectorAll("tr");
  for (i = 0; i < tr.length; i++) {
    td = tr[i].querySelectorAll("td")[2];
    if (td) {
      txtValue = td.textContent || td.innerText;
      if (txtValue.toLowerCase().indexOf(filter) > -1) {
        tr[i].style.display = "";
      } else {
        tr[i].style.display = "none";
      }
    }
  }
}

// Filter Btn , click event . Display Block sort filter div;
document
  .querySelector("button.filter-btn")
  .addEventListener("click", function () {
    document.querySelector(".filter .sort-filter").classList.toggle("clicked");
  });
// In Customer Modal Close button click event
document
  .querySelector("#CustomerModal .close")
  .addEventListener("click", function () {
    document.querySelector("#CustomerModal").style.display = "none";
    document.querySelector("#CustomerModal").style.opacity = "0";
  });

//  Customer Modal will be display none when clicked over body
window.addEventListener("click", function (event) {
  if (event.target == document.querySelector("#CustomerModal")) {
    document.querySelector("#CustomerModal").style.display = "none";
    document.querySelector("#CustomerModal").style.opacity = "0";
  }
});

document
  .querySelector("#sort-active-loan")
  .addEventListener("change", function () {
    if (this.checked) {
      buildTable("Active Loans");
    }
  });
document.querySelector("#sort-default").addEventListener("change", function () {
  if (this.checked) {
    buildTable("Default");
  }
});

function FilterActiveLoans(data) {
  let newObj = [];
  data.forEach((d) =>
    d["loans"].filter((a) => {
      if (a["closed"] == false) {
        newObj.push(d);
      }
    })
  );
  return newObj;
}
function Default_Filter(data) {
  return data;
}

// Login Page Section
document.querySelector("#login-btn").addEventListener("click", function (e) {
  e.preventDefault();
  const admindata = {
    username: "pyp",
    email: "pyp@pyp.az",
    password: "pyp",
  };
  const username = document.querySelector("#username");
  const password = document.querySelector("#pass");

  if (
    username.value.toLowerCase() == admindata["username"].toLowerCase() &&
    password.value == admindata["password"]
  ) {
    document.querySelector("#login-form-page").style.display = "none";
    document.querySelector("#main-page").style.display = "block";
    sessionStorage.setItem("admindata", JSON.stringify(admindata));
    let now = new Date();
    let time = now.getTime();
    time += 3600 * 1000;
    now.setTime(time);

    const token = getToken();

    const expires = `expires=${now.toUTCString()}`;
    document.cookie = `token=${token};${expires}`;
  } else {
    username.value = "";
    password.value = "";
    document.querySelector(".login-form .error-message").style.display =
      "block";
  }
});
// Login Page END
// -----------------
const cookietoken = `token=${getToken()}`;
if (document.cookie.includes(cookietoken)) {
  document.querySelector("#main-page").style.display = "block";
  document.querySelector("#login-form-page").style.display = "none";
} else {
  document.querySelector("#login-form-page").style.display = "block";
  document.querySelector("#main-page").style.display = "none";
}

function getToken() {
  return "VSZIqlhJQh1jaCFsJqD5txdX0bbhiKu9";
}
const translater = {
  AZ: {
    selectlang: "Dili dəyişdir:",
    lang_EN: "İngilis",
    lang_AZ: "Azərbaycan",
    credit_score: "Kredit Hesabı Cədvəli",
    search_placeholder: "Ad, Soyada görə müştərilərin axtarışı",
    loaner: "Kredit verən",
    amount: "Məbləğ",
    monthly_pay: "Aylıq ödəmə",
    due_amount: "Qalan Məbləğ",
    start_date: "Başlanğıc tarix",
    end_date: "Son tarix",
    sort_by: "Sıralama",
    default: "Varsayılan",
    photo: "Şəkil",
    name_surname: "Ad & Soyad",
    monthly_salary: "Aylıq Əmək haqqı",
    active_loan: "Aktiv Kredit",
    total_monthly_pay: "Aylıq ödəmələrin cəmi",
    apply_for_loan: "Kredit üçün müraciət",
    active: "Aktiv",
    inactive: "Deaktiv",
    logout: "Çıxış",
    dark_mode: "Gecə Modu",
    light_mode: "Gündüz Modu",
  },

  EN: {
    selectlang: "Change the language:",
    lang_EN: "English",
    lang_AZ: "Azerbaijan",
    credit_score: "CREDIT SCORE TABLE",
    search_placeholder: "Search Customers by Name, Surname",
    loaner: "Loaner",
    amount: "Amount",
    monthly_pay: "Monthly pay",
    due_amount: "Due amount",
    start_date: "Start date",
    end_date: "End date",
    sort_by: "Sort by:",
    default: "Default",
    photo: "Photo",
    name_surname: "Name&Surname",
    monthly_salary: "Monthly Salary",
    active_loan: "Active loan",
    total_monthly_pay: "Total monthly pay",
    apply_for_loan: "Apply for loan",
    active: "Active",
    inactive: "Inactive",
    logout: "Logout",
    dark_mode: "Dark Mode",
    light_mode: "Light Mode",
  },
};
document
  .querySelector("ul li[data-lang=EN]")
  .addEventListener("click", function () {
    document.querySelector("html").setAttribute("lang", "en");
    if (localStorage.getItem("lang") != "EN") {
      localStorage.setItem("lang", "EN");

      changeLang("EN");
    }
  });
document
  .querySelector("ul li[data-lang=AZ]")
  .addEventListener("click", function () {
    document.querySelector("html").setAttribute("lang", "az");
    if (localStorage.getItem("lang") != "AZ") {
      localStorage.setItem("lang", "AZ");
      changeLang("AZ");
    }
  });
function changeLang(lang) {
  let willbetranslate = document.querySelectorAll("[data-translate]");
  willbetranslate.forEach((e) => {
    if (e.id == "theme_mode") {
      e.innerText = translater[lang][e.getAttribute("data-mode")];
    }else
    if (e.id == "search-input") {
      e.setAttribute(
        "placeholder",
        translater[lang][e.getAttribute("data-translate")]
      );
    } else {
      e.innerText = translater[lang][e.getAttribute("data-translate")];
    }
  });
}
switch (localStorage.getItem("lang")) {
  case "AZ":
    changeLang("AZ");
    break;
  case "EN":
    changeLang("EN");
    break;
  default:
    break;
}
document.querySelector("#logout-btn").addEventListener("click", function () {
  sessionStorage.clear();
  // localStorage.clear();
  let now = new Date();
  let time = now.getTime();
  let expireTime = time - 1000 * 3600000;
  now.setTime(expireTime);
  let res = `token=1;expires=${now.toUTCString()};`;
  document.cookie = res;
  location.reload();
});
document.querySelector("#theme_mode").addEventListener("click", function () {
  if (this.getAttribute("data-mode") == "dark_mode") {
    const cssSrc = "./assets/css/dark.css";
    document.querySelector("#switch_theme").setAttribute("href", cssSrc);
    this.setAttribute("data-mode", "light_mode");
    this.innerText = "Light Mode";
    localStorage.theme = "dark";
  } else {
    document.querySelector("#switch_theme").setAttribute("href", "");
    this.setAttribute("data-mode", "dark_mode");
    this.innerText = "Dark Mode";
    localStorage.theme = "light";
  }
});
if (localStorage.theme == "dark") {
  const cssSrc = "./assets/css/dark.css";
  document.querySelector("#switch_theme").setAttribute("href", cssSrc);
  document.querySelector("#theme_mode").setAttribute("data-mode", "light_mode");
  document.querySelector("#theme_mode").innerText = "Light Mode";
}else{
  document.querySelector("#switch_theme").setAttribute("href", "");
  document.querySelector("#theme_mode").setAttribute("data-mode", "dark_mode");
  document.querySelector("#theme_mode").innerText = "Dark Mode";
}
