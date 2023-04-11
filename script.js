let currId = 0;
const customers = [];

class Client {
  constructor(name, vatId, address) {
    this.id = getCurrId();
    this.name = name;
    this.vatId = vatId;
    this.address = address;
    this.joinDate = new Date();
  }
}

function getCurrId() {
  currId++;
  return currId;
}

const reset = document.querySelector(".reset");
const submit = document.querySelector(".submit");

const form = document.querySelector(".customer__form");
const formName = document.querySelector("#name");
const formVatId = document.querySelector("#vatId");
const formAddress = document.querySelector("#address");
const formId = document.querySelector("#id");

const inputFields = [formName, formVatId, formAddress];

const formNameError = document.querySelector(".customer__form__error--name");
const formVatIdError = document.querySelector(".customer__form__error--vatId");
const formAddressError = document.querySelector(
  ".customer__form__error--address"
);

const errorFields = [formNameError, formVatIdError, formAddressError];

const customersList = document.querySelector(".customer__list");

form.addEventListener("submit", handleSubmit);
form.addEventListener("reset", handleReset);
customersList.addEventListener("click", handleCustomerClicks);

function handleSubmit(e) {
  e.preventDefault();
  resetErrors();

  let errors = 0;
  if (formName.value == "") {
    errors = 1;
    displayError(formNameError, "Field required");
  }
  if (formVatId.value == "") {
    errors = 1;
    displayError(formVatIdError, "Field required");
  }
  if (formAddress.value == "") {
    errors = 1;
    displayError(formAddressError, "Field required");
  }

  if (errors) return;

  if (formId.value == "") {
    customers.push(
      new Client(formName.value, formVatId.value, formAddress.value)
    );
  } else {
    const customer = customers.find((cust) => cust.id == Number(formId.value));
    if (!customer) {
      alert("no customer with this id found. Abording Edit");
      exitEdit();
      clearInputs();
      return;
    }

    customer.name = formName.value;
    customer.vatId = formVatId.value;
    customer.address = formAddress.value;
    exitEdit();
  }

  clearInputs();
  displayCustomers();
}

function handleReset(e) {
  e.preventDefault();
  clearInputs();
  exitEdit();
  resetErrors();
}

function handleCustomerClicks(e) {
  if (!e.target.classList.contains("customer--btn")) return;
  const isDelete = e.target.classList.contains("customer__delete");
  const clickedCustomer = e.target.closest(".customer");
  if (!clickedCustomer) return;

  if (isDelete) {
    try {
      const customerId = Number(getIdFromCustomerElement(clickedCustomer));
      const customerArrId = customers.findIndex(
        (cust) => cust.id == customerId
      );

      if (customerArrId == -1)
        throw new Error("Customer not found in database");

      customers.splice(customerArrId, 1);
    } catch (error) {
      alert(error.message);
      return;
    }
  } else {
    const customerId = Number(getIdFromCustomerElement(clickedCustomer));
    const customer = customers.find((cust) => cust.id == customerId);
    formId.value = `${customer.id}`;
    formAddress.value = `${customer.address}`;
    formName.value = `${customer.name}`;
    formVatId.value = `${customer.vatId}`;
    reset.classList.remove("hidden");
    submit.value = "Update customer";
  }

  displayCustomers();
}

function displayCustomers() {
  customersList.innerHTML = "";

  for (const customer of customers) {
    const newCustomerBlock = document.createElement("div");
    newCustomerBlock.id = `customer--${customer.id}`;
    newCustomerBlock.classList.add("customer");
    newCustomerBlock.innerHTML = `
        <div class="customer__left">
        <p>Name: ${customer.name}</p>
        <p>VAT: ${customer.vatId}</p>
        <p>Address: ${customer.address}</p>
        <p>Creation date: ${customer.joinDate.getDate()}.${
      customer.joinDate.getMonth() + 1
    }.${customer.joinDate.getFullYear()}</p>
        </div>
        <div class="customer__right">
            <div class="customer__delete customer--btn">
                Delete
            </div>
            <div class="customer__edit customer--btn">
                Edit
            </div>
        </div>
        `;

    customersList.appendChild(newCustomerBlock);
  }
}

function displayError(errorField, message) {
  errorField.innerHTML = message;
  errorField.classList.toggle("hidden");
}

function resetErrors() {
  for (const err of errorFields) {
    err.classList.add("hidden");
    err.innerHTML = "";
  }
}

function clearInputs() {
  for (const field of inputFields) field.value = "";
}

function exitEdit() {
  formId.value = "";
  reset.classList.add("hidden");
  submit.value = "Add customer";
}

function getIdFromCustomerElement(customer) {
  const regex = /[0-9]+/g;
  const customerIdIndex = customer.id.search(regex);

  if (!customerIdIndex) throw new Error("No id in customer element");

  return customer.id.substr(customerIdIndex);
}

displayCustomers();
