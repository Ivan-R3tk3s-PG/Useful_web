document.addEventListener('DOMContentLoaded', () => {
    const gradeCalculatorSection = document.getElementById('grade-calculator-tool');
    if (!gradeCalculatorSection) return;

    const subjectsContainer = document.getElementById('subjects-container');
    const addSubjectBtn = document.getElementById('add-subject-btn');
    const calculateAverageBtn = document.getElementById('calculate-average-btn');
    const resultDiv = document.getElementById('grade-average-result');

    function addSubjectEntry() {
        const newEntry = document.createElement('div');
        newEntry.classList.add('subject-entry');
        newEntry.innerHTML = `
            <input type="text" class="subject-name" placeholder="Subject Name">
            <input type="number" class="subject-grade" placeholder="Grade">
            <input type="number" class="subject-credits" placeholder="Credits">
            <button type="button" class="remove-subject" onclick="removeSubjectEntry(this)">Remove</button>
        `;
        subjectsContainer.appendChild(newEntry);
    }

    window.removeSubjectEntry = function(button) {
        if (subjectsContainer.children.length > 1) {
            button.parentElement.remove();
        } else {
            const entry = button.parentElement;
            entry.querySelector('.subject-name').value = '';
            entry.querySelector('.subject-grade').value = '';
            entry.querySelector('.subject-credits').value = '';
            resultDiv.textContent = 'Requires at least one subject.';
            resultDiv.style.backgroundColor = 'var(--accent-secondary-glow)';
            resultDiv.style.color = 'var(--text-light)';
            resultDiv.style.borderColor = 'var(--accent-secondary)';
        }
        calculateAverage(); // Recalculate average after removing/clearing
    }

    function calculateAverage() {
        const subjectEntries = subjectsContainer.querySelectorAll('.subject-entry');
        let totalWeightedGrade = 0;
        let totalCredits = 0;
        let isValidOverall = true;
        let entryCount = 0;

        resultDiv.textContent = '';
        resultDiv.style.backgroundColor = 'transparent'; // Reset result style
        resultDiv.style.borderColor = 'transparent';
        resultDiv.style.boxShadow = 'none';


        if (subjectEntries.length === 0) {
            resultDiv.textContent = 'Please add subject details.';
             resultDiv.style.backgroundColor = 'var(--accent-secondary-glow)';
             resultDiv.style.color = 'var(--text-light)';
             resultDiv.style.borderColor = 'var(--accent-secondary)';
            return;
        }

        subjectEntries.forEach(entry => {
            entryCount++;
            const gradeInput = entry.querySelector('.subject-grade');
            const creditsInput = entry.querySelector('.subject-credits');
            const nameInput = entry.querySelector('.subject-name');

            const gradeStr = gradeInput.value.trim();
            const creditsStr = creditsInput.value.trim();
            const nameStr = nameInput.value.trim();

            let currentEntryValid = true;

            gradeInput.style.borderColor = '';
            creditsInput.style.borderColor = '';
            nameInput.style.borderColor = '';
            gradeInput.style.boxShadow = '';
            creditsInput.style.boxShadow = '';
            nameInput.style.boxShadow = '';


            if (nameStr === '' && gradeStr === '' && creditsStr === '') {
                 // Allow completely empty rows unless it's the only row
                 if (subjectEntries.length === 1) {
                      nameInput.style.borderColor = 'var(--accent-secondary)';
                      gradeInput.style.borderColor = 'var(--accent-secondary)';
                      creditsInput.style.borderColor = 'var(--accent-secondary)';
                      currentEntryValid = false;
                 } else {
                      // Skip this empty row for calculation if it's not the only one
                      entryCount--; // Don't count this row if it's completely empty and not the only one
                      return; // Use return to skip the rest of the forEach iteration for this entry
                 }
            }


             const grade = parseFloat(gradeStr);
             const credits = parseFloat(creditsStr);

            if (nameStr === '') {
                 nameInput.style.borderColor = 'var(--accent-secondary)';
                 nameInput.style.boxShadow = '0 0 0 2px var(--accent-secondary-glow)';
                 currentEntryValid = false;
            }
            // Use gradeStr === '' to check if it was left empty, allow 0 grade
            if (gradeStr === '' || isNaN(grade) || grade < 0) {
                gradeInput.style.borderColor = 'var(--accent-secondary)';
                gradeInput.style.boxShadow = '0 0 0 2px var(--accent-secondary-glow)';
                currentEntryValid = false;
            }
            if (creditsStr === '' || isNaN(credits) || credits <= 0) {
                creditsInput.style.borderColor = 'var(--accent-secondary)';
                creditsInput.style.boxShadow = '0 0 0 2px var(--accent-secondary-glow)';
                currentEntryValid = false;
            }

            if(currentEntryValid){
                totalWeightedGrade += grade * credits;
                totalCredits += credits;
            } else {
                isValidOverall = false;
            }
        });

        if (!isValidOverall) {
            resultDiv.textContent = 'Error: Please check highlighted fields for valid entries.';
            resultDiv.style.backgroundColor = 'rgba(255, 80, 80, 0.2)'; // Reddish error background
            resultDiv.style.color = '#ffdddd';
            resultDiv.style.borderColor = '#ff5050';
            resultDiv.style.boxShadow = '0 0 15px rgba(255, 80, 80, 0.4)';
            return;
        }

         if (entryCount === 0) { // If all rows were skipped as empty
             resultDiv.textContent = 'Please enter subject details.';
             resultDiv.style.backgroundColor = 'var(--accent-secondary-glow)';
             resultDiv.style.color = 'var(--text-light)';
             resultDiv.style.borderColor = 'var(--accent-secondary)';
             return;
         }


        if (totalCredits === 0 ) {
             resultDiv.textContent = 'Error: Total credits cannot be zero. Enter valid credits.';
             resultDiv.style.backgroundColor = 'rgba(255, 80, 80, 0.2)';
             resultDiv.style.color = '#ffdddd';
             resultDiv.style.borderColor = '#ff5050';
             resultDiv.style.boxShadow = '0 0 15px rgba(255, 80, 80, 0.4)';
            return;
        }


        const average = totalWeightedGrade / totalCredits;
        resultDiv.textContent = `Weighted Average: ${average.toFixed(2)}`;
        // Apply success styling from CSS
        resultDiv.style.background = 'linear-gradient(60deg, var(--accent-glow), var(--accent-secondary-glow))';
        resultDiv.style.color = 'var(--text-light)';
        resultDiv.style.borderColor = 'var(--accent-primary)';
        resultDiv.style.boxShadow = '0 0 25px var(--accent-glow)';
    }

    if (addSubjectBtn) {
        addSubjectBtn.addEventListener('click', addSubjectEntry);
    }

    if (calculateAverageBtn) {
        calculateAverageBtn.addEventListener('click', calculateAverage);
    }

    // Add event listeners to recalculate dynamically on input change (optional, can be heavy)
    
    subjectsContainer.addEventListener('input', (event) => {
        if (event.target.matches('.subject-name, .subject-grade, .subject-credits')) {
             calculateAverage(); // Recalculate on any input change in the relevant fields
        }
    });
    

    if (subjectsContainer && subjectsContainer.children.length === 0) {
        addSubjectEntry();
    } else {
        // Initial calculation in case the page was reloaded with values
        calculateAverage();
    }
});