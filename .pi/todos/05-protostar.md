# Proto* — Content TODOs

> How to use: Dump bullet points, half-sentences, rough thoughts under each TODO. Don't worry about grammar, flow, or repetition. I'll turn it into proper prose afterwards.

---

## TODO 1: The team's research culture

Was user research normal for the MAAS team or were you introducing something new? How did you make the case for it? What were the specific feature implementation options being tested?

```
- Yes i think they were relatively used to their designers doing user research. But of course you still have to think abt how to present something like this to the team. making the case for it was not that hard. Since we had different ideas of how the new feature could be implemented and the whole team was not sure what the best approach would be. what the users would preffer the most. So doing user research for this was a quite straight forward thing to do. There was a geuine risk in implementation. If we implemented it in a way users would not like we would have commited to something that would have taken a lot of work to change to a different approach. the user research did not take that much ressources. Our main user base were internal so it wasnt that hard to find participants and it could be arranged ina pretty quick way. so there was a genuine risk of doing the wrong thing and the ressources needed to do the reearch were relatively low. so it just made sense.
- I dont think it makes sense to go deeper into the specific features being tested. as they are very technical. But it was just different ways to do a plugin system in the tool essentially
```

---

## TODO 2: Understanding sysadmins

Beyond "skeptical about installing packages" — what else shaped how you planned the research? How did you recruit participants, were they internal/external, how many?

```
recruits were all internal because the tool to a large extend covered a need we had internally. it was like 5 participants. it was all qualitative interviews. because we needed to find out which of the options the users preffered and especially why. so we could model our solution towards that. 
```

---

## TODO 3: Design decisions in the prototype tool

What fidelity level? Could users explore freely or only scripted paths? How did you handle wrong commands? How were the different implementation options structured for testing?

```
in terms of fidelity the prototype i guess is both low and high fidelity. cli interfaces by their nature are quite low fidelity right. its just text in a terminal so thats kinda low fidelity. but that to some extend makes making "high fidelity" prototypes quite easy. the protoype looked and behaved like a real cli. it did the same stuff. so it was kinda high fidelity too.
in terms of scripted paths and wrong commands. they were free to try to use other commands (such as ls etc what you would find normally in a linux terminal) but they would not work in the protoype. I think this behaviour is a good thing. it would not let users stray away from the intended path that we are testing. ( i think some curious engineers would otherwise start to explore the environment the terminal is in etc.). But its still informative in what they would try to do right. commands that are not available would just give typical terminal returns in that the command is not available. or for the prototype for example say that a certain command chain is not recognized and then return the clis help menu etc. just like a real terminal/cli would.

the different implementation options were all available in the same prototype. and i just told the users the appropriate start command / or chain of commansd.
```

---

## TODO 4: What happened during testing sessions — MOST IMPORTANT

How many sessions? The 2-3 key findings beyond documentation (think: workflows where users got stuck, mental model mismatches, security concerns, novice vs expert differences). A memorable moment. How did participants react to the browser-based CLI prototype?

```
just one session per participant so like 5. well documentation was the biggest finding. from the different implementation options that we were testing one was a clear favourite. but again i think going deeper into the technicalities of that is not helpful in this text. and of course the one that was a clear fav was because of a stronger match with the mental model the users had with what they thought in how the system would work. so it was "intuitiv".

Especially one participant thought the prototyping tool was very interesting. And they also thought of other use cases than user testing for it. for example something like customer showcases. or having something like this on a documentaiton website etc.

Generally all of them liked to use the prototype in this way. so it was proof that the assumption that a prototyp elike this would work well in the brwoser was right. No friction in installation, different system requirements, suspicion of installing a random package etc.
```

---

## TODO 5: The stakeholder presentation

How did you structure it? Why the heuristics matrix format? Who was in the room and what was their reaction? Did anyone push back? Were recommendations rejected or deprioritized?

```
it was done both as a presentation generally to the team. just so the whole team would have an overview of the findings and a general understanding of what i did. and then for the specific coworker i worked on this project with . the engineer. i did a heuristics matrix. Because I find that a heuristic matrix like this is generally easier to understand for someone not that familiar with ux design. it gives a clear framework of what certain findings affect what part of the ux of a tool. i think this being easier to understand makes acceptance of the findings a bit easier. because everyone wants a e.g. more learnable, easier to recover from errors, etc. tool and this matrix makes a clear connection between research findings and this thing.

for the general presentation the whole product team was in the room. for the heurisitc matrix one the more detailed one just the stakeholder that was resposinble for implementation. there wasnt really any pushback on the changes suggested. based on my fidnigs and the herusitics matrix i suggested a priority of changes. and we implemented the suggested changes. and we did not do some smaller stuff that i prioritized as not that important. (so we stayed inside the implementation ressources we actually had at hand)
```

---

## TODO 6: What actually changed

Which issues were prioritized vs deferred? Did any recommendations ship before/with the beta? One concrete change that happened because of the research.

```
again i dont think it makes a lot of sense to go super deep into the technicalities of the solutions. the biggest concrete change was considerably improving the documentation and help messages etc. as that was the biggest issues user had in our testing. that they did not find it complete enough to be confident in operating the tool.
```

---

## TODO 7: From hack to open-source tool

What changed between the Friday hack and the public release? Feedback from other Canonical designers that shaped it? GitHub signals? What happened at FOSDEM?

```
the friday hack was essentially a "hard coded" tool right. the prototyping tool i did afterwards was made more of the intention of making it easier to use as  aprototpying tool. so there was a need to have an easier way of "constructing" the cli thats supposed to be protoyped. so the approach was to have a structured json file where you can describe the cli in a declrative way. this was essentially the data format of the protoype. for now people have to write this by hand (or with an agent). in the future a gui for this could also be made so it can be constructed in a more visual way. the feedback from other designers did shape it yes. verifying wether this was a format that more technical deisgners could work with etc. regarding: GitHub signals? What happened at FOSDEM? i think nothing worth mentioning happened here
```
