
// document.getElementById('basic').checked = true

play = document.getElementById('play')
play.addEventListener('click', () => {

        sharps = false;
        flats = false;
        accidentals = false

        // Check Values of accidental
        document.querySelectorAll('.radio-btn.accidental').forEach(radio => {
            if (radio.checked === true) {
                // Found the checked radio button
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

                    // Check Values of accidental-include
                    document.querySelectorAll('.radio-btn.accidental-combine').forEach(radio => {
                        if (radio.checked === true){
                            accidentals = radio.value
                        }
                    })
                }
            }
        })



        document.querySelectorAll('.radio-btn.level').forEach(radio => {
            if (radio.checked === true) {
                play.href = play.dataset.playurl + '?level=' + radio.value + '&flats=' + flats + '&sharps=' + sharps + '&accidentals=' + accidentals
            }
        })
    })

    // Add the values only/included for flats/sharps
    // add logic in piano.js to load accidentalList
    // add check boxes to home.html for flats only/included
    // add names (flat/sharp) to black keys to check if the key pressed is correct