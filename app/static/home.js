
// document.getElementById('basic').checked = true
document.getElementById('myToggle').disabled = true
document.getElementById('myToggleLabel').classList.add('inactive')

// add listneres to the accidental radio buttons to change the state of Toggle switch
document.querySelectorAll('.radio-btn.accidental').forEach(radio => {
    radio.addEventListener('click', () => {
        if (radio.value === 'noAccidental'){
            document.getElementById('myToggleLabel').classList.add('inactive')
            document.getElementById('myToggle').checked = false
            document.getElementById('myToggle').disabled = true
        } else {
            document.getElementById('myToggleLabel').classList.remove('inactive')
            document.getElementById('myToggle').disabled = false
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
                if (document.getElementById('myToggle').checked === true){
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
            play.href = play.dataset.playurl + '?level=' + radio.value + '&flats=' + flats + '&sharps=' + sharps + '&accidentals=' + accidentals
        }
    })

})