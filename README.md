# ASRT_JSPsych
 A simple Alternating Serial Reaction Time Task.
 
It choses 1 from 2 ASRT sequences, and assigns a random subject ID.

It contains two blocks of practice with random elements, and two blocks of trials with 2 repetition of a randomly chosen 8-element-long ASRT sequence.

The trials are images of cats; the pattern elements are white cats, and the random elements are black cats.

The 'S', 'D', 'J' and 'K' buttons are used as response buttons.

If correct response is given, the next element is presented; however, if the response is wrong (but active response button pressed) the trial occurs again.

Average performance (mean accuracy and mean RT) is given as feedback after the end of the block with a personalized instruction:

- if mean accuracy of the block is less than 92%, it instructs to be more accurate.
- if mean rt of the block is less than 500 ms, it instructs to be faster.
- if mean accuracy is higher than 92% and mean rt is less than 500 ms, it instructs to continue.

After the end of the task, output data are downloaded to the local machine (CSV format) and presented on the screen in JSON format.

Output variables:
- rt: reaction time in ms - in the case of first responses to the trial, it shows the rt calculated from the appearance of the stimulus; in the case of not first responses, it shows the rt calculated from the last button press
- stimulus: filled if instructions/feedback are present
- key_press: number code of the key pressed
- trial_type: JSPsych trial type
- trial_index: number of trial, instructions/feedback included
- time_elapsed: time elapsed from the beginning of the experiment
- internal_code_id: internal node id of the trial
- subject: randomly generated subject ID
- correct: "true" if answer was correct, "false" if not
- grid: layout of the positions
- target: position of target stimulus (the 4 positions: 0,0; 0,1; 0,2; 0,3)
- tripletType: random or pattern stimulus
- block: number of the block
- firstResponse: if the answer is the first answer to the given trial - 1; if not, 0
