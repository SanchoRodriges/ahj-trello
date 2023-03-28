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

  mouseDown = (e) => {
    if (e.target.classList.contains("task")) {
      e.preventDefault();

      this.actualItem = e.target;
      this.actualItemX =
        e.clientX - this.actualItem.getBoundingClientRect().left;
      this.actualItemY =
        e.clientY - this.actualItem.getBoundingClientRect().top;
      this.actualItem.classList.add("selected");

      // id записи в объекте data
      const columnId = this.actualItem.closest(".column").dataset.id;
      const itemId = this.actualItem.dataset.id;
      this.removeDataElement = { columnId, itemId };

      // создаю проекцию
      const proection = document.createElement("div");
      proection.classList.add("proection");
      // записываю проекцию в свойство
      this.proection = proection;
      // добавляю после актуального элемента
      this.actualItem.insertAdjacentElement("afterend", this.proection);

      document.documentElement.addEventListener("mouseup", this.mouseUp);
      document.documentElement.addEventListener("mousemove", this.mouseMove);
    }
  };

  mouseMove = (e) => {
    // позиционирую элемент
    this.actualItem.style.left = e.pageX - this.actualItemX + "px";
    this.actualItem.style.top = e.pageY - this.actualItemY + "px";
    this.actualItem.classList.add("dragged");
    // добавляю проекции размеры
    this.proection.style.height = this.actualItem.offsetHeight + "px";
    this.proection.style.width = this.actualItem.offsetWidth + "px";
    // получаю объект под курсором
    const target = e.target;
    if (target.classList.contains("task")) {
      const { y, height } = target.getBoundingClientRect();
      const appendPosition =
        y + height / 2 > e.clientY ? "beforebegin" : "afterend";
      target.insertAdjacentElement(appendPosition, this.proection);
    }
  };

  mouseUp = (e) => {
    this.actualItem.classList.remove("selected");
    this.actualItem.classList.remove("dragged");
    this.actualItem.style.left = "";
    this.actualItem.style.top = "";
    this.proection.insertAdjacentElement("afterend", this.actualItem);

    // this.actualItem = undefined;
    this.proection.remove();

    // добавляем новый элемент в объект data
    const thisColumnId = this.actualItem.closest(".column").dataset.id;
    let previousId = this.actualItem.previousSibling.dataset.id;

    previousId = previousId ? Number(previousId) + 1 : 0;
    console.log(typeof previousId);
    this.data[thisColumnId].tasks.splice(
      previousId,
      0,
      this.actualItem.innerText
    );

    // удаляем старый элемент из объекта data
    this.data[this.removeDataElement.columnId].tasks.splice(
      this.removeDataElement.itemId,
      1
    );

    LocalStorage.set(this.data);
    this.init();

    document.documentElement.removeEventListener("mouseup", this.mouseUp);
    document.documentElement.removeEventListener("mousemove", this.mouseMove);
  };

  deleteTask() {
    const remove = this.wrapper.querySelectorAll(".remove");
    remove.forEach((el) => {
      el.addEventListener("click", (e) => {
        const thisColumn = el.closest(".column");
        const thisTask = el.closest(".task");

        this.data[thisColumn.dataset.id].tasks.splice(thisTask.dataset.id, 1);

        LocalStorage.set(this.data);
        this.init();
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

  init() {
    this.data = LocalStorage.get();

    this.wrapper.innerHTML = "";

    for (let i = 0; i < this.data.length; i++) {
      const column = document.createElement("div");
      column.className = "column";
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
