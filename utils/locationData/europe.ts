/**
 * Europe Region Location Data
 * Additional European countries beyond the core set
 */

import { RegionalData } from './index';

export const europeData: RegionalData = {
  "United Kingdom": {
    cities: {
      "London": ["Central London", "East London", "West London", "North London", "South London"],
      "Manchester": ["City Centre", "Northern Quarter", "Didsbury", "Chorlton", "Salford"],
      "Birmingham": ["City Centre", "Jewellery Quarter", "Moseley", "Edgbaston", "Digbeth"],
      "Edinburgh": ["Old Town", "New Town", "Leith", "Stockbridge", "Morningside"],
      "Liverpool": ["City Centre", "Albert Dock", "Cavern Quarter", "Georgian Quarter", "Ropewalks"],
      "Glasgow": ["City Centre", "West End", "Merchant City", "Finnieston", "Southside"],
      "Leeds": ["City Centre", "Headingley", "Chapel Allerton", "Roundhay", "Horsforth"],
      "Bristol": ["City Centre", "Clifton", "Harbourside", "Stokes Croft", "Southville"],
      "Sheffield": ["City Centre", "Ecclesall", "Kelham Island", "Broomhill", "Crookes"],
      "Newcastle": ["City Centre", "Quayside", "Jesmond", "Ouseburn", "Gosforth"]
    }
  },
  "Germany": {
    cities: {
      "Berlin": ["Mitte", "Kreuzberg", "Prenzlauer Berg", "Charlottenburg", "Friedrichshain"],
      "Munich": ["Altstadt", "Maxvorstadt", "Schwabing", "Glockenbachviertel", "Haidhausen"],
      "Hamburg": ["Altstadt", "St. Pauli", "Eppendorf", "Winterhude", "HafenCity"],
      "Frankfurt": ["Altstadt", "Sachsenhausen", "Westend", "Nordend", "Bornheim"],
      "Cologne": ["Altstadt", "Ehrenfeld", "Belgisches Viertel", "Südstadt", "Deutz"],
      "Stuttgart": ["Mitte", "West", "Bad Cannstatt", "Degerloch", "Vaihingen"],
      "Düsseldorf": ["Altstadt", "Carlstadt", "Pempelfort", "Bilk", "Oberkassel"],
      "Dortmund": ["City", "Kreuzviertel", "Hörde", "Hombruch", "Brackel"],
      "Essen": ["City", "Rüttenscheid", "Werden", "Kettwig", "Bredeney"],
      "Leipzig": ["Zentrum", "Plagwitz", "Connewitz", "Gohlis", "Südvorstadt"]
    }
  },
  "France": {
    cities: {
      "Paris": ["1st Arrondissement", "Marais", "Saint-Germain", "Montmartre", "Latin Quarter"],
      "Marseille": ["Vieux-Port", "Le Panier", "Cours Julien", "Notre-Dame du Mont", "Castellane"],
      "Lyon": ["Presqu'île", "Vieux Lyon", "Croix-Rousse", "Part-Dieu", "Confluence"],
      "Toulouse": ["Centre", "Capitole", "Carmes", "Saint-Cyprien", "Compans-Caffarelli"],
      "Nice": ["Vieux Nice", "Promenade des Anglais", "Cimiez", "Liberation", "Port"],
      "Nantes": ["Centre", "Bouffay", "Île de Nantes", "Erdre", "Doulon"],
      "Strasbourg": ["Grande Île", "Petite France", "Krutenau", "Neudorf", "Robertsau"],
      "Montpellier": ["Centre", "Antigone", "Beaux-Arts", "Port Marianne", "Hôpitaux-Facultés"],
      "Bordeaux": ["Centre", "Saint-Pierre", "Chartrons", "Bastide", "Mériadeck"],
      "Lille": ["Centre", "Vieux Lille", "Wazemmes", "Vauban", "Fives"]
    }
  },
  "Italy": {
    cities: {
      "Rome": ["Centro Storico", "Trastevere", "Vatican", "Testaccio", "Monti"],
      "Milan": ["Centro", "Brera", "Navigli", "Porta Nuova", "Isola"],
      "Naples": ["Centro Storico", "Vomero", "Chiaia", "Posillipo", "Quartieri Spagnoli"],
      "Turin": ["Centro", "San Salvario", "Quadrilatero", "Crocetta", "Borgo Po"],
      "Palermo": ["Centro", "Vucciria", "Kalsa", "Mondello", "Politeama"],
      "Genoa": ["Centro Storico", "Boccadasse", "Albaro", "Carignano", "Castelletto"],
      "Bologna": ["Centro", "Santo Stefano", "Saragozza", "Savena", "Porto"],
      "Florence": ["Centro Storico", "Oltrarno", "Santa Croce", "San Lorenzo", "Santo Spirito"],
      "Venice": ["San Marco", "Castello", "Cannaregio", "Dorsoduro", "San Polo"],
      "Verona": ["Centro", "Veronetta", "Borgo Trento", "San Zeno", "Borgo Roma"]
    }
  },
  "Spain": {
    cities: {
      "Madrid": ["Centro", "Salamanca", "Chamberí", "Retiro", "Malasaña"],
      "Barcelona": ["Eixample", "Ciutat Vella", "Gràcia", "Sants", "Les Corts"],
      "Valencia": ["Ciutat Vella", "Eixample", "Extramurs", "Campanar", "Algirós"],
      "Seville": ["Centro", "Triana", "Macarena", "Nervión", "Los Remedios"],
      "Zaragoza": ["Centro", "Delicias", "Actur", "Universidad", "Las Fuentes"],
      "Málaga": ["Centro", "Pedregalejo", "El Palo", "Teatinos", "Carretera de Cádiz"],
      "Murcia": ["Centro", "El Carmen", "Santa Eulalia", "Espinardo", "La Alberca"],
      "Palma": ["Centre", "Santa Catalina", "Portixol", "Son Espanyolet", "La Calatrava"],
      "Las Palmas": ["Vegueta", "Triana", "Las Canteras", "Playa del Inglés", "Maspalomas"],
      "Bilbao": ["Casco Viejo", "Ensanche", "Deusto", "Indautxu", "Abando"]
    }
  },
  "Netherlands": {
    cities: {
      "Amsterdam": ["Centrum", "Jordaan", "De Pijp", "Oud-Zuid", "Noord"],
      "Rotterdam": ["Centrum", "Kralingen", "Delfshaven", "Noord", "Charlois"],
      "The Hague": ["Centrum", "Scheveningen", "Bezuidenhout", "Statenkwartier", "Loosduinen"],
      "Utrecht": ["Centrum", "Lombok", "Wittevrouwen", "Oudwijk", "Zuilen"],
      "Eindhoven": ["Centrum", "Strijp", "Woensel", "Gestel", "Stratum"],
      "Tilburg": ["Centrum", "West", "Noord", "Zuid", "Oost"],
      "Groningen": ["Centrum", "Oosterpoort", "Paddepoel", "Corpus den Hoorn", "Vinkhuizen"],
      "Almere": ["Centrum", "Haven", "Buiten", "Poort", "Stad"],
      "Breda": ["Centrum", "Haagse Beemden", "Ginneken", "Princenhage", "Bavel"],
      "Nijmegen": ["Centrum", "Bottendaal", "Dukenburg", "Lindenholt", "Oost"]
    }
  },
  "Switzerland": {
    cities: {
      "Zurich": ["Altstadt", "Seefeld", "Wiedikon", "Aussersihl", "Oerlikon"],
      "Geneva": ["Centre", "Plainpalais", "Eaux-Vives", "Pâquis", "Carouge"],
      "Basel": ["Grossbasel", "Kleinbasel", "Gundeldingen", "St. Johann", "Riehen"],
      "Bern": ["Altstadt", "Länggasse", "Breitenrain", "Kirchenfeld", "Bümpliz"],
      "Lausanne": ["Centre", "Flon", "Ouchy", "Montbenon", "Chailly"]
    }
  },
  "Sweden": {
    cities: {
      "Stockholm": ["Gamla Stan", "Södermalm", "Östermalm", "Norrmalm", "Vasastan"],
      "Gothenburg": ["Centrum", "Haga", "Majorna", "Linnéstaden", "Järntorget"],
      "Malmö": ["Centrum", "Möllevången", "Västra Hamnen", "Limhamn", "Rosengård"],
      "Uppsala": ["Centrum", "Kungsängen", "Svartbäcken", "Luthagen", "Flogsta"],
      "Lund": ["Centrum", "Klostergården", "Vildanden", "Nova", "Linero"]
    }
  },
  "Norway": {
    cities: {
      "Oslo": ["Sentrum", "Grünerløkka", "Majorstuen", "Frogner", "St. Hanshaugen"],
      "Bergen": ["Sentrum", "Bryggen", "Nordnes", "Sandviken", "Åsane"],
      "Trondheim": ["Sentrum", "Bakklandet", "Lade", "Lerkendal", "Byåsen"],
      "Stavanger": ["Sentrum", "Storhaug", "Eiganes", "Madla", "Tasta"],
      "Tromsø": ["Sentrum", "Tromsdalen", "Langnes", "Kvaløya", "Tromsøysund"]
    }
  },
  "Denmark": {
    cities: {
      "Copenhagen": ["Indre By", "Vesterbro", "Nørrebro", "Østerbro", "Christianshavn"],
      "Aarhus": ["Centrum", "Vesterbro", "Nørrebro", "Trøjborg", "Åbyhøj"],
      "Odense": ["Centrum", "Vollsmose", "Bolbro", "Tarup", "Korup"],
      "Aalborg": ["Centrum", "Nørresundby", "Vestby", "Øst", "Hasseris"],
      "Esbjerg": ["Centrum", "Jerne", "Sædding", "Esbjerg N", "Esbjerg Ø"]
    }
  },
  "Finland": {
    cities: {
      "Helsinki": ["Keskusta", "Kallio", "Kamppi", "Punavuori", "Kruununhaka"],
      "Espoo": ["Keskus", "Tapiola", "Leppävaara", "Matinkylä", "Espoonlahti"],
      "Tampere": ["Keskusta", "Kaleva", "Hervanta", "Pispala", "Lielahti"],
      "Vantaa": ["Keskus", "Myyrmäki", "Tikkurila", "Koivukylä", "Hakunila"],
      "Oulu": ["Keskusta", "Tuira", "Kaukovainio", "Oulunsalo", "Haukipudas"]
    }
  },
  "Albania": {
    cities: {
      "Tirana": ["Centre", "Blloku", "New Bazaar", "Kombinat", "Kashar"],
      "Durrës": ["Centre", "Beach", "Port", "Shkozet", "Sukth"],
      "Vlorë": ["Centre", "Radhimë", "Orikum", "Selenicë", "Novoselë"],
      "Shkodër": ["Centre", "Rus", "Malësi e Madhe", "Pult", "Berdica"],
      "Elbasan": ["Centre", "Papër", "Bradashesh", "Labinot", "Belsh"]
    }
  },
  "Andorra": {
    cities: {
      "Andorra la Vella": ["Centre", "Santa Coloma", "Les Escaldes", "Engordany", "La Massana"],
      "Escaldes-Engordany": ["Centre", "Les Escaldes", "Engordany", "Pleta del Tarter", "Els Vilars"],
      "Encamp": ["Centre", "Vila", "Pas de la Casa", "Grau Roig", "Els Cortals"],
      "La Massana": ["Centre", "Sispony", "Anyós", "Pal", "Arinsal"],
      "Sant Julià de Lòria": ["Centre", "Aixovall", "Bixessarri", "Fontaneda", "Certers"]
    }
  },
  "Austria": {
    cities: {
      "Vienna": ["Innere Stadt", "Leopoldstadt", "Landstraße", "Wieden", "Margareten"],
      "Graz": ["Innere Stadt", "St. Leonhard", "Geidorf", "Lend", "Gries"],
      "Linz": ["Innere Stadt", "Urfahr", "Pöstlingberg", "Froschberg", "Bindermichl"],
      "Salzburg": ["Altstadt", "Neustadt", "Schallmoos", "Maxglan", "Gneis"],
      "Innsbruck": ["Altstadt", "Wilten", "Pradl", "Hötting", "Igls"]
    }
  },
  "Belarus": {
    cities: {
      "Minsk": ["Centre", "Oktyabrsky", "Leninsky", "Moskovsky", "Frunzensky"],
      "Gomel": ["Centre", "Centralny", "Sovetsky", "Novobel", "Zheleznodorozhny"],
      "Mogilev": ["Centre", "Leninsky", "Oktyabrsky", "Pervomaysky", "Lenina"],
      "Vitebsk": ["Centre", "Oktyabrsky", "Pervomaysky", "Zheleznodorozhny", "Frunzensky"],
      "Grodno": ["Centre", "Leninsky", "Oktyabrsky", "Lenina", "Sovetskaya"]
    }
  },
  "Belgium": {
    cities: {
      "Brussels": ["Centre", "Ixelles", "Etterbeek", "Schaerbeek", "Anderlecht"],
      "Antwerp": ["Centre", "Zuid", "Linkeroever", "Zurenborg", "Het Eilandje"],
      "Ghent": ["Centre", "Patershol", "Vrijdagmarkt", "Dampoort", "Rabot"],
      "Bruges": ["Centre", "Sint-Anna", "Sint-Gillis", "Assebroek", "Sint-Andries"],
      "Liège": ["Centre", "Outremeuse", "Sainte-Marguerite", "Fragnée", "Angleur"]
    }
  },
  "Bosnia and Herzegovina": {
    cities: {
      "Sarajevo": ["Baščaršija", "Marijin Dvor", "Novo Sarajevo", "Ilidža", "Vogošća"],
      "Banja Luka": ["Centre", "Borik", "Starčevica", "Mejdan", "Lauš"],
      "Mostar": ["Old Town", "Rondo", "Zalik", "Bijeli Brijeg", "North"],
      "Tuzla": ["Centre", "Tušanj", "Bukinje", "Kreka", "Duboki Potok"],
      "Zenica": ["Centre", "Nemila", "Bilmište", "Klopče", "Tetovo"]
    }
  },
  "Bulgaria": {
    cities: {
      "Sofia": ["Centre", "Lozenets", "Mladost", "Lyulin", "Vitosha"],
      "Plovdiv": ["Centre", "Kapana", "Trakia", "Maritsa", "Kamenitsa"],
      "Varna": ["Centre", "Seaside", "Asparuhovo", "Mladost", "Chaika"],
      "Burgas": ["Centre", "Meden Rudnik", "Lazur", "Slaveykov", "Izgrev"],
      "Ruse": ["Centre", "Druzhba", "Rodina", "Charodeyca", "Zdravec"]
    }
  },
  "Croatia": {
    cities: {
      "Zagreb": ["Donji Grad", "Gornji Grad", "Novi Zagreb", "Trešnjevka", "Maksimir"],
      "Split": ["Old Town", "Bačvice", "Marjan", "Meje", "Žnjan"],
      "Rijeka": ["Centre", "Sušak", "Trsat", "Pećine", "Kozala"],
      "Osijek": ["Centre", "Tvrđa", "Retfala", "Sjenjak", "Jug II"],
      "Zadar": ["Old Town", "Poluotok", "Diklo", "Borik", "Arbanasi"]
    }
  },
  "Cyprus": {
    cities: {
      "Nicosia": ["Old City", "Strovolos", "Engomi", "Aglandjia", "Latsia"],
      "Limassol": ["Centre", "Potamos Germasogeia", "Agios Athanasios", "Mesa Geitonia", "Zakaki"],
      "Larnaca": ["Centre", "Finikoudes", "Mackenzie", "Drosia", "Aradippou"],
      "Paphos": ["Centre", "Kato Paphos", "Universal", "Geroskipou", "Emba"],
      "Famagusta": ["Centre", "Varosha", "Salamis", "Bogazi", "Iskele"]
    }
  },
  "Czech Republic": {
    cities: {
      "Prague": ["Old Town", "New Town", "Malá Strana", "Vinohrady", "Žižkov"],
      "Brno": ["Centre", "Veveří", "Líšeň", "Bohunice", "Černá Pole"],
      "Ostrava": ["Centre", "Poruba", "Moravská Ostrava", "Vítkovice", "Zábřeh"],
      "Plzeň": ["Centre", "Bory", "Skvrňany", "Lochotín", "Doubravka"],
      "Liberec": ["Centre", "Rochlice", "Vratislavice", "Ruprechtice", "Janův Důl"]
    }
  },
  "Estonia": {
    cities: {
      "Tallinn": ["Old Town", "Kadriorg", "Pirita", "Mustamäe", "Kristiine"],
      "Tartu": ["Centre", "Ülejõe", "Supilinn", "Annelinn", "Ropka"],
      "Narva": ["Centre", "Soldina", "Pähklimäe", "Joaorg", "Kreenholm"],
      "Pärnu": ["Centre", "Beach", "Raeküla", "Rääma", "Vana-Pärnu"],
      "Kohtla-Järve": ["Centre", "Järve", "Ahtme", "Oru", "Sompa"]
    }
  },
  "Greece": {
    cities: {
      "Athens": ["Plaka", "Kolonaki", "Monastiraki", "Syntagma", "Glyfada"],
      "Thessaloniki": ["Centre", "Kalamaria", "Toumba", "Panorama", "Karabournaki"],
      "Patras": ["Centre", "Rio", "Paralia", "Agia Sofia", "Zavlani"],
      "Heraklion": ["Centre", "Old Town", "Nea Alikarnassos", "Ammoudara", "Knossos"],
      "Larissa": ["Centre", "Neapolis", "Agios Nikolaos", "Giannouli", "Alkazar"]
    }
  },
  "Hungary": {
    cities: {
      "Budapest": ["Pest Centre", "Buda", "Óbuda", "Zugló", "Újpest"],
      "Debrecen": ["Centre", "Újkert", "Tócóskert", "Csapókert", "Böszörményi út"],
      "Szeged": ["Centre", "Újszeged", "Móraváros", "Rókus", "Algyő"],
      "Miskolc": ["Centre", "Avas", "Diósgyőr", "Szirma", "Egyetemváros"],
      "Pécs": ["Centre", "Kertváros", "Málom", "Uránváros", "Meszes"]
    }
  },
  "Iceland": {
    cities: {
      "Reykjavík": ["Centre", "Laugardalur", "Breiðholt", "Árbær", "Grafarvogur"],
      "Kópavogur": ["Centre", "Salahverfi", "Smárahverfi", "Lindahverfi", "Digranesvegur"],
      "Hafnarfjörður": ["Centre", "Ásvellir", "Setberg", "Hrísalundur", "Víðistaðatún"],
      "Akureyri": ["Centre", "Naustahverfi", "Glerárhverfi", "Oddeyri", "Holt"],
      "Reykjanesbær": ["Centre", "Keflavík", "Njarðvík", "Hafnir", "Garður"]
    }
  },
  "Ireland": {
    cities: {
      "Dublin": ["City Centre", "Temple Bar", "Ballsbridge", "Rathmines", "Clontarf"],
      "Cork": ["City Centre", "Ballincollig", "Douglas", "Bishopstown", "Mahon"],
      "Limerick": ["City Centre", "Raheen", "Castletroy", "Dooradoyle", "Corbally"],
      "Galway": ["City Centre", "Salthill", "Renmore", "Newcastle", "Knocknacarra"],
      "Waterford": ["City Centre", "Ballybeg", "Lisduggan", "Gracedieu", "Kilbarry"]
    }
  },
  "Kosovo": {
    cities: {
      "Pristina": ["Centre", "Arbëria", "Dardania", "Ulpiana", "Sunny Hill"],
      "Prizren": ["Old Town", "Tusus", "Lakuriq", "Bajram Curri", "Marash"],
      "Peja": ["Centre", "Karagaq", "Vitomiricë", "Banjë", "Raushiq"],
      "Ferizaj": ["Centre", "Arbëria", "Dardania", "Qendra", "Magjistralja"],
      "Gjakova": ["Centre", "Çabrat", "Meja", "Ramadan Rexhepi", "Karaqeva"]
    }
  },
  "Latvia": {
    cities: {
      "Riga": ["Old Town", "Centre", "Teika", "Purvciems", "Ķengarags"],
      "Daugavpils": ["Centre", "Griva", "Jaunbuve", "Stroitele", "Ruģeļu"],
      "Liepāja": ["Centre", "Karosta", "Ezerkrasts", "Ziemelu priekšpilsēta", "Dienvidoosta"],
      "Jelgava": ["Centre", "Zemgales priekšpilsēta", "Miezīte", "Pārlielupe", "Rūpniecības"],
      "Jūrmala": ["Centre", "Majori", "Dzintari", "Bulduri", "Dubulti"]
    }
  },
  "Liechtenstein": {
    cities: {
      "Vaduz": ["Centre", "Egerta", "Drei Schwestern", "Mühleholz", "Rietacker"],
      "Schaan": ["Centre", "Duxgass", "Reberastrasse", "Lindenplatz", "Meierhofstrasse"],
      "Balzers": ["Centre", "Mäls", "Gutenberg", "Alte Landstrasse", "Iradug"],
      "Triesen": ["Centre", "Lawena", "Gnalp", "Masescha", "Profatscheng"],
      "Eschen": ["Centre", "Nendeln", "Gamprin", "Bendern", "Schellenberg"]
    }
  },
  "Lithuania": {
    cities: {
      "Vilnius": ["Old Town", "Žvėrynas", "Naujamiestis", "Antakalnis", "Senamiestis"],
      "Kaunas": ["Old Town", "Centre", "Žaliakalnis", "Šilainiai", "Aleksotas"],
      "Klaipėda": ["Old Town", "Centre", "Melnragė", "Smiltynė", "Giruliai"],
      "Šiauliai": ["Centre", "Gubernija", "Gytariai", "Lieporiai", "Rėkyva"],
      "Panevėžys": ["Centre", "Klaipėdos", "Respublikos", "Smėlynė", "Ekranas"]
    }
  },
  "Luxembourg": {
    cities: {
      "Luxembourg City": ["Centre", "Kirchberg", "Limpertsberg", "Bonnevoie", "Hollerich"],
      "Esch-sur-Alzette": ["Centre", "Lallange", "Raemerich", "Grenz", "Bruch"],
      "Differdange": ["Centre", "Fousbann", "Niederkorn", "Oberkorn", "Lasauvage"],
      "Dudelange": ["Centre", "Schmelz", "Burange", "Italie", "Brill"],
      "Ettelbruck": ["Centre", "Warken", "Grentzingen", "Erpeldange", "Schieren"]
    }
  },
  "Malta": {
    cities: {
      "Valletta": ["Centre", "Floriana", "Marsamxett", "Strait Street", "Republic Street"],
      "Birkirkara": ["Centre", "Old Railway", "Swatar", "Msida Road", "Ibragg"],
      "Sliema": ["Centre", "Ferries", "Tigne Point", "Tower Road", "Qui-Si-Sana"],
      "St. Paul's Bay": ["Centre", "Qawra", "Buġibba", "Xemxija", "Mistra Bay"],
      "Mosta": ["Centre", "Victoria Avenue", "Wied il-Għasel", "Misraħ Ġużeppi Callus", "Tarġa Gap"]
    }
  },
  "Moldova": {
    cities: {
      "Chișinău": ["Centre", "Botanica", "Buiucani", "Centru", "Ciocana"],
      "Tiraspol": ["Centre", "25 October", "Suvorov", "Kirov", "Lenin"],
      "Bălți": ["Centre", "Slobozia", "Molodova", "Dacia", "Independenței"],
      "Bender": ["Centre", "Proteagailovca", "Varnița", "Merenești", "Chiţcani"],
      "Cahul": ["Centre", "Cotihana", "Slobozia Mare", "Roșu", "Crihana Veche"]
    }
  },
  "Monaco": {
    cities: {
      "Monaco": ["Monte Carlo", "La Condamine", "Monaco-Ville", "Fontvieille", "Moneghetti"],
      "Monte Carlo": ["Centre", "Casino Square", "Port Hercules", "Larvotto", "Saint-Roman"],
      "La Condamine": ["Centre", "Port", "Market", "Place d'Armes", "Rue Grimaldi"],
      "Fontvieille": ["Centre", "Port", "Princess Grace Avenue", "Louis II Stadium", "Heliport"],
      "Moneghetti": ["Centre", "Avenue de Grande Bretagne", "Boulevard Rainier III", "Les Révoires", "Jardin Exotique"]
    }
  },
  "Montenegro": {
    cities: {
      "Podgorica": ["Centre", "Nova Varoš", "Stara Varoš", "Zabjelo", "Momišići"],
      "Nikšić": ["Centre", "Bulevar", "Waterfall", "Kruševac", "Kočani"],
      "Pljevlja": ["Centre", "Potrlica", "Gradina", "Meljak", "Stari Grad"],
      "Budva": ["Old Town", "Bečići", "Rafailovići", "Przno", "Sveti Stefan"],
      "Bar": ["Centre", "Port", "Stari Bar", "Sutomore", "Čanj"]
    }
  },
  "North Macedonia": {
    cities: {
      "Skopje": ["Centre", "Karpoš", "Čair", "Aerodrom", "Centar"],
      "Bitola": ["Centre", "Stara Čaršija", "Magnolia", "Kisela Voda", "Bukovo"],
      "Kumanovo": ["Centre", "Srednoselci", "Mlado Nagoričane", "Lipkovo", "Staro Nagoričane"],
      "Prilep": ["Centre", "Topolčani", "Varoš", "Bogomila", "Belovodica"],
      "Tetovo": ["Centre", "Šipkovica", "Tearce", "Džepčište", "Bogovinje"]
    }
  },
  "Poland": {
    cities: {
      "Warsaw": ["Śródmieście", "Mokotów", "Praga", "Żoliborz", "Wola"],
      "Kraków": ["Old Town", "Kazimierz", "Podgórze", "Nowa Huta", "Zwierzyniec"],
      "Wrocław": ["Old Town", "Krzyki", "Fabryczna", "Psie Pole", "Śródmieście"],
      "Poznań": ["Old Town", "Jeżyce", "Grunwald", "Wilda", "Nowe Miasto"],
      "Gdańsk": ["Old Town", "Wrzeszcz", "Oliwa", "Zaspa", "Siedlce"]
    }
  },
  "Portugal": {
    cities: {
      "Lisbon": ["Baixa", "Chiado", "Alfama", "Bairro Alto", "Belém"],
      "Porto": ["Ribeira", "Foz", "Boavista", "Cedofeita", "Campanhã"],
      "Braga": ["Centre", "São Vicente", "Maximinos", "Sé", "Cividade"],
      "Coimbra": ["Baixa", "Alta", "Celas", "Solum", "Santo António dos Olivais"],
      "Faro": ["Centre", "Marina", "São Pedro", "Montenegro", "Campina"]
    }
  },
  "Romania": {
    cities: {
      "Bucharest": ["Centre", "Lipscani", "Dorobanți", "Floreasca", "Pipera"],
      "Cluj-Napoca": ["Centre", "Mănăștur", "Grigorescu", "Zorilor", "Gheorgheni"],
      "Timișoara": ["Centre", "Iosefin", "Fabric", "Elisabetin", "Cetate"],
      "Iași": ["Centre", "Copou", "Nicolina", "Tătărași", "Podu Roș"],
      "Constanța": ["Centre", "Mamaia", "Tomis", "Faleza", "Peninsula"]
    }
  },
  "Russia": {
    cities: {
      "Moscow": ["Red Square", "Arbat", "Tverskaya", "Kitay-gorod", "Zamoskvorechye"],
      "Saint Petersburg": ["Nevsky", "Vasilyevsky Island", "Petrograd", "Admiralteysky", "Central"],
      "Novosibirsk": ["Centre", "Lenin", "Oktyabrsky", "Zheleznodorozhny", "Kirovsky"],
      "Yekaterinburg": ["Centre", "Verkh-Isetsky", "Chkalovsky", "Leninsky", "Kirovsk"],
      "Kazan": ["Centre", "Vakhitovsky", "Novo-Savinovsky", "Sovetsky", "Privolzhsky"]
    }
  },
  "San Marino": {
    cities: {
      "San Marino City": ["Centre", "Borgo Maggiore", "Murata", "Cailungo", "Fiorentino"],
      "Serravalle": ["Centre", "Dogana", "Falciano", "Rovereta", "Cà Melone"],
      "Borgo Maggiore": ["Centre", "Cailungo", "Valdragone", "San Giovanni", "Ventoso"],
      "Domagnano": ["Centre", "Torraccia", "Fiorina", "Piandavello", "Spaccio"],
      "Fiorentino": ["Centre", "Fiorentino Capoluogo", "Corianino", "Montalbo", "Monte Pulito"]
    }
  },
  "Serbia": {
    cities: {
      "Belgrade": ["Stari Grad", "Vračar", "Zemun", "Novi Beograd", "Savski Venac"],
      "Novi Sad": ["Centre", "Liman", "Grbavica", "Satelit", "Podbara"],
      "Niš": ["Centre", "Mediana", "Pantelej", "Crveni Krst", "Palilula"],
      "Kragujevac": ["Centre", "Pivara", "Stanovo", "Aerodrom", "Erdoglija"],
      "Subotica": ["Centre", "Prozivka", "Stari Grad", "Novi Grad", "Dudova Šuma"]
    }
  },
  "Slovakia": {
    cities: {
      "Bratislava": ["Old Town", "Petržalka", "Ružinov", "Nové Mesto", "Karlova Ves"],
      "Košice": ["Old Town", "Sídlisko KVP", "Terasa", "Dargovských hrdinov", "Nad jazerom"],
      "Prešov": ["Centre", "Sekčov", "Solivar", "Šidlovec", "Nižná Šebastová"],
      "Žilina": ["Centre", "Solinky", "Hliny", "Vlčince", "Hájik"],
      "Banská Bystrica": ["Centre", "Fončorda", "Sásová", "Uhlisko", "Kostiviarska"]
    }
  },
  "Slovenia": {
    cities: {
      "Ljubljana": ["Centre", "Trnovo", "Bežigrad", "Šiška", "Moste"],
      "Maribor": ["Centre", "Tabor", "Studenci", "Pobrežje", "Tezno"],
      "Celje": ["Centre", "Gaberje", "Lava", "Ostrožno", "Medlog"],
      "Kranj": ["Centre", "Primskovo", "Planina", "Golnik", "Bitnje"],
      "Koper": ["Centre", "Semedela", "Žusterna", "Škocjan", "Vanganel"]
    }
  },
  "Ukraine": {
    cities: {
      "Kyiv": ["Centre", "Podil", "Pechersk", "Obolon", "Poznyaky"],
      "Kharkiv": ["Centre", "Saltivka", "Pavlove Pole", "Kholodna Hora", "Osnovyansky"],
      "Odesa": ["Centre", "Arkadia", "Lanzheron", "Moldavanka", "Peresyp"],
      "Dnipro": ["Centre", "Soborny", "Amur", "Chechelivka", "Pivdennyi"],
      "Lviv": ["Old Town", "Sykhiv", "Frankivskyi", "Lychakiv", "Zaliznytsya"]
    }
  },
  "Vatican City": {
    cities: {
      "Vatican City": ["Saint Peter's", "Vatican Museums", "Vatican Gardens", "Sistine Chapel", "Apostolic Palace"]
    }
  }
};
