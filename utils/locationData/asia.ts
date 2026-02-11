/**
 * Asia Region Location Data
 * Additional Asian countries beyond the core set
 */

import { RegionalData } from './index';

export const asiaData: RegionalData = {
  "Japan": {
    cities: {
      "Tokyo": ["Shibuya", "Shinjuku", "Ginza", "Harajuku", "Akihabara", "Roppongi", "Asakusa"],
      "Osaka": ["Dotonbori", "Namba", "Umeda", "Tennoji", "Shinsekai", "Sumiyoshi"],
      "Kyoto": ["Gion", "Arashiyama", "Fushimi", "Higashiyama", "Kiyomizu", "Pontocho"],
      "Yokohama": ["Minato Mirai", "Chinatown", "Kohoku", "Kanazawa", "Tsurumi"],
      "Nagoya": ["Sakae", "Nagoya Station", "Osu", "Kanayama", "Chikusa"],
      "Sapporo": ["Susukino", "Odori", "Maruyama", "Sapporo Station", "Nakajima Park"],
      "Fukuoka": ["Tenjin", "Hakata", "Nakasu", "Daimyo", "Ohori"],
      "Kobe": ["Sannomiya", "Harborland", "Motomachi", "Kitano", "Rokko"],
      "Hiroshima": ["Hondori", "Peace Park", "Hiroshima Station", "Miyajima", "Eba"],
      "Sendai": ["Ichibancho", "Kokubuncho", "Sendai Station", "Aoba-ku", "Wakabayashi"]
    }
  },
  "China": {
    cities: {
      "Beijing": ["Dongcheng", "Xicheng", "Chaoyang", "Fengtai", "Haidian"],
      "Shanghai": ["Huangpu", "Pudong", "Xuhui", "Changning", "Jing'an"],
      "Guangzhou": ["Tianhe", "Yuexiu", "Liwan", "Haizhu", "Baiyun"],
      "Shenzhen": ["Futian", "Luohu", "Nanshan", "Yantian", "Baoan"],
      "Chengdu": ["Jinjiang", "Qingyang", "Jinniu", "Wuhou", "Chenghua"],
      "Hangzhou": ["Xihu", "Shangcheng", "Gongshu", "Xiaoshan", "Binjiang"],
      "Chongqing": ["Yuzhong", "Jiangbei", "Shapingba", "Nan'an", "Yubei"],
      "Wuhan": ["Wuchang", "Hankou", "Hanyang", "Hongshan", "Qiaokou"],
      "Xi'an": ["Beilin", "Lianhu", "Xincheng", "Yanta", "Baqiao"],
      "Nanjing": ["Xuanwu", "Qinhuai", "Jianye", "Gulou", "Pukou"]
    }
  },
  "India": {
    cities: {
      "Mumbai": ["South Mumbai", "Bandra", "Andheri", "Powai", "Thane"],
      "Delhi": ["Connaught Place", "Khan Market", "Karol Bagh", "Lajpat Nagar", "Greater Kailash"],
      "Bangalore": ["MG Road", "Koramangala", "Indiranagar", "Whitefield", "Electronic City"],
      "Hyderabad": ["Banjara Hills", "Jubilee Hills", "Gachibowli", "Hitech City", "Secunderabad"],
      "Ahmedabad": ["Navrangpura", "Satellite", "Vastrapur", "Maninagar", "Paldi"],
      "Chennai": ["T. Nagar", "Anna Nagar", "Adyar", "Velachery", "OMR"],
      "Kolkata": ["Park Street", "Salt Lake", "Ballygunge", "Alipore", "Howrah"],
      "Pune": ["Koregaon Park", "Hinjewadi", "Viman Nagar", "Kothrud", "Wakad"],
      "Jaipur": ["Pink City", "C-Scheme", "Vaishali Nagar", "Malviya Nagar", "Jagatpura"],
      "Lucknow": ["Hazratganj", "Gomti Nagar", "Aliganj", "Indira Nagar", "Alambagh"]
    }
  },
  "UAE": {
    cities: {
      "Dubai": ["Downtown", "Marina", "JBR", "Business Bay", "Jumeirah"],
      "Abu Dhabi": ["Downtown", "Corniche", "Yas Island", "Al Reem Island", "Saadiyat"],
      "Sharjah": ["City Centre", "Al Majaz", "Al Qasba", "University City", "Industrial Area"],
      "Ajman": ["City Centre", "Al Nuaimiya", "Al Rashidiya", "Industrial Area", "Corniche"],
      "Fujairah": ["City Centre", "Corniche", "Dibba", "Kalba", "Khor Fakkan"],
      "Ras Al Khaimah": ["Old Town", "Al Nakheel", "Al Hamra", "Mina Al Arab", "Al Marjan"],
      "Umm Al Quwain": ["Centre", "Old Town", "Falaj Al Mualla", "Al Ramlah", "Al Salam"]
    }
  },
  "Saudi Arabia": {
    cities: {
      "Riyadh": ["Olaya", "Malaz", "Diplomatic Quarter", "King Fahd District", "Al Nakheel"],
      "Jeddah": ["Al-Balad", "Corniche", "Al Hamra", "Al Rawdah", "Al Salamah"],
      "Mecca": ["Haram", "Ajyad", "Kudai", "Al Shubayqah", "Jabal Omar"],
      "Medina": ["Haram", "Quba", "Al Anbariyyah", "As Salam", "Al Haram"],
      "Dammam": ["Al Faisaliyah", "Al Badiyah", "Al Shati", "Al Manar", "Uhud"],
      "Khobar": ["Corniche", "Al Hamra", "Al Rakah", "Al Aqrabiyah", "Thuqbah"],
      "Taif": ["Centre", "Shubra", "Al Hawiya", "Al Khalidiyah", "Al Naseem"],
      "Tabuk": ["Centre", "King Fahd", "Al Muruj", "Zahrat", "Al Faisaliyah"],
      "Buraidah": ["Centre", "Al Mughrizat", "Al Iskan", "Az Zahra", "Al Wusayta"],
      "Khamis Mushait": ["Centre", "Al Muthallath", "King Fahd", "Umm Sabaa", "Al Khaldiyyah"]
    }
  },
  "South Korea": {
    cities: {
      "Seoul": ["Gangnam", "Itaewon", "Hongdae", "Myeongdong", "Insadong"],
      "Busan": ["Haeundae", "Seomyeon", "Gwangalli", "Nampo-dong", "Centum City"],
      "Incheon": ["Songdo", "Bupyeong", "Sinpo", "Yeonsu", "Namdong"],
      "Daegu": ["Dongseong-ro", "Suseong", "Duryu", "Dalseo", "Buk-gu"],
      "Daejeon": ["Dunsan", "Yuseong", "Eunhaeng", "Jung-gu", "Daedeok"]
    }
  },
  "Singapore": {
    cities: {
      "Singapore": ["Marina Bay", "Orchard Road", "Chinatown", "Little India", "Sentosa"]
    }
  },
  "Hong Kong": {
    cities: {
      "Hong Kong": ["Central", "Causeway Bay", "Tsim Sha Tsui", "Mong Kok", "Wan Chai"]
    }
  },
  "Thailand": {
    cities: {
      "Bangkok": ["Sukhumvit", "Silom", "Siam", "Sathorn", "Ratchada"],
      "Chiang Mai": ["Old City", "Nimmanhaemin", "Night Bazaar", "Riverside", "San Sai"],
      "Phuket": ["Patong", "Kata", "Karon", "Phuket Town", "Rawai"],
      "Pattaya": ["Central Pattaya", "North Pattaya", "South Pattaya", "Jomtien", "Naklua"],
      "Krabi": ["Ao Nang", "Railay", "Krabi Town", "Klong Muang", "Tub Kaek"]
    }
  },
  "Malaysia": {
    cities: {
      "Kuala Lumpur": ["KLCC", "Bukit Bintang", "Bangsar", "Mont Kiara", "Chow Kit"],
      "George Town": ["Georgetown", "Batu Ferringhi", "Tanjung Bungah", "Jelutong", "Bayan Lepas"],
      "Johor Bahru": ["City Centre", "Skudai", "Nusajaya", "Taman Johor Jaya", "Pasir Gudang"],
      "Ipoh": ["Old Town", "New Town", "Bercham", "Tambun", "Menglembu"],
      "Malacca": ["Jonker Street", "Portuguese Settlement", "Bandar Hilir", "Ayer Keroh", "Bukit Beruang"]
    }
  },
  "Indonesia": {
    cities: {
      "Jakarta": ["Central Jakarta", "South Jakarta", "West Jakarta", "North Jakarta", "East Jakarta"],
      "Surabaya": ["Pusat Kota", "Tunjungan", "Gubeng", "Darmo", "Rungkut"],
      "Bandung": ["Dago", "Cihampelas", "Braga", "Setia Budi", "Pasteur"],
      "Medan": ["Medan Petisah", "Medan Baru", "Medan Polonia", "Medan Area", "Medan Helvetia"],
      "Bali": ["Denpasar", "Kuta", "Seminyak", "Ubud", "Sanur"]
    }
  },
  "Philippines": {
    cities: {
      "Manila": ["Ermita", "Malate", "Intramuros", "Binondo", "Sta. Cruz"],
      "Quezon City": ["Diliman", "Cubao", "Eastwood", "Tandang Sora", "Commonwealth"],
      "Makati": ["Poblacion", "Salcedo", "Legaspi", "Urdaneta", "Bel-Air"],
      "Cebu": ["Cebu City", "Mandaue", "Lapu-Lapu", "Talisay", "Toledo"],
      "Davao": ["Poblacion", "Buhangin", "Toril", "Matina", "Agdao"]
    }
  },
  "Vietnam": {
    cities: {
      "Ho Chi Minh City": ["District 1", "District 3", "Phu Nhuan", "Binh Thanh", "District 7"],
      "Hanoi": ["Hoan Kiem", "Ba Dinh", "Dong Da", "Hai Ba Trung", "Tay Ho"],
      "Da Nang": ["Hai Chau", "Thanh Khe", "Son Tra", "Ngu Hanh Son", "Cam Le"],
      "Nha Trang": ["Loc Tho", "Phuoc Hai", "Phuoc Hoa", "Vinh Hai", "Vinh Hoa"],
      "Hoi An": ["Old Town", "An Hoi", "Cam Chau", "Cam Nam", "Tan An"]
    }
  },
  "Afghanistan": {
    cities: {
      "Kabul": ["Shahr-e Naw", "Wazir Akbar Khan", "Karte Parwan", "Khair Khana", "Pul-e-Charkhi"],
      "Kandahar": ["Old City", "Mirwais Mena", "Shahr-e-Naw", "Loya Wala", "Arghandab"],
      "Herat": ["Old City", "Injil", "Guzara", "Pashtun Zarghun", "Karukh"],
      "Mazar-i-Sharif": ["Centre", "Balkh", "Dehdadi", "Kholm", "Sholgara"],
      "Jalalabad": ["Centre", "Kama", "Behsud", "Surkhrod", "Rodat"]
    }
  },
  "Armenia": {
    cities: {
      "Yerevan": ["Centre", "Kentron", "Arabkir", "Shengavit", "Erebuni"],
      "Gyumri": ["Centre", "Kumayri", "Mush", "Vartanants", "Ani"],
      "Vanadzor": ["Centre", "Taron", "Tigranakert", "Lori", "Gugark"],
      "Vagharshapat": ["Centre", "Echmiadzin", "Zvartnots", "Shirak", "Armavir"],
      "Hrazdan": ["Centre", "Kotayk", "Arzni", "Meghradzor", "Tsaghkadzor"]
    }
  },
  "Azerbaijan": {
    cities: {
      "Baku": ["Centre", "Yasamal", "Nasimi", "Sabail", "Narimanov"],
      "Ganja": ["Centre", "Kapaz", "Nizami", "Khanlar", "Goranboy"],
      "Sumqayit": ["Centre", "Sumqayit City", "Aliyar", "Jorat", "Haji Zeynalabdin"],
      "Mingachevir": ["Centre", "Yevlakh", "Goychay", "Zaqatala", "Sheki"],
      "Lankaran": ["Centre", "Astara", "Lerik", "Masalli", "Yardimli"]
    }
  },
  "Bahrain": {
    cities: {
      "Manama": ["Centre", "Adliya", "Juffair", "Seef", "Sanabis"],
      "Muharraq": ["Centre", "Arad", "Hidd", "Samaheej", "Galali"],
      "Riffa": ["East Riffa", "West Riffa", "Hamala", "Dur", "Saar"],
      "Hamad Town": ["Centre", "Isa Town", "Tubli", "Sanad", "Jidhafs"],
      "A'ali": ["Centre", "Bilad Al Qadeem", "Zinj", "Karbabad", "Buri"]
    }
  },
  "Bangladesh": {
    cities: {
      "Dhaka": ["Gulshan", "Dhanmondi", "Mirpur", "Uttara", "Mohammadpur"],
      "Chittagong": ["Agrabad", "Panchlaish", "Khulshi", "Halishahar", "Nasirabad"],
      "Khulna": ["Khulna Sadar", "Sonadanga", "Daulatpur", "Khalishpur", "Khan Jahan Ali"],
      "Rajshahi": ["Boalia", "Rajpara", "Motihar", "Shaheb Bazar", "Uposhahar"],
      "Sylhet": ["Zindabazar", "Amberkhana", "Bandar Bazar", "Mira Bazar", "Chowhatta"]
    }
  },
  "Bhutan": {
    cities: {
      "Thimphu": ["Centre", "Motithang", "Changzamtok", "Changangkha", "Dechencholing"],
      "Phuentsholing": ["Centre", "Pasakha", "Samphelling", "Rinchending", "Dovan"],
      "Paro": ["Centre", "Bondey", "Shaba", "Doteng", "Lamgong"],
      "Punakha": ["Centre", "Wangdue", "Lobesa", "Toeb", "Guma"],
      "Jakar": ["Centre", "Bumthang", "Chokhor", "Tang", "Ura"]
    }
  },
  "Brunei": {
    cities: {
      "Bandar Seri Begawan": ["Centre", "Gadong", "Kianggeh", "Kota Batu", "Kiulap"],
      "Kuala Belait": ["Centre", "Seria", "Lumut", "Labi", "Sukang"],
      "Tutong": ["Centre", "Pekan Tutong", "Lamunin", "Kiudang", "Rambai"],
      "Temburong": ["Bangar", "Batang Duri", "Bokok", "Labu", "Batu Apoi"],
      "Muara": ["Centre", "Serasa", "Sengkurong", "Mentiri", "Pengkalan Batu"]
    }
  },
  "Cambodia": {
    cities: {
      "Phnom Penh": ["Daun Penh", "Chamkarmon", "7 Makara", "Toul Kork", "Russey Keo"],
      "Siem Reap": ["Centre", "Svay Dangkum", "Sala Kamreuk", "Srangae", "Kokchak"],
      "Battambang": ["Centre", "Wat Kor", "Prek Mohatep", "Chamkar Samraong", "Svay Por"],
      "Sihanoukville": ["Centre", "Otres", "Serendipity", "Victory Beach", "Sokha Beach"],
      "Kampong Cham": ["Centre", "Vihear Suor", "Tbong Khmum", "Memot", "Ponhea Kraek"]
    }
  },
  "East Timor": {
    cities: {
      "Dili": ["Comoro", "Dom Aleixo", "Nain Feto", "Vera Cruz", "Cristo Rei"],
      "Baucau": ["Centre", "Venilale", "Baguia", "Vemasse", "Laga"],
      "Maliana": ["Centre", "Bobonaro", "Cailaco", "Balibo", "Atabae"],
      "Suai": ["Centre", "Cova Lima", "Fatumean", "Fatululic", "Fohorem"],
      "Aileu": ["Centre", "Remexio", "Laulara", "Liquidoe", "Maubara"]
    }
  },
  "Georgia": {
    cities: {
      "Tbilisi": ["Old Town", "Vake", "Saburtalo", "Didube", "Isani"],
      "Batumi": ["Centre", "Old Boulevard", "New Boulevard", "Khelvachauri", "Makhinjauri"],
      "Kutaisi": ["Centre", "Rioni", "Ukimerioni", "Tskaltubo", "Baghdati"],
      "Rustavi": ["Centre", "Metallurgist", "Gardabani", "Tsalka", "Marneuli"],
      "Gori": ["Centre", "Gori Fortress", "Uplistsikhe", "Kaspi", "Kareli"]
    }
  },
  "Iran": {
    cities: {
      "Tehran": ["Shemiran", "Yousefabad", "Vanak", "Tajrish", "Sadeghieh"],
      "Mashhad": ["Centre", "Koohsangi", "Vakilabad", "Azadi", "Ahmadabad"],
      "Isfahan": ["Naghsh-e Jahan", "Jolfa", "Khaju", "Shahrestan", "Baharestan"],
      "Shiraz": ["Eram", "Vakilabad", "Quran Gate", "Zandieh", "Saadi"],
      "Tabriz": ["Khiyaban", "Valiasr", "Shahid Madani", "Baghmisheh", "El Goli"]
    }
  },
  "Iraq": {
    cities: {
      "Baghdad": ["Karrada", "Mansour", "Adhamiyah", "Sadr City", "Kadhimiya"],
      "Basra": ["Centre", "Ashar", "Margil", "Zubair", "Abu Al Khaseeb"],
      "Mosul": ["Old City", "Al Zohour", "Al Karama", "Al Qahira", "Al Wahda"],
      "Erbil": ["Citadel", "Ankawa", "Gulan", "Sami Abdulrahman", "60 Meter"],
      "Najaf": ["Old City", "Mishrag", "Adala", "Kufa", "Al Hurr"]
    }
  },
  "Israel": {
    cities: {
      "Tel Aviv": ["Centre", "Neve Tzedek", "Jaffa", "Ramat Aviv", "Florentin"],
      "Jerusalem": ["Old City", "Mahane Yehuda", "Talpiot", "Givat Shaul", "Nachlaot"],
      "Haifa": ["German Colony", "Carmel Centre", "Bat Galim", "Hadar", "Neve Sha'anan"],
      "Be'er Sheva": ["Old City", "Neve Noy", "Ramot", "Nahal Ashan", "Givat Asaf"],
      "Eilat": ["Centre", "Coral Beach", "North Beach", "City Centre", "Mitzpe Ramon"]
    }
  },
  "Jordan": {
    cities: {
      "Amman": ["Downtown", "Abdoun", "Sweifieh", "Jabal Amman", "Shmeisani"],
      "Zarqa": ["Centre", "Zarqa Camp", "New Zarqa", "Russaifa", "Azraq"],
      "Irbid": ["Centre", "University Street", "Al Hashmi", "Al Quds", "Ramtha"],
      "Aqaba": ["Centre", "South Beach", "Port", "Ayla", "Tala Bay"],
      "Madaba": ["Centre", "Madaba Plains", "Mount Nebo", "Ma'in", "Mukawir"]
    }
  },
  "Kazakhstan": {
    cities: {
      "Almaty": ["Medeu", "Samal", "Bostandyk", "Alatau", "Auezov"],
      "Nur-Sultan": ["Centre", "Esil", "Saryarka", "Baikonur", "Almaly"],
      "Shymkent": ["Centre", "Karatau", "Abai", "Al-Farabi", "Enbekshi"],
      "Aktobe": ["Centre", "Batys", "Shygysy", "Astrakhanka", "Zhilgorodok"],
      "Karaganda": ["Centre", "Kazybek Bi", "Oktyabrsky", "Prishakhtinskiy", "Majalinskiy"]
    }
  },
  "Kuwait": {
    cities: {
      "Kuwait City": ["Centre", "Salmiya", "Hawally", "Jabriya", "Fahaheel"],
      "Hawalli": ["Centre", "Salmiya", "Rumaithiya", "Bayan", "Mishref"],
      "Farwaniya": ["Centre", "Jleeb Al-Shuyoukh", "Ardiya", "Khaitan", "Rabiya"],
      "Ahmadi": ["Centre", "Fahaheel", "Mangaf", "Mahboula", "Fintas"],
      "Jahra": ["Centre", "Qasr", "Sulaibiya", "Naeem", "Oyoun"]
    }
  },
  "Kyrgyzstan": {
    cities: {
      "Bishkek": ["Centre", "Panfilov", "Asanbai", "Vostok-5", "Ak-Orgo"],
      "Osh": ["Centre", "Alymbek Datka", "Sulaiman-Too", "Kyzyl-Kyshtak", "Osh-Batken"],
      "Jalal-Abad": ["Centre", "Manas", "Kara-Kul", "Bazar-Korgon", "Suzak"],
      "Karakol": ["Centre", "Pristan-Przheval'sk", "Karakol Bazar", "Teploklyuchenka", "Ak-Suu"],
      "Tokmok": ["Centre", "Kant", "Kemin", "Ivanovka", "Orlovka"]
    }
  },
  "Laos": {
    cities: {
      "Vientiane": ["Centre", "Chanthabouly", "Sisattanak", "Xaysettha", "Sikhottabong"],
      "Luang Prabang": ["Old Town", "Ban Wat That", "Ban Visoun", "Xiengthong", "Phousi"],
      "Pakse": ["Centre", "Champassak", "Paksong", "Bachiangchaleunsouk", "Sanasomboun"],
      "Savannakhet": ["Centre", "Kaysone Phomvihane", "Outhoumphone", "Atsaphangthong", "Songkhone"],
      "Thakhek": ["Centre", "Mahaxai", "Hinboun", "Nong Bok", "Xebangfai"]
    }
  },
  "Lebanon": {
    cities: {
      "Beirut": ["Hamra", "Achrafieh", "Verdun", "Ras Beirut", "Mar Mikhael"],
      "Tripoli": ["Centre", "Mina", "Bab al-Tabbaneh", "Qobbe", "Abu Samra"],
      "Sidon": ["Old City", "Ein el-Hilweh", "Haret Saida", "Miyeh ou Miyeh", "Maghdouche"],
      "Tyre": ["Centre", "Rashidieh", "Bourj el-Shamali", "El Bass", "Qana"],
      "Jounieh": ["Centre", "Kaslik", "Sahel Alma", "Sarba", "Haret Sakher"]
    }
  },
  "Maldives": {
    cities: {
      "Malé": ["Centre", "Henveiru", "Galolhu", "Maafannu", "Machchangolhi"],
      "Addu City": ["Centre", "Hithadhoo", "Maradhoo", "Feydhoo", "Hulhudhoo"],
      "Fuvahmulah": ["Centre", "Dhadimagu", "Dhiguvaandu", "Hoadhandu", "Maalegan"],
      "Kulhudhuffushi": ["Centre", "Thiladhoo", "Alifushi", "Dharavandhoo", "Eydhafushi"],
      "Hithadhoo": ["Centre", "Gan", "Maradhoo-Feydhoo", "Hulhudhoo-Meedhoo", "Meedhoo"]
    }
  },
  "Mongolia": {
    cities: {
      "Ulaanbaatar": ["Sukhbaatar", "Khan-Uul", "Bayanzurkh", "Chingeltei", "Songinokhairkhan"],
      "Erdenet": ["Centre", "Bayan-Undur", "Orkhon", "Jargalant", "Dzuunbayan-Ulaan"],
      "Darkhan": ["Centre", "Darkhan-Uul", "Sharyngol", "Orkhon", "Khongor"],
      "Choibalsan": ["Centre", "Dornod", "Khalkhgol", "Chuluunkhoroot", "Dashbalbar"],
      "Khovd": ["Centre", "Buyant", "Jargalan", "Khovd Soum", "Duut"]
    }
  },
  "Myanmar": {
    cities: {
      "Yangon": ["Downtown", "Sanchaung", "Bahan", "Kamayut", "Hlaing"],
      "Mandalay": ["Centre", "Aungmyethazan", "Chanayethazan", "Mahaaungmyay", "Amarapura"],
      "Naypyidaw": ["Centre", "Zabuthiri", "Ottarathiri", "Dekkhina Thiri", "Pobbathiri"],
      "Mawlamyine": ["Centre", "Mottama", "Kyaikmaraw", "Mudon", "Thanbyuzayat"],
      "Bago": ["Centre", "Waw", "Thanatpin", "Kawa", "Nyaunglebin"]
    }
  },
  "Nepal": {
    cities: {
      "Kathmandu": ["Thamel", "Patan", "Bhaktapur", "Kirtipur", "Budhanilkantha"],
      "Pokhara": ["Lakeside", "Prithvi Chowk", "Baidam", "Chipledhunga", "Ramghat"],
      "Lalitpur": ["Patan Durbar", "Pulchowk", "Jawalakhel", "Mangal Bazaar", "Kupandole"],
      "Bharatpur": ["Centre", "Narayangadh", "Ratnanagar", "Khairahani", "Madi"],
      "Biratnagar": ["Centre", "Morang", "Koshi", "Rani", "Tarahara"]
    }
  },
  "North Korea": {
    cities: {
      "Pyongyang": ["Chung-guyok", "Moranbong", "Potonggang", "Sosong", "Taesong"],
      "Hamhung": ["Centre", "Majon", "Sinhung", "Hungnam", "Hamju"],
      "Chongjin": ["Centre", "Sunam", "Ranam", "Songpyong", "Hoeryong"],
      "Nampo": ["Centre", "Kangso", "Ryonggang", "Onchon", "Taean"],
      "Wonsan": ["Centre", "Kalma", "Songdowon", "Myongsasimni", "Thongchon"]
    }
  },
  "Oman": {
    cities: {
      "Muscat": ["Mutrah", "Ruwi", "Qurum", "Al Khuwair", "Bausher"],
      "Salalah": ["Centre", "Al Hafa", "Taqah", "Mughsail", "Raysut"],
      "Sohar": ["Centre", "Liwa", "Shinas", "Saham", "Al Khaboura"],
      "Nizwa": ["Centre", "Bahla", "Izki", "Birkat Al Mouz", "Al Hamra"],
      "Sur": ["Centre", "Qalhat", "Bilad Sur", "Al Ayjah", "Ras Al Had"]
    }
  },
  "Pakistan": {
    cities: {
      "Karachi": ["Clifton", "Defence", "Saddar", "Gulshan-e-Iqbal", "North Nazimabad"],
      "Lahore": ["Gulberg", "Model Town", "DHA", "Johar Town", "Faisal Town"],
      "Islamabad": ["F-6", "F-7", "F-8", "G-6", "Blue Area"],
      "Rawalpindi": ["Saddar", "Raja Bazaar", "Satellite Town", "Bahria Town", "Chaklala"],
      "Faisalabad": ["Lyallpur Town", "Jinnah Town", "Civil Lines", "Madina Town", "Iqbal Town"]
    }
  },
  "Palestine": {
    cities: {
      "Gaza": ["Old City", "Rimal", "Zeitoun", "Shuja'iyya", "Tal al-Hawa"],
      "Ramallah": ["Centre", "Al-Masyoun", "Al-Tireh", "Beitunia", "Ein Munjed"],
      "Hebron": ["Old City", "Haret Jaber", "Beit Einun", "Dura", "Sa'ir"],
      "Nablus": ["Old City", "Rafidia", "Askar Camp", "Balata", "Ein Beit El Ma"],
      "Bethlehem": ["Old City", "Beit Jala", "Beit Sahour", "Al-Khader", "Aida Camp"]
    }
  },
  "Qatar": {
    cities: {
      "Doha": ["West Bay", "The Pearl", "Al Sadd", "Al Dafna", "Msheireb"],
      "Al Wakrah": ["Centre", "Al Wukair", "Mesaieed", "Al Khor", "Al Ghuwariyah"],
      "Al Rayyan": ["Centre", "Education City", "Al Aziziya", "Luqta", "Umm Slal"],
      "Al Khor": ["Centre", "Al Thakhira", "Al Ghariya", "Simaisma", "Al Khawr"],
      "Dukhan": ["Centre", "West Coast", "Dukhan Beach", "Salwa", "Shahaniya"]
    }
  },
  "Sri Lanka": {
    cities: {
      "Colombo": ["Fort", "Pettah", "Cinnamon Gardens", "Bambalapitiya", "Dehiwala"],
      "Kandy": ["Centre", "Peradeniya", "Katugastota", "Gampola", "Akurana"],
      "Galle": ["Fort", "Unawatuna", "Hikkaduwa", "Ambalangoda", "Bentota"],
      "Jaffna": ["Centre", "Nallur", "Chavakachcheri", "Point Pedro", "Karainagar"],
      "Negombo": ["Centre", "Katunayake", "Wattala", "Ja-Ela", "Seeduwa"]
    }
  },
  "Syria": {
    cities: {
      "Damascus": ["Old City", "Mazzeh", "Abu Rummaneh", "Yarmouk", "Kafr Sousa"],
      "Aleppo": ["Old City", "Aziziyeh", "Sulaymaniyah", "Salaheddine", "Sheikh Maqsoud"],
      "Homs": ["Centre", "Bab Tadmur", "Khaldiyeh", "Inshaat", "Jouret al-Shayah"],
      "Latakia": ["Centre", "Raml al-Janoubi", "Raml al-Shamali", "Sleibeh", "Mashrou Zera'i"],
      "Hama": ["Centre", "Alawyin", "Al-Hamidiyah", "Al-Qusour", "Bab Qebli"]
    }
  },
  "Taiwan": {
    cities: {
      "Taipei": ["Xinyi", "Da'an", "Zhongzheng", "Wanhua", "Beitou"],
      "Kaohsiung": ["Lingya", "Qianzhen", "Zuoying", "Fengshan", "Sanmin"],
      "Taichung": ["West", "Central", "North", "South", "Xitun"],
      "Tainan": ["Anping", "Central West", "East", "North", "South"],
      "Hsinchu": ["East", "North", "Xiangshan", "Science Park", "Downtown"]
    }
  },
  "Tajikistan": {
    cities: {
      "Dushanbe": ["Centre", "Ismoil Somoni", "Firdavsi", "Sino", "Shohmansur"],
      "Khujand": ["Centre", "Ghafurov", "Kanibadam", "Istaravshan", "Spitamen"],
      "Kulob": ["Centre", "Vose", "Farkhor", "Hamadoni", "Muminobod"],
      "Qurghonteppa": ["Centre", "Bokhtar", "Jomi", "Sarband", "Vakhsh"],
      "Khorog": ["Centre", "Ishkoshim", "Murghab", "Rushan", "Shughnon"]
    }
  },
  "Turkmenistan": {
    cities: {
      "Ashgabat": ["Centre", "Choganly", "Kopetdag", "Berkararlyk", "Parahat"],
      "Turkmenbashi": ["Centre", "Port", "Hazar", "Balkan", "Esenguly"],
      "Dashoguz": ["Centre", "Koneurgench", "Boldumsaz", "Akdepe", "Ruhubelent"],
      "Mary": ["Centre", "Bayramaly", "Murghab", "Serhetabat", "Iolotan"],
      "Turkmenabat": ["Centre", "Farap", "Sayat", "Seydi", "Hojambaz"]
    }
  },
  "Uzbekistan": {
    cities: {
      "Tashkent": ["Yunusabad", "Mirzo Ulugbek", "Shaykhontohur", "Chilonzor", "Yashnobod"],
      "Samarkand": ["Centre", "Registan", "Afrosiab", "Koni-Gil", "Urgut"],
      "Bukhara": ["Old City", "Lyab-i Hauz", "Ark", "Po-i-Kalyan", "Chor Minor"],
      "Andijan": ["Centre", "Asaka", "Markhamat", "Baliqchi", "Jalaquduq"],
      "Namangan": ["Centre", "Uychi", "Chust", "Mingbulak", "Pop"]
    }
  },
  "Yemen": {
    cities: {
      "Sana'a": ["Old City", "Hadda", "Al Tahrir", "Al Qasr", "Shu'ub"],
      "Aden": ["Crater", "Tawahi", "Mualla", "Sheikh Othman", "Al Mansoura"],
      "Taiz": ["Centre", "Cairo", "Mudhaffar", "Salh", "Al Qahira"],
      "Hodeidah": ["Centre", "Al Hawak", "Al Mina", "Al Hali", "Zabid"],
      "Ibb": ["Centre", "Jiblah", "Yarim", "Dhamar", "Rada'"]
    }
  }
};
