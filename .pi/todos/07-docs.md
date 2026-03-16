# Design Systems Documentation — Content TODOs

> How to use: Dump bullet points, half-sentences, rough thoughts under each TODO. Don't worry about grammar, flow, or repetition. I'll turn it into proper prose afterwards.

---

## TODO 1: The cost of not having docs

Concrete examples of what went wrong because documentation didn't exist. Inconsistency across the portfolio — can you point to specific types of inconsistency? How did knowledge silos affect onboarding new designers? Did teams interpret components differently? Did anyone build something wrong because they didn't know the intended usage?

```
it was just inefficient. people did not know how to use certain components. if they are dilligent theyd ask other people who were more familiar with the ds. which often would mean me. thats time spend where it would not need to be. if it were written down then id be easier for them to just read. less time spend having to write etc.
some designers werent as diligent and just did what their best guess was of what was right. this lead to different interpreatiosn and therefore different implementations. 
and this lead to fast inconsistencies across canonicals portfolio. As is common for the sort of products canonical creates there is a lot of tables in our applications for example. tables with a lot of advanced functionalities. because those were never properly documented. they were designed and implemented in fastly different ways. leading to frustrating expereinces of users using multiple products. fastly different experiences.

onboarding of course isnt easy into our design system too. you essentially have to get to know the "lore" of our design system. that will only work by attending a lot of meetings where we disucss designs where people more familiar with ds are present and through that essentially the design systems "lore" can be "passed on". not a very efficient process of onboarding someone into the ds.

as to the last question. yes that happens all the time
```

---

## TODO 2: Advocating for the investment

You say you pushed for this "for a long time." How long roughly? What arguments did you make? What finally changed management's mind? Was there a specific incident or did it just accumulate? (You mentioned "management finally realized how detrimental it would be" — what made them realize?)

```
id say for more than a year but more strongly in the last year id say. the inconsistencies of the team became more apparent and there was a recent mandate by senior company leadership to make our products more consistent and coherent with each other. 
I was pointing to the inexistent documentation as one of the main reasons of why we are so inconcsitent with each other. if there are no rules with which have to be consistent with how should you know how to be consistent with it? How could we measure how well we are doing in terms of consistency? etc etc

i dont think there was a particular incident that made them realize. But I think at some point they just warmed up to the idea that writing nothing down might be inefficient and part of the problem.

I think btw that we need to corporate speak a good chunk of what i have written so far. i feel like it comes across as a bit angry and hostly so we need to soften that a little bit.
```

---

## TODO 3: Why structured data

Why write docs as structured data instead of, say, a Notion wiki or a Google Doc or a Storybook page? Was this your decision? What format did you use (JSON, YAML, something else)? What were the trade-offs? Did other designers push back on the format or was it accepted?

```
it aligns with the overall approach we have decided for our new design system. a structured approach will make it easier in some ways for an llm to explore our data in some ways. the structured data approach was not my decision no. the primary source is in coda a tool similar to notion to make the editing experience a bit easier. but im saving the data as json. 
tradeoff is that the editing experience is harder and not as easy to onboard into. although it also makes it more clear in how things should be structured and what is requried of good docs. yes there have been a lot of discussions on this. but i dont want to get into all of that in this article.
i think the main point of the structured data is to make it easier to consume for agents
```

---

## TODO 4: The collaborative writing process

You worked with 3 other designers. How was the work divided? Did each person own certain components/sections? How did you ensure consistency across writers? Were there disagreements about content or depth? How many components/guides were documented in total?

```
we worked on different components we divided beforehand based on our expertises (some of us were more familar with different parts of the ds than others). 79 documentation pages were written. also actually it was 4 people writing documentation. regarding depth. we agreed when we began that in the first pass we would only document what we defined as minimal documentation. the definition of that is:

Writing minimum documentation for components

The Design System Working Group wanted to lower the barrier for contributing to the Design System. We realised the blocker was the amount of time designers needed to write documentation for their contributions. We decided to allow different levels of quality in our documentation, including a minimum amount. This minimum amount means designers can quickly document their new components and improvements to existing ones. Our goal is to increase our documentation of components overall, and then continue to improve documentation quality over time.

Minimum documentation should answer these questions:
What are the parts of the component?
List the parts (anatomy) of the component. You can also make an illustration. See the side navigation documentation as a reference
List the variants of this component. Variants are significantly different implementations of a component. For example, the cards in a blog versus the cards used in Charmhub.
List the aspects of the component (also called, ‘properties’) that can be configured by the designer. For example, size, colour, show and hide parts, and editable text.

When should we use the component?
Give the context for using the component. Explain the situation when a designer should pick this component and what problem it solves. Are there any alternatives they could consider? When is this option more suitable than another? For example, when to use a button vs. when to use a link.
Give examples of situations, if any, when a designer should not use the component. For example, when there is consensus in the team or directions of when not to use a component.
You can also give examples of this component being used in our UIs.

How should we use the component?
List any do’s and don'ts for the component. Provide best practices such as, don’t use multiple primary buttons in a section of a page.




We are continuing to work on our templates for documentation. This will include templates for every component level as well as a scale to rate the level of completion of the docs. This minimal documentation is a starting point in the process of having a more comprehensive framework for documenting our components.

we dont need to be putting all that in the project text though
```

---

## TODO 5: Building the rendering

You say this wasn't officially part of the mandate. What did you build? A website? A page in an existing tool? What tech? How did the team react when you showed it? Did it change how people accessed the docs?

```
i build:
- a mechanism to download data from coda (which wasnt that easy. coda is not that easy to actually get all of the data out of)
- a package that transforms the raw data pulled from coda into data useable by the website and the agent skill
- a version of the structured data thats easier for the agent to explore
- a version of the data for display on the website
- its just a simple astro statically generated website which does a pretty simple rendering of the data

i think the reaction of the team has been VERY postive. honestly the team has been wanting something like this for a long time. not only that we document in a proper way but that its also all delivered in an easily accessible way. the team accessing the docs in coda would have not been feasable its not a tool they are familiar with and hard to navigate. 

and yeah we didnt rly have any docs before so yes i guess
```

---

## TODO 6: The agent skill

What structured data format are the docs in? How does the jq querying work in practice — can you give an example of a question a designer might ask and what the skill returns? Is this integrated into a specific tool (VS Code, a Slack bot, CLI) or is it a standalone thing? How many designers use it?

```
its just json documents with links between them. the json docs obviously have structured objects inside. in the skill i tell the llm roughly about the structure and examples of jq commands it needs to run to explore the data and get its answers. with jq being a very common cli tool so the llm having lots of exposure to it in its training data it is very good at using it. 

a question designers might have is how to align buttons in a ui. left or right align buttons. and the agent with the skill will query the ds docs, find the usage section of buttons and find guidance about it there. and then answer the user based on it. answering their question based on it and giving the relevant sources. 

for now its a standalone agent skill that can be used with any coding agent that supports skills. 
We are currently exploring building a website based agent based on the pi agent ecosystem. specifically its implementation for web.

a couple of more technical designers who are familiar with cli coding agents already use it. we are trying to further adoption with the website based version
```

---

## TODO 7: The meta-prompting framework — THIS IS KEY

Walk me through what the framework actually does step by step. You say it "walks you through a process" — what are the stages? What does the guidance look like at each stage? How does the brand voice checking work? What's the readability level target? How does it know when the doc meets the requirements?

Most importantly: you emphasize that "it is not supposed to cook up design systems docs itself. you still have to do all the thinking yourself." Why is this important to you? What goes wrong when AI writes the docs directly? Can you give an example of something the framework does well vs. something you'd never let it do?

```
you can explore it in /Users/maximilianblazek/Documents/GitHub/ds-docs-meta-prompting pls get the answers from there.

its important to me that its not cooking up the documentation by itself is because if we just let it rip on its own it would just cook up very generic documentation based on its training data right. with the documentation we are trying to answer the questions of usage etc. that are more specific to canonicals products, the problems they are solving for our users etc. we need to be making it specific to our design system. if we were ok with reading generic documentaiton not specific to our use case at all. we could also just read e.g. the documentation of other famouse e.g. headless design systems. that would not help us a lot though. doesnt fulfill the needs of our internal users.

the framework with how we have set it up is very good at following our design systems brand voice. so its good at rewriting a vomit draft a designer has written and turn it into good readable prose for the design systems site. i dont think it would be good at writing documentation that is specific to e.g. frequent questions that come up in our design review meetings etc. cause in order to do that id have to have spent a long time on our team and understand the use cases we build products for etc.
```

---

## TODO 8: The content designer collaboration

How did working with the content designer shape the framework? What did they bring that you couldn't have done alone? Was the brand voice definition something that already existed or did you define it together for this project?

```
I brought the technical expertise of llms and agents etc. they brought the content writing expertise. so it obviously helpeed a lot to have experience content writing expertise in this process because this is all about content writing. i couldnt have done that. im not a content writing expert. there exists a canonical general brand voice. nothing specific for (design) docs though. so we adopted the general one for our design docs. we defined it together. but obv the content designer lead that
```

---

## TODO 9: Outcomes

How many components/topics are documented now? Is the documentation actually being used? Any signal — page views, questions that stopped being asked, onboarding feedback? Has the inconsistency across the portfolio started to improve? Is the meta-prompting framework being used by other writers on the team?

```
id say like 50 or so are doumented now. yes the documentaiton has been rapidly adopted in the team. a majority of the 30 ppl team are using them already. i get less questions (also because i try to mention the docs we have written at every opportunity i can). when i do get questions i can often link to the docs. its still early days for the docs. i think we will only see the actual impact when a bit more time passes (its a very fresh product). but i am confident it will.

yes the other ppl on the docs writing project have already used it too
```

---

## TODO 10: Should you mention the previous lack of internal processes documentation?

You flagged this yourself: "should we actually say that in the text, maybe not?" My take: you can acknowledge that documentation wasn't a priority without throwing the team under the bus. Something like "documentation hadn't been a priority" is honest without being disloyal. But you know the culture better — what feels right to you?

```
yeah that sounds good
```
