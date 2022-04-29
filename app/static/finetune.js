var CURRENT_NOTE = null;
var SCORE = 0;
var TIMER = null;
var TIMER_INTERVAL = 5000; //countdown in seconds (*1000)
var PAUSED = true;
var START = true;
var NOTES = []
var high_score = document.getElementById('score').dataset.high
var baseURL = document.getElementById('btn-exit').dataset.baseurl

// Initialize the timer and score counters
document.getElementById('score').innerHTML = SCORE
document.getElementById('counter').innerHTML = '0'


// Creating a variable NOTES that will determine random note selection
// from WHITE keys only. Can use this to create difficulty levels
document.querySelectorAll('.white').forEach(key => {
        NOTES.push(key.dataset.note)
})

/* Creating eventListners for keys to play the notes */
const keys = document.querySelectorAll('.key')
// The inside code will execute when piano key is pressed
keys.forEach(key => {
    // Adds a click event to each key on the piano
    key.addEventListener('click', () => {
        if (!PAUSED){
            // playNote(key)
            /// CHECKS THE RESULT OF THE USER clicking a piano key
            //user pressed the CORRECT key
            if (key.dataset.note === CURRENT_NOTE) {
                score(1)
                // second parameter is the class name for the score counter
                playNote(key, 'changedUP', 'correct')
                nextNote()
            //user pressed the WRONG key
            } else {
                score(-1)
                playNote(key, 'changedDown', 'wrong')
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
    exitBtn.href = baseURL + 'exit/' + SCORE
})

renderNote();


//------------  FUNCTIONS START ------------------

// will create a random next note and render it
function nextNote(){
    let randomNoteIndex = Math.floor(Math.random() * NOTES.length);
    CURRENT_NOTE = NOTES[randomNoteIndex]
    renderNote(CURRENT_NOTE);
    clearTimer()
    startTimer()
}

// will execute on piano key click and play the note's sound
// parameters are key - key pressed; scorechangeClass - name of class to be added to the score counter that will define the color changed
function playNote(key, scoreChangeClass, correctORWrong){
    const noteAudio = document.getElementById(key.dataset.note)
    const scoreCounter = document.getElementById('score')
    noteAudio.currentTime = 0
    noteAudio.play()

    // addes a class to elements that will change color: Piano Key, Score Counter, Note on the Piano Key
    key.classList.add('active')
    scoreCounter.classList.add(scoreChangeClass)
    document.getElementById("label" + key.dataset.note).classList.add(correctORWrong);
    // Check for high score
    if ((high_score != 'None') && (SCORE > high_score)) {
        document.getElementById('score').innerHTML = 'New High Score'

    }

    //Removes the classes that will triger the colors to go back to the original
    noteAudio.addEventListener('ended', () => {
        key.classList.remove('active')
        scoreCounter.classList.remove(scoreChangeClass)
        document.getElementById("label" + key.dataset.note).classList.remove(correctORWrong);
        // removes the HIGH score
        document.getElementById('score').innerText = SCORE
    })
}

// -------------------------------------------
// Draw notes
function renderNote(note){

    //Constants defining the width of the canvas and the size of the staves. Defined in css
    const width = document.getElementById('vexflow-space').offsetWidth
    const height = document.getElementById('vexflow-space').offsetHeight

    // Create the possible note/stave/octave map
    randomMap = {
        treble: [4,5],
        bass: [2,3]
    }
    let clefIndex = Math.floor(Math.random() * Object.keys(randomMap).length);
    let clefName = Object.keys(randomMap)[clefIndex];
    let octaveIndex = Math.floor(Math.random() * randomMap[clefName].length);
    let octave = randomMap[clefName][octaveIndex]

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
    // Create a stave of width 'width-160' at position x10, y15 on the SVG.
    var staveTreble = new VF.Stave(10, 15, width-160);
    // Add a clef and time signature.
    staveTreble.addClef("treble"); //.addTimeSignature("4/4");
    // Set the context of the stave our previous exposed context and execute the method draw !
    staveTreble.setContext(context).draw();

    // BOTTOM
    // Create a stave with bass clef width 'width-160'  at position x10, y105 on the canvas.
    var staveBass = new VF.Stave(10, 105, width-160);
    staveBass.addClef("bass"); //.addTimeSignature("4/4");
    staveBass.setContext(context).draw();

    if (START !== true) { //Dont render the note on the first load
        //num_beats will determine how many note we MUST add to addTickables
        var voice = new VF.Voice({num_beats: 4,  beat_value: 4});

        // Create notes.  Lef and Right are Ghost notes (not visible), Middle is the note we need
        voice.addTickables([
            new VF.GhostNote({duration: "q"}),
            new VF.GhostNote({duration: "q"}),
            new VF.StaveNote({clef: clefName, keys: [note + "/" + octave], duration: "q" }),
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
    scoreCounter = document.getElementById('score') //.innerHTML = SCORE
    scoreCounter.innerHTML = SCORE
}

