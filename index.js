// MicroState:
// A Nespresso machine finite state emulator

// This function clears any existing event handlers from the DOM event target.
// Returns the newly-created DOM element.
const copyAndReplaceElement = (domEl) =>
  new Promise((res) => res(domEl.cloneNode(true))).then((newEl) => {
    domEl.parentNode.replaceChild(newEl, domEl);
    return newEl;
  });

// A call to init attaches an event listener that updates state when triggered.
// These events are singletons, and can get called only once before being replaced.
const attachEventToDomNode = ([eventHandler, selector, eventType]) =>
  new Promise((resolve) => resolve(document.querySelector(selector)))
    .then(copyAndReplaceElement)
    .then((newEl) =>
      newEl.addEventListener(eventType, eventHandler, { once: true })
    );

// Yo dogg.
// I heard you like higher-order functions...
// So this program has functions that return functions that return Promises
// ... so you can curry while you curry.

// The reason for this is that it lets me use a single argument with each then() in the event handler chain.
const checkPossibleStateTransitions =
  (allStates) => (currentState) => (nextState) =>
    new Promise((resolve, reject) =>
      allStates
        .flatMap(([state, possibleTransitions]) =>
          state === currentState ? possibleTransitions : null
        )
        .filter((possibleTransition) => !!possibleTransition) // Removes any null values
        .some((possibleTransition) => possibleTransition === nextState)
        ? resolve(nextState)
        : reject(`${nextState} is not a valid transition from ${currentState}.`)
    );

const useState = (currentState) => (newState) =>
  new Promise((resolve, reject) =>
    resolve([
      ["off", ["idle"]], // Default, after click "off"
      ["idle", ["brewing", "off"]], // After click "on"
      ["brewing", ["idle"]], // After click "brew"
    ])
  )
    .then(checkPossibleStateTransitions)
    .then((againstCurrentState) => againstCurrentState(currentState))
    .then((andNewtState) => andNewtState(newState));

const turnOn = (state) => () =>
  state
    .then(useState)
    .then((setStateTo) => setStateTo("idle"))
    .then(updateAll)
    .catch(console.log);

const turnOff = (state) => () =>
  state
    .then(useState)
    .then((setStateTo) => setStateTo("off"))
    .then(updateAll)
    .catch(console.log);

const brew = (state) => () =>
  state
    .then(useState)
    .then((setStateTo) => setStateTo("brewing"))
    .then(updateAll)
    .then(useState)
    .then(
      (setStateTo) =>
        new Promise((resolve) =>
          setTimeout(() => resolve(setStateTo("idle")), 3000)
        )
    )
    .then(updateAll)
    .catch(console.log);

// This gets called from updateAll.
// It receives the event listener init functions, and passes state to each of them, which they then use to attach the event listeners.
// It then returns state, so that state can continue to be used from the next link in whichever chain happened to call updateAll.
const readyEventHandlers = (selectorEventCombos) => (stateVal) =>
  new Promise((resolve) =>
    resolve(
      selectorEventCombos
        .map(([eventHandlerInit, ...otherArgs]) => [
          eventHandlerInit(Promise.resolve(stateVal)), // Initialize the event handlers with current state
          ...otherArgs, // Pass-along the rest args
        ])
        .forEach(attachEventToDomNode)
    )
  ).then(() => stateVal);

// This function should be triggered after every event-handler gets run.
// It will re-initialize the event-handlers to reflect the updated state.
const updateAll = (state) =>
  new Promise((resolve) =>
    resolve([
      [turnOn, "#on", "click"],
      [turnOff, "#off", "click"],
      [brew, "#brew", "click"],
    ])
  )
    .then(readyEventHandlers)
    .then((init) => init(state))
    .then((newState) => {
      console.log(`The new state is ${newState}`);

      return newState;
    });

/// Define the initial state by calling the same function that gets called after every state update...
updateAll(new Promise((resolve) => resolve("off")));
