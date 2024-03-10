const surveyQuestionsEndpoint = "../../api/surveys/manualapi/questions";
const surveyResponsesEndpoint = "../../api/surveys/manualapi/responses";

const responses = {};

async function issueGetSurveyQuestions(id) {
  const surveyQuestionsData = await fetch(`${surveyQuestionsEndpoint}/${id}`, {
    headers: { ...formatHeaders(), userid: getId() },
  }).then((r) => r.json());
  return surveyQuestionsData;
}

function pad(num, size = 2) {
  num = num.toString();
  while (num.length < size) num = "0" + num;
  return num;
}

async function issuePostSurveyResponses(responses) {
  const today = new Date();
  const date = `${today.getFullYear()}-${pad(today.getMonth() + 1)}-${pad(today.getDate())}T${pad(
    today.getHours()
  )}:${pad(today.getMinutes())}:${pad(today.getSeconds())}Z`;

  const data = {
    answers: responses,
    type: 1,
    date: date,
    user_id: getId(),
  };
  fetch(surveyResponsesEndpoint, {
    method: "post",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: getBearerToken(),
      userid: getId(),
    },
    body: JSON.stringify(data),
  }).then((response) => {
    if (response.status === 201 || response.status === 200) {
      showMessage("Thank You!", false);
    } else {
      showMessage("An error occurred!", true);
    }
  });
}

const showMessage = (message, isError = false) => {
  let alertElement = document.querySelector(".alert");
  alertElement.innerHTML = message;
  alertElement.classList.remove("alert-error", "alert-success");
  if (isError) {
    alertElement.classList.add("alert-error");
  } else {
    alertElement.classList.add("alert-success");
  }
  let newMessageElement = alertElement.cloneNode(true);
  alertElement.parentNode.replaceChild(newMessageElement, alertElement);
  alertElement = newMessageElement;
};

function parseQuestion(currentId) {
  const currentQuestion = document.getElementById("question-" + currentId);
  const key = currentQuestion.getAttribute("value");
  let inputValues = [];
  let nextQuestions = [];
  let textResponse = false;

  const inputElements = currentQuestion.querySelectorAll("input:checked");
  if (inputElements) {
    inputElements.forEach((inputElement) => {
      inputValues.push(inputElement.value);
      nextQuestions.push(inputElement.getAttribute("next"));
      inputElement.classList.add("selected");
      const labelElement = inputElement.nextElementSibling;
      labelElement.classList.add("selected");
    });
  }

  const textareaElement = currentQuestion.querySelector("textarea.body");
  if (textareaElement) {
    textResponse = true;
    inputValues = [textareaElement.value];
    nextQuestions.push(textareaElement.getAttribute("next"));
  }

  if (nextQuestions.length === 0 || inputValues.length === 0) {
    showMessage("Please select an option", true);
    return;
  }

  if (textResponse) {
    if (responses["Open-Ended Questions"] === undefined) {
      responses["Open-Ended Questions"] = {};
    }
    responses["Open-Ended Questions"][key] = inputValues;
  } else {
    responses[key] = inputValues;
  }

  const currentQuestionInputs = document.querySelectorAll(`#question-${currentId} input`);
  currentQuestionInputs.forEach((input) => {
    input.disabled = true;
  });

  const buttonNextElements = document.querySelectorAll("#buttonNext");
  buttonNextElements.forEach((element) => {
    element.style.display = "none";
  });

  const toRemoveElements = document.querySelectorAll("#toRemove");
  toRemoveElements.forEach((element) => {
    element.style.display = "none";
  });

  const uniqueNextQuestions = [...new Set(nextQuestions)];
  const lowestNextQuestions = Math.min(...uniqueNextQuestions);

  getQuestion(lowestNextQuestions);
}

function finish() {
  const buttonFinish = document.getElementById("buttonFinish");
  buttonFinish.disabled = true;
  issuePostSurveyResponses(responses);
}

function start() {
  const buttonStart = document.getElementById("buttonStart");
  buttonStart.style.display = "none";
  getQuestion(1);
}

async function getQuestion(id) {
  issueGetSurveyQuestions(id).then((surveyQuestionsData) => {
    const questionContainer = document.getElementById("questionContainer");
    questionContainer.innerHTML += surveyQuestionsData.question;
  });
}

showMessage("To start press <strong>Start Survey</strong>", false);
