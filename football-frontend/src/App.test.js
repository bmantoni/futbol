import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";

import axios from 'axios';
jest.mock('axios');

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

it("makes POST to join when rendered", async () => {
  jest.spyOn(axios, "post").mockImplementation(() =>
    Promise.resolve({
      json: () => Promise.resolve({player: '1'})
    })
  );

  await act(async () => {
    render(<App />, container);
  });

  expect(axios.post.mock.calls.length).toBe(1);

});

// TODO verify it passes the returned player # to Pitch component