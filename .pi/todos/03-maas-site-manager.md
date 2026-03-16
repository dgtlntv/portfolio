# MAAS Site Manager — Content TODOs

> How to use: Dump bullet points, half-sentences, rough thoughts under each TODO. Don't worry about grammar, flow, or repetition. I'll turn it into proper prose afterwards.

---

## TODO 1: Your role and the full MVP scope

What was your role exactly (sole designer, one of several, embedded, reporting to whom)? What were the key features/workflows in the MVP beyond the map? Which ones did you design?

```
on sitemanager i was the sole designer. design is its own department. so not officially part of the site manager team. but i would say i was still quite close with both the front and backend engineering team. Key features were: enrolling new maas sites into site manager. the whole process of creating enrollment tokens in site manager. using them in maas. accepting incoming enrolment requests in site manager etc. image management for enroled maas sites. one of the biggest asks from users was to have a way to manage same os images for multiple maas sites at a time. if site manager is conncected to a maas site it acts as its image server. so all the image management i designed. stuff like user profiles, settings etc for the app i designed. complementary to the map view there is a table view which i designed as well. to have a more tabular view of connected sites. 
```

---

## TODO 2: The users — what makes sysadmins different

What do they value, what don't they tolerate, what can you assume about them? Did you interact with them directly and how? One example of a design decision shaped by understanding this user type.

```
They value efficiency, predictability, stability etc. What I heared often in interviews is that they often dont like "clickops". them having to do the same stuff clicking around in a ui. if they have a ui they usually want the ui to make the work more efficient in as little clicks as possible or e.g. make understanding large amounts of data easier or someting similar. they dont like having to repeat the same click patterns over and over. if something like that were to be the case theyd like to have a way to automate it, scipt it etc. 

i did interact with some directly yes. it was a mixture of real customers and internal (proxy) users, field engineers who would both themselfs be users and interact with customers who would be users a lot.

honestly essentially every design decision has to be shpaed by understanding this user type. otherwise what are we doing?
```

---

## TODO 3: The user research behind the map feature

Who did the research (you, someone else, inherited findings)? What did it look like (interviews, contextual inquiry, support tickets)? A specific quote, scenario, or behavior that pointed to geographic awareness. Any competing interpretations of what users needed?

```
The exploratory user research was done before I joined by my then manager. who also worked on maas. a lot of the initial requirements for site manager (like the map) came from her exploratiry research. she did interviews with maas customers primarily who have multiple maas sites. qualitative interviews.
So those requirements i got from her and worked based off of those. while designing i did user testing with internal proxy users (field engineering). so internal ppl who would both themselfs be users and interact a lot with customers who would be users too. i did this research both with some initial first draft desigs. and then again more towards when they were more done to validate designs we had done before implementation.

i dont think there is a specific quote. But when managing a large fleet of maas sites and especially for edge nodes geographic location i think becomes more relevant. because often you do this for decreased latency. so youd need to be aware of e.g. issues in specific geographic locations or smth.
```

---

## TODO 4: Design alternatives and iteration

What alternatives did you explore alongside the map (table view, hierarchy, something else)? How did you solve the 30,000 sites scaling problem? A moment where designer or developer feedback changed your approach.

```
we have a table view alongside the map. actually we designed the table first. then the map was the feature for viewing the data after the table. table and map are controlled with a viewswitcher. as they are essentially two different ways of viewing the same data.
To highlight geographic location the only thing that really makes sense is a map tbh.
The 30000 sites scaling problem for the map (not sure if this is mentoined in the text i think it is) was showing them on the map both visually (30000 sites in close proximity you can really look at them propely if you render them all individually) and also from a performance perspective. you cant render that many points the easily and still be performant on a map.
So thats with in several design iterations i designed how indiviudal points would merge together at different zoom levels into groups of locations. so its easier to look at and render.
There was a lot of nuance to those designed to be considered. i.e. how would selection of sites work with grouped sites. or if you previously selected a site and it gets grouped together with others etc. so there was a lot of things to consider for this scaling issue.

close collaboration with developers was important here. this was something where the limitations of the maps library we used were not always super clear. so we had to stay in contact what is tricky in terms of implementation especially rendering performance, what could be implemented from the design etc. 
```

---

## TODO 5: Map tile sizes

Standard map tile size vs your optimized size. Just the numbers.

```
over 100gb for standard whole earth map tiles. it was i think around 100mb for the optimized size
```

---

## TODO 6: Convincing the dev team

How did you present the proof of concept? Initial skepticism? What were the devs' concerns and how did you address them?

```
i made the proof of concept as a github repository right. i would say the situation was more a collaborative scene. we were working out how to do the maptile feature. we had not thought of maptiles from the beginning that deeply but at some point we got to thinking about that part of the project. and we realised that by default most "of the shelve" map tiles that are open source would be too large for us to realistically be able to package it together with the application.
after realizing that the developers did not really explore alternative approaches much. so since i had recently worked a lot with gis stuff a lot for the climbing project i mentioned I had some idea of map tiles. how they could be build etc. what data sources there are. knew what tooling there is. so i gave it a try and was able to code a proof of concept with it that showed itd be possible to do maptiles with the sort of styling and level of detail that was sufficient for our usecase. and i send that over to the engineers as a github repo. i dont really think there was skepticism and it was just accepted as a good solution to the problem we had regarding the map tiles.
the devs concerns rightfully was that we cant really package over 100gb of map tiles in an app.
```

---

## TODO 7: The climbing project connection

What specifically from that project gave you the knowledge that a better map solution was possible?

```
see the answer above.
```

---

## TODO 8: User testing details

How many sessions, with whom? What tasks? Any issues found or things iterated on after testing? Anything post-launch?

```
i think around 6 sessions. they were qualitative interviews to test generally the usability of the prototype we had build for the MVP. There were not any major issues. just small papercut ux issues here and there that we fixed after testing. e.g. clean up some things visually, clean up some ux copy etc. but i think the main user flows etc were understandable.
```

---

## TODO 9: Cut the closing paragraph

The last paragraph ("This project demonstrates how taking initiative...") reads like a cover letter. Confirm it should go, or explain why you want to keep it:

```
do what you would work and sound best keeping the target users of hiring managers in mind
```
