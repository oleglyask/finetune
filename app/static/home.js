// embeded into html
// document.getElementById('basic').checked = true
// document.getElementById('accOnlyToggle').disabled = true
// document.getElementById('accOnlyToggleLabel').classList.add('inactive')

// scroll to the bottom of the page when page loads
// window.onload = function () {
//     setTimeout(function () {
//         document.querySelector('.cheat-sheet').scrollIntoView({behavior: 'smooth'}, false);
//     }, 100);
// }

// add listneres to the accidental radio buttons to change the state of Toggle switch
document.querySelectorAll('.radio-btn.accidental').forEach(radio => {
    radio.addEventListener('click', () => {
        if (radio.value === 'noAccidental'){
            document.getElementById('accOnlyToggleLabel').classList.add('inactive')
            document.getElementById('accOnlyToggle').checked = false
            document.getElementById('accOnlyToggle').disabled = true
        } else {
            document.getElementById('accOnlyToggleLabel').classList.remove('inactive')
            document.getElementById('accOnlyToggle').disabled = false
        }
    })
})

// when PLAY button is pressed, get the info and send to VIEW function
document.getElementById('play').addEventListener('click', () => {

    sharps = false;
    flats = false;
    accidentals = false

    // Check Values of accidental
    document.querySelectorAll('.radio-btn.accidental').forEach(radio => {
        if (radio.checked === true) {
            // if TRUE then we found the checked radio button
            if (radio.value !== 'noAccidental'){
                // the VALUE is to include some Accidentals, check what kind
                if (radio.value === 'sharpAccidental'){
                    sharps = true;
                } else if (radio.value === 'flatAccidental'){
                    flats = true;
                } else {
                    sharps = true;
                    flats = true;
                }

                // Check Value of TOGGLE switch to include/only accidentals
                if (document.getElementById('accOnlyToggle').checked === true){
                    accidentals = 'only';
                } else {
                    accidentals = 'include';
                }
            }
        }
    })

    // check the LEVEL selected and send to Play VIEW function
    document.querySelectorAll('.radio-btn.level').forEach(radio => {
        if (radio.checked === true) {
            play.href = play.dataset.playurl + '?level=' + radio.value + '&flats=' + flats + '&sharps=' + sharps +
            '&accidentals=' + accidentals + '&learningMode=' + document.getElementById('learningModeToggle').checked
        }
    })

})