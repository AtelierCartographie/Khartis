<h1 id="main">
Khartis<br><em>How to simply create thematic maps in three steps ?
</em></h1>
<br>
<p align="center">
  Paul Girard ‑ Benjamin Ooghe Tabanou - Audrey Baneyx<br>
  Sciences Po médialab, Paris, France
</p>

<p align="center">
 <small>
  <em>FOSDEM 2017</em><br>
  Université Libre de Bruxelles<br>
  05/02/2016
  </small>
</p>
===
[<img alt="Sciences Po médialab" src="./assets/SciencesPO_MEDIALAB.png" style="margin: 0;">](http://medialab.sciences-po.fr)
* A social sciences research lab
* Designing digital research methods
* Developing Free and Open Source software
  [github.com/medialab](http://github.com/medialab)

===
[<img alt="Sciences Po, Atelier de cartographie" src="./assets/logo_carto.png" style="margin: 0;">](http://www.sciencespo.fr/cartographie/)
* cartography
* graphic semiology
* information visualisation
* for teaching, research, edition and museums

![Atelier de cartographie's team](./assets/atelier_carto_team.png)

=== 
Thematic maps
![World Carbon Dioxyde emission in 2013](./assets/emissions-CO2-2013-CCBYNDNC4.0.jpg) 

===

[![logo USPC](./assets/logo_uspc.jpg)<!-- .element: style="width:25%; "-->](http://www.sorbonne-paris-cite.fr/)

The story starts with a grant from USPC  
won to design a **pedagogical mapping tool**. 


===

## A tripartite collaboration

- teaching cartographers
- digital methods specialists and FOOS agilists
- cartography web application developer:  
  [Arnaud Pezel](https://github.com/apezel) from [![logo apyx](./assets/logo-apyx.png)<!-- .elements: style="height:50px; margin:0; margin-bottom:-13px"-->](http://www.apyx.fr/)
  
===

## easily

<center>A tool accessible for newbies</center>

===

## create a map
<center>
Which data?   
Which map projection?
</center>

===

## to convey a message
<center>choose and tune visual forms</center>

===
## 3 steps

1. upload data
2. choose a map projection
3. add visual forms

===
<center>![georef icon](./assets/georef.svg)</center>

### upload data

<center>
data type recognition  
geographical names alignment
</center>
===

<center>![projection icon](./assets/proj.svg)</center>

### choose a map projection

<center>Does it preserve **area**, **distance** or **angle** ?</center> 
===
<center>
![projections choices](./assets/map_projections.png)
</center>
===

<center>![picto viz icon](./assets/picto-viz.svg)</center>
### tune the visual forms
- pick variables from data
- choose a visual form : symbols or surfaces 
- tune visual settings : color, size, classes

===

### finalize
- add Title, Author, Source
- tune the legend
- download SVG or PNG


===
### Live mapping !
Let's use the [dataset from Andres, Broniak and Marlan](./assets/co2_nation.1751_2013.csv)  
and load it into [Khartis](http://www.sciencespo.fr/cartographie/khartis/app/)
<center>
  ![World Carbon Dioxyde emission in 2013](./assets/emissions-CO2-2013-CCBYNDNC4.0.jpg)<!-- .element: style="width:60%; "-->  
</center>

===

### multiple geospatial areas

<center>
![préfectures populations France](./assets/pref_khartis.svg)<!-- .element: style="width:90%; "--> 
</center>

===
## under the hood

- full web client application
- ember.js
- d3.js
- an electron version for offline use

fork me on [github.com/AtelierCartographie/Khartis](https://github.com/AtelierCartographie/Khartis)

===

<center>![picto viz icon](./assets/safe.svg)</center>
### your data stays on your computer

===
<!-- .slide: data-background-image="./assets/khartis.png"-->
<center>[http://www.sciencespo.fr/cartographie/khartis](http://www.sciencespo.fr/cartographie/khartis)</center>  <!-- .element: style="background:white;margin-top:60%;"-->


