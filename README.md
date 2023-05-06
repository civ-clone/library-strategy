# library-strategy

Contains `Strategy`s to be used with `SimpleATStrategyClient` to build a comprehensive AI opponent.



Basic outline of what a "good" AI might need to do to achieve 4X:

```markdown
# 4X: Explore, Expand, Exploit, Exterminate

Requirements for each point:

# Explore

#. Have an unexplored area
#. Be able to access it
#. Be able to build resources to explore with


## Expand

#. Have discovered a location to expand to (Explore)
#. Be able to access it
#. Be able to build resources to create expansion


## Exploit

#. Have discovered something of value (Explore)
#. Be able to access it
#. Be able to extract value (Expand)


## Exterminate

#. Have encountered another player's resource (Explore)
#. Be able to access it
#. Be stronger than other player (Exploit)
#. Be able to get units to other player
#. Be able to protect assets


```