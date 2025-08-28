import { WordEntries } from "../components/data-provider";

async function getWaniKaniAssignmentLists(apikey: string) {
    let queryParams = "?started=true&subject_types=kana_vocabulary,vocabulary";
    let result = await fetch(`https://api.wanikani.com/v2/assignments${queryParams}`, {
        headers: {
            "Authorization": `Bearer ${apikey}`,
            "Wanikani-Revision": "20170710"
        }
    });
    console.log(result);
    let json = await result.json();
    console.log(json);
    let ids = (json.data as Array<any>).map((entry) => entry.data.subject_id);
    console.log(ids);
    return ids;
}

async function getWaniKaniSubjectDataFromIds(apikey: string, assignmentIds: Array<String>) {
    let subjectDataResult: WordEntries = {};
    for (let idx = 0; idx < assignmentIds.length; idx += 1000) {
        let idListString = assignmentIds
            .slice(idx, Math.min(idx + 1000, assignmentIds.length))
            .join(',');
        let queryParams = `?ids=${idListString}`;
        let result = await fetch(`https://api.wanikani.com/v2/subjects${queryParams}`, {
            headers: {
                "Authorization": `Bearer ${apikey}`,
                "Wanikani-Revision": "20170710"
            }
        });
        console.log(result);
        let json = await result.json();
        console.log(json);
        for (let entry of json.data) {
            let engStr: string = entry.data.meanings[0].meaning.toLowerCase();
            let data = {
                kana: entry.data.characters
            };
            subjectDataResult[engStr] = data;
        }
    }
    console.log(subjectDataResult);
    return subjectDataResult;
}

async function getWaniKaniData() : Promise<WordEntries> {
    try {
        let apikeyresult = await chrome.storage.sync.get(["wanikaniApiKey"]);
        let apikey = apikeyresult.wanikaniApiKey;
        
        let assignmentIds = await getWaniKaniAssignmentLists(apikey);
        let subjectData = await getWaniKaniSubjectDataFromIds(apikey, assignmentIds);
        return subjectData;
    } catch (err) {
        console.error(err);
        return {};
    }
}

export default getWaniKaniData