### Exercice

étape 1 - Créer les deux process (fichiers emetteur.js, recepteur.js) qui se parlent via UDP Broadcast (sur 0.0.0.0)
étape 2 - Réimplementer un message éthernet (ressource : p107 https://www.my-wire.de/schnittstellenbeschreibung/ethernet.pdf)
- Préambule, SFD, adresses destination et source...
- on ignore les messages qui ne nous sont pas destinés (i.e. l'adresse de destination n'est pas notre adresse ET n'est pas la broadcast address)
- Length/Type field (p110). Pour commencer simplement, on ne s'occupe que de l'interprétation Length.
- mac client data (ignorer le pad pour commencer)


TO DO : 
- Finir le dataframe et l'extraire vraiment (wrapEthernet, unwrapEthernet)
- Recoder ARP
- Implémenter le système de vérification (crc)
- Refaire la même chose en Rust