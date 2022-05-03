
// -------------------------------------------
// Draw notes


    //Constants defining the width of the canvas and the size of the staves. Defined in css
    const width = document.getElementById('vexflow-space').offsetWidth
    const height = document.getElementById('vexflow-space').offsetHeight

    // Create the possible note/stave/octave map
    // randomMap = {
    //     treble: [4,5],
    //     bass: [2,3]
    // }
    // let clefIndex = Math.floor(Math.random() * Object.keys(randomMap).length);
    // let clefName = Object.keys(randomMap)[clefIndex];
    // let octaveIndex = Math.floor(Math.random() * randomMap[clefName].length);
    // let octave = randomMap[clefName][octaveIndex]

    // Clear notes
    // document.getElementById("vexflow-space").innerHTML = ''

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


        //num_beats will determine how many note we MUST add to addTickables
        var voiceTreble = new VF.Voice({num_beats: 13,  beat_value: 4});
        var voiceBass = new VF.Voice({num_beats: 13,  beat_value: 4});

        // Create notes on Treble clef
        voiceTreble.addTickables([
            new VF.StaveNote({clef: 'treble', keys: ['C/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['D/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['E/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['F/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['G/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['A/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['B/4'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['C/5'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['D/5'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['E/5'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['F/5'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['G/5'], duration: "q" }),
            new VF.StaveNote({clef: 'treble', keys: ['A/5'], duration: "q" })

        ]);

        // Create notes on Bass clef
        voiceBass.addTickables([
            new VF.StaveNote({clef: 'bass', keys: ['E/2'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['F/2'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['G/2'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['A/2'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['B/2'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['C/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['D/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['E/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['F/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['G/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['A/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['B/3'], duration: "q" }),
            new VF.StaveNote({clef: 'bass', keys: ['C/4'], duration: "q" })

        ]);

        // Format and justify the notes to 400 pixels.
        new VF.Formatter().joinVoices([voiceTreble]).format([voiceTreble], 400);
        new VF.Formatter().joinVoices([voiceBass]).format([voiceBass], 400);

        voiceTreble.draw(context, staveTreble);
        voiceBass.draw(context, staveBass);



