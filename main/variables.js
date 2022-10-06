/*************** BASIC VARIABLES ***************/

function variableCreation(subject, session) {

    let subject_id;
    let session_number;
    let usedSequence;

    //define subject number

    if (isOffline == false) {
        subject_id = jsPsych.randomization.randomID(15);
    }
    else {
        subject_id = subject;
    
    }

    //define session number

    if (isOffline == false) {
        session_number = 1;
    }
    else {
        session_number = session;  
    }

    //define sequence

    if (isOffline == false) {
        usedSequence = jsPsych.randomization.shuffle([0,1,2,3])
    }
    else {
        const sequences =   [[0,1,2,3], [0,1,3,2], [0,2,1,3], [0,2,3,1], [0,3,1,2], [0,3,2,1],
        [1,0,2,3], [1,0,3,2], [1,2,0,3], [1,2,3,0], [1,3,0,2], [1,3,2,0],
        [2,0,1,3], [2,0,3,1], [2,1,0,3], [2,1,3,0], [2,3,0,1], [2,3,1,0],
        [3,0,1,2], [3,0,2,1], [3,1,0,2], [3,1,2,0], [3,2,0,1], [3,2,1,0]]
        usedSequence = sequences[(parseInt(subject_id)-1)%24]
    }

    const usedSequenceString = usedSequence.map(v=> v+1).join().replace(/,/g, "");

    if (isFirstFiveRandom == true) {
        firstValidTrial = 7;
        numberOfBlockElements = 85;
    }
    else {
        firstValidTrial = 2;
        numberOfBlockElements = 80;
    }

    return variables = {
        subject_id: subject_id,
        session_number: session_number,
        usedSequence: usedSequence,
        usedSequenceString: usedSequenceString, 
        firstValidTrial: firstValidTrial,  
        numberOfBlockElements: numberOfBlockElements
    }
    
}

