# ASRT_JSPsych
<p>A simple, self-paced <strong>Alternating Serial Reaction Time (ASRT)</strong> task.</p>

<p>The prorgam choses randomly an 8-element sequence alternating sequence, and assigns a random subject ID.</p>

<p>During the task, four circles are presented on the screen horizontally. From time to time, a target stimulus (a dog's head) appears in one of the four circles. The task of the user is to press the button corresponding to the target stimulus as fast and as accurately as he or she can.</p>

<p>The task begins with three blocks of practice with random trials (85 stimuli in each block). After that, 20 blocks of ASRT follows. Each block contains 5 random stimuli at the beginning, and 10 repetitions of a randomly chosen 8-element sequence.</p>

<p>The trials are images of dogs. The <strong>'s', 'f', 'j' and 'l'</strong> buttons are set as response buttons (corresponding to the four positions from left to right).</p<>>

<p>If correct response is given, the next element is presented after a 120 ms response-to-stimulus interval. If the response is wrong (but active response button was pressed), the same target stimulus appears on the screen again with an interstimulus interval of 0 ms (i.e., remains on the screen).</p>

<p>Average performance (mean accuracy and mean RT) is presented as a feedback after the end of the block with a personalized instruction:</p>

- if the mean accuracy of the block is less than 90%, it instructs to be more accurate.
- if the mean RT of the block is more than 200 ms and the accuracy is higher than or equals to 93%, it instructs to be faster.
- in other cases, it instructs to continue the task.

<p>The breaks between the blocks are <strong>self-paced</strong>. The user can continue the task when he or she presses a button.</p>

<p>After the end of the task, output data are downloaded to the local machine (CSV format). If the user quits before the end of the task, the data are also downloaded to the local machine.</p>

<h2>Output variables</h2>:
- <strong>success:</strong> whether fullscreen mode was successfully started/ended (true or false)
- <strong>trial_type:</strong> JSPSych trialtype of the given trial (fullscreen, instructions, html-keyboard-response or serial-reaction-time)
- <strong>trial_index:</strong> the number of the given trials (all events considered, even instructions, feedbacks!)
- <strong>time_elapsed:</strong> the time elapsed from the start of the script in ms
- <strong>internal_code_id:</strong> internal node id of the trial
- <strong>subject:</strong> randomly generated 15-character-long subject ID
- <strong>browser_event:</strong> browser events at the given trial (fullscreenenter, fullscreenexit, blur or focus)
- <strong>view_history:</strong> only relavant at the instructions; the actions and the corresponding RTs during the reading of the instructions
- <strong>rt:</strong> reaction time (RT) in ms - in the case of first responses to the trial, it shows the rt calculated from the appearance of the stimulus; in the case of not first responses, it shows the rt calculated from the last button press
- <strong>stimulus:</strong> stimulus on the screen; relevant only if instructions/feedback are present
- <strong>key_press:</strong> number code of the key pressed
- <strong>correct:</strong> whether the response was correct (true or false)
- <strong>grid:</strong> layout of the positions (in a grid)
- <strong>target:</strong> position of target stimulus (the 4 positions: 1: 0,0; 2: 0,1; 3: 0,2; 4: 0,3)
- <strong>r_or_p:</strong> random or pattern stimulus (R or P)
- <strong>block:</strong> number of the block (1-20)
- <strong>first_response:</strong> if the answer is the first answer to the given trial (yes: 1; no: 0)
- <strong>trial_number:</strong> number of the trial within the block (1-85)
- <strong>sequence:</strong> the sequence used during the task (assigned randomly at the beginning)
- <strong>is_practice:</strong> whether it was a practice trial (yes: 1; 0: no)
- <strong>correct_pos:</strong> the position of the target stimulus (1-4)
- <strong>correct_resp_button:</strong> the response that should be pressed to respond correctly ('s', 'f', 'j' or 'l')
- <strong>resp_button:</strong> the pressed response key ('s', 'f', 'j' or 'l')
- <strong>cumulative_RT:</strong> the RT from the beginning of the first appeareance of the trial in ms
- <strong>actual_triplet:</strong> the triplet to what response was given (three digits indicating the positions of the target stimulus in the last three trials)
- <strong>triplet_type:</strong> the type of the triplet (high-probability triplet: H; low-probability triplet: L, first trials: X, trill: T, repetition: T)

<h2>Setup options</h2>
In the <i>parameters.js</i> file, several parameters can be modified by the user:
- <strong>language:</strong> the language of the task. Available languages: english (en), hungarian (hu), french (fr), portuguese (pt)
- <strong>numberOfPracticeBlocks:</strong> the number of practice blocks at the beginning
- <strong>numberOfBlocks:</strong> the number of learning blocks (besides the practice blocks)
- <strong>numberOfBlockElements:</strong> the number of sequence elements in a block
- <strong>numberOfSequenceRepetitons:</strong>: the number of repetitons of the four-element sequence
- <strong>patternTrialImage:</strong> the image used for the pattern trials
- <strong>randomTrialImage:</strong> the image used for the random trials
- <strong>rsi:</strong> the response-to-stimulus interval after a button press (in ms)
- <strong>initialDelay:</strong> the delay before the first trial of a block

<h2>Browser requirements</h2>
<p>Any browser except Safari and Internet Explorer. Recommended: Chrome.</p>
