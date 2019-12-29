import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import ScoreBoard from "./ScoreBoard";

var container = null;
beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders scores correctly", () => {
  act(() => {
    render(<ScoreBoard player1Score='1' player2Score='0' />, container);
  });
  expect(container.querySelector(".player1Score").textContent).toBe("1");
  expect(container.querySelector(".player2Score").textContent).toBe("0");

  act(() => {
    render(<ScoreBoard player1Score='1' player2Score='2' />, container);
  });
  expect(container.querySelector(".player1Score").textContent).toBe("1");
  expect(container.querySelector(".player2Score").textContent).toBe("2");
});