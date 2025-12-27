### Exercice

étape 1 - Créer les deux process (fichiers emetteur.js, recepteur.js) qui se parlent via UDP Broadcast (sur 0.0.0.0)
étape 2 - Réimplementer un message éthernet
ressource : p107 https://www.my-wire.de/schnittstellenbeschreibung/ethernet.pdf

TO DO : 
- Finir le dataframe et l'extraire vraiment (wrapEthernet, unwrapEthernet)
- Recoder ARP
- Implémenter le système de vérification (crc)
- Refaire la même chose en Rust