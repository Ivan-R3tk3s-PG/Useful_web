document.addEventListener("DOMContentLoaded", () => {
  const gradeCalculatorSection = document.getElementById(
    "grade-calculator-tool"
  );
  if (!gradeCalculatorSection) return;

  const subjectsContainer = document.getElementById("subjects-container");
  const addSubjectBtn = document.getElementById("add-subject-btn");
  const calculateAverageBtn = document.getElementById("calculate-average-btn");
  const resultDiv = document.getElementById("grade-average-result");

  function addSubjectEntry() {
    const newEntry = document.createElement("div");
    newEntry.classList.add("subject-entry");
    newEntry.innerHTML = `
            <input type="text" class="subject-name" placeholder="Subject Name">
            <input type="number" class="subject-grade" placeholder="Grade">
            <input type="number" class="subject-credits" placeholder="Credits">
            <button type="button" class="remove-subject" onclick="removeSubjectEntry(this)">Remove</button>
        `;
    subjectsContainer.appendChild(newEntry);
  }

  window.removeSubjectEntry = function (button) {
    if (subjectsContainer.children.length > 1) {
      button.parentElement.remove();
    } else {
      const entry = button.parentElement;
      entry.querySelector(".subject-name").value = "";
      entry.querySelector(".subject-grade").value = "";
      entry.querySelector(".subject-credits").value = "";
      resultDiv.textContent = "At least one subject entry is required.";
    }
  };

  function calculateAverage() {
    const subjectEntries = subjectsContainer.querySelectorAll(".subject-entry");
    let totalWeightedGrade = 0;
    let totalCredits = 0;
    let isValidOverall = true;

    resultDiv.textContent = "";

    if (subjectEntries.length === 0) {
      resultDiv.textContent = "Please add at least one subject.";
      return;
    }

    subjectEntries.forEach((entry) => {
      const gradeInput = entry.querySelector(".subject-grade");
      const creditsInput = entry.querySelector(".subject-credits");
      const nameInput = entry.querySelector(".subject-name");

      const grade = parseFloat(gradeInput.value);
      const credits = parseFloat(creditsInput.value);
      let currentEntryValid = true;

      gradeInput.style.borderColor = "";
      creditsInput.style.borderColor = "";
      nameInput.style.borderColor = "";

      if (nameInput.value.trim() === "") {
        nameInput.style.borderColor = "red";
        currentEntryValid = false;
      }
      if (isNaN(grade) || grade < 0) {
        gradeInput.style.borderColor = "red";
        currentEntryValid = false;
      }
      if (isNaN(credits) || credits <= 0) {
        creditsInput.style.borderColor = "red";
        currentEntryValid = false;
      }

      if (currentEntryValid) {
        totalWeightedGrade += grade * credits;
        totalCredits += credits;
      } else {
        isValidOverall = false;
      }
    });

    if (!isValidOverall) {
      resultDiv.textContent =
        "Error: Please enter valid subject names, non-negative grades, and positive credits for all entries.";
      return;
    }

    if (totalCredits === 0) {
      let allEmpty = true;
      subjectEntries.forEach((entry) => {
        if (
          entry.querySelector(".subject-name").value.trim() !== "" ||
          entry.querySelector(".subject-grade").value.trim() !== "" ||
          entry.querySelector(".subject-credits").value.trim() !== ""
        ) {
          allEmpty = false;
        }
      });
      if (allEmpty) {
        resultDiv.textContent = "Please enter subject details.";
      } else {
        resultDiv.textContent =
          "Error: Total credits cannot be zero. Please enter valid credits for your subjects.";
      }
      return;
    }

    const average = totalWeightedGrade / totalCredits;
    resultDiv.textContent = `Your weighted average is: ${average.toFixed(2)}`;
  }

  if (addSubjectBtn) {
    addSubjectBtn.addEventListener("click", addSubjectEntry);
  }

  if (calculateAverageBtn) {
    calculateAverageBtn.addEventListener("click", calculateAverage);
  }

  if (subjectsContainer && subjectsContainer.children.length === 0) {
    addSubjectEntry();
  }
});
