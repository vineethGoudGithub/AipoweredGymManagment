
const fs = require('fs');
const path = require('path');

const gyms = [
    { name: "Pro Fitness Gym", rating: 4.2, address: "R, 6, Rd Number 1B, Sai Ram Nagar Colony, Venkatadri Twp, Chowdhariguda, Hyderabad, Telangana 500088", lat: 17.414520975542832, lng: 78.63917617820282, reviews: 129, postal: "500088" },
    { name: "Fusion Fitness Unisex Gym", rating: 4.6, address: "Korremula Rd, Chowdhariguda, Hyderabad, Telangana 500088", lat: 17.41501513650799, lng: 78.63821089263284, reviews: 252, postal: "500088" },
    { name: "Melwyn's Fitness Studio 3", rating: 4.7, address: "H.No; 6-182, OU colony, Korremula Rd, Narapally, Hyderabad, Telangana 500088", lat: 17.415260825477976, lng: 78.63784611220157, reviews: 81, postal: "500088" },
    { name: "K5 Fitness Planet", rating: 5.0, address: "CJVQ+FWH, Pocharam, Secunderabad, Telangana 500088", lat: 17.444469862590914, lng: 78.63943052900476, reviews: 43, postal: "500088" },
    { name: "Best Gym", rating: 4.6, address: "Pocharam, Secunderabad, Telangana 500088", lat: 17.443276708260573, lng: 78.64926217168916, reviews: 29, postal: "500088" },
    { name: "Melwyn's Fitness Studio 2", rating: 4.8, address: "Flyover, Annojiguda, Ghatkesar Mandal, 4-85, Hyderabad - Warangal Hwy, beside Annojiguda, Hyderabad, Telangana 500088", lat: 17.436702026524728, lng: 78.65568401633054, reviews: 56, postal: "500088" },
    { name: "S3 Fitness Gym", rating: 4.9, address: "Plot No.3, PJS Colony Rd, Chowdhariguda, Ghatkesar, Hyderabad, Telangana 500088", lat: 17.420514048355013, lng: 78.64750684994333, reviews: 115, postal: "500088" },
    { name: "FATBOY Fitness club", rating: 4.4, address: "138, Annojiguda, Hyderabad, Secunderabad, Telangana 500008", lat: 17.43783259685383, lng: 78.66219440504663, reviews: 36, postal: "500008" },
    { name: "AVN Fitness Studio", rating: 4.9, address: "CMM8+X7G, Unnamed Road, Annojiguda, Badesahebguda, Telangana 500088", lat: 17.43539143105226, lng: 78.66612996176914, reviews: 49, postal: "500088" },
    { name: "R FITNESS GYM and fitness center", rating: 4.9, address: "Jaysree Arcade, 5th floorfloor, opp. hp petrol pump, Peerzadiguda, Hyderabad, Telangana 500098", lat: 17.39843267633939, lng: 78.59020658335174, reviews: 139, postal: "500098" },
    { name: "Shadow Fitness Gym", rating: 4.8, address: "Parvathapur, Peerzadiguda, Hyderabad, Telangana 500098", lat: 17.393220275883994, lng: 78.60756434154013, reviews: 89, postal: "500098" },
    { name: "Fitonze - Best Gym In Hyderabad", rating: 5.0, address: "Plot No, 471 & 472, Rd Number 10, Sai Aishwarya Layout, Parvathapur, Peerzadiguda, Hyderabad, Telangana 500098", lat: 17.402023354755848, lng: 78.60950646830156, reviews: 362, postal: "500098" },
    { name: "Liger Fitness", rating: 4.9, address: "Panchavati colony, Rd Number 2, Medipally, Peerzadiguda, Telangana 500098", lat: 17.408857031622087, lng: 78.60695742692718, reviews: 149, postal: "500098" },
    { name: "DVIJA Fitness", rating: 4.7, address: "MLR colony, Near Boduppal, Chengicherla, Hyderabad, Secunderabad, Telangana 500092", lat: 17.433856477083676, lng: 78.60600682559276, reviews: 171, postal: "500092" },
    { name: "Built fitness Gym", rating: 4.8, address: "Plot no.19 2nd floor, above SBI bank, Rampally, Telangana 501302", lat: 17.472157999374577, lng: 78.64405921117385, reviews: 220, postal: "501302" },
    { name: "4Fit Fitness gym Ghatkesar (Unisex)", rating: 4.8, address: "Plot no :521, Groud Floor, Ghatkesar Bus Stop, Ghatkesar Rd, near Jagdamba Theater, beside EWS Colony, Balaji Nagar, Ghatkesar, Telangana 501301", lat: 17.46281108093156, lng: 78.68937849740207, reviews: 277, postal: "501301" },
    { name: "in.fit GYM", rating: 4.9, address: "CMP2+PF4, Pocharam, Secunderabad, Telangana 500088", lat: 17.436248980748307, lng: 78.66270878773372, reviews: 17, postal: "500088" }
];

async function run() {
    const csvPath = 'x:\\gym_spring_boot\\frontend\\Outscraper-20260306142950s9d_gym.csv';
    
    // 1. Append to CSV
    console.log('Appending to CSV...');
    for (const gym of gyms) {
        const row = `\n"manual_add",${gym.name},${gym.name},Gym,,Gym,,,"${gym.address}",,,,,,${gym.postal},India,IN,${gym.lat},${gym.lng},,,,,${gym.rating},${gym.reviews},,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`;
        fs.appendFileSync(csvPath, row);
    }
    console.log('Appended to CSV.');

    // 2. Post to API
    console.log('\nPosting to API...');
    for (const gym of gyms) {
        try {
            const response = await fetch('http://localhost:8080/api/gyms', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: gym.name,
                    lat: gym.lat,
                    lng: gym.lng,
                    address: gym.address,
                    rating: gym.rating,
                    openNow: true,
                    trainer: "Unknown"
                })
            });
            console.log(`Added ${gym.name}: ${response.status}`);
        } catch (e) {
            console.error(`Error adding ${gym.name}: ${e.message}`);
        }
    }
    console.log('\nAll done!');
}

run();
