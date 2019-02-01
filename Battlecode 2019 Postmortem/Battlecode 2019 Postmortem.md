# <center>Battlecode 2019 Postmortem</center>
*<center>By Double J</center>*
_____

Battlecode this year was focused on the Crusades, a holy war between the <span style="color: red">Religious Exploratory Doctrinists (RED)</span>, and the <span style = "color:blue">Believers of Lasting Unity Everywhere (BLUE)</span>. Our units were castles, churches, pilgrims, crusaders, prophets, and preachers.

**Castles** were immovable structures, similar to Archons in previous years. They could build every unit except churches, and were a place to deposit fuel and karbonite to. However, teams had to be careful with their castles - they lost when all of their castles were destroyed. Castles had 200 health, the most of any unit, and dealt 10 damage in a radius squared of 64. Teams started with 1-3 castles in the beginning of the game.

**Churches** were also immovable, but could be built by pilgrims. They were similar to Castles, except that they could not shoot, and had less health (100). Churches became important due to the fact that karbonite and fuel had to be returned to either a church or a castle before it could be used. In order to expand to gain more resources, it was necessary to bulid churches or else a pilgrim would need to move a far distance in order to deposit its resources.

**Pilgrims** were the worker unit of the game. They had no attack, and only 10 health, but they had cheap movement cost and the largest vision radius of all units (equal to that of castles and churches). Pilgrims were also the only unit that could mine resources, making it necessary to build them, but counterproductive to build too many. In fact, due to their large vision radius and cheap build cost, my team used them as scouts during the Sprint and Seeding tournament. This will be discussed more in length later on.

**Crusaders** were similar to knights in 2018. They moved fast for little fuel, but had a small attack radius. They also only dealt 10 damage. Crusaders were often exploited for their health benefits as they had the cheapest health to karbonite ratio. This is because if both teams had an equal number of castles after the end of 1000 rounds, tiebreakers were next decided by total unit health. Due to the nature of the game this year, a large quantity of games took the entire 1000 rounds with neither team advancing on the other. Incorporating an explosion of Crusaders (or even churches by one team) became a useful tactic.

**Prophets** were ranged units. They had very little health, and dealt only 10 damage, but had a large attack radius. Used in groups, they could be formiddable against any other unit type. Their only weakness was their high cost to shoot - 25 fuel! A few crusaders or preachers could easily take out a large number of prophets if they ran out of fuel.

**Preachers** had a splash damage unique compared to the other units. They also dealt the most damage, twice as much as that of prophets and crusaders. In addition they had the largest unit health - 60 health compared to a prophet's 20 health or a crusader's 40 health. However, preachers costed the most karbonite to build, and the most fuel to move. They also had a smaller attack radius, the same as crusaders, so it was easy for prophets to pick them off at a distance. But, if they could get a group of preachers inside their attack range, they could wipe out up to 9 prophets in one shot.

**Karbonite** was one of the two resources that could only be mined by pilgrims. Karbonite was only used to build units, but a smaller proportion of karbonite could be mined per turn by a pilgrim than for fuel.

**Fuel** was used not only to build units, but also to move, attack, and signal between units. A passive income of 25 fuel was received, but that was not nearly enough to survive on.
___
## Week 1

Before the Sprint tournament, Castles only had 100 health and no attack damage. As a result, most teams quickly realized that a preacher rush would be a good strategy. They would build 3 preachers and a pilgrim. Depending on the team, the pilgrim would either work with the preachers, enabling them to fire on units outside their vision radius (with their splash damage), or the pilgrim would mine resources enabling them to build up an economy in the event that the rush failed.  However, a few days before the Sprint tournament several teams switched to a prophet rush when they realized that this would be a counter to many of the preacher rushes. My team, Double J, did neither, but instead worked on building up our pilgrim code, trying to build a good economy. Our idea was to build prophets if our castle ever saw enemies, but otherwise to try to win through economy.

However, we quickly got knocked out with this strategy, only placing in the top 64. In reaction to the rushes, Teh Devs pushed back by making Castles have 200 health and deal 10 damage. However, this quickly led to some unintended results.
___
## Week 2

Now that rushes were not an option, many teams switched over to a turtle bot. They would build prophets in a lattice around their castle, slowly expanding outwards. Bots that tried to attack their lattice would be taken out once they entered the much larger range of the prophets.

![An example prophet lattice](prophet_lattice.png)

<center>A typical prophet lattice.</center>

This time, my team again went for the unconventional strategy. We noticed that crusaders cost only 50 fuel to build. However, it cost prophets 25 * 4 = 100 fuel to kill a crusader. Crusaders also cost minimal karbonite, and moved quite quickly. We decided the counter-strategy to lattices was to build a stream of crusaders that would slowly make the prophets run out of fuel. When their fuel supply was exhausted, our crusaders could break through and destroy their castle. A similar strategy works with preachers, due to their low fuel cost to be-killed ratio.

![An example of a preacher stream](preacher_stream.png)

<center>A steady stream of preachers takes out the prophets.</center>

Unfortunately, during the actual seeding tournament we never got to see our strategy in action. We lost a matchup to a crusader rush, which we thought would never happen. After Teh Devs nerfed rushes, we thought most teams would stop using rushes. To be careful, we still decided to test each rush, and see which worked the best. My teammate did so, and found that mage rushes were by far the best. A prophet rush was ridiculous; Castles would get the first shot off on the prophet, making it so any prophet could only get one shot off on the castle! Similarly we found that a crusader rush was not very effective. However, a preacher rush was still viable, if the opponenet didn't build any prophets or preachers themselves. For this reason we only implemented a counter to preacher rushes. Our castles didn't bother to build defenses against crusaders or prophets. We learned our lesson the hard way, and for the next tournaments we made sure to include prophets and crusaders as threats to the castle!

Unlike many other competitors, my team implemented a **scout**. This so-called scout was a pilgrim, that only had one purpose: it went next to the enemy castles, signalling back to the base the types of units the enemy was building. This way we could react with the appropriate type of unit, switching often from buliding preachers to prophets to crusaders. The one downside to this strategy was that sometimes our scouts would be killed by enemies. In this case, our castle would default to building preachers. There wasn't a way to stop our scouts from being killed, but it was annoying when it happened.

___
## Week 3

With such a low seed from the seeding tournament, we knew we really had to do something special to make the finals. The strategy we decided on was a "preacher wave". We would build 20-40 preachers at a time, in the same manner as others were building prophet lattices. When we had a sufficient number of preachers, our castle would send a signal, and they would rush the enemy together. What is unfortunate is that many times our preachers would run out of fuel, slowing to a crawl as the enemy picked them off one by one. But if we waved early enough and with enough fuel, our preachers would wipe out their lattice, and destroy one or two castles.

While scrimmaging with a prominent prophet lattice team, **Standard Technology**, we found out a counter to our own strategy. If our opponents incorporated preachers into their own lattice, our wave would be crushed. We were lucky that the teams we went up against didn't do this.

Due to our bad seed, in our second matchup we went against **DOS**, the 2nd place team from the seeding tournament. We nearly beat them, but our preachers ran out of fuel. Despite our measures to prevent this, it still happened, and so we were knocked down to the losers bracket. From there, we went on to win 4 more games. In the end though, we lost to **Chicken** due to a sad bug in our code. Our preachers would sometimes fire when they couldn't see any enemies. They chose the place that would deal the least damage to our own units, so normally it was alright. However, in this unfortunate map, our castle happened to be barely outside our preacher's vision radius. Thinking it was safe to shoot there, our preacher splash-damaged our own castle, killing it off and causing us to lose the match. We ended up placing 17*th*, barely missing the final tournament (and even having more wins than **Big Red Battle Code** who made the final tournament).

___
## Week 4

We didn't make the final tournament, but there was still one other tournament we could compete in: the high school tournament. Two hours before the tournament, we decided that we should change our strategy around. We made two differences, and attempted another:
1. We incorporated crusaders into our preacher wave.
2. We changed how our lattice formed, preventing a "church spear".

A church spear became well known during the qualifying tournament when someone posted a giphy on Discord displaying the strategy. Due to the turn queue this year, when a unit was built it could *immediately* take an action. But what if this action was building another unit? You could make a chain as long as you like, as long as you have the fuel and karbonite to keep building! A church spear took two units to create; pilgrims and churches. The pilgrim would build a church, whereupon the church would immediately build a pilgrim. With this chain, you could build churches right in the middle of the enemy's units before they could take a single turn.

![A church spear](church_spear.png)
<center>A church spear</center>

Luckily, an easy counter existed. Most people at the time were building lattices in a chess-board formation, like in the prophet lattice shown earlier. We adopted a denser lattice where our units could still move throughout the lattice, but enemies couldn't build between our units.

![Our final lattice of preachers and crusaders](dense_lattice.png)
<center>Our final dense lattice (red).

Finally, we tried creating our own church spear. In fact, before the submission deadline we had a working church spear, but we were editing the wrong file, and so the changes didn't carry over to our final bot. It was unfortunate, but the church spear may not have been a great benefit.

In the high school tournament, we ended up placing 7th. In our final game, we played against **https://youtu.be/6n3pFFPSlW4**. We lost due to a very fixable issue. When our churches were in danger they would build preachers, immediately. However, if churches or castles weren't in danger, they would only build preachers or crusaders if they had a store of fuel and karbonite for an emergency. **https://youtu.be/6n3pFFPSlW4** ended up placing a prophet right next to our church, causing it to panic and build preachers. The preachers never could get inside their attack range, and so they could never kill off the prophet. Their team won on unit health.

___
## Conclusion

Overall, we had a lot of fun in this year's competition! There were several things we felt could be improved upon. For the most part, the dominant strategy was a prophet lattice. We chose to go with unconventional strategies, hoping that we could build a counter to the conventional strategy, but found it never worked out. Nearly every top team used a lattice, and the recommendation most people gave to beat lattices was to *lattice harder*. Next year I hope to see more competing strategies, perhaps by reducing the vision radius of the equivalents of prophets to barely more than that of melee units.

I enjoyed the challenge that this year presented compared to last year in the control of the units. In 2018, robots were controlled in a swarm fashion. Your AI could see every robot, and could performed actions from a more omniscient standpoint. I liked how this year robots had their own mind, and had to make decisions based on what they could see.

I also agreed with how resources functioned this year. There were infinite deposits that units could take resources from, but they had to return their resources back to a base. This made economy much harder to implement, making it more of a challenge to build a top bot.