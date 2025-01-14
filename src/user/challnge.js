class GeometricSequence {
    constructor(firstTerm, ratio) {
        this.firstTerm = firstTerm; 
        this.ratio = ratio;        
    }

    getNthTerm(n) {
        if (n < 1) {
            throw new Error("Index must be 1 or greater.");
        }
        return this.firstTerm * Math.pow(this.ratio, n - 1);
    }
}

const sequence = new GeometricSequence(2, 3); 

const n = 125; 
const nthTerm = sequence.getNthTerm(n);

console.log(`Suku ke-${n} adalah: ${nthTerm}`);

