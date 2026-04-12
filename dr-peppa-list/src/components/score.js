const numDigits = 2; // Sets the number of digits to round to

const roundMultiplier = Math.pow(10, numDigits);

const maxPoints = 150; // Points awarded for beating the #1 rank

let minRank;
fetch('../../list/_list.json')
    .then(resp => resp.json())
    .then(list => minRank = list.length);




export function calculateScore(rank, percent) {

    let curveConstant = Math.pow((1/maxPoints), (1/(minRank - 1))); // Defines how curved the score graph is based on max points and min rank, this will flatten as more levels are added
 
    let score = maxPoints * Math.pow(curveConstant, (rank - 1)); // This is the score for getting 100% on a level


    // This reassigns score if the percent isn't 100, it gives 1/10 of the max points for the minimum percentage (50) and 1/4 of the max points for 99
    if (percent != 100) {
        score = ((1 / 10) * score) * Math.pow((10 / 4), ((percent - 50) / 49));
    }

    return Math.round(score * roundMultiplier) / roundMultiplier;
}

export function calculateMaxScore(rank) {

    let curveConstant = Math.pow((1/maxPoints), (1/(minRank - 1)));
    let score = maxPoints * Math.pow(curveConstant, (rank - 1));
    return Math.round(score * roundMultiplier) / roundMultiplier;
}
