# ASRT_JSPsych
A simple <strong>Alternating Serial Reaction Time (ASRT)</strong> task.

It choses randomly an 8-element sequence, and assigns a random subject ID.

The script begins with instructions, and within that, the participants are allowed to navigate.

It begins with three blocks of practice with random trials (85 stimuli in each block). After that, 20 blocks of ASRT follows. Each block contains 5 random stimuli at the beginning, and 10 repetitions of a randomly chosen 8-element-long sequence.

The trials are images of dogs. The <strong>'s', 'f', 'j' and 'l'</strong> buttons are set as response buttons.

If correct response is given, the next element is presented after a 120 ms interstimulus interval. If the response is wrong (but active response button was pressed), the same target stimulus appears on the screen again with an interstimulus interval of 0 ms (i.e., remains on the screen).

Average performance (mean accuracy and mean RT) is given as feedback after the end of the block with a personalized instruction:

- if the mean accuracy of the block is less than 90%, it instructs to be more accurate.
- if the mean rt of the block is more than 200 ms and the accuracy is higher than or equals to 93%, it instructs to be faster.
- in other cases, it instructs to continue the task.

The breaks between the blocks are <strong>self-paced</strong>. The user can continue the task when he or she presses a button.

After the end of the task, output data are downloaded to the local machine (CSV format).

<strong>Output variables</strong>:
- success: whether fullscreen mode was successfully started/ended (true or false)
- trial_type: JSPSych trialtype of the given trial (fullscreen, instructions, html-keyboard-response or serial-reaction-time)
- trial_index: the number of the given trials (all events considered, even instructions, feedbacks!)
- time_elapsed: the time elapsed from the start of the script in ms
- internal_code_id: internal node id of the trial
- subject: randomly generated 15-character-long subject ID
- browserEvent: browser events at the given trial (fullscreenenter, fullscreenexit, blur or focus)
- view_history: only relavant at the instructions; the actions and the corresponding RTs during the reading of the instructions
- rt: reaction time (RT) in ms - in the case of first responses to the trial, it shows the rt calculated from the appearance of the stimulus; in the case of not first responses, it shows the rt calculated from the last button press
- stimulus: stimulus on the screen; relevant only if instructions/feedback are present
- key_press: number code of the key pressed
- correct: whether the response was correct (true or false)
- grid: layout of the positions (in a grid)
- target: position of target stimulus (the 4 positions: 1: 0,0; 2: 0,1; 3: 0,2; 4: 0,3)
- trialType: random or pattern stimulus (R or P)
- block: number of the block (1-20)
- firstResponse: if the answer is the first answer to the given trial (yes: 1; no: 0)
- trialNumber: number of the trial within the block (1-85)
- sequence: the sequence used during the task (assigned randomly at the beginning)
- isPractice: whether it was a practice trial (yes: 1; 0: no)
- correctPos: the position of the target stimulus (1-4)
- correctRespButton: the response that should be pressed to respond correctly ('s', 'f', 'j' or 'l')
- respButton: the pressed response key ('s', 'f', 'j' or 'l')
- cumulativeRT: the RT from the beginning of the first appeareance of the trial in ms
- actualTriplet: the triplet to what response was given (three digits indicating the positions of the target stimulus in the last three trials)
- tripletType: the type of the triplet (high-probability triplet: H; low-probability triplet: L, first trials: X, trill: T, repetition: T) 
