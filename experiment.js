/*VARIABLES*/

let timeline = []; //create timeline
const instruction = {
    type: "instructions",
    pages: [
        "<h1>Welcome to the experiment!</h1>" +
        "</p> Press any key to begin.</p>" +
        "<div class='float: center;'><img src='static/images/memo_logo.jpg' height='100' width='120' alt='Team Logo'/></div>",
        "<p>In this experiment, you will see four circles on the screen.</p>" +
        "<p>An <b>image of a cat</b> will appear in one of the circles.</p>" +
        "<p>Your task will be to press the button corresponding to the position of the cat.</p>",
        "<p class = 'buttons'>If the cat is in the first position, press the <strong>'S'</strong> button!</p>" +
        "<p>If the cat is in the second position, press the <strong>'D'</strong> button!</p>" +
        "<p>If the cat is in the third position, press the <strong>'J'</strong> button!</p>" +
        "<p>If the cat is in the fourth position, press the <strong>'K'</strong> button!</p>" +
        "<p class = 'alert'><strong>Try to be as fast and as accurate as possible!</strong></p>"
    ],
    show_clickable_nav: true
}

const startPracticeInstruction = { //define instruction at the staert of the practice
    type: "html-keyboard-response",
    stimulus: "<p>If you are ready, press ANY key to start the practice!</p>"
};

const startInstruction = { //define instruction at the staert of the experiment
    type: "html-keyboard-response",
    stimulus: "<p>The real task begins now.</p>" +
        "<p>If you are ready, press ANY key to start the task!</p>"
};

const end = { //define end of experiment message
    type: "html-keyboard-response",
    stimulus: "<p>End of the experiment.</p>" +
        "<p>Thank you for participating!</p>"
};

const subject_id = jsPsych.randomization.randomID(15); //generate a random subject ID
const usedSequence = jsPsych.randomization.shuffle([0,1,2,3]) //the 4 possible positions of the sequence (function shuffles them)
const responseKeys = [['s', 'd', 'j', 'k']]; //response keys settings
const usedSequencePos = usedSequence.map(v=> v+1) //the sequence positions from 1-4
const usedSequenceString = usedSequencePos.join().replace(/,/g, ""); //the sequence positions from 1-4 converted to string
let actualTriplet;

/* define feedback message - based on only the first button press for the given stimulus */

const feedback = {
    type: "html-keyboard-response",
    stimulus: function () {
        let trials = jsPsych.data.get();
        let blockNum = jsPsych.data.get().last(1).values()[0].block; //relies only on the performance in the last block
        let correct_trials = trials.filter({correct: true, block: blockNum, firstResponse: 1}); //only: correct response, last block, first button press for a given trial
        let numberOfTrials = trials.filter({block: blockNum, firstResponse: 1}).count(); //number of DIFFERENT trials
        let accuracy = Math.round(correct_trials.count() / numberOfTrials * 100); //mean accuracy in the given block
        let rt = Math.round(correct_trials.select('rt').mean()); //mean rt of the given block
        let message;
        if (accuracy < 92) { //if mean accuracy is less than 92, show this message
            message = "<p class='message'><strong>Try to be more accurate!</strong></p>"
        } else if (rt > 500) { //if mean rt is higher than 500, show this message
            message = "<p class='message'><strong>Try to be faster!</strong></p>"
        } else { //if mean accuracy is over 92% and mean rt is smaller than 500 ms, show this message
            message = "<p class='message'><strong>Please continue!</strong></p>"
        }
        return "<h2>End of block " + blockNum + "</h2>" +
            "<p>Your accuracy: " + accuracy + "%</p>" +
            "<p>Your average response time: " + rt + " ms</p>" + message +
            "<h3 class='continue'>Press any key to continue!</h3>";
    }
}

const images = ["static/images/memo_logo.jpg"]; //preload memo logo (stimuli images are preloaded automatically)

/*FUNCTIONS*/

/*function for incorrect pattern trial procedures*/

function IncorrectTrialProcs(timeline, timelineVariables) {
    this.timeline = timeline
    this.timeline_variables = timelineVariables
    this.conditional_function = function () { //function only happens is response is not correct!
        const data = jsPsych.data.get().last(1).values()[0];
        return data.correct !== true;
    }
}

/*function for random stimulus generation*/

function randomStimulusProc(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 0}}] //jsPsych.init modifies if necessary
    return {
        timeline: [random],
        timeline_variables: randomStimulus
    }
}

/*function for random stimulus generation in the practice session*/

function randomStimulusProcPractice(block, trialNumber) {
    let newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{stimulus: [0, newRandom], data: {trialType: "R", block: block, firstResponse: 1,  trialNumber: trialNumber, sequence: usedSequenceString, isPractice: 1}}] //jsPsych.init modifies if necessary
    return {
        timeline: [random],
        timeline_variables: randomStimulus
    }
}

/*function for inserting the same random element after incorrect response*/

function randomRepeat(actualRandom) {
    return {
        timeline: [randomIncorrect],
        timeline_variables: actualRandom.timeline_variables,
        conditional_function: function () { //function only happens is response is not correct!
            let data = jsPsych.data.get().last(1).values()[0];
            return data.correct !== true;
        }
    }
}

/*function for inserting conditional after incorrect response*/

function insertRepetition(element) {
    for (let i = 0; i < 100; i++) {
        timeline.push(element);
    }
}

/////////////////////////////////////////

/*TIMELINE*/

timeline.push({type: "fullscreen", fullscreen_mode: true});
timeline.push(instruction);
timeline.push(startPracticeInstruction)
jsPsych.data.addProperties({subject: subject_id}); //add subject ID to the data

/*set properties of pattern trials*/

let patternTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 120, //RSI in ms
    target_color: "url(static/images/cat.jpg)", //set image for pattern trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
}

let patternIncorrectTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 0, //RSI set to 0 after incorrect response
    target_color: "url(static/images/cat.jpg)", //set image for pattern trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true, //the default target_color, i.e. the "target stimulus" is set in the source code
}

/*set properties of random trials*/

let randomTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 120,
    target_color: "url(static/images/cat.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let randomIncorrectTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 0,
    target_color: "url(static/images/cat.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let random = randomTrialProperties
let randomIncorrect = randomIncorrectTrialProperties

/*set up blocks*/

let actualRandom;

/* practice blocks*/

for (let j = 1; j < 3; j++) { //SET UP NUMBER OF PRACTICE BLOCKS HERE
    for (let l = 1; l < 5; l++) {
        actualRandom = randomStimulusProcPractice(j,l);
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }
    timeline.push(feedback);
}
timeline.push(instructions3);

/* set up pattern protocols */

for (let j = 1; j < 3; j++) { //2 blocks: MODIFY HERE FOR CHANGE IN THE NUMBER OF BLOCKS

    /* first five random stimuli at the beginning of the block*/
    for (let l = 1; l < 6; l++) {
        actualRandom = randomStimulusProc(j,l)
        timeline.push(actualRandom);
        insertRepetition(randomRepeat(actualRandom));
    }

    /*create all remaining block elements*/
    for (let k = 0; k < 2; k++) { //repeat 8-elements sequence 2 times //MODIFY HERE FOR CHANGE IN THE ELEMENTS IN BLOCKS
        for (let n = 0; n < 4; n++) { //repeat pattern + repeat random
            let dataForPattern = {trialType: "P", block: j, firstResponse: 1, trialNumber: n+n+7+(k*8), sequence: usedSequenceString, isPractice: 0} //output parameters for pattern stimuli
            actualRandom = randomStimulusProc(j,n+n+6+(k*8),0)
            timeline.push(actualRandom);
            insertRepetition(randomRepeat(actualRandom));
            let patternTrialProc = {
                timeline: [patternTrialProperties],
                timeline_variables: [{stimulus: [0, usedSequence[n]], data: dataForPattern}]
            }
            timeline.push(patternTrialProc)
            ;
            let patternIncorrectTrialProc = new IncorrectTrialProcs([patternIncorrectTrialProperties], [{
                stimulus: [0, usedSequence[n]],
                data: dataForPattern
            }]);
            insertRepetition(patternIncorrectTrialProc)
        }
    }

    /*show feedback after the end of the block*/

    timeline.push(feedback);
}

timeline.push(end)

/*start the experiment*/

jsPsych.init({
    timeline: timeline,
    preload_images: images,
    on_data_update: function () {  

        /*output properties*/

        let lastTrialMinus1 = jsPsych.data.get().last(2).values()[0] //if the same trial is presented for the second time (previous response is incorrect) - write 0 in firstResponse
        let lastTrial = jsPsych.data.get().last(1).values()[0]
        if (typeof (lastTrial.target) != "undefined") {
            if (lastTrialMinus1.correct === false) {
                if (lastTrial.target === lastTrialMinus1.target) {
                    lastTrial.firstResponse = 0
                }
            }
        lastTrial.correctPos = parseInt(lastTrial.target[3])+1 //write the correct position in a separate column (1-4, from left to right)
        lastTrial.correctRespButton = responseKeys[0][parseInt(lastTrial.target[3])] //write the name of the correct response button in a separate column
        lastTrial.respButton = String.fromCharCode(lastTrial.key_press).toLowerCase() //write the name of the response button in a separate column
        if (lastTrial.trialNumber == lastTrialMinus1.trialNumber){ //write cumulative RT in a separate column (the RT from stimulus appeared to CORRECT response)
            lastTrial.cumulativeRT = lastTrial.rt + lastTrialMinus1.cumulativeRT
        }
        else {
            lastTrial.cumulativeRT = lastTrial.rt
        }

    /*calculate triplet types*/

        var areTrialsCorrect = jsPsych.data.get().select('correct').values;
        let lengthOfTrials = areTrialsCorrect.length
        let isCurrentCorrect = lastTrial.correct

        var secondTripletElementIndex = //find last correct response and take its index
            isCurrentCorrect ? areTrialsCorrect.lastIndexOf(true, areTrialsCorrect.lastIndexOf(true)-1) :
            areTrialsCorrect.lastIndexOf(true)

        var thirdTripletElementIndex = areTrialsCorrect.lastIndexOf(true,secondTripletElementIndex-1) //find second last correct response and take its index

        /* define the elements of the triplet*/

        if(lastTrial.trialNumber == 1) {
            actualTriplet = ["","",lastTrial.correctPos]
        }
        else if (lastTrial.trialNumber == 2) {
            actualTriplet = ["",jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correctPos, lastTrial.correctPos]
        }
        else {
            actualTriplet = [jsPsych.data.get().last(lengthOfTrials-thirdTripletElementIndex).values()[0].correctPos,jsPsych.data.get().last(lengthOfTrials-secondTripletElementIndex).values()[0].correctPos, lastTrial.correctPos];
        }

        lastTrial.actualTriplet = actualTriplet.join().replace(/,/g, ""); //write the actual triplet to a separate column as a string

        /*define actual triplet as x, high, low, repetition or trill*/

        if (lastTrial.isPractice == 1 || lastTrial.trialNumber <= 7) { //if practice block or first 7 element
            lastTrial.tripletType = "X" //trials to exclude
        }
        else if ((usedSequenceString.includes(lastTrial.actualTriplet[0] + lastTrial.actualTriplet[2])) || (usedSequenceString[3] + usedSequenceString[0] === lastTrial.actualTriplet[0] + lastTrial.actualTriplet[2])){ //if the 1st and the 3rd element of the triplet is part of the usedSequenceString
            lastTrial.tripletType = "H" //high-probability triplet
        }
        else if (actualTriplet[0] == actualTriplet[1] && actualTriplet[1] == actualTriplet[2]) { //if all 3 elements are identical
            lastTrial.tripletType = "R" //repetition
        }
        else if (actualTriplet[0] == actualTriplet[2] && actualTriplet[0] != actualTriplet[1]) { //if 1st and 3rd elements are identical
            lastTrial.tripletType = "T" //trill
        }
        else {
            lastTrial.tripletType = "L" //low-probability triplet
        }
    }
    }
    ,
    on_finish: function () {
        jsPsych.data.displayData(); //display data at the end
        const interactionData = jsPsych.data.getInteractionData();
        console.log(interactionData.json()); //prints out the interaction events
        console.log(jsPsych.data.get().csv()); //prints out experiment output
        jsPsych.data.get().localSave("csv", "output.csv"); //saves experiment output to .csv file
    }
})