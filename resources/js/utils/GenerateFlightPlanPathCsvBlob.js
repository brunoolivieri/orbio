export function generateFlightPlanPathCsvBlob(contents) {

    // ==== CONTEÚDO DO ARQUIVO DE ROTA ==== //
    let content = "latitude;longitude;altitude(m)\n";

    // Quebrando as linhas do arquivo em um array
    let lines = contents.split("\n");

    // Quebrando todas as linhas nos espaços \t
    let line = "";
    for (let i = 4; i < lines.length - 2; i++) {
        line = lines[i].split("\t");
        if (Number(line[3]) == 16) {
            // As posições de latitude, longitude e altitude estão nos índices 8, 9 e 10 de cada linha
            content += line[8] + ";" + line[9] + ";" + line[10] + "\n";
        }
    }

    var blob = new Blob([content],
        { type: "text/plain;charset=utf-8" });

    return blob;

}