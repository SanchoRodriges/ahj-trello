import LocalStorage from "./localstorage";

export default class UnTrello {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.init();
  }

  events() {
    // нажатие на клавишу
    this.wrapper.addEventListener("mousedown", this.mouseDown);
    // клик
    this.wrapper.addEventListener("click", this.addTask);

    this.addForm();

    this.deleteTask();
  }

  deleteTask() {
    const remove = this.wrapper.querySelectorAll(".remove");
    remove.forEach((el) => {
      el.addEventListener("click", (e) => {
        const thisColumn = el.closest(".column");
        const thisTask = el.closest(".task");
        console.log(thisColumn.dataset.id);

        this.data[thisColumn.dataset.id].tasks.splice(thisTask.dataset.id, 1);
        // .splice(thisTask.dataset.id, 1);
        console.log(this.data[thisColumn.dataset.id].tasks);

        LocalStorage.set(this.data);
        this.init();
        // console.log('sadf');
      });
    });
  }

  addForm() {
    // показ формы
    const showForm = this.wrapper.querySelectorAll(".add");
    showForm.forEach((el) => {
      el.addEventListener("click", (e) => {
        const thisForm = el.closest(".column").querySelector(".add-task-form");
        thisForm.classList.toggle("hidden");
        el.classList.add("hidden");
      });
    });

    // добавление текста
    const formOk = this.wrapper.querySelectorAll(".add-task-ok");
    formOk.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();

        const columnId = el.closest(".column").dataset.id;
        const thisInput = el
          .closest(".add-task-form")
          .querySelector(".add-task-input");

        if (thisInput.value !== "") {
          const col = this.data[columnId];
          col.tasks.push(thisInput.value);
          LocalStorage.set(this.data);
          this.init();
        }
      });
    });

    // отмена
    const formCancel = this.wrapper.querySelectorAll(".add-task-cancel");
    formCancel.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        const thisInput = el
          .closest(".add-task-form")
          .querySelector(".add-task-input");
        const addLink = el.closest(".column").querySelector(".add");
        thisInput.value = "";
        el.closest(".add-task-form").classList.add("hidden");
        addLink.classList.remove("hidden");
      });
    });
  }

  mouseDown = (e) => {
    if (e.target.classList.contains("task")) {
      e.preventDefault();

      this.actualItem = e.target;
      this.actualItemX =
        e.clientX - this.actualItem.getBoundingClientRect().left;
      this.actualItemY =
        e.clientY - this.actualItem.getBoundingClientRect().top;
      this.actualItem.classList.add("selected");

      document.documentElement.addEventListener("mouseup", this.mouseUp);
      document.documentElement.addEventListener("mouseover", this.mouseOver);
      document.documentElement.addEventListener("mousemove", this.mouseMove);
    }
  };

  mouseMove = (e) => {
    this.actualItem.style.left = e.pageX - this.actualItemX + "px";
    this.actualItem.style.top = e.pageY - this.actualItemY + "px";
    this.actualItem.classList.add("dragged");
  };

  mouseOver = (e) => {
    console.log(e.target);

    this.actualItem.hidden = true;
    let elemBelow = document.elementFromPoint(e.clientX, e.clientY);
    this.actualItem.hidden = false;

    console.log(elemBelow);

    // if (elemBelow.classList.contains('task')) {
    //   console.log(elemBelow);
    //   this.shadow = document.createElement('div');
    //   this.shadow.style.height = '200px';

    //   elemBelow.insertAdjacentElement("afterend", this.shadow);

    // } else if (elemBelow.classList.contains('column')) {
    //   elemBelow.insertAdjacentElement("afterend", this.shadow);
    // }
  };

  mouseUp = (e) => {
    // const mouseUpItem = e.target;
    // const column = mouseUpItem.closest('.column');

    // column.insertBefore(this.actualItem, mouseUpItem);
    this.actualItem.classList.remove("selected");
    this.actualItem.classList.remove("dragged");
    this.actualItem = undefined;

    document.documentElement.removeEventListener("mouseup", this.mouseUp);
    document.documentElement.removeEventListener("mousemove", this.mouseMove);
    document.documentElement.removeEventListener("mouseover", this.mouseOver);
  };

  init() {
    this.data = LocalStorage.get();

    this.wrapper.innerHTML = "";

    for (let i = 0; i < this.data.length; i++) {
      const column = document.createElement("div");
      column.className = "column";
      // column.dataset.id = this.data[i].id;
      column.dataset.id = i;

      const columnHeader = document.createElement("div");
      columnHeader.className = "header";
      columnHeader.textContent = this.data[i].name;
      column.append(columnHeader);
      this.wrapper.append(column);

      for (let e = 0; e < this.data[i].tasks.length; e++) {
        const task = document.createElement("div");
        task.className = "task";
        task.textContent = this.data[i].tasks[e];
        task.dataset.id = e;
        task.setAttribute("draggable", "true");

        const remove = document.createElement("span");
        remove.className = "remove";
        remove.textContent = "+";
        task.insertAdjacentElement("beforeend", remove);

        column.append(task);
      }

      const addTaskForm = `
      <form class="add-task-form hidden">
        <input type="text" class="add-task-input" value="" placeholder="текст задачи">
        <input type="submit" class="add-task-ok" value="Добавить">
        <input type="submit" class="add-task-cancel" value="Отмена">
      </form>
      `;
      column.insertAdjacentHTML("beforeend", addTaskForm);

      const add = document.createElement("div");
      add.className = "add";
      add.textContent = "+ добавить задачу";
      column.append(add);
    }

    this.events();
  }
}

// events() {

//   document.addEventListener("dragstart", (e) => {
//     e.target.classList.add("dragged");
//     const clone = e.target.cloneNode(true);
//     e.target.insertAdjacentHTML("afterend", clone)

//     const columns = document.querySelectorAll(".column");

//     columns.forEach((item) => {
//       item.addEventListener("dragover", (e) => {
//         const dragging = document.querySelector(".dragged");
//         const headerColumn = item.querySelector(".header");
//         const applyAfter = getNewPosition(item, e.clientY);

//         if (applyAfter) {
//           applyAfter.insertAdjacentElement("afterend", dragging);
//         } else {
//           headerColumn.insertAdjacentElement("afterend", dragging)
//         }
//       });
//     });

//     function getNewPosition(column, posY) {
//       const cards = column.querySelectorAll(".task:not(.dragged)");

//       let result;

//       for (let refer_card of cards) {
//         const box = refer_card.getBoundingClientRect();
//         const boxCenterY = box.y + box.height / 2;

//         if (posY >= boxCenterY) result = refer_card;
//       }

//       return result;
//     }

//   });

//   document.addEventListener("dragend", (e) => {
//     e.target.classList.remove("dragged");
//   });

// }
