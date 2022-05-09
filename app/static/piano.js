var CURRENT_NOTE = {
    'name': null,
    'accidental': '',
    'clef': null,
    'octave': null
};
var SCORE = 0;
var TIMER = null;
var TIMER_INTERVAL = 10000; //countdown in seconds (*1000)
var PAUSED = true;
var START = true;
var NOTES = []
var high_score = document.getElementById('score').dataset.high
var level = document.getElementById('vexflow-space').dataset.level
var sharps = document.getElementById('vexflow-space').dataset.sharps.toLowerCase()
var flats = document.getElementById('vexflow-space').dataset.flats.toLowerCase()
var accidentalsInclude = document.getElementById('vexflow-space').dataset.accidentals.toLowerCase()
var randomMap = {}

// Create the possible note/stave/octave map based on the level
if (level === 'basic'){
    randomMap = {
        treble: [4]
    }
} else if (level === 'treble'){
    var randomMap = {
        treble: [4,5]
    }
} else if (level === 'bass'){
    var randomMap = {
        bass: [2,3]
    }
} else {
    var randomMap = {
        treble: [4,5],
        bass: [2,3]
    }
}

// Initializing variable NOTES that will determine random note selection
// from WHITE keys only. Can use this to create difficulty levels
document.querySelectorAll('.white').forEach(key => {
        NOTES.push({
            'name': key.dataset.note,
            'sharp': key.dataset.sharp.toLowerCase(),
            'flat': key.dataset.flat.toLowerCase()})
})

// Label the black keys with spaces between the sharps and flats
document.querySelectorAll('.noteLabel').forEach(label => {
    names = label.innerHTML.split('_')
    if (names.length > 1) {
        label.innerHTML = names[0] + ' ' + names[1]
    }

})

/* Creating eventListners for keys to play the notes */
const keys = document.querySelectorAll('.key')
// The inside code will execute when piano key is pressed
keys.forEach(key => {
    // Adds a click event to each key on the piano
    key.addEventListener('click', () => {
        if (!PAUSED){
            /// CHECKS THE RESULT OF THE USER clicking a piano key
            altNameList = key.dataset.alt.split('_')
            //user pressed the CORRECT key
            if (altNameList.includes(CURRENT_NOTE.name + CURRENT_NOTE.accidental)) {
                score(1)
                // second parameter is the class name for changing colors of piano, score counter
                playNote(key, 'correct')
                nextNote()
            //user pressed the WRONG key
            } else {
                score(-1)
                playNote(key, 'wrong')
            }
        }
    })
})

//Register the pause button
pauseBtn = document.getElementById('btn-pause')
pauseBtn.addEventListener('click', () => {
    // initial start
    if (PAUSED === true && START === true){
        // Renders the first note
        PAUSED = false
        START = false;
        pauseBtn.innerHTML = 'Pause'
        nextNote()
    } else {
        if (PAUSED === false){
            //pause it
            PAUSED = true
            pauseBtn.innerHTML = 'Unpause'
        } else {
            //unpause it
            PAUSED = false
            pauseBtn.innerHTML = 'Pause'
        }
    }
})

//Register the Exit button
exitBtn = document.getElementById('btn-exit')
exitBtn.addEventListener('click', () => {
    exitURL = document.getElementById('btn-exit').dataset.exiturl
    exitBtn.href = exitURL + SCORE
})

// render the first screen without notes (Start- true, paused - true)
renderNote();

// scroll to the bottom of the page when page loads
// window.onload = function () {
//     setTimeout(function() {window.scrollTo(0, document.body.scrollHeight);}, 500);

// };


//------------  FUNCTIONS START ------------------

// will create a random next note and render it
function nextNote(){

    accidentalList = [];

    // cycle until a note is selected
    while (true){

         // get random note name
        let randomNoteIndex = Math.floor(Math.random() * NOTES.length);
        CURRENT_NOTE.name = NOTES[randomNoteIndex].name

        if (accidentalsInclude !== 'only'){
            accidentalList.push('');
        }
        // see if sharps is turned on and note has sharps
        if ((sharps === 'true') && (NOTES[randomNoteIndex].sharp == 'true')) {
            accidentalList.push('#');
        }
        // see if flat is turned on and note has flats
        if ((flats === 'true') && (NOTES[randomNoteIndex].flat == 'true')) {
            accidentalList.push('b');
        }
        if (accidentalList.length > 0){
            break;
        }
    }

    // Gets random accidental from possible accidentals
    let randomAccIndex = Math.floor(Math.random() * accidentalList.length);
    CURRENT_NOTE.accidental = accidentalList[randomAccIndex];

    // Get random clef from the possible global randomMap variable
    let clefIndex = Math.floor(Math.random() * Object.keys(randomMap).length);
    CURRENT_NOTE.clef = Object.keys(randomMap)[clefIndex];

    // Get random octave based on clef from the possible global randomMap variable
    let octaveIndex = Math.floor(Math.random() * randomMap[CURRENT_NOTE.clef].length);
    CURRENT_NOTE.octave = randomMap[CURRENT_NOTE.clef][octaveIndex]

    //will render the note on the screen
    renderNote(CURRENT_NOTE.name, CURRENT_NOTE.clef, CURRENT_NOTE.octave, CURRENT_NOTE.accidental);
    clearTimer()
    startTimer()
}

// will execute on piano key click and play the note's sound
// parameters are key - key pressed; scorechangeClass - name of class to be added to the score counter that will define the color changed
function playNote(key, correctORWrong){
    noteAudio = document.getElementById(key.dataset.note)
    // sets the source of the note based on the octave currently rendered note is in
    noteAudio.src = noteAudio.dataset.urlaudiobase + CURRENT_NOTE.octave + '/' + key.dataset.note + CURRENT_NOTE.octave + '.mp3'
    // noteAudio.src = noteAudio.dataset.urlaudiobase + '3/' + key.dataset.note + '3.mp3'
    noteAudio.currentTime = 0
    noteAudio.play()

    // addes a class to elements that will change color: Piano Key, Score Counter, Note on the Piano Key
    // Changes the color of the piano key
    key.classList.add(correctORWrong)
    // changes the color of the coutner
    scoreCounter = document.getElementById('score')
    scoreCounter.classList.add(correctORWrong)
    // makes the note name appear on the piano key
    document.getElementById("label" + key.dataset.note).classList.add(correctORWrong);

    // Check for high score
    // if ((high_score != 'None') && (SCORE > high_score)) {
    //     document.getElementById('score').innerHTML = 'New High Score'

    // }

    //Removes the classes that will triger the colors to go back to the original
    noteAudio.addEventListener('ended', () => {
        key.classList.remove(correctORWrong)
        scoreCounter.classList.remove(correctORWrong)
        document.getElementById("label" + key.dataset.note).classList.remove(correctORWrong);
        // document.getElementById('score').innerText = SCORE // removes the HIGH score
    })
}

// -------------------------------------------
// Draw notes
function renderNote(note, clefName, octave, accidental){

    //Constants defining the width of the canvas and the size of the staves. Defined in css
    const width = document.getElementById('vexflow-space').offsetWidth
    const height = document.getElementById('vexflow-space').offsetHeight

    // Get random note from the possible global randomMap variable
    // let clefIndex = Math.floor(Math.random() * Object.keys(randomMap).length);
    // let clefName = Object.keys(randomMap)[clefIndex];
    // let octaveIndex = Math.floor(Math.random() * randomMap[clefName].length);
    // let octave = randomMap[clefName][octaveIndex]

    // Clear notes
    document.getElementById("vexflow-space").innerHTML = ''

    // Creating the Music sheet
    VF = Vex.Flow;

    // an object to store the information about the workspace
    var WorkspaceInformation = {
        // The div in which you're going to work
        div: document.getElementById("vexflow-space"),
        // Vex creates a svg with specific dimensions
        canvasWidth: width,
        canvasHeight: height
    };

    // Create a renderer with SVG
    var renderer = new VF.Renderer(
        WorkspaceInformation.div,
        VF.Renderer.Backends.SVG
    );

    // Use the renderer to give the dimensions to the SVG
    renderer.resize(WorkspaceInformation.canvasWidth, WorkspaceInformation.canvasHeight);

    // Expose the context of the renderer
    var context = renderer.getContext();

    // And give some style to our SVG
    context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");
    context.scale(1.3,1.3)

    /**
     * Creating 2 new staves
     */
    // TOP
    // Create a stave of width 'width-160' at position x10, y0 on the SVG.
    var staveTreble = new VF.Stave(10, 0, width-160);
    // Add a clef and time signature.
    staveTreble.addClef("treble"); //.addTimeSignature("4/4");
    // Set the context of the stave our previous exposed context and execute the method draw !
    staveTreble.setContext(context).draw();

    // BOTTOM
    // Create a stave with bass clef width 'width-160'  at position x10, y90 on the canvas.
    var staveBass = new VF.Stave(10, 90, width-160);
    staveBass.addClef("bass"); //.addTimeSignature("4/4");
    staveBass.setContext(context).draw();

    if (START !== true) { //Dont render the note on the first load
        //num_beats will determine how many note we MUST add to addTickables
        var voice = new VF.Voice({num_beats: 4,  beat_value: 4});

        // Create notes.  Lef and Right are Ghost notes (not visible), Middle is the note we need
        mainNote = null;
        if (accidental != '') {
            mainNote = new VF.StaveNote({clef: clefName, keys: [note + accidental + "/" + octave], duration: "q" }).addModifier(new Vex.Flow.Accidental(accidental));
        } else {
            mainNote = new VF.StaveNote({clef: clefName, keys: [note + "/" + octave], duration: "q" });
        }

        voice.addTickables([
            new VF.GhostNote({duration: "q"}),
            new VF.GhostNote({duration: "q"}),
            // new VF.StaveNote({clef: 'treble', keys: ["A#/5"], duration: "q" }).addModifier(new Vex.Flow.Accidental("#")),
            // new VF.StaveNote({clef: 'treble', keys: ["Ab/5"], duration: "q" }).addModifier(new Vex.Flow.Accidental("b")),
            // new VF.StaveNote({clef: clefName, keys: [note + "/" + octave], duration: "q" }),
            mainNote,
            new VF.GhostNote({duration: "q"})
        ]);

        // Format and justify the notes to 400 pixels.
        new VF.Formatter().joinVoices([voice]).format([voice], 400);

        // Render voice
        //select which VF.Stave object will get rendered depending on the clefName
        var stave;
        if (clefName === 'treble'){
            stave = staveTreble
        } else {
            stave = staveBass
        }
        // console.log("note: " +  note + ", octave: " + octave + ", stave: " + clefName)
        voice.draw(context, stave);
    }
}


//Starts the timer
function startTimer(){
    var start = null;
    var timeElapsed = null;
    var alreadyPaused = false;
    TIMER = setInterval(() => {
        if (start === null) {
            start = new Date().getTime();
        }
        var now = new Date().getTime();

        //Checking to see if the game is paused FIRST LOOP only
        if (PAUSED && !alreadyPaused){
            timeElapsed = (new Date().getTime()) - start
            alreadyPaused = true
        }

        //Checking if the game has been UNPAUSED
        if (!PAUSED && alreadyPaused){
            alreadyPaused = false
            start = (new Date().getTime()) - timeElapsed
        }

        //Regular 1 sec interval check if the game is not PAUSED
        if (!PAUSED){
            var secLeft = Math.floor(((TIMER_INTERVAL - (now - start)) % (1000 * 60))  / 1000);
            if (secLeft < 0) {
                // will play the expired note will need to add note name to the class of the key element
                // key = document.querySelectorAll('.white.' + CURRENT_NOTE)[0]
                // playNote(key, 'wrong')
                score(-1);
                nextNote();
            } else {
                document.getElementById('counter').innerHTML = secLeft
            }
        }
    }, 1000);
}

//clears the timer
function clearTimer(){
    if (TIMER !== null) {
        clearInterval(TIMER)
        TIMER = null
    }
}

//changes the score and updates the score element
function score(change){
    SCORE += change;
    scoreCounter = document.getElementById('score')
    scoreCounter.innerHTML = SCORE
}

