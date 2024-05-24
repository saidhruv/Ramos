function scrollToSection(id) {
  document.getElementById(id).scrollIntoView({ behavior: "smooth" });
}

document.addEventListener("DOMContentLoaded", function () {
  let mootspaces = 0;
  function wrapLettersInSpans(node, delayStart) {
    const text = node.textContent.split(/[\s,\t,\n]+/).join(" ");
    const letters = text.split("");
    const fragment = document.createDocumentFragment();

    letters.forEach((letter, index) => {
      const span = document.createElement("span");
      if (letter === "\n") {
        mootspaces += 1;
        return fragment;
      }
      if (letter === " ") {
        if (letters[index - 1] === " ") {
          mootspaces += 2;
          return fragment;
        }
        span.classList.add("space");
        let delay = delayStart + index - mootspaces;
        if (delay < 0) {
          delay = index;
        }
        span.style.setProperty("--delay", delay);
      } else {
        span.textContent = letter;
        span.classList.add("animated-letter");
        let delay = delayStart + index - mootspaces;
        if (delay < 0) {
          delay = delayStart + index;
        }
        span.style.setProperty("--delay", delay);
      }
      fragment.appendChild(span);
    });

    return fragment;
  }

  function animateDiv(div, delayStart) {
    const children = Array.from(div.childNodes);

    children.forEach((child) => {
      if (child.nodeType === Node.TEXT_NODE) {
        const wrappedFragment = wrapLettersInSpans(child, delayStart);
        div.replaceChild(wrappedFragment, child);
        delayStart += child.textContent.split(/[\s,\t,\n]+/).join(" ").length;
      } else if (child.nodeType === Node.ELEMENT_NODE) {
        animateDiv(child, delayStart);
        delayStart += child.textContent.split(/[\s,\t,\n]+/).join(" ").length;
      }
    });
  }

  const animatedDivs = [
    "animated-1",
    "animated-2",
    "animated-3",
    "animated-4",
    "animated-5",
  ];
  animatedDivs.forEach((id) => {
    const div = document.getElementById(id);
    if (div) {
      mootspaces = 0;
      animateDiv(div, 0);
    }
  });
});

const elements = document.querySelectorAll(".hidden");
const options = {
  root: null,
  rootMargin: "0px",
  threshold: 0.01,
};
const callbacks = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("active");
    }
  });
};
let observer = new IntersectionObserver(callbacks, options);
elements.forEach((element) => {
  observer.observe(element);
});

const valueDisplays = document.querySelectorAll(".animated-number");
const interval = 5000;
valueDisplays.forEach((valueDisplay) => {
  let startValue = 0;
  const valueType = valueDisplay.getAttribute("data-type");
  const endValue = parseInt(valueDisplay.getAttribute("data-val"));
  const decValue = parseFloat(valueDisplay.getAttribute("data-dec"));
  let duration = Math.floor(interval / endValue);
  const counter = setInterval(() => {
    startValue += 1;
    valueDisplay.textContent = startValue;
    if (startValue === endValue) {
      if (valueType === "dec") {
        valueDisplay.textContent = startValue + decValue;
      }
      clearInterval(counter);
    }
  }, duration);
});
