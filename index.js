/**
 * An extension of Set meant for checking similarity of strings. Also offers static functions that can be used seperately from the SimilaritySet.
 * 
 * This is basically a continuation of the `string-similarity` package made by aceakash. Saw it was deprecated so decided to start a new module. Credits go to them for the dice's coefficient handler.
 * 
 * @author Damian McClure
 */

 class SimilaritySet extends Set {
    /**
     * Constructor for new SimilaritySet
     * @param {any} iterable Can pass any kind of iterable element and the set will be constructed with those elements.
     */
    constructor(iterable){
        super(iterable);
    }

    /** 
     * Check if the Set has anything similar to the needle up to the provided threshold.
     * @param {string} needle The string to check if the Set has anything similar to.
     * @param {number} threshold The threshold that the string must be similar by to count.
     * @param {boolean} includeExact If exact matches should be checked, true by default.
     * @returns {boolean} If the Set has anything similar given the threshold.
     */
    hasSimilar(needle, threshold, includeExact = true){
        for(const element of this){
            if(!element){
                continue;
            }

            if(includeExact && element === needle){
                return true;
            }

            const similarity = SimilaritySet.compareString(element, needle);
            if(similarity > threshold){
                return true;
            }
        }
        return false;
    }

    /** 
     * Get all scores of similarity to the needle provided.
     * @param {string} needle The string to get similarity scores for.
     * @param {"dice"|"levenshtein"|"jaccard"} algorithm The algorithm to get the scores by.
     * @returns {Array<{haystack: string, similarity: number}>} Returns an array of all the elements and their scores.
     */
    getSimilar(needle, algorithm = "dice"){
        const ret = [];
        for(const element of this){
            ret.push({
                haystack: element,
                similarity: SimilaritySet.compareString(element, needle, algorithm)
            });
        }
        return ret;
    }

    /** 
     * Check if some of the elements match a condition in the Set.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the return value is true or false.
     * @param {SimilaritySet?} thisArg An optional argument to provide a different Set.
     * @returns {boolean} If some of the elements matched the conditions return.
     */
    some(callbackFn, thisArg = null){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.some: callback was not typeof function");
        }

        const ctx = thisArg instanceof SimilaritySet ? thisArg : this;

        let i = 0;
        for(const element of ctx){
            if(callbackFn(element, i, ctx)){
                return true;
            }
            i++
        }
        return false;
    }

    /** 
     * Check if some of the elements match a condition in the Set.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the return value is true or false.
     * @param {SimilaritySet} thisArg A required argument to provide the Set.
     * @returns {boolean} If some of the elements matched the conditions return.
     */
    static some(callbackFn, thisArg){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.some: callback was not typeof function");
        }

        if(!(thisArg instanceof SimilaritySet)){
            throw new Error("SimilaritySet.some: thisArg was not instanceof SimilaritySet");
        }

        let i = 0;
        for(const element of thisArg){
            if(callbackFn(element, i, thisArg)){
                return true;
            }
            i++;
        }
        return false;
    }

    /** 
     * Check if every element matches a condition in the Set.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the return value is true or false.
     * @param {SimilaritySet?} thisArg An optional argument to provide a different Set.
     * @returns {boolean} If every element matches the conditions return.
     */
    every(callbackFn, thisArg = null){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.every: callback was not typeof function");
        }

        const ctx = thisArg instanceof SimilaritySet ? thisArg : this;

        let i = 0;
        for(const element of ctx){
            if(!callbackFn(element, i, ctx)){
                return false;
            }
            i++;
        }
        return true;
    }

    /** 
     * Check if every element matches a condition in the Set.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the return value is true or false.
     * @param {SimilaritySet} thisArg A required argument to provide the Set.
     * @returns {boolean} If every element matches the conditions return.
     */
    static every(callbackFn, thisArg){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.every: callback was not typeof function");
        }

        if(!(thisArg instanceof SimilaritySet)){
            throw new Error("SimilaritySet.every: thisArg was not instanceof SimilaritySet");
        }

        let i = 0;
        for(const element of thisArg){
            if(!callbackFn(element, i, thisArg)){
                return false;
            }
            i++;
        }
        return true;
    }

    /** 
     * Filter the elements in the Set by a condition.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the element should be filtered or not.
     * @param {SimilaritySet?} thisArg An optional argument to provide a different Set.
     * @returns {SimilaritySet} Returns the new filtered set.
     */
    filter(callbackFn, thisArg = null){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.filter: callback was not typeof function");
        }

        const ctx = thisArg instanceof SimilaritySet ? thisArg : this;

        const set = new SimilaritySet();
        let i = 0;
        for(const element of ctx){
            if(callbackFn(element, i, ctx)){
                set.add(element);
            }
            i++;
        }
        return set;
    }

    /** 
     * Filter the elements in the Set by a condition.
     * @param {function(any, number, SimilaritySet): boolean} callbackFn The condition to check if the element should be filtered or not.
     * @param {SimilaritySet} thisArg A required argument to provide the Set.
     * @returns {SimilaritySet} Returns the new filtered set.
     */
    static filter(callbackFn, thisArg){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.filter: callback was not typeof function");
        }

        if(!(thisArg instanceof SimilaritySet)){
            throw new Error("SimilaritySet.filter: thisArg was not instanceof SimilaritySet");
        }

        const set = new SimilaritySet();
        let i = 0;
        for(const element of thisArg){
            if(callbackFn(element, i, thisArg)){
                set.add(element);
            }
            i++;
        }
        return set;
    }

    /**
     * Reduce the elements in the Set by an accumulation function.
     * @param {function(any, any): any} callbackFn The accumulation argument, passes the accumulated value and the current element.
     * @param {any} initialValue The initial value to accumulate on.
     * @returns {any} The result.
     */
    reduce(callbackFn, initialValue = 0){
        let ret = initialValue;
        for(const element of this){
            ret = callbackFn(ret, element);
        }
        return ret;
    }

    /**
     * Stringify the SimilaritySet.
     * @returns {string} The stringified SimilaritySet.
     */
    toString(){
        let values = [];
        for(const item of this){
            switch(typeof item){
                case "string": values.push(`"${item}"`); break;
                case "number": values.push(`${item}`); break;
            }
        }
        return `SimilaritySet(${this.size}) {${values.join(", ")}}`;
    }

    /**
     * Converts the SimilaritySet to an array that can be used by JSON.stringify.
     * @returns {Array} The converted array of SimilaritySet.
     */
    toJSON(){
        return Array.from(this);
    }

    /**
     * Parse JSON or object into a SimilaritySet
     * @param {string|Object} jsonString The stringified JSON or raw array object
     * @param {boolean} clearFirst If you want the array to be cleared of all elements before parsing. Default is false.
     * @returns {SimilaritySet} The reference to the SimilaritySet.
     */
    fromJSON(jsonString, clearFirst = false){
        if(typeof jsonString !== "string" && typeof jsonString !== "object"){
            throw new Error("SimilaritySet.fromJSON: jsonString was not typeof string or object.")
        }

        try {
            const object = typeof jsonString === "string" ? JSON.parse(jsonString) : jsonString;
            if(!Array.isArray(object)){
                throw new Error("SimilaritySet.fromJSON: parsed JSOB was not typeof array");
            }

            if(clearFirst){
                this.clear();
            }

            for(const item of object){
                this.add(item);
            }
        } catch(err) {
            // a bit silly to catch and then throw but i want a SimilaritySet specific error message to be thrown.
            throw new Error(`SimilaritySet.fromJSON: ${err.message ? err.message : err.toString()}`);
        }

        return this;
    }

    /** 
     * Iterate each element in the Set.
     * @param {function(any, any, SimilaritySet): any} callbackFn The function to be called on each element.
     * @param {SimilaritySet?} thisArg An optional argument to provide a different Set.
     */
    forEach(callbackFn, thisArg = null){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.forEach: callback was not typeof function");
        }

        const ctx = thisArg instanceof SimilaritySet ? thisArg : this;
        for(const element of ctx){
            if(callbackFn(element, element, ctx) === true){
                break;
            }
        }
    }

    /** 
     * Iterate each element in the Set (Static).
     * @param {function(any, any, SimilaritySet): any} callbackFn The function to be called on each element.
     * @param {SimilaritySet} thisArg A required argument to provide the Set.
     */
    static forEach(callbackFn, thisArg){
        if(typeof callbackFn !== "function"){
            throw new Error("SimilaritySet.forEach: callback was not typeof function");
        }

        if(!(thisArg instanceof SimilaritySet)){
            throw new Error("SimilaritySet.forEach: thisArg was not instanceof SimilaritySet");
        }

        for(const element of thisArg){
            if(callbackFn(element, element, thisArg) === true){
                break;
            }
        }
    }

    /** 
     * Compares two strings similarities via different algorithms.
     * 
     * `dice`: Well-suited for comparing small documents or messages and returns fine-tuned results, however it will take longer to calculate on average.
     * 
     * `levenshtein`: Well-suited for fuzzy string matching and can be very flexibile and efficient for large strings.
     * 
     * `jaccard`: Well-suited multi-word strings or other sets. Can be useful for comparing sets of tags.
     * 
     * @param {string|Set} haystack The subject string.
     * @param {string|Set} needle The string to be comparing to the subject.
     * @param {"dice" | "levenshtein" | "jaccard"} algorithm The algorithm to use.
     * @returns {number} The result which depends on the algorithm used.
     */
    static compareString(haystack, needle, algorithm = "dice"){
        switch(algorithm){
            // handle dice's coefficient
            case "dice": {
                if(haystack instanceof Set){
                    haystack = Array.from(haystack).join("");
                }

                if(needle instanceof Set){
                    needle = Array.from(needle).join("");
                }

                haystack = haystack.replace(/\s+/g, "");
                needle = needle.replace(/\s+/g, "");

                if(haystack === needle){
                    return 1.0;
                }

                if(haystack.length < 2 || needle.length < 2){
                    return 0.0;
                }

                let haystackBigrams = new Map();
                for(let i = 0; i < haystack.length - 1; i++){
                    const bigram = haystack.substring(i, i + 2);
                    const count = haystackBigrams.has(bigram)
                        ? haystackBigrams.get(bigram) + 1
                        : 1;
                    
                    haystackBigrams.set(bigram, count);
                }

                let intersectionSize = 0;
                for(let i = 0; i < needle.length - 1; i++){
                    const bigram = needle.substring(i, i + 2);
                    const count = haystackBigrams.has(bigram)
                        ? haystackBigrams.get(bigram)
                        : 0;

                    if(count > 0){
                        haystackBigrams.set(bigram, count - 1);
                        intersectionSize++;
                    }
                }

                return (2.0 * intersectionSize) / (haystack.length + needle.length - 2);
            } break;

            // handle levenshtein distance
            case "levenshtein": {
                if(haystack instanceof Set){
                    haystack = Array.from(haystack).join("");
                }

                if(needle instanceof Set){
                    needle = Array.from(needle).join("");
                }

                const distances = [];
                for(let i = 0; i <= haystack.length; i++){
                    distances[i] = [i];
                }

                for(let j = 0; j <= needle.length; j++){
                    distances[0][j] = j;
                }

                for(let i = 1; i <= haystack.length; i++){
                    for(let j = 1; j <= needle.length; j++){
                        const cost = haystack[i - 1] === needle[j - 1] ? 0 : 1;
                        distances[i][j] = Math.min(
                            distances[i - 1][j] + 1,
                            distances[i][j - 1] + 1,
                            distances[i - 1][j - 1] + cost
                        );
                    }
                }

                return distances[haystack.length][needle.length];
            } break;

            // handle jaccard index
            case "jaccard": {
                const haystackSet = haystack instanceof Set ? haystack : new Set(haystack.split(/\s+/));
                const needleSet = needle instanceof Set ? needle : new Set(needle.split(/\s+/));

                const intersection = new Set([...haystackSet].filter(string => needleSet.has(string)));
                const union = new Set([...haystackSet, ...needleSet]);

                return intersection.size / union.size;
            } break;
        }

        return 0.0;
    }

    /** 
     * Compare multiple strings to a haystack for similarity scoring.
     * 
     * `dice`: Well-suited for comparing small documents or messages and returns fine-tuned results, however it will take longer to calculate on average.
     * 
     * `levenshtein`: Well-suited for fuzzy string matching and can be very flexibile and efficient for large strings.
     * 
     * `jaccard`: Well-suited multi-word strings or other sets. Can be useful for comparing sets of tags.
     * 
     * @param {string} haystack The subject string.
     * @param {string[]} needles The strings to be comparing to the subject.
     * @param {"dice" | "levenshtein" | "jaccard"} algorithm The algorithm to use.
     * @returns {{ratings: Array, bestMatch: Object, bestMatchIndex: number}} An object containing all of the ratings, and the best match and its index.
     */
    static compareStrings(haystack, needles, algorithm = "dice"){
        if(typeof haystack !== "string" || !Array.isArray(needles) || needles.length === 0 || !needles.every(needle => typeof needle === "string")){
            return { ratings: [], bestMatch: null, bestMatchIndex: -1 };
        }

        const ratings = [];
        let bestMatchIndex = 0;

        for(let i = 0; i < needles.length; i++){
            const currentNeedle = needles[i];
            const currentRating = SimilaritySet.compareString(haystack, currentNeedle, algorithm);
            ratings.push({ target: currentNeedle, rating: currentRating });
            switch(algorithm){
                // dice's coefficient and jaccard index is bigger = stronger match
                case "dice": case "jaccard": {
                    if(currentRating > ratings[bestMatchIndex].rating){
                        bestMatchIndex = i;
                    }
                } break;

                // levenshtein distance is smaller = stronger match
                case "levenshtein": {
                    if(currentRating < ratings[bestMatchIndex].rating){
                        bestMatchIndex = i;
                    }
                } break;
            }
        }

        return {
            ratings: ratings,
            bestMatch: ratings[bestMatchIndex],
            bestMatchIndex: bestMatchIndex
        };
    }
}

module.exports = {
    SimilaritySet: SimilaritySet,
    compareString: SimilaritySet.compareString,
    compareStrings: SimilaritySet.compareStrings
}