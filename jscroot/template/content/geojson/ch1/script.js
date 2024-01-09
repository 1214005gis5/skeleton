export function main() {
    function processFeatureRow(table, feature) {
        const row = table.insertRow();
        const nameCell = row.insertCell(0);
        const coordinatesCell = row.insertCell(1);
        const typeCell = row.insertCell(2);

        nameCell.innerText = feature.properties.name;
        coordinatesCell.innerText = JSON.stringify(feature.geometry.coordinates);
        typeCell.innerText = feature.geometry.type;
    }

    const pointTable = document.getElementById("pointTable").getElementsByTagName('tbody')[0];
    const polygonTable = document.getElementById("polygonTable").getElementsByTagName('tbody')[0];
    const polylineTable = document.getElementById("polylineTable").getElementsByTagName('tbody')[0];

    fetch("https://raw.githubusercontent.com/raffzhm/geogis-semester5/main/Chapter2/map.json")
        .then(response => response.json())
        .then(data => {
            data.features.forEach(feature => {
                if (feature.geometry.type === "Point") {
                    processFeatureRow(pointTable, feature);
                } else if (feature.geometry.type === "Polygon") {
                    processFeatureRow(polygonTable, feature);
                } else if (feature.geometry.type === "LineString") {
                    processFeatureRow(polylineTable, feature);
                }
            });
        })
        .catch(error => console.error("Terjadi kesalahan:", error));
}
