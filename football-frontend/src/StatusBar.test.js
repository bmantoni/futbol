import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";
import StatusBar from "./StatusBar";

import axios from 'axios';
jest.mock('axios');

let container = null;
beforeEach(() => {
    container = document.createElement("div");
    document.body.appendChild(container);
});

afterEach(() => {
    unmountComponentAtNode(container);
    container.remove();
    container = null;
});

it("renders message", () => {
    act(() => {
        render(<StatusBar message='Brilliant Test' resetCallback={() => { }} />, container);
    });

    expect(container.querySelector(".statusMessage").textContent).toBe('Brilliant Test');
});

it("makes POST to reset on button click", async () => {
    jest.spyOn(axios, "post").mockImplementation(() =>
        Promise.resolve({
            json: () => Promise.resolve({})
        })
    );

    act(() => {
        render(<StatusBar resetCallback={() => { }} />, container);
    });
    
    const resetButton = document.querySelector("[data-testid=resetButton]");

    await act(async () => {
        resetButton.dispatchEvent(new MouseEvent("click", { bubbles: true }));
    });

    expect(axios.post.mock.calls.length).toBe(1);

    axios.post.mockRestore();
});