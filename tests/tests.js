const { SimilaritySet, compareString, compareStrings } = require("../index");

const messages = new SimilaritySet();
messages.add("hello how are you");
messages.add("i am doing well thank you");
messages.add("what are you up to today?");
messages.add("nothing much, just chilling");

const tests = {
    "SimilaritySet.hasSimilar dice 0.80": () => {
        console.log(messages.hasSimilar("hello how are", 0.80));
    },
    "SimilaritySet.getSimilar dice": () => {
        console.log(messages.getSimilar("hello how are"));
    },
    "SimilaritySet.some non-static": () => {
        if(messages.some(message => message.includes("hello"))){
            console.log("some elements in the set have 'hello'");
        } else {
            console.log("no elements in the set have 'hello'");
        }
    },
    "SimilaritySet.some static": () => {
        if(SimilaritySet.some(message => message.includes("hello"), messages)){
            console.log("some elements in the set have 'hello'");
        } else {
            console.log("no elements in the set have 'hello'");
        }
    },
    "SimilaritySet.every non-static": () => {
        if(messages.every(message => typeof message === "string")){
            console.log("every element in the set is a string");
        } else {
            console.log("one or more of the elements in the set are not a string");
        }
    },
    "SimilaritySet.every static": () => {
        if(SimilaritySet.every(message => typeof message === "string", messages)){
            console.log("every element in the set is a string");
        } else {
            console.log("one or more of the elements in the set are not a string");
        }
    },
    "SimilaritySet.filter non-static": () => {
        console.log(messages.filter((message) => message.includes("hello")));
    },
    "SimilaritySet.filter static": () => {
        console.log(SimilaritySet.filter(message => message.includes("hello"), messages));
    },
    "SimilaritySet.reduce non-static": () => {
        const allMessages = messages.reduce((accumulator, currentValue) => {
            accumulator.push(currentValue);
            return accumulator;
        }, []).join("\n");
        console.log(allMessages);
    },
    "SimilaritySet.toString": () => {
        console.log(messages.toString());
    },
    "SimilaritySet.toJSON": () => {
        console.log(JSON.stringify(messages));
    },
    "SimilaritySet.fromJSON": () => {
        const json = JSON.stringify(messages);
        const newSet = new SimilaritySet();
        console.log(newSet.fromJSON(json));
    },
    "SimilaritySet.forEach non-static": () => {
        // on the normal set for some reason value and key are the exact same so keep that functionality ig
        messages.forEach((value, key, instance) => {
            console.log(instance instanceof SimilaritySet);
            console.log(value, key);
        });
    },
    "SimilaritySet.forEach static": () => {
        // on the normal set for some reason value and key are the exact same so keep that functionality ig
        SimilaritySet.forEach((value, key, instance) => {
            console.log(instance instanceof SimilaritySet);
            console.log(value, key);
        }, messages);
    },
    "SimilaritySet.compareString": () => {
        console.log(compareString("hello how are you", "hello how are yo"));
    },
    "SimilaritySet.compareStrings": () => {
        console.log(compareStrings("hello how are you", [
            "hello how are yo",
            "hello sir",
            "hello how are you doing",
            "goodbye gtg to sleep"
        ]));
    }
}

for(const [name, func] of Object.entries(tests)){
    console.time(name);
    func();
    console.timeEnd(name);
    console.log("");
}

console.log(compareString("hello how are you", "hello, how are you"));