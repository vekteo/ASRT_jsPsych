# ASRT_JSPsych
A simple, self-paced <strong>Alternating Serial Reaction Time (ASRT)</strong> task (<a href="https://link.springer.com/article/10.1007%2Fs00221-009-2024-x">Nemeth et al., 2010</a>) created with the JSPSych library (<a href="https://link.springer.com/article/10.3758/s13428-014-0458-y">de Leeuw, J. R., 2015</a>).

The program choses an ASRT sequence randomly, and assigns a random subject ID.

The program begins with instructions, and within that, the participants are allowed to navigate.

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

- <strong>success:</strong> whether fullscreen mode was successfully started/ended (true or false)
- <strong>trial_type:</strong> JSPSych trialtype of the given trial (fullscreen, instructions, html-keyboard-response or serial-reaction-time)
- <strong>trial_index:</strong> the number of the given trials (all events considered, even instructions, feedbacks!)
- <strong>time_elapsed:</strong> the time elapsed from the start of the script in ms
- <strong>internal_code_id:</strong> internal node id of the trial
- <strong>subject:</strong> randomly generated 15-character-long subject ID
- <strong>browserEvent:</strong> browser events at the given trial (fullscreenenter, fullscreenexit, blur or focus)
- <strong>view_history:</strong> only relavant at the instructions; the actions and the corresponding RTs during the reading of the instructions
- <strong>rt:</strong> reaction time (RT) in ms - in the case of first responses to the trial, it shows the rt calculated from the appearance of the stimulus; in the case of not first responses, it shows the rt calculated from the last button press
- <strong>stimulus:</strong> stimulus on the screen; relevant only if instructions/feedback are present
- <strong>key_press:</strong> number code of the key pressed
- <strong>correct:</strong> whether the response was correct (true or false)
- <strong>grid:</strong> layout of the positions (in a grid)
- <strong>target:</strong> position of target stimulus (the 4 positions: 1: 0,0; 2: 0,1; 3: 0,2; 4: 0,3)
- <strong>trialType:</strong> random or pattern stimulus (R or P)
- <strong>block:</strong> number of the block (1-20)
- <strong>firstResponse:</strong> if the answer is the first answer to the given trial (yes: 1; no: 0)
- <strong>trialNumber:</strong> number of the trial within the block (1-85)
- <strong>sequence:</strong> the sequence used during the task (assigned randomly at the beginning)
- <strong>isPractice:</strong> whether it was a practice trial (yes: 1; 0: no)
- <strong>correctPos:</strong> the position of the target stimulus (1-4)
- <strong>correctRespButton:</strong> the response that should be pressed to respond correctly ('s', 'f', 'j' or 'l')
- <strong>respButton:</strong> the pressed response key ('s', 'f', 'j' or 'l')
- <strong>cumulativeRT:</strong> the RT from the beginning of the first appeareance of the trial in ms
- <strong>actualTriplet:</strong> the triplet to what response was given (three digits indicating the positions of the target stimulus in the last three trials)

- <strong>tripletType:</strong> the type of the triplet (high-probability triplet: H; low-probability triplet: L, first trials: X, trill: T, repetition: T)

<strong>Browser requirements</strong>: Any browser except Safari and Internet Explorer.
