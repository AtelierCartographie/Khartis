Dans **Khartis**, 5 méthodes de discrétisations sont disponibles. Chacune permet de découper la série statistique en groupes.

#### intervalles égaux
>L'amplitude (min-max) de la série statistique est divisée par le nombre de classes souhaitées.   
>Les seuils délimitant des classes sont réguliers mais certaines peuvent être vides et d'autres très remplies.

#### moyennes emboitées
>Une première moyenne (arithmétique) divise la série en deux puis chaque groupe est à nouveau scindé par une moyenne.   
>La carte suivra la distribution de la série statistique mais le nombre de classes sera contraignant (2, 4, 8, etc.).

#### quantiles
>Chaque classe rassemble le même nombre d'entités.   
>La carte sera équilibrée mais ne montrera pas les éventuelles asymétries de la série statistique.

#### standardisation
>Chaque classe est déterminée en fonction d'écart-type par rapport à la moyenne.   
>Adapté dans le cas de distribution symétrique de la série statistique(en forme de courbe Gauss).

#### Jenks
>Méthode proche des seuils observés permettant de limiter les écarts à l'intérieur des classes et d'augmenter les écarts entres les classes.   
>La carte suivra la distribution de la série statistique.