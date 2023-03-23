export default class LocalStorage {
  static data = [
    {
      id: 1,
      name: "TODO",
      tasks: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
        "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
      ],
    },
    {
      id: 2,
      name: "IN PROGRESS",
      tasks: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
        "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
      ],
    },
    {
      id: 3,
      name: "DONE",
      tasks: [
        "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
        "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
        "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
      ],
    },
  ];

  static set(data) {
    localStorage.setItem("unterllo", JSON.stringify(data));
    this.data = data;
  }

  static get() {
    if (localStorage.getItem("unterllo")) {
      return JSON.parse(localStorage.getItem("unterllo"));
    }

    return this.data;
  }
}
