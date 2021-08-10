export const wikiVoyageQuery =
  "https://en.wikivoyage.org/w/api.php?action=query&origin=*&format=json&prop=extracts%7Cinfo&exintro=1&explaintext=2&inprop=url&formatversion=2&titles=";

export const wikipediaImgQuery =
  "https://commons.wikimedia.org/w/rest.php/v1/file/File:STATENAME_in_United_States.svg";

export const wikidataQuery =
  "https://www.wikidata.org/w/api.php?action=wbgetclaims&format=json&entity=ENTITYID&formatversion=2&origin=*";

export const headers = {
  headers: {
    "Api-User-Agent": "License_Plate_Game/0.1 (zmcnulty980@gmail.com) Vue/2.x",
  },
};
