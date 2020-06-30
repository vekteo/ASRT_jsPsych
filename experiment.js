/*VARIABLES*/

let timeline = []; //create timeline
const welcome = { //create welcome message trial
    type: "html-keyboard-response",
    stimulus: "<h1>Welcome to the experiment!</h1>" +
        "</p> Press any key to begin.</p>" +
        "<div class='float: center;'><img src='static/images/memo_logo.jpg' height='100' width='120'/></div>"
};
const instructions1 = { //define instruction trial 1
    type: "html-keyboard-response",
    stimulus: "<p>In this experiment, you will see four circles on the screen.</p>" +
        "<p>An <b>image of a cat</b> will appear in one of the circles.</p>" +
        "<p>Your task will be to press the button corresponding to the position of the cat.</p>" +
        "<p>Press any key to continue!</p>"
};
const instructions2 = { //define instruction trial 2
    type: "html-keyboard-response",
    stimulus: "<p class = 'buttons'>If the cat is in the first position, press the <strong>'S'</strong> button!</p>" +
        "<p>If the cat is in the second position, press the <strong>'D'</strong> button!</p>" +
        "<p>If the cat is in the third position, press the <strong>'J'</strong> button!</p>" +
        "<p>If the cat is in the fourth position, press the <strong>'K'</strong> button!</p>" +
        "<p class = 'alert'><strong>Try to be as fast and as accurate as possible!</strong></p>" +
        "<p>If you are ready, press ANY key to start a practice!</p>"
};

const instructions3 = { //define instruction trial 3
    type: "html-keyboard-response",
    stimulus: "<p>The real task begins now.</p>" +
        "<p>If you are ready, press ANY key to start the task!</p>"
};

const end = { //define end of experiment message
    type: "html-keyboard-response",
    stimulus: "<p>End of the experiment.</p>" +
        "<p>Thank you for participating!</p>"
};

const subject_id = Math.floor(Math.random() * 100000) //generate a random subject number
const sequences = [[0, 1, 2, 3], [0, 2, 1, 3]]; //define possible sequences: 4 positions (0 for first etc.)
const usedSequence = sequences[Math.floor(Math.random() * sequences.length)]; //choose a random sequence from the list of sequences
const responseKeys = [['s', 'd', 'j', 'k']]; //response keys settings

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

const images = ['static/images/memo_logo.jpg']; //preload memo logo (stim images are preloaded automatically)

/*FUNCTIONS*/

/*function for incorrect pattern trial procedures*/

function IncorrectTrialProcs(timeline, timelineVariables){
    this.timeline = timeline,
        this.timeline_variables = timelineVariables,
        this.conditional_function = function(){ //function only happens is response is not correct!
            var data = jsPsych.data.get().last(1).values()[0];
            if(data.correct == true){
                return false;
            } else {
                return true;
            }
        }
}

/*function for random stimulus generation*/

function randomStimulusProcedureGenerator(){
    newRandom = Math.floor(Math.random() * 4); //choose a random position between 1-4
    let randomStimulus = [{ stimulus: [0,newRandom], data: {tripletType: "R", block: j, firstResponse: 1}}] //jspsych.init modifies if necessary
    let randomProc = {
        timeline: [random],
        timeline_variables: randomStimulus
    }
    return randomProc
};

/*function for inserting the same random element after incorrect response*/

function randomIfInsert(){
    let randomProcIf = {
        timeline: [randomIf],
        timeline_variables: actualRandom.timeline_variables,
        conditional_function: function(){ //function only happens is response is not correct!
            let data = jsPsych.data.get().last(1).values()[0];
            if(data.correct == true){
                return false;
            } else {
                return true;
            }
        }
    }
    return randomProcIf
}

/*function for inserting conditional after incorrect response*/

function insertConditionalAfterIncorrectResponse(element) {
    for (let i = 0; i < 100; i++) {
        timeline.push(element);
    }
}

/////////////////////////////////////////

/*TIMELINE*/

timeline.push(welcome);
timeline.push(instructions1);
timeline.push(instructions2);
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

let patternIfTrialProperties = {
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
    target_color: "url(static/images/cat2.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let randomIfTrialProperties = {
    type: "serial-reaction-time",
    grid: [[1, 1, 1, 1]],
    choices: responseKeys,
    target: jsPsych.timelineVariable('stimulus'),
    pre_target_duration: 0,
    target_color: "url(static/images/cat2.jpg)", //set image for random trials
    data: jsPsych.timelineVariable('data'),
    response_ends_trial: true,
};

let random = randomTrialProperties
let randomIf = randomIfTrialProperties

/*set up blocks*/

/* practice blocks*/

for (j=1; j < 3; j++){ //SET UP NUMBER OF PRACTICE BLOCKS HERE
    for(l=1; l < 5; l++){
        var actualRandom = randomStimulusProcedureGenerator();
        timeline.push(actualRandom);
        insertConditionalAfterIncorrectResponse(randomIfInsert());
    }
    timeline.push(feedback);
}
timeline.push(instructions3);

/* set up pattern protocols */

for (j=1; j < 3; j++){ //2 blocks: MODIFY HERE FOR CHANGE IN THE NUMBER OF BLOCKS
    let dataForPattern = {tripletType: "P", block: j, firstResponse: 1} //output parameters for pattern stimuli

    for(m=1; m < 5; m++){
        this["patternStimulus"+m] = [ { stimulus: [0,usedSequence[m-1]], data: dataForPattern}];
        this["patternStimulus"+m+"If"] = [ { stimulus: [0,usedSequence[m-1]], data: dataForPattern}];
    }

    let patternList = [pattern1, pattern2, pattern3, pattern4]
    let patternIfList = [pattern1If, pattern2If, pattern3If, pattern4If]
    let patternStimulusList = [patternStimulus1, patternStimulus2, patternStimulus3, patternStimulus4]
    let patternStimulusIfList = [patternStimulus1If, patternStimulus2If, patternStimulus3If, patternStimulus4If]

    for(kk=1; kk < 5; kk++){
        this["pattern"+kk+"Proc"] = new TrialProcs([patternList[kk-1]],patternStimulusList[kk-1])
        this["pattern"+kk+"ProcIf"] = new IncorrectTrialProcs([patternIfList[kk-1]],patternStimulusIfList[kk-1])
    }

    let patternProcList = [pattern1Proc,pattern2Proc, pattern3Proc, pattern4Proc]
    let patternIfProcList = [pattern1ProcIf,pattern2ProcIf,pattern3ProcIf,pattern4ProcIf]

    /* first five random stimuli at the beginning of the block*/

    for(l=1; l < 6; l++){
        var actualRandom = randomStimulusProcedureGenerator();
        timeline.push(actualRandom);
        insertConditionalAfterIncorrectResponse(randomIfInsert());
    }

    /*create all remaining block elements*/

    for(k=0; k < 2; k++){ //repeat 8-elements sequence 2 times //MODIFY HERE FOR CHANGE IN THE ELEMENTS IN BLOCKS
        for(n=0; n < 4; n++){ //repeat pattern + repeat random
            var actualRandom = randomStimulusProcedureGenerator();
            timeline.push(actualRandom);
            insertConditionalAfterIncorrectResponse(randomIfInsert());
            timeline.push(patternProcList[n]);
            insertConditionalAfterIncorrectResponse(patternIfProcList[n])
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
    on_data_update: function(){  //if the same trial is presented for the second time (previous response is incorrect) - write 0 in firstResponse
        lastTrialMinus1 = jsPsych.data.get().last(2).values()[0]
        lastTrial = jsPsych.data.get().last(1).values()[0]
        if(typeof(lastTrial.target) != "undefined"){
            if(lastTrialMinus1.correct == false){
                if(lastTrial.target == lastTrialMinus1.target){
                    lastTrial.firstResponse = 0
                }
            }

        }
    },
    on_finish: function() {
        jsPsych.data.displayData(); //display data at the end
        var interactionData = jsPsych.data.getInteractionData();
        console.log(interactionData.json()); //prints out the interacton events
        console.log(jsPsych.data.get().csv()); //prints out experiment output
        jsPsych.data.get().localSave('csv','output.csv'); //saves experiment output to .csv file
    }
})
