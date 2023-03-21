export default class LocalStorage {
  static set() {}

  static get() {
    return [
      {
        name: "TODO",
        tasks: [
          "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
          "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
        ],
      },
      {
        name: "IN PROGRESS",
        tasks: [
          "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
          "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
        ],
      },
      {
        name: "DONE",
        tasks: [
          "Lorem ipsum dolor sit amet consectetur adipisicing elit.",
          "Repudiandae ad earum reprehenderit dolorum cumque necessitatibus.",
          "Iusto aliquid excepturi voluptates eveniet magni ipsa vitae distinctio repellat quaerat enim nostrum, nam fugiat.",
        ],
      },
    ];
  }
}
