const backdropContainer = document.querySelector("#backdrop");
const formContainer = document.querySelector("#backdrop .rounded-2xl");
const updateBackdropContainer = document.querySelector("#updateBackdrop");
const updateFormContainer = document.querySelector(
  "#updateBackdrop .rounded-2xl"
);
const updateForm = document.getElementById("updateForm");

const itemName = document.getElementById("update_name_of_drink");
const batchNumber = document.querySelector("#update_batch_number");
const drink_subtype = document.querySelector("#update_drink_subtype");
const quantity = document.querySelector("#update_quantity");
const Expirydate = document.querySelector("#update_expiry_date");
const price = document.querySelector("#update_price");

const fetchData = () => {
  fetch("/fetchdata")
    .then((res) => res.json())
    .then((response) => {
      console.log("Raw response:", response);
      const data = Array.isArray(response) ? response : response.data || [];
      console.log("Processed data:", data);
      const tbody = document.querySelector("tbody");
      tbody.innerHTML = "";
      if (!Array.isArray(data)) {
        console.error("Data is not an array:", data);
        return;
      }

      data.forEach((item) => {
        const row = document.createElement("tr");
        console.log(item);

        let formattedDate = "N/A";
        if (item[4]) {
          const date = new Date(item[4]);
          const day = String(date.getDate()).padStart(2, "0");
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const year = date.getFullYear();
          formattedDate = `${day}/${month}/${year}`;
        }

        row.className = "border-b mx-2 py-3 border-gray-100";
        row.innerHTML = `
            <td class="py-3 px-1 w-[20%] text-left">${item[0]}</td>
            <td class="py-3 px-1 w-[20%] text-left">${item[1]}</td>
            <td class="py-3 px-1 w-[20%] text-left">N${item[2]}</td>
            <td class="py-3 px-1 w-[20%] text-left">${item[3]}</td>
            <td class="py-3 px-1 w-[20%] text-left">${formattedDate}</td>
            <td class="py-3 flex gap-4 items-center justify-between px-1 flex-1 text-left">
                <button data-id="${item[0]}" class="edit-btn bg-green-500 py-3 px-8 text-sm text-white rounded-xl hover:scale-105 transition-all cursor-pointer">Edit</button>
                <button data-id="${item[0]}" class="delete-btn bg-red-700 py-3 px-8 text-sm text-white rounded-xl hover:scale-105 transition-all cursor-pointer">Delete</button>
            </td>
        `;
        tbody.appendChild(row);
      });

      const showUpdateBackdrop = () => {
        if (updateBackdropContainer) {
          updateBackdropContainer.classList.add("show");
        } else {
          console.error("updateBackdropContainer not found");
        }
      };

      const hideUpdateBackdrop = () => {
        if (updateBackdropContainer) {
          updateBackdropContainer.classList.remove("show");
        }
      };

      // Edit button event listeners
      document.querySelectorAll(".edit-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const id = event.target.getAttribute("data-id");
          console.log("Edit button clicked for ID:", id);
          const newId = Number(id);
          const matchingId = data.find((item) => item[0] === newId);
          if (matchingId) {
            console.log("Matching item:", matchingId);
            showUpdateBackdrop();

            itemName.value = matchingId[1] || "";
            batchNumber.value = matchingId[0] || "";
            drink_subtype.value = matchingId[3] || "";
            quantity.value = matchingId[3] || "";
            price.value = matchingId[2] || "";

            updateForm.action = `/update/${matchingId[0]}`;

            if (matchingId[4]) {
              const date = new Date(matchingId[4]);
              const formattedDate = date.toISOString().split("T")[0];
              Expirydate.value = formattedDate;
            } else {
              Expirydate.value = "";
            }
          } else {
            console.log("No matching ID found");
          }
        });
      });

      document.querySelectorAll(".delete-btn").forEach((button) => {
        button.addEventListener("click", (event) => {
          const id = event.target.getAttribute("data-id");
          console.log("Delete button clicked for ID:", id);
          const newId = Number(id);
          const matchingId = data.find((item) => item[0] === newId);
          console.log('newID', newId)
          if (matchingId) {
            console.log("ready to delete");
            async function Delete(id) {
              const res = await fetch(`/delete/${newId}`, {
                method: "DELETE",
                headers: {
                  ContentType: "application/json",
                },
              });
              console.log("Delted");
              fetchData();
            }

            Delete(matchingId);
          }
        });
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
};

const showBackdrop = () => {
  if (backdropContainer) {
    backdropContainer.classList.add("show");
  }
};

const hideBackdrop = () => {
  if (backdropContainer) {
    backdropContainer.classList.remove("show");
  }
};

const hideUpdateBackdrop = () => {
  updateBackdropContainer.classList.remove("show");
};

formContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

updateFormContainer.addEventListener("click", (event) => {
  event.stopPropagation();
});

document.addEventListener("DOMContentLoaded", fetchData);
