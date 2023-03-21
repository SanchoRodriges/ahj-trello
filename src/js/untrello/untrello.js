import LocalStorage from "./localstorage";

export default class UnTrello {
  constructor(wrapper) {
    this.wrapper = wrapper;
    this.events();
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

  mouseDown = e => {
    if (e.target.classList.contains("task")) {
      e.preventDefault();

      this.actualItem = e.target;
      this.actualItemX = e.clientX - this.actualItem.getBoundingClientRect().left;
      this.actualItemY = e.clientY - this.actualItem.getBoundingClientRect().top;
      this.actualItem.classList.add("selected");


      document.documentElement.addEventListener("mouseup", this.mouseUp);
      document.documentElement.addEventListener("mouseover", this.mouseOver);
      document.documentElement.addEventListener("mousemove", this.mouseMove);

    }
  }

  mouseMove = e => {
   
    this.actualItem.style.left = e.pageX - this.actualItemX + 'px';
    this.actualItem.style.top = e.pageY - this.actualItemY + 'px';
    this.actualItem.classList.add("dragged");

  }

  mouseOver = e => {

    
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
  }

  mouseUp = e => {
    // const mouseUpItem = e.target;
    // const column = mouseUpItem.closest('.column');

    // column.insertBefore(this.actualItem, mouseUpItem);
    this.actualItem.classList.remove("selected");
    this.actualItem.classList.remove("dragged");
    this.actualItem = undefined;

    document.documentElement.removeEventListener("mouseup", this.mouseUp);
    document.documentElement.removeEventListener("mousemove", this.mouseMove);
    document.documentElement.removeEventListener("mouseover", this.mouseOver);
  }

  events() {
    this.wrapper.addEventListener("mousedown", this.mouseDown);
  }

  init() {
    const data = LocalStorage.get();

    for (let i = 0; i < data.length; i++) {
      const column = document.createElement("div");
      column.className = "column";

      const columnHeader = document.createElement("div");
      columnHeader.className = "header";
      columnHeader.textContent = data[i].name;
      column.append(columnHeader);
      this.wrapper.append(column);

      for (let e = 0; e < data[i].tasks.length; e++) {
        const task = document.createElement("div");
        task.className = "task";
        task.textContent = data[i].tasks[e];
        task.setAttribute('draggable', 'true');
        column.append(task);
      }

      const add = document.createElement("div");
      add.className = "add";
      add.textContent = "+ добавить задачу";
      column.append(add);
    }
  }
}
