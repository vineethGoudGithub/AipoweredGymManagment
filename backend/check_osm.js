
async function checkOSM() {
    const query = `
        [out:json][timeout:25];
        area["name"="Hyderabad"]->.searchArea;
        (
          node["leisure"="fitness_centre"](area.searchArea);
          way["leisure"="fitness_centre"](area.searchArea);
          node["leisure"="gym"](area.searchArea);
          way["leisure"="gym"](area.searchArea);
        );
        out center;
    `;
    try {
        const response = await fetch('https://overpass-api.de/api/interpreter', {
            method: 'POST',
            body: query
        });
        const data = await response.json();
        console.log(`Found ${data.elements.length} gyms in Hyderabad via OpenStreetMap.`);
        
        // Sample some areas
        const areas = {};
        data.elements.forEach(e => {
            const addr = e.tags?.["addr:postcode"] || "Unknown";
            areas[addr] = (areas[addr] || 0) + 1;
        });
        console.log('Sample counts by postcode:', Object.entries(areas).slice(0, 10));
    } catch (e) {
        console.error('Error fetching from OSM:', e.message);
    }
}
checkOSM();
