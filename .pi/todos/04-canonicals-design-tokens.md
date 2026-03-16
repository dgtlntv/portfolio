# Canonical Design Tokens — Content TODOs

> How to use: Dump bullet points, half-sentences, rough thoughts under each TODO. Don't worry about grammar, flow, or repetition. I'll turn it into proper prose afterwards.

---

## TODO 1: Who suffered and how

A concrete example of the pain caused by not having tokens. Who was affected — designers checking hex codes, Flutter team reverse-engineering SCSS, brand team frustrated by inconsistency?

```
a couple years ago canonical changed its own and ubuntus log. at times you can still find the old logo in our internal and external interfaces.
this shows the true need for design tokens. we hard coded the old logo everywhere. thats why it is still showing up. we did not yet find all the different places we hard coded it. we did not refernce one place for all our logos. if we had used a design token for the logo we would have just needed to update it in one place and it would have scaled to everywhere else.

But this sort of pain we also have generally with our old design system. we needed to manually keep our colors, typography spacing etc in sync between figma, css and flutter. with this manually keeping things consistent we of course make mistakes and things were inconsistent.

all reasons why we really needed design tokens. so we have a proper foundation for a well scaling design system this time
```

---

## TODO 2: Why you pushed for this

What moment or experience made you think "we need design tokens"? Did you need to convince anyone? Was there resistance or was the team receptive?

```
i am in charge of our figma libraries. as you can read about in the other projects i created a new figma library from scratch because the old one was not up to snuff. for that one i had to manually inspect the css to figure out what the actual values are and manually transfer them to figma. That made it clear to me personally that we need design tokens. this is not a scalable solution. 

there was not really any restistance on the concept of design tokens themselfs. there were lengthy discussions of course about the naming and the values and implementations of design tokens though. a big discussion was about wether we should follow the w3c design tokens community group specification or not. I was heavily advocating for it. even though it is not fully mature yet it is where the industry and all its tooling is moving. other team members were not fully convinced as it has its restrictions and is opinionated in how to do things in certain ways. but with strong industry signals (a first stable version, figma and penpot officially adopting it etc.) and some discussion we ended up commiting to complying with the w3c spec.
```

---

## TODO 3: What the audit revealed

Roughly how many variables/values existed? Surprises, duplicates, near-duplicates, contradictions across platforms?

```
hundrets of variables. specifically a lot of very similar colors. we had around 60 shades of greys alone. because in the old design system they were added adhoc and manually, no system behind it. from that audti it was clear. that one of the bigger things we needed was a complete overhaul of our color system. which I lead as well. (im not sure if i mention that in the project really. but there is also a blog post abt. part of it. the apca one)
```

---

## TODO 4: The naming debate

Different opinions/factions (designers vs devs vs platform teams). The most contentious naming decision and how it was resolved. How this spec process was different from the Figma libraries one.

```
The spec process was quite similar. I drafted a proposal with a colleague and then over several session we discussed the contents of the spec, changed updated and agreed on its specifics. Honestly we discussed naming extensevly but it was not super contentuose. the most contentuose part was actually how we structure color themes (i.e. light and dark theme.) this is where most of the discussion happened wether we should follow w3c or not.
```

---

## TODO 5: The color palette

How many ad-hoc colors existed before? Any trade-offs from the contrast-based approach? Anything that broke?

```
hundrets. no not really
```

---

## TODO 6: What the prototype discovered — THIS IS THE CLIMAX

What specific limitations did you find in Style Dictionary? How did those discoveries change the token authoring process? A concrete example: "I tried to build X, found Y didn't work, so we changed Z."

```
ok so the project changed a bit since i last updated it. we actually ended up going with terrazzo. a different token transformer. we chose it over style dictionary because it seemed more commited towards fully adopting the w3c spec. specifically the stable version that was released. this was decided after we fully decided to commit to w3c spec. with terrazzo it was pretty straight forward.
```

---

## TODO 7: New ending

The current ending is "engineering hasn't started yet." List what was actually delivered — the inventory, the approved spec, the token sets, the prototype, the color palette, the learnings fed back. Dump it all:

```
Ok so this changed too. I created an official handover repo. with specific design token files. for all of the tokens i authored. and these design tokens  have been 121 been used by the engineering team now for implementation. engineering now has implemented. and we are now starting to use it in our figma libraries and new design system. the spec was delivered of course too. the prototype too. of course the handover repository with full deisgn token files. the color palette too.
```

---

## TODO 8: Why you tackled token categories in this order

Why dimensions first, then typography, then color?

```
well generally those three categories are the most important. dimensions was relatively easy to do. typography was a bit harder and of couirse color is very hard. so i guess in order of how hard it is to do
```

---

## Updates since last update

So a lot has happened since i last update this so here are a couple things that have happened that need to be integrated into the text.

While working on this project is i became a member of the w3c design tokens community group. as part of the group i realized that it did not have an official json schema yet. so i started working on my own. then there came an oppurtunity to contribute it so i contributed it to the group and now it is the official design token json schema. 

based on this schema i also created an agent skill https://github.com/dgtlntv/w3c-design-tokens-agent-skill which has awareness of the fully specification and schema. it allows an agent to properly write design token json and verify wether its valid itself. with a ajv script which uses the schema. (i think this is a good example of growth mindset (dont call it that its cringe) and that im good at using ai tools and building ai based tools)

lastly i have build a plugin for terrazzo https://github.com/dgtlntv/terrazzo-plugin-figma-json which we have used to import the design tokens into figma. using the new design token import feature.

we need to integrate all of these points somehow
